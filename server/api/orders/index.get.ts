export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const isAdmin = session.user?.role === 'ADMIN' || session.user?.role === 'STAFF'

  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      payment: true,
      items: { select: { quantity: true } }
    }
  })

  return apiSuccess(
    { items: orders.map(formatOrderListItem) },
    'Daftar pesanan berhasil diambil'
  )
})
