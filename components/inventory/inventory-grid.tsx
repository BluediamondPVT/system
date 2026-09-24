'use client';

import React from 'react';
import { InventoryUnit } from '@/lib/ashapura-data';
import { Building2, Plus } from 'lucide-react';

interface InventoryGridProps {
  floors: number[];
  unitColumnIndices: number[];
  getUnit: (floor: number, unitIdx: number) => InventoryUnit | undefined;
  statusFilter: 'ALL' | 'FREE_SALE' | 'JV';
  onSelectUnit: (unit: InventoryUnit) => void;
  activeWing: string;
  projectName: string;
  userRole?: string;
  onOpenAddUnit: () => void;
}

export function InventoryGrid({
  floors,
  unitColumnIndices,
  getUnit,
  statusFilter,
  onSelectUnit,
  activeWing,
  projectName,
  userRole,
  onOpenAddUnit,
}: InventoryGridProps) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 shadow-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
        <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
          {userRole === 'ACCOUNT' ? (
            <>
              <span className="text-purple-300 font-bold">
                {activeWing} • Allottee Billing &amp; Demand Matrix
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Finance Mode
              </span>
            </>
          ) : (
            <span>{activeWing} • Floor-Wise Architectural Grid</span>
          )}
        </div>
        {/* Status Badges Legend */}
        <div className="flex items-center gap-3 text-[11px] text-white/70 flex-wrap">
          {userRole === 'ACCOUNT' ? (
            <>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Unsold
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Token Deposited
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Agreement Billed (Sold)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Society Rehab Quota
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Token / Hold
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Sold
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Investor / Rehab
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stacking Grid Table */}
      <div className="overflow-x-auto custom-glass-scroll">
        {floors.length === 0 ? (
          <div className="py-14 px-4 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                No flats registered in {activeWing} yet
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                &quot;{projectName}&quot; is a new site with 0 flats in database. Click below to add your first flat!
              </p>
            </div>
            {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
              <button
                type="button"
                onClick={onOpenAddUnit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Flat to {activeWing}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="min-w-[760px] space-y-2">
            {/* Column Header */}
            <div
              className="grid gap-2 text-xs font-bold text-white/50 uppercase tracking-wider pb-1 px-1"
              style={{
                gridTemplateColumns: `90px repeat(${unitColumnIndices.length}, minmax(0, 1fr))`,
              }}
            >
              <div>FLOOR</div>
              {unitColumnIndices.map((idx) => (
                <div key={idx}>UNIT 0{idx}</div>
              ))}
            </div>

            {/* Floor Rows */}
            {floors.map((floor) => (
              <div
                key={floor}
                className="grid gap-2 items-center p-1.5 rounded-xl hover:bg-white/[0.02] transition-colors"
                style={{
                  gridTemplateColumns: `90px repeat(${unitColumnIndices.length}, minmax(0, 1fr))`,
                }}
              >
                {/* Floor Label */}
                <div className="text-xs font-bold text-white/80 pl-2">
                  Floor {floor}
                </div>

                {/* Units per floor */}
                {unitColumnIndices.map((uIdx) => {
                  const unit = getUnit(floor, uIdx);
                  if (!unit) {
                    return <div key={uIdx} className="h-14 rounded-xl bg-white/[0.02]" />;
                  }

                  // Check filter
                  if (statusFilter === 'JV' && unit.status !== 'JV') {
                    return (
                      <div
                        key={uIdx}
                        className="h-14 rounded-xl border border-white/5 bg-white/[0.02] opacity-30 flex items-center justify-center text-[10px] text-white/30 font-mono"
                      >
                        {unit.unitNumber}
                      </div>
                    );
                  }
                  if (statusFilter === 'FREE_SALE' && unit.status === 'JV') {
                    return (
                      <div
                        key={uIdx}
                        className="h-14 rounded-xl border border-white/5 bg-white/[0.02] opacity-30 flex items-center justify-center text-[10px] text-white/30 font-mono"
                      >
                        {unit.unitNumber}
                      </div>
                    );
                  }

                  // Styling by status
                  const isAvail = unit.status === 'Available';
                  const isHold = unit.status === 'Hold';
                  const isBooked = unit.status === 'Booked';

                  return (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => onSelectUnit(unit)}
                      className={`relative p-2 rounded-xl text-left transition-all duration-200 group hover:scale-[1.03] hover:shadow-lg cursor-pointer border ${
                        isAvail
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
                          : isHold
                          ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-200'
                          : isBooked
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-200'
                          : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold tracking-tight">
                          {unit.unitNumber}
                        </span>
                        <span className="text-[9px] font-bold opacity-80 uppercase">
                          {unit.typology}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] mt-1 opacity-70">
                        <span>{unit.carpetAreaSqft} sqft</span>
                        <span className="font-semibold">
                          {userRole === 'ACCOUNT' && isBooked ? 'Agreement Done' : unit.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
