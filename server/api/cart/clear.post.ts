export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })
  }

  return apiSuccess({ items: [] }, 'Keranjang dikosongkan')
})
