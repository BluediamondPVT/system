import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { ExecutiveDashboardView } from '@/components/executive-dashboard-view';
import { getAllUsersAction, UserSummary } from '@/app/actions/user';
import { SuperAdminView } from '@/components/super-admin-view';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // If user is SUPER_ADMIN, fetch initial users for identity governance
  let initialUsers: UserSummary[] = [];
  if (user.role === 'SUPER_ADMIN') {
    const usersResponse = await getAllUsersAction();
    if (usersResponse.success && usersResponse.users) {
      initialUsers = usersResponse.users;
    }
  }

  return (
    <div className="space-y-8">
      {/* Ashapura Builders Executive Master Dashboard */}
      <ExecutiveDashboardView userRole={user.role} />

      {/* Role & Identity Governance for Super Admin */}
      {user.role === 'SUPER_ADMIN' && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Enterprise Role &amp; Identity Governance
            </h2>
            <span className="glass-pill px-3 py-1 text-xs text-purple-300 border-purple-500/30">
              Super Admin Controls
            </span>
          </div>
          <SuperAdminView initialUsers={initialUsers} currentUserId={user.userId} />
        </div>
      )}
    </div>
  );
}
