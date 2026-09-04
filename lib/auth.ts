import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function findUserBySeatAndName(seatNo: number, name: string) {
  const user = await prisma.user.findUnique({ where: { seatNo } });
  if (!user) return null;
  if (user.name.trim() !== name.trim()) return null;
  return user;
}
