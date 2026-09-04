"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createProduct, toggleProductStatus } from "@/app/actions/product";
import { useRouter } from "next/navigation";

export default function ProductsClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "", imageUrl: "" });

  const [msg, setMsg] = useState<string|null>(null);
  const onCreate = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k,v])=>fd.set(k, v));
    start(async ()=>{
      try{ await createProduct(fd); setMsg("新增成功"); setForm({ name:"", price:"", cost:"", stock:"", imageUrl:"" }); router.refresh(); }catch(e:any){ setMsg(e.message); }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">商品與庫存管理</h1>
      <Card><CardHeader><CardTitle>新增商品</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>名稱</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><Label>圖片 URL</Label><Input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} /></div>
            <div><Label>售價</Label><Input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
            <div><Label>成本</Label><Input type="number" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} /></div>
            <div><Label>初始庫存</Label><Input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} /></div>
          </div>
          {msg && <div className="text-sm p-2 bg-muted rounded">{msg}</div>}
          <Button onClick={onCreate} disabled={pending}>新增</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {products.map(p=>(
          <Card key={p.id}>
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between"><span className="font-medium">{p.name}</span>{p.isActive ? <Badge>上架</Badge> : <Badge variant="secondary">下架</Badge>}</div>
              <div className="text-sm text-muted-foreground">售價 {p.price} / 成本 {p.cost} / 庫存 {p.stock}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={()=> start(async()=>{ try{ await toggleProductStatus(p.id); }catch(e:any){ alert(e.message);} router.refresh(); })}>{p.isActive?"下架":"上架"}</Button>
                <StockAdjust id={p.id} stock={p.stock} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StockAdjust({ id, stock }: { id: string; stock: number }) {
  const [val, setVal] = useState(stock);
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2 items-center">
      <Input type="number" value={val} onChange={e=>setVal(Number(e.target.value))} className="w-20 h-8" />
      <Button size="sm" disabled={pending} onClick={()=> start(async()=>{
        await fetch("/api/admin/products/stock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id, stock: val})});
        router.refresh();
      })}>修正庫存</Button>
    </div>
  );
}
