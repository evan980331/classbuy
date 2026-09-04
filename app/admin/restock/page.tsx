import { prisma } from "@/lib/prisma";
import RestockClient from "./restock-client";
export const dynamic = "force-dynamic";
export default async function RestockPage() {
  const [products, logs] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.restockLog.findMany({ include: { product: true }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return <RestockClient products={products} logs={logs} />;
}
