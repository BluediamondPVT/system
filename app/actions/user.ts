'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getSessionUser } from '@/lib/session';
import { createUserSchema, CreateUserInput } from '@/lib/validations/user';

export interface CreateUserResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
    createdAt: Date;
  };
}

/**
 * Secure Server Action to create a new user.
 * Strictly verifies caller possesses the 'SUPER_ADMIN' role via JWT session cookie.
 */
export async function createUserAction(
  data: CreateUserInput
): Promise<CreateUserResponse> {
  try {
    // 1. Authenticate caller session & role via JOSE JWT verification
    const session = await getSessionUser();

    if (!session || session.role !== 'SUPER_ADMIN') {
      return {
        success: false,
        error: 'Unauthorized: Only users with the SUPER_ADMIN role can create users.',
      };
    }

    // 2. Validate form input with Zod
    const validation = createUserSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Invalid input data',
      };
    }

    const { email, password, role, username } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectToDatabase();

    // 3. Verify no existing user with the same email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return {
        success: false,
        error: `A user with email "${normalizedEmail}" already exists.`,
      };
    }

    // 4. Create and save new user (triggers pre-save bcrypt hashing hook)
    const newUser = new User({
      email: normalizedEmail,
      username: username ? username.trim() : normalizedEmail.split('@')[0],
      password,
      role,
      isActive: true,
    });

    await newUser.save();

    // Revalidate dashboard routes so newly created user appears immediately
    revalidatePath('/dashboard/super-admin');

    return {
      success: true,
      message: `User ${normalizedEmail} created successfully with role ${role}.`,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  } catch (error: unknown) {
    console.error('Error in createUserAction:', error);
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred while creating user';
    return {
      success: false,
      error: message,
    };
  }
}

export interface UserSummary {
  id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface MongoUserDoc {
  _id: { toString(): string } | string;
  email: string;
  username?: string;
  role: string;
  isActive: boolean;
  createdAt?: Date | string;
}

/**
 * Fetch all users for Super Admin directory view.
 */
export async function getAllUsersAction(): Promise<{
  success: boolean;
  users?: UserSummary[];
  error?: string;
}> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectToDatabase();
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .lean<MongoUserDoc[]>();

    const formatted: UserSummary[] = users.map((u: MongoUserDoc) => ({
      id: u._id.toString(),
      email: u.email,
      username: u.username || u.email.split('@')[0],
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, users: formatted };
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}
