import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryClient from "./history-client";
export const dynamic = "force-dynamic";
export default async function HistoryPage({ searchParams }: { searchParams: { userId?: string } }) {
  const users = await prisma.user.findMany({ orderBy: [{ seatNo: "asc" }, { name: "asc" }] });
  const selectedUserId = searchParams.userId || users[0]?.id || "";
  const orders = selectedUserId
    ? await prisma.order.findMany({ where: { userId: selectedUserId }, include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: "desc" } })
    : [];
  const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">個人記帳紀錄</h1>
      <HistoryClient users={users} selectedUserId={selectedUserId} orders={orders} totalSpent={totalSpent} />
    </div>
  );
}
