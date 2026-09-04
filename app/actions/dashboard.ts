"use server";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [orderAgg, restockAgg, orderItems] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true }, _count: true }),
    prisma.restockLog.aggregate({ _sum: { totalCost: true } }),
    prisma.orderItem.findMany({ select: { quantity: true, product: { select: { cost: true } } } }),
  ]);
  const totalRevenue = orderAgg._sum.totalAmount ?? 0;
  const totalRestockCost = restockAgg._sum.totalCost ?? 0;
  const orderCount = (orderAgg as any)._count ?? 0;
  let cogs = 0;
  for (const oi of orderItems) cogs += (oi.product?.cost ?? 0) * oi.quantity;
  const grossProfit = totalRevenue - cogs;
  const profitMargin = totalRevenue ? Math.round((grossProfit / totalRevenue) * 100) : 0;
  return { totalRevenue, totalRestockCost, cogs, grossProfit, profitMargin, orderCount };
}
