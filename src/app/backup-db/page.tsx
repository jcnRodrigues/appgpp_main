"use client";

import Header from "@/components/Header/Header";
import PageHeader from "@/components/PageHeader/PageHeader";
import { DatabaseBackup, FolderCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { notify as showNotify } from "@/lib/notify";
import { useSession } from "next-auth/react";
import { hasModuleActionPermission } from "@/lib/permissions";

type BackupResult = {
  message?: string;
  folderName?: string;
  folderPath?: string;
  sqlFileName?: string;
  sqlFilePath?: string;
  counts?: Record<string, number>;
};

const steps = [
  "1. Validar permissao do usuario",
  "2. Coletar estrutura e dados de todas as tabelas",
  "3. Criar pasta backup_DB_data-hora na raiz",
  "4. Salvar backup-completo.json",
  "5. Gerar backup-completo.sql com estrutura e dados",
  "6. Salvar arquivos por tabela em /tables",
  "7. Finalizar e exibir resumo"
];

export default function BackupDbPage() {
  const { data: session, status } = useSession();
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<BackupResult | null>(null);
  const forms = ((session?.user as any)?.formularios || []) as string[];
  const canExport = hasModuleActionPermission(forms, "BACKUP_DB", "EXPORT");

  const sortedCounts = useMemo(() => {
    return Object.entries(result?.counts || {}).sort((a, b) => a[0].localeCompare(b[0]));
  }, [result]);

  const sqlDownloadHref = result?.folderName
    ? `/api/backup-db?folderName=${encodeURIComponent(result.folderName)}`
    : null;

  const downloadSqlFile = (folderName: string) => {
    const href = `/api/backup-db?folderName=${encodeURIComponent(folderName)}`;
    const link = document.createElement("a");
    link.href = href;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const runBackupAndDownloadSql = async () => {
    try {
      setRunning(true);
      setDone(false);
      setResult(null);

      const res = await fetch("/api/backup-db", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Falha ao executar backup.");

      setResult(data);
      setDone(true);
      if (data?.folderName) {
        downloadSqlFile(data.folderName);
      }
      showNotify("sucesso", "Backup do banco executado e SQL baixado com sucesso.");
    } catch (error: any) {
      showNotify("erro", error?.message || "Erro ao executar backup.");
    } finally {
      setRunning(false);
    }
  };

  if (status === "authenticated" && !canExport) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Backup DB (1 a 7)</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Seu perfil não tem permissão para exportar backups.</p>
            <Button asChild>
              <Link href="/">Voltar para início</Link>
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
        <PageHeader
          icon={DatabaseBackup}
          title="Backup DB (1 a 7)"
          description="Executa backup completo da estrutura e dos dados do banco e salva na raiz do projeto."
          backHref="/"
        />

        <section className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <DatabaseBackup className="h-5 w-5 text-accent" />
            <h2 className="text-h3 font-semibold">Fluxo de execucao</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${done ? "bg-green-500" : running && index < 3 ? "bg-amber-500" : "bg-muted"}`} />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={runBackupAndDownloadSql} disabled={running || !canExport}>
              {running ? "Gerando..." : "Executar Backup Completo"}
            </Button>
          </div>
        </section>

        {result && (
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FolderCheck className="h-5 w-5 text-accent" />
              <h2 className="text-h3 font-semibold">Resultado</h2>
            </div>
            <p className="text-sm mb-2"><strong>Pasta:</strong> {result.folderName}</p>
            <p className="text-sm mb-4"><strong>Caminho:</strong> {result.folderPath}</p>
            {result.sqlFilePath && (
              <p className="text-sm mb-4"><strong>SQL:</strong> {result.sqlFilePath}</p>
            )}
            {sqlDownloadHref && (
              <Button asChild type="button" variant="outline" className="mb-4">
                <a href={sqlDownloadHref}>Baixar SQL</a>
              </Button>
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
                  {sortedCounts.map(([name, count]) => (
                    <tr key={name} className="border-t">
                      <td className="px-3 py-2">{name}</td>
                      <td className="px-3 py-2 text-right">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
