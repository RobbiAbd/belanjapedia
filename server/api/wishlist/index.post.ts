import { zodFieldErrors } from '#shared/utils/auth'
import { addWishlistSchema, mapWishlistProduct } from '#shared/utils/wishlist'

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
  const parsed = addWishlistSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parsed.data.productId,
      deletedAt: null,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { url: true, alt: true, sortOrder: true }
      }
    }
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      data: apiError('Produk tidak ditemukan')
    })
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: product.id
      }
    }
  })

  if (existing) {
    return apiSuccess(
      { item: mapWishlistProduct(product) },
      'Produk sudah ada di wishlist'
    )
  }

  await prisma.wishlistItem.create({
    data: {
      userId,
      productId: product.id
    }
  })

  return apiSuccess(
    { item: mapWishlistProduct(product) },
    'Ditambahkan ke wishlist'
  )
})
