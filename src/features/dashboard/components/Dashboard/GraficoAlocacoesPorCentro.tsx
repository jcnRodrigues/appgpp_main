"use client";

import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { getDashboardRefreshMs } from "./refreshConfig";
import TableState from "@/components/TableState/TableState";
import { Inbox } from "lucide-react";

const CORES_TIPOS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

interface DataPoint {
  centro: string;
  [tipo: string]: string | number;
}

interface RespostaApi {
  data: DataPoint[];
  tipos: string[];
}

const tooltipStyle = {
  borderRadius: 8,
  backgroundColor: "#050a0a",
  border: "1px solid #2f3f3f",
  color: "#f8fafc",
  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.55)",
  padding: 0,
} as const;

function formatarCentro(nome: string) {
  return nome.length > 32 ? `${nome.slice(0, 32).trim()}...` : nome;
}

function CustomTooltip({ active, payload, label, coordinate, chartRef }: any) {
  const hasContent = Boolean(active && payload?.length);
  const linhas = (payload ?? []).filter((item: any) => item?.value !== undefined && item?.value !== null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({
    position: "fixed",
    left: 0,
    top: 0,
    visibility: "hidden",
    zIndex: 99999,
    pointerEvents: "none",
  });

  useEffect(() => {
    if (!hasContent || !coordinate || typeof window === "undefined") return;

    const updatePosition = () => {
      const hostRect = chartRef?.current?.getBoundingClientRect();
      if (!hostRect) return;

      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      const tooltipWidth = tooltipRect?.width ?? 340;
      const tooltipHeight = tooltipRect?.height ?? 220;

      const gap = 16;
      let left = hostRect.left + coordinate.x + gap;
      let top = hostRect.top + coordinate.y - tooltipHeight / 2;

      if (left + tooltipWidth > window.innerWidth - 12) {
        left = hostRect.left + coordinate.x - tooltipWidth - gap;
      }

      if (left < 12) {
        left = 12;
      }

      if (top < 12) {
        top = 12;
      }

      if (top + tooltipHeight > window.innerHeight - 12) {
        top = window.innerHeight - tooltipHeight - 12;
      }

      setStyle({
        position: "fixed",
        left,
        top,
        visibility: "visible",
        zIndex: 99999,
        pointerEvents: "none",
      });
    };

    const raf = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", updatePosition);
    };
  }, [hasContent, chartRef, coordinate, label]);

  if (!hasContent || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={tooltipRef}
      className="min-w-[240px] max-w-[min(90vw,460px)] overflow-hidden rounded-2xl border shadow-2xl"
      style={{ ...style, backgroundColor: "#050a0a", borderColor: "#2f3f3f", color: "#f8fafc", opacity: 1 }}
    >
      <div className="flex items-start gap-2 border-b px-3 py-2" style={{ borderColor: "#2f3f3f" }}>
        <span className="mt-1 h-7 w-1 rounded-full bg-primary/90" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold leading-none tracking-tight">{String(label || "Centro")}</p>
          <p className="mt-0.5 text-[9px]" style={{ color: "#94a3b8" }}>
            {linhas.length} tipo(s) com dados
          </p>
        </div>
      </div>

      <div className="px-2 py-2">
        <div className="grid gap-0.5">
          {linhas.map((item: any) => (
            <div
              key={String(item?.dataKey || item?.name)}
              className="flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-[10px] transition-colors"
              style={{
                borderColor: "#314141",
                backgroundColor: "#0b1111",
              }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: "0 0 0 1px #050a0a" }}
                />
                <span className="min-w-0 truncate font-medium leading-tight text-[10px]" style={{ color: "#f8fafc" }}>
                  {formatarCentro(String(item?.name ?? item?.dataKey ?? ""))}
                </span>
              </div>
              <span
                className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold tabular-nums shadow-sm"
                style={{ backgroundColor: "#020607", color: "#f8fafc" }}
              >
                {Number(item?.value ?? 0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function GraficoAlocacoesPorCentro() {
  const [dados, setDados] = useState<DataPoint[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const refreshMs = getDashboardRefreshMs();

    const carregarDados = async () => {
      try {
        const res = await fetch("/api/dashboard/alocacoes-centro", { cache: "no-store" });
        if (res.ok) {
          const json: RespostaApi = await res.json();
          setDados(json.data ?? []);
          setTipos(json.tipos ?? []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
    if (refreshMs <= 0) return;

    const timer = setInterval(() => {
      carregarDados();
    }, refreshMs);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 overflow-visible">
        <TableState icon={Inbox} title="Carregando grafico" compact />
      </div>
    );
  }

  if (!dados.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 overflow-visible">
        <TableState icon={Inbox} title="Sem dados para o grafico" description="Ainda nao ha alocacoes suficientes para exibir este painel." compact />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-visible">
      <h2 className="mb-4 text-lg font-semibold">Alocacoes de Patrimonio por Centro de Custo e Tipo</h2>
      <div ref={chartRef} className="overflow-visible">
        <ResponsiveContainer width="100%" height={460}>
          <BarChart
            data={dados}
            layout="vertical"
            margin={{ top: 10, right: 40, left: 24, bottom: 10 }}
            barCategoryGap={18}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "var(--foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              type="category"
              dataKey="centro"
              width={200}
              tick={{ fontSize: 12, fill: "var(--foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              content={<CustomTooltip chartRef={chartRef} />}
              contentStyle={tooltipStyle}
              wrapperStyle={{ pointerEvents: "auto", zIndex: 9999 }}
              allowEscapeViewBox={{ x: true, y: true }}
              cursor={{ fill: "rgba(43, 111, 113, 0.12)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {tipos.map((tipo, i) => (
              <Bar
                key={`group-${tipo}`}
                dataKey={tipo}
                fill={CORES_TIPOS[i % CORES_TIPOS.length]}
                name={tipo}
                radius={[3, 3, 3, 3]}
                barSize={24}
                maxBarSize={48}
              >
                <LabelList
                  dataKey={tipo}
                  position="right"
                  formatter={(value: unknown) => Number(value || 0)}
                  style={{ fill: "var(--foreground)", fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            ))}
            {tipos.length === 0 && <Bar dataKey="centro" fill="#e5e7eb" name="Sem dados" hide />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
