"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingCart, History, LayoutDashboard, Package, Truck, Store } from "lucide-react";

const links = [
  { href: "/", label: "商品", icon: Store },
  { href: "/checkout", label: "結帳", icon: ShoppingCart },
  { href: "/history", label: "紀錄", icon: History },
  { href: "/admin/dashboard", label: "財務看板", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/restock", label: "進貨", icon: Truck },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          <span className="bg-primary text-white rounded-md px-2 py-1 text-sm">POS</span> 班級小賣部
        </Link>
        <nav className="flex gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={cn("px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5", active ? "bg-primary text-white" : "hover:bg-muted")}>
                <l.icon size={16} /> {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
