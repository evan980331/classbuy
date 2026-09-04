"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CartItem = { productId: string; quantity: number };

export async function createOrder(userId: string, items: CartItem[]) {
  if (!userId) throw new Error("請選擇使用者");
  if (!items?.length) throw new Error("購物車為空");
  try {
    return await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: { productId: string; quantity: number; price: number }[] = [];
      for (const item of items) {
        if (item.quantity <= 0) throw new Error("數量必須大於 0");
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`商品不存在: ${item.productId}`);
        if (!product.isActive) throw new Error(`商品已下架: ${product.name}`);
        if (product.stock < item.quantity) throw new Error(`庫存不足: ${product.name} 剩餘 ${product.stock}，需求 ${item.quantity}`);
        await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: item.quantity } } });
        totalAmount += product.price * item.quantity;
        orderItemsData.push({ productId: product.id, quantity: item.quantity, price: product.price });
      }
      const order = await tx.order.create({
        data: { userId, totalAmount, items: { create: orderItemsData } },
        include: { items: true },
      });
      return order;
    });
  } catch (e: any) {
    throw new Error(e.message || "建立訂單失敗");
  }
}

export async function checkoutAction(_prev: any, formData: FormData) {
  try {
    const userId = String(formData.get("userId") || "");
    const cartJson = String(formData.get("cart") || "[]");
    const items: CartItem[] = JSON.parse(cartJson);
    const order = await createOrder(userId, items);
    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath("/checkout");
    return { success: true as const, orderId: order.id, error: null };
  } catch (e: any) {
    return { success: false as const, orderId: null, error: e.message || "結帳失敗" };
  }
}

export async function getUsers() {
  return prisma.user.findMany({ orderBy: { seatNo: "asc" } });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
}
