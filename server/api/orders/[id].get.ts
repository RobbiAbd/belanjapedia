import { z } from 'zod'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive()
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const params = paramsSchema.safeParse(getRouterParams(event))

  if (!params.success) {
    throw createError({
      statusCode: 400,
      data: apiError('ID pesanan tidak valid')
    })
  }

  const isAdmin = session.user?.role === 'ADMIN' || session.user?.role === 'STAFF'

  const order = await prisma.order.findFirst({
    where: {
      id: params.data.id,
      ...(isAdmin ? {} : { userId })
    },
    include: {
      items: true,
      payment: true,
      shippingAddress: true
    }
  })

  if (!order) {
    throw createError({
      statusCode: 404,
      data: apiError('Pesanan tidak ditemukan')
    })
  }

  return apiSuccess(
    { order: formatOrderResponse(order) },
    'Detail pesanan berhasil diambil'
  )
})
