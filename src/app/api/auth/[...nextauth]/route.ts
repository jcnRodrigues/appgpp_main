/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../prisma/prisma";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";




export const AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async session({ token, session }: { token: any; session: any }) {
            if (token && session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
};

const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST };