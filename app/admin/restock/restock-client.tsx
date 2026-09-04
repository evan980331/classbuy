"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { restockProduct } from "@/app/actions/restock";
import { useRouter } from "next/navigation";

export default function RestockClient({ products, logs }: any) {
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(10);
  const [cost, setCost] = useState(10);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const submit = () => {
    start(async () => {
      try {
        await restockProduct(productId, Number(qty), Number(cost));
        setMsg("進貨成功");
        router.refresh();
      } catch (e: any) { setMsg(e.message); }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">進貨管理</h1>
      <Card><CardHeader><CardTitle>新增進貨</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>商品</Label><Select value={productId} onChange={e=>setProductId(e.target.value)}>{products.map((p:any)=><option key={p.id} value={p.id}>{p.name} (庫存 {p.stock} / 成本 {p.cost})</option>)}</Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>數量</Label><Input type="number" value={qty} onChange={e=>setQty(Number(e.target.value))} /></div>
            <div><Label>單件成本</Label><Input type="number" value={cost} onChange={e=>setCost(Number(e.target.value))} /></div>
          </div>
          <div className="text-sm text-muted-foreground">總成本: NT$ {Number(qty)*Number(cost)}</div>
          {msg && <div className="text-sm p-2 bg-muted rounded">{msg}</div>}
          <Button onClick={submit} disabled={pending}>{pending?"處理中...":"確認進貨"}</Button>
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>最近進貨紀錄</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {logs.map((l:any)=><div key={l.id} className="flex justify-between border-b py-1"><span>{new Date(l.createdAt).toLocaleString("zh-TW")} - {l.product.name} × {l.quantity} @ {l.unitCost}</span><span>NT$ {l.totalCost}</span></div>)}
        </CardContent>
      </Card>
    </div>
  );
}
