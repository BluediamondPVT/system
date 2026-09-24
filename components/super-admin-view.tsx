'use client';

import { UserSummary } from '@/app/actions/user';
import { UserManagementConsole } from '@/components/user-management-console';

interface SuperAdminViewProps {
  initialUsers: UserSummary[];
  currentUserId?: string;
}

export function SuperAdminView({ initialUsers, currentUserId }: SuperAdminViewProps) {
  return (
    <UserManagementConsole
      initialUsers={initialUsers}
      currentUserId={currentUserId}
    />
  );
}
