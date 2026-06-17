import Link from "next/link";
import Image from "next/image";
import { product } from "@/lib/product";

export default function PolicyPage({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen bg-paper px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm">
        <Link href="/" className="inline-flex items-center gap-3 font-black">
          <span className="relative h-10 w-10 overflow-hidden rounded-md bg-white">
            <Image src={product.logo} alt="Nepkicks logo" fill sizes="40px" className="object-contain" />
          </span>
          {product.brandName}
        </Link>
        <h1 className="mt-8 text-4xl font-black">{title}</h1>
        <p className="mt-5 leading-7 text-ink/75">{body}</p>
        <p className="mt-6 leading-7 text-ink/75">For help, email {product.businessEmail} or WhatsApp {product.whatsapp}.</p>
      </div>
    </main>
  );
}
