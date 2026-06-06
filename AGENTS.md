# AGENTS.md

> Panduan konteks proyek untuk AI assistant di Cursor.
> File ini dibaca otomatis sebagai instruksi proyek.

---

## Ringkasan Proyek

| Item | Keterangan |
|------|------------|
| **Nama Proyek** | BelanjaPedia |
| **Deskripsi** | Website ecommerce untuk jual beli produk online — katalog produk, keranjang, checkout, manajemen pesanan, dan panel admin. |
| **Target Pengguna** | Pelanggan (pembeli), Admin, Staff toko |
| **Status** | Development |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Nuxt 3 (Vue 3, Composition API) |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS + Nuxt UI |
| **Backend/API** | Nitro (server routes bawaan Nuxt) |
| **Database** | MySQL (via WAMP) |
| **ORM** | Prisma |
| **Validasi** | Zod |
| **Package Manager** | npm |
| **Runtime** | Node.js 20+ |

---

## Struktur Proyek

```
belanjapedia/
├── assets/                 # CSS, gambar, font global
├── components/             # Komponen Vue reusable
│   ├── cart/               # Komponen keranjang
│   ├── product/            # Kartu produk, galeri, filter
│   ├── checkout/           # Form checkout, ringkasan pesanan
│   └── ui/                 # Komponen UI kecil (opsional)
├── composables/            # Logic reusable (useCart, useProduct, dll.)
├── layouts/                # Layout halaman (default, auth, admin)
├── middleware/             # Route guard (auth, admin, guest)
├── pages/                  # Routing otomatis berbasis file
│   ├── index.vue           # Homepage
│   ├── login.vue
│   ├── register.vue
│   ├── products/
│   │   ├── index.vue       # Katalog produk
│   │   └── [slug].vue      # Detail produk
│   ├── cart.vue
│   ├── checkout.vue
│   ├── orders/
│   │   ├── index.vue       # Riwayat pesanan pelanggan
│   │   └── [id].vue        # Detail pesanan
│   └── admin/
│       ├── index.vue       # Dashboard admin
│       ├── products/
│       ├── orders/
│       └── categories/
├── plugins/                # Plugin Nuxt (client/server)
├── prisma/
│   └── schema.prisma       # Skema database
├── public/                 # File statis (favicon, logo, uploads)
├── server/
│   ├── api/                # REST API (Nitro handlers)
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── payments/
│   ├── middleware/         # Middleware server-side
│   └── utils/              # Helper server (db, auth, cart)
├── types/                  # TypeScript types/interfaces
├── checkpoint/             # Catatan pekerjaan harian (lihat aturan push GitHub)
├── .env                    # Environment variables (jangan commit)
├── nuxt.config.ts
├── app.vue
├── package.json
├── .cursor/
│   └── rules/
└── AGENTS.md
```

**Penjelasan folder penting:**

- `pages/` — Setiap file `.vue` otomatis menjadi route
- `server/api/` — Endpoint backend; file `[nama].get.ts` → `GET /api/[nama]`
- `composables/` — Logic yang bisa dipakai ulang di komponen (`useFetch`, state, dll.)
- `components/` — Komponen UI; Nuxt auto-import tanpa perlu import manual
- `prisma/` — Definisi model database dan migrasi
- `pages/admin/` — Panel admin; dilindungi middleware role admin

---

## Cara Menjalankan Proyek

```bash
# Install dependensi
npm install

# Setup environment
cp .env.example .env

# Generate Prisma client & migrasi database
npx prisma generate
npx prisma migrate dev

# (Opsional) Seed data awal (produk, kategori, admin)
npx prisma db seed

# Jalankan dev server
npm run dev

# Build production
npm run build
npm run preview
```

**URL lokal:** `http://localhost:3000`

---

## Konvensi Kode

### Umum

- Gunakan **TypeScript** untuk semua file baru (`.vue`, `.ts`)
- Gunakan **Composition API** dengan `<script setup lang="ts">`
- Gunakan bahasa **Indonesia** untuk label UI; **Inggris** untuk kode (variabel, fungsi, commit)
- Ikuti gaya penulisan yang sudah ada di file sekitarnya
- Minimalkan perubahan di luar scope permintaan
- Manfaatkan auto-import Nuxt; jangan import manual composable/komponen Nuxt bawaan

