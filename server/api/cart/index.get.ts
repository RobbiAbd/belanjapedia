export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const cart = await getOrCreateCart(userId)

  return apiSuccess(
    { items: mapDbCartItems(cart.items) },
    'Keranjang berhasil diambil'
  )
})
