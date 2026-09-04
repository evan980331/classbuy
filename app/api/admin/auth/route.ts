import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  const expected = process.env.ADMIN_SECRET || "classroom123";
  if (secret !== expected) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "1", { httpOnly: true, maxAge: 60*60*12, path: "/" });
  return res;
}
