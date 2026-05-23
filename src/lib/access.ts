import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasActionPermission, hasModuleAccess, normalizePermissions, type ActionPermission } from "@/lib/permissions";

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

    const formularios = normalizePermissions((token as any).formularios);

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

export async function hasDeleteAnyPermission(req: NextRequest) {
    const { formularios, authenticated } = await getAccessContext(req);
    return authenticated && formularios.includes('DELETE_ANY');
}

export async function hasActionPermissionForRequest(req: NextRequest, action: ActionPermission) {
    const { formularios, authenticated } = await getAccessContext(req);
    return authenticated && hasActionPermission(formularios, action);
}

export async function hasModuleAccessForRequest(req: NextRequest, moduleId: string) {
    const { formularios, authenticated } = await getAccessContext(req);
    return authenticated && hasModuleAccess(formularios, moduleId);
}
