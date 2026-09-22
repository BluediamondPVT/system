import { NextRequest, NextResponse } from 'next/server';
import {
  verifyToken,
  AUTH_COOKIE_NAME,
  getDashboardRouteForRole,
  isAuthorizedForPath,
} from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve auth token from request cookies
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;
  const isAuthenticated = !!user;

  // Case 1: If user is authenticated and attempts to access /login
  if (pathname === '/login') {
    if (isAuthenticated && user) {
      const targetRoute = getDashboardRouteForRole(user.role);
      return NextResponse.redirect(new URL(targetRoute, req.url));
    }
    return NextResponse.next();
  }

  // Case 2: If user is NOT authenticated, redirect to /login
  if (!isAuthenticated || !user) {
    const loginUrl = new URL('/login', req.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated from here on
  const userRoleDashboard = getDashboardRouteForRole(user.role);

  // Case 3: If user accesses root '/', route to the master dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Case 4: Enforce role-based access control (RBAC) on module routes
  // (e.g. SALES cannot access /dashboard/super-admin or /dashboard/account)
  if (!isAuthorizedForPath(user.role, pathname)) {
    return NextResponse.redirect(new URL(userRoleDashboard, req.url));
  }

  // Allow authorized request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (e.g. /api/seed, /api/auth/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images & static files (.svg, .png, .jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
