import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Home, MessageCircle, PackageCheck } from "lucide-react";
import { formatMoney, product } from "@/lib/product";

export const metadata = {
  title: "Order Confirmed | Nepkicks",
  description: "Thank you for ordering Brilliant Shoes from Nepkicks."
};

type ThankYouPageProps = {
  searchParams: Promise<{
    orderId?: string;
    total?: string;
    product?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const orderId = params.orderId || "Your order";
  const total = Number(params.total || product.salePrice);

  return (
    <main className="min-h-screen bg-paper px-4 py-8 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 text-center shadow-soft sm:p-10">
        <Link href="/" className="mx-auto inline-flex items-center justify-center gap-3 font-black">
          <span className="relative h-12 w-12 overflow-hidden rounded-md bg-white">
            <Image src={product.logo} alt="Nepkicks logo" fill sizes="48px" className="object-contain p-1" />
          </span>
          {product.brandName}
        </Link>

        <CheckCircle2 className="mx-auto mt-10 text-moss" size={64} />
        <h1 className="mt-5 text-4xl font-black">Thank You For Your Order</h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink/70">
          Your Brilliant Shoes order has been received. Nepkicks will contact you soon to confirm delivery.
        </p>

        <div className="mt-8 rounded-lg bg-paper p-5 text-left">
          <p className="text-sm font-bold text-ink/60">Order ID</p>
          <p className="mt-1 text-2xl font-black">{orderId}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-ink/60">Product</p>
              <p className="mt-1 font-black">{product.name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-ink/60">Total</p>
              <p className="mt-1 font-black">{formatMoney(total)}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/" className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-4 font-black text-white transition hover:bg-clay">
            <Home size={20} /> Back Home
          </Link>
          <a href={`https://wa.me/977${product.whatsapp}`} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ink/20 bg-white px-5 py-4 font-black transition hover:border-moss hover:text-moss">
            <MessageCircle size={20} /> WhatsApp Nepkicks
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-ink/60">
          <PackageCheck size={18} /> Cash on delivery and free delivery are available.
        </div>
      </section>
    </main>
  );
}
