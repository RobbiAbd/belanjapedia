import { registerSchema, zodFieldErrors } from '#shared/utils/auth'
import { Role } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const existing = await prisma.user.findFirst({
    where: {
      email: parsed.data.email,
      deletedAt: null
    }
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      data: apiError('Email sudah terdaftar', { email: 'Email sudah digunakan' })
    })
  }

  const password = await hashUserPassword(parsed.data.password)

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      phone: parsed.data.phone ?? null,
      role: Role.CUSTOMER
    }
  })

  const sessionUser = mapUserToSession(user)

  await setUserSession(event, {
    user: sessionUser,
    loggedInAt: new Date()
  })

  return apiSuccess({ user: sessionUser }, 'Registrasi berhasil')
})