### Penamaan

| Tipe | Konvensi | Contoh |
|------|----------|--------|
| Komponen Vue | PascalCase | `ProductCard.vue`, `CartItem.vue` |
| Halaman | kebab-case | `pages/products/[slug].vue` |
| Composable | camelCase + prefix `use` | `useCart.ts`, `useProduct.ts` |
| Server API | kebab-case + method suffix | `index.get.ts`, `[id].delete.ts` |
| Variabel & fungsi | camelCase | `productName`, `addToCart()` |
| Type/Interface | PascalCase | `Product`, `CreateOrderInput` |
| Konstanta | UPPER_SNAKE_CASE | `MAX_CART_QUANTITY` |
| Database table | snake_case plural | `order_items`, `product_categories` |

### Format & Style

- Indentasi: 2 spasi
- Quote: single (`'`)
- Gunakan ESLint + Prettier bawaan proyek
- Akhiri file dengan newline

---

## Arsitektur & Pola

### Pola yang digunakan

- **File-based routing** — Route dari struktur `pages/`
- **Server API routes** — Backend di `server/api/` (Nitro)
- **Composables** — Business logic & data fetching di client
- **Prisma** — Akses database terpusat via `server/utils/db.ts`

### Alur request

```
Browser → pages/*.vue → composables/useXxx → $fetch('/api/...')
                                              ↓
                                    server/api/*.ts → Prisma → MySQL
```

### Alur checkout

```
Keranjang → Validasi stok → Buat Order (pending) → Pembayaran → Update status → Kurangi stok
```

### Aturan arsitektur

