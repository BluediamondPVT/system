'use server';

import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, JWTPayloadData, getDashboardRouteForRole } from '@/lib/auth';
import { setAuthCookie, clearAuthCookie } from '@/lib/session';
import { loginSchema, LoginInput } from '@/lib/validations/auth';

export type { LoginInput };

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: JWTPayloadData;
  redirectUrl?: string;
}

/**
 * Server Action to authenticate a user, issue a JWT token, and set an HTTP-only cookie.
 */
export async function loginAction(data: LoginInput): Promise<AuthResponse> {
  try {
    const parseResult = loginSchema.safeParse(data);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message || 'Invalid input data',
      };
    }

    const { identifier, password } = parseResult.data;

    await connectToDatabase();

    const user = await User.findByCredentials(identifier);
    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials. User does not exist.',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'This account is deactivated. Please contact an administrator.',
      };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return {
        success: false,
        error: 'Invalid credentials. Incorrect password.',
      };
    }

    const payload: JWTPayloadData = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = await signToken(payload);
    await setAuthCookie(token);

    const redirectUrl = getDashboardRouteForRole(user.role);

    return {
      success: true,
      message: 'Login successful',
      user: payload,
      redirectUrl,
    };
  } catch (error: unknown) {
    console.error('Login action error:', error);
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred during login';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server Action to log out the user by clearing the auth cookie.
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    await clearAuthCookie();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}
