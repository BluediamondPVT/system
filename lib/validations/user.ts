import { z } from 'zod';

export const USER_ASSIGNABLE_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'SALES',
  'ACCOUNT',
] as const;
export type AssignableRole = (typeof USER_ASSIGNABLE_ROLES)[number];

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  username: z
    .string()
    .trim()
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  role: z.enum(USER_ASSIGNABLE_ROLES, {
    message: 'Please select a valid role (SUPER_ADMIN, ADMIN, SALES, or ACCOUNT)',
  }),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional(),
  username: z
    .string()
    .trim()
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional()
    .or(z.literal('')),
  role: z.enum(USER_ASSIGNABLE_ROLES).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
