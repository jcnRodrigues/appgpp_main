import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/route";
import { hasModuleAccess, hasModuleActionPermission } from "@/lib/permissions";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";

type SessionUser = {
  formularios?: string[];
};

const BACKUPS_DIR = path.join(process.cwd(), "backups");

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(AuthOptions);
    const sessionUser = (session?.user ?? undefined) as SessionUser | undefined;
    const forms = sessionUser?.formularios || [];

    if (!session?.user) {
      return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }
    if (
      (!hasModuleAccess(forms, "IMPORTACAO_EXPORTACAO") || !hasModuleActionPermission(forms, "IMPORTACAO_EXPORTACAO", "EXPORT")) &&
      !hasModuleAccess(forms, "ACESSO_USUARIOS")
    ) {
      return NextResponse.json({ message: "Usuário sem permissão para abrir pasta." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const folderName = String(body?.folderName || "").trim();
    if (!folderName || !folderName.startsWith("backup_DB_")) {
      return NextResponse.json({ message: "Nome de pasta invalido." }, { status: 400 });
    }

    const folderPath = path.join(BACKUPS_DIR, folderName);
    await fs.access(folderPath);

    execSync(`explorer "${folderPath.replace(/"/g, '""')}"`, { stdio: "ignore" });

    return NextResponse.json({
      message: "Pasta aberta com sucesso.",
      folderPath
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Erro ao abrir pasta." }, { status: 500 });
  }
}


