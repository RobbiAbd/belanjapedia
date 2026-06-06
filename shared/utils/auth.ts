import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi')
})

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform(v => (v === '' ? undefined : v))
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export type PublicUser = {
  id: number
  name: string
  email: string
  phone: string | null
  coins: number
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF'
}

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = issue.path.length > 0
      ? issue.path.map(segment => String(segment)).join('.')
      : '_form'

    if (!errors[key]) {
      errors[key] = issue.message
    }
  }

  return errors
}

export function mapApiFieldErrors(
  apiErrors: Record<string, string>,
  prefix = 'shipping.'
): Record<string, string> {
  const mapped: Record<string, string> = {}

  for (const [key, message] of Object.entries(apiErrors)) {
    const field = key.startsWith(prefix) ? key.slice(prefix.length) : key
    mapped[field] = message
  }

  return mapped
}

export function toPublicUser(user: {
  id: number
  name: string
  email: string
  phone: string | null
  coins: number
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF'
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    coins: user.coins,
    role: user.role
  }
}
