import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminGate from "./gate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 簡易 soft-gate: 若無 cookie 顯示輸入暗號頁面，後端仍可透過 ADMIN_SECRET 驗證
  const isAuthed = cookies().get("admin_auth")?.value === "1";
  if (!isAuthed) return <AdminGate />;
  return <div>{children}</div>;
}