- **Pages** — Hanya orchestration UI; tidak ada query database langsung
- **Composables** — Data fetching, state keranjang, dan logic yang dipakai ulang
- **server/api/** — Validasi input, authorization, akses database, kalkulasi harga
- **server/utils/** — Helper bersama (koneksi DB, auth, format harga, response formatter)
- **components/** — Presentational; terima props, emit events
- Jangan panggil Prisma dari `pages/` atau `components/`
- Logika harga total, diskon, dan ongkir hanya di server (jangan percaya angka dari client)

---

## Database

| Item | Keterangan |
|------|------------|
| **Nama DB** | `belanjapedia` |
| **Engine** | InnoDB |
| **Charset** | utf8mb4 |

### Konvensi tabel

- Primary key: `id` (Int, auto increment) atau `cuid` untuk entitas sensitif
- Timestamp: `createdAt`, `updatedAt` (Prisma `@updatedAt`)
- Soft delete (jika perlu): `deletedAt`
- Foreign key: `[model]Id` (camelCase di Prisma, snake_case di MySQL)
- Harga disimpan dalam **sen/integer** (mis. Rp 50.000 → `5000000`) untuk hindari floating point

### Model utama

| Model | Fungsi |
|-------|--------|
| `User` | Data pengguna (pelanggan, admin, staff) |
| `Category` | Kategori produk (hierarki opsional) |
| `Product` | Data produk (nama, harga, stok, deskripsi, gambar) |
| `ProductImage` | Gambar produk — `url` bisa path lokal (`/uploads/...`) atau **link eksternal** (`https://...`) |
| `Cart` / `CartItem` | Keranjang belanja per pengguna |
| `Order` | Pesanan pelanggan |
| `OrderItem` | Item dalam pesanan (snapshot harga saat checkout) |
| `Address` | Alamat pengiriman pelanggan |
| `Payment` | Catatan pembayaran |
| `Review` | Ulasan produk dari pelanggan |

### Field penting `Product`

- `name`, `slug`, `description`, `price`, `comparePrice` (harga coret, opsional)
- `stock`, `sku`, `isActive`, `isFeatured`
- `categoryId`
- Relasi: `images`, `reviews`

### Field penting `Order`

- `orderNumber` — nomor unik pesanan (mis. `BP-20260606-0001`)
- `status` — enum: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`
- `subtotal`, `shippingCost`, `discount`, `total`
- `userId`, `shippingAddressId`
- Relasi: `items`, `payment`

---

## Autentikasi & Otorisasi

- Metode login: Session-based via `nuxt-auth-utils` atau JWT di httpOnly cookie
- Role pengguna:
  - **Customer** — Browse produk, keranjang, checkout, lihat pesanan sendiri, ulasan
  - **Admin** — CRUD produk, kategori, kelola pesanan, kelola pengguna
  - **Staff** — Kelola pesanan & stok (tanpa akses pengaturan sensitif)
- Middleware route: `middleware/auth.ts`, `middleware/admin.ts`, `middleware/guest.ts`
- Halaman publik: `/`, `/products`, `/products/[slug]`, `/login`, `/register`
- Halaman terproteksi pelanggan: `/cart`, `/checkout`, `/orders`
- Halaman terproteksi admin: `/admin/**`

---

## API / Endpoint

### Auth

| Method | Endpoint | Fungsi | Role |
|--------|----------|--------|------|
| POST | `/api/auth/register` | Registrasi pelanggan | Public |
| POST | `/api/auth/login` | Login pengguna | Public |
| POST | `/api/auth/logout` | Logout | Auth |
| GET | `/api/auth/me` | Profil pengguna saat ini | Auth |

### Produk & Kategori

| Method | Endpoint | Fungsi | Role |
|--------|----------|--------|------|
| GET | `/api/products` | Daftar produk (filter, paginated) | Public |
| GET | `/api/products/:slug` | Detail produk | Public |
| POST | `/api/products` | Tambah produk | Admin |
| PUT | `/api/products/:id` | Update produk | Admin |
| DELETE | `/api/products/:id` | Hapus produk (soft delete) | Admin |
| GET | `/api/categories` | Daftar kategori | Public |
| POST | `/api/categories` | Tambah kategori | Admin |

### Keranjang

| Method | Endpoint | Fungsi | Role |
|--------|----------|--------|------|
| GET | `/api/cart` | Isi keranjang pengguna | Auth |
| POST | `/api/cart/items` | Tambah item ke keranjang | Auth |
| PUT | `/api/cart/items/:id` | Update jumlah item | Auth |
| DELETE | `/api/cart/items/:id` | Hapus item dari keranjang | Auth |

### Pesanan & Pembayaran

| Method | Endpoint | Fungsi | Role |
|--------|----------|--------|------|
| POST | `/api/orders` | Buat pesanan dari keranjang | Auth |
| GET | `/api/orders` | Daftar pesanan (milik sendiri / semua untuk admin) | Auth |
| GET | `/api/orders/:id` | Detail pesanan | Auth |
| PUT | `/api/orders/:id/status` | Update status pesanan | Admin/Staff |
| POST | `/api/payments/:orderId` | Proses/konfirmasi pembayaran | Auth/Admin |

**Format response standar:**

```json
{
  "success": true,
  "message": "Produk berhasil diambil",
  "data": {}
}
```

**Format error:**

```json
{
  "success": false,
  "message": "Stok produk tidak mencukupi",
  "errors": {}
}
```

---

## UI/UX

### Brand & Aset Visual

| File | Penggunaan |
|------|------------|
| `public/images/belanjapedia_icon.png` | Favicon, avatar kecil, mobile |
| `public/images/belanjapedia_primary.png` | Logo vertikal (hero, splash) |
| `public/images/belanjapedia_secondary.png` | Logo horizontal (navbar, footer) |

**Palet warna resmi:**

| Token | Hex | Penggunaan |
|-------|-----|------------|
| Primary Orange | `#FF8A3D` | Tombol utama, promo bar, aksen, CTA |
| Secondary Orange Soft | `#FFB86B` | Hover state, badge, highlight, ilustrasi |
| Cream | `#FFF3E6` | Background halaman, card lembut, section alternatif |
| Dark Text | `#2D2D2D` | Heading, body text, tulisan "Pedia" di logo |

**Alasan pemilihan palet:**

- Sangat cocok dengan maskot kucing — warna oren langsung diasosiasikan dengan kucing lucu.
- Berbeda dari kompetitor: Tokopedia (hijau), Shopee (oranye tua), Lazada (ungu), Blibli (biru) — identitas BelanjaPedia tetap unik.
- Cocok untuk gamifikasi — warna hangat memberi kesan reward, coin, achievement, dan keseruan bermain.
- Mudah diingat — ikon tas belanja berbentuk kucing oren lebih menempel di ingatan pengguna.

**Konsep maskot & tipografi:**

- Kepala kucing menyatu dengan bentuk shopping bag.
- Telinga kucing di bagian atas tas.
- Mata besar dan ekspresif sebagai ciri khas.
- Warna dominan orange-cream.
- Tulisan "BelanjaPedia" memakai font rounded modern agar terasa friendly dan fun.

**Visi jangka panjang:**

Warna orange-kucing ini tetap profesional untuk marketplace besar, aplikasi mobile, merchandise, serta sistem coin/reward.

**Implementasi teknis:**

- Komponen logo: `AppLogo.vue` — prop `variant`: `horizontal` | `vertical` | `icon`
- Warna UI Nuxt: `primary` → custom `brand` (`#FF8A3D` di `brand-500`)
- Background default halaman: `bg-cream` atau `bg-brand-50` (`#FFF3E6`)
- Teks utama: `text-[#2D2D2D]` atau `text-gray-900` yang mendekati `#2D2D2D`
- Jangan pakai warna primary kompetitor (hijau Tokopedia, ungu Lazada, dll.) kecuali diminta

### Referensi UX Tokopedia

File `TOKOPEDIA.md` berisi scrape halaman Tokopedia sebagai acuan pola UI ecommerce Indonesia. Pola utama yang diadopsi:

| Pola | Implementasi di BelanjaPedia |
|------|---------------------------|
| Top bar promo | Banner "Gratis Ongkir..." di header |
| Navbar | Logo + search + Kategori + Keranjang + Masuk/Daftar |
| Katalog | Sidebar filter kategori + grid produk + sort |
| Detail produk | Breadcrumb, galeri, varian, stok, + Keranjang & Beli Langsung |
| Ulasan | Rating bintang + daftar review pembeli |
| Footer | Logo + hak cipta |

Jangan salin HTML/CSS Tokopedia mentah; gunakan `TOKOPEDIA.md` hanya sebagai referensi struktur & UX flow.

- **Framework UI:** Nuxt UI (komponen Tailwind siap pakai)
- **Bahasa UI:** Indonesia
- **Mata uang:** Rupiah (IDR), format `Rp 50.000`
- **Komponen reusable:** `ProductCard`, `ProductGallery`, `CartSummary`, `OrderStatusBadge`
- **Layout:**
  - `layouts/default.vue` — Toko (header, footer, navigasi kategori)
  - `layouts/auth.vue` — Login & register
  - `layouts/admin.vue` — Panel admin (sidebar)
- Ikuti layout dan warna yang sudah ada; jangan ubah desain tanpa diminta
- **Jangan pakai gradient** — gunakan warna solid dari palet brand (`bg-brand-500`, `bg-cream`, dll.)
- Gunakan `UButton`, `UCard`, `UInput`, `UModal`, `UPagination` dari Nuxt UI sebelum buat komponen custom
- Halaman produk wajib responsif (mobile-first)

---

## Testing

> **Wajib** — proyek multi-developer + AI. Setiap perubahan logic harus dilengkapi unit test agar tidak merusak fungsi yang sudah berjalan.

### Perintah

```bash
npm run test              # jalankan semua unit test (wajib sebelum selesai task)
npm run test:watch        # mode watch saat development
npm run test:coverage     # laporan coverage
npx vitest run tests/unit/cart.test.ts   # satu file
```

### Framework & lokasi

| Item | Keterangan |
|------|------------|
| Runner | **Vitest** |
| Unit test | `tests/unit/*.test.ts` |
| Config | `vitest.config.ts` |
| Aturan Cursor | `.cursor/rules/unit-testing.mdc` (always apply) |

### Aturan wajib tim & AI

1. **Sebelum menyelesaikan task** → jalankan `npm run test`, semua harus lulus
2. **Ubah logic bisnis** (harga, keranjang, pajak, diskon, response API) → update/tambah test
3. **Logic bisnis** taruh di `shared/utils/` (pure function), bukan di component/page
4. **Composable** tipis — wrap `useState` + panggil `shared/utils` yang sudah ditest
5. **Minimal coverage per perubahan**: 1 happy path + 1 edge case

### Modul yang sudah punya test

| Modul | File test |
|-------|-----------|
| Format harga & diskon | `tests/unit/price.test.ts` |
| Keranjang belanja | `tests/unit/cart.test.ts` |
| Kalkulasi order (ongkir, pajak) | `tests/unit/order.test.ts` |
| Response API standar | `tests/unit/response.test.ts` |
| Icon kategori | `tests/unit/categoryIcons.test.ts` |
| URL gambar produk | `tests/unit/productImage.test.ts` |

### E2E (opsional, belum disetup)

- **Playwright** — untuk flow checkout end-to-end

---

## Git & Workflow

### Branch

- `main` — production-ready
- `develop` — integrasi fitur
- `feature/nama-fitur` — fitur baru
- `fix/nama-bug` — perbaikan bug

### Commit message

Format: `[type]: deskripsi singkat`

| Type | Keterangan |
|------|------------|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `refactor` | Refactor tanpa ubah behavior |
| `docs` | Dokumentasi |
| `test` | Test |
| `chore` | Maintenance |

Contoh: `feat: tambah halaman katalog produk dengan filter kategori`

### Push ke GitHub → wajib buat checkpoint

Jika user memerintahkan **push ke GitHub** (mis. "push ke github", "push github"), lakukan **checkpoint dulu**, baru commit & push.

**Urutan wajib:**

1. **Buat atau perbarui checkpoint harian** di `checkpoint/YYYY-MM-DD.md` (tanggal hari ini)
   - Jika file hari itu sudah ada → **append/perbarui** bagian yang relevan, jangan buat file duplikat
   - Isi minimal: ringkasan, fitur/perbaikan selesai, file/modul penting, catatan teknis, tindak lanjut
2. **Perbarui daftar** di `checkpoint/README.md` (tabel tanggal → file)
3. **Commit** — sertakan checkpoint dalam commit yang sama dengan perubahan kode (jika ada)
4. **Push** ke remote (`origin/main` kecuali user minta branch lain)

**Catatan:**

- Checkpoint mencatat pekerjaan **sesi/hari itu**, bukan hanya commit message
- Jangan commit `.env` atau file sensitif
- Push hanya jika user explicitly meminta

---

## Hal yang BOLEH ✅

- Ikuti konvensi Nuxt 3 (auto-import, file-based routing, server routes)
- Reuse composables dan komponen yang sudah tersedia
- Gunakan `useFetch` / `$fetch` untuk data fetching
- Validasi input dengan Zod di server API
- Gunakan Prisma untuk semua query database
- Gunakan `<script setup lang="ts">` di semua komponen Vue
- Snapshot harga di `OrderItem` saat checkout (harga produk bisa berubah)
- Validasi stok di server sebelum tambah keranjang dan sebelum checkout
- Jalankan `npm run test` sebelum menyelesaikan perubahan logic
- Taruh logic bisnis di `shared/utils/` agar mudah ditest

## Hal yang JANGAN ❌

- Jangan commit file sensitif (`.env`, kredensial, API key payment gateway)
- Jangan hardcode password, token, atau secret
- Jangan akses database langsung dari `pages/` atau `components/`
- Jangan percaya harga/total dari client — selalu hitung ulang di server
- Jangan kurangi stok sebelum pembayaran dikonfirmasi (kecuali ada aturan bisnis lain)
- Jangan refactor besar tanpa diminta
- Jangan menambah dependency baru tanpa alasan jelas
- Jangan ubah skema Prisma tanpa konfirmasi
- Jangan push ke remote kecuali diminta
- Jangan gunakan Options API kecuali file legacy yang sudah ada
- Jangan ubah `shared/utils/`, composable, atau `server/api/` tanpa update test terkait
- Jangan selesaikan task jika `npm run test` gagal

---

## Environment & Konfigurasi

File konfigurasi penting:

| File | Fungsi |
|------|------------|
| `.env` | Variabel environment (jangan commit) |
| `nuxt.config.ts` | Konfigurasi Nuxt (modules, runtimeConfig) |
| `prisma/schema.prisma` | Skema & koneksi database |

Variabel environment penting:

```env
DATABASE_URL="mysql://root:@localhost:3306/belanjapedia"
NUXT_SESSION_PASSWORD="[random-string-min-32-chars]"
NUXT_PUBLIC_APP_NAME="BelanjaPedia"
NUXT_PUBLIC_APP_URL="http://localhost:3000"

# Payment gateway (isi saat integrasi)
# MIDTRANS_SERVER_KEY=""
# MIDTRANS_CLIENT_KEY=""
```

Akses di kode:

```ts
// Server-side
const config = useRuntimeConfig()
config.databaseUrl

// Client-side (hanya NUXT_PUBLIC_*)
const appName = useRuntimeConfig().public.appName
```

---

## Troubleshooting Umum

| Masalah | Solusi |
|---------|--------|
| Koneksi DB gagal | Cek `DATABASE_URL` di `.env` dan pastikan MySQL/WAMP berjalan |
| Prisma client error | Jalankan `npx prisma generate` |
| 404 pada API route | Pastikan file ada di `server/api/` dengan suffix method (`.get.ts`) |
| Auto-import tidak jalan | Restart dev server; cek `nuxt.config.ts` |
| Hydration mismatch | Pastikan data server & client konsisten; hindari `Date.now()` di template |
| Port 3000 sudah dipakai | Jalankan `npm run dev -- -p 3001` |
| Stok negatif | Pastikan transaksi Prisma (`$transaction`) dipakai saat checkout |
| Harga tidak konsisten | Pastikan format integer (sen) dan format tampilan terpisah di composable |

---

## Aturan Cursor Lanjutan (Opsional)

Untuk aturan spesifik per jenis file, buat file `.mdc` di `.cursor/rules/`:

```
.cursor/rules/
├── nuxt-vue.mdc            # Konvensi Vue/Nuxt components
├── server-api.mdc          # Aturan server routes & Prisma
├── prisma-database.mdc     # Aturan skema & migrasi
└── ecommerce-domain.mdc    # Aturan bisnis ecommerce (stok, harga, pesanan)
```

Contoh frontmatter:

```yaml
---
description: Standar penulisan komponen Vue dan composables Nuxt
globs: **/*.{vue,ts}
alwaysApply: false
---
```

---

## Referensi

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Nuxt UI Components](https://ui.nuxt.com/components)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

---

## Catatan Tambahan

### Aturan bisnis ecommerce

- Produk yang `isActive: false` tidak ditampilkan di katalog publik
- Stok tidak boleh negatif; tolak tambah ke keranjang jika `quantity > stock`
- Harga di `OrderItem` adalah snapshot saat checkout — tidak berubah meski harga produk diupdate
- Status pesanan mengikuti alur: `pending` → `paid` → `processing` → `shipped` → `delivered`
- Pesanan `cancelled` hanya boleh dari status `pending` atau `paid` (belum dikirim)
- Nomor pesanan (`orderNumber`) harus unik dan human-readable

### Fitur yang direncanakan

- Homepage: banner promo, produk unggulan, kategori populer
- Pencarian & filter produk (kategori, harga, rating)
- Keranjang persisten (database untuk user login, localStorage untuk guest — opsional)
- Checkout: alamat pengiriman, pilihan kurir, ringkasan pembayaran
- Integrasi payment gateway (Midtrans / Xendit)
- Panel admin: manajemen produk, pesanan, dan laporan penjualan
- Ulasan produk (hanya pelanggan yang sudah beli)
- Notifikasi email status pesanan (opsional)

### Fase pengembangan disarankan

1. **Fondasi** — Setup Nuxt, Prisma, auth, layout dasar
2. **Katalog** — CRUD produk & kategori, halaman listing & detail
3. **Keranjang & Checkout** — Cart API, validasi stok, buat order
4. **Admin** — Dashboard, kelola pesanan & produk
5. **Pembayaran** — Integrasi gateway, webhook konfirmasi bayar
6. **Polish** — Review, pencarian, optimasi UX & performa

---

*Terakhir diperbarui: 2026-06-06 — unit testing wajib & shared/utils*
