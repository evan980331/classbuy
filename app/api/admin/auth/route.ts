import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const raw = String(body.secret ?? body.pin ?? "");
  const secret = raw.trim();
  const expected = String(process.env.ADMIN_PIN || "1234").trim();
  const fallback = String(process.env.ADMIN_SECRET || "classroom123").trim();
  // 預設 1234 永遠有效，避免環境變數未同步時無法登入
  const ok = secret === expected || secret === fallback || secret === "1234";
  if (!ok) return NextResponse.json({ error: "unauthorized", expectedSet: !!process.env.ADMIN_PIN }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", "1", { httpOnly: true, maxAge: 60*60*12, path: "/", sameSite: "lax" });
  return res;
}

export async function GET() {
  // 供除錯：不洩露密碼，只回是否已設定
  const hasPin = !!process.env.ADMIN_PIN;
  const hasSecret = !!process.env.ADMIN_SECRET;
  return NextResponse.json({ hasPin, hasSecret });
}
