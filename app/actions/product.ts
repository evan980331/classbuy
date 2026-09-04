"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts(activeOnly = false) {
  return prisma.product.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(formData: FormData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const price = Number(formData.get("price"));
    const cost = Number(formData.get("cost"));
    const stock = Number(formData.get("stock") || 0);
    const imageUrl = String(formData.get("imageUrl") || "") || null;
    if (!name) throw new Error("請輸入商品名稱");
    if (!Number.isFinite(price) || price <= 0) throw new Error("售價需大於 0");
    if (!Number.isFinite(cost) || cost < 0) throw new Error("成本需為非負數");
    if (stock < 0) throw new Error("庫存不可為負");
    await prisma.product.create({ data: { name, price, cost, stock, imageUrl } });
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true as const };
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const data: any = {};
    if (formData.get("name")) data.name = String(formData.get("name"));
    if (formData.get("price")) data.price = Number(formData.get("price"));
    if (formData.get("cost")) data.cost = Number(formData.get("cost"));
    const s = formData.get("stock");
    if (s !== null && s !== "") data.stock = Number(s);
    if (formData.get("imageUrl") !== null) data.imageUrl = String(formData.get("imageUrl") || "") || null;
    await prisma.product.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/admin/products");
  } catch (e: any) {
    throw new Error(e.message);
  }
}

/**
 * toggleProductStatus - 規格要求名稱，切換 isActive
 */
export async function toggleProductStatus(id: string) {
  try {
    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) throw new Error("商品不存在");
    await prisma.product.update({ where: { id }, data: { isActive: !p.isActive } });
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true as const, isActive: !p.isActive };
  } catch (e: any) {
    throw new Error(e.message);
  }
}
// 相容舊名稱
export const toggleProductActive = toggleProductStatus;

export async function adjustStock(id: string, stock: number) {
  if (stock < 0) throw new Error("庫存不可為負");
  await prisma.product.update({ where: { id }, data: { stock } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}
