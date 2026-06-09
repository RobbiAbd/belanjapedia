import { OrderStatus, PaymentStatus, PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const SEED_SHIPPING_COST = 1_500_000
const SEED_TAX_RATE = 0.11

const prisma = new PrismaClient()

function productPhoto(unsplashId: string): string {
  return `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=800&h=800&q=80`
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
      productPhoto('photo-1505740420928-5e560c06d30e'),
      productPhoto('photo-1434493789847-2f02dc6ca35d'),
      productPhoto('photo-1546435770-a3e426bf472b')
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
    imageUrls: [
      productPhoto('photo-1521572163474-6864f9cf17ab'),
      productPhoto('photo-1583743814966-8936f5b7be1a'),
      productPhoto('photo-1576566588028-4147f3842f27')
    ]
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
    imageUrls: [
      productPhoto('photo-1570222094114-d054a817e56b'),
      productPhoto('photo-1654064754916-e3edeb09c042'),
      productPhoto('photo-1654179279965-8ff0872d976b')
    ]
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
      productPhoto('photo-1523275335684-37898b6baf30'),
      productPhoto('photo-1610945415295-d9bbf067e59c'),
      productPhoto('photo-1579586337278-3befd40fd17a')
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
    imageUrls: [
      productPhoto('photo-1548036328-c9fa89d128fa'),
      productPhoto('photo-1553062407-98eeb64c6a62'),
      productPhoto('photo-1590874103328-eac38a683ce7')
    ]
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
    imageUrls: [
      productPhoto('photo-1556911220-bff31c812dba'),
      productPhoto('photo-1556910103-1c02745aae4d'),
      productPhoto('photo-1604719312566-8912e9227c6a')
    ]
  },
  {
    name: 'Speaker Portabel Bluetooth',
    slug: 'speaker-portabel-bluetooth',
    description: 'Speaker portable dengan bass kuat, tahan air IPX5, dan playtime hingga 12 jam.',
    price: 18_500_000,
    comparePrice: 24_900_000,
    stock: 45,
    sku: 'SPB-006',
    isFeatured: true,
    categorySlug: 'elektronik',
    imageUrls: [
      productPhoto('photo-1558618666-fcd25c85cd64'),
      productPhoto('photo-1546435770-a3e426bf472b'),
      productPhoto('photo-1505740420928-5e560c06d30e')
    ]
  },
  {
    name: 'Power Bank 20000mAh',
    slug: 'power-bank-20000mah',
    description: 'Power bank fast charging 22.5W dengan 2 port USB-C dan display LED kapasitas.',
    price: 12_900_000,
    stock: 80,
    sku: 'PBK-007',
    categorySlug: 'elektronik',
    imageUrls: [
      productPhoto('photo-1527864550417-7fd91fc51a46'),
      productPhoto('photo-1544244015-0df4b3ffc6b0'),
      productPhoto('photo-1610945415295-d9bbf067e59c')
    ]
  },
  {
    name: 'Laptop Stand Aluminium',
    slug: 'laptop-stand-aluminium',
    description: 'Stand laptop ergonomis bahan aluminium, lipat tipis, cocok untuk 11–17 inci.',
    price: 9_500_000,
    comparePrice: 12_900_000,
    stock: 55,
    sku: 'LST-008',
    categorySlug: 'elektronik',
    imageUrls: [
      productPhoto('photo-1523275335684-37898b6baf30'),
      productPhoto('photo-1527864550417-7fd91fc51a46'),
      productPhoto('photo-1579586337278-3befd40fd17a')
    ]
  },
  {
    name: 'Jaket Bomber Pria',
    slug: 'jaket-bomber-pria',
    description: 'Jaket bomber bahan parasut ringan dengan lining nyaman, cocok untuk gaya kasual.',
    price: 22_900_000,
    comparePrice: 29_900_000,
    stock: 40,
    sku: 'JBP-009',
    isFeatured: true,
    categorySlug: 'fashion',
    imageUrls: [
      productPhoto('photo-1551028719-00167b16eac5'),
      productPhoto('photo-1591047139829-d91aecb6caea'),
      productPhoto('photo-1521572163474-6864f9cf17ab')
    ]
  },
  {
    name: 'Sneakers Casual',
    slug: 'sneakers-casual',
    description: 'Sneakers kasual unisex dengan sol empuk dan upper breathable mesh.',
    price: 19_500_000,
    stock: 65,
    sku: 'SNC-010',
    categorySlug: 'fashion',
    imageUrls: [
      productPhoto('photo-1549298916-b41d501d3772'),
      productPhoto('photo-1606107557195-0e29a4b5b4aa'),
      productPhoto('photo-1542291026-7eec264c27ff')
    ]
  },
  {
    name: 'Dompet Kulit Premium',
    slug: 'dompet-kulit-premium',
    description: 'Dompet lipat bahan kulit sintetis premium dengan 8 slot kartu dan kompartemen uang.',
    price: 7_500_000,
    stock: 90,
    sku: 'DKP-011',
    categorySlug: 'fashion',
    imageUrls: [
      productPhoto('photo-1548036328-c9fa89d128fa'),
      productPhoto('photo-1590874103328-eac38a683ce7'),
      productPhoto('photo-1553062407-98eeb64c6a62')
    ]
  },
  {
    name: 'Vacuum Cleaner Robot',
    slug: 'vacuum-cleaner-robot',
    description: 'Robot vacuum dengan navigasi pintar, sedot kuat, dan kontrol via aplikasi.',
    price: 89_000_000,
    comparePrice: 115_000_000,
    stock: 20,
    sku: 'VCR-012',
    isFeatured: true,
    categorySlug: 'rumah-tangga',
    imageUrls: [
      productPhoto('photo-1762186540963-efa1702b3379'),
      productPhoto('photo-1761953881694-b98b238f87bb'),
      productPhoto('photo-1556911220-e15b29be8c8f')
    ]
  },
  {
    name: 'Rice Cooker Digital 1.8L',
    slug: 'rice-cooker-digital',
    description: 'Penanak nasi digital 1.8 liter dengan 8 menu preset dan timer otomatis.',
    price: 38_500_000,
    comparePrice: 49_900_000,
    stock: 38,
    sku: 'RCD-013',
    categorySlug: 'rumah-tangga',
    imageUrls: [
      productPhoto('photo-1556911220-e15b29be8c8f'),
      productPhoto('photo-1564940735784-b15466e8dc09'),
      productPhoto('photo-1761953881694-b98b238f87bb')
    ]
  },
  {
    name: 'Set Sprei Queen Size',
    slug: 'set-sprei-queen-size',
    description: 'Set sprei queen 4 pcs bahan microfiber lembut, anti kusut, dan mudah dicuci.',
    price: 15_900_000,
    stock: 50,
    sku: 'SSQ-014',
    categorySlug: 'rumah-tangga',
    imageUrls: [
      productPhoto('photo-1522771739844-6a9f6d5f14af'),
      productPhoto('photo-1556910103-1c02745aae4d'),
      productPhoto('photo-1604719312566-8912e9227c6a')
    ]
  },
  {
    name: 'Serum Wajah Glow',
    slug: 'serum-wajah-glow',
    description: 'Serum wajah dengan vitamin C dan niacinamide untuk kulit cerah dan lembab.',
    price: 6_900_000,
    comparePrice: 9_500_000,
    stock: 70,
    sku: 'SWG-015',
    isFeatured: true,
    categorySlug: 'kecantikan',
    imageUrls: [
      productPhoto('photo-1596462502278-27bfdc403348'),
      productPhoto('photo-1512496015851-a90fb38ba796'),
      productPhoto('photo-1583743814966-8936f5b7be1a')
    ]
  },
  {
    name: 'Lipstik Matte Collection',
    slug: 'lipstik-matte-collection',
    description: 'Lipstik matte tahan lama dengan 6 pilihan warna, formula ringan dan tidak crack.',
    price: 4_500_000,
    stock: 120,
    sku: 'LMC-016',
    categorySlug: 'kecantikan',
    imageUrls: [
      productPhoto('photo-1512496015851-a90fb38ba796'),
      productPhoto('photo-1596462502278-27bfdc403348'),
      productPhoto('photo-1576566588028-4147f3842f27')
    ]
  },
  {
    name: 'Kuas Makeup Set 12pcs',
    slug: 'kuas-makeup-set',
    description: 'Set kuas makeup 12 pcs dengan bulu sintetis halus dan wadah travel praktis.',
    price: 5_900_000,
    stock: 85,
    sku: 'KMS-017',
    categorySlug: 'kecantikan',
    imageUrls: [
      productPhoto('photo-1512496015851-a90fb38ba796'),
      productPhoto('photo-1522335780786-8b79dee7a55a'),
      productPhoto('photo-1596462502278-27bfdc403348')
    ]
  },
  {
    name: 'Matras Yoga Premium',
    slug: 'matras-yoga-premium',
    description: 'Matras yoga anti slip 6mm dengan tekstur nyaman untuk latihan di rumah atau studio.',
    price: 8_500_000,
    stock: 48,
    sku: 'MYP-018',
    categorySlug: 'olahraga',
    imageUrls: [
      productPhoto('photo-1601925260368-ae2f83cf8b7f'),
      productPhoto('photo-1544367567-0f2fcb009e0b'),
      productPhoto('photo-1534438327276-14e5300c3a48')
    ]
  },
  {
    name: 'Sepatu Running Pro',
    slug: 'sepatu-running-pro',
    description: 'Sepatu lari dengan cushioning responsif dan upper mesh breathable untuk jarak jauh.',
    price: 32_500_000,
    comparePrice: 42_900_000,
    stock: 36,
    sku: 'SRP-019',
    isFeatured: true,
    categorySlug: 'olahraga',
    imageUrls: [
      productPhoto('photo-1542291026-7eec264c27ff'),
      productPhoto('photo-1606107557195-0e29a4b5b4aa'),
      productPhoto('photo-1549298916-b41d501d3772')
    ]
  },
  {
    name: 'Dumbell Set 5kg',
    slug: 'dumbell-set-5kg',
    description: 'Pasangan dumbell vinyl 5kg ergonomis, cocok untuk latihan kekuatan di rumah.',
    price: 14_900_000,
    stock: 42,
    sku: 'DBS-020',
    categorySlug: 'olahraga',
    imageUrls: [
      productPhoto('photo-1534438327276-14e5300c3a48'),
      productPhoto('photo-1544367567-0f2fcb009e0b'),
      productPhoto('photo-1601925260368-ae2f83cf8b7f')
    ]
  },
  {
    name: 'Kopi Arabika Premium 250g',
    slug: 'kopi-arabika-premium',
    description: 'Biji kopi arabika single origin roasted medium, aroma floral dan rasa seimbang.',
    price: 5_500_000,
    comparePrice: 7_500_000,
    stock: 100,
    sku: 'KAP-021',
    isFeatured: true,
    categorySlug: 'makanan-minuman',
    imageUrls: [
      productPhoto('photo-1495474472287-4d71bcdd2085'),
      productPhoto('photo-1447933601403-0c6688de566e'),
      productPhoto('photo-1556679343-c7306c1976bc')
    ]
  },
  {
    name: 'Teh Hijau Organik',
    slug: 'teh-hijau-organik',
    description: 'Teh hijau organik kemasan 20 sachet, tanpa pengawet, cocok dinikmati hangat atau dingin.',
    price: 3_900_000,
    stock: 110,
    sku: 'THO-022',
    categorySlug: 'makanan-minuman',
    imageUrls: [
      productPhoto('photo-1544787219-7f47ccb76574'),
      productPhoto('photo-1556679343-c7306c1976bc'),
      productPhoto('photo-1509440159596-0249088772ff')
    ]
  },
  {
    name: 'Snack Mix Almond',
    slug: 'snack-mix-almond',
    description: 'Campuran snack sehat almond, kacang mete, dan kismis, kemasan 500g.',
    price: 4_200_000,
    stock: 95,
    sku: 'SMA-023',
    categorySlug: 'makanan-minuman',
    imageUrls: [
      productPhoto('photo-1509440159596-0249088772ff'),
      productPhoto('photo-1495474472287-4d71bcdd2085'),
      productPhoto('photo-1447933601403-0c6688de566e')
    ]
  }
]

