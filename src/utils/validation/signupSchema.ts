import * as z from 'zod';

export const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().min(5, 'Invalid email address'),
  phone: z.string()
    .regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number')
    .min(7, 'Phone number too short'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
