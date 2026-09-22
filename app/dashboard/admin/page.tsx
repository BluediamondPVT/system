import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { isAuthorizedForPath, getDashboardRouteForRole } from '@/lib/auth';
import { DashboardWidgets } from '@/components/widgets/dashboard-widgets';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  if (!isAuthorizedForPath(session.role, '/dashboard/admin')) {
    redirect(getDashboardRouteForRole(session.role));
  }

  const operationsTasks = [
    { id: 'TSK-104', title: 'Q3 Enterprise Security Audit & SOC2 Review', dept: 'DevOps & Sec', owner: 'Alex Rivera', priority: 'High', status: 'In Progress' },
    { id: 'TSK-108', title: 'Sales Commission Ledger Reconciliation', dept: 'Finance & Sales', owner: 'Elena Rostova', priority: 'Medium', status: 'Completed' },
    { id: 'TSK-112', title: 'Supply Chain Fulfillment Milestone Check', dept: 'Logistics', owner: 'Tariq Mansoor', priority: 'High', status: 'Pending Review' },
    { id: 'TSK-115', title: 'Staff Quarterly KPI Appraisals Submission', dept: 'HR & People', owner: 'Sophia Lin', priority: 'Low', status: 'In Progress' },
    { id: 'TSK-119', title: 'Disaster Recovery Automated Simulation Run', dept: 'Infrastructure', owner: 'Marcus Vance', priority: 'Urgent', status: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Core ERP Financial & Performance Widgets for Admin */}
      <DashboardWidgets
        role="ADMIN"
        email={session.email}
        username={session.username}
        title="My Dashboard"
        welcomeText="Welcome Admin Team"
      />

      {/* Operational Checkpoints & Tasks */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Operations & Department Checkpoints</h3>
            <p className="text-xs text-white/50">
              Cross-functional enterprise projects and sprint deliverables
            </p>
          </div>
          <div className="glass-pill px-3 py-1 text-xs text-blue-300 border-blue-500/30">
            Sprint 14 Active
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/[0.04] text-white/60 border-b border-white/10">
                <th className="py-3 px-4 font-medium">Task ID</th>
                <th className="py-3 px-4 font-medium">Checkpoint Title</th>
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium">Assignee</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {operationsTasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-white/70">{task.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{task.title}</td>
                  <td className="py-3.5 px-4 text-white/50">{task.dept}</td>
                  <td className="py-3.5 px-4 text-white/80">{task.owner}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        task.priority === 'Urgent'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                          : task.priority === 'High'
                          ? 'bg-[#ff6536]/15 text-[#ff6536] border-[#ff6536]/30'
                          : 'bg-blue-500/15 text-blue-300 border-blue-400/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        task.status === 'Completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          : task.status === 'In Progress'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-400/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                      }`}
                    >
                      {task.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : task.status === 'In Progress' ? (
                        <Clock className="w-3 h-3 text-blue-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                      )}
                      {task.status}
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
