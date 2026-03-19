import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type AccessContext = {
    centros: string[];
    formularios: string[];
    allowAll: boolean;
    authenticated: boolean;
};

export async function getAccessContext(req: NextRequest): Promise<AccessContext> {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return {
            centros: [],
            formularios: [],
            allowAll: false,
            authenticated: false
        };
    }

    const centros = Array.isArray((token as any).centros)
        ? ((token as any).centros as string[])
        : [];

    const formularios = Array.isArray((token as any).formularios)
        ? ((token as any).formularios as string[])
        : [];

    return {
        centros,
        formularios,
        allowAll: centros.includes("*"),
        authenticated: true
    };
}

export async function getCentrosFiltro(req: NextRequest) {
    const { centros, allowAll, authenticated } = await getAccessContext(req);
    return { centros, allowAll, authenticated };
}
