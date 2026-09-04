import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">商品列表</h1>
        <Link href="/checkout"><Button>前往結帳</Button></Link>
      </div>
      {products.length === 0 && <p className="text-muted-foreground">目前沒有上架商品，請至管理後台新增。</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">無圖片</div>}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">
                {p.name}
                {p.stock === 0 ? <Badge variant="destructive">已售罄</Badge> : <Badge variant="secondary">庫存 {p.stock}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-primary text-lg">NT$ {p.price}</span>
                <span className="text-muted-foreground text-xs self-center">成本 NT$ {p.cost}</span>
              </div>
              <Link href="/checkout" className="block">
                <Button disabled={p.stock === 0} className="w-full" variant={p.stock === 0 ? "secondary" : "default"}>
                  {p.stock === 0 ? "已售罄" : "加入購物車 → 結帳"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
