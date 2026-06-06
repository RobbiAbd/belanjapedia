declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    email: string
    phone: string | null
    coins: number
    role: 'CUSTOMER' | 'ADMIN' | 'STAFF'
  }
}

export {}
