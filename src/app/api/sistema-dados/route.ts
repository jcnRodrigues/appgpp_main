import prisma from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { AuthOptions } from "../auth/[...nextauth]/route";
import { getCentrosFiltro } from "@/lib/access";
import { hasModuleAccess, hasModuleActionPermission } from "@/lib/permissions";

type SessionUser = {
    formularios?: string[];
};

type BackupData = {
    tbUser: any[];
    tbStatusFun: any[];
    tbFuncao: any[];
    tbTipoPat: any[];
    tbStatusPat: any[];
    tbEmpresa: any[];
    tbCCusto: any[];
    tbLicenca: any[];
    tbFuncionario: any[];
    tbPatrimonio: any[];
    tbHasLicencaFuncionario: any[];
    tbCadastro: any[];
    tbBmMedicao: any[];
    tbTransferenciaCustoPatrimonio: any[];
    tbTransferenciaAlocacao: any[];
    tbDevolucao: any[];
    tbAuditoriaDevolucaoPatrimonio: any[];
    tbPatrimonioHistorico: any[];
    Account: any[];
    Session: any[];
    User: any[];
    VerificationToken: any[];
    tbUnifiConfig: any[];
};

type ImportTableName = keyof BackupData;

type IgnoredImportRow = {
    table: ImportTableName;
    row: number;
    motivo: string;
};

type ImportExecutionResult = {
    imported: Record<ImportTableName, number>;
    ignored: IgnoredImportRow[];
    detailed: Record<ImportTableName, { created: number; updated: number; ignored: number }>;
};

type ImportMode = "replace" | "merge";

function emptyDetailedCounts(): Record<ImportTableName, { created: number; updated: number; ignored: number }> {
    return {
        tbUser: { created: 0, updated: 0, ignored: 0 },
        tbStatusFun: { created: 0, updated: 0, ignored: 0 },
        tbFuncao: { created: 0, updated: 0, ignored: 0 },
        tbTipoPat: { created: 0, updated: 0, ignored: 0 },
        tbStatusPat: { created: 0, updated: 0, ignored: 0 },
        tbEmpresa: { created: 0, updated: 0, ignored: 0 },
        tbCCusto: { created: 0, updated: 0, ignored: 0 },
        tbLicenca: { created: 0, updated: 0, ignored: 0 },
        tbFuncionario: { created: 0, updated: 0, ignored: 0 },
        tbPatrimonio: { created: 0, updated: 0, ignored: 0 },
        tbHasLicencaFuncionario: { created: 0, updated: 0, ignored: 0 },
        tbCadastro: { created: 0, updated: 0, ignored: 0 },
        tbBmMedicao: { created: 0, updated: 0, ignored: 0 },
        tbTransferenciaCustoPatrimonio: { created: 0, updated: 0, ignored: 0 },
        tbTransferenciaAlocacao: { created: 0, updated: 0, ignored: 0 },
        tbDevolucao: { created: 0, updated: 0, ignored: 0 },
        tbAuditoriaDevolucaoPatrimonio: { created: 0, updated: 0, ignored: 0 },
        tbPatrimonioHistorico: { created: 0, updated: 0, ignored: 0 },
        Account: { created: 0, updated: 0, ignored: 0 },
        Session: { created: 0, updated: 0, ignored: 0 },
        User: { created: 0, updated: 0, ignored: 0 },
        VerificationToken: { created: 0, updated: 0, ignored: 0 },
        tbUnifiConfig: { created: 0, updated: 0, ignored: 0 }
    };
}

function withIgnoredCounts(ignored: IgnoredImportRow[], detailed: Record<ImportTableName, { created: number; updated: number; ignored: number }>) {
    for (const item of ignored) {
        detailed[item.table].ignored += 1;
    }
    return detailed;
}

function addIgnoredRow(
    ignored: IgnoredImportRow[],
    table: ImportTableName,
    row: number,
    motivo: string
) {
    ignored.push({ table, row, motivo });
}

function hasImportAccess(sessionUser?: SessionUser) {
    const formularios = sessionUser?.formularios;
    return (
        hasModuleActionPermission(formularios || [], "IMPORTACAO_EXPORTACAO", "IMPORT") ||
        hasModuleAccess(formularios || [], "ACESSO_USUARIOS")
    );
}

function hasExportAccess(sessionUser?: SessionUser) {
    const formularios = sessionUser?.formularios;
    return (
        hasModuleActionPermission(formularios || [], "IMPORTACAO_EXPORTACAO", "EXPORT") ||
        hasModuleAccess(formularios || [], "ACESSO_USUARIOS")
    );
}

async function validateCentroAccess(request: NextRequest, centroId?: string | null) {
    if (!centroId) return null;

    const { centros, allowAll } = await getCentrosFiltro(request);
    if (!allowAll && !centros.includes(centroId)) {
        throw new Error("Centro de custo nao permitido para este usuario.");
    }

    return centroId;
}

