"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsersWithSeat() {
  return prisma.user.findMany({ orderBy: [{ seatNo: "asc" }, { name: "asc" }] });
}

export async function updateUserSeat(id: string, seatNo: number | null) {
  if (seatNo !== null && (seatNo < 1 || seatNo > 35 || seatNo === 9)) throw new Error("座號需為 1~35 且不可為 9");
  if (seatNo !== null) {
    const exists = await prisma.user.findUnique({ where: { seatNo } });
    if (exists && exists.id !== id) throw new Error(`座號 ${seatNo} 已被 ${exists.name} 使用`);
  }
  await prisma.user.update({ where: { id }, data: { seatNo } });
  revalidatePath("/admin/users");
  revalidatePath("/");
  revalidatePath("/checkout");
  revalidatePath("/history");
}

export async function updateUserName(id: string, name: string) {
  const n = name.trim();
  if (!n) throw new Error("姓名不可為空");
  await prisma.user.update({ where: { id }, data: { name: n } });
  revalidatePath("/admin/users");
  revalidatePath("/");
}

export async function createUser(name: string, seatNo: number | null, role: "USER" | "ADMIN" = "USER") {
  const n = name.trim();
  if (!n) throw new Error("姓名不可為空");
  if (seatNo !== null && (seatNo < 1 || seatNo > 35 || seatNo === 9)) throw new Error("座號需為 1~35 且不可為 9");
  await prisma.user.create({ data: { name: n, seatNo, role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) throw new Error("使用者不存在");
  if (u.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) throw new Error("至少需保留一個管理員");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
