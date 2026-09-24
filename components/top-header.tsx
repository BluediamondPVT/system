'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '@/lib/project-context';
import {
  Building2,
  ChevronDown,
  Search,
  ShieldCheck,
  Bell,
  X,
  UserCheck,
  Check,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { RegisterProjectModal } from '@/components/register-project-modal';

interface TopHeaderProps {
  userEmail?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT' | string;
}

export function TopHeader({ userEmail, role = 'SUPER_ADMIN' }: TopHeaderProps) {
  const {
    projects,
    activeProject,
    setActiveProjectById,
    searchQuery,
    setSearchQuery,
    inventory,
    leads,
  } = useProject();

  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const projectMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectMenuRef.current &&
        !projectMenuRef.current.contains(event.target as Node)
      ) {
        setProjectMenuOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across inventory, leads, and projects
  const query = searchQuery.trim().toLowerCase();
  const matchedProjects = query
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      )
    : [];
  const matchedUnits = query
    ? inventory.filter(
        (u) =>
          u.unitNumber.includes(query) ||
          u.typology.toLowerCase().includes(query) ||
          u.status.toLowerCase().includes(query)
      ).slice(0, 5)
    : [];
  const matchedLeads = query
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.phone.includes(query) ||
          l.stage.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  const hasResults =
    matchedProjects.length > 0 || matchedUnits.length > 0 || matchedLeads.length > 0;

  return (
    <header className="relative z-40 w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-3 py-2.5 sm:px-5 sm:py-3 rounded-2xl glass-card border border-white/10 backdrop-blur-xl select-none transition-all">
      {/* Left: Active Project Selector Dropdown */}
      <div className="relative" ref={projectMenuRef}>
        <button
          type="button"
          onClick={() => setProjectMenuOpen(!projectMenuOpen)}
          className="w-full md:w-auto flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-left flex flex-col min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate max-w-[180px] sm:max-w-[220px]">
                {activeProject.name}
              </span>
              {activeProject.tag && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {activeProject.tag}
                </span>
              )}
            </div>
            <span className="text-[11px] text-white/50 truncate max-w-[180px] sm:max-w-[220px]">
              📍 {activeProject.location}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/50 transition-transform duration-200 group-hover:text-white shrink-0 ${
              projectMenuOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>

        {/* Project Selector Modal/Dropdown */}
        {projectMenuOpen && (
          <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#121622]/95 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Select Active Site / Tie-Up
              </span>
              <span className="text-[10px] text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/30">
                {projects.length} Projects
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto custom-glass-scroll py-1 space-y-1">
              {projects.map((proj) => {
                const isSelected = proj.id === activeProject.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      setActiveProjectById(proj.id);
                      setProjectMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-blue-600/25 border border-blue-500/40 text-white'
                        : 'hover:bg-white/[0.06] text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold truncate">
                            {proj.name}
                          </span>
                          {proj.tag && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                              {proj.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/50 truncate">
                          {proj.location} • ₹{proj.basePricePerSqft.toLocaleString('en-IN')}/sqft
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {role === 'SUPER_ADMIN' && (
              <div className="pt-2 mt-1 border-t border-white/10 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setProjectMenuOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gradient-to-r from-[#ff6536]/20 to-[#ff8555]/20 hover:from-[#ff6536]/30 hover:to-[#ff8555]/30 border border-[#ff6536]/30 text-white text-xs font-bold transition group cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ff6536] transition-transform group-hover:rotate-90 duration-300" />
                  <span>Register New Project</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle: Global Search Bar */}
      <div className="relative flex-1 max-w-md mx-auto w-full" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search flats, leads, or society members..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400/60 focus:bg-white/[0.08] focus:ring-1 focus:ring-blue-400/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-0.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {searchFocused && query.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#121622]/95 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-3 z-50 animate-in fade-in duration-150 max-h-96 overflow-y-auto custom-glass-scroll">
            {!hasResults ? (
              <p className="text-xs text-center text-white/40 py-4">
                No matching units, leads, or projects found for &quot;{searchQuery}&quot;
              </p>
            ) : (
              <div className="space-y-3">
                {matchedProjects.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                      Projects ({matchedProjects.length})
                    </span>
                    <div className="space-y-1">
                      {matchedProjects.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveProjectById(p.id);
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer text-xs flex items-center justify-between text-white"
                        >
                          <span className="font-medium">{p.name}</span>
                          <span className="text-[10px] text-white/50">{p.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {matchedUnits.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Stacking Units ({matchedUnits.length})
                    </span>
                    <div className="space-y-1">
                      {matchedUnits.map((u) => (
                        <Link
                          key={u.id}
                          href="/dashboard/inventory"
                          onClick={() => setSearchFocused(false)}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer text-xs flex items-center justify-between text-white"
                        >
                          <span>
                            Flat #{u.unitNumber} ({u.typology} • {u.carpetAreaSqft} sqft)
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                              u.status === 'Available'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                : u.status === 'Hold'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                            }`}
                          >
                            {u.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {matchedLeads.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      Prospect Leads ({matchedLeads.length})
                    </span>
                    <div className="space-y-1">
                      {matchedLeads.map((l) => (
                        <Link
                          key={l.id}
                          href="/dashboard/leads"
                          onClick={() => setSearchFocused(false)}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer text-xs flex items-center justify-between text-white"
                        >
                          <div>
                            <span className="font-medium">{l.name}</span>
                            <span className="text-[10px] text-white/50 ml-2">{l.phone}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                            {l.stage}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Branch Badge, Notifications & Profile Pill */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
        {/* Branch / HO Badge */}
        <div
          title="Ashapura Builders Central Head Office"
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 text-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-medium truncate">HO: 101 Jay Gagan, Malad (W)</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications & Escalations"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff6536] ring-2 ring-[#12161e]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#121622]/95 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Notifications
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  System Active
                </span>
              </div>
              <div className="space-y-2 py-2 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                  <p className="font-semibold text-white">Amar CHSL Hardship Disbursal</p>
                  <p className="text-[11px] text-white/60">Q2 transit rent notice generated for 20 society rehab allottees.</p>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                  <p className="font-semibold text-white">Meghmala Crysta Unit 1302</p>
                  <p className="text-[11px] text-white/60">Token deposit received via Malad HO desk.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.info('All notifications marked as read.');
                  setNotificationsOpen(false);
                }}
                className="w-full py-1.5 mt-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium transition"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill with dynamic role styling */}
        {(() => {
          const roleConfig: Record<string, { label: string; badge: string; initials: string; gradient: string; dotColor: string }> = {
            SUPER_ADMIN: {
              label: 'Super Admin (MD)',
              badge: 'Malad HO • MD Desk',
              initials: 'AB',
              gradient: 'from-[#ff6536] to-amber-500',
              dotColor: 'bg-emerald-400',
            },
            ADMIN: {
              label: 'Project Admin',
              badge: 'Malad HO • Site Ops',
              initials: 'PA',
              gradient: 'from-blue-600 to-indigo-600',
              dotColor: 'bg-blue-400',
            },
            SALES: {
              label: 'Sales Executive',
              badge: 'Sales Desk • Closer',
              initials: 'SE',
              gradient: 'from-emerald-600 to-teal-600',
              dotColor: 'bg-emerald-400',
            },
            ACCOUNT: {
              label: 'Accounts & Finance',
              badge: 'Billing Desk • Escrow',
              initials: 'AF',
              gradient: 'from-purple-600 to-violet-600',
              dotColor: 'bg-purple-400',
            },
          };
          const cfg = roleConfig[role] || roleConfig.SALES;

          return (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 shadow-sm">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${cfg.gradient} border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-md shrink-0`}
              >
                {cfg.initials}
              </div>
              <div className="flex flex-col text-left leading-tight hidden sm:flex">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{cfg.label}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} animate-pulse`} />
                </span>
                <span className="text-[10px] text-white/50">{cfg.badge}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {role === 'SUPER_ADMIN' && (
        <RegisterProjectModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          userRole="SUPER_ADMIN"
        />
      )}
    </header>
  );
}
