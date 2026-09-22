'use client';

import React from 'react';
import { Coins, Wallet, Send } from 'lucide-react';

interface StatsCapsulesProps {
  role?: string;
  totalBalance?: string;
  earnings?: string;
  expenses?: string;
}

export function StatsCapsules({
  role = 'SUPER_ADMIN',
  totalBalance = '$678,993.98',
  earnings = '$998,659.65',
  expenses = '$56,465.69',
}: StatsCapsulesProps) {
  // Role-specific values if needed
  const getValues = () => {
    switch (role) {
      case 'SALES':
        return {
          label1: 'Pipeline Value',
          val1: '$740,250.00',
          label2: 'Closed Deals',
          val2: '$485,120.00',
          label3: 'Pending Quotes',
          val3: '$42,350.00',
        };
      case 'ACCOUNT':
        return {
          label1: 'Treasury Balance',
          val1: '$894,320.00',
          label2: 'Invoiced / Recv',
          val2: '$624,800.00',
          label3: 'Disbursements',
          val3: '$68,450.00',
        };
      case 'ADMIN':
        return {
          label1: 'Budget Allocation',
          val1: '$520,000.00',
          label2: 'Project Milestones',
          val2: '$380,450.00',
          label3: 'Sprint Costs',
          val3: '$34,920.00',
        };
      default:
        return {
          label1: 'Total Balance',
          val1: totalBalance,
          label2: 'Earnings',
          val2: earnings,
          label3: 'Expenses',
          val3: expenses,
        };
    }
  };

  const current = getValues();

  return (
    <div className="glass-card rounded-[22px] p-2.5 sm:p-3 border border-white/12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 shadow-xl">
      {/* 1. Total Balance */}
      <div className="flex items-center gap-3 w-full sm:w-auto px-3 py-1.5 flex-1">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Coins className="w-5 h-5 text-white/90" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-medium text-white/50 tracking-wide">
            {current.label1}
          </p>
          <p className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {current.val1}
          </p>
        </div>
      </div>

      {/* Subtle vertical separator */}
      <div className="hidden sm:block w-[1px] h-8 bg-white/10" />

      {/* 2. Earnings */}
      <div className="flex items-center gap-3 w-full sm:w-auto px-3 py-1.5 flex-1">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Wallet className="w-5 h-5 text-white/90" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-medium text-white/50 tracking-wide">
            {current.label2}
          </p>
          <p className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {current.val2}
          </p>
        </div>
      </div>

      {/* Subtle vertical separator */}
      <div className="hidden sm:block w-[1px] h-8 bg-white/10" />

      {/* 3. Expenses */}
      <div className="flex items-center gap-3 w-full sm:w-auto px-3 py-1.5 flex-1">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Send className="w-4 h-4 text-white/90 -rotate-45" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-medium text-white/50 tracking-wide">
            {current.label3}
          </p>
          <p className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {current.val3}
          </p>
        </div>
      </div>
    </div>
  );
}
