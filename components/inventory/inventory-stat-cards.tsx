'use client';

import React from 'react';
import { Home, Tag, Users, ShieldCheck, Wallet, FileText, CheckCircle2 } from 'lucide-react';

interface InventoryStatCardsProps {
  availableCount: number;
  holdCount: number;
  bookedCount: number;
  jvCount: number;
  userRole?: string;
}

export function InventoryStatCards({
  availableCount,
  holdCount,
  bookedCount,
  jvCount,
  userRole,
}: InventoryStatCardsProps) {
  // If user is ACCOUNT, show financial & billing cards
  if (userRole === 'ACCOUNT') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Billed Allottees */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 block">
              BILLED ALLOTTEES (SOLD)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-0.5">
              {bookedCount} Units
            </div>
            <span className="text-[10px] text-rose-200/70">Agreements Executed</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Token Advance in Process */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
              TOKEN ADVANCE HELD
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-0.5">
              {holdCount} Flats
            </div>
            <span className="text-[10px] text-amber-200/70">Awaiting Agreement Registration</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Total Milestone Inflow */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
              TOTAL ESCROW INFLOW
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">
              ₹18.42 Cr
            </div>
            <span className="text-[10px] text-emerald-200/70">Milestone Collections YTD</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* MahaRERA Demands Due */}
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
              MAHARERA DEMANDS DUE
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-0.5">
              ₹46.00 L
            </div>
            <span className="text-[10px] text-purple-200/70">Slab-Linked Notices Due</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  // Standard developer / sales view for SUPER_ADMIN, ADMIN, SALES
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Available */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
            AVAILABLE
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">
            {availableCount}
          </div>
          <span className="text-[10px] text-emerald-200/70">Free Sale Inventory</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
          <Home className="w-5 h-5" />
        </div>
      </div>

      {/* Token / Hold */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
            TOKEN / HOLD
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-0.5">
            {holdCount}
          </div>
          <span className="text-[10px] text-amber-200/70">Advance In Process</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      {/* Booked / Sold */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 block">
            BOOKED / SOLD
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-0.5">
            {bookedCount}
          </div>
          <span className="text-[10px] text-rose-200/70">Agreements Done</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Investor / JV */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
            INVESTOR / JV
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-0.5">
            {jvCount}
          </div>
          <span className="text-[10px] text-cyan-200/70">Partner / Rehab Share</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
