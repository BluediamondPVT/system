import { getSessionUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { GlassShell } from '@/components/glass-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) {
    redirect('/login');
  }

  return <GlassShell session={session}>{children}</GlassShell>;
}
