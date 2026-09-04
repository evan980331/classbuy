"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShoppingCart, History, LayoutDashboard, Package, Truck, Store, Shield, ChevronDown } from "lucide-react";

const mainLinks = [
  { href: "/", label: "商品", icon: Store },
  { href: "/checkout", label: "結帳", icon: ShoppingCart },
  { href: "/history", label: "紀錄", icon: History },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "財務看板", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/restock", label: "進貨管理", icon: Truck },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdminActive = adminLinks.some(l => pathname === l.href);

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

          {/* 管理員單一選單 */}
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
                <div className="border-t my-1" />
                <div className="px-3 py-1 text-xs text-muted-foreground">PIN 預設 1234</div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
