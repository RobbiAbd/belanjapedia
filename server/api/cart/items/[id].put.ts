import { z } from 'zod'
import { zodFieldErrors } from '#shared/utils/auth'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive()
})

const bodySchema = z.object({
  quantity: z.number().int().min(1).max(99)
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
      data: apiError('ID item tidak valid')
    })
  }

  const body = await readBody(event)
  const parsedBody = bodySchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsedBody.error))
    })
  }

  const cart = await getOrCreateCart(userId)

  const item = await prisma.cartItem.findFirst({
    where: {
      id: params.data.id,
      cartId: cart.id
    }
  })

  if (!item) {
    throw createError({
      statusCode: 404,
      data: apiError('Item keranjang tidak ditemukan')
    })
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: parsedBody.data.quantity }
  })

  const refreshed = await getOrCreateCart(userId)

  return apiSuccess(
    { items: mapDbCartItems(refreshed.items) },
    'Jumlah item diperbarui'
  )
})
