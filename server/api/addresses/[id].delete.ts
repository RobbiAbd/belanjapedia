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
      data: apiError('ID alamat tidak valid')
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

  await prisma.$transaction(async (tx) => {
    await tx.address.delete({ where: { id: existing.id } })

    if (existing.isDefault) {
      const nextDefault = await tx.address.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      })

      if (nextDefault) {
        await tx.address.update({
          where: { id: nextDefault.id },
          data: { isDefault: true }
        })
      }
    }
  })

  return apiSuccess(null, 'Alamat berhasil dihapus')
})
