'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock, Mail, Loader2, Eye, EyeOff, Sparkles, Shield, ArrowRight } from 'lucide-react';

import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { loginAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    try {
      const response = await loginAction(data);

      if (!response.success) {
        const errorMsg = response.error || 'Failed to authenticate';
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const targetRoute = response.redirectUrl || '/dashboard';
      toast.success(
        `Login successful! Welcome ${response.user?.role ? `${response.user.role}` : ''}`
      );
      router.push(targetRoute);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(message);
      toast.error(message);
    }
  };

  const fillDemoCredentials = (role: 'SUPER_ADMIN' | 'SALES' | 'ACCOUNT' | 'ADMIN') => {
    if (role === 'SUPER_ADMIN') {
      setValue('identifier', 'admin@erp.com');
      setValue('password', 'admin123');
    } else if (role === 'SALES') {
      setValue('identifier', 'sales_user@erp.com');
      setValue('password', 'admin123');
    } else if (role === 'ACCOUNT') {
      setValue('identifier', 'account_user@erp.com');
      setValue('password', 'admin123');
    } else {
      setValue('identifier', 'admin_user@erp.com');
      setValue('password', 'admin123');
    }
    setServerError(null);
    toast.info(`Filled credentials for ${role}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 select-none relative">
      {/* Floating VisionOS Frosted Glass Card */}
      <div className="glass-canvas w-full max-w-md rounded-[32px] md:rounded-[36px] p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
        {/* Subtle decorative top window dots */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]/90 border border-black/20" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/90 border border-black/20" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]/90 border border-black/20" />
          </div>
          <div className="glass-pill px-2.5 py-0.5 text-[10px] font-mono text-white/50 tracking-wider">
            ERP GATEWAY v2.4
          </div>
        </div>

        {/* Brand Icon & Welcome Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff6536]/25 to-purple-500/20 border border-white/20 flex items-center justify-center text-[#ff6536] shadow-lg shadow-[#ff6536]/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Enterprise ERP
          </h1>
          <p className="text-xs text-white/50 max-w-xs mx-auto">
            Role-Based Cloud Resource Planning & Financial Operations
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 text-xs text-rose-300 bg-rose-500/15 rounded-xl border border-rose-500/30">
              {serverError}
            </div>
          )}

          {/* Email / Username field */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-xs font-medium text-white/80">
              Email or Username
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
              <Input
                id="identifier"
                type="text"
                placeholder="admin@erp.com"
                className="pl-10 h-11 glass-input rounded-xl text-xs"
                disabled={isSubmitting}
                {...register('identifier')}
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-rose-400">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-white/80">
                Password
              </Label>
              <span className="text-[10px] text-white/40">Min. 6 chars</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 glass-input rounded-xl text-xs"
                disabled={isSubmitting}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-white/40 hover:text-white transition"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 glow-pill-active text-white text-xs font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#ff6536]/40 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Sign In to Workspace
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                Quick Demo Logins
              </span>
              <Shield className="w-3 h-3 text-white/40" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('SUPER_ADMIN')}
                className="glass-pill py-1.5 px-2 text-[11px] text-purple-300 hover:text-white border-purple-500/30 hover:border-purple-400 transition"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('SALES')}
                className="glass-pill py-1.5 px-2 text-[11px] text-emerald-300 hover:text-white border-emerald-500/30 hover:border-emerald-400 transition"
              >
                Sales Lead
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('ACCOUNT')}
                className="glass-pill py-1.5 px-2 text-[11px] text-blue-300 hover:text-white border-blue-500/30 hover:border-blue-400 transition"
              >
                Accountant
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('ADMIN')}
                className="glass-pill py-1.5 px-2 text-[11px] text-amber-300 hover:text-white border-amber-500/30 hover:border-amber-400 transition"
              >
                Operations Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
