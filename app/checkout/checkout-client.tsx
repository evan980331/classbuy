"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createOrder } from "@/actions/order";

type Product = { id: string; name: string; price: number; stock: number };
type User = { id: string; name: string };

export default function CheckoutClient({ products, users }: { products: Product[]; users: User[] }) {
  const [userId, setUserId] = useState(users[0]?.id || "");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const onCheckout = () => {
    setMsg(null);
    if (!userId) return setMsg({ type: "error", text: "請選擇購買人" });
    if (items.length === 0) return setMsg({ type: "error", text: "購物車為空" });
    startTransition(async () => {
      try {
        const payload = items.map((i) => ({ productId: i.pid, quantity: i.qty }));
        const order = await createOrder(userId, payload);
        setMsg({ type: "success", text: `結帳成功！訂單 ${order.id} 金額 NT$ ${order.totalAmount}` });
        setCart({});
      } catch (e: any) {
        setMsg({ type: "error", text: e.message });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader><CardTitle>選擇購買人</CardTitle></CardHeader>
          <CardContent>
            <Label>姓名</Label>
            <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
            {users.length === 0 && <p className="text-sm text-destructive mt-2">尚未建立使用者，請先執行 seed</p>}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardContent className="pt-4 space-y-2">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm flex justify-between"><span className="font-bold">NT$ {p.price}</span><Badge variant={p.stock===0?"destructive":"secondary"}>{p.stock===0?"已售罄":`庫存 ${p.stock}`}</Badge></div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => dec(p.id)} disabled={!cart[p.id]}>-</Button>
                  <span className="flex-1 text-center text-sm py-1">{cart[p.id] || 0}</span>
                  <Button size="sm" onClick={() => add(p.id)} disabled={p.stock===0 || (cart[p.id]||0) >= p.stock}>+</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>購物車</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.length===0 ? <p className="text-sm text-muted-foreground">尚未選購商品</p> : items.map(i => (
              <div key={i.pid} className="flex justify-between text-sm">
                <span>{i.product.name} × {i.qty}</span><span>NT$ {i.subtotal}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold"> <span>總計</span><span>NT$ {total}</span></div>
            {msg && <div className={`text-sm p-2 rounded ${msg.type==="success"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>{msg.text}</div>}
            <Button className="w-full" onClick={onCheckout} disabled={isPending}>{isPending?"處理中...":"確認結帳"}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
