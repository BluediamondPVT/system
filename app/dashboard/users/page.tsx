import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getAllUsersAction } from '@/app/actions/user';
import { UserManagementConsole } from '@/components/user-management-console';

export default async function UsersManagementPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  const usersResponse = await getAllUsersAction();
  const initialUsers = usersResponse.success && usersResponse.users ? usersResponse.users : [];

  return (
    <div className="space-y-6">
      <UserManagementConsole
        initialUsers={initialUsers}
        currentUserId={session.userId}
      />
    </div>
  );
}
