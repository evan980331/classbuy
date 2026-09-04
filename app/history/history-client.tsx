"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryClient({ orders, totalSpent, isAdmin, currentUser }: any) {
  return (
    <>
      <Card>
        <CardContent className="pt-4 flex gap-4 items-center">
          <span className="text-sm">{isAdmin ? "管理員檢視全部" : `${currentUser.seatNo ? `${currentUser.seatNo}號` : ""} ${currentUser.name}`}</span>
          <span className="ml-auto font-bold">金額總計: NT$ {totalSpent.toLocaleString()}</span>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {orders.length===0 ? <p className="text-muted-foreground text-sm">無紀錄</p> : orders.map((o: any)=>(
          <Card key={o.id}>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex justify-between"><span>{new Date(o.createdAt).toLocaleString("zh-TW")}</span><span>NT$ {o.totalAmount}</span></CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">訂單 {o.id.slice(0,8)} · 購買人 {o.user.seatNo ? `${o.user.seatNo}號` : ""} {o.user.name}</div>
              {o.items.map((it: any)=><div key={it.id} className="flex justify-between"><span>{it.product.name} × {it.quantity} @ NT$ {it.price}</span><span>NT$ {it.quantity*it.price}</span></div>)}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
