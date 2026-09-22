import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { isAuthorizedForPath, getDashboardRouteForRole } from '@/lib/auth';
import { DashboardWidgets } from '@/components/widgets/dashboard-widgets';
import { Filter, Download } from 'lucide-react';

export default async function SalesDashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  if (!isAuthorizedForPath(session.role, '/dashboard/sales')) {
    redirect(getDashboardRouteForRole(session.role));
  }

  const sampleDeals = [
    { client: 'Apex Technologies Inc.', stage: 'Contract Signed', value: '$84,000', rep: 'sales_user@erp.com', status: 'Won' },
    { client: 'Starlight Retailers Ltd.', stage: 'Commercial Negotiation', value: '$42,500', rep: 'sales_user@erp.com', status: 'In Review' },
    { client: 'Nexus Healthcare Systems', stage: 'Technical Proposal', value: '$65,000', rep: 'sales_user@erp.com', status: 'Pending' },
    { client: 'Vanguard Global Corp.', stage: 'Discovery Call', value: '$32,000', rep: 'sales_user@erp.com', status: 'Pending' },
    { client: 'Beacon Logistics Group', stage: 'Payment Verified', value: '$58,000', rep: 'sales_user@erp.com', status: 'Won' },
  ];

  return (
    <div className="space-y-8">
      {/* Core ERP Financial & Performance Widgets for Sales */}
      <DashboardWidgets
        role="SALES"
        email={session.email}
        username={session.username}
        title="My Dashboard"
        welcomeText="Welcome Sales Team"
      />

      {/* Sales Pipeline & Opportunity Dealflow Table */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Active Deal Pipeline</h3>
            <p className="text-xs text-white/50">
              High-priority opportunities closing in Q3 / Q4
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="glass-pill px-3 py-1.5 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter Stage</span>
            </button>
            <button
              type="button"
              className="glass-pill px-3 py-1.5 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-white/50" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/[0.04] text-white/60 border-b border-white/10">
                <th className="py-3 px-4 font-medium">Enterprise Account</th>
                <th className="py-3 px-4 font-medium">Stage</th>
                <th className="py-3 px-4 font-medium">Deal Value</th>
                <th className="py-3 px-4 font-medium">Owner</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {sampleDeals.map((deal) => (
                <tr key={deal.client} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">{deal.client}</td>
                  <td className="py-3.5 px-4 text-white/60">{deal.stage}</td>
                  <td className="py-3.5 px-4 font-bold text-white tracking-tight">{deal.value}</td>
                  <td className="py-3.5 px-4 text-white/50">{deal.rep}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        deal.status === 'Won'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          : deal.status === 'In Review'
                          ? 'bg-[#ff6536]/15 text-[#ff6536] border-[#ff6536]/30'
                          : 'bg-blue-500/15 text-blue-300 border-blue-400/30'
                      }`}
                    >
                      {deal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
