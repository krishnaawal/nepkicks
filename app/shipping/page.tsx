import PolicyPage from "@/components/PolicyPage";
import { product } from "@/lib/product";

export const metadata = { title: "Shipping Policy | Nepkicks" };

export default function ShippingPage() {
  return <PolicyPage title="Shipping Policy" body={product.policies.shipping} />;
}
