'use client';

import { useState, useCallback } from 'react';
import { UserPlus, Users, RefreshCw } from 'lucide-react';
import { CreateUserForm } from '@/components/create-user-form';
import { getAllUsersAction, UserSummary } from '@/app/actions/user';
import { Button } from '@/components/ui/button';

interface SuperAdminViewProps {
  initialUsers: UserSummary[];
}

export function SuperAdminView({ initialUsers }: SuperAdminViewProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'directory'>('create');
  const [users, setUsers] = useState<UserSummary[]>(initialUsers);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAction();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUserCreated = () => {
    fetchUsers();
    setActiveTab('directory');
  };

  return (
    <div className="space-y-6">
      {/* VisionOS Pill Tabs */}
      <div className="flex items-center gap-3 p-1.5 glass-pill max-w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            activeTab === 'create'
              ? 'glow-pill-active text-white font-semibold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Create New User
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            activeTab === 'directory'
              ? 'glow-pill-active text-white font-semibold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          User Directory ({users.length})
        </button>
      </div>

      {/* Tab: Create New User */}
      {activeTab === 'create' && (
        <div className="pt-2">
          <CreateUserForm onUserCreated={handleUserCreated} />
        </div>
      )}

      {/* Tab: User Directory */}
      {activeTab === 'directory' && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex flex-row items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white">User Directory</h3>
              <p className="text-xs text-white/50">
                Live registry of enterprise ERP accounts and role authorizations
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
              className="glass-pill text-white border-white/15 hover:bg-white/10 text-xs h-8"
            >
              <RefreshCw className={`h-3 w-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-white/[0.04] text-white/60 border-b border-white/10">
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Username</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/90">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-white/40">
                      No users found in database.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-4 font-medium">{u.email}</td>
                      <td className="py-3 px-4 text-white/60">{u.username}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                              : u.role === 'ADMIN'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                              : u.role === 'SALES'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            u.isActive
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/50">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
