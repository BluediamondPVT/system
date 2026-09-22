'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

export function GoalsProgressCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Left 6 Cols: Goals Section */}
      <div className="md:col-span-6 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Goals</h3>
          <button
            type="button"
            onClick={() => toast.info('Add Goals modal opened.')}
            className="text-xs text-white/50 hover:text-white transition font-medium"
          >
            Add Goals +
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: 78% Build a house */}
          <div className="glass-card rounded-[20px] p-4 sm:p-5 border border-white/12 flex flex-col justify-between h-36 shadow-lg">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                78%
              </span>
              {/* Coral Progress Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-[#ff6536] rounded-full shadow-[0_0_10px_rgba(255,101,54,0.6)]"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
            <p className="text-xs text-white/70 font-medium">Build a house</p>
          </div>

          {/* Card 2: 97% House Savings */}
          <div className="glass-card rounded-[20px] p-4 sm:p-5 border border-white/12 flex flex-col justify-between h-36 shadow-lg">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                97%
              </span>
              {/* Coral Progress Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-[#ff6536] rounded-full shadow-[0_0_10px_rgba(255,101,54,0.6)]"
                  style={{ width: '97%' }}
                />
              </div>
            </div>
            <p className="text-xs text-white/70 font-medium">House Savings</p>
          </div>
        </div>
      </div>

      {/* Right 6 Cols: Other Savings Section */}
      <div className="md:col-span-6 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Other Savings</h3>
        </div>

        {/* Other Savings Frosted Card */}
        <div className="glass-card rounded-[20px] p-4 sm:p-5 border border-white/12 flex items-center justify-between gap-4 h-36 shadow-lg">
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-white/50 font-medium">Business Savings</p>
            <p className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
              $439,456.23
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/25">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                53.6%
              </span>
            </div>
          </div>

          {/* 3-Bar Mini Chart: Feb, Mar, Apr */}
          <div className="flex items-end gap-2 h-20 shrink-0 pb-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-4 bg-[#ff6536] rounded-t-sm h-7 shadow-[0_0_8px_rgba(255,101,54,0.4)]" />
              <span className="text-[10px] text-white/40 font-medium">Feb</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-4 bg-[#ff6536] rounded-t-sm h-12 shadow-[0_0_8px_rgba(255,101,54,0.5)]" />
              <span className="text-[10px] text-white/40 font-medium">Mar</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-4 bg-[#ff6536] rounded-t-sm h-16 shadow-[0_0_10px_rgba(255,101,54,0.6)]" />
              <span className="text-[10px] text-white/40 font-medium">Apr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
