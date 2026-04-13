/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../prisma/prisma";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import crypto from "crypto";

const prismaClient = prisma as any;

const FORMULARIOS_TODOS = [
    "DASHBOARD",
    "FUNCIONARIOS",
    "PATRIMONIO",
    "CENTRO_CUSTO",
    "MEDICAO_CCUSTO",
    "FUNCOES",
    "LICENCAS_SOFTWARE",
    "ALOCACOES",
    "ACESSO_USUARIOS",
    "IMPORTACAO_EXPORTACAO"
];

function hashSenha(senha: string) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(senha, salt, 64);
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifySenha(senha: string, hash: string) {
    const [saltHex, storedHex] = hash.split(":");
    if (!saltHex || !storedHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const stored = Buffer.from(storedHex, "hex");
    const computed = crypto.scryptSync(senha, salt, stored.length);
    return crypto.timingSafeEqual(stored, computed);
}

function normalizeArray(value: any) {
    return Array.isArray(value) ? value : [];
}

async function ensureAdminFromEnv() {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    if (!adminEmail || !adminPassword) return;

    const existing = await prismaClient.tbUser.findFirst({
        where: { emailUser: adminEmail, authTypeUser: "LOCAL" }
    });
    if (existing) return;

    await prismaClient.tbUser.create({
        data: {
            nomeUser: "ADMIN",
            emailUser: adminEmail,
            authTypeUser: "LOCAL",
            senhaUser: hashSenha(adminPassword),
            formulariosUser: FORMULARIOS_TODOS,
            centrosUser: ["*"],
            statusUser: "ATIVO"
        }
    });
}

async function ensureBootstrapGoogle(email: string, name?: string | null) {
    const total = await prismaClient.tbUser.count({
        where: { authTypeUser: { in: ["LOCAL", "GOOGLE"] } }
    });
    if (total > 0) return;

    await prismaClient.tbUser.create({
        data: {
            nomeUser: (name || email.split("@")[0] || "ADMIN").toUpperCase(),
            emailUser: email,
            authTypeUser: "GOOGLE",
            senhaUser: null,
            formulariosUser: FORMULARIOS_TODOS,
            centrosUser: ["*"],
            statusUser: "ATIVO"
        }
    });
}

export const AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Login Local",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                await ensureAdminFromEnv();

                const email = String(credentials?.email || "").trim().toLowerCase();
                const senha = String(credentials?.password || "");
                if (!email || !senha) return null;

                const acesso = await prismaClient.tbUser.findFirst({
                    where: {
                        emailUser: email,
                        authTypeUser: "LOCAL"
                    }
                });
                if (!acesso || acesso.statusUser !== "ATIVO" || !acesso.senhaUser) return null;

                if (!verifySenha(senha, acesso.senhaUser)) return null;

                return {
                    id: acesso.id,
                    name: acesso.nomeUser,
                    email: acesso.emailUser,
                    authType: "LOCAL",
                    formularios: normalizeArray(acesso.formulariosUser),
                    centros: normalizeArray(acesso.centrosUser),
                    status: acesso.statusUser
                } as any;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async signIn({ user, account }: { user: any; account: any }) {
            await ensureAdminFromEnv();

            if (account?.provider === "google") {
                const email = String(user?.email || "").trim().toLowerCase();
                if (!email) return false;

                await ensureBootstrapGoogle(email, user?.name);

                const acesso = await prismaClient.tbUser.findFirst({
                    where: {
                        emailUser: email,
                        authTypeUser: "GOOGLE"
                    }
                });
                if (!acesso || acesso.statusUser !== "ATIVO") return false;
            }
            return true;
        },
        async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
            if (account?.provider) {
                token.authType = account.provider === "credentials" ? "LOCAL" : "GOOGLE";
            }

            if (user?.email) {
                token.name = user.name || token.name;
                token.email = user.email || token.email;
            }

            if (user?.formularios) {
                token.formularios = user.formularios;
                token.centros = user.centros || [];
                token.status = user.status || "ATIVO";
            } else if (token?.email) {
                const acesso = await prismaClient.tbUser.findFirst({
                    where: {
                        emailUser: token.email,
                        authTypeUser: token.authType || "GOOGLE"
                    }
                });
                if (acesso) {
                    token.name = acesso.nomeUser || token.name;
                    token.formularios = normalizeArray(acesso.formulariosUser);
                    token.centros = normalizeArray(acesso.centrosUser);
                    token.status = acesso.statusUser;
                }
            }

            return token;
        },
        async session({ token, session }: { token: any; session: any }) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.authType = token.authType;
                session.user.formularios = token.formularios || [];
                session.user.centros = token.centros || [];
                session.user.status = token.status;
            }
            return session;
        }
    },
};

const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST };





