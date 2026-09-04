import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { seatNo, name, password, setPassword } = await req.json();
  const seat = Number(seatNo);
  if (!seat || !name) return NextResponse.json({ error: "請輸入座號與姓名" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { seatNo: seat } });
  if (!user) return NextResponse.json({ error: "座號不存在" }, { status: 404 });
  if (user.name.trim() !== String(name).trim()) return NextResponse.json({ error: "姓名與座號不符" }, { status: 401 });

  if (!user.password) {
    if (!password && !setPassword) {
      return NextResponse.json({ needSetPassword: true });
    }
    if (password && !setPassword) {
      return NextResponse.json({ needSetPassword: true });
    }
    if (!password || String(password).length < 4) return NextResponse.json({ error: "密碼至少4字元" }, { status: 400 });
    const hash = await bcrypt.hash(String(password), 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
    const res = NextResponse.json({ ok: true, userId: user.id });
    res.cookies.set("user_auth", user.id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/", sameSite: "lax" });
    return res;
  }

  if (password === undefined && !setPassword) {
    return NextResponse.json({ needSetPassword: false, hasPassword: true });
  }
  if (!password) return NextResponse.json({ error: "請輸入密碼" }, { status: 400 });
  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });

  const res = NextResponse.json({ ok: true, userId: user.id, role: user.role });
  res.cookies.set("user_auth", user.id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/", sameSite: "lax" });
  return res;
}
