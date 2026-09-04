import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.restockLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  const images = [
    { label: "noodle", url: "https://picsum.photos/seed/noodle/400/300" },
    { label: "drink", url: "https://picsum.photos/seed/sports/400/300" },
    { label: "bread", url: "https://picsum.photos/seed/bread/400/300" },
    { label: "chips", url: "https://picsum.photos/seed/chips/400/300" },
    { label: "water", url: "https://picsum.photos/seed/water/400/300" },
    { label: "jelly", url: "https://picsum.photos/seed/jelly/400/300" },
    { label: "milk", url: "https://picsum.photos/seed/milk/400/300" },
    { label: "cookie", url: "https://picsum.photos/seed/cookie/400/300" },
  ];
  for (const im of images) await prisma.productImage.create({ data: im });
  await prisma.user.create({ data: { name: "admin", role: "ADMIN" } });
  for (let i = 1; i <= 35; i++) {
    if (i === 9) continue;
    await prisma.user.create({ data: { name: "座號" + i, seatNo: i, role: "USER" } });
  }
  const products = [
    { name: "碗裝泡麵", price: 35, cost: 22, stock: 30, imageUrl: images[0].url },
    { name: "運動飲料", price: 30, cost: 18, stock: 50, imageUrl: images[1].url },
    { name: "麵包", price: 25, cost: 15, stock: 40, imageUrl: images[2].url },
    { name: "洋芋片", price: 25, cost: 15, stock: 40, imageUrl: images[3].url },
    { name: "礦泉水", price: 15, cost: 8, stock: 80, imageUrl: images[4].url },
  ];
  for (const p of products) {
    const prod = await prisma.product.create({ data: p });
    await prisma.restockLog.create({ data: { productId: prod.id, quantity: p.stock, unitCost: p.cost, totalCost: p.stock * p.cost } });
  }
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
