import ProductsManagement from "@/features/products/components/products-management";

export const metadata = {
  title: "Amazon Products | Dejumblefy Admin Panel",
  description: "Manage Amazon affiliate products, link health status, and AI room tags.",
};

export default function ProductsPage() {
  return <ProductsManagement />;
}
