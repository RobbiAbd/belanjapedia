export default defineEventHandler(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return apiSuccess({ status: 'ok', database: 'connected' }, 'Server berjalan')
  } catch {
    return apiError('Koneksi database gagal')
  }
})
