"use client";

import { Button } from "@/components/ui/button";
import { BadgeInfo, Eye, EyeOff, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type HomeDashboardSectionProps = {
  version: string;
  updatedAt?: string | null;
  children: ReactNode;
};

const STORAGE_KEY = "appgpp-home-dashboard-visible";

export default function HomeDashboardSection({ version, updatedAt, children }: HomeDashboardSectionProps) {
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

  return (
    <section className="w-full">
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Resumo inicial
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1">
            <BadgeInfo className="h-4 w-4" />
            Versão instalada: {version}
          </span>
          {updatedAt ? (
            <span className="text-xs text-muted-foreground/80">
              Atualizado em {new Date(updatedAt).toLocaleString("pt-BR")}
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          variant={visible ? "outline" : "default"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {visible ? "Ocultar dashboard" : "Visualizar dashboard"}
        </Button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          visible ? "mt-6 max-h-[5000px] opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        {visible ? children : null}
      </div>

      {!visible ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-card/70 px-6 py-10 text-center shadow-sm">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
            <div className="rounded-full border border-border/60 bg-background/70 p-3 text-muted-foreground">
              <EyeOff className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Dashboard oculto</h2>
            <p className="text-sm text-muted-foreground">
              Clique em <span className="font-medium text-foreground">Visualizar dashboard</span> para mostrar os
              cartoes de resumo, os centros de custo e os graficos da pagina inicial.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
