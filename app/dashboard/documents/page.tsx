'use client';

import React, { useState } from 'react';
import { useProject } from '@/lib/project-context';
import {
  Printer,
  Share2,
  Calculator,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentsQuotationPage() {
  const { projects, activeProject, selectedQuotationUnit } = useProject();

  const [projectId, setProjectId] = useState<string>(() =>
    selectedQuotationUnit?.projectId || activeProject.id
  );
  const [buyerName, setBuyerName] = useState<string>('Rahul Verma');
  const [unitNumber, setUnitNumber] = useState<string>(() =>
    selectedQuotationUnit?.unitNumber || '1402'
  );
  const [carpetArea, setCarpetArea] = useState<number>(() =>
    selectedQuotationUnit?.carpetAreaSqft || 740
  );
  const [baseRate, setBaseRate] = useState<number>(() =>
    selectedQuotationUnit?.basePricePerSqft || activeProject.basePricePerSqft || 23500
  );
  const [floorRise, setFloorRise] = useState(150000);
  const [parkingCharges, setParkingCharges] = useState(500000);

  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
    const proj = projects.find((p) => p.id === newProjectId);
    if (proj) {
      setBaseRate(proj.basePricePerSqft);
    }
  };

  const currentProject = projects.find((p) => p.id === projectId) || activeProject;

  // Financial Calculations
  const basicCost = carpetArea * baseRate;
  const agreementValue = basicCost + Number(floorRise) + Number(parkingCharges);
  const stampDuty = Math.round(agreementValue * 0.06); // 6% in Maharashtra
  const registrationFee = 30000; // Standard max cap ₹30,000
  const gst = Math.round(agreementValue * 0.05); // 5% RERA residential
  const statutoryTaxes = stampDuty + registrationFee + gst;
  const grandTotal = agreementValue + statutoryTaxes;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Official quotation link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Documents &amp; Quotation Generator
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Dynamic MahaRERA compliant cost sheets &amp; printable buyer quotations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Quotation</span>
          </button>
        </div>
      </div>

      {/* 2. Two-Column Layout: Left Calculator, Right Printable Letterhead */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Cost Sheet Parameters (print:hidden) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Calculator className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Cost Sheet Parameters
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Project Select */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Select Project</label>
                <select
                  value={projectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#12161e]">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buyer Name */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Buyer / Prospect Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Flat Unit # */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Flat Unit #</label>
                <input
                  type="text"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="e.g. 1402"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Carpet Area (sqft) */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">
                  Carpet Area (RERA sq.ft)
                </label>
                <input
                  type="number"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Base Rate (₹/sqft) */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">
                  Base Rate (₹/sq.ft)
                </label>
                <input
                  type="number"
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Floor Rise Charges */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Floor Rise Charges (₹)</label>
                <input
                  type="number"
                  value={floorRise}
                  onChange={(e) => setFloorRise(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Covered Car Parking */}
              <div>
                <label className="text-white/70 block mb-1 font-medium">Covered Car Parking (₹)</label>
                <input
                  type="number"
                  value={parkingCharges}
                  onChange={(e) => setParkingCharges(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Quick Live Summary Capsule */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-white/70">
                <span>Agreement Value:</span>
                <span className="font-bold text-white">
                  ₹{agreementValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Statutory Taxes:</span>
                <span className="font-bold text-white">
                  ₹{statutoryTaxes.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-sm">
                <span className="font-bold text-blue-400">Net Total:</span>
                <span className="font-extrabold text-blue-400">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Official Printable Quotation Letterhead */}
        <div className="lg:col-span-7 print:col-span-12">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 print:p-0 print:border-none print:shadow-none">
            {/* Ashapura Builders Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    AB
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                    Ashapura Builders
                  </h2>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  HO: 101 Jay Gagan, Liberty Garden, Malad (W), Mumbai - 400064
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  MahaRERA Reg No: {currentProject.reraNumber}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <div className="font-bold text-slate-900">OFFICIAL COST SHEET</div>
                <div className="text-slate-500 text-[11px]">
                  Ref: AB/QUOT/{unitNumber}/2026
                </div>
                <div className="text-slate-500 text-[11px]">
                  Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Buyer Details Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">PREPARED FOR:</span>
                <span className="font-bold text-slate-900">{buyerName || 'Valued Customer'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PROJECT:</span>
                <span className="font-bold text-slate-900">{currentProject.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">UNIT NUMBER:</span>
                <span className="font-bold text-slate-900">Flat #{unitNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">CARPET AREA:</span>
                <span className="font-bold text-slate-900">{carpetArea} sq.ft RERA</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2">PARTICULARS &amp; MILESTONE SCOPE</th>
                    <th className="py-2.5 px-2 text-center">RATE / BASE</th>
                    <th className="py-2.5 px-2 text-right">AMOUNT (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-2 font-medium">
                      Basic Cost of Apartment ({carpetArea} sq.ft RERA Carpet)
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">
                      ₹{baseRate.toLocaleString('en-IN')}/sq.ft
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold">
                      ₹{basicCost.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-medium">Floor Rise Premium</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">Lump sum</td>
                    <td className="py-2.5 px-2 text-right font-semibold">
                      ₹{Number(floorRise).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-medium">Dedicated Covered Car Parking Space</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">1 Allotted Bay</td>
                    <td className="py-2.5 px-2 text-right font-semibold">
                      ₹{Number(parkingCharges).toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* Agreement Value Row */}
                  <tr className="bg-slate-100/70 font-bold text-slate-900">
                    <td className="py-2.5 px-2">Agreement Value (AV)</td>
                    <td className="py-2.5 px-2 text-center">-</td>
                    <td className="py-2.5 px-2 text-right">
                      ₹{agreementValue.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* Taxes */}
                  <tr>
                    <td className="py-2.5 px-2 font-medium">Maharashtra Stamp Duty (6% of AV)</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">Govt Statutory</td>
                    <td className="py-2.5 px-2 text-right font-semibold">
                      ₹{stampDuty.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-medium">Govt Registration Fee (Max Cap)</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">Fixed</td>
                    <td className="py-2.5 px-2 text-right font-semibold">
                      ₹{registrationFee.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-medium">Goods &amp; Service Tax (GST 5% Under RERA)</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">Statutory</td>
                    <td className="py-2.5 px-2 text-right font-semibold">
                      ₹{gst.toLocaleString('en-IN')}
                    </td>
                  </tr>

                  {/* Grand Total Row */}
                  <tr className="border-t-2 border-slate-900 bg-blue-50/70 text-blue-900 text-sm font-extrabold">
                    <td className="py-3 px-2">Grand Total (All-Inclusive Cost)</td>
                    <td className="py-3 px-2 text-center"></td>
                    <td className="py-3 px-2 text-right text-base text-blue-700">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Standard MahaRERA Construction-Linked Milestone Plan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center">
                STANDARD MAHARERA CONSTRUCTION-LINKED MILESTONE PLAN
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">10%</span>
                  <span className="text-slate-500">Booking Advance</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">20%</span>
                  <span className="text-slate-500">Agreement Reg.</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">15%</span>
                  <span className="text-slate-500">Plinth Level</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">25%</span>
                  <span className="text-slate-500">Slab Milestones</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">30%</span>
                  <span className="text-slate-500">Finishing &amp; OC</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-200">
              <p>1. This quotation is valid for 15 days from the date of issuance.</p>
              <p>2. Cheques / RTGS payable in favour of official MahaRERA project designated escrow account.</p>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="border-t border-slate-400 pt-2 text-left">
                <span className="text-xs font-semibold text-slate-700 block">
                  Buyer Signature
                </span>
              </div>
              <div className="border-t border-slate-400 pt-2 text-right">
                <span className="text-xs font-bold text-slate-900 block">
                  For Ashapura Builders
                </span>
                <span className="text-[10px] text-slate-500 block">Authorized Sales Signatory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
