'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Grid3X3,
  Users,
  Wallet,
  UserCog,
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
}

function getNavItemsForRole(role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT'): NavItem[] {
  if (role === 'ACCOUNT') {
    return [
      {
        name: 'Accounts & Demands',
        href: '/dashboard/accounts',
        icon: Wallet,
      },
      {
        name: 'Billing Matrix',
        href: '/dashboard/inventory',
        icon: Grid3X3,
      },
      {
        name: 'Executive Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ];
  }

  if (role === 'SALES') {
    return [
      {
        name: 'Lead CRM',
        href: '/dashboard/leads',
        icon: Users,
      },
      {
        name: 'Inventory Matrix',
        href: '/dashboard/inventory',
        icon: Grid3X3,
      },
      {
        name: 'Sales Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ];
  }

  // SUPER_ADMIN and ADMIN
  return [
    {
      name: 'Master Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Inventory Matrix',
      href: '/dashboard/inventory',
      icon: Grid3X3,
    },
    {
      name: 'Lead CRM',
      href: '/dashboard/leads',
      icon: Users,
    },
    {
      name: 'Accounts & Demands',
      href: '/dashboard/accounts',
      icon: Wallet,
    },
    ...(role === 'SUPER_ADMIN'
      ? [
          {
            name: 'User & Roles',
            href: '/dashboard/users',
            icon: UserCog,
          },
        ]
      : []),
  ];
}

const emptySubscribe = () => () => {};

export function GlassDock({ role = 'SALES' }: GlassDockProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const navItems = getNavItemsForRole(role);

  // During SSR and initial client mount, assume dark (defaultTheme) to avoid hydration mismatch
  const isDark = mounted ? resolvedTheme === 'dark' : true;

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
          href={role === 'ACCOUNT' ? '/dashboard/accounts' : role === 'SALES' ? '/dashboard/leads' : '/dashboard'}
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
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

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
          suppressHydrationWarning
          title={mounted ? (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode') : 'Dark Mode'}
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
          <span
            suppressHydrationWarning
            className="hidden md:group-hover:block absolute left-16 px-3 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl border border-white/15 whitespace-nowrap pointer-events-none z-50"
          >
            {mounted ? (isDark ? 'Light Mode' : 'Dark Mode') : 'Dark Mode'}
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
