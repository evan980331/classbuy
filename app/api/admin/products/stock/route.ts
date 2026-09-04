import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { id, stock } = await req.json();
  if (stock < 0) return NextResponse.json({ error: "stock negative" }, { status: 400 });
  await prisma.product.update({ where: { id }, data: { stock } });
  return NextResponse.json({ ok: true });
}
