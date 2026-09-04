"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";

type Product = { id: string; name: string; price: number; stock: number; imageUrl: string | null };
type User = { id: string; name: string; seatNo: number | null };

export default function QuickOrder({ products, currentUser }: { products: Product[]; currentUser: User }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: string) => setCart((c) => {
    const n = (c[id] || 0) - 1;
    if (n <= 0) { const { [id]: _, ...rest } = c; return rest; }
    return { ...c, [id]: n };
  });

  const items = Object.entries(cart).map(([pid, qty]) => {
    const p = products.find((x) => x.id === pid)!;
    return { pid, qty, product: p, subtotal: p.price * qty };
  });
  const total = items.reduce((s, i) => s + i.subtotal, 0);

  const onOrder = () => {
    setMsg(null);
    if (items.length === 0) return setMsg({ type: "error", text: "請先加入商品" });
    start(async () => {
      try {
        const payload = items.map((i) => ({ productId: i.pid, quantity: i.qty }));
        const order = await createOrder(currentUser.id, payload);
        setMsg({ type: "success", text: `下單成功！訂單 ${order.id.slice(0,8)} 金額 NT$ ${order.totalAmount}` });
        setCart({});
        router.refresh();
      } catch (e: any) {
        setMsg({ type: "error", text: e.message || "下單失敗" });
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm">登入身分：<span className="font-bold">{currentUser.seatNo ? `${currentUser.seatNo}號` : ""} {currentUser.name}</span></div>
          </CardContent>
        </Card>
        {products.length===0 && <p className="text-muted-foreground text-sm">目前無上架商品</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p=> (
            <Card key={p.id} className="overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">無圖片</div>}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  {p.name}
                  {p.stock===0 ? <Badge variant="destructive">已售罄</Badge> : <Badge variant="secondary">庫存 {p.stock}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto space-y-2">
                <div className="font-bold text-primary">NT$ {p.price}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={()=>dec(p.id)} disabled={!cart[p.id]}>-</Button>
                  <span className="flex-1 text-center text-sm py-1 border rounded">{cart[p.id]||0}</span>
                  <Button size="sm" onClick={()=>add(p.id)} disabled={p.stock===0 || (cart[p.id]||0) >= p.stock}>+</Button>
                </div>
                <Button disabled={p.stock===0} className="w-full" variant={p.stock===0?"secondary":"default"} onClick={()=>{ if (!cart[p.id]) add(p.id); }}>
                  {p.stock===0 ? "已售罄" : cart[p.id] ? `已選 ${cart[p.id]}` : "加入購物車"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Card className="sticky top-16">
          <CardHeader><CardTitle className="text-base">結帳區</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.length===0 ? <p className="text-sm text-muted-foreground">尚未選購商品</p> : items.map(i=>(
              <div key={i.pid} className="flex justify-between text-sm">
                <span>{i.product.name} × {i.qty}</span><span>NT$ {i.subtotal}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold"><span>總計</span><span>NT$ {total}</span></div>
            {msg && <div className={`text-sm p-2 rounded ${msg.type==="success"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>{msg.text}</div>}
            <Button className="w-full" onClick={onOrder} disabled={pending}>{pending?"處理中...":"確認下單"}</Button>
            <p className="text-xs text-muted-foreground">下單將以目前登入身分建立訂單。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
