"use client";

import Header from "@/back-end/components/Header/Header";
import Link from "next/link";
import { ChevronLeft, Download, FileJson, FileSpreadsheet, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/back-end/components/ui/button";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import { hasModuleAccess } from "@/lib/permissions";

const TABLE_NAMES = [
    "tbUser",
    "tbStatusFun",
    "tbFuncao",
    "tbTipoPat",
    "tbStatusPat",
    "tbEmpresa",
    "tbCCusto",
    "tbLicenca",
    "tbFuncionario",
    "tbPatrimonio",
    "tbHasLicencaFuncionario",
    "tbCadastro",
    "tbBmMedicao",
    "tbTransferenciaCustoPatrimonio",
    "tbTransferenciaAlocacao",
    "tbDevolucao",
    "tbAuditoriaDevolucaoPatrimonio",
    "tbPatrimonioHistorico",
    "Account",
    "Session",
    "User",
    "VerificationToken",
    "tbUnifiConfig"
] as const;

const TABLE_HEADERS: Record<(typeof TABLE_NAMES)[number], string[]> = {
    tbUser: ["id", "idUser", "nomeUser", "emailUser", "emailVerified", "senhaUser", "avatarUser", "authTypeUser", "formulariosUser", "centrosUser", "statusUser"],
    tbStatusFun: ["idStatusFun", "descricaoStatusFun"],
    tbFuncao: ["idFuncao", "nomeFuncao"],
    tbTipoPat: ["idTipPat", "descricaoTipPat"],
    tbStatusPat: ["idStatusPat", "descricaoStatPat"],
    tbEmpresa: ["idEmp", "razaoEmpresa", "fantasiaEmpresa", "cnpjEmpresa", "idCustEmp"],
    tbCCusto: ["idCCusto", "codigoCCusto", "descricaoCCusto", "idEmp_Custo", "idEmp_Custo_descricao"],
    tbLicenca: ["idLic", "descricaoLic"],
    tbFuncionario: ["idF", "idMatFun", "nomeFun", "cpfFun", "dataAdmFun", "dataDesFun", "avatarFun", "idFuncaoFun", "idUserFun", "idStatusFun", "idCustoFun", "idFuncaoFun_descricao", "idUserFun_descricao", "idStatusFun_descricao", "idCustoFun_descricao"],
    tbPatrimonio: ["idP", "idPat", "descricaoPat", "descricaoDetalhadaPat", "licencaPat", "dataEntPat", "dataSaiPat", "notaFiscalPat", "valorPat", "idPat_TipoPat", "idPat_StatusPat", "idPat_CustoPat", "idPat_TipoPat_descricao", "idPat_StatusPat_descricao", "idPat_CustoPat_descricao"],
    tbHasLicencaFuncionario: ["idHas", "idFunc", "idLinc", "dataInicio", "dataVencimetno", "idFunc_descricao", "idLinc_descricao"],
    tbCadastro: ["idCad", "dataCadPat", "dataDevPat", "idPatCad", "idMatFunCad", "idStatusPatCad", "idStatusPatCad_descricao", "idPatCad_descricao", "idMatFunCad_descricao"],
    tbBmMedicao: ["idBm", "codigoBm", "idCCusto", "codigoCCusto", "descricaoCCusto", "mesBm", "anoBm", "contadorBm", "statusBm", "dataInicioMedicao", "dataFimMedicao", "resumoJson", "resultadosJson", "naoInformadosJson", "gerouRelatorioExcel", "gerouRelatorioPdf", "idUserGeracao", "fechadoAt", "createdAt", "updatedAt"],
    tbTransferenciaCustoPatrimonio: ["idTransferencia", "idPatrimonio", "idCustoOrigem", "idCustoDestino", "valorTransferido", "observacao", "idUserTransferencia", "dataTransferencia", "createdAt"],
    tbTransferenciaAlocacao: ["idTransferenciaAlocacao", "idCadastro", "idPatrimonio", "idMatriculaFuncionario", "idMatriculaFuncionarioDestino", "statusAnterior", "statusNovo", "observacao", "idUserTransferencia", "dataTransferencia", "createdAt"],
    tbDevolucao: ["idDevolucao", "idPatrimonio", "idCadastro", "dataInicioDevolucao", "dataFimDevolucao", "dataSaidaFornecedor", "dataChegadaFornecedor", "motivoDevolucao", "notaFiscalDevolucao", "createdAt", "updatedAt"],
    tbAuditoriaDevolucaoPatrimonio: ["idAuditoria", "idPatrimonioRef", "idPat", "statusAnterior", "statusNovo", "limpezaSolicitada", "registrosRemovidos", "idUserAcao", "emailUserAcao", "observacao", "detalhesJson", "createdAt"],
    tbPatrimonioHistorico: ["idHistorico", "idPatrimonioOriginal", "idPat", "descricaoPat", "valorPat", "dataEntPat", "dataSaiPat", "notaFiscalPat", "idPat_TipoPat", "idPat_StatusPat", "idPat_CustoPat", "dataDevolucao", "motivoDevolucao", "notaFiscalDevolucao", "createdAt"],
    Account: ["idAccont", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "sesseion_state"],
    Session: ["id", "sessionToken", "userId", "expires"],
    User: ["id", "name", "email", "emailVerified", "image"],
    VerificationToken: ["identifier", "token", "expires"],
    tbUnifiConfig: ["id", "type", "apiKey", "host", "username", "password", "isActive", "createdAt", "updatedAt"]
};

const EXCEL_CELL_MAX_LENGTH = 32767;

type BackupPayload = {
    version?: number;
    exportedAt?: string;
    scope?: {
        centroId?: string | null;
    };
    data?: Record<string, any[]>;
};

type CentroCustoOption = {
    idCCusto: string;
    descricaoCCusto?: string | null;
    codigoCCusto?: string | null;
};

type TotaisPorTabela = Record<(typeof TABLE_NAMES)[number], number>;

type ResumoOperacao = {
    tipo: "IMPORTACAO" | "EXPORTACAO";
    formato: "JSON" | "EXCEL";
    totalRegistros: number;
    totaisPorTabela: TotaisPorTabela;
    inconsistencias: string[];
    horario: string;
    centroId: string | null;
    detalhado?: Partial<Record<(typeof TABLE_NAMES)[number], { created: number; updated: number; ignored: number }>>;
};

type ImportResult = {
    message?: string;
    mode?: "replace" | "merge";
    scope?: {
        centroId?: string | null;
    };
    imported?: Partial<TotaisPorTabela>;
    detailed?: Partial<Record<(typeof TABLE_NAMES)[number], { created: number; updated: number; ignored: number }>>;
    ignored?: Array<{
        table: (typeof TABLE_NAMES)[number];
        row: number;
        motivo: string;
    }>;
};

function notify(tipo: "erro" | "sucesso", mensagem: string) {
    if (typeof window !== "undefined" && typeof window.systemAlert === "function") {
        window.systemAlert?.(tipo, mensagem);
        return;
    }
    window.alert(mensagem);
}

export default function SistemaDadosPage() {
    const { data: session, status } = useSession();
    const [exportando, setExportando] = useState(false);
    const [importando, setImportando] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [modoImportacao, setModoImportacao] = useState<"replace" | "merge">("merge");
    const [centros, setCentros] = useState<CentroCustoOption[]>([]);
    const [centroSelecionado, setCentroSelecionado] = useState("");
    const [resumoOperacao, setResumoOperacao] = useState<ResumoOperacao | null>(null);
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canAccessImportExport =
        hasModuleAccess(formularios, "IMPORTACAO_EXPORTACAO") ||
        hasModuleAccess(formularios, "ACESSO_USUARIOS");

    useEffect(() => {
        const carregarCentros = async () => {
            try {
                const response = await fetch("/api/ccusto?take=500&forAcessoUsuario=1");
                if (!response.ok) return;
                const payload = await response.json();
                setCentros(Array.isArray(payload?.data) ? payload.data : []);
            } catch {
                setCentros([]);
            }
        };

        carregarCentros();
    }, []);

    const centrosOrdenados = useMemo(() => {
        return [...centros].sort((a, b) => {
            const descricaoA = (a.descricaoCCusto || "").trim();
            const descricaoB = (b.descricaoCCusto || "").trim();
            const byDescricao = descricaoA.localeCompare(descricaoB, "pt-BR", { sensitivity: "base" });
            if (byDescricao !== 0) return byDescricao;

            const codigoA = (a.codigoCCusto || "").trim();
            const codigoB = (b.codigoCCusto || "").trim();
            return codigoA.localeCompare(codigoB, "pt-BR", { sensitivity: "base" });
        });
    }, [centros]);

    const centroLabel = useMemo(() => {
        const centro = centros.find((c) => c.idCCusto === centroSelecionado);
        if (!centro) return "todos-centros";
        const descricao = (centro.descricaoCCusto || "centro").toLowerCase().replace(/\s+/g, "-");
        return descricao.replace(/[^a-z0-9-]/g, "");
    }, [centroSelecionado, centros]);

    const buscarDados = async (): Promise<BackupPayload> => {
        const params = new URLSearchParams();
        if (centroSelecionado) params.set("centroId", centroSelecionado);
        const response = await fetch(`/api/sistema-dados?${params.toString()}`, { method: "GET" });
        const payload = await response.json();
        if (!response.ok) {
            throw new Error(payload?.message || "Nao foi possivel exportar os dados.");
        }
        return payload;
    };

    const baixarArquivo = (blob: Blob, nomeArquivo: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const baixarModeloImportacao = () => {
        const modelo: BackupPayload = {
            version: 3,
            exportedAt: new Date().toISOString(),
            scope: {
                centroId: centroSelecionado || null
            },
            data: TABLE_NAMES.reduce((acc, tableName) => {
                acc[tableName] = [];
                return acc;
            }, {} as Record<string, any[]>)
        };

        const dataHoje = new Date().toISOString().slice(0, 10);
        const blob = new Blob([JSON.stringify(modelo, null, 2)], {
            type: "application/json;charset=utf-8"
        });
        baixarArquivo(blob, `appgpp-modelo-importacao-${centroLabel}-${dataHoje}.json`);
        notify("sucesso", "Modelo de importacao gerado com sucesso.");
    };

    const baixarModeloImportacaoExcel = () => {
        const workbook = XLSX.utils.book_new();
        const resumoSheet = XLSX.utils.json_to_sheet([
            {
                version: 3,
                exportedAt: new Date().toISOString(),
                source: "APPGPP",
                centroId: centroSelecionado || null
            }
        ]);
        XLSX.utils.book_append_sheet(workbook, resumoSheet, "resumo");

        for (const tableName of TABLE_NAMES) {
            const header = TABLE_HEADERS[tableName] || [];
            const emptyRow = Object.fromEntries(header.map((column) => [column, ""]));
            const sheet = XLSX.utils.json_to_sheet([emptyRow], {
                header
            });
            XLSX.utils.book_append_sheet(workbook, sheet, tableName.slice(0, 31));
        }

        const excelArray = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const dataHoje = new Date().toISOString().slice(0, 10);
        baixarArquivo(blob, `appgpp-modelo-importacao-${centroLabel}-${dataHoje}.xlsx`);
        notify("sucesso", "Modelo Excel de importacao gerado com sucesso.");
    };

    const normalizeExcelValue = (value: unknown) => {
        if (value instanceof Date) return value.toISOString();
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
            const text = JSON.stringify(value);
            if (text.length > EXCEL_CELL_MAX_LENGTH) {
                return `${text.slice(0, EXCEL_CELL_MAX_LENGTH - 26)}...[TRUNCADO_NO_EXCEL]`;
            }
            return text;
        }
        if (typeof value === "string" && value.length > EXCEL_CELL_MAX_LENGTH) {
            return `${value.slice(0, EXCEL_CELL_MAX_LENGTH - 26)}...[TRUNCADO_NO_EXCEL]`;
        }
        return value;
    };

    const criarTotaisVazios = (): TotaisPorTabela =>
        TABLE_NAMES.reduce((acc, nomeTabela) => {
            acc[nomeTabela] = 0;
            return acc;
        }, {} as TotaisPorTabela);

    const calcularTotaisPorTabela = (payload?: BackupPayload): TotaisPorTabela => {
        const totais = criarTotaisVazios();
        for (const nomeTabela of TABLE_NAMES) {
            const valor = payload?.data?.[nomeTabela];
            totais[nomeTabela] = Array.isArray(valor) ? valor.length : 0;
        }
        return totais;
    };

    const calcularInconsistencias = (payload?: BackupPayload, centroComparacao?: string) => {
        const inconsistencias: string[] = [];

        if (!payload || !payload.data) {
            inconsistencias.push("Arquivo sem estrutura de dados valida (campo data ausente).");
            return inconsistencias;
        }

        for (const nomeTabela of TABLE_NAMES) {
            if (!Array.isArray(payload.data[nomeTabela])) {
                inconsistencias.push(`Tabela ${nomeTabela} ausente ou fora do formato esperado.`);
            }
        }

        if (!payload.exportedAt) {
            inconsistencias.push("Campo de data de exportacao (exportedAt) ausente no arquivo.");
        }

        if (typeof payload.version !== "number" || Number.isNaN(payload.version)) {
            inconsistencias.push("Versao do backup ausente ou invalida.");
        }

        const centroArquivo = payload.scope?.centroId || null;
        if (centroComparacao && centroArquivo && centroComparacao !== centroArquivo) {
            inconsistencias.push(
                "Centro de custo do arquivo diferente do centro selecionado na tela. O filtro da tela sera priorizado."
            );
        }

        return inconsistencias;
    };

    const totalizar = (totaisPorTabela: TotaisPorTabela) =>
        Object.values(totaisPorTabela).reduce((acc, valor) => acc + valor, 0);

    const exportarJson = async () => {
        try {
            setExportando(true);
            const payload = await buscarDados();
            const totaisPorTabela = calcularTotaisPorTabela(payload);
            const inconsistencias = calcularInconsistencias(payload, centroSelecionado || undefined);

            const blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: "application/json;charset=utf-8"
            });

            const dataHoje = new Date().toISOString().slice(0, 10);
            baixarArquivo(blob, `appgpp-backup-${centroLabel}-${dataHoje}.json`);
            setResumoOperacao({
                tipo: "EXPORTACAO",
                formato: "JSON",
                totalRegistros: totalizar(totaisPorTabela),
                totaisPorTabela,
                inconsistencias,
                horario: new Date().toISOString(),
                centroId: payload?.scope?.centroId || centroSelecionado || null
            });

            notify("sucesso", "Exportacao JSON concluida com sucesso.");
        } catch (error: any) {
            notify("erro", error?.message || "Erro ao exportar dados.");
        } finally {
            setExportando(false);
        }
    };

    const exportarExcel = async () => {
        try {
            setExportando(true);
            const payload = await buscarDados();
            const dataHoje = new Date().toISOString().slice(0, 10);
            const totaisPorTabela = calcularTotaisPorTabela(payload);
            const inconsistencias = calcularInconsistencias(payload, centroSelecionado || undefined);

            const workbook = XLSX.utils.book_new();
            const resumoSheet = XLSX.utils.json_to_sheet([
                {
                    version: payload?.version ?? 1,
                    exportedAt: payload?.exportedAt ?? new Date().toISOString(),
                    source: "APPGPP",
                    centroId: payload?.scope?.centroId ?? null
                }
            ]);
            XLSX.utils.book_append_sheet(workbook, resumoSheet, "resumo");

            for (const tableName of TABLE_NAMES) {
                const rows = (payload?.data?.[tableName] || []).map((row) =>
                    Object.fromEntries(
                        Object.entries(row || {}).map(([key, value]) => [key, normalizeExcelValue(value)])
                    )
                );
                const sheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, sheet, tableName.slice(0, 31));
            }

            const excelArray = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelArray], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            baixarArquivo(blob, `appgpp-backup-${centroLabel}-${dataHoje}.xlsx`);
            setResumoOperacao({
                tipo: "EXPORTACAO",
                formato: "EXCEL",
                totalRegistros: totalizar(totaisPorTabela),
                totaisPorTabela,
                inconsistencias,
                horario: new Date().toISOString(),
                centroId: payload?.scope?.centroId || centroSelecionado || null
            });
            notify("sucesso", "Exportacao Excel concluida com sucesso.");
        } catch (error: any) {
            notify("erro", error?.message || "Erro ao exportar Excel.");
        } finally {
            setExportando(false);
        }
    };

    const parseArquivo = async (file: File): Promise<BackupPayload> => {
        const nome = file.name.toLowerCase();
        const isExcel = nome.endsWith(".xlsx") || nome.endsWith(".xls");

        if (!isExcel) {
            const texto = await file.text();
            return JSON.parse(texto);
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
        const data: Record<string, any[]> = {};

        for (const tableName of TABLE_NAMES) {
            const sheet = workbook.Sheets[tableName];
            data[tableName] = sheet
                ? XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false })
                : [];
        }

        const resumo = workbook.Sheets.resumo
            ? XLSX.utils.sheet_to_json(workbook.Sheets.resumo, { defval: null, raw: false })[0] as any
            : null;

        return {
            version: Number(resumo?.version || 1),
            exportedAt: typeof resumo?.exportedAt === "string" ? resumo.exportedAt : undefined,
            scope: {
                centroId: typeof resumo?.centroId === "string" ? resumo.centroId : null
            },
            data
        };
    };

    const importarDados = async () => {
        if (!arquivo) {
            notify("erro", "Selecione um arquivo JSON ou Excel para importar.");
            return;
        }

        const confirmar = window.confirm(
            modoImportacao === "merge"
                ? "Importacao parcial (merge): registros existentes serao atualizados por chave e novos serao inseridos, sem limpeza em lote. Deseja continuar?"
                : centroSelecionado
                    ? "A importacao por Centro de Custo substitui os dados existentes desse centro. Deseja continuar?"
                    : "A importacao completa substitui todos os dados atuais do sistema. Deseja continuar?"
        );
        if (!confirmar) return;

        try {
            setImportando(true);
            const arquivoParseado = await parseArquivo(arquivo);
            const backup: BackupPayload = {
                ...arquivoParseado,
                scope: {
                    centroId: centroSelecionado || arquivoParseado?.scope?.centroId || null
                }
            };

            const response = await fetch("/api/sistema-dados", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...backup,
                    mode: modoImportacao
                })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result?.message || "Nao foi possivel importar os dados.");
            }

            const totaisArquivo = calcularTotaisPorTabela(backup);
            const totaisImportados = criarTotaisVazios();
            for (const nomeTabela of TABLE_NAMES) {
                const valorImportado = (result as ImportResult)?.imported?.[nomeTabela];
                totaisImportados[nomeTabela] = typeof valorImportado === "number" ? valorImportado : totaisArquivo[nomeTabela];
            }

            const inconsistencias = calcularInconsistencias(backup, centroSelecionado || undefined);
            const ignoredRows = Array.isArray((result as ImportResult)?.ignored)
                ? (result as ImportResult).ignored!
                : [];
            for (const nomeTabela of TABLE_NAMES) {
                const esperado = totaisArquivo[nomeTabela];
                const importado = totaisImportados[nomeTabela];
                if (esperado !== importado) {
                    inconsistencias.push(
                        `Tabela ${nomeTabela}: arquivo com ${esperado} registro(s), retorno de importacao com ${importado}.`
                    );
                }
            }
            for (const ignored of ignoredRows) {
                inconsistencias.push(
                    `Linha ${ignored.row} em ${ignored.table} ignorada: ${ignored.motivo}`
                );
            }

            setResumoOperacao({
                tipo: "IMPORTACAO",
                formato: arquivo.name.toLowerCase().endsWith(".json") ? "JSON" : "EXCEL",
                totalRegistros: totalizar(totaisImportados),
                totaisPorTabela: totaisImportados,
                inconsistencias,
                horario: new Date().toISOString(),
                centroId: (result as ImportResult)?.scope?.centroId || centroSelecionado || backup.scope?.centroId || null,
                detalhado: (result as ImportResult)?.detailed
            });

            notify("sucesso", "Importacao concluida com sucesso.");
            setArquivo(null);
        } catch (error: any) {
            notify("erro", error?.message || "Erro ao importar dados.");
        } finally {
            setImportando(false);
        }
    };

    if (status === "authenticated" && !canAccessImportExport) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Importacao e Exportacao de Dados</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Seu perfil nao possui permissao para este modulo.</p>
                        <Button asChild>
                            <Link href="/acesso-negado">Voltar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />

            <div className="max-w-[86.4rem] mx-auto px-4">
                <div className="form-title-sticky flex items-center gap-4 mb-8 mt-4">
                    <Link href="/">
                        <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                    </Link>
                    <div>
                        <h1 className="text-h2 font-bold">Importacao e Exportacao de Dados</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Exporte um backup em JSON ou importe dados para restaurar o sistema.
                        </p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 mb-5">
                    <label className="block text-sm font-medium mb-2">Filtro por Centro de Custo</label>
                    <select
                        value={centroSelecionado}
                        onChange={(e) => setCentroSelecionado(e.target.value)}
                        className="w-full md:w-[420px] px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Todos os centros de custo</option>
                        {centrosOrdenados.map((centro) => (
                            <option key={centro.idCCusto} value={centro.idCCusto}>
                                {(centro.codigoCCusto ? `${centro.codigoCCusto} - ` : "") +
                                    (centro.descricaoCCusto || "Sem descricao")}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                        Com um centro selecionado, a exportacao e a importacao sao feitas apenas para esse centro.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Download className="h-5 w-5 text-accent" />
                            <h2 className="text-h3 font-semibold">Exportar dados</h2>
                        </div>
                        <p className="text-body2 mb-6">
                            Gere um backup em JSON ou Excel com os dados principais do sistema.
                        </p>
                        <Button onClick={exportarJson} disabled={exportando} className="w-full mb-3">
                            <FileJson className="h-4 w-4 mr-2" />
                            {exportando ? "Exportando..." : "Baixar backup JSON"}
                        </Button>
                        <Button onClick={exportarExcel} disabled={exportando} className="w-full" variant="outline">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            {exportando ? "Exportando..." : "Baixar backup Excel (.xlsx)"}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-3">
                            Observacao: no arquivo Excel, campos de texto muito longos podem ser truncados por limite tecnico de celula.
                            O backup JSON continua com os dados completos.
                        </p>
                    </section>

                    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Upload className="h-5 w-5 text-accent" />
                            <h2 className="text-h3 font-semibold">Importar dados</h2>
                        </div>
                        <p className="text-body2 mb-3">
                            Selecione um arquivo `.json` ou `.xlsx` exportado pelo sistema.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={baixarModeloImportacao}
                            className="w-full mb-3"
                        >
                            <FileJson className="h-4 w-4 mr-2" />
                            Baixar modelo de importacao (.json)
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={baixarModeloImportacaoExcel}
                            className="w-full mb-3"
                        >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Baixar modelo de importacao (.xlsx)
                        </Button>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Modo de importacao</label>
                            <select
                                value={modoImportacao}
                                onChange={(e) => setModoImportacao(e.target.value as "replace" | "merge")}
                                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="merge">Parcial (merge, sem sobrescrever em lote)</option>
                                <option value="replace">Substituir (com sobrescrita)</option>
                            </select>
                        </div>
                        <label
                            htmlFor="arquivo-importacao"
                            className="flex items-center gap-2 border border-dashed border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-secondary/40 mb-4"
                        >
                            {arquivo?.name.toLowerCase().endsWith(".xlsx") ? (
                                <FileSpreadsheet className="h-4 w-4" />
                            ) : (
                                <FileJson className="h-4 w-4" />
                            )}
                            <span>{arquivo ? arquivo.name : "Escolher arquivo .json ou .xlsx"}</span>
                        </label>
                        <input
                            id="arquivo-importacao"
                            type="file"
                            accept=".json,.xlsx,.xls,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                            className="hidden"
                            onChange={(event) => setArquivo(event.target.files?.[0] || null)}
                        />

                        <Button
                            onClick={importarDados}
                            disabled={importando || !arquivo}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            {importando ? "Importando..." : "Importar backup"}
                        </Button>
                    </section>
                </div>

                <div className="mt-6 rounded-xl border border-amber-500/45 bg-amber-50/80 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                    No modo parcial (merge), use filtro por Centro de Custo para atualizar/inserir sem limpeza em lote.
                    No modo substituir (replace), os dados podem ser sobrescritos conforme o escopo escolhido.
                </div>

                {resumoOperacao && (
                    <div className="mt-6 bg-card border border-border rounded-xl p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <h3 className="text-sm font-semibold">
                                Resumo de inconsistencias - {resumoOperacao.tipo.toLowerCase()} ({resumoOperacao.formato})
                            </h3>
                            <span className="text-xs text-muted-foreground">
                                {new Date(resumoOperacao.horario).toLocaleString("pt-BR")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Total de registros</p>
                                <p className="text-lg font-semibold">{resumoOperacao.totalRegistros}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Inconsistencias</p>
                                <p className={`text-lg font-semibold ${resumoOperacao.inconsistencias.length > 0 ? "text-red-600" : "text-green-600"}`}>
                                    {resumoOperacao.inconsistencias.length}
                                </p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Escopo</p>
                                <p className="text-sm font-semibold">
                                    {resumoOperacao.centroId ? `Centro ${resumoOperacao.centroId}` : "Sistema completo"}
                                </p>
                            </div>
                        </div>

                        {resumoOperacao.inconsistencias.length > 0 && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 mb-3">
                                <p className="text-sm font-medium text-red-700 mb-1">Inconsistencias detectadas</p>
                                <ul className="text-xs text-red-700 list-disc pl-4">
                                    {resumoOperacao.inconsistencias.map((inconsistencia, index) => (
                                        <li key={`${inconsistencia}-${index}`}>{inconsistencia}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-full">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="text-left px-3 py-2">Tabela</th>
                                        <th className="text-right px-3 py-2">Registros</th>
                                        {resumoOperacao.tipo === "IMPORTACAO" && (
                                            <>
                                                <th className="text-right px-3 py-2">Criados</th>
                                                <th className="text-right px-3 py-2">Atualizados</th>
                                                <th className="text-right px-3 py-2">Ignorados</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TABLE_NAMES.map((nomeTabela) => (
                                        <tr key={nomeTabela} className="border-t">
                                            <td className="px-3 py-2">{nomeTabela}</td>
                                            <td className="px-3 py-2 text-right">{resumoOperacao.totaisPorTabela[nomeTabela]}</td>
                                            {resumoOperacao.tipo === "IMPORTACAO" && (
                                                <>
                                                    <td className="px-3 py-2 text-right">{resumoOperacao.detalhado?.[nomeTabela]?.created ?? 0}</td>
                                                    <td className="px-3 py-2 text-right">{resumoOperacao.detalhado?.[nomeTabela]?.updated ?? 0}</td>
                                                    <td className="px-3 py-2 text-right">{resumoOperacao.detalhado?.[nomeTabela]?.ignored ?? 0}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}




