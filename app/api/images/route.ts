import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.productImage.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const { label, url } = await req.json();
  if (!label || !url) return NextResponse.json({ error: "缺少欄位" }, { status: 400 });
  const image = await prisma.productImage.create({ data: { label, url } });
  return NextResponse.json({ image });
}
