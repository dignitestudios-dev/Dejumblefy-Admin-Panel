import ProductsManagement from "@/features/products/components/products-management";

export const metadata = {
  title: "Product Catalog | Dejumblefy Admin Panel",
  description: "Manage multi-retailer affiliate products, link health status, and AI room tags.",
};

export default function ProductsPage() {
  return <ProductsManagement />;
}
