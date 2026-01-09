import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const account = await prisma.account.findUnique({
          where: { email: credentials.email },
        })

        if (!account || !account.passwordHash) {
          return null
        }

        const valid = await bcrypt.compare(
          credentials.password,
          account.passwordHash
        )

        if (!valid) {
          return null
        }

        return {
          id: account.id,
          email: account.email,
          accountId: account.id,
          role: account.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accountId = (user as any).accountId
        token.role = (user as any).role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).accountId = token.accountId
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
}