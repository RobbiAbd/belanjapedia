export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { updatedAt: 'desc' }
    ]
  })

  return apiSuccess(
    { addresses: addresses.map(formatAddressResponse) },
    'Alamat berhasil diambil'
  )
})
