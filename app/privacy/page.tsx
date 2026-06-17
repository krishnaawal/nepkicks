import PolicyPage from "@/components/PolicyPage";
import { product } from "@/lib/product";

export const metadata = { title: "Privacy Policy | Nepkicks" };

export default function PrivacyPage() {
  return <PolicyPage title="Privacy Policy" body={product.policies.privacy} />;
}
