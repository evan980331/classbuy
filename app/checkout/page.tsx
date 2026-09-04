import { prisma } from "@/lib/prisma";
import CheckoutClient from "./checkout-client";
export const dynamic = "force-dynamic";
export default async function CheckoutPage() {
  const [products, users] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: [{ seatNo: "asc" }, { name: "asc" }] }),
  ]);
  return <CheckoutClient products={products} users={users} />;
}
