"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function HistoryClient({ users, selectedUserId, orders, totalSpent }: any) {
  const router = useRouter();
  return (
    <>
      <Card>
        <CardContent className="pt-4 flex gap-4 items-center">
          <span className="text-sm font-medium">選擇使用者</span>
          <Select value={selectedUserId} onChange={(e) => router.push(`/history?userId=${e.target.value}`)}>
            {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
          <span className="ml-auto font-bold">消費總額: NT$ {totalSpent.toLocaleString()}</span>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {orders.length===0 ? <p className="text-muted-foreground text-sm">無消費紀錄</p> : orders.map((o: any)=>(
          <Card key={o.id}>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex justify-between"><span>{new Date(o.createdAt).toLocaleString("zh-TW")}</span><span>NT$ {o.totalAmount}</span></CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">訂單 {o.id} · 購買人 {o.user.name}</div>
              {o.items.map((it: any)=><div key={it.id} className="flex justify-between"><span>{it.product.name} × {it.quantity} @ NT$ {it.price}</span><span>NT$ {it.quantity*it.price}</span></div>)}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