type CategorySeed = {
  name: string
  slug: string
  description: string
  sortOrder: number
}

const categories: CategorySeed[] = [
  {
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Produk elektronik dan gadget',
    sortOrder: 1
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Pakaian dan aksesoris',
    sortOrder: 2
  },
  {
    name: 'Rumah Tangga',
    slug: 'rumah-tangga',
    description: 'Kebutuhan rumah tangga',
    sortOrder: 3
  },
  {
    name: 'Kecantikan',
    slug: 'kecantikan',
    description: 'Skincare, makeup, dan perawatan tubuh',
    sortOrder: 4
  },
  {
    name: 'Olahraga',
    slug: 'olahraga',
    description: 'Perlengkapan olahraga dan fitness',
    sortOrder: 5
  },
  {
    name: 'Makanan & Minuman',
    slug: 'makanan-minuman',
    description: 'Makanan, minuman, dan camilan sehat',
    sortOrder: 6
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
  },
  {
    productSlug: 'speaker-portabel-bluetooth',
    customerEmail: 'budi@example.com',
    rating: 5,
    comment: 'Bass-nya mantap, baterai awet buat piknik.'
  },
  {
    productSlug: 'speaker-portabel-bluetooth',
    customerEmail: 'andi@example.com',
    rating: 4,
    comment: 'Suara jernih, ukuran pas di tas.'
  },
  {
    productSlug: 'jaket-bomber-pria',
    customerEmail: 'siti@example.com',
    rating: 5,
    comment: 'Jahitan rapi, bahan tidak panas dipakai siang.'
  },
  {
    productSlug: 'serum-wajah-glow',
    customerEmail: 'dewi@example.com',
    rating: 5,
    comment: 'Kulit terasa lebih cerah setelah 2 minggu pakai.'
  },
  {
    productSlug: 'sepatu-running-pro',
    customerEmail: 'budi@example.com',
    rating: 4,
    comment: 'Empuk dan ringan, cocok untuk lari pagi.'
  },
  {
    productSlug: 'kopi-arabika-premium',
    customerEmail: 'andi@example.com',
    rating: 5,
    comment: 'Aromanya khas, cocok untuk manual brew.'
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

  const categoryRecords = await Promise.all(
    categories.map(category =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: true
        },
        create: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder
        }
      })
    )
  )

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
  console.log(`Kategori: ${categories.length}`)
  console.log(`Produk dummy: ${products.length} (gambar produk via Unsplash)`)
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
