'use client';

import React from 'react';
import { StatsCapsules } from './stats-capsules';
import { SplineWaveChart } from './spline-wave-chart';
import { GoalsProgressCard } from './goals-progress-card';
import { ProfileVirtualCard } from './profile-virtual-card';

interface DashboardWidgetsProps {
  role?: string;
  email?: string;
  username?: string;
  title?: string;
  welcomeText?: string;
}

export function DashboardWidgets({
  role = 'SUPER_ADMIN',
  email = 'admin@erp.com',
  username = 'Abu Salim',
  title = 'My Dashboard',
  welcomeText,
}: DashboardWidgetsProps) {
  const getRoleBadgeStyle = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'SALES':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'ACCOUNT':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'ADMIN':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Row: Title and Role Tag */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <span>{title}</span>
          {welcomeText && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide uppercase shadow-xs ${getRoleBadgeStyle(
                role
              )}`}
            >
              {welcomeText}
            </span>
          )}
        </h1>
      </div>

      {/* Horizontal Stat Capsule Bar (Image 1 style) */}
      <StatsCapsules role={role} />

      {/* Main Two-Column Grid matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Statistic Wave + Goals & Savings (8 Columns) */}
        <div className="lg:col-span-8 space-y-5">
          <SplineWaveChart />
          <GoalsProgressCard />
        </div>

        {/* Right Column: Profile & VISA Card + Last Transaction (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          <ProfileVirtualCard role={role} email={email} username={username} />
        </div>
      </div>
    </div>
  );
}
