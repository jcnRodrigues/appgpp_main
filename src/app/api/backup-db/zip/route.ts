import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/route";
import { hasModuleAccess, hasModuleActionPermission } from "@/lib/permissions";
import path from "node:path";
import fs from "node:fs/promises";

type SessionUser = {
  formularios?: string[];
};

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
      return NextResponse.json({ message: "Usuário sem permissão para compactar backup." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const folderName = String(body?.folderName || "").trim();
    if (!folderName || !folderName.startsWith("backup_DB_")) {
      return NextResponse.json({ message: "Nome de pasta invalido." }, { status: 400 });
    }

    const cwd = process.cwd();
    const folderPath = path.join(cwd, folderName);
    await fs.access(folderPath);
    const zipPath = path.join(cwd, `${folderName}.zip`);

    // Use PowerShell Compress-Archive on Windows host.
    const { execSync } = await import("node:child_process");
    const escapedFolder = folderPath.replace(/'/g, "''");
    const escapedZip = zipPath.replace(/'/g, "''");
    execSync(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '${escapedFolder}\\*' -DestinationPath '${escapedZip}' -Force"`,
      { stdio: "pipe" }
    );

    return NextResponse.json({
      message: "Arquivo ZIP gerado com sucesso.",
      zipPath,
      zipName: `${folderName}.zip`
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Erro ao compactar backup." }, { status: 500 });
  }
}

