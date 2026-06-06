<script setup lang="ts">
useSeoMeta({
  title: 'Kebijakan Retur',
  description: 'Kebijakan pengembalian barang dan refund di BelanjaPedia.'
})
</script>

<template>
  <LayoutInfoPage
    title="Kebijakan Retur"
    description="Garansi retur 30 hari untuk kenyamanan belanjamu di BelanjaPedia."
  >
    <h2 class="text-xl font-bold text-neutral-900 mt-2 mb-3">
      Syarat Retur
    </h2>
    <ul class="list-disc pl-6 space-y-2">
      <li>Pengajuan retur maksimal <strong>30 hari</strong> sejak barang diterima</li>
      <li>Produk dalam kondisi lengkap, tidak rusak karena kesalahan pengguna</li>
      <li>Kemasan asli dan label produk masih ada (jika memungkinkan)</li>
      <li>Bukti pembelian (nomor pesanan) wajib disertakan</li>
    </ul>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">
      Produk yang Tidak Dapat Diretur
    </h2>
    <ul class="list-disc pl-6 space-y-2">
      <li>Produk digital atau voucher yang sudah digunakan</li>
      <li>Produk personal care yang segel sudah dibuka</li>
      <li>Produk custom/pesanan khusus</li>
    </ul>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">
      Proses Retur
    </h2>
    <ol class="list-decimal pl-6 space-y-2">
      <li>Buka detail pesanan di akun BelanjaPedia</li>
      <li>Pilih "Ajukan Retur" dan isi alasan</li>
      <li>Tunggu konfirmasi tim kami (1–2 hari kerja)</li>
      <li>Kirim produk ke alamat yang diberikan</li>
      <li>Refund diproses setelah produk kami terima dan verifikasi</li>
    </ol>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">
      Refund
    </h2>
    <p>
      Dana dikembalikan ke metode pembayaran asal dalam 3–14 hari kerja setelah retur disetujui,
      tergantung kebijakan bank atau penyedia e-wallet.
    </p>
  </LayoutInfoPage>
</template>
