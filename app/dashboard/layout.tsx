import { getSessionUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { GlassShell } from '@/components/glass-shell';
import { getAllProjectsAction } from '@/app/actions/project';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, projectsRes] = await Promise.all([
    getSessionUser(),
    getAllProjectsAction(),
  ]);

  if (!session) {
    redirect('/login');
  }

  const initialProjects =
    projectsRes.success && projectsRes.projects ? projectsRes.projects : undefined;

  return (
    <GlassShell session={session} initialProjects={initialProjects}>
      {children}
    </GlassShell>
  );
}
