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
export function getDashboardRouteForRole(role?: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard/super-admin';
    case 'ADMIN':
      return '/dashboard/admin';
    case 'SALES':
      return '/dashboard/sales';
    case 'ACCOUNT':
      return '/dashboard/account';
    default:
      return '/dashboard';
  }
}

/**
 * Checks whether a given role has authorization to access a specific route pathname.
 * SUPER_ADMIN has access to all dashboards.
 * Other roles are restricted strictly to their assigned module dashboards.
 */
export function isAuthorizedForPath(role: string, pathname: string): boolean {
  if (role === 'SUPER_ADMIN') {
    return true;
  }

  if (pathname.startsWith('/dashboard/super-admin')) {
    return role === 'SUPER_ADMIN';
  }
  if (pathname.startsWith('/dashboard/admin')) {
    return role === 'ADMIN';
  }
  if (pathname.startsWith('/dashboard/sales')) {
    return role === 'SALES';
  }
  if (pathname.startsWith('/dashboard/account')) {
    return role === 'ACCOUNT';
  }

  return true;
}
