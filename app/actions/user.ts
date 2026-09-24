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

export interface UpdateUserResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update an existing user's details, role, status, or reset password.
 * Only SUPER_ADMIN is authorized.
 */
export async function updateUserAction(
  data: {
    id: string;
    email?: string;
    username?: string;
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT';
    isActive?: boolean;
    password?: string;
  }
): Promise<UpdateUserResponse> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admins can update users.' };
    }

    if (!data.id) {
      return { success: false, error: 'User ID is required.' };
    }

    await connectToDatabase();
    const user = await User.findById(data.id);
    if (!user) {
      return { success: false, error: 'User not found in database.' };
    }

    // If changing email, ensure no collision with another account
    if (data.email) {
      const normalizedEmail = data.email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: data.id } });
        if (existing) {
          return { success: false, error: `Email "${normalizedEmail}" is already taken by another account.` };
        }
        user.email = normalizedEmail;
      }
    }

    // Prevent deactivating or demoting the last active Super Admin
    if (
      user.role === 'SUPER_ADMIN' &&
      ((data.role && data.role !== 'SUPER_ADMIN') || data.isActive === false)
    ) {
      const activeSuperAdmins = await User.countDocuments({
        role: 'SUPER_ADMIN',
        isActive: true,
        _id: { $ne: data.id },
      });
      if (activeSuperAdmins < 1) {
        return {
          success: false,
          error: 'Security constraint: Cannot demote or deactivate the last active Super Admin account.',
        };
      }
    }

    if (data.username !== undefined) {
      user.username = data.username.trim() || user.email.split('@')[0];
    }

    if (data.role) {
      user.role = data.role;
    }

    if (typeof data.isActive === 'boolean') {
      user.isActive = data.isActive;
    }

    if (data.password && data.password.trim().length >= 6) {
      user.password = data.password.trim();
    }

    await user.save();

    revalidatePath('/dashboard/users');
    revalidatePath('/dashboard/super-admin');

    return {
      success: true,
      message: `User ${user.email} updated successfully.`,
    };
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to update user';
    return { success: false, error: message };
  }
}

/**
 * Permanently delete a user account from the system.
 * Only SUPER_ADMIN is authorized.
 */
export async function deleteUserAction(
  userId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admins can delete users.' };
    }

    if (!userId) {
      return { success: false, error: 'User ID is required.' };
    }

    // Safety constraint: Prevent deleting self
    if (session.userId === userId) {
      return {
        success: false,
        error: 'Security restriction: You cannot delete your own logged-in account.',
      };
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User does not exist or has already been deleted.' };
    }

    // Safety constraint: Prevent deleting the last remaining Super Admin
    if (user.role === 'SUPER_ADMIN') {
      const superAdminCount = await User.countDocuments({ role: 'SUPER_ADMIN' });
      if (superAdminCount <= 1) {
        return {
          success: false,
          error: 'Cannot delete the only remaining Super Admin account.',
        };
      }
    }

    await User.findByIdAndDelete(userId);

    revalidatePath('/dashboard/users');
    revalidatePath('/dashboard/super-admin');

    return {
      success: true,
      message: `User ${user.email} has been permanently deleted.`,
    };
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to delete user';
    return { success: false, error: message };
  }
}
