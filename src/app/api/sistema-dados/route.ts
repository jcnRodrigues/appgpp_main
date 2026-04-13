import prisma from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { AuthOptions } from "../auth/[...nextauth]/route";
import { getCentrosFiltro } from "@/lib/access";

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
};

function emptyImportedCounts(): Record<ImportTableName, number> {
    return {
        tbUser: 0,
        tbStatusFun: 0,
        tbFuncao: 0,
        tbTipoPat: 0,
        tbStatusPat: 0,
        tbEmpresa: 0,
        tbCCusto: 0,
        tbLicenca: 0,
        tbFuncionario: 0,
        tbPatrimonio: 0,
        tbHasLicencaFuncionario: 0,
        tbCadastro: 0
    };
}

function addIgnoredRow(
    ignored: IgnoredImportRow[],
    table: ImportTableName,
    row: number,
    motivo: string
) {
    ignored.push({ table, row, motivo });
}

function hasImportExportAccess(sessionUser?: SessionUser) {
    const formularios = sessionUser?.formularios;
    if (!Array.isArray(formularios) || formularios.length === 0) {
        return true;
    }

    return (
        formularios.includes("IMPORTACAO_EXPORTACAO") ||
        formularios.includes("ACESSO_USUARIOS")
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

function asArray<T = Record<string, any>>(value: unknown, key: string): T[] {
    if (!Array.isArray(value)) {
        throw new Error(`Formato invalido no campo "${key}". Esperado array.`);
    }
    return value as T[];
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
    const funcaoById = new Map(data.tbFuncao.map((row: any) => [row.idFuncao, row.nomeFuncao ?? null]));
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
            idFuncaoFun_descricao: row.idFuncaoFun ? funcaoById.get(row.idFuncaoFun) ?? null : null,
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
            tbCadastro
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
            prisma.tbCadastro.findMany()
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
            tbCadastro
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
        tbCadastro
    };
}

async function importAllData(data: BackupData): Promise<ImportExecutionResult> {
    const ignored: IgnoredImportRow[] = [];
    const userIdMap = new Map<string, string>();
    const statusFunMap = new Map<string, string>();
    const funcaoMap = new Map<string, string>();
    const tipoPatMap = new Map<string, string>();
    const statusPatMap = new Map<string, string>();
    const empresaMap = new Map<string, string>();
    const ccustoMap = new Map<string, string>();
    const licencaMap = new Map<string, string>();
    const funcionarioMap = new Map<string, string>();
    const userSourceIndex = buildSourceIndex(data.tbUser, "id", ["emailUser", "idUser", "nomeUser"]);
    const statusFunSourceIndex = buildSourceIndex(data.tbStatusFun, "idStatusFun", ["descricaoStatusFun"]);
    const funcaoSourceIndex = buildSourceIndex(data.tbFuncao, "idFuncao", ["nomeFuncao"]);
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
        if (item.idFuncao) funcaoMap.set(item.idFuncao, id);
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
            idFuncaoFun: mapResolvedId(funcaoMap, item, "idFuncaoFun", funcaoSourceIndex, ["idFuncaoFun_descricao"]),
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
        return [{
            idP: randomUUID(),
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
        return [{
            idCad: randomUUID(),
            dataCadPat: toDateOrNull(item.dataCadPat),
            dataDevPat: toDateOrNull(item.dataDevPat),
            idPatCad: item.idPatCad ?? null,
            idMatFunCad: item.idMatFunCad ?? null,
            idStatusPatCad: statusMapped
        }];
    });

    await prisma.$transaction(async (tx: any) => {
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
            tbCadastro: tbCadastroPrepared.length
        },
        ignored
    };
}

async function importByCentro(data: BackupData, centroId: string): Promise<ImportExecutionResult> {
    const ignored: IgnoredImportRow[] = [];
    const tbCCusto = data.tbCCusto.filter((c: any) => c.idCCusto === centroId);
    const tbFuncionario = data.tbFuncionario.filter((f: any) => f.idCustoFun === centroId);
    const tbPatrimonio = data.tbPatrimonio.filter((p: any) => p.idPat_CustoPat === centroId);
    const tbHasLicenca = data.tbHasLicencaFuncionario;
    const tbCadastro = data.tbCadastro;

    await prisma.$transaction(async (tx: any) => {
        const statusFunMap = new Map<string, string>();
        const funcaoMap = new Map<string, string>();
        const tipoPatMap = new Map<string, string>();
        const statusPatMap = new Map<string, string>();
        const userMap = new Map<string, string>();
        const licencaMap = new Map<string, string>();
        const funcionarioMap = new Map<string, string>();
        const userSourceIndex = buildSourceIndex(data.tbUser, "id", ["emailUser", "idUser", "nomeUser"]);
        const statusFunSourceIndex = buildSourceIndex(data.tbStatusFun, "idStatusFun", ["descricaoStatusFun"]);
        const funcaoSourceIndex = buildSourceIndex(data.tbFuncao, "idFuncao", ["nomeFuncao"]);
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
                if (row.idFuncao) funcaoMap.set(row.idFuncao, existing.idFuncao);
                continue;
            }
            const created = await tx.tbFuncao.create({
                data: { idFuncao: randomUUID(), nomeFuncao: row.nomeFuncao }
            });
            if (row.idFuncao) funcaoMap.set(row.idFuncao, created.idFuncao);
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
                    idFuncaoFun: mapResolvedId(funcaoMap, row, "idFuncaoFun", funcaoSourceIndex, ["idFuncaoFun_descricao"]),
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
            tbCadastro: tbCadastro.length - ignored.filter((item) => item.table === "tbCadastro").length
        },
        ignored
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

        if (!hasImportExportAccess(sessionUser)) {
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

        if (!hasImportExportAccess(sessionUser)) {
            return NextResponse.json(
                { message: "Usuario sem permissao para importar dados." },
                { status: 403 }
            );
        }

        const payload = await request.json();
        const dataRaw = payload?.data ?? payload;
        const centroBody = payload?.scope?.centroId;
        const centroQuery = new URL(request.url).searchParams.get("centroId");
        const centroEscolhido = centroBody || centroQuery || null;
        const centroId = await validateCentroAccess(request, centroEscolhido);

        const data: BackupData = {
            tbUser: asArray(dataRaw?.tbUser, "tbUser"),
            tbStatusFun: asArray(dataRaw?.tbStatusFun, "tbStatusFun"),
            tbFuncao: asArray(dataRaw?.tbFuncao, "tbFuncao"),
            tbTipoPat: asArray(dataRaw?.tbTipoPat, "tbTipoPat"),
            tbStatusPat: asArray(dataRaw?.tbStatusPat, "tbStatusPat"),
            tbEmpresa: asArray(dataRaw?.tbEmpresa, "tbEmpresa"),
            tbCCusto: asArray(dataRaw?.tbCCusto, "tbCCusto"),
            tbLicenca: asArray(dataRaw?.tbLicenca, "tbLicenca"),
            tbFuncionario: asArray(dataRaw?.tbFuncionario, "tbFuncionario"),
            tbPatrimonio: asArray(dataRaw?.tbPatrimonio, "tbPatrimonio"),
            tbHasLicencaFuncionario: asArray(dataRaw?.tbHasLicencaFuncionario, "tbHasLicencaFuncionario"),
            tbCadastro: asArray(dataRaw?.tbCadastro, "tbCadastro")
        };

        const importResult = centroId
            ? await importByCentro(data, centroId)
            : await importAllData(data);

        const ignoredCount = importResult.ignored.length;

        return NextResponse.json({
            message: centroId
                ? `Importacao por centro de custo concluida com UUIDs novos.${ignoredCount > 0 ? ` ${ignoredCount} linha(s) inconsistente(s) foram ignoradas.` : ""}`
                : `Importacao completa concluida com UUIDs novos.${ignoredCount > 0 ? ` ${ignoredCount} linha(s) inconsistente(s) foram ignoradas.` : ""}`,
            scope: {
                centroId: centroId || null
            },
            imported: importResult.imported,
            ignored: importResult.ignored
        });
    } catch (error: any) {
        console.error("Erro ao importar dados do sistema:", error);
        return NextResponse.json(
            { message: error?.message || "Erro ao importar dados do sistema." },
            { status: 500 }
        );
    }
}
