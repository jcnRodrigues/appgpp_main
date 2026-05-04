"use client";

import Header from "@/back-end/components/Header/Header";
import Link from "next/link";
import { ChevronLeft, Download, FileJson, FileSpreadsheet, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/back-end/components/ui/button";
import * as XLSX from "xlsx";

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
    "tbCadastro"
] as const;

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
};

type ImportResult = {
    message?: string;
    scope?: {
        centroId?: string | null;
    };
    imported?: Partial<TotaisPorTabela>;
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
    const [exportando, setExportando] = useState(false);
    const [importando, setImportando] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [centros, setCentros] = useState<CentroCustoOption[]>([]);
    const [centroSelecionado, setCentroSelecionado] = useState("");
    const [resumoOperacao, setResumoOperacao] = useState<ResumoOperacao | null>(null);

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

    const normalizeExcelValue = (value: unknown) => {
        if (value instanceof Date) return value.toISOString();
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
            return JSON.stringify(value);
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
            centroSelecionado
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
                body: JSON.stringify(backup)
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
                centroId: (result as ImportResult)?.scope?.centroId || centroSelecionado || backup.scope?.centroId || null
            });

            notify("sucesso", "Importacao concluida com sucesso.");
            setArquivo(null);
        } catch (error: any) {
            notify("erro", error?.message || "Erro ao importar dados.");
        } finally {
            setImportando(false);
        }
    };

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
                    </section>

                    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Upload className="h-5 w-5 text-accent" />
                            <h2 className="text-h3 font-semibold">Importar dados</h2>
                        </div>
                        <p className="text-body2 mb-3">
                            Selecione um arquivo `.json` ou `.xlsx` exportado pelo sistema.
                        </p>
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
                    A importacao com filtro sobrescreve os dados do centro escolhido. Sem filtro,
                    a importacao continua sendo completa e sobrescreve todo o sistema.
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {TABLE_NAMES.map((nomeTabela) => (
                                        <tr key={nomeTabela} className="border-t">
                                            <td className="px-3 py-2">{nomeTabela}</td>
                                            <td className="px-3 py-2 text-right">{resumoOperacao.totaisPorTabela[nomeTabela]}</td>
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




