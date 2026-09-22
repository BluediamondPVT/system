import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getAllUsersAction } from '@/app/actions/user';
import { SuperAdminView } from '@/components/super-admin-view';
import { DashboardWidgets } from '@/components/widgets/dashboard-widgets';

export default async function SuperAdminPage() {
  const session = await getSessionUser();

  // Route-level authorization check
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
      {/* Core ERP Financial & Performance Widgets (Image 1 style) */}
      <DashboardWidgets
        role="SUPER_ADMIN"
        email={session.email}
        username={session.username}
        title="My Dashboard"
        welcomeText="Welcome Super Admin"
      />

      {/* User Management Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Role & Identity Governance
          </h2>
          <span className="glass-pill px-3 py-1 text-xs text-purple-300 border-purple-500/30">
            Super Admin Controls
          </span>
        </div>
        <SuperAdminView initialUsers={initialUsers} />
      </div>
    </div>
  );
}
