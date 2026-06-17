import LandingPage from "@/components/LandingPage";
import { formatMoney, product } from "@/lib/product";

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brandName },
    description: product.description,
    image: product.images.map((image) => image.src),
    material: product.material,
    color: product.colors.map((color) => color.name),
    sku: "NEPKICKS-BRILLIANT-SHOES",
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: product.salePrice,
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "NPR" }
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: product.reviews.length
    },
    review: product.reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewRating: { "@type": "Rating", ratingValue: review.rating },
      reviewBody: review.text
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <LandingPage formattedPrice={formatMoney(product.salePrice)} />
    </>
  );
}
