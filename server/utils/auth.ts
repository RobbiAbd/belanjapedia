import bcrypt from 'bcrypt'
import type { User } from '@prisma/client'
import { toPublicUser } from '#shared/utils/auth'

export async function hashUserPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyUserPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export function mapUserToSession(
  user: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'coins' | 'role'>
) {
  return toPublicUser(user)
}