function toDateOrNull(value: unknown) {
    if (!value) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseJsonField(value: unknown) {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "object") return value;
    if (typeof value !== "string") return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function onlyStrings(values: Array<string | null | undefined>) {
    return values.filter((value): value is string => typeof value === "string" && value.length > 0);
}

function normalizeLookupValue(value: unknown) {
    return String(value ?? "").trim().toLowerCase();
}

function firstString(...values: unknown[]) {
    for (const value of values) {
        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }
    return null;
}

function buildSourceIndex(rows: any[], idField: string, searchableFields: string[]) {
    const index = new Map<string, string>();

    for (const row of rows || []) {
        const idValue = firstString(row?.[idField]);
        if (!idValue) continue;

        index.set(normalizeLookupValue(idValue), idValue);
        for (const field of searchableFields) {
            const candidate = firstString(row?.[field]);
            if (!candidate) continue;
            index.set(normalizeLookupValue(candidate), idValue);
        }
    }

    return index;
}

function resolveSourceId(row: any, directField: string, index: Map<string, string>, fallbackFields: string[] = []) {
    const directValue = firstString(row?.[directField]);
    if (directValue) {
        const indexedDirect = index.get(normalizeLookupValue(directValue));
        return indexedDirect ?? directValue;
    }

    for (const field of fallbackFields) {
        const fallbackValue = firstString(row?.[field]);
        if (!fallbackValue) continue;
        const fromIndex = index.get(normalizeLookupValue(fallbackValue));
        if (fromIndex) return fromIndex;
    }

    return null;
}

function mapResolvedId(
    targetMap: Map<string, string>,
    row: any,
    directField: string,
    sourceIndex: Map<string, string>,
    fallbackFields: string[] = []
) {
    const sourceId = resolveSourceId(row, directField, sourceIndex, fallbackFields);
    if (!sourceId) return null;
    return targetMap.get(sourceId) ?? null;
}

function enrichExportData(data: BackupData): BackupData {
    const statusFunById = new Map(data.tbStatusFun.map((row: any) => [row.idStatusFun, row.descricaoStatusFun ?? null]));
    const funçãoById = new Map(data.tbFuncao.map((row: any) => [row.idFuncao, row.nomeFuncao ?? null]));
    const tipoPatById = new Map(data.tbTipoPat.map((row: any) => [row.idTipPat, row.descricaoTipPat ?? null]));
    const statusPatById = new Map(data.tbStatusPat.map((row: any) => [row.idStatusPat, row.descricaoStatPat ?? null]));
    const empresaById = new Map(data.tbEmpresa.map((row: any) => [row.idEmp, firstString(row.fantasiaEmpresa, row.razaoEmpresa, row.cnpjEmpresa)]));
    const ccustoById = new Map(
        data.tbCCusto.map((row: any) => [row.idCCusto, firstString(row.descricaoCCusto, row.codigoCCusto)])
    );
    const licencaById = new Map(data.tbLicenca.map((row: any) => [row.idLic, row.descricaoLic ?? null]));
    const funcionarioById = new Map(data.tbFuncionario.map((row: any) => [row.idF, firstString(row.idMatFun, row.nomeFun)]));
    const funcionarioByMat = new Map(data.tbFuncionario.map((row: any) => [row.idMatFun, row.nomeFun ?? null]));
    const patrimonioByIdPat = new Map(data.tbPatrimonio.map((row: any) => [row.idPat, row.descricaoPat ?? null]));
    const userById = new Map(data.tbUser.map((row: any) => [row.id, firstString(row.emailUser, row.nomeUser, row.idUser)]));

    return {
        ...data,
        tbCCusto: data.tbCCusto.map((row: any) => ({
            ...row,
            idEmp_Custo_descricao: row.idEmp_Custo ? empresaById.get(row.idEmp_Custo) ?? null : null
        })),
        tbFuncionario: data.tbFuncionario.map((row: any) => ({
            ...row,
            idFuncaoFun_descricao: row.idFuncaoFun ? funçãoById.get(row.idFuncaoFun) ?? null : null,
            idStatusFun_descricao: row.idStatusFun ? statusFunById.get(row.idStatusFun) ?? null : null,
            idUserFun_descricao: row.idUserFun ? userById.get(row.idUserFun) ?? null : null,
            idCustoFun_descricao: row.idCustoFun ? ccustoById.get(row.idCustoFun) ?? null : null
        })),
        tbPatrimonio: data.tbPatrimonio.map((row: any) => ({
            ...row,
            idPat_TipoPat_descricao: row.idPat_TipoPat ? tipoPatById.get(row.idPat_TipoPat) ?? null : null,
            idPat_StatusPat_descricao: row.idPat_StatusPat ? statusPatById.get(row.idPat_StatusPat) ?? null : null,
            idPat_CustoPat_descricao: row.idPat_CustoPat ? ccustoById.get(row.idPat_CustoPat) ?? null : null
        })),
        tbHasLicencaFuncionario: data.tbHasLicencaFuncionario.map((row: any) => ({
            ...row,
            idFunc_descricao: row.idFunc ? funcionarioById.get(row.idFunc) ?? null : null,
            idLinc_descricao: row.idLinc ? licencaById.get(row.idLinc) ?? null : null
        })),
        tbCadastro: data.tbCadastro.map((row: any) => ({
            ...row,
            idStatusPatCad_descricao: row.idStatusPatCad ? statusPatById.get(row.idStatusPatCad) ?? null : null,
            idPatCad_descricao: row.idPatCad ? patrimonioByIdPat.get(row.idPatCad) ?? null : null,
            idMatFunCad_descricao: row.idMatFunCad ? funcionarioByMat.get(row.idMatFunCad) ?? null : null
        }))
    };
}

async function buildExportData(centroId?: string | null): Promise<BackupData> {
    if (!centroId) {
        const [
            tbUser,
            tbStatusFun,
            tbFuncao,
            tbTipoPat,
            tbStatusPat,
            tbEmpresa,
            tbCCusto,
            tbLicenca,
            tbFuncionario,
            tbPatrimonio,
            tbHasLicencaFuncionario,
            tbCadastro,
            tbBmMedicao,
            tbTransferenciaCustoPatrimonio,
            tbTransferenciaAlocacao,
            tbDevolucao,
            tbAuditoriaDevolucaoPatrimonio,
            tbPatrimonioHistorico,
            Account,
            Session,
            User,
            VerificationToken,
            tbUnifiConfig
        ] = await Promise.all([
            prisma.tbUser.findMany(),
            prisma.tbStatusFun.findMany(),
            prisma.tbFuncao.findMany(),
            prisma.tbTipoPat.findMany(),
            prisma.tbStatusPat.findMany(),
            prisma.tbEmpresa.findMany(),
            prisma.tbCCusto.findMany(),
            prisma.tbLicenca.findMany(),
            prisma.tbFuncionario.findMany(),
            prisma.tbPatrimonio.findMany(),
            prisma.tbHasLicencaFuncionario.findMany(),
            prisma.tbCadastro.findMany(),
            prisma.tbBmMedicao.findMany(),
            prisma.tbTransferenciaCustoPatrimonio.findMany(),
            prisma.tbTransferenciaAlocacao.findMany(),
            prisma.tbDevolucao.findMany(),
            prisma.tbAuditoriaDevolucaoPatrimonio.findMany(),
            prisma.tbPatrimonioHistorico.findMany(),
            prisma.account.findMany(),
            prisma.session.findMany(),
            prisma.user.findMany(),
            prisma.verificationToken.findMany(),
            prisma.tbUnifiConfig.findMany()
        ]);

        return {
            tbUser,
            tbStatusFun,
            tbFuncao,
            tbTipoPat,
            tbStatusPat,
            tbEmpresa,
            tbCCusto,
            tbLicenca,
            tbFuncionario,
            tbPatrimonio,
            tbHasLicencaFuncionario,
            tbCadastro,
            tbBmMedicao,
            tbTransferenciaCustoPatrimonio,
            tbTransferenciaAlocacao,
            tbDevolucao,
            tbAuditoriaDevolucaoPatrimonio,
            tbPatrimonioHistorico,
            Account,
            Session,
            User,
            VerificationToken,
            tbUnifiConfig
        };
    }

    const tbCCusto = await prisma.tbCCusto.findMany({
        where: { idCCusto: centroId }
    });
    const tbFuncionario = await prisma.tbFuncionario.findMany({
        where: { idCustoFun: centroId }
    });
    const tbPatrimonio = await prisma.tbPatrimonio.findMany({
        where: { idPat_CustoPat: centroId }
    });

    const funcionarioIds = new Set(tbFuncionario.map((f) => f.idF));
    const matriculas = new Set(tbFuncionario.map((f) => f.idMatFun));
    const patrimonioIds = new Set(tbPatrimonio.map((p) => p.idPat));
    const userIds = new Set(onlyStrings(tbFuncionario.map((f) => f.idUserFun)));
    const statusFunIds = new Set(onlyStrings(tbFuncionario.map((f) => f.idStatusFun)));
    const funcaoIds = new Set(onlyStrings(tbFuncionario.map((f) => f.idFuncaoFun)));
    const statusPatIdsFromPat = new Set(onlyStrings(tbPatrimonio.map((p) => p.idPat_StatusPat)));
    const tipoPatIds = new Set(onlyStrings(tbPatrimonio.map((p) => p.idPat_TipoPat)));
    const empresaIds = new Set(onlyStrings(tbCCusto.map((c) => c.idEmp_Custo)));

    const tbHasLicencaFuncionario = await prisma.tbHasLicencaFuncionario.findMany({
        where: {
            idFunc: { in: [...funcionarioIds] }
        }
    });
    const licencaIds = new Set(tbHasLicencaFuncionario.map((h) => h.idLinc));

    const tbCadastro = await prisma.tbCadastro.findMany({
        where: {
            OR: [
                { idMatFunCad: { in: [...matriculas] } },
                { idPatCad: { in: [...patrimonioIds] } }
            ]
        }
    });
    const statusPatIdsFromCadastro = new Set(onlyStrings(tbCadastro.map((c) => c.idStatusPatCad)));
    const statusPatIds = new Set([...statusPatIdsFromPat, ...statusPatIdsFromCadastro]);
    const tbBmMedicao = await prisma.tbBmMedicao.findMany({
        where: { idCCusto: centroId }
    });
    const tbTransferenciaCustoPatrimonio = await prisma.tbTransferenciaCustoPatrimonio.findMany({
        where: {
            OR: [{ idCustoOrigem: centroId }, { idCustoDestino: centroId }]
        }
    });
    const tbTransferenciaAlocacao = await prisma.tbTransferenciaAlocacao.findMany({
        where: {
            tbPatrimonio: {
                idPat_CustoPat: centroId
            }
        }
    });
    const tbDevolucao = await prisma.tbDevolucao.findMany({
        where: {
            tbPatrimonio: {
                idPat_CustoPat: centroId
            }
        }
    });
    const tbAuditoriaDevolucaoPatrimonio = await prisma.tbAuditoriaDevolucaoPatrimonio.findMany({
        where: {
            tbPatrimonio: {
                idPat_CustoPat: centroId
            }
        }
    });
    const tbPatrimonioHistorico = await prisma.tbPatrimonioHistorico.findMany({
        where: { idPat_CustoPat: centroId }
    });

    const [
        tbUser,
        tbStatusFun,
        tbFuncao,
        tbTipoPat,
        tbStatusPat,
        tbEmpresa,
        tbLicenca
    ] = await Promise.all([
        prisma.tbUser.findMany({ where: { id: { in: [...userIds] } } }),
        prisma.tbStatusFun.findMany({ where: { idStatusFun: { in: [...statusFunIds] } } }),
        prisma.tbFuncao.findMany({ where: { idFuncao: { in: [...funcaoIds] } } }),
        prisma.tbTipoPat.findMany({ where: { idTipPat: { in: [...tipoPatIds] } } }),
        prisma.tbStatusPat.findMany({ where: { idStatusPat: { in: [...statusPatIds] } } }),
        prisma.tbEmpresa.findMany({ where: { idEmp: { in: [...empresaIds] } } }),
        prisma.tbLicenca.findMany({ where: { idLic: { in: [...licencaIds] } } })
    ]);

    return {
        tbUser,
        tbStatusFun,
        tbFuncao,
        tbTipoPat,
        tbStatusPat,
        tbEmpresa,
        tbCCusto,
        tbLicenca,
        tbFuncionario,
        tbPatrimonio,
        tbHasLicencaFuncionario,
        tbCadastro,
        tbBmMedicao,
        tbTransferenciaCustoPatrimonio,
        tbTransferenciaAlocacao,
        tbDevolucao,
        tbAuditoriaDevolucaoPatrimonio,
        tbPatrimonioHistorico,
        Account: [],
        Session: [],
        User: [],
        VerificationToken: [],
        tbUnifiConfig: []
    };
}

function asArrayOptional<T = Record<string, any>>(value: unknown): T[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) return [];
    return value as T[];
}

