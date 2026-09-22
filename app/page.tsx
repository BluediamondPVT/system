import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getDashboardRouteForRole } from '@/lib/auth';

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect(getDashboardRouteForRole(user.role));
  }

  redirect('/login');
}
