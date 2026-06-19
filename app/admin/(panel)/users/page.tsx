import { getUsers } from "@/lib/data";
import UsersManager from "./UsersManager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();
  return <UsersManager initial={users} />;
}
