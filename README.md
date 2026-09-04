# classroom-pos 班級小賣部

Next.js App Router + Prisma + Neon Postgres

## 快速開始
1. `cp .env.example .env` 填入 Neon DATABASE_URL / DIRECT_URL
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run seed` 或 `npx prisma db seed`
5. `npm run dev`

Admin 暗號: `ADMIN_SECRET` 預設 classroom123 訪問 /admin/* 時輸入。
