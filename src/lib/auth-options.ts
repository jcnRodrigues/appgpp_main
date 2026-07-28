import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../prisma/prisma";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";
import { buildAdminPermissions, normalizePermissions } from "@/lib/permissions";
import { getConfiguredAppPublicUrl } from "@/lib/app-url";
import { registrarLogAcesso } from "@/features/system-logs/server/access-logs.service";

const prismaClient = prisma as any;

function resolveNextAuthUrl() {
    return getConfiguredAppPublicUrl();
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

const FORMULARIOS_TODOS = buildAdminPermissions();

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

function resolveMachineName() {
    return (
        process.env.COMPUTERNAME?.trim() ||
        process.env.HOSTNAME?.trim() ||
        os.hostname().trim() ||
        null
    );
}

function extractClientIp(req: any) {
    const forwarded = req?.headers?.["x-forwarded-for"] || req?.headers?.["X-Forwarded-For"];
    if (typeof forwarded === "string" && forwarded.trim()) {
        return forwarded.split(",")[0].trim();
    }

    const realIp = req?.headers?.["x-real-ip"] || req?.headers?.["X-Real-IP"];
    if (typeof realIp === "string" && realIp.trim()) {
        return realIp.trim();
    }

    const socketIp = req?.socket?.remoteAddress;
    if (typeof socketIp === "string" && socketIp.trim()) {
        return socketIp.trim();
    }

  return null;
}

function extractBrowserInfo(req: any) {
    const userAgent = req?.headers?.["user-agent"] || req?.headers?.["User-Agent"];
    if (typeof userAgent === "string" && userAgent.trim()) {
        return userAgent.trim();
    }
    return null;
}

function resolveAccessOrigin() {
    return getConfiguredAppPublicUrl() || process.env.NEXTAUTH_URL || null;
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
        }),
        CredentialsProvider({
            name: "Login Local",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials, req) {
                await ensureAdminFromEnv();

                const email = String(credentials?.email || "").trim().toLowerCase();
                const senha = String(credentials?.password || "");
                const machine = resolveMachineName();
                const ip = extractClientIp(req);
                const browser = extractBrowserInfo(req);
                const origin = resolveAccessOrigin();

                if (!email || !senha) {
                    await registrarLogAcesso({
                        action: 'SIGN_IN',
                        provider: 'CREDENTIALS',
                        email: email || null,
                        name: null,
                        machine,
                        ip,
                        browser,
                        origin,
                        status: 'FAILED',
                        details: 'Credenciais incompletas'
                    });
                    return null;
                }

                const acesso = await prismaClient.tbUser.findFirst({
                    where: {
                        emailUser: email,
                        authTypeUser: "LOCAL"
                    }
                });
                if (!acesso || acesso.statusUser !== "ATIVO" || !acesso.senhaUser) {
                    await registrarLogAcesso({
                        action: 'SIGN_IN',
                        provider: 'CREDENTIALS',
                        email,
                        name: acesso?.nomeUser || null,
                        machine,
                        ip,
                        browser,
                        origin,
                        status: 'FAILED',
                        details: 'Acesso local nao encontrado ou inativo'
                    });
                    return null;
                }

                if (!verifySenha(senha, acesso.senhaUser)) {
                    await registrarLogAcesso({
                        action: 'SIGN_IN',
                        provider: 'CREDENTIALS',
                        email,
                        name: acesso.nomeUser || null,
                        machine,
                        ip,
                        browser,
                        origin,
                        status: 'FAILED',
                        details: 'Senha invalida'
                    });
                    return null;
                }

                await registrarLogAcesso({
                    action: 'SIGN_IN',
                    provider: 'CREDENTIALS',
                    email,
                    name: acesso.nomeUser || null,
                    machine,
                    ip,
                    browser,
                    origin,
                    status: 'SUCCESS',
                    details: 'Login local autorizado'
                });

                return {
                    id: acesso.id,
                    name: acesso.nomeUser,
                    email: acesso.emailUser,
                    authType: "LOCAL",
                    formularios: normalizePermissions(acesso.formulariosUser),
                    centros: normalizePermissions(acesso.centrosUser),
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
        async signIn(message: any) {
            const { user, account } = message || {};
            await ensureAdminFromEnv();

            if (account?.provider === "google") {
                const machine = resolveMachineName();
                const browser = extractBrowserInfo(message?.req);
                const origin = resolveAccessOrigin();
                const email = String(user?.email || "").trim().toLowerCase();
                if (!email) {
                    await registrarLogAcesso({
                        action: 'SIGN_IN',
                        provider: 'GOOGLE',
                        email: null,
                        name: user?.name || null,
                        machine,
                        ip: null,
                        browser,
                        origin,
                        status: 'FAILED',
                        details: 'Email do Google nao informado'
                    });
                    return false;
                }

                await ensureBootstrapGoogle(email, user?.name);

                const acesso = await findUserForGoogleLogin(email);
                if (!acesso || acesso.statusUser !== "ATIVO") {
                    await registrarLogAcesso({
                        action: 'SIGN_IN',
                        provider: 'GOOGLE',
                        email,
                        name: user?.name || null,
                        machine,
                        ip: null,
                        browser,
                        origin,
                        status: 'FAILED',
                        details: 'Usuario Google nao encontrado ou inativo'
                    });
                    return false;
                }

                await registrarLogAcesso({
                    action: 'SIGN_IN',
                    provider: 'GOOGLE',
                    email,
                    name: acesso.nomeUser || user?.name || null,
                    machine,
                    ip: null,
                    browser,
                    origin,
                    status: 'SUCCESS',
                    details: 'Login Google autorizado'
                });
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
                    token.formularios = normalizePermissions(acesso.formulariosUser);
                    token.centros = normalizePermissions(acesso.centrosUser);
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
    events: {
        async signOut(message: any) {
            try {
                const provider = String(message?.token?.authType || message?.token?.provider || 'unknown').toUpperCase();
                const email = String(message?.token?.email || message?.session?.user?.email || '').trim().toLowerCase() || null;
                const name = String(message?.token?.name || message?.session?.user?.name || '').trim() || null;
                const browser = extractBrowserInfo(message?.req);
                const origin = resolveAccessOrigin();

                await registrarLogAcesso({
                    action: 'SIGN_OUT',
                    provider,
                    email,
                    name,
                    machine: resolveMachineName(),
                    ip: extractClientIp(message?.req),
                    browser,
                    origin,
                    status: 'SUCCESS',
                    details: 'User signed out'
                });
            } catch {
                // Nao interrompe a saida se o log falhar.
            }
        }
    }
};
