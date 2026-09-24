'use client';

import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

interface InventoryHeaderProps {
  projectName: string;
  projectTag?: string;
  location: string;
  totalFloors: number;
  freeSaleUnits: number;
  availableWings: string[];
  activeWing: string;
  onSelectWing: (wing: string) => void;
  userRole?: string;
  onOpenAddUnit: () => void;
}

export function InventoryHeader({
  projectName,
  projectTag,
  location,
  totalFloors,
  freeSaleUnits,
  availableWings,
  activeWing,
  onSelectWing,
  userRole,
  onOpenAddUnit,
}: InventoryHeaderProps) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {projectName}
          </h1>
          {projectTag && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              {projectTag}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-400" /> MongoDB Live Stacking
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          {location} • {totalFloors} Floors Matrix • Total {freeSaleUnits} Units in Project
        </p>
      </div>

      {/* Dynamic Wing Switcher & Add Flat Action */}
      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <div className="flex items-center p-1 rounded-xl bg-white/[0.06] border border-white/10 shrink-0 gap-1 flex-wrap">
          {availableWings.map((w) => {
            const isWingSelected = activeWing === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => onSelectWing(w)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isWingSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>

        {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
          <button
            type="button"
            onClick={onOpenAddUnit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer shrink-0 border border-blue-400/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Flat</span>
          </button>
        )}

        {userRole === 'ACCOUNT' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Billing Verification (Read-Only)
          </span>
        )}

        {userRole === 'SALES' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Sales &amp; Token Hold Desk
          </span>
        )}
      </div>
    </div>
  );
}
