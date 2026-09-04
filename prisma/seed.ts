import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.restockLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1 Admin + 2 同學 (符合規格) + 額外
  const admin = await prisma.user.create({ data: { name: "admin", role: "ADMIN" } });
  const user1 = await prisma.user.create({ data: { name: "小明", role: "USER" } });
  const user2 = await prisma.user.create({ data: { name: "小華", role: "USER" } });
  // 額外保留
  await prisma.user.create({ data: { name: "班導師", role: "ADMIN" } });

  console.log(`Seeded admin: ${admin.name}, users: ${user1.name}, ${user2.name}`);

  const products = [
    { name: "碗裝泡麵", price: 35, cost: 22, stock: 30, imageUrl: "https://picsum.photos/seed/noodle/400/300" },
    { name: "運動飲料", price: 30, cost: 18, stock: 50, imageUrl: "https://picsum.photos/seed/sports/400/300" },
    { name: "麵包", price: 25, cost: 15, stock: 40, imageUrl: "https://picsum.photos/seed/bread/400/300" },
    { name: "洋芋片", price: 25, cost: 15, stock: 40, imageUrl: "https://picsum.photos/seed/chips/400/300" },
    { name: "礦泉水", price: 15, cost: 8, stock: 80, imageUrl: "https://picsum.photos/seed/water/400/300" },
  ];

  for (const p of products) {
    const prod = await prisma.product.create({ data: p });
    await prisma.restockLog.create({
      data: { productId: prod.id, quantity: p.stock, unitCost: p.cost, totalCost: p.stock * p.cost },
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
