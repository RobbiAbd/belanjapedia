export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { products: true } }
    }
  })

  return apiSuccess(categories, 'Kategori berhasil diambil')
})
