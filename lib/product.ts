export const product = {
  brandName: "Nepkicks",
  whatsapp: "9869285947",
  businessEmail: "unickbane@gmail.com",
  logo: "/images/nepkicks-logo.png",
  favicon: "/favicon.png",
  name: "Brilliant Shoes",
  tagline: "Sharp style, soft comfort, every single day.",
  description:
    "Brilliant Shoes are built for daily wear with soft cushioning, a breathable feel, tough leather, strong stitching, and a clean timeless profile that works for office days, occasions, and everyday city movement.",
  regularPrice: 3500,
  salePrice: 3500,
  currency: "Rs.",
  deliveryCharge: 0,
  codAvailable: true,
  material: "Premium finished leather upper, cushioned foam insole, breathable lining, reinforced stitching, and durable anti-slip outsole.",
  weight: "Approx. 850 g per pair, depending on size.",
  origin: "Nepal",
  stockQuantity: 48,
  sizes: ["39", "40", "41", "42", "43", "44"],
  colors: [
    { name: "Black", value: "#111111", image: "/images/brilliant-shoes-black.jpg" },
    { name: "White", value: "#f3f1ea", image: "/images/brilliant-shoes-white.jpg" }
  ],
  images: [
    { src: "/images/brilliant-shoes-black.jpg", alt: "Brilliant Shoes in black" },
    { src: "/images/brilliant-shoes-white.jpg", alt: "Brilliant Shoes in white" }
  ],
  features: [
    { title: "All-Day Cushioning", description: "Soft underfoot support keeps every step easy from morning to night." },
    { title: "Breathable Comfort", description: "A smooth inner lining helps reduce heat build-up during long wear." },
    { title: "Strong Build", description: "Tough leather and reinforced stitching are made for regular use." },
    { title: "Timeless Look", description: "A sleek shape pairs cleanly with smart casual and formal outfits." }
  ],
  benefits: [
    "Comfortable for office, college, travel, and daily errands.",
    "Easy to style with trousers, jeans, chinos, and occasion wear.",
    "Durable finish designed to handle repeat wear.",
    "Available in classic black and clean white."
  ],
  specifications: [
    ["Product", "Brilliant Shoes"],
    ["Brand", "Nepkicks"],
    ["Material", "Premium finished leather"],
    ["Insole", "Soft cushioned foam"],
    ["Outsole", "Durable anti-slip sole"],
    ["Closure", "Lace-up"],
    ["Available Sizes", "39, 40, 41, 42, 43, 44"],
    ["Available Colors", "Black, White"],
    ["Delivery", "Free delivery across Nepal"],
    ["Payment", "Cash on delivery available"]
  ],
  reviews: [
    { name: "Aayush K.", rating: 5, text: "Comfortable from the first wear. The black pair looks polished enough for work and still feels easy for daily walking." },
    { name: "Suman R.", rating: 5, text: "The stitching feels strong and the shape is clean. Good value for the price." },
    { name: "Prabin M.", rating: 4, text: "Ordered white in size 42. Delivery was smooth and the shoes matched the photos." }
  ],
  faqs: [
    ["Is cash on delivery available?", "Yes. Cash on delivery is available for Brilliant Shoes orders."],
    ["Is delivery free?", "Yes. Delivery is free, so the product total is the final amount you pay."],
    ["Which sizes are available?", "Sizes 39, 40, 41, 42, 43, and 44 are available while stock lasts."],
    ["Can I exchange the size?", "Yes. Size exchange is available if the shoes are unused and returned with original packaging."],
    ["How do I order?", "Choose your size, color, and quantity, then tap Buy Now and submit your delivery details."]
  ],
  policies: {
    shipping:
      "Nepkicks provides free delivery for Brilliant Shoes orders. Orders are confirmed by phone or email and processed as quickly as possible. Delivery time may vary by location, road access, and courier availability.",
    return:
      "Returns are accepted for manufacturing defects or incorrect items. The product must be unused, clean, and returned with original packaging. Return requests should be made within 7 days of delivery.",
    exchange:
      "Size or color exchange is available within 7 days of delivery if stock is available. The shoes must be unused, undamaged, and returned with original packaging.",
    privacy:
      "Nepkicks uses customer information only to confirm orders, arrange delivery, provide support, and maintain order records. Customer details are not sold or shared for unrelated marketing."
  }
} as const;

export type ProductColor = (typeof product.colors)[number]["name"];
export type ProductSize = (typeof product.sizes)[number];

export function formatMoney(amount: number) {
  return `${product.currency} ${amount.toLocaleString("en-IN")}`;
}
