"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleAlert, RefreshCcw, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type WindowsServiceState = {
  exists: boolean;
  name: string;
  displayName: string;
  state: string;
  startMode: string;
  processId: number | null;
  pathName: string;
  description: string;
  startName: string;
  exitCode: number | null;
  serviceType: string;
};

type ServiceResponse = {
  serviceName: string;
  service: WindowsServiceState | null;
  recentLogs?: string[];
  message?: string;
  output?: string;
  error?: string;
};

type ServiceControlPanelProps = {
  serviceName: string;
  canUpdate: boolean;
};

function stateVariant(state?: string | null) {
  const normalized = String(state || "").toLowerCase();
  if (normalized === "running") return "default";
  if (normalized === "stopped") return "secondary";
  return "outline";
}

export default function ServiceControlPanel({ serviceName, canUpdate }: ServiceControlPanelProps) {
  const [data, setData] = useState<ServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"start" | "stop" | "restart" | "refresh" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const service = data?.service;
  const recentLogs = data?.recentLogs || [];
  const status = useMemo(() => service?.state || "Unknown", [service?.state]);

  const loadStatus = async () => {
    setBusy("refresh");
    setError(null);
    try {
      const response = await fetch("/api/sistema/servico", { cache: "no-store" });
      const payload: ServiceResponse = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.message || "Falha ao verificar o servico.");
      }
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao verificar o servico.");
    } finally {
      setLoading(false);
      setBusy(null);
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const runAction = async (action: "start" | "stop" | "restart") => {
    setBusy(action);
    setError(null);
    try {
      const response = await fetch("/api/sistema/servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload: ServiceResponse = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.message || "Nao foi possivel processar a acao.");
      }
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel processar a acao.");
    } finally {
      setBusy(null);
      setLoading(false);
    }
  };

  const canStart = canUpdate && status.toLowerCase() !== "running";
  const canStop = canUpdate && status.toLowerCase() === "running";
  const canRestart = canUpdate && status.toLowerCase() === "running";

  return (
    <section className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Servico Windows do AppGPP</h2>
            <p className="text-sm text-muted-foreground">
              Verifique, inicie ou pare o <span className="font-medium text-foreground">{serviceName}</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" className="shadow-sm" onClick={loadStatus} disabled={busy !== null}>
              <RefreshCcw className={`h-4 w-4 ${busy === "refresh" ? "animate-spin" : ""}`} />
              Verificar
            </Button>
            <Button type="button" variant="outline" className="shadow-sm" onClick={() => runAction("restart")} disabled={!canRestart || busy !== null}>
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
            <Button type="button" variant="default" className="shadow-sm" onClick={() => runAction("start")} disabled={!canStart || busy !== null}>
              <Play className="h-4 w-4" />
              Iniciar
            </Button>
            <Button type="button" variant="destructive" className="shadow-sm" onClick={() => runAction("stop")} disabled={!canStop || busy !== null}>
              <Square className="h-4 w-4" />
              Parar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-b border-border/60 p-5 md:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={stateVariant(status)}>{status}</Badge>
            {service?.processId ? <span className="text-sm text-muted-foreground">PID {service.processId}</span> : null}
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Start mode</p>
          <p className="mt-2 text-base font-semibold">{service?.startMode || "N/A"}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Conta</p>
          <p className="mt-2 text-base font-semibold">{service?.startName || "N/A"}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Existe</p>
          <p className="mt-2 text-base font-semibold">{service?.exists ? "Sim" : "Nao"}</p>
        </div>
      </div>

      <div className="grid gap-4 border-b border-border/60 p-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Nome de exibicao</p>
          <p className="mt-2 break-words text-sm font-medium text-foreground">{service?.displayName || serviceName}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Descricao</p>
          <p className="mt-2 break-words text-sm font-medium text-foreground">{service?.description || "Sem descricao."}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Caminho do executavel</p>
          <p className="mt-2 break-all text-sm font-medium text-foreground">{service?.pathName || "Nao informado."}</p>
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{error}</div>
          </div>
        ) : null}

        {!canUpdate ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
            Voce pode verificar o status, mas iniciar e parar exigem permissao de atualizacao do modulo Sistema.
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground">
            Carregando status do servico...
          </div>
        ) : null}

        <div className="rounded-2xl border border-border/60 bg-card/80">
          <div className="border-b border-border/60 px-4 py-3">
            <h3 className="text-sm font-semibold">Ultimos logs do host</h3>
            <p className="text-xs text-muted-foreground">Trechos recentes do arquivo service-host.log.</p>
          </div>
          <div className="max-h-72 overflow-auto px-4 py-3">
            {recentLogs.length > 0 ? (
              <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-foreground/90">
                {recentLogs.join("\n")}
              </pre>
            ) : (
              <div className="text-sm text-muted-foreground">Nenhum log recente encontrado.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
