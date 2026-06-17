import type { Metadata } from "next";
import { product } from "@/lib/product";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${product.name} by ${product.brandName} | Comfortable Leather Shoes`,
  description: product.description,
  icons: {
    icon: product.favicon
  },
  openGraph: {
    title: `${product.name} by ${product.brandName}`,
    description: product.description,
    url: siteUrl,
    siteName: product.brandName,
    images: [{ url: product.images[0].src, width: 1200, height: 900, alt: product.images[0].alt }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${product.name} by ${product.brandName}`,
    description: product.description,
    images: [product.images[0].src]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
