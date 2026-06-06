export function apiSuccess<T>(data: T, message = 'Berhasil') {
  return {
    success: true,
    message,
    data
  }
}

export function apiError(message: string, errors: Record<string, string> = {}) {
  return {
    success: false,
    message,
    errors
  }
}
