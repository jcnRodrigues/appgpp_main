"use client";

import { Button } from "@/components/ui/button";
import TableState from "@/components/TableState/TableState";
import { Eye, EyeOff, Inbox } from "lucide-react";
import { useEffect, useState } from "react";

interface CentroResumo {
  id: string;
  codigo: string;
  nome: string;
  funcionarios: number;
  patrimonios: number;
  previsaoMedicao: number;
  ativos?: number;
  devolvidos?: number;
  transferidos?: number;
}

const STORAGE_KEY = "appgpp-dashboard-centros-resumo-visible";

export default function CentrosResumoCards({ centros }: { centros: CentroResumo[] }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "hidden") {
        setVisible(false);
      }
    } catch {
      // Ignora falha de armazenamento local
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, visible ? "visible" : "hidden");
    } catch {
      // Ignora falha de armazenamento local
    }
  }, [visible]);

  const header = (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">Centros de Custo - Resumo</h2>
        <p className="text-sm text-muted-foreground">Cards com funcionarios, patrimonios, devolvidos e transferidos.</p>
      </div>
      <Button
        type="button"
        variant={visible ? "outline" : "default"}
        onClick={() => setVisible((current) => !current)}
        aria-pressed={visible}
        className="w-full shrink-0 gap-2 rounded-full px-4 sm:w-auto"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {visible ? "Ocultar" : "Visualizar"}
      </Button>
    </div>
  );

  if (!centros.length) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow p-6">
        {header}
        {visible ? (
          <TableState
            icon={Inbox}
            title="Nenhum centro de custo encontrado"
            description="Ainda nao ha dados suficientes para montar os cards do resumo."
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center text-sm text-muted-foreground">
            Resumo dos centros de custo oculto.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg shadow p-6">
      {header}

      {visible ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {centros.map((centro) => (
            <div
              key={centro.id}
              className="flex min-h-[168px] flex-col justify-between rounded-xl border border-border bg-muted/30 p-4"
            >
              <div className="mb-4">
                <span className="flex items-start gap-1">
                  <p className="text-xs text-muted-foreground">{centro.codigo || "Sem codigo"}</p>
                  <h6
                    className="break-words text-[10px] font-semibold leading-3 text-foreground"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {centro.nome}
                  </h6>
                </span>
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-2 py-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Funcionarios</p>
                  <p className="text-lg font-bold text-foreground">{centro.funcionarios}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-2 py-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Patrimonios</p>
                  <p className="text-lg font-bold text-foreground">{centro.patrimonios}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-2 py-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Ativos</p>
                  <p className="text-lg font-bold text-foreground">{centro.ativos ?? centro.patrimonios}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-2 py-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Devolvidos</p>
                  <p className="text-lg font-bold text-foreground">{centro.devolvidos ?? 0}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-2 py-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Transferidos</p>
                  <p className="text-lg font-bold text-foreground">{centro.transferidos ?? 0}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-md border border-border bg-card px-2 py-2 text-center">
                  <p className="text-[11px] text-muted-foreground">Prev Med</p>
                  <p className="text-lg font-bold text-primary">{centro.previsaoMedicao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center text-sm text-muted-foreground">
          Resumo dos centros de custo oculto.
        </div>
      )}
    </div>
  );
}
