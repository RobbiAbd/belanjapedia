export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      coins: true,
      role: true
    }
  })

  if (!user) {
    await clearUserSession(event)
    throw createError({
      statusCode: 401,
      data: apiError('Pengguna tidak ditemukan')
    })
  }

  return apiSuccess({ user: mapUserToSession(user) }, 'Profil berhasil diambil')
})
