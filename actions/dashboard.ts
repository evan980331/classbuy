"use server";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [orderAgg, restockAgg, orderItems] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true }, _count: true }),
    prisma.restockLog.aggregate({ _sum: { totalCost: true } }),
    prisma.orderItem.findMany({ select: { quantity: true, price: true, product: { select: { cost: true } } } }),
  ]);

  const totalRevenue = orderAgg._sum.totalAmount ?? 0;
  const totalRestockCost = restockAgg._sum.totalCost ?? 0;
  const orderCount = orderAgg._count ?? 0;

  // COGS: 以 OrderItem 當下如果用 product.cost? 但 spec: 銷貨成本應以成本計算，簡化為 每筆 OrderItem 的 product.cost * quantity 的歷史? 
  // 由於 OrderItem 未存 cost，改用當前 product.cost 估算；若需精準，應在 OrderItem 加 cost 欄位。先以估算呈現。
  let cogs = 0;
  for (const oi of orderItems) {
    // 用產品當下成本估算
    cogs += (oi.product?.cost ?? 0) * oi.quantity;
  }
  const grossProfit = totalRevenue - cogs;
  const profitMargin = totalRevenue ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  return { totalRevenue, totalRestockCost, cogs, grossProfit, profitMargin, orderCount };
}
