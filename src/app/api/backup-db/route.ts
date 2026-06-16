import prisma from "../../../../prisma/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/route";
import { hasModuleAccess, hasModuleActionPermission } from "@/lib/permissions";
import fs from "node:fs/promises";
import path from "node:path";

type SessionUser = {
  formularios?: string[];
};

function timestampLabel(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

export async function POST() {
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
      return NextResponse.json({ message: "Usuário sem permissão para backup do banco." }, { status: 403 });
    }

    const now = new Date();
    const folderName = `backup_DB_${timestampLabel(now)}`;
    const folderPath = path.join(process.cwd(), folderName);
    const tablesDir = path.join(folderPath, "tables");
    await fs.mkdir(tablesDir, { recursive: true });

    const data = {
      tbUser: await prisma.tbUser.findMany(),
      tbStatusFun: await prisma.tbStatusFun.findMany(),
      tbFuncao: await prisma.tbFuncao.findMany(),
      tbTipoPat: await prisma.tbTipoPat.findMany(),
      tbStatusPat: await prisma.tbStatusPat.findMany(),
      tbEmpresa: await prisma.tbEmpresa.findMany(),
      tbCCusto: await prisma.tbCCusto.findMany(),
      tbLicenca: await prisma.tbLicenca.findMany(),
      tbFuncionario: await prisma.tbFuncionario.findMany(),
      tbPatrimonio: await prisma.tbPatrimonio.findMany(),
      tbHasLicencaFuncionario: await prisma.tbHasLicencaFuncionario.findMany(),
      tbCadastro: await prisma.tbCadastro.findMany(),
      tbBmMedicao: await prisma.tbBmMedicao.findMany(),
      tbTransferenciaCustoPatrimonio: await prisma.tbTransferenciaCustoPatrimonio.findMany(),
      tbTransferenciaAlocacao: await prisma.tbTransferenciaAlocacao.findMany(),
      tbDevolucao: await prisma.tbDevolucao.findMany(),
      tbAuditoriaDevolucaoPatrimonio: await prisma.tbAuditoriaDevolucaoPatrimonio.findMany(),
      tbPatrimonioHistorico: await prisma.tbPatrimonioHistorico.findMany(),
      Account: await prisma.account.findMany(),
      Session: await prisma.session.findMany(),
      User: await prisma.user.findMany(),
      VerificationToken: await prisma.verificationToken.findMany(),
      tbUnifiConfig: await prisma.tbUnifiConfig.findMany()
    };

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
      counts
    });
  } catch (error: any) {
    console.error("Erro ao gerar backup do banco:", error);
    return NextResponse.json({ message: error?.message || "Erro ao gerar backup do banco." }, { status: 500 });
  }
}


