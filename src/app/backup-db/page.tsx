"use client";

import Header from "@/components/Header/Header";
import PageHeader from "@/components/PageHeader/PageHeader";
import { DatabaseBackup, FolderCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { notify as showNotify } from "@/lib/notify";
import { useSession } from "next-auth/react";
import { hasModuleAccess, hasModuleActionPermission } from "@/lib/permissions";

type BackupResult = {
  message?: string;
  folderName?: string;
  folderPath?: string;
  counts?: Record<string, number>;
};

type ZipResult = {
  zipPath?: string;
  zipName?: string;
};

const steps = [
  "1. Validar permissao do usuario",
  "2. Coletar dados de todas as tabelas",
  "3. Criar pasta backup_DB_data-hora na raiz",
  "4. Salvar backup-completo.json",
  "5. Salvar arquivos por tabela em /tables",
  "6. Finalizar e exibir resumo"
];

export default function BackupDbPage() {
  const { data: session, status } = useSession();
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<BackupResult | null>(null);
  const [zipResult, setZipResult] = useState<ZipResult | null>(null);
  const [zipping, setZipping] = useState(false);
  const [opening, setOpening] = useState(false);
  const forms = ((session?.user as any)?.formularios || []) as string[];
  const canExport =
    hasModuleActionPermission(forms, "IMPORTACAO_EXPORTACAO", "EXPORT") ||
    hasModuleAccess(forms, "ACESSO_USUARIOS");

  const sortedCounts = useMemo(() => {
    return Object.entries(result?.counts || {}).sort((a, b) => a[0].localeCompare(b[0]));
  }, [result]);

  const runBackup = async () => {
    try {
      setRunning(true);
      setDone(false);
      setResult(null);

      const res = await fetch("/api/backup-db", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Falha ao executar backup.");

      setResult(data);
      setZipResult(null);
      setDone(true);
      showNotify("sucesso", "Backup do banco executado com sucesso.");
    } catch (error: any) {
      showNotify("erro", error?.message || "Erro ao executar backup.");
    } finally {
      setRunning(false);
    }
  };

  const zipBackup = async () => {
    if (!result?.folderName) return;
    try {
      setZipping(true);
      const res = await fetch("/api/backup-db/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName: result.folderName })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Falha ao compactar backup.");
      setZipResult({ zipName: data?.zipName, zipPath: data?.zipPath });
      showNotify("sucesso", "Arquivo ZIP gerado com sucesso.");
    } catch (error: any) {
      showNotify("erro", error?.message || "Erro ao compactar backup.");
    } finally {
      setZipping(false);
    }
  };

  const openBackupFolder = async () => {
    if (!result?.folderName) return;
    try {
      setOpening(true);
      const res = await fetch("/api/backup-db/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName: result.folderName })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Falha ao abrir pasta.");
      showNotify("sucesso", "Pasta aberta com sucesso.");
    } catch (error: any) {
      showNotify("erro", error?.message || "Erro ao abrir pasta.");
    } finally {
      setOpening(false);
    }
  };

  if (status === "authenticated" && !canExport) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Backup DB (1 a 6)</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Seu perfil não tem permissão para exportar backups.</p>
            <Button asChild>
              <a href="/">Voltar para início</a>
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
          title="Backup DB (1 a 6)"
          description="Executa backup completo do banco e salva na raiz do projeto."
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
          <Button className="mt-5" onClick={runBackup} disabled={running || !canExport}>
            {running ? "Executando..." : "Executar Backup (1 a 6)"}
          </Button>
        </section>

        {result && (
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FolderCheck className="h-5 w-5 text-accent" />
              <h2 className="text-h3 font-semibold">Resultado</h2>
            </div>
            <p className="text-sm mb-2"><strong>Pasta:</strong> {result.folderName}</p>
            <p className="text-sm mb-4"><strong>Caminho:</strong> {result.folderPath}</p>
            <Button type="button" variant="outline" onClick={zipBackup} disabled={zipping || !canExport} className="mb-4">
              {zipping ? "Compactando..." : "Gerar ZIP do backup"}
            </Button>
            <Button type="button" variant="outline" onClick={openBackupFolder} disabled={opening || !canExport} className="mb-4 ml-2">
              {opening ? "Abrindo..." : "Abrir pasta de backup"}
            </Button>
            {zipResult?.zipPath && (
              <p className="text-sm mb-4"><strong>ZIP:</strong> {zipResult.zipPath}</p>
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
