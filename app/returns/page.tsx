import PolicyPage from "@/components/PolicyPage";
import { product } from "@/lib/product";

export const metadata = { title: "Return Policy | Nepkicks" };

export default function ReturnsPage() {
  return <PolicyPage title="Return Policy" body={product.policies.return} />;
}
