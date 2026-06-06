import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
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

  const query = querySchema.safeParse(getQuery(event))

  if (!query.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Parameter tidak valid')
    })
  }

  const { page, limit } = query.data
  const skip = (page - 1) * limit

  const [transactions, total] = await Promise.all([
    prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.coinTransaction.count({ where: { userId } })
  ])

  return apiSuccess({
    transactions: transactions.map(tx => ({
      id: tx.id,
      amount: tx.amount,
      type: tx.type,
      reference: tx.reference,
      createdAt: tx.createdAt
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }, 'Riwayat coin berhasil diambil')
})
