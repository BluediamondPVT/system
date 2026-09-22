import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { isAuthorizedForPath, getDashboardRouteForRole } from '@/lib/auth';
import { DashboardWidgets } from '@/components/widgets/dashboard-widgets';
import { FileText, Download, CheckCircle2, Clock } from 'lucide-react';

export default async function AccountDashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  if (!isAuthorizedForPath(session.role, '/dashboard/account')) {
    redirect(getDashboardRouteForRole(session.role));
  }

  const recentTransactions = [
    { ref: 'INV-2026-089', party: 'Vertex Cloud Infrastructure', type: 'Disbursement', amount: '-$14,250.00', date: '21 Sep 2026', status: 'Settled' },
    { ref: 'REC-2026-441', party: 'Apex Technologies Client Pmt', type: 'Receivable', amount: '+$84,000.00', date: '20 Sep 2026', status: 'Settled' },
    { ref: 'INV-2026-092', party: 'AWS Services Global', type: 'Operating Cost', amount: '-$3,850.00', date: '19 Sep 2026', status: 'Settled' },
    { ref: 'REC-2026-442', party: 'Beacon Logistics Retention', type: 'Receivable', amount: '+$29,000.00', date: '18 Sep 2026', status: 'Pending Verification' },
    { ref: 'INV-2026-095', party: 'Executive Office Lease', type: 'Facilities', amount: '-$12,000.00', date: '17 Sep 2026', status: 'Settled' },
  ];

  return (
    <div className="space-y-8">
      {/* Core ERP Financial & Performance Widgets for Account */}
      <DashboardWidgets
        role="ACCOUNT"
        email={session.email}
        username={session.username}
        title="My Dashboard"
        welcomeText="Welcome Account Team"
      />

      {/* General Ledger & Recent Invoices/Disbursements */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Treasury & General Ledger</h3>
            <p className="text-xs text-white/50">
              Audited transaction receipts and verified disbursements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="glass-pill px-3 py-1.5 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Audit Sheet</span>
            </button>
            <button
              type="button"
              className="glass-pill px-3 py-1.5 text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-white/50" />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/[0.04] text-white/60 border-b border-white/10">
                <th className="py-3 px-4 font-medium">Reference ID</th>
                <th className="py-3 px-4 font-medium">Counterparty / Description</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Booking Date</th>
                <th className="py-3 px-4 font-medium">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {recentTransactions.map((tx) => (
                <tr key={tx.ref} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-white/70">{tx.ref}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{tx.party}</td>
                  <td className="py-3.5 px-4 text-white/50">{tx.type}</td>
                  <td
                    className={`py-3.5 px-4 font-bold tracking-tight ${
                      tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {tx.amount}
                  </td>
                  <td className="py-3.5 px-4 text-white/50">{tx.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        tx.status === 'Settled'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                      }`}
                    >
                      {tx.status === 'Settled' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-400" />
                      )}
                      {tx.status}
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
