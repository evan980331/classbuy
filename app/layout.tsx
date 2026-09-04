import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "班級小賣部 POS",
  description: "班級微型進銷存與記帳系統",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-muted/30">
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-6xl">{children}</main>
        <footer className="text-center text-xs text-muted-foreground py-6">classroom-pos © 2026</footer>
      </body>
    </html>
  );
}
