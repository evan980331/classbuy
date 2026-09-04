import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const secret = body.secret ?? body.pin ?? "";
  const expected = process.env.ADMIN_PIN || process.env.ADMIN_SECRET || "1234";
  const fallback = process.env.ADMIN_SECRET || "classroom123";
  const ok = secret === expected || secret === fallback;
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "1", { httpOnly: true, maxAge: 60*60*12, path: "/" });
  return res;
}
