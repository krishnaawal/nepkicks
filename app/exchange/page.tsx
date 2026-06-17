import PolicyPage from "@/components/PolicyPage";
import { product } from "@/lib/product";

export const metadata = { title: "Exchange Policy | Nepkicks" };

export default function ExchangePage() {
  return <PolicyPage title="Exchange Policy" body={product.policies.exchange} />;
}
