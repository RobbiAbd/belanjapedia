<script setup lang="ts">
useSeoMeta({
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi BelanjaPedia mengenai pengumpulan dan penggunaan data pribadi.'
})
</script>

<template>
  <LayoutInfoPage
    title="Kebijakan Privasi"
    description="Bagaimana BelanjaPedia mengumpulkan, menggunakan, dan melindungi data pribadimu."
  >
    <h2 class="text-xl font-bold text-neutral-900 mt-2 mb-3">
      Data yang Kami Kumpulkan
    </h2>
    <ul class="list-disc pl-6 space-y-2">
      <li>Informasi akun: nama, email, nomor telepon</li>
      <li>Data transaksi: riwayat pesanan, alamat pengiriman</li>
      <li>Data teknis: alamat IP, perangkat, dan log aktivitas untuk keamanan</li>
    </ul>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">
      Penggunaan Data
    </h2>
    <p>
      Data digunakan untuk memproses pesanan, meningkatkan layanan, mengirim notifikasi penting,
      dan mencegah penipuan. Kami tidak menjual data pribadamu kepada pihak ketiga.
    </p>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">
      Keamanan Data
    </h2>
    <p>
      Kami menerapkan enkripsi dan praktik keamanan standar industri untuk melindungi informasi pengguna.
    </p>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-3">
      Hak Pengguna
    </h2>
    <p>
      Kamu berhak mengakses, memperbarui, atau meminta penghapusan data pribadi dengan menghubungi
      <NuxtLink
        to="/hubungi-kami"
        class="text-brand-600 hover:underline"
      >
        tim support kami
      </NuxtLink>.
    </p>
  </LayoutInfoPage>
</template>
