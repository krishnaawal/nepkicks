"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Minus, PackageCheck, Phone, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Truck, X, ZoomIn } from "lucide-react";
import { formatMoney, product } from "@/lib/product";
import type { ProductColor, ProductSize } from "@/lib/product";

type FormState = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
};

const initialForm: FormState = {
  customerName: "",
  email: "",
  phone: "",
  address: ""
};

export default function LandingPage({ formattedPrice }: { formattedPrice: string }) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState<ProductSize>(product.sizes[0]);
  const [color, setColor] = useState<ProductColor>(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const selectedColor = product.colors.find((item) => item.name === color) || product.colors[0];
  const total = useMemo(() => product.salePrice * quantity + product.deliveryCharge, [quantity]);

  function showOptions() {
    document.getElementById("choose-pair")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openOrderForm() {
    setModalOpen(true);
    setMessage("");
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, size, color, quantity })
    });
    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setMessage(data.error || "Order could not be submitted. Please try again.");
      return;
    }

    setMessage(`Order confirmed. Your order ID is ${data.orderId}.`);
    setForm(initialForm);
  }

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-md bg-white">
              <Image src={product.logo} alt="Nepkicks logo" fill sizes="44px" className="object-contain p-1" priority />
            </span>
            <span className="text-lg font-black tracking-normal">{product.brandName}</span>
          </a>
          <button onClick={showOptions} className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-clay">
            <ShoppingBag size={18} /> Buy Now
          </button>
        </div>
      </header>

      <section className="bg-paper">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-white shadow-soft sm:min-h-[620px]">
            <Image src={selectedColor.image} alt={`${product.name} ${selectedColor.name}`} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" priority />
            <div className="absolute left-4 top-4 rounded-md bg-clay px-3 py-2 text-sm font-black text-white">Free Delivery</div>
          </div>
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-2 text-gold" aria-label="Rated 4.8 out of 5">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={20} fill="currentColor" />)}
              <span className="ml-2 text-sm font-bold text-ink/70">4.8 from Nepkicks customers</span>
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-normal text-ink sm:text-6xl">{product.name}</h1>
            <p className="mt-4 text-xl font-semibold text-clay">{product.tagline}</p>
            <p className="mt-5 text-base leading-7 text-ink/75">{product.description}</p>
            <div className="mt-7 flex flex-wrap items-end gap-4">
              <span className="text-4xl font-black">{formattedPrice}</span>
              <span className="rounded-md bg-moss px-3 py-2 text-sm font-black text-white">COD Available</span>
              <span className="rounded-md border border-clay px-3 py-2 text-sm font-black text-clay">Delivery charge {formatMoney(0)}</span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={showOptions} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-clay px-7 py-4 text-base font-black text-white shadow-soft transition hover:bg-ink">
                <ShoppingBag size={20} /> Buy Now
              </button>
              <a href={`https://wa.me/977${product.whatsapp}`} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-ink/20 bg-white px-7 py-4 text-base font-black transition hover:border-moss hover:text-moss">
                <Phone size={20} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="border-y border-black/10 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-black">Product Gallery</h2>
            <button onClick={() => setZoom(true)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/20 px-3 py-2 font-bold">
              <ZoomIn size={18} /> Zoom
            </button>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper">
              <Image src={product.images[activeImage].src} alt={product.images[activeImage].alt} fill sizes="(min-width: 1024px) 72vw, 100vw" className="object-cover" loading="lazy" />
              <button onClick={() => setActiveImage((activeImage + product.images.length - 1) % product.images.length)} className="focus-ring absolute left-4 top-1/2 rounded-md bg-white/90 p-2 shadow-soft" aria-label="Previous image"><ChevronLeft /></button>
              <button onClick={() => setActiveImage((activeImage + 1) % product.images.length)} className="focus-ring absolute right-4 top-1/2 rounded-md bg-white/90 p-2 shadow-soft" aria-label="Next image"><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {product.images.map((image, index) => (
                <button key={image.src} onClick={() => setActiveImage(index)} className={`focus-ring relative aspect-square overflow-hidden rounded-lg border-2 ${activeImage === index ? "border-clay" : "border-transparent"}`} aria-label={`Show ${image.alt}`}>
                  <Image src={image.src} alt={image.alt} fill sizes="180px" className="object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-black">Made For Daily Confidence</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[PackageCheck, Sparkles, ShieldCheck, Truck].map((Icon, index) => (
              <article key={product.features[index].title} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
                <Icon className="text-clay" size={28} />
                <h3 className="mt-4 text-lg font-black">{product.features[index].title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{product.features[index].description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="choose-pair" className="scroll-mt-24 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-black">Choose Your Pair</h2>
            <div className="mt-6">
              <p className="mb-3 font-black">Size</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
                {product.sizes.map((item) => (
                  <button key={item} onClick={() => setSize(item)} className={`focus-ring rounded-md border px-4 py-3 font-black ${size === item ? "border-clay bg-clay text-white" : "border-ink/20 bg-white"}`}>{item}</button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="mb-3 font-black">Color</p>
              <div className="flex gap-3">
                {product.colors.map((item) => (
                  <button key={item.name} onClick={() => setColor(item.name)} className={`focus-ring flex items-center gap-2 rounded-md border px-4 py-3 font-black ${color === item.name ? "border-clay" : "border-ink/20"}`}>
                    <span className="h-5 w-5 rounded-full border border-black/20" style={{ backgroundColor: item.value }} />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="mb-3 font-black">Quantity</p>
              <div className="inline-flex items-center overflow-hidden rounded-md border border-ink/20">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="focus-ring p-3" aria-label="Decrease quantity"><Minus /></button>
                <span className="w-14 text-center font-black">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="focus-ring p-3" aria-label="Increase quantity"><Plus /></button>
              </div>
            </div>
            <button onClick={openOrderForm} className="focus-ring mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-6 py-4 font-black text-white transition hover:bg-clay">
              <ShoppingBag /> Buy {color} Size {size}
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-black">Description</h2>
              <p className="mt-4 leading-7 text-ink/75">{product.description}</p>
              <ul className="mt-4 space-y-2">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-ink/80"><Check className="mt-0.5 shrink-0 text-moss" size={18} /> {benefit}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-3xl font-black">Specifications</h2>
              <dl className="mt-4 grid gap-2">
                {product.specifications.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[140px_1fr] gap-4 border-b border-black/10 py-3">
                    <dt className="font-black">{label}</dt>
                    <dd className="text-ink/75">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-paper py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-black">Customer Reviews</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {product.reviews.map((review) => (
              <article key={review.name} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex text-gold">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
                <p className="mt-4 leading-7 text-ink/75">{review.text}</p>
                <p className="mt-4 font-black">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InfoSections />

      <section className="bg-ink px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black">Step Into Brilliant Shoes Today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75">Classic style, all-day comfort, free delivery, and cash on delivery from Nepkicks.</p>
          <button onClick={showOptions} className="focus-ring mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-clay px-7 py-4 font-black text-white hover:bg-white hover:text-ink">
            <ShoppingBag /> Buy Now
          </button>
        </div>
      </section>

      <footer className="bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-ink/70 sm:flex-row">
          <p>© 2026 Nepkicks. Brilliant Shoes.</p>
          <div className="flex flex-wrap gap-4">
            <a href="/privacy">Privacy</a>
            <a href="/shipping">Shipping</a>
            <a href="/returns">Returns</a>
            <a href="/exchange">Exchange</a>
            <a href={`mailto:${product.businessEmail}`}>{product.businessEmail}</a>
          </div>
        </div>
      </footer>

      {zoom && (
        <div className="fixed inset-0 z-50 bg-black/85 p-4" role="dialog" aria-modal="true">
          <button onClick={() => setZoom(false)} className="focus-ring absolute right-4 top-4 rounded-md bg-white p-2" aria-label="Close zoom"><X /></button>
          <div className="relative mx-auto h-full max-w-5xl">
            <Image src={product.images[activeImage].src} alt={product.images[activeImage].alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto my-8 max-w-xl rounded-lg bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Complete Your Order</h2>
              <button onClick={() => setModalOpen(false)} className="focus-ring rounded-md p-2" aria-label="Close order form"><X /></button>
            </div>
            <div className="mt-4 rounded-md bg-paper p-4 text-sm">
              <p className="font-black">{product.name}</p>
              <p>Size {size} | {color} | Qty {quantity}</p>
              <p className="font-black">Total: {formatMoney(total)}</p>
            </div>
            <form onSubmit={submitOrder} className="mt-5 grid gap-4">
              {([
                ["customerName", "Customer Name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone Number", "tel"]
              ] as const).map(([key, label, type]) => (
                <label key={key} className="grid gap-2 font-bold">
                  {label}
                  <input className="focus-ring rounded-md border border-ink/20 px-3 py-3 font-normal" type={type} required value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
                </label>
              ))}
              <label className="grid gap-2 font-bold">
                Full Address
                <textarea className="focus-ring min-h-28 rounded-md border border-ink/20 px-3 py-3 font-normal" required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
              </label>
              <button disabled={submitting} className="focus-ring rounded-md bg-clay px-6 py-4 font-black text-white disabled:opacity-60">
                {submitting ? "Submitting..." : "Confirm COD Order"}
              </button>
              {message && <p className={`rounded-md p-3 text-sm font-bold ${message.includes("confirmed") ? "bg-moss/15 text-moss" : "bg-clay/10 text-clay"}`}>{message}</p>}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoSections() {
  const sections = [
    ["Frequently Asked Questions", product.faqs],
    ["Shipping Information", [[product.policies.shipping, "Free delivery is included with every Brilliant Shoes order."]]],
    ["Return Policy", [[product.policies.return, "Contact Nepkicks with your order ID to begin a return request."]]]
  ] as const;

  return (
    <section className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3">
        {sections.map(([title, items]) => (
          <div key={title}>
            <h2 className="text-2xl font-black">{title}</h2>
            <div className="mt-4 space-y-4">
              {items.map(([question, answer]) => (
                <details key={question} className="rounded-lg border border-black/10 p-4">
                  <summary className="font-black">{question}</summary>
                  <p className="mt-3 text-sm leading-6 text-ink/70">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
