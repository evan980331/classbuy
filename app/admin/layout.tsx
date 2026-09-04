import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const userId = cookies().get("user_auth")?.value;
  if (!userId) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white text-center space-y-2">
        <div className="font-bold">需要管理員權限</div>
        <div className="text-sm text-muted-foreground">請使用 admin 帳號登入</div>
      </div>
    );
  }
  return <div>{children}</div>;
}
