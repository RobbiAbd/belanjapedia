import { z } from 'zod'
import { addressSchema } from '#shared/utils/address'
import { zodFieldErrors } from '#shared/utils/auth'

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
      data: apiError('ID alamat tidak valid')
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

  const existing = await prisma.address.findFirst({
    where: {
      id: params.data.id,
      userId
    }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      data: apiError('Alamat tidak ditemukan')
    })
  }

  const address = await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      })
    }

    return tx.address.update({
      where: { id: existing.id },
      data: {
        label: parsed.data.label?.trim() || existing.label || 'Rumah',
        recipient: parsed.data.recipient,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        province: parsed.data.province,
        postalCode: parsed.data.postalCode,
        isDefault: parsed.data.isDefault ?? existing.isDefault
      }
    })
  })

  return apiSuccess(
    { address: formatAddressResponse(address) },
    'Alamat berhasil diperbarui'
  )
})
