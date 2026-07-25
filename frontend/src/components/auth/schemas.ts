import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
})

export type SignupFormData = z.infer<typeof signupSchema>

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  description: z.string().optional(),
  gateway_id: z.coerce.number().positive('Select a gateway').optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

export const reportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  report_type: z.string().min(1, 'Report type is required'),
})

export type ReportFormData = z.infer<typeof reportSchema>
