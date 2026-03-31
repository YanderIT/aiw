import { getUsers } from "@/models/user";
import { getUserCredits } from "@/services/credit";
import UsersManagement from "./components/users-management";

export default async function AdminUsersPage() {
  const users = await getUsers(1, 50);

  const creditsMap: Record<string, number> = {};
  if (users && users.length > 0) {
    await Promise.all(
      users.map(async (user: any) => {
        if (user.uuid) {
          const credits = await getUserCredits(user.uuid);
          creditsMap[user.uuid] = credits.left_credits;
        }
      })
    );
  }

  return <UsersManagement users={users || []} userCreditsMap={creditsMap} />;
}
