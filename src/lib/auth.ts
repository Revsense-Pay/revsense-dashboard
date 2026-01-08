import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email) return null;

        const account = await prisma.account.findUnique({
          where: { email: credentials.email },
        });

        if (!account) return null;

        return {
          id: account.id,
          email: account.email,
          accountId: account.id,
          role: account.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).accountId = (user as any).accountId;
        (token as any).role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      (session.user as any).accountId = (token as any).accountId;
      (session.user as any).role = (token as any).role;
      return session;
    },
  },
};