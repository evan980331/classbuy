import { prisma } from "@/lib/prisma";
import QuickOrder from "./quick-order";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, users] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">班級小賣部 - 商品目錄</h1>
        <p className="text-sm text-muted-foreground">卡片式瀏覽 · 庫存為 0 顯示「已售罄」並禁用購買 · 選取使用者後快速下單（DB Transaction 保障）</p>
      </div>
      <QuickOrder products={products} users={users} />
    </div>
  );
}
