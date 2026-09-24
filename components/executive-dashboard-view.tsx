'use client';

import React, { useState } from 'react';
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
  Plus,
  Grid3X3,
  UserCog,
  Wallet,
  FileText,
  UserPlus,
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  Clock,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';
import { RegisterProjectModal } from '@/components/register-project-modal';

interface ExecutiveDashboardViewProps {
  userRole?: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT';
}

export function ExecutiveDashboardView({ userRole = 'SALES' }: ExecutiveDashboardViewProps = {}) {
  const { projects, activeProject, setActiveProjectById, inventory, leads } = useProject();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const ongoingCount = projects.filter((p) => p.status === 'Ongoing').length;
  const upcomingCount = projects.filter((p) => p.status === 'Upcoming').length;
  const jvCount = projects.filter((p) => p.tag === 'JV').length;
  const totalFreeSaleUnits = projects.reduce((sum, p) => sum + (p.freeSaleUnits || 0), 0);
  const totalRehabUnits = projects.reduce((sum, p) => sum + (p.rehabMembers || 0), 0);

  // Dynamic counts for Sales & Pipeline
  const activeLeadsCount = leads.length || 312;
  const siteVisitsCount = leads.filter((l) => l.stage === 'VISIT PLANNED').length || 48;
  const tokenHoldsCount = inventory.filter((u) => u.status === 'Hold').length;
  const bookedUnitsCount = inventory.filter((u) => u.status === 'Booked').length;

  return (
    <div className="space-y-6">
      {/* 1. Executive Master Console Banner with Dynamic Role Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-white/10 bg-gradient-to-r from-slate-950/80 via-blue-950/50 to-slate-900/80 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#ff6536]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3 h-3 text-blue-400" />
                {userRole === 'SUPER_ADMIN' && 'SUPER ADMIN EXECUTIVE CONSOLE • MALAD HO'}
                {userRole === 'ADMIN' && 'PROJECT OPERATIONS & SITE COMMAND'}
                {userRole === 'SALES' && 'SALES PIPELINE & CLOSING DESK'}
                {userRole === 'ACCOUNT' && 'TREASURY & MAHARERA BILLING DESK'}
              </span>
              <span className="text-white/40 text-xs">• Mumbai &amp; Palghar Division</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {userRole === 'SUPER_ADMIN' && 'Ashapura Builders Executive Master Dashboard'}
              {userRole === 'ADMIN' && 'Project Operations & Construction Command'}
              {userRole === 'SALES' && 'Sales Pipeline & Inquiries Command Center'}
              {userRole === 'ACCOUNT' && 'Treasury, Escrow & MahaRERA Billing Console'}
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {userRole === 'SUPER_ADMIN' &&
                'Enterprise portfolio management covering Society Redevelopment Tie-ups (CHSL/SRA), Free-Sale High Rises, Suburban Townships & Investor Portfolios.'}
              {userRole === 'ADMIN' &&
                'Real-time construction checkpoints, inventory stacking status, buyer visits, and project delivery coordination.'}
              {userRole === 'SALES' &&
                'Active prospect inquiries, walk-ins, scheduled site visits, token advance holds, and buyer follow-ups.'}
              {userRole === 'ACCOUNT' &&
                'Construction milestone billing notices, escrow inflows, CHSL member hardship transit rent disbursals, and ledger audits.'}
            </p>
          </div>

          {/* Right HO Operations Card */}
          <div className="shrink-0 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {userRole === 'SUPER_ADMIN' && 'Central Operations Malad HO'}
                {userRole === 'ADMIN' && 'Site Command & Malad HO'}
                {userRole === 'SALES' && 'Sales Desk • Malad HO'}
                {userRole === 'ACCOUNT' && 'Finance & MahaRERA Escrow Desk'}
              </div>
              <div className="text-[11px] text-white/50">
                101 Jay Gagan, Liberty Garden
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Role-Specific Quick Action Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {userRole === 'SUPER_ADMIN' && (
          <>
            <button
              type="button"
              onClick={() => setRegisterModalOpen(true)}
              className="p-3.5 rounded-2xl glass-card border border-[#ff6536]/30 hover:border-[#ff6536]/60 bg-[#ff6536]/10 hover:bg-[#ff6536]/15 transition-all text-left flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ff6536]/20 border border-[#ff6536]/30 flex items-center justify-center text-[#ff6536] group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Register Project</span>
                <span className="text-[10px] text-white/50">Add new site or JV</span>
              </div>
            </button>

            <Link
              href="/dashboard/users"
              className="p-3.5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 hover:bg-purple-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <UserCog className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">User &amp; Roles</span>
                <span className="text-[10px] text-white/50">Identity governance</span>
              </div>
            </Link>

            <Link
              href="/dashboard/inventory"
              className="p-3.5 rounded-2xl glass-card border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Stacking Matrix</span>
                <span className="text-[10px] text-white/50">Full site inventory</span>
              </div>
            </Link>

            <Link
              href="/dashboard/accounts"
              className="p-3.5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Accounts &amp; Demands</span>
                <span className="text-[10px] text-white/50">Milestone collections</span>
              </div>
            </Link>
          </>
        )}

        {userRole === 'ADMIN' && (
          <>
            <Link
              href="/dashboard/inventory"
              className="p-3.5 rounded-2xl glass-card border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Manage Flats</span>
                <span className="text-[10px] text-white/50">Add flat &amp; pricing</span>
              </div>
            </Link>

            <Link
              href="/dashboard/leads"
              className="p-3.5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Buyer Pipeline</span>
                <span className="text-[10px] text-white/50">Inquiries &amp; visits</span>
              </div>
            </Link>

            <Link
              href="/dashboard/accounts"
              className="p-3.5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Accounts Ledger</span>
                <span className="text-[10px] text-white/50">Milestone demands</span>
              </div>
            </Link>

            <Link
              href="/dashboard/users"
              className="p-3.5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 hover:bg-purple-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <UserCog className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">User &amp; Roles</span>
                <span className="text-[10px] text-white/50">Manage credentials &amp; RBAC</span>
              </div>
            </Link>
          </>
        )}

        {userRole === 'SALES' && (
          <>
            <Link
              href="/dashboard/leads"
              className="p-3.5 rounded-2xl glass-card border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">+ Ingest New Lead</span>
                <span className="text-[10px] text-white/50">Walk-in or Ad inquiry</span>
              </div>
            </Link>

            <Link
              href="/dashboard/inventory"
              className="p-3.5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Check Flats</span>
                <span className="text-[10px] text-white/50">Available units &amp; Hold</span>
              </div>
            </Link>

            <Link
              href="/dashboard/inventory"
              className="p-3.5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Hold &amp; Bookings</span>
                <span className="text-[10px] text-white/50">Token unit status</span>
              </div>
            </Link>

            <Link
              href="/dashboard/leads"
              className="p-3.5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 hover:bg-purple-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">WhatsApp Leads</span>
                <span className="text-[10px] text-white/50">Direct client follow-up</span>
              </div>
            </Link>
          </>
        )}

        {userRole === 'ACCOUNT' && (
          <>
            <Link
              href="/dashboard/accounts"
              className="p-3.5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Trigger Demand</span>
                <span className="text-[10px] text-white/50">Milestone billing notice</span>
              </div>
            </Link>

            <Link
              href="/dashboard/accounts"
              className="p-3.5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 hover:bg-purple-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">CHSL Rent Outflow</span>
                <span className="text-[10px] text-white/50">Society hardship disbursal</span>
              </div>
            </Link>

            <Link
              href="/dashboard/inventory"
              className="p-3.5 rounded-2xl glass-card border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Verify Flat Pricing</span>
                <span className="text-[10px] text-white/50">Read-only RERA rates</span>
              </div>
            </Link>

            <Link
              href="/dashboard/accounts"
              className="p-3.5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/15 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Escrow Ledger</span>
                <span className="text-[10px] text-white/50">Collections &amp; bank inflow</span>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* 3. Four Top Metric KPI Cards Tailored per Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SUPER_ADMIN KPIs */}
        {userRole === 'SUPER_ADMIN' && (
          <>
            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  +{jvCount} JV Sites <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {projects.length} Sites
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Portfolio Projects</div>
              <div className="text-[11px] text-white/50 mt-0.5">
                {ongoingCount} Ongoing • {upcomingCount} Upcoming
              </div>
            </div>

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
                {totalFreeSaleUnits + totalRehabUnits}+ Units
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Active Units Under Const.</div>
              <div className="text-[11px] text-white/50 mt-0.5">
                Free Sale ({totalFreeSaleUnits}) + Rehab ({totalRehabUnits})
              </div>
            </div>

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
                {activeLeadsCount} Leads
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Active Inquiries &amp; Visits</div>
              <div className="text-[11px] text-white/50 mt-0.5">Goregaon, Malad &amp; Palghar Desk</div>
            </div>
          </>
        )}

        {/* ADMIN KPIs */}
        {userRole === 'ADMIN' && (
          <>
            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-md border border-blue-500/30">
                  Live Operations
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {projects.length} Sites
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Active Construction Sites</div>
              <div className="text-[11px] text-white/50 mt-0.5">
                {ongoingCount} Ongoing • {upcomingCount} Upcoming
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Home className="w-5 h-5 text-purple-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-500/30">
                  Total Inventory
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {totalFreeSaleUnits + totalRehabUnits}+ Units
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Capacity Under Construction</div>
              <div className="text-[11px] text-white/50 mt-0.5">
                {totalFreeSaleUnits} Free-Sale • {totalRehabUnits} Rehab Members
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                  Visits Planned
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {siteVisitsCount} Site Visits
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Scheduled Client Inspections</div>
              <div className="text-[11px] text-white/50 mt-0.5">Assigned to Site Supervisors</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Escrow Collections
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ₹18.42 Cr
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Milestone Recovery YTD</div>
              <div className="text-[11px] text-white/50 mt-0.5">Slab-linked collection efficiency 94%</div>
            </div>
          </>
        )}

        {/* SALES KPIs */}
        {userRole === 'SALES' && (
          <>
            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-md border border-blue-500/30">
                  +18 Today
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeLeadsCount} Leads
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Active Buyer Prospects</div>
              <div className="text-[11px] text-white/50 mt-0.5">Meta Ads, Walk-ins &amp; Portals</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                  This Week
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {siteVisitsCount} Visits
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Site Visits Scheduled</div>
              <div className="text-[11px] text-white/50 mt-0.5">Malad, Goregaon &amp; Palghar</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-orange-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-orange-300 bg-orange-500/15 px-2 py-0.5 rounded-md border border-orange-500/30">
                  Token Advance
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {tokenHoldsCount} Flats
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Active Token Holds</div>
              <div className="text-[11px] text-white/50 mt-0.5">Advance deposits locked</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Sold Out
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {bookedUnitsCount} Bookings
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Confirmed Flat Sales</div>
              <div className="text-[11px] text-white/50 mt-0.5">Agreements for Sale in draft</div>
            </div>
          </>
        )}

        {/* ACCOUNT KPIs */}
        {userRole === 'ACCOUNT' && (
          <>
            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Escrow Verified
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ₹18.42 Cr
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Total Milestone Inflow</div>
              <div className="text-[11px] text-white/50 mt-0.5">Received across active project escrows</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                  Due This Month
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ₹46.00 Lakhs
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Pending Demand Notices</div>
              <div className="text-[11px] text-white/50 mt-0.5">Construction linked notices pending</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-500/30">
                  CHSL Disbursals
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ₹18.00 Lakhs
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Society Rent Outflow / mo</div>
              <div className="text-[11px] text-white/50 mt-0.5">Transit rent to CHSL rehab members</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 relative group hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  100% Compliant
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                MahaRERA
              </div>
              <div className="text-xs font-semibold text-white/80 mt-1">Escrow Audit Compliance</div>
              <div className="text-[11px] text-white/50 mt-0.5">Separate RERA accounts audited</div>
            </div>
          </>
        )}
      </div>

      {/* 4. Ashapura Builders Active Sites & Tie-Ups Grid */}
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
          <div className="flex items-center gap-2.5 flex-wrap">
            {userRole === 'SUPER_ADMIN' && (
              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ff6536] to-[#ff8555] hover:from-[#ff7546] hover:to-[#ff9565] text-white text-xs font-bold shadow-lg shadow-[#ff6536]/25 transition cursor-pointer group"
              >
                <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-300" />
                <span>Register New Project</span>
              </button>
            )}
            <Link
              href="/dashboard/inventory"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10"
            >
              <span>Open Full Matrix</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
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

      {/* Super Admin Modal for Registering New Project */}
      {userRole === 'SUPER_ADMIN' && (
        <RegisterProjectModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          userRole={userRole}
        />
      )}
    </div>
  );
}
