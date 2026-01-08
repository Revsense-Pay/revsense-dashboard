import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      accountId: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    accountId: string
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accountId?: string
    role?: string
  }
}

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const account = await prisma.account.findUnique({
          where: { email: credentials.email },
        })
        if (!account) return null
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
    jwt({ token, user }) {
      if (user) {
        token.accountId = (user as any).accountId
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.accountId = token.accountId as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}