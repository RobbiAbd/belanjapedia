import { loginSchema, zodFieldErrors } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsed.data.email,
      deletedAt: null
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      data: apiError('Email atau password salah')
    })
  }

  const valid = await verifyUserPassword(user.password, parsed.data.password)

  if (!valid) {
    throw createError({
      statusCode: 401,
      data: apiError('Email atau password salah')
    })
  }

  const sessionUser = mapUserToSession(user)

  await setUserSession(event, {
    user: sessionUser,
    loggedInAt: new Date()
  })

  return apiSuccess({ user: sessionUser }, 'Login berhasil')
})
