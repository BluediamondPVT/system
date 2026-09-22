'use client';

import React, { useState } from 'react';
import { useProject } from '@/lib/project-context';
import { InventoryUnit } from '@/lib/ashapura-data';
import {
  Home,
  Tag,
  Users,
  ShieldCheck,
  Filter,
  FileSpreadsheet,
  X,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InventoryMatrixPage() {
  const router = useRouter();
  const {
    activeProject,
    inventory,
    updateUnitStatus,
    setSelectedQuotationUnit,
  } = useProject();

  const [activeWing, setActiveWing] = useState<'Wing A' | 'Wing B'>('Wing A');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FREE_SALE' | 'JV'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<InventoryUnit | null>(null);
  const [tokenHolderName, setTokenHolderName] = useState('');

  // Calculate live counts
  const availableCount = inventory.filter((u) => u.status === 'Available').length;
  const holdCount = inventory.filter((u) => u.status === 'Hold').length;
  const bookedCount = inventory.filter((u) => u.status === 'Booked').length;
  const jvCount = inventory.filter((u) => u.status === 'JV').length;
  const totalCount = inventory.length;

  // Floors: 15 down to 1
  const floors = Array.from(
    new Set(inventory.map((u) => u.floor))
  ).sort((a, b) => b - a);

  // Filter units
  const getUnit = (floor: number, unitIdx: number) => {
    const unitNum = `${floor}${unitIdx < 10 ? '0' + unitIdx : unitIdx}`;
    return inventory.find((u) => u.floor === floor && u.unitNumber === unitNum);
  };

  const handleHoldToken = () => {
    if (!selectedUnit) return;
    if (selectedUnit.status === 'Hold') {
      updateUnitStatus(selectedUnit.id, 'Available');
    } else {
      updateUnitStatus(
        selectedUnit.id,
        'Hold',
        tokenHolderName || 'Direct Token Advance'
      );
    }
    setSelectedUnit(null);
    setTokenHolderName('');
  };

  const handleGenerateQuotation = () => {
    if (!selectedUnit) return;
    setSelectedQuotationUnit(selectedUnit);
    router.push('/dashboard/documents');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Wing Switcher */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeProject.name}
            </h1>
            {activeProject.tag && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                {activeProject.tag}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            {activeProject.location} • {activeProject.totalFloors} Floors Matrix • Total {activeProject.freeSaleUnits} Units in Project
          </p>
        </div>

        {/* Wing Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.06] border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveWing('Wing A')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeWing === 'Wing A'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Wing A
          </button>
          <button
            type="button"
            onClick={() => setActiveWing('Wing B')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeWing === 'Wing B'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Wing B
          </button>
        </div>
      </div>

      {/* 2. Four Stat Cards */}
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
            <span className="text-[10px] text-cyan-200/70">Partner Share</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-white/60 font-semibold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
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
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            statusFilter === 'FREE_SALE'
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          Free-Sale ({availableCount + holdCount + bookedCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('JV')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            statusFilter === 'JV'
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          Investor JV ({jvCount})
        </button>
      </div>

      {/* 4. Floor-by-Floor Architectural Grid */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
          <div className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>{activeWing} • Floor-Wise Architectural Grid</span>
          </div>
          {/* Status Badges Legend */}
          <div className="flex items-center gap-3 text-[11px] text-white/70 flex-wrap">
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
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Investor
            </span>
          </div>
        </div>

        {/* Stacking Grid Table */}
        <div className="overflow-x-auto custom-glass-scroll">
          <div className="min-w-[760px] space-y-2">
            {/* Column Header */}
            <div className="grid grid-cols-6 gap-2 text-xs font-bold text-white/50 uppercase tracking-wider pb-1 px-1">
              <div>FLOOR</div>
              <div>UNIT 01</div>
              <div>UNIT 02</div>
              <div>UNIT 03</div>
              <div>UNIT 04</div>
              <div>UNIT 05</div>
            </div>

            {/* Floor Rows */}
            {floors.map((floor) => (
              <div
                key={floor}
                className="grid grid-cols-6 gap-2 items-center p-1.5 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                {/* Floor Label */}
                <div className="text-xs font-bold text-white/80 pl-2">
                  Floor {floor}
                </div>

                {/* 5 Units per floor */}
                {[1, 2, 3, 4, 5].map((uIdx) => {
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
                      onClick={() => setSelectedUnit(unit)}
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
                        <span className="font-semibold">{unit.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Unit Details Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/20 shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Flat #{selectedUnit.unitNumber}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      selectedUnit.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : selectedUnit.status === 'Hold'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        : selectedUnit.status === 'Booked'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                    }`}
                  >
                    {selectedUnit.status}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  {activeProject.name} • Floor {selectedUnit.floor} ({selectedUnit.wing})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Sheet Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
              <div>
                <span className="text-white/40 block text-[10px]">Typology:</span>
                <span className="font-bold text-white text-sm">{selectedUnit.typology}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">Carpet Area (RERA):</span>
                <span className="font-bold text-white text-sm">
                  {selectedUnit.carpetAreaSqft} sq.ft
                </span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">Base Rate:</span>
                <span className="font-bold text-blue-400 text-sm">
                  ₹{selectedUnit.basePricePerSqft.toLocaleString('en-IN')}/sqft
                </span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">Estimated Value:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ₹{(
                    (selectedUnit.carpetAreaSqft * selectedUnit.basePricePerSqft) /
                    10000000
                  ).toFixed(2)}{' '}
                  Cr
                </span>
              </div>
            </div>

            {/* Token Holder Name if Hold */}
            {selectedUnit.status === 'Hold' && selectedUnit.tokenHolder && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <span className="font-bold block">Token Advance Holder:</span>
                <span>{selectedUnit.tokenHolder}</span>
                {selectedUnit.tokenDate && (
                  <span className="text-[10px] text-amber-300/60 block mt-0.5">
                    Logged: {selectedUnit.tokenDate}
                  </span>
                )}
              </div>
            )}

            {/* Token Input if making Hold */}
            {selectedUnit.status === 'Available' && (
              <div>
                <label className="text-[11px] text-white/70 block mb-1">
                  Assign Token Holder Name / Contact:
                </label>
                <input
                  type="text"
                  value={tokenHolderName}
                  onChange={(e) => setTokenHolderName(e.target.value)}
                  placeholder="e.g. Rahul Verma (+91 98200...)"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleHoldToken}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  selectedUnit.status === 'Hold'
                    ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>
                  {selectedUnit.status === 'Hold' ? 'Release Hold' : 'Hold Unit (Token)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleGenerateQuotation}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Generate Quotation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
