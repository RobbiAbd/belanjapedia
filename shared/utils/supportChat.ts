export type SupportQuickReply = {
  id: string
  label: string
}

export const SUPPORT_QUICK_REPLIES: SupportQuickReply[] = [
  { id: 'order', label: 'Status pesanan' },
  { id: 'how-to', label: 'Cara belanja' },
  { id: 'shipping', label: 'Ongkir & pengiriman' },
  { id: 'coins', label: 'Tentang coin' },
  { id: 'agent', label: 'Hubungi CS' }
]

const QUICK_REPLY_MESSAGES: Record<string, string> = {
  order: 'Bagaimana cara cek status pesanan saya?',
  'how-to': 'Bagaimana cara belanja di BelanjaPedia?',
  shipping: 'Berapa ongkir dan estimasi pengiriman?',
  coins: 'Bagaimana cara pakai coin saat checkout?',
  agent: 'Saya ingin bicara dengan customer support'
}

export function getQuickReplyMessage(id: string): string {
  return QUICK_REPLY_MESSAGES[id] ?? ''
}

export function getSupportAutoReply(message: string): string {
  const text = message.trim().toLowerCase()

  if (!text) {
    return 'Silakan tulis pertanyaanmu, ya. Tim kami siap membantu.'
  }

  if (text.includes('pesanan') || text.includes('order') || text.includes('status')) {
    return 'Kamu bisa cek status pesanan di menu Pesanan Saya setelah login. Jika pesanan belum berubah lebih dari 24 jam, beri tahu kami nomor pesananmu.'
  }

  if (text.includes('ongkir') || text.includes('kirim') || text.includes('pengiriman')) {
    return 'BelanjaPedia menawarkan gratis ongkir untuk promo tertentu. Estimasi pengiriman 2–5 hari kerja tergantung lokasi. Detail ongkir ditampilkan saat checkout.'
  }

  if (text.includes('coin') || text.includes('reward') || text.includes('klaim')) {
    return 'Coin bisa diklaim lewat daily login (1 coin = Rp1) dan dipakai saat checkout untuk diskon. Cek saldo di halaman Akun atau Riwayat Coin.'
  }

  if (text.includes('bayar') || text.includes('pembayaran') || text.includes('transfer')) {
    return 'Kami mendukung transfer bank, e-wallet, dan COD. Instruksi pembayaran muncul setelah pesanan dibuat di halaman detail pesanan.'
  }

  if (text.includes('retur') || text.includes('refund') || text.includes('batal')) {
    return 'Kebijakan retur berlaku hingga 30 hari untuk produk tertentu. Baca detailnya di halaman Kebijakan Retur atau hubungi CS dengan nomor pesanan.'
  }

  if (text.includes('cs') || text.includes('admin') || text.includes('hubungi') || text.includes('manusia')) {
    return 'Tim CS kami online Senin–Minggu, 08.00–22.00 WIB. Email: support@belanjapedia.com · Telp: +62 812-3456-7890'
  }

  if (text.includes('belanja') || text.includes('cara')) {
    return 'Pilih produk → tambah ke keranjang → checkout (wajib login) → isi alamat & pembayaran → selesai. Panduan lengkap ada di halaman Cara Belanja.'
  }

  return 'Terima kasih sudah menghubungi BelanjaPedia. Tim kami akan membalas segera. Untuk bantuan lebih lanjut, kunjungi Pusat Bantuan atau Hubungi Kami.'
}
