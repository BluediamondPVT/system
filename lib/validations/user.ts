import { z } from 'zod';

export const USER_ASSIGNABLE_ROLES = ['ADMIN', 'SALES', 'ACCOUNT'] as const;
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
    message: 'Please select a valid role (ADMIN, SALES, or ACCOUNT)',
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
