import { getDashboardStats } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const s = await getDashboardStats();
  const items = [
    { label: "總營業額", value: `NT$ ${s.totalRevenue.toLocaleString()}`, sub: `${s.orderCount} 筆訂單` },
    { label: "總進貨成本", value: `NT$ ${s.totalRestockCost.toLocaleString()}`, sub: "累計 RestockLog" },
    { label: "銷貨成本 (COGS)", value: `NT$ ${s.cogs.toLocaleString()}`, sub: "依當前成本估算" },
    { label: "預估毛利", value: `NT$ ${s.grossProfit.toLocaleString()}`, sub: `毛利率 ${s.profitMargin}%` },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">財務記帳看板</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {items.map((it)=>(
          <Card key={it.label}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{it.label}</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{it.value}</div><div className="text-xs text-muted-foreground">{it.sub}</div></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="pt-4 text-sm text-muted-foreground">公式：總營業額 = Σ Order.totalAmount；總進貨成本 = Σ RestockLog.totalCost；毛利 = 總營業額 - COGS（COGS 以 OrderItem 數量 × 商品現行成本估算）</CardContent></Card>
    </div>
  );
}
