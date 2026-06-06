import { OrderStatus, PaymentStatus, PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const SEED_SHIPPING_COST = 1_500_000
const SEED_TAX_RATE = 0.11

const prisma = new PrismaClient()

function dummyImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/600/600`
}

type ProductSeed = {
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  sku: string
  isFeatured?: boolean
  categorySlug: string
  imageUrls: string[]
}

const products: ProductSeed[] = [
  {
    name: 'Headphone Bluetooth',
    slug: 'headphone-bluetooth',
    description: 'Headphone nirkabel dengan noise cancelling dan baterai tahan 30 jam.',
    price: 3_500_000,
    comparePrice: 4_500_000,
    stock: 50,
    sku: 'HP-BT-001',
    isFeatured: true,
    categorySlug: 'elektronik',
    imageUrls: [
      dummyImage('headphone-bluetooth-1'),
      dummyImage('headphone-bluetooth-2')
    ]
  },
  {
    name: 'Kaos Polos Premium',
    slug: 'kaos-polos-premium',
    description: 'Kaos polos bahan katun combed 30s, nyaman dipakai sehari-hari.',
    price: 8_900_000,
    stock: 100,
    sku: 'KPP-001',
    isFeatured: true,
    categorySlug: 'fashion',
    imageUrls: [dummyImage('kaos-polos-premium')]
  },
  {
    name: 'Blender Multifungsi',
    slug: 'blender-multifungsi',
    description: 'Blender 2 liter dengan 5 kecepatan, cocok untuk smoothie dan masakan sehari-hari.',
    price: 45_000_000,
    comparePrice: 59_900_000,
    stock: 35,
    sku: 'BLM-002',
    isFeatured: true,
    categorySlug: 'rumah-tangga',
    imageUrls: [dummyImage('blender-multifungsi')]
  },
  {
    name: 'Smartwatch Sport',
    slug: 'smartwatch-sport',
    description: 'Jam tangan pintar dengan monitor detak jantung dan mode olahraga.',
    price: 125_000_000,
    stock: 28,
    sku: 'SWS-003',
    isFeatured: true,
    categorySlug: 'elektronik',
    imageUrls: [
      dummyImage('smartwatch-sport-1'),
      dummyImage('smartwatch-sport-2'),
      dummyImage('smartwatch-sport-3')
    ]
  },
  {
    name: 'Tas Selempang Casual',
    slug: 'tas-selempang-casual',
    description: 'Tas selempang ringan dengan banyak kompartemen, ideal untuk aktivitas harian.',
    price: 27_500_000,
    stock: 60,
    sku: 'TSC-004',
    categorySlug: 'fashion',
    imageUrls: [dummyImage('tas-selempang-casual')]
  },
  {
    name: 'Set Peralatan Dapur',
    slug: 'set-peralatan-dapur',
    description: 'Set 12 pcs peralatan dapur stainless steel, tahan lama dan mudah dibersihkan.',
    price: 32_000_000,
    comparePrice: 39_900_000,
    stock: 42,
    sku: 'SPD-005',
    categorySlug: 'rumah-tangga',
    imageUrls: [dummyImage('set-peralatan-dapur')]
  }
]

type CustomerSeed = {
  name: string
  email: string
  phone: string
}

const customers: CustomerSeed[] = [
  { name: 'Budi Santoso', email: 'budi@example.com', phone: '081111111101' },
  { name: 'Siti Rahayu', email: 'siti@example.com', phone: '081111111102' },
  { name: 'Andi Pratama', email: 'andi@example.com', phone: '081111111103' },
  { name: 'Dewi Lestari', email: 'dewi@example.com', phone: '081111111104' }
]

type ReviewSeed = {
  productSlug: string
  customerEmail: string
  rating: number
  comment: string
}

const reviews: ReviewSeed[] = [
  {
    productSlug: 'headphone-bluetooth',
    customerEmail: 'budi@example.com',
    rating: 5,
    comment: 'Suara jernih, baterai awet. Cocok buat kerja dari rumah.'
  },
  {
    productSlug: 'headphone-bluetooth',
    customerEmail: 'siti@example.com',
    rating: 4,
    comment: 'Nyaman dipakai lama, cuma case-nya agak besar.'
  },
  {
    productSlug: 'headphone-bluetooth',
    customerEmail: 'andi@example.com',
    rating: 5,
    comment: 'Noise cancelling-nya mantap, worth it!'
  },
  {
    productSlug: 'headphone-bluetooth',
    customerEmail: 'dewi@example.com',
    rating: 4,
    comment: 'Pengiriman cepat, produk sesuai foto.'
  },
  {
    productSlug: 'kaos-polos-premium',
    customerEmail: 'budi@example.com',
    rating: 5,
    comment: 'Bahan adem, jahitan rapi. Sudah beli dua warna.'
  },
  {
    productSlug: 'kaos-polos-premium',
    customerEmail: 'siti@example.com',
    rating: 4,
    comment: 'Ukuran pas, warna tidak pudar setelah dicuci.'
  },
  {
    productSlug: 'kaos-polos-premium',
    customerEmail: 'dewi@example.com',
    rating: 5,
    comment: 'Harga segini kualitasnya oke banget.'
  },
  {
    productSlug: 'blender-multifungsi',
    customerEmail: 'andi@example.com',
    rating: 4,
    comment: 'Bisa untuk smoothie harian, motor agak berisik tapi kuat.'
  },
  {
    productSlug: 'blender-multifungsi',
    customerEmail: 'siti@example.com',
    rating: 5,
    comment: 'Mata pisau tajam, es batu juga bisa dihaluskan.'
  },
  {
    productSlug: 'smartwatch-sport',
    customerEmail: 'budi@example.com',
    rating: 5,
    comment: 'Fitur olahraga lengkap, layar terang di luar ruangan.'
  },
  {
    productSlug: 'smartwatch-sport',
    customerEmail: 'andi@example.com',
    rating: 4,
    comment: 'Monitor detak jantung akurat, strap nyaman.'
  },
  {
    productSlug: 'smartwatch-sport',
    customerEmail: 'dewi@example.com',
    rating: 5,
    comment: 'Desain sporty, baterai tahan hampir seminggu.'
  },
  {
    productSlug: 'smartwatch-sport',
    customerEmail: 'siti@example.com',
    rating: 3,
    comment: 'Bagus, tapi aplikasi pendamping kadang lag.'
  },
  {
    productSlug: 'tas-selempang-casual',
    customerEmail: 'dewi@example.com',
    rating: 5,
    comment: 'Ringan dan banyak kantong, pas buat daily.'
  },
  {
    productSlug: 'tas-selempang-casual',
    customerEmail: 'budi@example.com',
    rating: 4,
    comment: 'Material kuat, resleting mulus.'
  },
  {
    productSlug: 'set-peralatan-dapur',
    customerEmail: 'siti@example.com',
    rating: 5,
    comment: 'Stainless-nya tebal, lengkap untuk dapur baru.'
  },
  {
    productSlug: 'set-peralatan-dapur',
    customerEmail: 'andi@example.com',
    rating: 4,
    comment: 'Mudah dibersihkan, pengiriman aman.'
  },
  {
    productSlug: 'set-peralatan-dapur',
    customerEmail: 'dewi@example.com',
    rating: 5,
    comment: 'Harga promo sangat worth it, recommended!'
  }
]

type ExtraSaleSeed = {
  productSlug: string
  customerEmail: string
  quantity: number
}

// Penjualan tanpa ulasan — terjual dan review saling independen
const extraSales: ExtraSaleSeed[] = [
  { productSlug: 'tas-selempang-casual', customerEmail: 'siti@example.com', quantity: 8 },
  { productSlug: 'kaos-polos-premium', customerEmail: 'andi@example.com', quantity: 5 },
  { productSlug: 'headphone-bluetooth', customerEmail: 'dewi@example.com', quantity: 12 },
  { productSlug: 'blender-multifungsi', customerEmail: 'budi@example.com', quantity: 6 }
]

async function seedProduct(
  categoryId: number,
  data: ProductSeed
) {
  const product = await prisma.product.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice ?? null,
      stock: data.stock,
      sku: data.sku,
      isActive: true,
      isFeatured: data.isFeatured ?? false,
      categoryId
    },
    create: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice ?? null,
      stock: data.stock,
      sku: data.sku,
      isActive: true,
      isFeatured: data.isFeatured ?? false,
      categoryId
    }
  })

  await prisma.productImage.deleteMany({ where: { productId: product.id } })
  await prisma.productImage.createMany({
    data: data.imageUrls.map((url, index) => ({
      productId: product.id,
      url,
      alt: data.name,
      sortOrder: index
    }))
  })
}

async function seedCustomers(customerPassword: string) {
  const users: Record<string, number> = {}

  for (const customer of customers) {
    const user = await prisma.user.upsert({
      where: { email: customer.email },
      update: {
        name: customer.name,
        phone: customer.phone
      },
      create: {
        name: customer.name,
        email: customer.email,
        password: customerPassword,
        phone: customer.phone,
        role: Role.CUSTOMER
      }
    })

    users[customer.email] = user.id
  }

  return users
}

async function seedReviews(userMap: Record<string, number>) {
  const productRecords = await prisma.product.findMany({
    where: { slug: { in: products.map(item => item.slug) } },
    select: { id: true, slug: true }
  })

  const productMap = Object.fromEntries(
    productRecords.map(product => [product.slug, product.id])
  )

  let count = 0

  for (const review of reviews) {
    const productId = productMap[review.productSlug]
    const userId = userMap[review.customerEmail]

    if (!productId || !userId) continue

    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId,
          userId
        }
      },
      update: {
        rating: review.rating,
        comment: review.comment
      },
      create: {
        productId,
        userId,
        rating: review.rating,
        comment: review.comment
      }
    })

    count++
  }

  return count
}

async function seedDeliveredOrdersForReviews(userMap: Record<string, number>) {
  const productRecords = await prisma.product.findMany({
    where: { slug: { in: products.map(item => item.slug) } }
  })

  const productMap = Object.fromEntries(
    productRecords.map(product => [product.slug, product])
  )

  let count = 0

  for (const review of reviews) {
    const product = productMap[review.productSlug]
    const userId = userMap[review.customerEmail]
    const customer = customers.find(item => item.email === review.customerEmail)

    if (!product || !userId || !customer) continue

    let address = await prisma.address.findFirst({
      where: { userId, label: 'Seed' }
    })

    if (!address) {
      address = await prisma.address.create({
        data: {
          userId,
          label: 'Seed',
          recipient: customer.name,
          phone: customer.phone,
          address: 'Jl. Contoh No. 1',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          postalCode: '12345',
          isDefault: true
        }
      })
    }

    const orderNumber = `SEED-${userId}-${product.id}`
    const subtotal = product.price
    const shippingCost = SEED_SHIPPING_COST
    const tax = Math.round(subtotal * SEED_TAX_RATE)
    const total = subtotal + shippingCost + tax

    const existing = await prisma.order.findUnique({
      where: { orderNumber }
    })

    if (existing) {
      await prisma.order.update({
        where: { id: existing.id },
        data: { status: OrderStatus.DELIVERED }
      })
      count++
      continue
    }

    await prisma.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId: address.id,
        status: OrderStatus.DELIVERED,
        subtotal,
        shippingCost,
        discount: 0,
        coinsUsed: 0,
        total,
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            price: product.price,
            quantity: 1,
            subtotal: product.price
          }
        },
        payment: {
          create: {
            amount: total,
            status: PaymentStatus.PAID,
            paymentMethod: 'transfer',
            paidAt: new Date()
          }
        }
      }
    })

    count++
  }

  return count
}

async function seedExtraSales(userMap: Record<string, number>) {
  const productRecords = await prisma.product.findMany({
    where: { slug: { in: products.map(item => item.slug) } }
  })

  const productMap = Object.fromEntries(
    productRecords.map(product => [product.slug, product])
  )

  let count = 0

  for (const sale of extraSales) {
    const product = productMap[sale.productSlug]
    const userId = userMap[sale.customerEmail]
    const customer = customers.find(item => item.email === sale.customerEmail)

    if (!product || !userId || !customer) continue

    let address = await prisma.address.findFirst({
      where: { userId, label: 'Seed' }
    })

    if (!address) {
      address = await prisma.address.create({
        data: {
          userId,
          label: 'Seed',
          recipient: customer.name,
          phone: customer.phone,
          address: 'Jl. Contoh No. 1',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          postalCode: '12345',
          isDefault: true
        }
      })
    }

    const orderNumber = `SEED-SALE-${userId}-${product.id}`
    const subtotal = product.price * sale.quantity
    const shippingCost = SEED_SHIPPING_COST
    const tax = Math.round(subtotal * SEED_TAX_RATE)
    const total = subtotal + shippingCost + tax

    const existing = await prisma.order.findUnique({
      where: { orderNumber }
    })

    if (existing) {
      count++
      continue
    }

    await prisma.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId: address.id,
        status: OrderStatus.DELIVERED,
        subtotal,
        shippingCost,
        discount: 0,
        coinsUsed: 0,
        total,
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            price: product.price,
            quantity: sale.quantity,
            subtotal
          }
        },
        payment: {
          create: {
            amount: total,
            status: PaymentStatus.PAID,
            paymentMethod: 'transfer',
            paidAt: new Date()
          }
        }
      }
    })

    count++
  }

  return count
}

async function main() {
  const password = await bcrypt.hash('admin123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@belanjapedia.com' },
    update: {},
    create: {
      name: 'Admin BelanjaPedia',
      email: 'admin@belanjapedia.com',
      password,
      role: Role.ADMIN,
      phone: '081234567890'
    }
  })

  const categoryRecords = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'elektronik' },
      update: {},
      create: {
        name: 'Elektronik',
        slug: 'elektronik',
        description: 'Produk elektronik dan gadget',
        sortOrder: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Pakaian dan aksesoris',
        sortOrder: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'rumah-tangga' },
      update: {},
      create: {
        name: 'Rumah Tangga',
        slug: 'rumah-tangga',
        description: 'Kebutuhan rumah tangga',
        sortOrder: 3
      }
    })
  ])

  const categoryMap = Object.fromEntries(
    categoryRecords.map(cat => [cat.slug, cat.id])
  )

  for (const product of products) {
    const categoryId = categoryMap[product.categorySlug]
    if (!categoryId) continue
    await seedProduct(categoryId, product)
  }

  const customerMap = await seedCustomers(customerPassword)
  const orderCount = await seedDeliveredOrdersForReviews(customerMap)
  const extraSaleCount = await seedExtraSales(customerMap)
  const reviewCount = await seedReviews(customerMap)

  console.log('Seed selesai.')
  console.log(`Admin: ${admin.email} / admin123`)
  console.log(`Customer demo: budi@example.com / customer123`)
  console.log(`Produk dummy: ${products.length} (gambar via URL eksternal)`)
  console.log(`Pesanan delivered (seed): ${orderCount}`)
  console.log(`Penjualan tanpa ulasan: ${extraSaleCount}`)
  console.log(`Ulasan dummy: ${reviewCount}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
