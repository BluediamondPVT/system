'use client';

import React from 'react';
import {
  Bell,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileVirtualCardProps {
  email?: string;
  username?: string;
  role?: string;
}

export function ProfileVirtualCard({
  email = 'admin@erp.com',
  username = 'Abu Salim',
}: ProfileVirtualCardProps) {
  const displayName = username || email.split('@')[0] || 'Abu Salim';

  return (
    <div className="space-y-4">
      {/* 1. Main Profile, Actions & Virtual Card Widget */}
      <div className="glass-card rounded-[24px] p-5 sm:p-6 border border-white/12 space-y-5 shadow-xl">
        {/* Top bar: Bell with red dot + 3-dots */}
        <div className="flex items-center justify-between">
          <div className="relative cursor-pointer" onClick={() => toast.info('3 new priority notifications')}>
            <Bell className="w-5 h-5 text-white/70 hover:text-white transition" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff6536] ring-2 ring-[#1e222e]" />
          </div>

          <button
            type="button"
            onClick={() => toast.info('Card and account settings menu')}
            className="text-white/50 hover:text-white transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Avatar & Exclusive Card Badge */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-[#ff6536] to-amber-400 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-[#161a26] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15 tracking-wide">
              Exclusive Card
            </span>
            <h4 className="text-base font-bold text-white tracking-tight capitalize">
              {displayName}
            </h4>
          </div>
        </div>

        {/* 4 Action Icons Row: Transfer, Receive, Bill, Top-Up */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/5">
          <button
            type="button"
            onClick={() => toast.info('Transfer ledger initialized')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-[#ff6536] transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-white/60 group-hover:text-white">
              Transfer
            </span>
          </button>

          <button
            type="button"
            onClick={() => toast.info('Receive payment QR & address ready')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-emerald-500 transition-all">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-white/60 group-hover:text-white">
              Receive
            </span>
          </button>

          <button
            type="button"
            onClick={() => toast.info('Bill statement generated')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-blue-500 transition-all">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-white/60 group-hover:text-white">
              Bill
            </span>
          </button>

          <button
            type="button"
            onClick={() => toast.info('Top-Up balance drawer opened')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-purple-500 transition-all">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-white/60 group-hover:text-white">
              Top-Up
            </span>
          </button>
        </div>

        {/* Textured Virtual VISA Card (Image 1 style) */}
        <div className="glass-visa-card rounded-[20px] p-5 h-44 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          {/* Subtle textured grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

          {/* Top Row: VISA Logo + Gold EMV Chip */}
          <div className="flex items-center justify-between relative z-10">
            <span className="italic font-black text-2xl tracking-tighter text-white/95 drop-shadow-md">
              VISA
            </span>

            {/* Gold EMV Chip */}
            <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-600/40 shadow-inner flex flex-col justify-between p-1">
              <div className="w-full h-[1px] bg-amber-800/40" />
              <div className="w-full flex justify-between">
                <div className="w-[1px] h-2.5 bg-amber-800/40" />
                <div className="w-2.5 h-2.5 rounded-full border border-amber-800/40" />
                <div className="w-[1px] h-2.5 bg-amber-800/40" />
              </div>
              <div className="w-full h-[1px] bg-amber-800/40" />
            </div>
          </div>

          {/* Bottom: Total Balance + Expiration */}
          <div className="flex items-end justify-between relative z-10 pt-2">
            <div className="space-y-0.5">
              <p className="text-[10px] text-white/50 tracking-wider">Total Balance</p>
              <p className="text-xl font-bold text-white tracking-tight">
                $654,987.23
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <p className="text-[10px] text-white/50">Expired</p>
              <p className="text-xs font-mono text-white/90 font-medium">07/24</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Last Transaction Card (Image 1 style) */}
      <div className="space-y-2.5">
        <h3 className="text-base font-bold text-white tracking-tight">
          Last Transaction
        </h3>

        <div className="glass-card rounded-[20px] p-4 border border-white/12 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5">
                <div className="w-full h-full rounded-full bg-[#181d2a] flex items-center justify-center text-white text-xs font-bold">
                  GA
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Gogo Ackerman</p>
                <p className="text-[10px] text-white/45">02-03-2022 12:02AM</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                + $900
              </span>
              <p className="text-[10px] text-white/45 mt-0.5">Bonus Salary</p>
            </div>
          </div>

          {/* See all Transaction Button */}
          <button
            type="button"
            onClick={() => toast.info('Viewing full transaction ledger history')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between text-xs font-medium text-white/80 hover:text-white transition group"
          >
            <span>See all Transaction</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
