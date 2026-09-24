'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { createInventoryUnitAction } from '@/app/actions/inventory';
import { InventoryUnit } from '@/lib/ashapura-data';
import {
  Building2,
  X,
  Plus,
  Loader2,
  Layers,
  IndianRupee,
  Home,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const emptySubscribe = () => () => {};

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string;
  projectName: string;
  currentWing: string;
  availableWings: string[];
  baseRate: number;
  userRole?: string;
  onUnitCreated: (unit: InventoryUnit) => void;
}

export function AddUnitModal({
  isOpen,
  onClose,
  projectSlug,
  projectName,
  currentWing,
  availableWings,
  baseRate,
  userRole,
  onUnitCreated,
}: AddUnitModalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wing: currentWing || availableWings[0] || 'Wing A',
    floor: 1,
    unitNumber: '101',
    typology: '2BHK' as '1BHK' | '2BHK' | '3BHK' | 'JODI',
    carpetAreaSqft: 740,
    basePricePerSqft: baseRate || 16500,
    status: 'Available' as 'Available' | 'JV',
  });

  // Sync form values whenever modal opens or active project/wing changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        wing: currentWing || availableWings[0] || 'Wing A',
        floor: 1,
        unitNumber: '101',
        typology: '2BHK',
        carpetAreaSqft: 740,
        basePricePerSqft: baseRate || 16500,
        status: 'Available',
      });
    }
  }, [isOpen, currentWing, availableWings, baseRate]);

  // Strict role guard: only SUPER_ADMIN or ADMIN can add units
  if (!isOpen || (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') || !mounted) {
    return null;
  }

  const estGrossCr = (
    (Number(formData.carpetAreaSqft || 0) * Number(formData.basePricePerSqft || 0)) /
    10000000
  ).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.unitNumber.trim()) {
      toast.error('Flat/Unit number is required.');
      return;
    }

    if (Number(formData.floor) < 1) {
      toast.error('Floor must be 1 or higher.');
      return;
    }

    if (Number(formData.carpetAreaSqft) <= 0) {
      toast.error('Carpet area must be greater than zero.');
      return;
    }

    setLoading(true);

    try {
      const res = await createInventoryUnitAction({
        projectSlug,
        wing: formData.wing,
        floor: Number(formData.floor),
        unitNumber: formData.unitNumber.trim(),
        typology: formData.typology,
        carpetAreaSqft: Number(formData.carpetAreaSqft),
        basePricePerSqft: Number(formData.basePricePerSqft),
        status: formData.status,
      });

      if (!res.success || !res.unit) {
        toast.error(res.error || 'Failed to create unit in database.');
        return;
      }

      toast.success(res.message || `Flat #${formData.unitNumber} created successfully!`);
      onUnitCreated(res.unit);
      onClose();
    } catch (err: unknown) {
      console.error('Error submitting flat:', err);
      toast.error('Network error creating flat in database.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 z-[9999] animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-3xl glass-card border border-white/20 shadow-2xl p-5 sm:p-6 space-y-5 bg-[#121622]/95 backdrop-blur-3xl my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/25 to-[#ff6536]/25 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-md">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Add New Flat / Unit</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {userRole}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                {projectName} • Save inventory unit to MongoDB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calculation Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">Selected Unit</span>
            <span className="text-sm font-bold text-white">
              Flat #{formData.unitNumber} ({formData.typology})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/40 uppercase block">Est. Agreement Value</span>
            <span className="text-sm font-bold text-emerald-400">₹{estGrossCr} Cr*</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Wing & Floor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Tower / Wing <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.wing}
                onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1f2c] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition appearance-none cursor-pointer"
              >
                {availableWings.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Floor Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  max={60}
                  required
                  value={formData.floor}
                  onChange={(e) => {
                    const fl = Number(e.target.value);
                    const suggestedNum = `${fl}01`;
                    setFormData({ ...formData, floor: fl, unitNumber: suggestedNum });
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Unit Number & Typology */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Unit / Flat Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 401, 1402"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Typology <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <select
                  value={formData.typology}
                  onChange={(e) => {
                    const typ = e.target.value as '1BHK' | '2BHK' | '3BHK' | 'JODI';
                    let defaultSqft = 740;
                    if (typ === '1BHK') defaultSqft = 485;
                    else if (typ === '3BHK') defaultSqft = 1080;
                    else if (typ === 'JODI') defaultSqft = 1450;
                    setFormData({ ...formData, typology: typ, carpetAreaSqft: defaultSqft });
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1a1f2c] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition appearance-none cursor-pointer"
                >
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                  <option value="JODI">JODI Unit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Carpet Area & Base Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Carpet Area (RERA sqft) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={100}
                required
                value={formData.carpetAreaSqft}
                onChange={(e) =>
                  setFormData({ ...formData, carpetAreaSqft: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Base Rate / sqft (₹) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="number"
                  min={1000}
                  step={100}
                  required
                  value={formData.basePricePerSqft}
                  onChange={(e) =>
                    setFormData({ ...formData, basePricePerSqft: Number(e.target.value) })
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Initial Status */}
          <div className="space-y-1">
            <label className="text-white/70 font-medium block">Inventory Quota / Status</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'Available' | 'JV' })
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1a1f2c] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition appearance-none cursor-pointer"
              >
                <option value="Available">Available (Free-Sale Builder Quota)</option>
                <option value="JV">JV / Society Rehab Allottee Flat</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white/70 hover:text-white font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/25 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Flat to Matrix</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
