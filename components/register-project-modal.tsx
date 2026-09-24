'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useProject } from '@/lib/project-context';
import { createProjectAction } from '@/app/actions/project';
import {
  Building2,
  X,
  Plus,
  Loader2,
  MapPin,
  Layers,
  IndianRupee,
  ShieldCheck,
  Tag,
  Home,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface RegisterProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT';
}

const emptySubscribe = () => () => {};

export function RegisterProjectModal({
  isOpen,
  onClose,
  userRole,
}: RegisterProjectModalProps) {
  const router = useRouter();
  const { addProject, setActiveProjectById } = useProject();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tag: 'Free-Sale' as 'Free-Sale' | 'CHSL' | 'SRA' | 'JV',
    location: '',
    zone: 'Western Suburbs',
    totalFloors: '',
    wings: '',
    basePricePerSqft: '',
    rehabMembers: '',
    freeSaleUnits: '',
    reraNumber: '',
    status: 'Ongoing' as 'Ongoing' | 'Upcoming' | 'Completed',
    description: '',
  });

  // Reset form whenever modal opens so it's always clean and empty
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        tag: 'Free-Sale',
        location: '',
        zone: 'Western Suburbs',
        totalFloors: '',
        wings: '',
        basePricePerSqft: '',
        rehabMembers: '',
        freeSaleUnits: '',
        reraNumber: '',
        status: 'Ongoing',
        description: '',
      });
    }
  }, [isOpen]);

  // Strict role guard: only SUPER_ADMIN can view or use this modal
  if (!isOpen || userRole !== 'SUPER_ADMIN' || !mounted) {
    return null;
  }

  // Derived live estimations
  const totalUnits = Number(formData.freeSaleUnits || 0) + Number(formData.rehabMembers || 0);
  const avgSqft = 750; // standard 2BHK Mumbai carpet benchmark
  const estGrossCr = (
    (Number(formData.freeSaleUnits || 0) * avgSqft * Number(formData.basePricePerSqft || 0)) /
    10000000
  ).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.location.trim()) {
      toast.error('Project Name and Location are required.');
      return;
    }

    if (!formData.wings.trim()) {
      toast.error('At least one wing (e.g. Wing A) is required.');
      return;
    }

    if (Number(formData.totalFloors) < 1) {
      toast.error('Total building floors must be 1 or higher.');
      return;
    }

    if (Number(formData.basePricePerSqft) <= 0) {
      toast.error('Base price per sqft must be greater than zero.');
      return;
    }

    if (Number(formData.freeSaleUnits) <= 0) {
      toast.error('Free-sale units count must be at least 1.');
      return;
    }

    setLoading(true);

    try {
      const parsedWings = formData.wings
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);

      const wingsList = parsedWings.length > 0 ? parsedWings : ['Wing A'];
      const floorsAndWingsStr = `${formData.totalFloors} Floors (${wingsList.join(', ')})`;

      const res = await createProjectAction({
        name: formData.name.trim(),
        tag: formData.tag,
        location: formData.location.trim(),
        zone: formData.zone,
        floorsAndWings: floorsAndWingsStr,
        totalFloors: Number(formData.totalFloors),
        wings: wingsList,
        basePricePerSqft: Number(formData.basePricePerSqft),
        rehabMembers: Number(formData.rehabMembers) || 0,
        freeSaleUnits: Number(formData.freeSaleUnits),
        reraNumber: formData.reraNumber.trim() || undefined,
        status: formData.status,
        description: formData.description.trim() || undefined,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to create project in database');
        return;
      }

      toast.success(res.message || `Project "${formData.name}" created successfully!`);

      // Dynamically update the global state so it appears in dropdown immediately
      if (res.project && addProject) {
        addProject(res.project);
        setActiveProjectById(res.project.id);
      }

      // Revalidate Next.js server components
      router.refresh();

      // Reset form & close modal
      setFormData({
        name: '',
        tag: 'Free-Sale',
        location: '',
        zone: 'Western Suburbs',
        totalFloors: '',
        wings: '',
        basePricePerSqft: '',
        rehabMembers: '',
        freeSaleUnits: '',
        reraNumber: '',
        status: 'Ongoing',
        description: '',
      });

      onClose();
    } catch (err: unknown) {
      console.error('Error submitting new project:', err);
      toast.error('Network error while saving project.');
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
      <div className="w-full max-w-2xl rounded-3xl glass-card border border-white/20 shadow-2xl p-5 sm:p-7 space-y-6 my-auto max-h-[92vh] overflow-y-auto custom-glass-scroll bg-[#121622]/95 backdrop-blur-3xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/25 to-[#ff6536]/25 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-md">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Register New Project
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Populate architectural specifications &amp; commercial terms into MongoDB Atlas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Total Units</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {totalUnits > 0 ? `${totalUnits} Units` : '0 Units'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Est. Free-Sale GDV</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              {Number(estGrossCr) > 0 ? `₹${estGrossCr} Cr*` : '₹0.00 Cr*'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block">Category Model</span>
            <span className="text-sm font-bold text-purple-300 mt-0.5 block">
              {formData.tag}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Project Name & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-white/70 font-medium block">
                Project Commercial Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalyan Heights CHSL"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Project Tag <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <select
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tag: e.target.value as 'Free-Sale' | 'CHSL' | 'SRA' | 'JV',
                    })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1a1f2c] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition appearance-none cursor-pointer"
                >
                  <option value="Free-Sale">Free-Sale High Rise</option>
                  <option value="CHSL">CHSL Redevelopment</option>
                  <option value="SRA">SRA Rehabilitation</option>
                  <option value="JV">JV (Joint Venture)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Location & Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Location (Neighborhood &amp; City) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Malad West, Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">Geographic Zone</label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1f2c] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition appearance-none cursor-pointer"
              >
                <option value="Western Suburbs">Western Suburbs (Malad, Goregaon, Borivali)</option>
                <option value="Eastern Suburbs">Eastern Suburbs (Bhandup, Ghatkopar, Mulund)</option>
                <option value="Palghar District">Palghar District (Suburban Township)</option>
                <option value="South Mumbai">South Mumbai (Town Area)</option>
                <option value="Thane Division">Thane Division</option>
              </select>
            </div>
          </div>

          {/* Row 3: Building Architecture (Floors & Wings) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Total Building Floors <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  max={60}
                  required
                  placeholder="e.g. 15"
                  value={formData.totalFloors}
                  onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Tower Wings (Comma separated) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wing A, Wing B"
                value={formData.wings}
                onChange={(e) => setFormData({ ...formData, wings: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Row 4: Commercial Terms & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Base Rate / Sqft (₹) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="number"
                  min={1000}
                  step={100}
                  required
                  placeholder="e.g. 22000"
                  value={formData.basePricePerSqft}
                  onChange={(e) =>
                    setFormData({ ...formData, basePricePerSqft: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">
                Free-Sale Units <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="e.g. 80"
                  value={formData.freeSaleUnits}
                  onChange={(e) =>
                    setFormData({ ...formData, freeSaleUnits: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">Rehab Allottees (Society)</label>
              <input
                type="number"
                min={0}
                placeholder="0 (if Free-Sale)"
                value={formData.rehabMembers}
                onChange={(e) =>
                  setFormData({ ...formData, rehabMembers: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>

          {/* Row 5: MahaRERA Number & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-white/70 font-medium block">MahaRERA Registration Number</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. P51800028914"
                  value={formData.reraNumber}
                  onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-medium block">Construction Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Ongoing' | 'Upcoming' | 'Completed',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1f2c] border border-white/15 text-white focus:outline-none focus:border-blue-400 transition appearance-none cursor-pointer"
              >
                <option value="Ongoing">Ongoing Construction</option>
                <option value="Upcoming">Upcoming Launch</option>
                <option value="Completed">Ready Possession (Completed)</option>
              </select>
            </div>
          </div>

          {/* Row 6: Project Description / Highlights */}
          <div className="space-y-1">
            <label className="text-white/70 font-medium block">Project Overview / Amenities</label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
              <textarea
                rows={2}
                placeholder="e.g. Premium high-rise tower with automated podium parking, gymnasium, and rapid link to Western Express Highway."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 transition text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white/70 hover:text-white font-medium transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6536] to-[#ff8555] hover:from-[#ff7546] hover:to-[#ff9565] text-white font-bold shadow-lg shadow-[#ff6536]/25 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering to MongoDB...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Register Project</span>
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
