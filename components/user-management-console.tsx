'use client';

import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Users,
  Shield,
  ShieldCheck,
  TrendingUp,
  Wallet,
  RefreshCw,
  Search,
  Filter,
  Pencil,
  Trash2,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
  getAllUsersAction,
  UserSummary,
} from '@/app/actions/user';
import { USER_ASSIGNABLE_ROLES, AssignableRole } from '@/lib/validations/user';
import { toast } from 'sonner';

interface UserManagementConsoleProps {
  initialUsers: UserSummary[];
  currentUserId?: string;
}

export function UserManagementConsole({
  initialUsers,
  currentUserId,
}: UserManagementConsoleProps) {
  const [users, setUsers] = useState<UserSummary[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserSummary | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'SALES' as AssignableRole,
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const [editForm, setEditForm] = useState({
    id: '',
    email: '',
    username: '',
    password: '',
    role: 'SALES' as AssignableRole,
    isActive: true,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Refresh users from database
  const refreshUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAction();
      if (res.success && res.users) {
        setUsers(res.users);
        toast.success('User directory refreshed');
      } else {
        toast.error(res.error || 'Failed to fetch users');
      }
    } catch {
      toast.error('Error refreshing users');
    } finally {
      setLoading(false);
    }
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && u.isActive) ||
        (statusFilter === 'INACTIVE' && !u.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // KPI counts
  const superAdminCount = users.filter((u) => u.role === 'SUPER_ADMIN').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const salesCount = users.filter((u) => u.role === 'SALES').length;
  const accountCount = users.filter((u) => u.role === 'ACCOUNT').length;
  const activeCount = users.filter((u) => u.isActive).length;

  // Handle Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.email || !createForm.password) {
      toast.error('Email and password are required');
      return;
    }
    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setCreateSubmitting(true);
    try {
      const res = await createUserAction(createForm);
      if (!res.success) {
        toast.error(res.error || 'Failed to create user');
        return;
      }

      toast.success(res.message || 'User created successfully');
      setCreateModalOpen(false);
      setCreateForm({
        email: '',
        username: '',
        password: '',
        role: 'SALES',
      });
      // Refresh list
      const updated = await getAllUsersAction();
      if (updated.success && updated.users) {
        setUsers(updated.users);
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user: UserSummary) => {
    setEditingUser(user);
    setEditForm({
      id: user.id,
      email: user.email,
      username: user.username,
      password: '',
      role: user.role as AssignableRole,
      isActive: user.isActive,
    });
  };

  // Handle Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;

    setEditSubmitting(true);
    try {
      const res = await updateUserAction({
        id: editForm.id,
        email: editForm.email,
        username: editForm.username,
        role: editForm.role,
        isActive: editForm.isActive,
        password: editForm.password ? editForm.password : undefined,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to update user');
        return;
      }

      toast.success(res.message || 'User updated successfully');
      setEditingUser(null);
      // Refresh list
      const updated = await getAllUsersAction();
      if (updated.success && updated.users) {
        setUsers(updated.users);
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setDeleteSubmitting(true);
    try {
      const res = await deleteUserAction(deletingUser.id);
      if (!res.success) {
        toast.error(res.error || 'Failed to delete user');
        return;
      }

      toast.success(res.message || 'User deleted successfully');
      setDeletingUser(null);
      // Refresh list
      const updated = await getAllUsersAction();
      if (updated.success && updated.users) {
        setUsers(updated.users);
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Actions */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              User &amp; Role Governance
            </h1>
            <span className="glass-pill px-2.5 py-0.5 text-[11px] text-purple-300 border-purple-500/30 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-[#ff6536]" />
              Enterprise Tier
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Administer system users, configure security roles, and manage access lifecycles
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={refreshUsers}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer group"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>+ Create New User</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Users */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/50 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Accounts</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{users.length}</div>
          <span className="text-[10px] text-emerald-400 font-medium">{activeCount} active in system</span>
        </div>

        {/* Super Admins */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/50 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">Super Admins</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{superAdminCount}</div>
          <span className="text-[10px] text-white/50">Full Platform Control</span>
        </div>

        {/* Admins */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/50 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Admins</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-300">{adminCount}</div>
          <span className="text-[10px] text-white/50">Operations Oversight</span>
        </div>

        {/* Sales */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/50 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Sales Reps</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{salesCount}</div>
          <span className="text-[10px] text-white/50">CRM &amp; Pipeline</span>
        </div>

        {/* Accounts */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/50 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Accounts</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{accountCount}</div>
          <span className="text-[10px] text-white/50">Ledger &amp; Escrow</span>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by email or username..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-white/40" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400"
            >
              <option value="ALL" className="bg-[#12161e]">All Roles</option>
              <option value="SUPER_ADMIN" className="bg-[#12161e]">Super Admin</option>
              <option value="ADMIN" className="bg-[#12161e]">Admin</option>
              <option value="SALES" className="bg-[#12161e]">Sales</option>
              <option value="ACCOUNT" className="bg-[#12161e]">Account</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400"
          >
            <option value="ALL" className="bg-[#12161e]">All Status</option>
            <option value="ACTIVE" className="bg-[#12161e]">Active Only</option>
            <option value="INACTIVE" className="bg-[#12161e]">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* 4. Users Table */}
      <div className="glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-glass-scroll">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead>
              <tr className="bg-white/[0.04] text-white/50 border-b border-white/10 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">USER IDENTITY</th>
                <th className="py-3.5 px-4">ASSIGNED ROLE</th>
                <th className="py-3.5 px-4">ACCOUNT STATUS</th>
                <th className="py-3.5 px-4">REGISTERED DATE</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/40">
                    No users match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const initial = (u.username || u.email).charAt(0).toUpperCase();
                  const isCurrent = currentUserId && currentUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                                : u.role === 'ADMIN'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                                : u.role === 'SALES'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.username}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-white/50">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                              : u.role === 'ADMIN'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                              : u.role === 'SALES'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                          }`}
                        >
                          {u.role === 'SUPER_ADMIN' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            u.isActive
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                          />
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-white/50 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 text-white/70 hover:text-blue-300 transition-all cursor-pointer"
                            title="Edit User"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingUser(u)}
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-rose-600/30 border border-white/10 hover:border-rose-500/40 text-white/70 hover:text-rose-300 transition-all cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New User</h3>
                  <p className="text-xs text-white/50">Provision a new account with tailored role privileges</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Email */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Work Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="colleague@erp.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Display Username (Optional)</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Temporary Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Security Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  {USER_ASSIGNABLE_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, role: r })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        createForm.role === r
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-md'
                          : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{r}</div>
                      <div className="text-[9px] text-white/50">
                        {r === 'SUPER_ADMIN'
                          ? 'Full Control'
                          : r === 'ADMIN'
                          ? 'Oversight'
                          : r === 'SALES'
                          ? 'CRM Pipeline'
                          : 'Ledger Audit'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5"
                >
                  {createSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save &amp; Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit User Account</h3>
                  <p className="text-xs text-white/50">Modify identity, role tier, or reset credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              {/* Email */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Display Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Reset Password (Optional) */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">
                  Reset Password <span className="text-white/40 font-normal">(Leave blank to keep unchanged)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Assigned Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {USER_ASSIGNABLE_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: r })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        editForm.role === r
                          ? 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-md'
                          : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{r}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active / Inactive Status Toggle */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Account Status</span>
                  <span className="text-[10px] text-white/50">
                    {editForm.isActive ? 'User can log in and access system' : 'User account is locked'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    editForm.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}
                >
                  {editForm.isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Deactivated</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5"
                >
                  {editSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Delete User Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl glass-card border border-rose-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete User?</h3>
                <p className="text-xs text-rose-300/80">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-white/80 space-y-1">
              <p>
                Are you sure you want to permanently revoke all access and delete user:
              </p>
              <div className="font-bold text-white text-sm pt-1">
                {deletingUser.username} ({deletingUser.email})
              </div>
              <div className="text-[11px] text-white/60">
                Assigned Role: <span className="font-semibold text-rose-300">{deletingUser.role}</span>
              </div>
            </div>

            {currentUserId === deletingUser.id ? (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                ⚠️ Security Constraint: You are currently logged in as this user and cannot delete your own account.
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting || currentUserId === deletingUser.id}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-rose-500/30 transition flex items-center gap-1.5"
              >
                {deleteSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
