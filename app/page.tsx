import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QuickOrder from "./quick-order";

export const dynamic = "force-dynamic";

export default async function Home() {
  const userId = cookies().get("user_auth")?.value;
  if (!userId) redirect("/login");
  const [products, user] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);
  if (!user) redirect("/login");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">班級小賣部</h1>
        <p className="text-sm text-muted-foreground">目錄在左，結帳區在右側邊緣</p>
      </div>
      <QuickOrder products={products} currentUser={user} />
    </div>
  );
}
