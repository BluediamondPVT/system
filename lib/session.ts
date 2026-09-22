import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, JWTPayloadData, verifyToken } from './auth';

/**
 * Stores the JWT token in an HTTP-only, secure cookie.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Clears the authentication cookie to log out the user.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Extracts and verifies the current session user from incoming cookies.
 */
export async function getSessionUser(): Promise<JWTPayloadData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}
