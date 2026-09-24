import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'auth_token';

// Fallback secret for development; in production, always provide a secure JWT_SECRET in .env.local
const JWT_SECRET =
  process.env.JWT_SECRET || 'erp_super_secure_jwt_secret_key_change_in_production_min32';

const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayloadData {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT';
  username?: string;
}

/**
 * 
 * Generate a signed JWT token containing user identity and role.
 * Valid for 24 hours. Edge-runtime compatible.
 */
export async function signToken(payload: JWTPayloadData): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    username: payload.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

/**
 * Verify a JWT token and extract the payload.
 * Edge-runtime compatible.
 */
export async function verifyToken(token: string): Promise<JWTPayloadData | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayloadData;
  } catch {
    return null;
  }
}

/**
 * Maps a user role to their dedicated dashboard route.
 */
/**
 * Maps each user role to their dedicated primary workspace route:
 * - ACCOUNT -> /dashboard/accounts (MahaRERA Demands & Society Ledger)
 * - SALES   -> /dashboard/leads (Lead CRM & Pipeline)
 * - SUPER_ADMIN / ADMIN -> /dashboard (Master Executive Console)
 */
export function getDashboardRouteForRole(role?: string): string {
  switch (role) {
    case 'ACCOUNT':
      return '/dashboard/accounts';
    case 'SALES':
      return '/dashboard/leads';
    case 'SUPER_ADMIN':
    case 'ADMIN':
    default:
      return '/dashboard';
  }
}

/**
 * Checks whether a given role has authorization to access a specific route pathname.
 * SUPER_ADMIN has access to all dashboards and identity governance.
 * ADMIN has access to inventory, CRM, and accounts.
 * SALES has access to inventory and CRM (blocked from Accounts and Users).
 * ACCOUNT has access to inventory (read-only) and accounts (blocked from CRM and Users).
 */
export function isAuthorizedForPath(role: string, pathname: string): boolean {
  if (role === 'SUPER_ADMIN') {
    return true;
  }

  // Users & Identity Governance is strictly SUPER_ADMIN only
  if (pathname.startsWith('/dashboard/users')) {
    return role === 'SUPER_ADMIN';
  }

  // Accounts & MahaRERA Demands: SUPER_ADMIN, ADMIN, and ACCOUNT only (SALES is blocked)
  if (pathname.startsWith('/dashboard/accounts')) {
    return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'ACCOUNT';
  }

  // Lead CRM & Sourcing Pipeline: SUPER_ADMIN, ADMIN, and SALES only (ACCOUNT is blocked)
  if (pathname.startsWith('/dashboard/leads')) {
    return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'SALES';
  }

  return true;
}
