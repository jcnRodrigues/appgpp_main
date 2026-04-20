/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../prisma/prisma";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const prismaClient = prisma as any;

function resolveNextAuthUrl() {
    const envUrl = process.env.NEXTAUTH_URL?.trim() || "";
    const netlifyUrl = process.env.URL?.trim() || "";
    const isLocalhost = /localhost|127\.0\.0\.1/i.test(envUrl);

    if (process.env.NODE_ENV === "production" && netlifyUrl && (!envUrl || isLocalhost)) {
        return netlifyUrl;
    }

    return envUrl;
}

type GoogleWebCredentials = {
    web?: {
        client_id?: string;
        client_secret?: string;
    };
};

function getGoogleCredentials() {
    const fromEnv = {
        clientId: process.env.GOOGLE_CLIENT_ID?.trim() || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || "",
    };

    try {
        const credentialPath = path.resolve(process.cwd(), "client_secret.json");
        if (!fs.existsSync(credentialPath)) return fromEnv;

        const raw = fs.readFileSync(credentialPath, "utf-8");
        const parsed = JSON.parse(raw) as GoogleWebCredentials;
        const clientId = parsed?.web?.client_id?.trim() || fromEnv.clientId;
        const clientSecret = parsed?.web?.client_secret?.trim() || fromEnv.clientSecret;

        return { clientId, clientSecret };
    } catch {
        return fromEnv;
    }
}

const googleCredentials = getGoogleCredentials();
const resolvedNextAuthUrl = resolveNextAuthUrl();
if (resolvedNextAuthUrl) {
    process.env.NEXTAUTH_URL = resolvedNextAuthUrl;
}

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
    "IMPORTACAO_EXPORTACAO",
    "UNIFI_CONFIG"
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

async function findUserForGoogleLogin(email: string) {
    const googleUser = await prismaClient.tbUser.findFirst({
        where: {
            emailUser: email,
            authTypeUser: "GOOGLE"
        }
    });
    if (googleUser) return googleUser;

    return prismaClient.tbUser.findFirst({
        where: {
            emailUser: email,
            authTypeUser: "LOCAL"
        }
    });
}

export const AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: googleCredentials.clientId,
            clientSecret: googleCredentials.clientSecret,
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

                const acesso = await findUserForGoogleLogin(email);
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
                let acesso = await prismaClient.tbUser.findFirst({
                    where: {
                        emailUser: token.email,
                        authTypeUser: token.authType || "GOOGLE"
                    }
                });
                if (!acesso && token.authType === "GOOGLE") {
                    acesso = await prismaClient.tbUser.findFirst({
                        where: {
                            emailUser: token.email,
                            authTypeUser: "LOCAL"
                        }
                    });
                }
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





