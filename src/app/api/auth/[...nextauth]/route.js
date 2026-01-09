import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
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
          role: account.role,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };