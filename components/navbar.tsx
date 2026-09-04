"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { History, LayoutDashboard, Package, Truck, Store, Shield, ChevronDown, Users, LogIn, LogOut } from "lucide-react";

const mainLinks = [
  { href: "/", label: "商品目錄", icon: Store },
  { href: "/history", label: "紀錄", icon: History },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "財務看板", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/restock", label: "進貨管理", icon: Truck },
  { href: "/admin/users", label: "座號管理", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isAdminActive = adminLinks.some(l => pathname === l.href);

  useEffect(()=>{
    fetch("/api/auth/me").then(r=>r.json()).then(d=>setUser(d.user)).catch(()=>{});
  },[pathname]);

  const logout = async()=>{
    await fetch("/api/auth/logout",{method:"POST"});
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <span className="bg-primary text-white rounded-md px-2 py-1 text-sm">POS</span> 班級小賣部
        </Link>
        <nav className="flex gap-1 items-center">
          {mainLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={cn("px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5", active ? "bg-primary text-white" : "hover:bg-muted")}>
                <l.icon size={16} /> {l.label}
              </Link>
            );
          })}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              onBlur={() => setTimeout(()=>setOpen(false),150)}
              className={cn("px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 border", isAdminActive ? "bg-primary text-white border-primary" : "hover:bg-muted bg-muted/30")}
            >
              <Shield size={16} /> 管理員 <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
                {adminLinks.map(a => (
                  <Link
                    key={a.href}
                    href={a.href}
                    onClick={()=>setOpen(false)}
                    className={cn("flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted", pathname===a.href && "bg-muted font-medium")}
                  >
                    <a.icon size={16} /> {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:inline">{user.seatNo ? `${user.seatNo}號` : ""} {user.name}</span>
              <button onClick={logout} className="px-3 py-1.5 rounded-md text-sm flex items-center gap-1 border hover:bg-muted"><LogOut size={14}/> 登出</button>
            </div>
          ) : (
            <Link href="/login" className="px-3 py-1.5 rounded-md text-sm flex items-center gap-1 border hover:bg-muted"><LogIn size={14}/> 登入</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
