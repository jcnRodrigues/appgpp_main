import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/route";
import { hasModuleActionPermission } from "@/lib/permissions";
import { BACKUP_TABLES, generateMysqlBackupSql, generateSchemaSql } from "@/lib/backup-sql";
import fs from "node:fs/promises";
import path from "node:path";

type SessionUser = {
  formularios?: string[];
};

const BACKUPS_DIR = path.join(process.cwd(), "backups");

function timestampLabel(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

async function canExportBackup() {
  const session = await getServerSession(AuthOptions);
  const sessionUser = (session?.user ?? undefined) as SessionUser | undefined;
  const forms = sessionUser?.formularios || [];

  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 }) };
  }

  if (!hasModuleActionPermission(forms, "BACKUP_DB", "EXPORT")) {
    return { ok: false as const, response: NextResponse.json({ message: "Usuário sem permissão para backup do banco." }, { status: 403 }) };
  }

  return { ok: true as const };
}

function validateFolderName(folderName: string) {
  const cleaned = String(folderName || "").trim();
  if (!cleaned || !cleaned.startsWith("backup_DB_")) {
    return null;
  }
  return cleaned;
}

async function collectBackupData() {
  const entries = await Promise.all(
    BACKUP_TABLES.map(async (def) => {
      const clientKey = def.key.charAt(0).toLowerCase() + def.key.slice(1);
      const model = (prisma as any)[def.key] ?? (prisma as any)[clientKey];
      const rows = model ? await model.findMany() : [];
      return [def.key, rows] as const;
    })
  );

  return Object.fromEntries(entries);
}

export async function GET(request: Request) {
  try {
    const access = await canExportBackup();
    if (!access.ok) {
      return access.response;
    }

    const url = new URL(request.url);
    const folderName = validateFolderName(url.searchParams.get("folderName") || "");
    if (!folderName) {
      return NextResponse.json({ message: "Nome de pasta invalido." }, { status: 400 });
    }

    const folderPath = path.join(BACKUPS_DIR, folderName);
    const sqlPath = path.join(folderPath, "backup-completo.sql");
    await fs.access(sqlPath);

    const content = await fs.readFile(sqlPath, "utf8");
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/sql; charset=utf-8",
        "Content-Disposition": `attachment; filename="${folderName}-backup-completo.sql"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Erro ao baixar SQL do backup." }, { status: 500 });
  }
}

export async function POST() {
  try {
    const access = await canExportBackup();
    if (!access.ok) {
      return access.response;
    }

    const now = new Date();
    const folderName = `backup_DB_${timestampLabel(now)}`;
    const folderPath = path.join(BACKUPS_DIR, folderName);
    const tablesDir = path.join(folderPath, "tables");
    await fs.mkdir(tablesDir, { recursive: true });

    const data = await collectBackupData();

    const counts = Object.fromEntries(Object.entries(data).map(([table, rows]) => [table, Array.isArray(rows) ? rows.length : 0]));

    const backupPayload = {
      version: 1,
      generatedAt: now.toISOString(),
      source: "APPGPP",
      totalTables: Object.keys(data).length,
      totalRows: Object.values(counts).reduce((acc, val) => acc + Number(val || 0), 0),
      counts,
      data
    };

    await fs.writeFile(path.join(folderPath, "backup-completo.json"), JSON.stringify(backupPayload, null, 2), "utf8");
    const schemaSql = generateSchemaSql();
    const mysqlSql = generateMysqlBackupSql(data, now, schemaSql);
    const sqlFilePath = path.join(folderPath, "backup-completo.sql");
    await fs.writeFile(sqlFilePath, mysqlSql, "utf8");
    await fs.writeFile(path.join(folderPath, "resumo.json"), JSON.stringify({
      generatedAt: now.toISOString(),
      counts
    }, null, 2), "utf8");

    for (const [tableName, rows] of Object.entries(data)) {
      await fs.writeFile(path.join(tablesDir, `${tableName}.json`), JSON.stringify(rows, null, 2), "utf8");
    }

    return NextResponse.json({
      message: "Backup do banco concluido com sucesso.",
      folderName,
      folderPath,
      sqlFileName: "backup-completo.sql",
      sqlFilePath,
      counts
    });
  } catch (error: any) {
    console.error("Erro ao gerar backup do banco:", error);
    return NextResponse.json({ message: error?.message || "Erro ao gerar backup do banco." }, { status: 500 });
  }
}


