import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const account = await prisma.account.findUnique({
          where: { email: credentials.email },
        });

        if (!account || !account.passwordHash) {
          return null;
        }

        const bcrypt = await import('bcryptjs');
        const valid = await bcrypt.compare(
          credentials.password,
          account.passwordHash
        );

        if (!valid) {
          return null;
        }

        return {
          id: account.id,
          email: account.email,
          role: account.role,
          accountId: account.id,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accountId = user.accountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.accountId = token.accountId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };