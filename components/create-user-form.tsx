'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User as UserIcon, Shield, Loader2 } from 'lucide-react';

import { createUserSchema, CreateUserInput, USER_ASSIGNABLE_ROLES } from '@/lib/validations/user';
import { createUserAction } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateUserFormProps {
  onUserCreated?: () => void;
}

export function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      role: 'SALES',
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    setServerError(null);

    try {
      const response = await createUserAction(data);

      if (!response.success) {
        const errorMsg = response.error || 'Failed to create user.';
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success(response.message || 'User created successfully!');
      reset();
      onUserCreated?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 max-w-2xl">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#ff6536]/15 border border-[#ff6536]/30 flex items-center justify-center text-[#ff6536]">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Create New User</h3>
          <p className="text-xs text-white/50">
            Provision a new member account with assigned module permissions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-xs text-rose-300 bg-rose-500/15 rounded-xl border border-rose-500/30">
            {serverError}
          </div>
        )}

        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-white/80">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
            <Input
              id="email"
              type="email"
              placeholder="colleague@erp.com"
              className="pl-9 glass-input text-xs h-10 rounded-xl"
              disabled={isSubmitting}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>

        {/* Username (Optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-xs font-medium text-white/80">
            Username (Optional)
          </Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
            <Input
              id="username"
              type="text"
              placeholder="e.g. john_sales"
              className="pl-9 glass-input text-xs h-10 rounded-xl"
              disabled={isSubmitting}
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-rose-400">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-white/80">
            Temporary Password *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              className="pl-9 glass-input text-xs h-10 rounded-xl"
              disabled={isSubmitting}
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs font-medium text-white/80">
            Assign Role *
          </Label>
          <div className="relative">
            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-white/40 pointer-events-none" />
            <select
              id="role"
              disabled={isSubmitting}
              className="h-10 w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-4 text-xs text-white shadow-xs focus:border-[#ff6536] focus:outline-none transition-colors appearance-none"
              {...register('role')}
            >
              {USER_ASSIGNABLE_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#12161e] text-white">
                  {r === 'ADMIN'
                    ? 'Admin (Operational Manager)'
                    : r === 'SALES'
                    ? 'Sales (Lead & Orders)'
                    : 'Account (Financial Ledgers)'}
                </option>
              ))}
            </select>
          </div>
          {errors.role && (
            <p className="text-xs text-rose-400">{errors.role.message}</p>
          )}
          <p className="text-[11px] text-white/40">
            Roles define access boundaries across ERP modules and actions.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-white/10">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="glow-pill-active text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-transform"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-3.5 w-3.5" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
