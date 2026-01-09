import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN')
  }

  return session.user
}