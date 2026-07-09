// ============================================================
// WooCommerce API — Server-Side Only
// Keys are kept on the server (no NEXT_PUBLIC_ prefix).
// All browser requests go through /api/wc/* route handlers.
// ============================================================

const WC_URL = process.env.WC_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

// ─── In-Memory Server Cache ──────────────────────────────────
const cache = new Map();

function getCached(key, ttlMs) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < ttlMs) return entry.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ─── Core Fetch Helper ──────────────────────────────────────
async function wooFetch(endpoint, options = {}) {
  const url = `${WC_URL}/wp-json/wc/v3${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`,
      ...options.headers,
    },
    next: { revalidate: 300 }, // Next.js fetch cache: 5 min
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WooCommerce API error ${res.status}: ${body}`);
  }

  return res.json();
}

// ─── Products ────────────────────────────────────────────────

export async function fetchProducts({
  page = 1,
  perPage = 12,
  category = "",
  search = "",
  orderby = "date",
  order = "desc",
  onSale = false,
  featured = false,
  minPrice = "",
  maxPrice = "",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    status: "publish",
    order,
  });

  if (orderby && orderby !== "relevance") params.set("orderby", orderby);
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (onSale) params.set("on_sale", "true");
  if (featured) params.set("featured", "true");
  if (minPrice) params.set("min_price", minPrice);
  if (maxPrice) params.set("max_price", maxPrice);

  const cacheKey = `products:${params.toString()}`;

  // Skip cache for searches
  if (!search) {
    const cached = getCached(cacheKey, 3 * 60 * 1000);
    if (cached) return cached;
  }

  const data = await wooFetch(`/products?${params}`);

  if (!search) setCache(cacheKey, data);

  return data;
}

export async function fetchProduct(id) {
  if (!id) return null;
  const cacheKey = `product:${id}`;
  const cached = getCached(cacheKey, 5 * 60 * 1000);
  if (cached) return cached;

  const data = await wooFetch(`/products/${id}`);
  setCache(cacheKey, data);
  return data;
}

export async function fetchRelatedProducts(categoryId, excludeId) {
  if (!categoryId) return [];
  const products = await wooFetch(
    `/products?category=${categoryId}&per_page=5&status=publish`
  );
  return products.filter((p) => p.id !== parseInt(excludeId)).slice(0, 4);
}

export async function fetchVariations(productId) {
  if (!productId) return [];
  return wooFetch(`/products/${productId}/variations?per_page=50`);
}

export async function searchProducts(query) {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({
    search: query.trim(),
    per_page: "8",
    status: "publish",
  });
  return wooFetch(`/products?${params}`);
}

// ─── Categories ──────────────────────────────────────────────

export async function fetchCategories() {
  const cacheKey = "categories:all";
  const cached = getCached(cacheKey, 10 * 60 * 1000);
  if (cached) return cached;

  const data = await wooFetch("/products/categories?per_page=100&hide_empty=true");
  setCache(cacheKey, data);
  return data;
}

export async function fetchCategory(categoryId) {
  if (!categoryId) return null;
  return wooFetch(`/products/categories/${categoryId}`);
}

// ─── Reviews ─────────────────────────────────────────────────

export async function fetchProductReviews(productId) {
  if (!productId) return [];
  return wooFetch(
    `/products/reviews?product=${productId}&status=approved&_=${Date.now()}`
  );
}
