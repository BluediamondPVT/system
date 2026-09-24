'use client';

import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';

interface InventoryFilterBarProps {
  statusFilter: 'ALL' | 'FREE_SALE' | 'JV';
  setStatusFilter: (filter: 'ALL' | 'FREE_SALE' | 'JV') => void;
  totalCount: number;
  freeSaleCount: number;
  jvCount: number;
  loading: boolean;
}

export function InventoryFilterBar({
  statusFilter,
  setStatusFilter,
  totalCount,
  freeSaleCount,
  jvCount,
  loading,
}: InventoryFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white/60 font-semibold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('FREE_SALE')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'FREE_SALE'
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          Free-Sale ({freeSaleCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('JV')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            statusFilter === 'JV'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          Investor JV / Rehab ({jvCount})
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-white/50">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
          <span>Syncing MongoDB units...</span>
        </div>
      )}
    </div>
  );
}
