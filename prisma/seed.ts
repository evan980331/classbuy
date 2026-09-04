import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 清空
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.restockLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const users = await Promise.all([
    prisma.user.create({ data: { name: "小明", role: "USER" } }),
    prisma.user.create({ data: { name: "小華", role: "USER" } }),
    prisma.user.create({ data: { name: "小美", role: "USER" } }),
    prisma.user.create({ data: { name: "班導師", role: "ADMIN" } }),
    prisma.user.create({ data: { name: "admin", role: "ADMIN" } }),
  ]);
  console.log(`Seeded ${users.length} users`);

  const products = [
    { name: "碗裝泡麵", price: 35, cost: 22, stock: 30, imageUrl: "https://picsum.photos/seed/noodle/400/300" },
    { name: "運動飲料", price: 30, cost: 18, stock: 50, imageUrl: "https://picsum.photos/seed/sports/400/300" },
    { name: "洋芋片", price: 25, cost: 15, stock: 40, imageUrl: "https://picsum.photos/seed/chips/400/300" },
    { name: "巧克力棒", price: 20, cost: 12, stock: 60, imageUrl: "https://picsum.photos/seed/choco/400/300" },
    { name: "礦泉水", price: 15, cost: 8, stock: 80, imageUrl: "https://picsum.photos/seed/water/400/300" },
    { name: "果凍", price: 12, cost: 6, stock: 0, imageUrl: "https://picsum.photos/seed/jelly/400/300" },
    { name: "牛奶", price: 28, cost: 17, stock: 25, imageUrl: "https://picsum.photos/seed/milk/400/300" },
    { name: "餅乾", price: 18, cost: 10, stock: 35, imageUrl: "https://picsum.photos/seed/cookie/400/300" },
  ];

  for (const p of products) {
    const prod = await prisma.product.create({ data: p });
    // 初始進貨紀錄
    await prisma.restockLog.create({
      data: { productId: prod.id, quantity: p.stock, unitCost: p.cost, totalCost: p.stock * p.cost },
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
