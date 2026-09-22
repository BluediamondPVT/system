'use client';

import React from 'react';
import { useProject } from '@/lib/project-context';
import {
  Building,
  Home,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export function ExecutiveDashboardView() {
  const { projects, activeProject, setActiveProjectById } = useProject();

  return (
    <div className="space-y-6">
      {/* 1. Executive Master Console Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-white/10 bg-gradient-to-r from-slate-950/80 via-blue-950/50 to-slate-900/80 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#ff6536]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Ashapura Builders ERP Master Console
              </span>
              <span className="text-white/40 text-xs">• Mumbai & Palghar Division</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Super Admin Executive Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Enterprise management covering Society Redevelopment Tie-ups (CHSL/SRA),
              Free-Sale High Rises, Suburban Townships &amp; Investor Portfolios.
            </p>
          </div>

          {/* Right HO Operations Card */}
          <div className="shrink-0 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Central Operations Malad HO
              </div>
              <div className="text-[11px] text-white/50">
                101 Jay Gagan, Liberty Garden
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: 27 Sites */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
              +4 JV Sites <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            27 Sites
          </div>
          <div className="text-xs font-semibold text-white/80 mt-1">Portfolio Projects</div>
          <div className="text-[11px] text-white/50 mt-0.5">8 Ongoing • 13 Upcoming Redevelopments</div>
        </div>

        {/* KPI 2: 450+ Units */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Home className="w-5 h-5 text-purple-400" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
              +12% QoQ <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            450+ Units
          </div>
          <div className="text-xs font-semibold text-white/80 mt-1">Active Units Under Const.</div>
          <div className="text-[11px] text-white/50 mt-0.5">Free Sale + Society Rehab Quota</div>
        </div>

        {/* KPI 3: ₹18.42 Cr */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
              +16.8% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ₹18.42 Cr
          </div>
          <div className="text-xs font-semibold text-white/80 mt-1">Total Milestone Collections</div>
          <div className="text-[11px] text-white/50 mt-0.5">YTD Collections Across Clusters</div>
        </div>

        {/* KPI 4: 312 Leads */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between pb-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6536]/20 border border-[#ff6536]/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#ff6536]" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
              +22% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            312 Leads
          </div>
          <div className="text-xs font-semibold text-white/80 mt-1">Active Inquiries &amp; Visits</div>
          <div className="text-[11px] text-white/50 mt-0.5">Goregaon, Malad &amp; Palghar Desk</div>
        </div>
      </div>

      {/* 3. Ashapura Builders Active Sites & Tie-Ups Grid */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ashapura Builders Active Sites &amp; Tie-Ups
            </h2>
            <p className="text-xs text-white/60">
              Switch project to inspect dedicated inventory matrix, society rehab allotments and cost sheets
            </p>
          </div>
          <Link
            href="/dashboard/inventory"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>Open Full Matrix</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const isCurrent = proj.id === activeProject.id;
            return (
              <div
                key={proj.id}
                onClick={() => setActiveProjectById(proj.id)}
                className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                  isCurrent
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/40'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header: Dot + Title + Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isCurrent ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-emerald-400'
                      }`}
                    />
                    <h3 className="text-sm font-bold text-white tracking-tight truncate">
                      {proj.name}
                    </h3>
                  </div>
                  {proj.tag && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shrink-0">
                      {proj.tag}
                    </span>
                  )}
                </div>

                {/* Location */}
                <p className="text-xs text-white/50 mt-1 truncate">
                  📍 {proj.location}
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 block">Floors &amp; Wings:</span>
                    <span className="font-medium text-white truncate block">
                      {proj.floorsAndWings}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">Base Price:</span>
                    <span className="font-bold text-blue-400 truncate block">
                      ₹{proj.basePricePerSqft.toLocaleString('en-IN')}/sqft
                    </span>
                  </div>
                </div>

                {/* Rehab / Free-Sale pill */}
                {proj.rehabMembers ? (
                  <div className="mt-3 p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-purple-300 font-medium">
                      Rehab Members: {proj.rehabMembers}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      Free Sale: {proj.freeSaleUnits}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Status: {proj.status}</span>
                    <span className="text-emerald-400 font-medium">
                      Units: {proj.freeSaleUnits}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
