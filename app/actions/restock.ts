"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function restockProduct(productId: string, quantity: number, unitCost: number) {
  if (!productId) throw new Error("請選擇商品");
  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("進貨數量需大於 0");
  if (!Number.isFinite(unitCost) || unitCost < 0) throw new Error("單價成本需為非負數");
  const totalCost = quantity * unitCost;
  try {
    await prisma.$transaction(async (tx) => {
      const p = await tx.product.findUnique({ where: { id: productId } });
      if (!p) throw new Error("商品不存在");
      await tx.product.update({ where: { id: productId }, data: { stock: { increment: quantity }, cost: unitCost } });
      await tx.restockLog.create({ data: { productId, quantity, unitCost, totalCost } });
    });
    revalidatePath("/admin/restock");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true as const };
  } catch (e: any) {
    throw new Error(e.message || "進貨失敗");
  }
}

export async function restockAction(_prev: any, formData: FormData) {
  try {
    const productId = String(formData.get("productId") || "");
    const quantity = Number(formData.get("quantity"));
    const unitCost = Number(formData.get("unitCost"));
    await restockProduct(productId, quantity, unitCost);
    return { success: true as const, error: null };
  } catch (e: any) {
    return { success: false as const, error: e.message };
  }
}

export async function getRestockLogs() {
  return prisma.restockLog.findMany({ include: { product: true }, orderBy: { createdAt: "desc" }, take: 100 });
}
