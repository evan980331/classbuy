"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function restockProduct(productId: string, quantity: number, unitCost: number) {
  if (quantity <= 0 || unitCost < 0) throw new Error("數量與成本需為正數");
  const totalCost = quantity * unitCost;
  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity }, cost: unitCost },
    });
    await tx.restockLog.create({ data: { productId, quantity, unitCost, totalCost } });
  });
  revalidatePath("/admin/restock");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function restockAction(prevState: any, formData: FormData) {
  try {
    const productId = String(formData.get("productId") || "");
    const quantity = Number(formData.get("quantity"));
    const unitCost = Number(formData.get("unitCost"));
    if (!productId) throw new Error("請選擇商品");
    await restockProduct(productId, quantity, unitCost);
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getRestockLogs() {
  return prisma.restockLog.findMany({ include: { product: true }, orderBy: { createdAt: "desc" }, take: 100 });
}
