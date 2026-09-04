import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const id = req.cookies.get("user_auth")?.value;
  if (!id) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, seatNo: true, role: true } });
  return NextResponse.json({ user });
}
