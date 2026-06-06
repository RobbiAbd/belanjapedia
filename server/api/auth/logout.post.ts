export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return apiSuccess(null, 'Logout berhasil')
})
