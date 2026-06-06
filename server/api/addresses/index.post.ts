import { addressSchema } from '#shared/utils/address'
import { zodFieldErrors } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const body = await readBody(event)
  const parsed = addressSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const addressCount = await prisma.address.count({ where: { userId } })
  const isDefault = parsed.data.isDefault || addressCount === 0

  const address = await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      })
    }

    return tx.address.create({
      data: {
        userId,
        label: parsed.data.label?.trim() || 'Rumah',
        recipient: parsed.data.recipient,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        province: parsed.data.province,
        postalCode: parsed.data.postalCode,
        isDefault
      }
    })
  })

  return apiSuccess(
    { address: formatAddressResponse(address) },
    'Alamat berhasil disimpan'
  )
})
