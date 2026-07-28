"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type DashboardSectionToggleProps = {
  title: string;
  storageKey: string;
  children: ReactNode;
  description?: string;
  collapsedMessage?: string;
};

export default function DashboardSectionToggle({
  title,
  storageKey,
  children,
  description,
  collapsedMessage = "Secao oculta.",
}: DashboardSectionToggleProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "hidden") {
        setVisible(false);
      }
    } catch {
      // Ignora falha de armazenamento local
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, visible ? "visible" : "hidden");
    } catch {
      // Ignora falha de armazenamento local
    }
  }, [storageKey, visible]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
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

      <div
        className={`transition-all duration-300 ease-out ${
          visible ? "max-h-[5000px] overflow-visible opacity-100" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        {visible ? children : null}
      </div>

      {!visible ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/70 px-6 py-8 text-sm text-muted-foreground shadow-sm">
          {collapsedMessage}
        </div>
      ) : null}
    </section>
  );
}
