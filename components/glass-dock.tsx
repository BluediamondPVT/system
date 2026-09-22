'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Grid3X3,
  Users,
  FileText,
  Wallet,
  BookOpen,
  ShieldCheck,
  LogOut,
  Loader2,
  Sparkles,
  Settings,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';
import { toast } from 'sonner';

interface GlassDockProps {
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT';
  userEmail?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  allowedRoles: Array<'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT'>;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES', 'ACCOUNT'],
  },
  {
    name: 'Inventory Matrix',
    href: '/dashboard/inventory',
    icon: Grid3X3,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES', 'ACCOUNT'],
  },
  {
    name: 'Lead CRM',
    href: '/dashboard/leads',
    icon: Users,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES'],
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES', 'ACCOUNT'],
  },
  {
    name: 'Accounts & Demands',
    href: '/dashboard/accounts',
    icon: Wallet,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ACCOUNT'],
  },
  {
    name: 'Software Guide',
    href: '/dashboard/guide',
    icon: BookOpen,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES', 'ACCOUNT'],
  },
  {
    name: 'Role Governance',
    href: '/dashboard/super-admin',
    icon: ShieldCheck,
    allowedRoles: ['SUPER_ADMIN'],
  },
];

export function GlassDock({ role = 'SALES' }: GlassDockProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Failed to log out');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Integrated Sidebar Navigation"
      className="w-16 md:w-20 h-screen border-r border-white/10 flex flex-col items-center justify-between py-5 px-2 bg-black/40 backdrop-blur-2xl shrink-0 select-none z-20"
    >
      {/* Top Logo / Brand Icon */}
      <div className="flex flex-col items-center gap-5">
        <Link
          href="/dashboard"
          title="Ashapura Builders ERP"
          className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/20 shadow-md group hover:scale-105 transition-all cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-[#ff6536] group-hover:rotate-12 transition-transform duration-300" />
        </Link>

        {/* Subtle Divider */}
        <div className="w-8 h-[1px] bg-white/10" />
      </div>

      {/* Center Nav Items */}
      <nav className="flex flex-col items-center gap-3.5 my-auto py-2">
        {NAV_ITEMS.map((item) => {
          const isAllowed = item.allowedRoles.includes(role);
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (!isAllowed) {
            return null;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'glow-pill-active scale-105 shadow-[0_4px_22px_rgba(255,101,54,0.6)] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Hover Tooltip */}
              <span className="hidden md:group-hover:block absolute left-16 px-3 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl border border-white/15 whitespace-nowrap pointer-events-none z-50">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Notifications Icon */}
        <button
          type="button"
          title="Notifications"
          onClick={() => toast.info('All enterprise modules operating at 100% health.')}
          className="relative group w-11 h-11 rounded-2xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff6536] ring-2 ring-[#12161e]" />
          <span className="hidden md:group-hover:block absolute left-16 px-3 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl border border-white/15 whitespace-nowrap pointer-events-none z-50">
            Notifications
          </span>
        </button>

        {/* Settings Icon */}
        <button
          type="button"
          title="Security & Settings"
          onClick={() => toast.info(`Active session role: [${role}]`)}
          className="group w-11 h-11 rounded-2xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
          <span className="hidden md:group-hover:block absolute left-16 px-3 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl border border-white/15 whitespace-nowrap pointer-events-none z-50">
            Settings
          </span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="group relative w-11 h-11 rounded-2xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <span className="relative w-5 h-5 flex items-center justify-center">
            <Sun
              className={`absolute w-5 h-5 transition-all duration-500 ${
                isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
              }`}
            />
            <Moon
              className={`absolute w-5 h-5 transition-all duration-500 ${
                isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
          </span>
          <span className="hidden md:group-hover:block absolute left-16 px-3 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl border border-white/15 whitespace-nowrap pointer-events-none z-50">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </nav>

      {/* Bottom Logout Button */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-[1px] bg-white/10 mb-1" />

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          title="Sign Out"
          className="group relative w-11 h-11 rounded-2xl flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/15 transition-all duration-300"
        >
          {loggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin text-rose-400" />
          ) : (
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          )}
          <span className="hidden md:group-hover:block absolute left-16 px-3 py-1 bg-black/90 backdrop-blur-md text-rose-300 text-xs font-medium rounded-lg shadow-xl border border-rose-500/20 whitespace-nowrap pointer-events-none z-50">
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}
