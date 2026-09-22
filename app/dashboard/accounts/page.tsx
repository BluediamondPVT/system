'use client';

import React, { useState } from 'react';
import { useProject } from '@/lib/project-context';
import { DemandNotice } from '@/lib/ashapura-data';
import {
  Wallet,
  FileText,
  Building,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Filter,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountsDemandsPage() {
  const { projects, demands, addDemand, sendNotice } = useProject();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Demand Form State
  const [formState, setFormState] = useState({
    projectId: 'meghmala-crysta',
    unitNumber: 'Wing A-703',
    allottee: '',
    category: 'Slab Casting' as DemandNotice['category'],
    milestoneScope: '',
    amount: 1200000,
    dueDate: '15 Oct 2026',
    status: 'PENDING' as DemandNotice['status'],
    isHardshipAllowance: false,
  });

  // Financial Summaries
  const totalInflow = demands
    .filter((d) => d.status === 'PAID')
    .reduce((sum, d) => sum + d.amount, 0) + 18420000;

  const pendingDemands = demands
    .filter((d) => d.status === 'PENDING')
    .reduce((sum, d) => sum + d.amount, 0);

  const societyOutflow = demands
    .filter((d) => d.isHardshipAllowance || d.category === 'CHSL Hardship Rent')
    .reduce((sum, d) => sum + d.amount, 0);

  // Filtered Demands
  const filteredDemands = demands.filter((d) => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesProject = projectFilter === 'ALL' || d.projectId === projectFilter;
    return matchesStatus && matchesProject;
  });

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.allottee.trim() || !formState.milestoneScope.trim()) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    const proj = projects.find((p) => p.id === formState.projectId);
    const projectName = proj ? proj.name : 'Meghmala Crysta';

    addDemand({
      projectId: formState.projectId,
      projectName,
      unitNumber: formState.unitNumber,
      allottee: formState.allottee,
      category: formState.category,
      milestoneScope: formState.milestoneScope,
      amount: Number(formState.amount),
      dueDate: formState.dueDate,
      status: formState.status,
      isHardshipAllowance: formState.category === 'CHSL Hardship Rent',
    });

    setIsModalOpen(false);
    setFormState({
      projectId: 'meghmala-crysta',
      unitNumber: 'Wing A-703',
      allottee: '',
      category: 'Slab Casting',
      milestoneScope: '',
      amount: 1200000,
      dueDate: '15 Oct 2026',
      status: 'PENDING',
      isHardshipAllowance: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Trigger Demand Button */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Accounts, MahaRERA Demands &amp; Society Ledger
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Automated milestone collection notices and society redevelopment rent disbursals
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white border border-white/20 shadow-xl flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-400" />
          <span>+ Trigger Demand / Rent Disbursal</span>
        </button>
      </div>

      {/* 2. Three Big Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Milestone Inflow */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              TOTAL MILESTONE INFLOW
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            ₹{totalInflow.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-200/70 mt-1">
            Received across all active project escrows
          </p>
        </div>

        {/* Pending Demands */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              PENDING CUSTOMER DEMANDS
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            ₹{(4600000 + pendingDemands).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-amber-200/70 mt-1">
            Construction linked notices due this month
          </p>
        </div>

        {/* Society Redevelopment Outflow */}
        <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              SOCIETY REDEVELOPMENT OUTFLOW
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-2">
            ₹{(1800000 + societyOutflow).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-purple-200/70 mt-1">
            Transit rent &amp; hardship allowance to CHSL members
          </p>
        </div>
      </div>

      {/* 3. Filters & Project Selector */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-white/50 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Project:
          </span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full md:w-64 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400"
          >
            <option value="ALL" className="bg-[#12161e] text-white">
              All Project Escrows
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#12161e] text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Demands Ledger Table */}
      <div className="glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-glass-scroll">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="bg-white/[0.04] text-white/50 border-b border-white/10 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">DEMAND NOTICE ID</th>
                <th className="py-3.5 px-4">PROJECT &amp; UNIT</th>
                <th className="py-3.5 px-4">ALLOTTEE / PAYEE</th>
                <th className="py-3.5 px-4">MILESTONE SCOPE</th>
                <th className="py-3.5 px-4">AMOUNT (INR)</th>
                <th className="py-3.5 px-4">DUE DATE</th>
                <th className="py-3.5 px-4">LEDGER STATUS</th>
                <th className="py-3.5 px-4 text-right">DISPATCH NOTICE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {filteredDemands.map((demand) => {
                const isPaid = demand.status === 'PAID';
                const isPending = demand.status === 'PENDING';
                const isOverdue = demand.status === 'OVERDUE';

                return (
                  <tr key={demand.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* Notice ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white/80">
                      {demand.noticeCode}
                    </td>

                    {/* Project & Unit */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{demand.projectName}</span>
                      </div>
                      <div className="text-[11px] text-white/50 ml-5">{demand.unitNumber}</div>
                    </td>

                    {/* Allottee / Payee */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{demand.allottee}</div>
                      {demand.isHardshipAllowance && (
                        <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                          CHSL Hardship Allowance
                        </span>
                      )}
                    </td>

                    {/* Milestone Scope */}
                    <td className="py-3.5 px-4 text-white/70 max-w-xs">
                      {demand.milestoneScope}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-white tracking-tight">
                      ₹{demand.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 text-white/60 text-[11px]">
                      {demand.dueDate}
                    </td>

                    {/* Ledger Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isPaid
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                            : isPending
                            ? 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                        }`}
                      >
                        {isPaid && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {isOverdue && <AlertTriangle className="w-3 h-3" />}
                        {demand.status}
                      </span>
                    </td>

                    {/* Dispatch Notice Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => sendNotice(demand.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all ${
                          demand.dispatched
                            ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40'
                            : 'bg-blue-600/15 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:border-blue-500/50'
                        }`}
                      >
                        {demand.dispatched ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                            <span>Sent</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Notice</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Trigger Demand Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-white/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Trigger Demand / Rent Notice</h3>
                  <p className="text-xs text-white/50">MahaRERA Escrow Milestone Notice or Disbursal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDemand} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Select Project *</label>
                  <select
                    value={formState.projectId}
                    onChange={(e) => setFormState({ ...formState, projectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#12161e]">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-medium">Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        category: e.target.value as DemandNotice['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="Slab Casting" className="bg-[#12161e]">Slab Casting</option>
                    <option value="Plinth Level" className="bg-[#12161e]">Plinth Level</option>
                    <option value="Milestone Collection" className="bg-[#12161e]">Milestone Collection</option>
                    <option value="CHSL Hardship Rent" className="bg-[#12161e]">CHSL Hardship Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Allottee / Payee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formState.allottee}
                    onChange={(e) => setFormState({ ...formState, allottee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-medium">Unit / Wing</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wing A-703"
                    value={formState.unitNumber}
                    onChange={(e) => setFormState({ ...formState, unitNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium">Milestone Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5th Slab Superstructure Completion (MahaRERA 45%)"
                  value={formState.milestoneScope}
                  onChange={(e) => setFormState({ ...formState, milestoneScope: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-medium">Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={formState.amount}
                    onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-medium">Due Date</label>
                  <input
                    type="text"
                    value={formState.dueDate}
                    onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition"
                >
                  Generate &amp; Register Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
