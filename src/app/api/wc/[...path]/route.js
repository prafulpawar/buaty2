// ============================================================
// WooCommerce Proxy — Server-Side API Route
// Proxies browser requests to WooCommerce REST API.
// Keeps consumer keys on the server.
// ============================================================

import { NextResponse } from "next/server";

const WC_URL = process.env.WC_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

async function proxyToWooCommerce(request, { params }) {
  const { path } = await params;
  const endpoint = "/" + path.join("/");

  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const url = `${WC_URL}/wp-json/wc/v3${endpoint}${qs ? `?${qs}` : ""}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`,
  };

  const fetchOptions = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      const body = await request.text();
      if (body) fetchOptions.body = body;
    } catch {
      // No body
    }
  }

  try {
    const res = await fetch(url, fetchOptions);
    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "WooCommerce API request failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  return proxyToWooCommerce(request, context);
}

export async function POST(request, context) {
  return proxyToWooCommerce(request, context);
}

export async function PUT(request, context) {
  return proxyToWooCommerce(request, context);
}
