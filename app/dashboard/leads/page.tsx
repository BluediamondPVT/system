'use client';

import React, { useState } from 'react';
import { useProject } from '@/lib/project-context';
import { LeadProspect } from '@/lib/ashapura-data';
import {
  UserPlus,
  Phone,
  MessageSquare,
  Building2,
  X,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export default function LeadCRMPage() {
  const { projects, leads, addLead, updateLeadStage } = useProject();

  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('ALL');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectId: 'meghmala-crysta',
    configuration: '2 BHK Layout',
    budget: '1.75 Cr',
    source: 'Meta Ads' as LeadProspect['source'],
    stage: 'NEW' as LeadProspect['stage'],
    notes: '',
  });

  // Calculate pipeline counts
  const activeInquiries = leads.filter((l) => l.stage === 'NEW' || l.stage === 'CONTACTED').length;
  const siteVisits = leads.filter((l) => l.stage === 'VISIT PLANNED').length;
  const negotiations = leads.filter((l) => l.stage === 'NEGOTIATION').length;
  const booked = leads.filter((l) => l.stage === 'BOOKED').length;

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStage = selectedStage === 'ALL' || lead.stage === selectedStage;
    const matchesSite =
      selectedSiteFilter === 'ALL' || lead.projectId === selectedSiteFilter;
    return matchesStage && matchesSite;
  });

  const handleIngestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please enter name and phone number');
      return;
    }

    const selectedProj = projects.find((p) => p.id === formData.projectId);
    const projectName = selectedProj ? selectedProj.name : 'Meghmala Crysta';

    addLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      projectId: formData.projectId,
      projectName,
      configuration: formData.configuration,
      budget: formData.budget,
      stage: formData.stage,
      source: formData.source,
      notes: formData.notes || undefined,
    });

    setIsIngestModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      projectId: 'meghmala-crysta',
      configuration: '2 BHK Layout',
      budget: '1.75 Cr',
      source: 'Meta Ads',
      stage: 'NEW',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Ingest Button */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Lead CRM &amp; Sales Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Centralized buyer inquiries across Mumbai &amp; Palghar developments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsIngestModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all group shrink-0"
        >
          <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>+ Ingest Walk-In / Ad Lead</span>
        </button>
      </div>

      {/* 2. Pipeline Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 shadow-lg">
          <span className="text-[11px] font-bold text-blue-300 block">Active Inquiries</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">
            {activeInquiries}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg">
          <span className="text-[11px] font-bold text-amber-300 block">Site Visits Scheduled</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
            {siteVisits}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 shadow-lg">
          <span className="text-[11px] font-bold text-orange-300 block">Price Negotiations</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 mt-1">
            {negotiations}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg">
          <span className="text-[11px] font-bold text-emerald-300 block">Converted / Booked</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
            {booked}
          </div>
        </div>
      </div>

      {/* 3. Filters & Site Selector */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Stage Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['ALL', 'NEW', 'CONTACTED', 'VISIT PLANNED', 'NEGOTIATION', 'BOOKED'].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                selectedStage === stage
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Project Selector Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-white/50 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Site:
          </span>
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSelectedSiteFilter(e.target.value)}
            className="w-full md:w-64 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400"
          >
            <option value="ALL" className="bg-[#12161e] text-white">
              All Projects (Mumbai &amp; Palghar)
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#12161e] text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Leads Table */}
      <div className="glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-glass-scroll">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="bg-white/[0.04] text-white/50 border-b border-white/10 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">PROSPECT NAME</th>
                <th className="py-3.5 px-4">PIPELINE STAGE</th>
                <th className="py-3.5 px-4">TARGET PROJECT &amp; CONFIG</th>
                <th className="py-3.5 px-4">BUDGET</th>
                <th className="py-3.5 px-4">SOURCE</th>
                <th className="py-3.5 px-4 text-right">INSTANT CRM ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {filteredLeads.map((lead) => {
                const initial = lead.name.charAt(0).toUpperCase();

                const isNew = lead.stage === 'NEW';
                const isContacted = lead.stage === 'CONTACTED';
                const isVisit = lead.stage === 'VISIT PLANNED';
                const isNego = lead.stage === 'NEGOTIATION';

                return (
                  <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* Prospect Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-bold text-blue-300 text-xs shrink-0">
                          {initial}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{lead.name}</div>
                          <div className="text-[11px] text-white/50">{lead.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Stage Badge with quick toggle */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.stage}
                        onChange={(e) =>
                          updateLeadStage(lead.id, e.target.value as LeadProspect['stage'])
                        }
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${
                          isNew
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                            : isContacted
                            ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                            : isVisit
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                            : isNego
                            ? 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        }`}
                      >
                        <option value="NEW" className="bg-[#12161e] text-white">NEW</option>
                        <option value="CONTACTED" className="bg-[#12161e] text-white">CONTACTED</option>
                        <option value="VISIT PLANNED" className="bg-[#12161e] text-white">VISIT PLANNED</option>
                        <option value="NEGOTIATION" className="bg-[#12161e] text-white">NEGOTIATION</option>
                        <option value="BOOKED" className="bg-[#12161e] text-white">BOOKED</option>
                      </select>
                    </td>

                    {/* Target Project & Config */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-white">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{lead.projectName}</span>
                      </div>
                      <div className="text-[11px] text-white/50 ml-5">{lead.configuration}</div>
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-bold text-white tracking-tight">
                      {lead.budget}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 text-white/60 text-[11px]">
                      {lead.source}
                    </td>

                    {/* Instant Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Action */}
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            lead.name
                          )},%20greetings%20from%20Ashapura%20Builders%20HO.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5 text-[11px] font-semibold transition-all group"
                          title="Open WhatsApp chat"
                        >
                          <MessageSquare className="w-3 h-3 group-hover:scale-110" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Call Action */}
                        <a
                          href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-all"
                          title="Dial phone number"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Ingest Walk-In / Ad Lead Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-white/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ingest Walk-In / Ad Lead</h3>
                  <p className="text-xs text-white/50">Capture prospect inquiry into Central CRM</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIngestModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIngestSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-medium">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Interested Site *</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#12161e] text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-medium">Configuration</label>
                  <select
                    value={formData.configuration}
                    onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="1 BHK Layout" className="bg-[#12161e]">1 BHK Layout</option>
                    <option value="2 BHK Layout" className="bg-[#12161e]">2 BHK Layout</option>
                    <option value="3 BHK Layout" className="bg-[#12161e]">3 BHK Layout</option>
                    <option value="Jodi Flat (Combined)" className="bg-[#12161e]">Jodi Flat (Combined)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.8 Cr"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-medium">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        source: e.target.value as LeadProspect['source'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="Meta Ads" className="bg-[#12161e]">Meta Ads</option>
                    <option value="Website" className="bg-[#12161e]">Website</option>
                    <option value="99acres" className="bg-[#12161e]">99acres</option>
                    <option value="Walk-in Malad HO" className="bg-[#12161e]">Walk-in Malad HO</option>
                    <option value="Channel Partner" className="bg-[#12161e]">Channel Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium">Remarks / Customer Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Needs loan assistance, preference for higher floor"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIngestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition"
                >
                  Save &amp; Ingest Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
