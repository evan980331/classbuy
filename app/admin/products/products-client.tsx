"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createProduct, toggleProductStatus, updateProduct } from "@/app/actions/product";
import { useRouter } from "next/navigation";
import { ImagePicker } from "@/components/image-picker";

export default function ProductsClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ name: "", price: "", cost: "", stock: "", imageUrl: "" });
  const [msg, setMsg] = useState<string | null>(null);

  const onCreate = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    start(async () => {
      try {
        await createProduct(fd);
        setMsg("新增成功");
        setForm({ name: "", price: "", cost: "", stock: "", imageUrl: "" });
        router.refresh();
      } catch (e: any) {
        setMsg(e.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">商品與庫存管理</h1>
      <Card>
        <CardHeader><CardTitle>新增商品</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>名稱 *</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="例：麵包" /></div>
            <div><Label>售價 *</Label><Input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="25" /></div>
            <div><Label>成本 *</Label><Input type="number" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="15" /></div>
            <div><Label>初始庫存</Label><Input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="40" /></div>
          </div>
          <div>
            <Label>圖片</Label>
            <ImagePicker value={form.imageUrl} onChange={url=>setForm({...form, imageUrl: url})} />
          </div>
          {msg && <div className="text-sm p-2 bg-muted rounded">{msg}</div>}
          <Button onClick={onCreate} disabled={pending}>{pending ? "處理中..." : "新增商品"}</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {products.map(p=> <ProductRow key={p.id} p={p} />)}
      </div>
    </div>
  );
}

function ProductRow({ p }: { p: any }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [price, setPrice] = useState(String(p.price));
  const [cost, setCost] = useState(String(p.cost));
  const [stock, setStock] = useState(String(p.stock));
  const [msg, setMsg] = useState<string|null>(null);

  const savePrice = () => {
    const fd = new FormData();
    fd.set("price", price);
    fd.set("cost", cost);
    start(async ()=>{
      try { await updateProduct(p.id, fd); setMsg("已更新售價/成本"); router.refresh(); } catch(e:any){ setMsg(e.message); }
      setTimeout(()=>setMsg(null), 2000);
    });
  };

  const saveStock = () => {
    start(async()=>{
      try {
        const res = await fetch("/api/admin/products/stock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.id, stock: Number(stock)})});
        const j = await res.json().catch(()=>({}));
        if(!res.ok) throw new Error(j.error || "更新失敗");
        setMsg("庫存已修正"); router.refresh();
      } catch(e:any){ setMsg(e.message); }
      setTimeout(()=>setMsg(null), 2000);
    });
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium flex items-center gap-2">{p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-cover rounded" />}{p.name}</span>
          {p.isActive ? <Badge>上架</Badge> : <Badge variant="secondary">下架</Badge>}
        </div>
        <div className="text-sm text-muted-foreground">目前：售價 {p.price} / 成本 {p.cost} / 庫存 {p.stock}</div>
        <div className="grid grid-cols-3 gap-2">
          <div><Label className="text-xs">售價</Label><Input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="h-8" /></div>
          <div><Label className="text-xs">成本</Label><Input type="number" value={cost} onChange={e=>setCost(e.target.value)} className="h-8" /></div>
          <div className="flex items-end"><Button size="sm" className="w-full" disabled={pending} onClick={savePrice}>儲存價格</Button></div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex-1"><Label className="text-xs">盤點庫存</Label><Input type="number" value={stock} onChange={e=>setStock(e.target.value)} className="h-8" /></div>
          <Button size="sm" variant="outline" disabled={pending} onClick={saveStock}>修正庫存</Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={()=> start(async()=>{ try{ await toggleProductStatus(p.id); router.refresh(); }catch(e:any){ setMsg(e.message);} })}>{p.isActive?"下架":"上架"}</Button>
        </div>
        {msg && <div className="text-xs p-1 bg-muted rounded">{msg}</div>}
      </CardContent>
    </Card>
  );
}