async function importAllData(data: BackupData): Promise<ImportExecutionResult> {
    const ignored: IgnoredImportRow[] = [];
    const detailed = emptyDetailedCounts();
    const userIdMap = new Map<string, string>();
    const statusFunMap = new Map<string, string>();
    const funçãoMap = new Map<string, string>();
    const tipoPatMap = new Map<string, string>();
    const statusPatMap = new Map<string, string>();
    const empresaMap = new Map<string, string>();
    const ccustoMap = new Map<string, string>();
    const licencaMap = new Map<string, string>();
    const funcionarioMap = new Map<string, string>();
    const patrimonioMap = new Map<string, string>();
    const cadastroMap = new Map<string, string>();
    const userSourceIndex = buildSourceIndex(data.tbUser, "id", ["emailUser", "idUser", "nomeUser"]);
    const statusFunSourceIndex = buildSourceIndex(data.tbStatusFun, "idStatusFun", ["descricaoStatusFun"]);
    const funçãoSourceIndex = buildSourceIndex(data.tbFuncao, "idFuncao", ["nomeFuncao"]);
    const tipoPatSourceIndex = buildSourceIndex(data.tbTipoPat, "idTipPat", ["descricaoTipPat"]);
    const statusPatSourceIndex = buildSourceIndex(data.tbStatusPat, "idStatusPat", ["descricaoStatPat"]);
    const empresaSourceIndex = buildSourceIndex(data.tbEmpresa, "idEmp", ["fantasiaEmpresa", "razaoEmpresa", "cnpjEmpresa"]);
    const ccustoSourceIndex = buildSourceIndex(data.tbCCusto, "idCCusto", ["descricaoCCusto", "codigoCCusto"]);
    const licencaSourceIndex = buildSourceIndex(data.tbLicenca, "idLic", ["descricaoLic"]);
    const funcionarioSourceIndex = buildSourceIndex(data.tbFuncionario, "idF", ["idMatFun", "nomeFun"]);
    const matriculasFuncionarioNoArquivo = new Set<string>();

    const tbUserPrepared = data.tbUser.map((item: any) => {
        const id = randomUUID();
        if (item.id) userIdMap.set(item.id, id);
        return {
            id,
            idUser: item.idUser ?? null,
            nomeUser: item.nomeUser ?? null,
            emailUser: item.emailUser ?? null,
            emailVerified: toDateOrNull(item.emailVerified),
            senhaUser: item.senhaUser ?? null,
            avatarUser: item.avatarUser ?? null,
            authTypeUser: item.authTypeUser ?? null,
            formulariosUser: parseJsonField(item.formulariosUser) ?? item.formulariosUser ?? null,
            centrosUser: parseJsonField(item.centrosUser) ?? item.centrosUser ?? null,
            statusUser: item.statusUser ?? "ATIVO"
        };
    });

    const tbStatusFunPrepared = data.tbStatusFun.flatMap((item: any, index: number) => {
        if (!item?.descricaoStatusFun) {
            addIgnoredRow(ignored, "tbStatusFun", index + 1, "descricaoStatusFun ausente.");
            return [];
        }
        const id = randomUUID();
        if (item.idStatusFun) statusFunMap.set(item.idStatusFun, id);
        return [{
            idStatusFun: id,
            descricaoStatusFun: item.descricaoStatusFun
        }];
    });

    const tbFuncaoPrepared = data.tbFuncao.flatMap((item: any, index: number) => {
        if (!item?.nomeFuncao) {
            addIgnoredRow(ignored, "tbFuncao", index + 1, "nomeFuncao ausente.");
            return [];
        }
        const id = randomUUID();
        if (item.idFuncao) funçãoMap.set(item.idFuncao, id);
        return [{
            idFuncao: id,
            nomeFuncao: item.nomeFuncao
        }];
    });

    const tbTipoPatPrepared = data.tbTipoPat.map((item: any) => {
        const id = randomUUID();
        if (item.idTipPat) tipoPatMap.set(item.idTipPat, id);
        return {
            idTipPat: id,
            descricaoTipPat: item.descricaoTipPat ?? null
        };
    });

    const tbStatusPatPrepared = data.tbStatusPat.flatMap((item: any, index: number) => {
        if (!item?.descricaoStatPat) {
            addIgnoredRow(ignored, "tbStatusPat", index + 1, "descricaoStatPat ausente.");
            return [];
        }
        const id = randomUUID();
        if (item.idStatusPat) statusPatMap.set(item.idStatusPat, id);
        return [{
            idStatusPat: id,
            descricaoStatPat: item.descricaoStatPat
        }];
    });

    const tbEmpresaPrepared = data.tbEmpresa.map((item: any) => {
        const id = randomUUID();
        if (item.idEmp) empresaMap.set(item.idEmp, id);
        return {
            idEmp: id,
            razaoEmpresa: item.razaoEmpresa ?? null,
            fantasiaEmpresa: item.fantasiaEmpresa ?? null,
            cnpjEmpresa: item.cnpjEmpresa ?? null,
            idCustEmp: item.idCustEmp ?? null
        };
    });

    const tbCCustoPrepared = data.tbCCusto.map((item: any) => {
        const id = randomUUID();
        if (item.idCCusto) ccustoMap.set(item.idCCusto, id);
        return {
            idCCusto: id,
            codigoCCusto: item.codigoCCusto ?? null,
            descricaoCCusto: item.descricaoCCusto ?? null,
            idEmp_Custo: mapResolvedId(empresaMap, item, "idEmp_Custo", empresaSourceIndex, ["idEmp_Custo_descricao"])
        };
    });

    const tbLicencaPrepared = data.tbLicenca.flatMap((item: any, index: number) => {
        if (!item?.descricaoLic) {
            addIgnoredRow(ignored, "tbLicenca", index + 1, "descricaoLic ausente.");
            return [];
        }
        const id = randomUUID();
        if (item.idLic) licencaMap.set(item.idLic, id);
        return [{
            idLic: id,
            descricaoLic: item.descricaoLic
        }];
    });

    const tbFuncionarioPrepared = data.tbFuncionario.flatMap((item: any, index: number) => {
        const idMatFun = firstString(item?.idMatFun);
        if (!idMatFun || !item?.nomeFun) {
            addIgnoredRow(ignored, "tbFuncionario", index + 1, "idMatFun ou nomeFun ausente.");
            return [];
        }
        if (matriculasFuncionarioNoArquivo.has(idMatFun)) {
            addIgnoredRow(ignored, "tbFuncionario", index + 1, `idMatFun duplicado no arquivo: ${idMatFun}.`);
            return [];
        }
        matriculasFuncionarioNoArquivo.add(idMatFun);
        const id = randomUUID();
        if (item.idF) funcionarioMap.set(item.idF, id);
        return [{
            idF: id,
            idMatFun,
            nomeFun: item.nomeFun,
            cpfFun: item.cpfFun ?? null,
            dataAdmFun: toDateOrNull(item.dataAdmFun),
            dataDesFun: toDateOrNull(item.dataDesFun),
            avatarFun: item.avatarFun ?? null,
            idFuncaoFun: mapResolvedId(funçãoMap, item, "idFuncaoFun", funçãoSourceIndex, ["idFuncaoFun_descricao"]),
            idUserFun: mapResolvedId(userIdMap, item, "idUserFun", userSourceIndex, ["idUserFun_descricao"]),
            idStatusFun: mapResolvedId(statusFunMap, item, "idStatusFun", statusFunSourceIndex, ["idStatusFun_descricao"]),
            idCustoFun: mapResolvedId(ccustoMap, item, "idCustoFun", ccustoSourceIndex, ["idCustoFun_descricao"])
        }];
    });

    const tbPatrimonioPrepared = data.tbPatrimonio.flatMap((item: any, index: number) => {
        const dataEntPat = toDateOrNull(item?.dataEntPat);
        const valorPat = Number(item?.valorPat);
        if (!item?.idPat || !item?.descricaoPat) {
            addIgnoredRow(ignored, "tbPatrimonio", index + 1, "idPat ou descricaoPat ausente.");
            return [];
        }
        if (!dataEntPat) {
            addIgnoredRow(ignored, "tbPatrimonio", index + 1, "dataEntPat invalida.");
            return [];
        }
        if (!Number.isFinite(valorPat)) {
            addIgnoredRow(ignored, "tbPatrimonio", index + 1, "valorPat invalido.");
            return [];
        }
        const idP = randomUUID();
        if (item.idP) patrimonioMap.set(item.idP, idP);
        return [{
            idP,
            idPat: item.idPat,
            descricaoPat: item.descricaoPat,
            descricaoDetalhadaPat: item.descricaoDetalhadaPat ?? null,
            licencaPat: item.licencaPat ?? null,
            dataEntPat,
            dataSaiPat: toDateOrNull(item.dataSaiPat),
            notaFiscalPat: item.notaFiscalPat ?? null,
            valorPat,
            idPat_TipoPat: mapResolvedId(tipoPatMap, item, "idPat_TipoPat", tipoPatSourceIndex, ["idPat_TipoPat_descricao"]),
            idPat_StatusPat: mapResolvedId(statusPatMap, item, "idPat_StatusPat", statusPatSourceIndex, ["idPat_StatusPat_descricao"]),
            idPat_CustoPat: mapResolvedId(ccustoMap, item, "idPat_CustoPat", ccustoSourceIndex, ["idPat_CustoPat_descricao"])
        }];
    });

    const tbHasLicencaPrepared = data.tbHasLicencaFuncionario
        .flatMap((item: any, index: number) => {
            const idFunc = mapResolvedId(funcionarioMap, item, "idFunc", funcionarioSourceIndex, ["idFunc_descricao"]);
            const idLinc = mapResolvedId(licencaMap, item, "idLinc", licencaSourceIndex, ["idLinc_descricao"]);
            const dataInicio = toDateOrNull(item?.dataInicio);
            const dataVencimetno = toDateOrNull(item?.dataVencimetno);
            if (!idFunc || !idLinc) {
                addIgnoredRow(ignored, "tbHasLicencaFuncionario", index + 1, "idFunc ou idLinc nao mapeado.");
                return [];
            }
            if (!dataInicio || !dataVencimetno) {
                addIgnoredRow(ignored, "tbHasLicencaFuncionario", index + 1, "dataInicio ou dataVencimetno invalida.");
                return [];
            }
            return [{
                idHas: randomUUID(),
                idFunc,
                idLinc,
                dataInicio,
                dataVencimetno
            }];
        });

    const tbCadastroPrepared = data.tbCadastro.flatMap((item: any, index: number) => {
        const statusMapped = mapResolvedId(
            statusPatMap,
            item,
            "idStatusPatCad",
            statusPatSourceIndex,
            ["idStatusPatCad_descricao"]
        );
        if (!statusMapped) {
            addIgnoredRow(ignored, "tbCadastro", index + 1, "idStatusPatCad nao mapeado.");
            return [];
        }
        const idCad = randomUUID();
        if (item.idCad) cadastroMap.set(item.idCad, idCad);
        return [{
            idCad,
            dataCadPat: toDateOrNull(item.dataCadPat),
            dataDevPat: toDateOrNull(item.dataDevPat),
            idPatCad: item.idPatCad ?? null,
            idMatFunCad: item.idMatFunCad ?? null,
            idStatusPatCad: statusMapped
        }];
    });

    const tbBmMedicaoPrepared = data.tbBmMedicao.map((item: any) => ({
        idBm: item.idBm ?? randomUUID(),
        codigoBm: item.codigoBm ?? null,
        idCCusto: mapResolvedId(ccustoMap, item, "idCCusto", ccustoSourceIndex, ["codigoCCusto", "descricaoCCusto"]),
        codigoCCusto: item.codigoCCusto ?? null,
        descricaoCCusto: item.descricaoCCusto ?? null,
        mesBm: Number(item.mesBm ?? 0),
        anoBm: Number(item.anoBm ?? 0),
        contadorBm: Number(item.contadorBm ?? 0),
        statusBm: item.statusBm ?? "ABERTO",
        dataInicioMedicao: toDateOrNull(item.dataInicioMedicao) ?? new Date(),
        dataFimMedicao: toDateOrNull(item.dataFimMedicao) ?? new Date(),
        resumoJson: parseJsonField(item.resumoJson),
        resultadosJson: parseJsonField(item.resultadosJson),
        naoInformadosJson: parseJsonField(item.naoInformadosJson),
        gerouRelatorioExcel: Boolean(item.gerouRelatorioExcel),
        gerouRelatorioPdf: Boolean(item.gerouRelatorioPdf),
        idUserGeracao: mapResolvedId(userIdMap, item, "idUserGeracao", userSourceIndex),
        fechadoAt: toDateOrNull(item.fechadoAt)
    })).filter((row: any) => row.idCCusto);

    const tbTransferenciaCustoPatrimonioPrepared = data.tbTransferenciaCustoPatrimonio.flatMap((item: any) => {
        const idPatrimonio = item?.idPatrimonio ? (patrimonioMap.get(item.idPatrimonio) ?? null) : null;
        const idCustoDestino = mapResolvedId(ccustoMap, item, "idCustoDestino", ccustoSourceIndex, ["idCustoDestino_descricao"]);
        if (!idPatrimonio || !idCustoDestino) return [];
        return [{
            idTransferencia: item.idTransferencia ?? randomUUID(),
            idPatrimonio,
            idCustoOrigem: mapResolvedId(ccustoMap, item, "idCustoOrigem", ccustoSourceIndex, ["idCustoOrigem_descricao"]),
            idCustoDestino,
            valorTransferido: item.valorTransferido === null || item.valorTransferido === undefined ? null : Number(item.valorTransferido),
            observacao: item.observacao ?? null,
            idUserTransferencia: mapResolvedId(userIdMap, item, "idUserTransferencia", userSourceIndex),
            dataTransferencia: toDateOrNull(item.dataTransferencia) ?? new Date(),
            createdAt: toDateOrNull(item.createdAt) ?? new Date()
        }];
    });

    const tbTransferenciaAlocacaoPrepared = data.tbTransferenciaAlocacao.flatMap((item: any) => {
        const idCadastro = item?.idCadastro ? (cadastroMap.get(item.idCadastro) ?? null) : null;
        if (!idCadastro || !item?.idPatrimonio) return [];
        return [{
            idTransferenciaAlocacao: item.idTransferenciaAlocacao ?? randomUUID(),
            idCadastro,
            idPatrimonio: item.idPatrimonio,
            idMatriculaFuncionario: item.idMatriculaFuncionario ?? null,
            idMatriculaFuncionarioDestino: item.idMatriculaFuncionarioDestino ?? null,
            statusAnterior: item.statusAnterior ?? null,
            statusNovo: item.statusNovo ?? "ALOCADO",
            observacao: item.observacao ?? null,
            idUserTransferencia: mapResolvedId(userIdMap, item, "idUserTransferencia", userSourceIndex),
            dataTransferencia: toDateOrNull(item.dataTransferencia) ?? new Date(),
            createdAt: toDateOrNull(item.createdAt) ?? new Date()
        }];
    });

    const tbDevolucaoPrepared = data.tbDevolucao.flatMap((item: any) => {
        const idPatrimonio = item?.idPatrimonio ? (patrimonioMap.get(item.idPatrimonio) ?? null) : null;
        if (!idPatrimonio) return [];
        return [{
            idDevolucao: item.idDevolucao ?? randomUUID(),
            idPatrimonio,
            idCadastro: item?.idCadastro ? (cadastroMap.get(item.idCadastro) ?? null) : null,
            dataInicioDevolucao: toDateOrNull(item.dataInicioDevolucao) ?? new Date(),
            dataFimDevolucao: toDateOrNull(item.dataFimDevolucao),
            dataSaidaFornecedor: toDateOrNull(item.dataSaidaFornecedor),
            dataChegadaFornecedor: toDateOrNull(item.dataChegadaFornecedor),
            motivoDevolucao: item.motivoDevolucao ?? null,
            notaFiscalDevolucao: item.notaFiscalDevolucao ?? null
        }];
    });

    const tbAuditoriaDevolucaoPatrimonioPrepared = data.tbAuditoriaDevolucaoPatrimonio.flatMap((item: any) => {
        const idPatrimonioRef = item?.idPatrimonioRef ? (patrimonioMap.get(item.idPatrimonioRef) ?? null) : null;
        if (!idPatrimonioRef) return [];
        return [{
            idAuditoria: item.idAuditoria ?? randomUUID(),
            idPatrimonioRef,
            idPat: item.idPat ?? null,
            statusAnterior: item.statusAnterior ?? null,
            statusNovo: item.statusNovo ?? null,
            limpezaSolicitada: Boolean(item.limpezaSolicitada),
            registrosRemovidos: Number(item.registrosRemovidos ?? 0),
            idUserAcao: mapResolvedId(userIdMap, item, "idUserAcao", userSourceIndex),
            emailUserAcao: item.emailUserAcao ?? null,
            observacao: item.observacao ?? null,
            detalhesJson: parseJsonField(item.detalhesJson),
            createdAt: toDateOrNull(item.createdAt) ?? new Date()
        }];
    });

    const tbPatrimonioHistoricoPrepared = data.tbPatrimonioHistorico.flatMap((item: any) => {
        const idPatrimonioOriginal = item?.idPatrimonioOriginal ? (patrimonioMap.get(item.idPatrimonioOriginal) ?? null) : null;
        if (!idPatrimonioOriginal || !item?.idPat || !item?.descricaoPat) return [];
        return [{
            idHistorico: item.idHistorico ?? randomUUID(),
            idPatrimonioOriginal,
            idPat: item.idPat,
            descricaoPat: item.descricaoPat,
            valorPat: Number(item.valorPat ?? 0),
            dataEntPat: toDateOrNull(item.dataEntPat) ?? new Date(),
            dataSaiPat: toDateOrNull(item.dataSaiPat),
            notaFiscalPat: item.notaFiscalPat ?? null,
            idPat_TipoPat: mapResolvedId(tipoPatMap, item, "idPat_TipoPat", tipoPatSourceIndex),
            idPat_StatusPat: mapResolvedId(statusPatMap, item, "idPat_StatusPat", statusPatSourceIndex),
            idPat_CustoPat: mapResolvedId(ccustoMap, item, "idPat_CustoPat", ccustoSourceIndex),
            dataDevolucao: toDateOrNull(item.dataDevolucao),
            motivoDevolucao: item.motivoDevolucao ?? null,
            notaFiscalDevolucao: item.notaFiscalDevolucao ?? null,
            createdAt: toDateOrNull(item.createdAt) ?? new Date()
        }];
    });

    const userAuthPrepared = data.User.map((item: any) => ({
        id: item.id,
        name: item.name ?? null,
        email: item.email ?? null,
        emailVerified: toDateOrNull(item.emailVerified),
        image: item.image ?? null
    }));

    const accountPrepared = data.Account.map((item: any) => ({
        idAccont: item.idAccont ?? randomUUID(),
        userId: item.userId,
        type: item.type,
        provider: item.provider,
        providerAccountId: item.providerAccountId,
        refresh_token: item.refresh_token ?? null,
        access_token: item.access_token ?? null,
        expires_at: item.expires_at === null || item.expires_at === undefined ? null : Number(item.expires_at),
        token_type: item.token_type ?? null,
        scope: item.scope ?? null,
        id_token: item.id_token ?? null,
        sesseion_state: item.sesseion_state ?? null
    }));

    const sessionPrepared = data.Session.map((item: any) => ({
        id: item.id ?? randomUUID(),
        sessionToken: item.sessionToken,
        userId: item.userId,
        expires: toDateOrNull(item.expires) ?? new Date()
    }));

    const verificationTokenPrepared = data.VerificationToken.map((item: any) => ({
        identifier: item.identifier,
        token: item.token,
        expires: toDateOrNull(item.expires)
    }));

    const tbUnifiConfigPrepared = data.tbUnifiConfig.map((item: any) => ({
        id: item.id ?? randomUUID(),
        type: item.type ?? "cloud",
        apiKey: item.apiKey ?? null,
        host: item.host ?? null,
        username: item.username ?? null,
        password: item.password ?? null,
        isActive: typeof item.isActive === "boolean" ? item.isActive : true
    }));

    await prisma.$transaction(async (tx: any) => {
        await tx.tbTransferenciaAlocacao.deleteMany();
        await tx.tbTransferenciaCustoPatrimonio.deleteMany();
        await tx.tbDevolucao.deleteMany();
        await tx.tbAuditoriaDevolucaoPatrimonio.deleteMany();
        await tx.tbPatrimonioHistorico.deleteMany();
        await tx.tbBmMedicao.deleteMany();
        await tx.account.deleteMany();
        await tx.session.deleteMany();
        await tx.verificationToken.deleteMany();
        await tx.user.deleteMany();
        await tx.tbUnifiConfig.deleteMany();
        await tx.tbCadastro.deleteMany();
        await tx.tbHasLicencaFuncionario.deleteMany();
        await tx.tbPatrimonio.deleteMany();
        await tx.tbFuncionario.deleteMany();
        await tx.tbCCusto.deleteMany();
        await tx.tbEmpresa.deleteMany();
        await tx.tbLicenca.deleteMany();
        await tx.tbStatusPat.deleteMany();
        await tx.tbTipoPat.deleteMany();
        await tx.tbStatusFun.deleteMany();
        await tx.tbFuncao.deleteMany();
        await tx.tbUser.deleteMany();

        if (tbUserPrepared.length > 0) await tx.tbUser.createMany({ data: tbUserPrepared });
        if (tbStatusFunPrepared.length > 0) await tx.tbStatusFun.createMany({ data: tbStatusFunPrepared });
        if (tbFuncaoPrepared.length > 0) await tx.tbFuncao.createMany({ data: tbFuncaoPrepared });
        if (tbTipoPatPrepared.length > 0) await tx.tbTipoPat.createMany({ data: tbTipoPatPrepared });
        if (tbStatusPatPrepared.length > 0) await tx.tbStatusPat.createMany({ data: tbStatusPatPrepared });
        if (tbEmpresaPrepared.length > 0) await tx.tbEmpresa.createMany({ data: tbEmpresaPrepared });
        if (tbCCustoPrepared.length > 0) await tx.tbCCusto.createMany({ data: tbCCustoPrepared });
        if (tbLicencaPrepared.length > 0) await tx.tbLicenca.createMany({ data: tbLicencaPrepared });
        if (tbFuncionarioPrepared.length > 0) await tx.tbFuncionario.createMany({ data: tbFuncionarioPrepared });
        if (tbPatrimonioPrepared.length > 0) await tx.tbPatrimonio.createMany({ data: tbPatrimonioPrepared });
        if (tbHasLicencaPrepared.length > 0) await tx.tbHasLicencaFuncionario.createMany({ data: tbHasLicencaPrepared });
        if (tbCadastroPrepared.length > 0) await tx.tbCadastro.createMany({ data: tbCadastroPrepared });
        if (tbBmMedicaoPrepared.length > 0) await tx.tbBmMedicao.createMany({ data: tbBmMedicaoPrepared });
        if (tbTransferenciaCustoPatrimonioPrepared.length > 0) await tx.tbTransferenciaCustoPatrimonio.createMany({ data: tbTransferenciaCustoPatrimonioPrepared });
        if (tbTransferenciaAlocacaoPrepared.length > 0) await tx.tbTransferenciaAlocacao.createMany({ data: tbTransferenciaAlocacaoPrepared });
        if (tbDevolucaoPrepared.length > 0) await tx.tbDevolucao.createMany({ data: tbDevolucaoPrepared });
        if (tbAuditoriaDevolucaoPatrimonioPrepared.length > 0) await tx.tbAuditoriaDevolucaoPatrimonio.createMany({ data: tbAuditoriaDevolucaoPatrimonioPrepared });
        if (tbPatrimonioHistoricoPrepared.length > 0) await tx.tbPatrimonioHistorico.createMany({ data: tbPatrimonioHistoricoPrepared });
        if (userAuthPrepared.length > 0) await tx.user.createMany({ data: userAuthPrepared });
        if (accountPrepared.length > 0) await tx.account.createMany({ data: accountPrepared });
        if (sessionPrepared.length > 0) await tx.session.createMany({ data: sessionPrepared });
        if (verificationTokenPrepared.length > 0) await tx.verificationToken.createMany({ data: verificationTokenPrepared });
        if (tbUnifiConfigPrepared.length > 0) await tx.tbUnifiConfig.createMany({ data: tbUnifiConfigPrepared });
    });

    return {
        imported: {
            tbUser: tbUserPrepared.length,
            tbStatusFun: tbStatusFunPrepared.length,
            tbFuncao: tbFuncaoPrepared.length,
            tbTipoPat: tbTipoPatPrepared.length,
            tbStatusPat: tbStatusPatPrepared.length,
            tbEmpresa: tbEmpresaPrepared.length,
            tbCCusto: tbCCustoPrepared.length,
            tbLicenca: tbLicencaPrepared.length,
            tbFuncionario: tbFuncionarioPrepared.length,
            tbPatrimonio: tbPatrimonioPrepared.length,
            tbHasLicencaFuncionario: tbHasLicencaPrepared.length,
            tbCadastro: tbCadastroPrepared.length,
            tbBmMedicao: tbBmMedicaoPrepared.length,
            tbTransferenciaCustoPatrimonio: tbTransferenciaCustoPatrimonioPrepared.length,
            tbTransferenciaAlocacao: tbTransferenciaAlocacaoPrepared.length,
            tbDevolucao: tbDevolucaoPrepared.length,
            tbAuditoriaDevolucaoPatrimonio: tbAuditoriaDevolucaoPatrimonioPrepared.length,
            tbPatrimonioHistorico: tbPatrimonioHistoricoPrepared.length,
            Account: accountPrepared.length,
            Session: sessionPrepared.length,
            User: userAuthPrepared.length,
            VerificationToken: verificationTokenPrepared.length,
            tbUnifiConfig: tbUnifiConfigPrepared.length
        },
        ignored,
        detailed: withIgnoredCounts(ignored, {
            ...detailed,
            tbUser: { created: tbUserPrepared.length, updated: 0, ignored: 0 },
            tbStatusFun: { created: tbStatusFunPrepared.length, updated: 0, ignored: 0 },
            tbFuncao: { created: tbFuncaoPrepared.length, updated: 0, ignored: 0 },
            tbTipoPat: { created: tbTipoPatPrepared.length, updated: 0, ignored: 0 },
            tbStatusPat: { created: tbStatusPatPrepared.length, updated: 0, ignored: 0 },
            tbEmpresa: { created: tbEmpresaPrepared.length, updated: 0, ignored: 0 },
            tbCCusto: { created: tbCCustoPrepared.length, updated: 0, ignored: 0 },
            tbLicenca: { created: tbLicencaPrepared.length, updated: 0, ignored: 0 },
            tbFuncionario: { created: tbFuncionarioPrepared.length, updated: 0, ignored: 0 },
            tbPatrimonio: { created: tbPatrimonioPrepared.length, updated: 0, ignored: 0 },
            tbHasLicencaFuncionario: { created: tbHasLicencaPrepared.length, updated: 0, ignored: 0 },
            tbCadastro: { created: tbCadastroPrepared.length, updated: 0, ignored: 0 },
            tbBmMedicao: { created: tbBmMedicaoPrepared.length, updated: 0, ignored: 0 },
            tbTransferenciaCustoPatrimonio: { created: tbTransferenciaCustoPatrimonioPrepared.length, updated: 0, ignored: 0 },
            tbTransferenciaAlocacao: { created: tbTransferenciaAlocacaoPrepared.length, updated: 0, ignored: 0 },
            tbDevolucao: { created: tbDevolucaoPrepared.length, updated: 0, ignored: 0 },
            tbAuditoriaDevolucaoPatrimonio: { created: tbAuditoriaDevolucaoPatrimonioPrepared.length, updated: 0, ignored: 0 },
            tbPatrimonioHistorico: { created: tbPatrimonioHistoricoPrepared.length, updated: 0, ignored: 0 },
            Account: { created: accountPrepared.length, updated: 0, ignored: 0 },
            Session: { created: sessionPrepared.length, updated: 0, ignored: 0 },
            User: { created: userAuthPrepared.length, updated: 0, ignored: 0 },
            VerificationToken: { created: verificationTokenPrepared.length, updated: 0, ignored: 0 },
            tbUnifiConfig: { created: tbUnifiConfigPrepared.length, updated: 0, ignored: 0 }
        })
    };
}

