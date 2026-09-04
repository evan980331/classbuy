import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HistoryClient from "./history-client";
export const dynamic = "force-dynamic";
export default async function HistoryPage() {
  const userId = cookies().get("user_auth")?.value;
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");
  const where = user.role === "ADMIN" ? {} : { userId };
  const orders = await prisma.order.findMany({ where, include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: "desc" } });
  const totalSpent = user.role === "ADMIN" ? orders.reduce((s,o)=>s+o.totalAmount,0) : orders.reduce((s,o)=>s+o.totalAmount,0);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{user.role === "ADMIN" ? "所有購買紀錄" : "我的購買紀錄"}</h1>
      <HistoryClient orders={orders} totalSpent={totalSpent} isAdmin={user.role==="ADMIN"} currentUser={user} />
    </div>
  );
}
