import { NextResponse, NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) return NextResponse.next();
  if (pathname.startsWith("/admin")) return NextResponse.next();
  const userAuth = req.cookies.get("user_auth")?.value;
  const protectedPaths = ["/checkout", "/history"];
  const needLogin = protectedPaths.some(p => pathname.startsWith(p)) || pathname === "/";
  if (needLogin && !userAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/", "/checkout/:path*", "/history/:path*"] };
