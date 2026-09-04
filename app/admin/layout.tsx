import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminGate from "./gate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthed = cookies().get("admin_auth")?.value === "1";
  if (!isAuthed) return <AdminGate />;
  return <div>{children}</div>;
}
