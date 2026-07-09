import "./globals.css";

export const metadata = {
  title: "GLAMOUR Beauty | Premium Skincare, Makeup & Fragrance",
  description: "Discover premium beauty products — skincare, makeup, fragrance & more. Shop the latest trends from top brands with free shipping on orders.",
  keywords: "beauty, skincare, makeup, fragrance, cosmetics, premium beauty",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
