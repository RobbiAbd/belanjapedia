# belanjapedia

Website ecommerce BelanjaPedia — katalog produk, keranjang, checkout, pesanan, wishlist, coin reward, alamat tersimpan, dan ulasan produk.

## Tech stack

- Nuxt 4 + TypeScript
- Nuxt UI + Tailwind CSS
- Prisma + MySQL
- Vitest

## Menjalankan proyek

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Akun demo (seed)

- Admin: `admin@belanjapedia.com` / `admin123`
- Customer: `budi@example.com` / `customer123`

## Demo publik dengan ngrok

Halaman peringatan ngrok (*"You are about to visit..."*) muncul di plan gratis. Ngrok menyebut dua cara untuk melewatinya:

1. Kirim header **`ngrok-skip-browser-warning`** (nilai bebas)
2. Kirim **User-Agent custom/non-standar**

### Yang sudah otomatis di proyek ini

Plugin `app/plugins/ngrok-headers.client.ts` menambahkan header ke **semua** request API browser (`$fetch` / `useFetch`):

```http
ngrok-skip-browser-warning: true
```

Aktif jika salah satu terpenuhi:

- `NUXT_PUBLIC_NGROK_DEMO=true` di `.env`
- `NUXT_PUBLIC_APP_URL` mengandung `ngrok`
- Hostname browser mengandung `ngrok` (auto-detect)

### Langkah demo (production build)

**Terminal 1 — build & jalankan server**

```bash
npx prisma generate
npm run build
```

Windows PowerShell:

```powershell
$env:NITRO_HOST="0.0.0.0"
$env:PORT="3000"
$env:NUXT_PUBLIC_NGROK_DEMO="true"
$env:NUXT_PUBLIC_APP_URL="https://YOUR-SUBDOMAIN.ngrok-free.app"
npm run preview
```

**Terminal 2 — tunnel ngrok**

```bash
ngrok http 3000
```

Salin URL HTTPS ngrok, lalu **restart** `npm run preview` dengan `NUXT_PUBLIC_APP_URL` yang sudah diisi URL tersebut.

Pastikan WAMP/MySQL tetap berjalan.

### Cara 1 — Header `ngrok-skip-browser-warning` (disarankan)

| Konteks | Cara |
|--------|------|
| API di dalam app (login, produk, game, dll.) | Otomatis via plugin |
| Kunjungan pertama lewat address bar | Browser **tidak bisa** menambah header custom → lihat opsi di bawah |
| Tes manual | `curl -H "ngrok-skip-browser-warning: true" https://YOUR.ngrok-free.app` |

**Agar pembuka demo tidak melihat halaman peringatan sama sekali**, pasang extension browser (contoh: *ModHeader*, *Requestly*) dan tambahkan header untuk semua request ke domain `*.ngrok-free.app`:

| Header | Value |
|--------|-------|
| `ngrok-skip-browser-warning` | `true` |

Setelah itu, buka URL ngrok seperti biasa — termasuk halaman pertama.

### Cara 2 — Custom User-Agent

Ngrok juga menerima User-Agent non-standar. **Di browser, JavaScript tidak boleh mengubah User-Agent** pada `fetch`, jadi opsi ini untuk alat di luar fetch biasa:

**curl**

```bash
curl -A "BelanjaPediaDemo/1.0" https://YOUR.ngrok-free.app
```

**Extension browser** — set User-Agent global, misalnya:

```text
BelanjaPediaDemo/1.0
```

**Postman / Insomnia** — tab Headers atau User-Agent.

### Batasan yang perlu diketahui

- **Kunjungan pertama tanpa extension**: pengguna mungkin masih harus klik *Visit Site* sekali; setelah itu navigasi SPA + API sudah memakai header dari plugin.
- **URL ngrok gratis berubah** setiap restart ngrok → update `NUXT_PUBLIC_APP_URL` dan restart preview.
- **Game iframe** (`/feline-frenzy.html`) dimuat sebagai navigasi iframe terpisah; jika peringatan muncul di dalam iframe, gunakan extension header (Cara 1) atau klik *Visit Site* sekali.
- Jangan commit file `.env` ke git.