async function importByCentro(data: BackupData, centroId: string): Promise<ImportExecutionResult> {
    const ignored: IgnoredImportRow[] = [];
    const detailed = emptyDetailedCounts();
    const tbCCusto = data.tbCCusto.filter((c: any) => c.idCCusto === centroId);
    const tbFuncionario = data.tbFuncionario.filter((f: any) => f.idCustoFun === centroId);
    const tbPatrimonio = data.tbPatrimonio.filter((p: any) => p.idPat_CustoPat === centroId);
    const tbHasLicenca = data.tbHasLicencaFuncionario;
    const tbCadastro = data.tbCadastro;

    await prisma.$transaction(async (tx: any) => {
        const statusFunMap = new Map<string, string>();
        const funçãoMap = new Map<string, string>();
        const tipoPatMap = new Map<string, string>();
        const statusPatMap = new Map<string, string>();
        const userMap = new Map<string, string>();
        const licencaMap = new Map<string, string>();
        const funcionarioMap = new Map<string, string>();
        const userSourceIndex = buildSourceIndex(data.tbUser, "id", ["emailUser", "idUser", "nomeUser"]);
        const statusFunSourceIndex = buildSourceIndex(data.tbStatusFun, "idStatusFun", ["descricaoStatusFun"]);
        const funçãoSourceIndex = buildSourceIndex(data.tbFuncao, "idFuncao", ["nomeFuncao"]);
        const tipoPatSourceIndex = buildSourceIndex(data.tbTipoPat, "idTipPat", ["descricaoTipPat"]);
        const statusPatSourceIndex = buildSourceIndex(data.tbStatusPat, "idStatusPat", ["descricaoStatPat"]);
        const licencaSourceIndex = buildSourceIndex(data.tbLicenca, "idLic", ["descricaoLic"]);
        const funcionarioSourceIndex = buildSourceIndex(data.tbFuncionario, "idF", ["idMatFun", "nomeFun"]);

        for (let index = 0; index < data.tbStatusFun.length; index += 1) {
            const row = data.tbStatusFun[index];
            if (!row?.descricaoStatusFun) {
                addIgnoredRow(ignored, "tbStatusFun", index + 1, "descricaoStatusFun ausente.");
                continue;
            }
            const existing = await tx.tbStatusFun.findFirst({
                where: { descricaoStatusFun: row.descricaoStatusFun }
            });
            if (existing) {
                if (row.idStatusFun) statusFunMap.set(row.idStatusFun, existing.idStatusFun);
                continue;
            }
            const created = await tx.tbStatusFun.create({
                data: { idStatusFun: randomUUID(), descricaoStatusFun: row.descricaoStatusFun }
            });
            if (row.idStatusFun) statusFunMap.set(row.idStatusFun, created.idStatusFun);
        }

        for (let index = 0; index < data.tbFuncao.length; index += 1) {
            const row = data.tbFuncao[index];
            if (!row?.nomeFuncao) {
                addIgnoredRow(ignored, "tbFuncao", index + 1, "nomeFuncao ausente.");
                continue;
            }
            const existing = await tx.tbFuncao.findFirst({
                where: { nomeFuncao: row.nomeFuncao }
            });
            if (existing) {
                if (row.idFuncao) funçãoMap.set(row.idFuncao, existing.idFuncao);
                continue;
            }
            const created = await tx.tbFuncao.create({
                data: { idFuncao: randomUUID(), nomeFuncao: row.nomeFuncao }
            });
            if (row.idFuncao) funçãoMap.set(row.idFuncao, created.idFuncao);
        }

        for (const row of data.tbTipoPat) {
            const existing = await tx.tbTipoPat.findFirst({
                where: { descricaoTipPat: row.descricaoTipPat ?? null }
            });
            if (existing) {
                if (row.idTipPat) tipoPatMap.set(row.idTipPat, existing.idTipPat);
                continue;
            }
            const created = await tx.tbTipoPat.create({
                data: { idTipPat: randomUUID(), descricaoTipPat: row.descricaoTipPat ?? null }
            });
            if (row.idTipPat) tipoPatMap.set(row.idTipPat, created.idTipPat);
        }

        for (let index = 0; index < data.tbStatusPat.length; index += 1) {
            const row = data.tbStatusPat[index];
            if (!row?.descricaoStatPat) {
                addIgnoredRow(ignored, "tbStatusPat", index + 1, "descricaoStatPat ausente.");
                continue;
            }
            const existing = await tx.tbStatusPat.findFirst({
                where: { descricaoStatPat: row.descricaoStatPat }
            });
            if (existing) {
                if (row.idStatusPat) statusPatMap.set(row.idStatusPat, existing.idStatusPat);
                continue;
            }
            const created = await tx.tbStatusPat.create({
                data: { idStatusPat: randomUUID(), descricaoStatPat: row.descricaoStatPat }
            });
            if (row.idStatusPat) statusPatMap.set(row.idStatusPat, created.idStatusPat);
        }

        for (let index = 0; index < data.tbLicenca.length; index += 1) {
            const row = data.tbLicenca[index];
            if (!row?.descricaoLic) {
                addIgnoredRow(ignored, "tbLicenca", index + 1, "descricaoLic ausente.");
                continue;
            }
            const existing = await tx.tbLicenca.findFirst({
                where: { descricaoLic: row.descricaoLic }
            });
            if (existing) {
                if (row.idLic) licencaMap.set(row.idLic, existing.idLic);
                continue;
            }
            const created = await tx.tbLicenca.create({
                data: { idLic: randomUUID(), descricaoLic: row.descricaoLic }
            });
            if (row.idLic) licencaMap.set(row.idLic, created.idLic);
        }

        for (const row of data.tbUser) {
            let existing = null;
            if (row.emailUser) {
                existing = await tx.tbUser.findFirst({
                    where: { emailUser: row.emailUser }
                });
            }
            if (existing) {
                if (row.id) userMap.set(row.id, existing.id);
                continue;
            }
            const created = await tx.tbUser.create({
                data: {
                    id: randomUUID(),
                    idUser: row.idUser ?? null,
                    nomeUser: row.nomeUser ?? null,
                    emailUser: row.emailUser ?? null,
                    emailVerified: toDateOrNull(row.emailVerified),
                    senhaUser: row.senhaUser ?? null,
                    avatarUser: row.avatarUser ?? null,
                    authTypeUser: row.authTypeUser ?? null,
                    formulariosUser: parseJsonField(row.formulariosUser) ?? row.formulariosUser ?? null,
                    centrosUser: parseJsonField(row.centrosUser) ?? row.centrosUser ?? null,
                    statusUser: row.statusUser ?? "ATIVO"
                }
            });
            if (row.id) userMap.set(row.id, created.id);
        }

        if (tbCCusto.length > 0) {
            const c = tbCCusto[0];
            await tx.tbCCusto.update({
                where: { idCCusto: centroId },
                data: {
                    codigoCCusto: c.codigoCCusto ?? undefined,
                    descricaoCCusto: c.descricaoCCusto ?? undefined
                }
            });
        }

        const funcsDb = await tx.tbFuncionario.findMany({
            where: { idCustoFun: centroId },
            select: { idF: true, idMatFun: true }
        });
        const patsDb = await tx.tbPatrimonio.findMany({
            where: { idPat_CustoPat: centroId },
            select: { idP: true, idPat: true }
        });

        const idsFuncDb = funcsDb.map((f: any) => f.idF);
        const matsDb = funcsDb.map((f: any) => f.idMatFun);
        const idsPatDb = patsDb.map((p: any) => p.idP);
        const codPatDb = patsDb.map((p: any) => p.idPat);

        if (matsDb.length > 0 || codPatDb.length > 0) {
            await tx.tbCadastro.deleteMany({
                where: {
                    OR: [
                        matsDb.length > 0 ? { idMatFunCad: { in: matsDb } } : undefined,
                        codPatDb.length > 0 ? { idPatCad: { in: codPatDb } } : undefined
                    ].filter(Boolean)
                }
            });
        }

        if (idsFuncDb.length > 0) {
            await tx.tbHasLicencaFuncionario.deleteMany({ where: { idFunc: { in: idsFuncDb } } });
        }
        if (idsPatDb.length > 0) {
            await tx.tbPatrimonio.deleteMany({ where: { idP: { in: idsPatDb } } });
        }
        if (idsFuncDb.length > 0) {
            await tx.tbFuncionario.deleteMany({ where: { idF: { in: idsFuncDb } } });
        }

        let funcData: any[] = [];
        if (tbFuncionario.length > 0) {
            const matriculasArquivo = Array.from(
                new Set(
                    tbFuncionario
                        .map((row: any) => firstString(row?.idMatFun))
                        .filter((value): value is string => Boolean(value))
                )
            );
            const matriculasEmOutrosCentros = new Set(
                (
                    await tx.tbFuncionario.findMany({
                        where: {
                            idMatFun: { in: matriculasArquivo },
                            NOT: { idCustoFun: centroId }
                        },
                        select: { idMatFun: true }
                    })
                ).map((row: any) => row.idMatFun)
            );
            const matriculasProcessadas = new Set<string>();

            funcData = tbFuncionario.flatMap((row: any, index: number) => {
                const idMatFun = firstString(row?.idMatFun);
                if (!idMatFun || !row?.nomeFun) {
                    addIgnoredRow(ignored, "tbFuncionario", index + 1, "idMatFun ou nomeFun ausente.");
                    return [];
                }
                if (matriculasProcessadas.has(idMatFun)) {
                    addIgnoredRow(ignored, "tbFuncionario", index + 1, `idMatFun duplicado no arquivo: ${idMatFun}.`);
                    return [];
                }
                if (matriculasEmOutrosCentros.has(idMatFun)) {
                    addIgnoredRow(
                        ignored,
                        "tbFuncionario",
                        index + 1,
                        `idMatFun ja existe em outro centro e nao pode ser sobrescrito: ${idMatFun}.`
                    );
                    return [];
                }
                matriculasProcessadas.add(idMatFun);
                const idF = randomUUID();
                if (row.idF) funcionarioMap.set(row.idF, idF);
                return [{
                    idF,
                    idMatFun,
                    nomeFun: row.nomeFun,
                    cpfFun: row.cpfFun ?? null,
                    dataAdmFun: toDateOrNull(row.dataAdmFun),
                    dataDesFun: toDateOrNull(row.dataDesFun),
                    avatarFun: row.avatarFun ?? null,
                    idFuncaoFun: mapResolvedId(funçãoMap, row, "idFuncaoFun", funçãoSourceIndex, ["idFuncaoFun_descricao"]),
                    idUserFun: mapResolvedId(userMap, row, "idUserFun", userSourceIndex, ["idUserFun_descricao"]),
                    idStatusFun: mapResolvedId(statusFunMap, row, "idStatusFun", statusFunSourceIndex, ["idStatusFun_descricao"]),
                    idCustoFun: centroId
                }];
            });
            if (funcData.length > 0) {
                await tx.tbFuncionario.createMany({ data: funcData });
            }
        }

        let patData: any[] = [];
        if (tbPatrimonio.length > 0) {
            patData = tbPatrimonio.flatMap((row: any, index: number) => {
                const dataEntPat = toDateOrNull(row?.dataEntPat);
                const valorPat = Number(row?.valorPat);
                if (!row?.idPat || !row?.descricaoPat) {
                    addIgnoredRow(ignored, "tbPatrimonio", index + 1, "idPat ou descricaoPat ausente.");
                    return [];
                }
                if (!dataEntPat) {
                    addIgnoredRow(ignored, "tbPatrimonio", index + 1, "dataEntPat invalida.");
                    return [];
                }
                if (!Number.isFinite(valorPat)) {
                    addIgnoredRow(ignored, "tbPatrimonio", index + 1, "valorPat invalido.");
                    return [];
                }
                return [{
                    idP: randomUUID(),
                    idPat: row.idPat,
                    descricaoPat: row.descricaoPat,
                    descricaoDetalhadaPat: row.descricaoDetalhadaPat ?? null,
                    licencaPat: row.licencaPat ?? null,
                    dataEntPat,
                    dataSaiPat: toDateOrNull(row.dataSaiPat),
                    notaFiscalPat: row.notaFiscalPat ?? null,
                    valorPat,
                    idPat_TipoPat: mapResolvedId(tipoPatMap, row, "idPat_TipoPat", tipoPatSourceIndex, ["idPat_TipoPat_descricao"]),
                    idPat_StatusPat: mapResolvedId(statusPatMap, row, "idPat_StatusPat", statusPatSourceIndex, ["idPat_StatusPat_descricao"]),
                    idPat_CustoPat: centroId
                }];
            });
            if (patData.length > 0) {
                await tx.tbPatrimonio.createMany({ data: patData });
            }
        }

        const hasByCentro = tbHasLicenca.flatMap((row: any, index: number) => {
            const idFunc = mapResolvedId(funcionarioMap, row, "idFunc", funcionarioSourceIndex, ["idFunc_descricao"]);
            const idLinc = mapResolvedId(licencaMap, row, "idLinc", licencaSourceIndex, ["idLinc_descricao"]);
            const dataInicio = toDateOrNull(row?.dataInicio);
            const dataVencimetno = toDateOrNull(row?.dataVencimetno);
            if (!idFunc || !idLinc) {
                addIgnoredRow(ignored, "tbHasLicencaFuncionario", index + 1, "idFunc ou idLinc nao mapeado.");
                return [];
            }
            if (!dataInicio || !dataVencimetno) {
                addIgnoredRow(ignored, "tbHasLicencaFuncionario", index + 1, "dataInicio ou dataVencimetno invalida.");
                return [];
            }
            return [{
                idHas: randomUUID(),
                idFunc,
                idLinc,
                dataInicio,
                dataVencimetno
            }];
        });

        if (hasByCentro.length > 0) {
            await tx.tbHasLicencaFuncionario.createMany({ data: hasByCentro });
        }

        const matSet = new Set(tbFuncionario.map((f: any) => f.idMatFun));
        const patSet = new Set(tbPatrimonio.map((p: any) => p.idPat));
        const cadByCentro = tbCadastro
            .filter((c: any) => matSet.has(c.idMatFunCad) || patSet.has(c.idPatCad))
            .flatMap((row: any, index: number) => {
                const statusMapped = mapResolvedId(
                    statusPatMap,
                    row,
                    "idStatusPatCad",
                    statusPatSourceIndex,
                    ["idStatusPatCad_descricao"]
                );
                if (!statusMapped) {
                    addIgnoredRow(ignored, "tbCadastro", index + 1, "idStatusPatCad nao mapeado.");
                    return [];
                }
                return [{
                    idCad: randomUUID(),
                    dataCadPat: toDateOrNull(row.dataCadPat),
                    dataDevPat: toDateOrNull(row.dataDevPat),
                    idPatCad: row.idPatCad ?? null,
                    idMatFunCad: row.idMatFunCad ?? null,
                    idStatusPatCad: statusMapped
                }];
            });

        if (cadByCentro.length > 0) {
            await tx.tbCadastro.createMany({ data: cadByCentro });
        }
    });

    return {
        imported: {
            tbUser: data.tbUser.length,
            tbStatusFun: data.tbStatusFun.length - ignored.filter((item) => item.table === "tbStatusFun").length,
            tbFuncao: data.tbFuncao.length - ignored.filter((item) => item.table === "tbFuncao").length,
            tbTipoPat: data.tbTipoPat.length,
            tbStatusPat: data.tbStatusPat.length - ignored.filter((item) => item.table === "tbStatusPat").length,
            tbEmpresa: data.tbEmpresa.length,
            tbCCusto: tbCCusto.length,
            tbLicenca: data.tbLicenca.length - ignored.filter((item) => item.table === "tbLicenca").length,
            tbFuncionario: tbFuncionario.length - ignored.filter((item) => item.table === "tbFuncionario").length,
            tbPatrimonio: tbPatrimonio.length - ignored.filter((item) => item.table === "tbPatrimonio").length,
            tbHasLicencaFuncionario: tbHasLicenca.length - ignored.filter((item) => item.table === "tbHasLicencaFuncionario").length,
            tbCadastro: tbCadastro.length - ignored.filter((item) => item.table === "tbCadastro").length,
            tbBmMedicao: 0,
            tbTransferenciaCustoPatrimonio: 0,
            tbTransferenciaAlocacao: 0,
            tbDevolucao: 0,
            tbAuditoriaDevolucaoPatrimonio: 0,
            tbPatrimonioHistorico: 0,
            Account: 0,
            Session: 0,
            User: 0,
            VerificationToken: 0,
            tbUnifiConfig: 0
        },
        ignored,
        detailed: withIgnoredCounts(ignored, {
            ...detailed,
            tbUser: { created: data.tbUser.length, updated: 0, ignored: 0 },
            tbStatusFun: { created: data.tbStatusFun.length, updated: 0, ignored: 0 },
            tbFuncao: { created: data.tbFuncao.length, updated: 0, ignored: 0 },
            tbTipoPat: { created: data.tbTipoPat.length, updated: 0, ignored: 0 },
            tbStatusPat: { created: data.tbStatusPat.length, updated: 0, ignored: 0 },
            tbEmpresa: { created: data.tbEmpresa.length, updated: 0, ignored: 0 },
            tbCCusto: { created: 0, updated: tbCCusto.length > 0 ? 1 : 0, ignored: 0 },
            tbLicenca: { created: data.tbLicenca.length, updated: 0, ignored: 0 },
            tbFuncionario: { created: tbFuncionario.length, updated: 0, ignored: 0 },
            tbPatrimonio: { created: tbPatrimonio.length, updated: 0, ignored: 0 },
            tbHasLicencaFuncionario: { created: tbHasLicenca.length, updated: 0, ignored: 0 },
            tbCadastro: { created: tbCadastro.length, updated: 0, ignored: 0 },
            tbBmMedicao: { created: 0, updated: 0, ignored: 0 },
            tbTransferenciaCustoPatrimonio: { created: 0, updated: 0, ignored: 0 },
            tbTransferenciaAlocacao: { created: 0, updated: 0, ignored: 0 },
            tbDevolucao: { created: 0, updated: 0, ignored: 0 },
            tbAuditoriaDevolucaoPatrimonio: { created: 0, updated: 0, ignored: 0 },
            tbPatrimonioHistorico: { created: 0, updated: 0, ignored: 0 },
            Account: { created: 0, updated: 0, ignored: 0 },
            Session: { created: 0, updated: 0, ignored: 0 },
            User: { created: 0, updated: 0, ignored: 0 },
            VerificationToken: { created: 0, updated: 0, ignored: 0 },
            tbUnifiConfig: { created: 0, updated: 0, ignored: 0 }
        })
    };
}

