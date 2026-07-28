import { PrismaClient } from "@prisma/client";

declare global {
    // Reuse a single PrismaClient instance across hot reloads in development.
    var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export default prisma;
