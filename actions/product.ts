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
  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price"));
  const cost = Number(formData.get("cost"));
  const stock = Number(formData.get("stock") || 0);
  const imageUrl = String(formData.get("imageUrl") || "") || null;
  if (!name || !price || !cost) throw new Error("缺少必填欄位");
  await prisma.product.create({ data: { name, price, cost, stock, imageUrl } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const data: any = {};
  if (formData.get("name")) data.name = String(formData.get("name"));
  if (formData.get("price")) data.price = Number(formData.get("price"));
  if (formData.get("cost")) data.cost = Number(formData.get("cost"));
  if (formData.get("stock") !== null) {
    const s = formData.get("stock");
    if (s !== null && s !== "") data.stock = Number(s);
  }
  if (formData.get("imageUrl") !== null) data.imageUrl = String(formData.get("imageUrl") || "") || null;
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string) {
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) throw new Error("Product not found");
  await prisma.product.update({ where: { id }, data: { isActive: !p.isActive } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function adjustStock(id: string, stock: number) {
  if (stock < 0) throw new Error("庫存不可為負");
  await prisma.product.update({ where: { id }, data: { stock } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}
