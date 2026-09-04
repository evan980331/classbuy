import { getUsersWithSeat } from "@/app/actions/user";
import UsersClient from "./users-client";
export const dynamic = "force-dynamic";
export default async function UsersPage() {
  const users = await getUsersWithSeat();
  return <UsersClient users={users} />;
}