async function importByCentroMerge(data: BackupData, centroId: string): Promise<ImportExecutionResult> {
    const ignored: IgnoredImportRow[] = [];
    const detailed = emptyDetailedCounts();
    const tbCCusto = data.tbCCusto.filter((c: any) => c.idCCusto === centroId);
    const tbFuncionario = data.tbFuncionario.filter((f: any) => f.idCustoFun === centroId);
    const tbPatrimonio = data.tbPatrimonio.filter((p: any) => p.idPat_CustoPat === centroId);
    const tbHasLicenca = data.tbHasLicencaFuncionario;
    const tbCadastro = data.tbCadastro;

    await prisma.$transaction(async (tx: any) => {
        const statusFunMap = new Map<string, string>();
        const funçãoMap = new Map<string, string>();
        const tipoPatMap = new Map<string, string>();
        const statusPatMap = new Map<string, string>();
        const userMap = new Map<string, string>();
        const licencaMap = new Map<string, string>();
        const funcionarioMap = new Map<string, string>();
        const userSourceIndex = buildSourceIndex(data.tbUser, "id", ["emailUser", "idUser", "nomeUser"]);
        const statusFunSourceIndex = buildSourceIndex(data.tbStatusFun, "idStatusFun", ["descricaoStatusFun"]);
        const funçãoSourceIndex = buildSourceIndex(data.tbFuncao, "idFuncao", ["nomeFuncao"]);
        const tipoPatSourceIndex = buildSourceIndex(data.tbTipoPat, "idTipPat", ["descricaoTipPat"]);
        const statusPatSourceIndex = buildSourceIndex(data.tbStatusPat, "idStatusPat", ["descricaoStatPat"]);
        const licencaSourceIndex = buildSourceIndex(data.tbLicenca, "idLic", ["descricaoLic"]);
        const funcionarioSourceIndex = buildSourceIndex(data.tbFuncionario, "idF", ["idMatFun", "nomeFun"]);

        for (let index = 0; index < data.tbStatusFun.length; index += 1) {
            const row = data.tbStatusFun[index];
            if (!row?.descricaoStatusFun) {
                addIgnoredRow(ignored, "tbStatusFun", index + 1, "descricaoStatusFun ausente.");
                continue;
            }
            const existing = await tx.tbStatusFun.findFirst({ where: { descricaoStatusFun: row.descricaoStatusFun } });
            if (existing) {
                if (row.idStatusFun) statusFunMap.set(row.idStatusFun, existing.idStatusFun);
                detailed.tbStatusFun.updated += 1;
                continue;
            }
            const created = await tx.tbStatusFun.create({
                data: { idStatusFun: randomUUID(), descricaoStatusFun: row.descricaoStatusFun }
            });
            if (row.idStatusFun) statusFunMap.set(row.idStatusFun, created.idStatusFun);
            detailed.tbStatusFun.created += 1;
        }

        for (let index = 0; index < data.tbFuncao.length; index += 1) {
            const row = data.tbFuncao[index];
            if (!row?.nomeFuncao) {
                addIgnoredRow(ignored, "tbFuncao", index + 1, "nomeFuncao ausente.");
                continue;
            }
            const existing = await tx.tbFuncao.findFirst({ where: { nomeFuncao: row.nomeFuncao } });
            if (existing) {
                if (row.idFuncao) funçãoMap.set(row.idFuncao, existing.idFuncao);
                detailed.tbFuncao.updated += 1;
                continue;
            }
            const created = await tx.tbFuncao.create({
                data: { idFuncao: randomUUID(), nomeFuncao: row.nomeFuncao }
            });
            if (row.idFuncao) funçãoMap.set(row.idFuncao, created.idFuncao);
            detailed.tbFuncao.created += 1;
        }

        for (const row of data.tbTipoPat) {
            const existing = await tx.tbTipoPat.findFirst({ where: { descricaoTipPat: row.descricaoTipPat ?? null } });
            if (existing) {
                if (row.idTipPat) tipoPatMap.set(row.idTipPat, existing.idTipPat);
                detailed.tbTipoPat.updated += 1;
                continue;
            }
            const created = await tx.tbTipoPat.create({
                data: { idTipPat: randomUUID(), descricaoTipPat: row.descricaoTipPat ?? null }
            });
            if (row.idTipPat) tipoPatMap.set(row.idTipPat, created.idTipPat);
            detailed.tbTipoPat.created += 1;
        }

        for (let index = 0; index < data.tbStatusPat.length; index += 1) {
            const row = data.tbStatusPat[index];
            if (!row?.descricaoStatPat) {
                addIgnoredRow(ignored, "tbStatusPat", index + 1, "descricaoStatPat ausente.");
                continue;
            }
            const existing = await tx.tbStatusPat.findFirst({ where: { descricaoStatPat: row.descricaoStatPat } });
            if (existing) {
                if (row.idStatusPat) statusPatMap.set(row.idStatusPat, existing.idStatusPat);
                detailed.tbStatusPat.updated += 1;
                continue;
            }
            const created = await tx.tbStatusPat.create({
                data: { idStatusPat: randomUUID(), descricaoStatPat: row.descricaoStatPat }
            });
            if (row.idStatusPat) statusPatMap.set(row.idStatusPat, created.idStatusPat);
            detailed.tbStatusPat.created += 1;
        }

        for (let index = 0; index < data.tbLicenca.length; index += 1) {
            const row = data.tbLicenca[index];
            if (!row?.descricaoLic) {
                addIgnoredRow(ignored, "tbLicenca", index + 1, "descricaoLic ausente.");
                continue;
            }
            const existing = await tx.tbLicenca.findFirst({ where: { descricaoLic: row.descricaoLic } });
            if (existing) {
                if (row.idLic) licencaMap.set(row.idLic, existing.idLic);
                detailed.tbLicenca.updated += 1;
                continue;
            }
            const created = await tx.tbLicenca.create({
                data: { idLic: randomUUID(), descricaoLic: row.descricaoLic }
            });
            if (row.idLic) licencaMap.set(row.idLic, created.idLic);
            detailed.tbLicenca.created += 1;
        }

        for (const row of data.tbUser) {
            let existing = null;
            if (row.emailUser) {
                existing = await tx.tbUser.findFirst({ where: { emailUser: row.emailUser } });
            }
            if (existing) {
                if (row.id) userMap.set(row.id, existing.id);
                detailed.tbUser.updated += 1;
                continue;
            }
            const created = await tx.tbUser.create({
                data: {
                    id: randomUUID(),
                    idUser: row.idUser ?? null,
                    nomeUser: row.nomeUser ?? null,
                    emailUser: row.emailUser ?? null,
                    emailVerified: toDateOrNull(row.emailVerified),
                    senhaUser: row.senhaUser ?? null,
                    avatarUser: row.avatarUser ?? null,
                    authTypeUser: row.authTypeUser ?? null,
                    formulariosUser: parseJsonField(row.formulariosUser) ?? row.formulariosUser ?? null,
                    centrosUser: parseJsonField(row.centrosUser) ?? row.centrosUser ?? null,
                    statusUser: row.statusUser ?? "ATIVO"
                }
            });
            if (row.id) userMap.set(row.id, created.id);
            detailed.tbUser.created += 1;
        }

        if (tbCCusto.length > 0) {
            const c = tbCCusto[0];
            await tx.tbCCusto.update({
                where: { idCCusto: centroId },
                data: {
                    codigoCCusto: c.codigoCCusto ?? undefined,
                    descricaoCCusto: c.descricaoCCusto ?? undefined
                }
            });
            detailed.tbCCusto.updated += 1;
        }

        const matriculasArquivo = Array.from(
            new Set(
                tbFuncionario
                    .map((row: any) => firstString(row?.idMatFun))
                    .filter((value): value is string => Boolean(value))
            )
        );
        const matriculasEmOutrosCentros = new Set(
            (
                await tx.tbFuncionario.findMany({
                    where: {
                        idMatFun: { in: matriculasArquivo },
                        NOT: { idCustoFun: centroId }
                    },
                    select: { idMatFun: true }
                })
            ).map((row: any) => row.idMatFun)
        );

        for (let index = 0; index < tbFuncionario.length; index += 1) {
            const row = tbFuncionario[index];
            const idMatFun = firstString(row?.idMatFun);
            if (!idMatFun || !row?.nomeFun) {
                addIgnoredRow(ignored, "tbFuncionario", index + 1, "idMatFun ou nomeFun ausente.");
                continue;
            }
            if (matriculasEmOutrosCentros.has(idMatFun)) {
                addIgnoredRow(ignored, "tbFuncionario", index + 1, `idMatFun ja existe em outro centro: ${idMatFun}.`);
                continue;
            }

            const dataFuncionario = {
                idMatFun,
                nomeFun: row.nomeFun,
                cpfFun: row.cpfFun ?? null,
                dataAdmFun: toDateOrNull(row.dataAdmFun),
                dataDesFun: toDateOrNull(row.dataDesFun),
                avatarFun: row.avatarFun ?? null,
                idFuncaoFun: mapResolvedId(funçãoMap, row, "idFuncaoFun", funçãoSourceIndex, ["idFuncaoFun_descricao"]),
                idUserFun: mapResolvedId(userMap, row, "idUserFun", userSourceIndex, ["idUserFun_descricao"]),
                idStatusFun: mapResolvedId(statusFunMap, row, "idStatusFun", statusFunSourceIndex, ["idStatusFun_descricao"]),
                idCustoFun: centroId
            };

            const existing = await tx.tbFuncionario.findFirst({ where: { idMatFun, idCustoFun: centroId } });
            if (existing) {
                await tx.tbFuncionario.update({ where: { idF: existing.idF }, data: dataFuncionario });
                if (row.idF) funcionarioMap.set(row.idF, existing.idF);
                detailed.tbFuncionario.updated += 1;
            } else {
                const created = await tx.tbFuncionario.create({ data: { idF: randomUUID(), ...dataFuncionario } });
                if (row.idF) funcionarioMap.set(row.idF, created.idF);
                detailed.tbFuncionario.created += 1;
            }
        }

        for (let index = 0; index < tbPatrimonio.length; index += 1) {
            const row = tbPatrimonio[index];
            const dataEntPat = toDateOrNull(row?.dataEntPat);
            const valorPat = Number(row?.valorPat);
            if (!row?.idPat || !row?.descricaoPat) {
                addIgnoredRow(ignored, "tbPatrimonio", index + 1, "idPat ou descricaoPat ausente.");
                continue;
            }
            if (!dataEntPat) {
                addIgnoredRow(ignored, "tbPatrimonio", index + 1, "dataEntPat invalida.");
                continue;
            }
            if (!Number.isFinite(valorPat)) {
                addIgnoredRow(ignored, "tbPatrimonio", index + 1, "valorPat invalido.");
                continue;
            }

            const dataPatrimonio = {
                idPat: row.idPat,
                descricaoPat: row.descricaoPat,
                descricaoDetalhadaPat: row.descricaoDetalhadaPat ?? null,
                licencaPat: row.licencaPat ?? null,
                dataEntPat,
                dataSaiPat: toDateOrNull(row.dataSaiPat),
                notaFiscalPat: row.notaFiscalPat ?? null,
                valorPat,
                idPat_TipoPat: mapResolvedId(tipoPatMap, row, "idPat_TipoPat", tipoPatSourceIndex, ["idPat_TipoPat_descricao"]),
                idPat_StatusPat: mapResolvedId(statusPatMap, row, "idPat_StatusPat", statusPatSourceIndex, ["idPat_StatusPat_descricao"]),
                idPat_CustoPat: centroId
            };

            const existing = await tx.tbPatrimonio.findFirst({ where: { idPat: row.idPat, idPat_CustoPat: centroId } });
            if (existing) {
                await tx.tbPatrimonio.update({ where: { idP: existing.idP }, data: dataPatrimonio });
                detailed.tbPatrimonio.updated += 1;
            } else {
                await tx.tbPatrimonio.create({ data: { idP: randomUUID(), ...dataPatrimonio } });
                detailed.tbPatrimonio.created += 1;
            }
        }

        for (let index = 0; index < tbHasLicenca.length; index += 1) {
            const row = tbHasLicenca[index];
            const idFunc = mapResolvedId(funcionarioMap, row, "idFunc", funcionarioSourceIndex, ["idFunc_descricao"]);
            const idLinc = mapResolvedId(licencaMap, row, "idLinc", licencaSourceIndex, ["idLinc_descricao"]);
            const dataInicio = toDateOrNull(row?.dataInicio);
            const dataVencimetno = toDateOrNull(row?.dataVencimetno);
            if (!idFunc || !idLinc) continue;
            if (!dataInicio || !dataVencimetno) {
                addIgnoredRow(ignored, "tbHasLicencaFuncionario", index + 1, "dataInicio ou dataVencimetno invalida.");
                continue;
            }
            const existing = await tx.tbHasLicencaFuncionario.findFirst({
                where: { idFunc, idLinc, dataInicio, dataVencimetno }
            });
            if (!existing) {
                await tx.tbHasLicencaFuncionario.create({
                    data: { idHas: randomUUID(), idFunc, idLinc, dataInicio, dataVencimetno }
                });
                detailed.tbHasLicencaFuncionario.created += 1;
            } else {
                detailed.tbHasLicencaFuncionario.updated += 1;
            }
        }

        for (let index = 0; index < tbCadastro.length; index += 1) {
            const row = tbCadastro[index];
            const statusMapped = mapResolvedId(statusPatMap, row, "idStatusPatCad", statusPatSourceIndex, ["idStatusPatCad_descricao"]);
            if (!statusMapped) continue;
            const existing = await tx.tbCadastro.findFirst({
                where: {
                    idMatFunCad: row.idMatFunCad ?? null,
                    idPatCad: row.idPatCad ?? null,
                    idStatusPatCad: statusMapped,
                    dataCadPat: toDateOrNull(row.dataCadPat)
                }
            });
            if (!existing) {
                await tx.tbCadastro.create({
                    data: {
                        idCad: randomUUID(),
                        dataCadPat: toDateOrNull(row.dataCadPat),
                        dataDevPat: toDateOrNull(row.dataDevPat),
                        idPatCad: row.idPatCad ?? null,
                        idMatFunCad: row.idMatFunCad ?? null,
                        idStatusPatCad: statusMapped
                    }
                });
                detailed.tbCadastro.created += 1;
            } else {
                detailed.tbCadastro.updated += 1;
            }
        }
    });

    return {
        imported: {
            tbUser: data.tbUser.length,
            tbStatusFun: data.tbStatusFun.length - ignored.filter((item) => item.table === "tbStatusFun").length,
            tbFuncao: data.tbFuncao.length - ignored.filter((item) => item.table === "tbFuncao").length,
            tbTipoPat: data.tbTipoPat.length,
            tbStatusPat: data.tbStatusPat.length - ignored.filter((item) => item.table === "tbStatusPat").length,
            tbEmpresa: 0,
            tbCCusto: tbCCusto.length,
            tbLicenca: data.tbLicenca.length - ignored.filter((item) => item.table === "tbLicenca").length,
            tbFuncionario: tbFuncionario.length - ignored.filter((item) => item.table === "tbFuncionario").length,
            tbPatrimonio: tbPatrimonio.length - ignored.filter((item) => item.table === "tbPatrimonio").length,
            tbHasLicencaFuncionario: tbHasLicenca.length - ignored.filter((item) => item.table === "tbHasLicencaFuncionario").length,
            tbCadastro: tbCadastro.length - ignored.filter((item) => item.table === "tbCadastro").length,
            tbBmMedicao: 0,
            tbTransferenciaCustoPatrimonio: 0,
            tbTransferenciaAlocacao: 0,
            tbDevolucao: 0,
            tbAuditoriaDevolucaoPatrimonio: 0,
            tbPatrimonioHistorico: 0,
            Account: 0,
            Session: 0,
            User: 0,
            VerificationToken: 0,
            tbUnifiConfig: 0
        },
        ignored,
        detailed: withIgnoredCounts(ignored, detailed)
    };
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(AuthOptions);
        const sessionUser = (session?.user ?? undefined) as SessionUser | undefined;

        if (!session?.user) {
            return NextResponse.json(
                { message: "Usuario nao autenticado." },
                { status: 401 }
            );
        }

        if (!hasExportAccess(sessionUser)) {
            return NextResponse.json(
                { message: "Usuario sem permissao para exportar dados." },
                { status: 403 }
            );
        }

        const centroIdParam = new URL(request.url).searchParams.get("centroId");
        const centroId = await validateCentroAccess(request, centroIdParam);
        const data = enrichExportData(await buildExportData(centroId));

        return NextResponse.json({
            version: 3,
            exportedAt: new Date().toISOString(),
            scope: {
                centroId: centroId || null
            },
            data
        });
    } catch (error: any) {
        console.error("Erro ao exportar dados do sistema:", error);
        return NextResponse.json(
            { message: error?.message || "Erro ao exportar dados do sistema." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(AuthOptions);
        const sessionUser = (session?.user ?? undefined) as SessionUser | undefined;

        if (!session?.user) {
            return NextResponse.json(
                { message: "Usuario nao autenticado." },
                { status: 401 }
            );
        }

        if (!hasImportAccess(sessionUser)) {
            return NextResponse.json(
                { message: "Usuario sem permissao para importar dados." },
                { status: 403 }
            );
        }

        const payload = await request.json();
        const importMode = payload?.mode === "merge" ? "merge" : "replace" as ImportMode;
        const dataRaw = payload?.data ?? payload;
        const centroBody = payload?.scope?.centroId;
        const centroQuery = new URL(request.url).searchParams.get("centroId");
        const centroEscolhido = centroBody || centroQuery || null;
        const centroId = await validateCentroAccess(request, centroEscolhido);

        const data: BackupData = {
            tbUser: asArrayOptional(dataRaw?.tbUser),
            tbStatusFun: asArrayOptional(dataRaw?.tbStatusFun),
            tbFuncao: asArrayOptional(dataRaw?.tbFuncao),
            tbTipoPat: asArrayOptional(dataRaw?.tbTipoPat),
            tbStatusPat: asArrayOptional(dataRaw?.tbStatusPat),
            tbEmpresa: asArrayOptional(dataRaw?.tbEmpresa),
            tbCCusto: asArrayOptional(dataRaw?.tbCCusto),
            tbLicenca: asArrayOptional(dataRaw?.tbLicenca),
            tbFuncionario: asArrayOptional(dataRaw?.tbFuncionario),
            tbPatrimonio: asArrayOptional(dataRaw?.tbPatrimonio),
            tbHasLicencaFuncionario: asArrayOptional(dataRaw?.tbHasLicencaFuncionario),
            tbCadastro: asArrayOptional(dataRaw?.tbCadastro),
            tbBmMedicao: asArrayOptional(dataRaw?.tbBmMedicao),
            tbTransferenciaCustoPatrimonio: asArrayOptional(dataRaw?.tbTransferenciaCustoPatrimonio),
            tbTransferenciaAlocacao: asArrayOptional(dataRaw?.tbTransferenciaAlocacao),
            tbDevolucao: asArrayOptional(dataRaw?.tbDevolucao),
            tbAuditoriaDevolucaoPatrimonio: asArrayOptional(dataRaw?.tbAuditoriaDevolucaoPatrimonio),
            tbPatrimonioHistorico: asArrayOptional(dataRaw?.tbPatrimonioHistorico),
            Account: asArrayOptional(dataRaw?.Account),
            Session: asArrayOptional(dataRaw?.Session),
            User: asArrayOptional(dataRaw?.User),
            VerificationToken: asArrayOptional(dataRaw?.VerificationToken),
            tbUnifiConfig: asArrayOptional(dataRaw?.tbUnifiConfig)
        };

        if (importMode === "merge" && !centroId) {
            return NextResponse.json(
                { message: "Modo merge requer filtro por centro de custo para evitar conflitos globais." },
                { status: 400 }
            );
        }

        const importResult = importMode === "merge"
            ? await importByCentroMerge(data, centroId as string)
            : (centroId ? await importByCentro(data, centroId) : await importAllData(data));

        const ignoredCount = importResult.ignored.length;

        return NextResponse.json({
            message: importMode === "merge"
                ? `Importacao parcial (merge) concluida sem sobrescrever em lote.${ignoredCount > 0 ? ` ${ignoredCount} linha(s) inconsistente(s) foram ignoradas.` : ""}`
                : (centroId
                    ? `Importacao por centro de custo concluida com UUIDs novos.${ignoredCount > 0 ? ` ${ignoredCount} linha(s) inconsistente(s) foram ignoradas.` : ""}`
                    : `Importacao completa concluida com UUIDs novos.${ignoredCount > 0 ? ` ${ignoredCount} linha(s) inconsistente(s) foram ignoradas.` : ""}`),
            scope: {
                centroId: centroId || null
            },
            mode: importMode,
            imported: importResult.imported,
            ignored: importResult.ignored,
            detailed: importResult.detailed
        });
    } catch (error: any) {
        console.error("Erro ao importar dados do sistema:", error);
        return NextResponse.json(
            { message: error?.message || "Erro ao importar dados do sistema." },
            { status: 500 }
        );
    }
}


