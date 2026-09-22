'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Users,
  FileText,
  Wallet,
  LayoutDashboard,
  Grid3X3,
  Sparkles,
} from 'lucide-react';

export default function SoftwareGuidePage() {
  const modules = [
    {
      id: '1',
      name: '1. Super Admin Executive Dashboard',
      subtitle: 'C-Suite & Founder Control',
      href: '/dashboard',
      icon: LayoutDashboard,
      description:
        "High-level command center giving promoters and executive management real-time visibility across the company's entire 27-site portfolio in Mumbai and Palghar.",
      capabilities: [
        'Live KPI counters tracking active projects, unit inventory, collections, and pipeline inquiries.',
        'Active Sites & Tie-Ups overview displaying floor counts, base rates, and society rehab vs free-sale quotas.',
        'Super Admin Role & Identity governance for managing user credentials and dashboard permissions.',
      ],
    },
    {
      id: '2',
      name: '2. Stacking Plan & Architectural Inventory Matrix',
      subtitle: 'Visual Floor-Wise Sales Grid',
      href: '/dashboard/inventory',
      icon: Grid3X3,
      description:
        'Architectural stacking plan providing an interactive visual matrix of all units across floors and wings for the active development.',
      capabilities: [
        'Floor-by-floor breakdown (Floors 1–15) displaying individual flat numbers, typologies (1, 2 & 3 BHK), and RERA carpet areas.',
        'Color-coded inventory statuses (Available, Token/Hold, Sold, Investor JV) with live counters.',
        'Interactive Unit Detail Modal enabling instant Token reservations and direct export to the Quotation engine.',
      ],
    },
    {
      id: '3',
      name: '3. Lead CRM & Ingestion Engine',
      subtitle: 'Sales Funnel & Prospect Management',
      href: '/dashboard/leads',
      icon: Users,
      description:
        'Centralized prospective buyer inquiry system uniting walk-ins at the Malad HO with Meta Ads and 99acres digital leads.',
      capabilities: [
        'Pipeline stage filters (New, Contacted, Visit Planned, Negotiation, Booked) with live stage progression.',
        'Instant CRM communication triggers: 1-click WhatsApp messaging and direct telephony dialer.',
        'Lead Ingestion modal capturing prospective buyer requirements, preferred projects, and budgets.',
      ],
    },
    {
      id: '4',
      name: '4. MahaRERA Cost Sheet & Official Quotation Engine',
      subtitle: 'Commercial Document Generator',
      href: '/dashboard/documents',
      icon: FileText,
      description:
        'Dynamic financial cost sheet calculator producing printable corporate letterhead quotations compliant with Maharashtra RERA statutes.',
      capabilities: [
        'Automatic calculation of Agreement Value, Maharashtra Stamp Duty (6%), Govt Registration Fee (₹30,000 cap), and RERA GST (5%).',
        'Official Ashapura Builders letterhead with RERA registration numbers, reference codes, and signatory blocks.',
        'Integrated browser print trigger (Ctrl+P / Command+P) optimized for clean PDF generation without UI chrome.',
      ],
    },
    {
      id: '5',
      name: '5. Escrow Milestone Accounting & Society Transit Rent Ledger',
      subtitle: 'Treasury & Hardship Tracking',
      href: '/dashboard/accounts',
      icon: Wallet,
      description:
        'Dual-purpose financial ledger monitoring construction-linked milestone collections alongside society redevelopment transit rent disbursements.',
      capabilities: [
        'Milestone demand notice ledger tracking slab completions, plinth milestones, due dates, and statuses.',
        'Society displacement hardship allowance tracking ensuring timely monthly/quarterly payouts to CHSL members.',
        'Notice dispatch trigger sending automated collection alerts and registering official dispatch records.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-card border border-white/10 bg-gradient-to-r from-slate-950/80 via-blue-950/50 to-slate-900/80 backdrop-blur-2xl shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <BookOpen className="w-3 h-3 text-blue-400" />
              Software Architecture &amp; Working Guide
            </span>
            <span className="text-white/40 text-xs">• Enterprise Release 2.4</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ashapura Builders ERP &amp; CRM Platform
          </h1>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            This executive guide details how each component of the software functions. The application
            is built specifically around the real business model of Ashapura Builders—balancing
            outright residential sales with large-scale Co-operative Housing Society (CHSL)
            redevelopments and suburban townships.
          </p>

          {/* Architectural Badges Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              MahaRERA Architecture Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white/80 font-medium">
              <Layers className="w-4 h-4 text-blue-400" />
              Multi-Project Global Context
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white/80 font-medium">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Society Redevelopment Tie-Up Mode
            </span>
          </div>
        </div>
      </div>

      {/* 2. Global Project Switcher Highlight */}
      <div className="p-5 sm:p-6 rounded-2xl glass-card border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Global Project Switcher Architecture (Top Navigation Bar)
          </h2>
          <p className="text-xs text-white/60 leading-relaxed">
            Unlike single-building software, this ERP features a persistent{' '}
            <strong className="text-white">Global Project Context Provider</strong>. Selecting a project
            from the top dropdown (such as <em>Amar CHSL</em>, <em>Meghmala Crysta</em>, or <em>Aloha Palghar</em>)
            dynamically reconfigures the entire application: the Inventory Matrix adjusts floor counts and
            wings, the Quotation engine updates base rates and RERA IDs, and the Accounts ledger isolates
            site-specific escrows.
          </p>
        </div>
      </div>

      {/* 3. Comprehensive Module-by-Module Walkthrough */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Comprehensive Module-by-Module Walkthrough
        </h2>

        <div className="space-y-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="p-5 sm:p-6 rounded-2xl glass-card border border-white/10 shadow-xl space-y-4 hover:border-white/20 transition-all"
              >
                {/* Module Title & Launch Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{mod.name}</h3>
                      <p className="text-xs text-blue-300/80">{mod.subtitle}</p>
                    </div>
                  </div>

                  <Link
                    href={mod.href}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition group shrink-0"
                  >
                    <span>Launch Module</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Description */}
                <p className="text-xs text-white/70 leading-relaxed">{mod.description}</p>

                {/* Core Capabilities */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                    CORE FUNCTIONAL CAPABILITIES:
                  </span>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {mod.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
