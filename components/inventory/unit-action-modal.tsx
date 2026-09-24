'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { InventoryUnit } from '@/lib/ashapura-data';
import Link from 'next/link';
import {
  X,
  Tag,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Loader2,
  PlusCircle,
} from 'lucide-react';

interface UnitActionModalProps {
  unit: InventoryUnit | null;
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  userRole?: string;
  actionLoading: boolean;
  onHoldToken: (name: string, amount: number, phone?: string) => Promise<void>;
  onReleaseHold: () => Promise<void>;
  onConfirmBooking: (buyerName: string) => Promise<void>;
  onCancelBooking: () => Promise<void>;
}

const emptySubscribe = () => () => {};

export function UnitActionModal({
  unit,
  isOpen,
  onClose,
  projectName,
  userRole,
  actionLoading,
  onHoldToken,
  onReleaseHold,
  onConfirmBooking,
  onCancelBooking,
}: UnitActionModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [tokenHolderName, setTokenHolderName] = useState('');
  const [tokenAmount, setTokenAmount] = useState('100000');
  const [tokenPhone, setTokenPhone] = useState('');

  if (!isOpen || !unit || !mounted) {
    return null;
  }

  const estGrossCr = (
    (unit.carpetAreaSqft * unit.basePricePerSqft) /
    10000000
  ).toFixed(2);

  const handleHoldClick = () => {
    onHoldToken(tokenHolderName, Number(tokenAmount) || 100000, tokenPhone);
  };

  const handleConfirmClick = () => {
    onConfirmBooking(tokenHolderName);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="w-full max-w-md rounded-3xl glass-card border border-white/20 shadow-2xl p-6 space-y-5 bg-[#121622]/95 backdrop-blur-3xl my-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Flat #{unit.unitNumber}
              </h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  unit.status === 'Available'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : unit.status === 'Hold'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : unit.status === 'Booked'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                }`}
              >
                {unit.status}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              {projectName} • Floor {unit.floor} ({unit.wing})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spec Sheet Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
          <div>
            <span className="text-white/40 block text-[10px]">Typology:</span>
            <span className="font-bold text-white text-sm">{unit.typology}</span>
          </div>
          <div>
            <span className="text-white/40 block text-[10px]">Carpet Area (RERA):</span>
            <span className="font-bold text-white text-sm">
              {unit.carpetAreaSqft} sq.ft
            </span>
          </div>
          <div>
            <span className="text-white/40 block text-[10px]">Base Rate:</span>
            <span className="font-bold text-blue-400 text-sm">
              ₹{unit.basePricePerSqft.toLocaleString('en-IN')}/sqft
            </span>
          </div>
          <div>
            <span className="text-white/40 block text-[10px]">Estimated Value:</span>
            <span className="font-bold text-emerald-400 text-sm">
              ₹{estGrossCr} Cr
            </span>
          </div>
        </div>

        {/* Token Holder Info if Hold */}
        {unit.status === 'Hold' && unit.tokenHolder && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Tag className="w-3.5 h-3.5" /> Token Advance Holder:
              </span>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md font-bold">
                Active Hold
              </span>
            </div>
            <p className="font-semibold text-white text-sm">{unit.tokenHolder}</p>
            {unit.tokenDate && (
              <p className="text-[11px] text-amber-300/70">
                Hold Date: {unit.tokenDate}
              </p>
            )}
          </div>
        )}

        {/* Booked / Sold Info if Booked */}
        {unit.status === 'Booked' && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-rose-300">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                Officially Booked &amp; Sold
              </span>
              <span className="text-[10px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-md font-bold">
                Agreed Sale
              </span>
            </div>
            <p className="font-semibold text-white text-sm">
              {unit.tokenHolder || 'Registered Buyer Allottee'}
            </p>
            <p className="text-[11px] text-rose-200/70">
              Agreement for Sale executed • Linked to MahaRERA milestone demands.
            </p>
          </div>
        )}

        {/* JV / Rehab Info if JV */}
        {unit.status === 'JV' && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                JV / Society Rehab Allottee
              </span>
              <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md font-bold">
                Partner Quota
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/70">
              Allocated to original society member / partner. Excluded from commercial sales.
            </p>
          </div>
        )}

        {/* Account Role Read-Only Banner */}
        {userRole === 'ACCOUNT' && (
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Accounts Verification Mode (Read-Only)</span>
              <span className="text-[11px] text-purple-200/70">
                Unit specifications and allottee details are for MahaRERA milestone billing notice preparation. Unit status adjustments are restricted to Sales &amp; Admin desks.
              </span>
            </div>
          </div>
        )}

        {/* Token Inputs if making Hold (Disabled for ACCOUNT desk) */}
        {unit.status === 'Available' && userRole !== 'ACCOUNT' && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[11px] text-white/70 block mb-1 font-medium">
                Assign Token Holder / Prospect Name:
              </label>
              <input
                type="text"
                value={tokenHolderName}
                onChange={(e) => setTokenHolderName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-white/70 block mb-1 font-medium">
                  Token Amount (₹):
                </label>
                <input
                  type="number"
                  step={10000}
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/70 block mb-1 font-medium">
                  Contact Phone:
                </label>
                <input
                  type="text"
                  value={tokenPhone}
                  onChange={(e) => setTokenPhone(e.target.value)}
                  placeholder="+91 98200..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* 1. If Unit is on HOLD: show Confirm Booking and Release Hold (for Non-Account) */}
          {unit.status === 'Hold' && userRole !== 'ACCOUNT' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmClick}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-400/30 disabled:opacity-60"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-200" />
                    <span>Confirm Booking (Mark Sold)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onReleaseHold}
                disabled={actionLoading}
                className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white border border-white/10 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-60"
              >
                <X className="w-3.5 h-3.5" />
                <span>Release Hold</span>
              </button>
            </div>
          )}

          {/* 2. If Unit is AVAILABLE: show Hold Token and Direct Book (for Non-Account) */}
          {unit.status === 'Available' && userRole !== 'ACCOUNT' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHoldClick}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-3.5 h-3.5" />
                    <span>Hold Unit (Token Advance)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleConfirmClick}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Direct Book (Sold)</span>
              </button>
            </div>
          )}

          {/* 3. If Unit is BOOKED: option for Admin/SuperAdmin to cancel/re-open */}
          {unit.status === 'Booked' && (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
            <button
              type="button"
              onClick={onCancelBooking}
              disabled={actionLoading}
              className="w-full py-2 rounded-xl text-[11px] font-semibold text-rose-300/80 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Cancel Booking &amp; Re-open Flat as Available</span>
            </button>
          )}

          {/* Accountant Milestone Demand Trigger */}
          {userRole === 'ACCOUNT' && (
            <Link
              href="/dashboard/accounts"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-emerald-400/30"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Trigger Milestone Demand for Flat #{unit.unitNumber}</span>
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
