"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Inbox } from "lucide-react";
import TableState from "@/components/TableState/TableState";
import { getDashboardRefreshMs } from "./refreshConfig";

const CORES_CENTROS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

interface DataPoint {
  mes: string;
  [centro: string]: string | number;
}

interface RespostaApi {
  data: DataPoint[];
  centros: string[];
}

const tooltipStyle = {
  borderRadius: 8,
  backgroundColor: "#050a0a",
  border: "1px solid #2f3f3f",
  color: "#f8fafc",
  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.55)",
  padding: 0,
} as const;

function formatarMes(mes: string) {
  const raw = String(mes || "").trim();
  const partes = raw.split("-");

  if (partes.length >= 2) {
    const ano = partes[0];
    const mesNumero = Number(partes[1]);
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    if (Number.isInteger(mesNumero) && mesNumero >= 1 && mesNumero <= 12) {
      return `${meses[mesNumero - 1]}/${ano}`;
    }
  }

  return raw;
}

function ordenarMes(mes: string) {
  const raw = String(mes || "").trim();
  const partes = raw.split("-");
  if (partes.length >= 2) {
    const ano = Number(partes[0]);
    const mesNumero = Number(partes[1]);
    if (Number.isInteger(ano) && Number.isInteger(mesNumero)) {
      return ano * 100 + mesNumero;
    }
  }

  const data = new Date(raw);
  if (!Number.isNaN(data.getTime())) {
    return data.getFullYear() * 100 + (data.getMonth() + 1);
  }

  return 0;
}

function formatarCentro(nome: string) {
  return nome.length > 32 ? `${nome.slice(0, 32).trim()}...` : nome;
}

function CustomLegend({ centros }: { centros: string[] }) {
  if (!centros.length) return null;
  const rows = 4;
  const columns = Math.max(1, Math.ceil(centros.length / rows));

  return (
    <div className="w-full overflow-x-auto px-1">
      <div
        className="grid gap-x-4 gap-y-2 justify-center"
        style={{
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${rows}, minmax(0, auto))`,
          gridTemplateColumns: `repeat(${columns}, max-content)`,
        }}
      >
        {centros.map((centro, index) => (
          <div key={centro} className="flex items-center gap-2 whitespace-nowrap text-[10px] leading-none text-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-background"
              style={{ backgroundColor: CORES_CENTROS[index % CORES_CENTROS.length] }}
            />
            <span className="max-w-[220px] truncate">{centro}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, coordinate, chartRef }: any) {
  const hasContent = Boolean(active && payload?.length);
  const linhas = (payload ?? [])
    .filter((item: any) => item?.value !== undefined && item?.value !== null)
    .sort((a: any, b: any) => Number(b?.value ?? 0) - Number(a?.value ?? 0));
  const exibidas = linhas.slice(0, 6);
  const restantes = Math.max(0, linhas.length - exibidas.length);

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
      const tooltipWidth = tooltipRect?.width ?? 320;
      const tooltipHeight = tooltipRect?.height ?? 220;

      const gap = 16;
      let left = hostRect.left + coordinate.x + gap;
      let top = hostRect.top + coordinate.y - tooltipHeight / 2;

      if (left + tooltipWidth > window.innerWidth - 12) {
        left = hostRect.left + coordinate.x - tooltipWidth - gap;
      }

      if (top + tooltipHeight > window.innerHeight - 12) {
        top = window.innerHeight - tooltipHeight - 12;
      }

      if (top < 12) {
        top = 12;
      }

      if (left < 12) {
        left = 12;
      }

      setStyle({
        position: "fixed",
        left,
        top,
        zIndex: 99999,
        pointerEvents: "none",
        visibility: "visible",
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
      className="min-w-[240px] max-w-[min(90vw,420px)] overflow-hidden rounded-2xl border shadow-2xl"
      style={{ ...style, backgroundColor: "#050a0a", borderColor: "#2f3f3f", color: "#f8fafc", opacity: 1 }}
    >
      <div className="flex items-start gap-2 border-b px-3 py-2" style={{ borderColor: "#2f3f3f" }}>
        <span className="mt-1 h-7 w-1 rounded-full bg-primary/90" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold leading-none tracking-tight">{formatarMes(String(label))}</p>
          <p className="mt-0.5 text-[9px]" style={{ color: "#94a3b8" }}>
            {linhas.length} centro(s) com dados
          </p>
        </div>
      </div>

      <div className="px-2 py-2">
        <div className="grid gap-0.5">
          {exibidas.map((item: any) => (
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

        {restantes > 0 && (
          <div
            className="mt-2 flex items-center justify-between rounded-lg border border-dashed px-2 py-1 text-[9px]"
            style={{ borderColor: "#314141", backgroundColor: "#020607", color: "#94a3b8" }}
          >
            <span>Mostrando os principais centros</span>
            <span className="font-semibold" style={{ color: "#f8fafc" }}>
              +{restantes} centro(s)
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function GraficoAlocacoesLinha() {
  const [dados, setDados] = useState<DataPoint[]>([]);
  const [centros, setCentros] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const refreshMs = getDashboardRefreshMs();

    const carregarDados = async () => {
      try {
        const res = await fetch("/api/dashboard/alocacoes-tempo", { cache: "no-store" });
        if (res.ok) {
          const json: RespostaApi = await res.json();
          const ordenado = [...(json.data ?? [])].sort((a, b) => ordenarMes(a.mes) - ordenarMes(b.mes));
          setDados(ordenado);
          setCentros(json.centros ?? []);
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
        <TableState
          icon={Inbox}
          title="Sem dados para o grafico"
          description="Ainda nao ha historico suficiente para exibir a evolucao."
          compact
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 overflow-visible">
      <h2 className="mb-4 text-lg font-semibold">Evolucao de Alocacoes por Centro de Custo (Ultimos 12 Meses)</h2>
      <div ref={chartRef} className="overflow-visible">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={dados} margin={{ top: 10, right: 32, left: 0, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            tickFormatter={formatarMes}
            minTickGap={14}
            tickMargin={10}
            tick={{ fontSize: 11, fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
          />
          <Tooltip
            content={<CustomTooltip chartRef={chartRef} />}
            contentStyle={tooltipStyle}
            wrapperStyle={{ pointerEvents: "auto", zIndex: 9999 }}
            allowEscapeViewBox={{ x: true, y: true }}
            cursor={{ stroke: "var(--border)", strokeWidth: 1, fill: "rgba(255, 255, 255, 0.02)" }}
          />
          {centros.map((centro, i) => (
            <Line
              key={centro}
              type="monotone"
              dataKey={centro}
              stroke={CORES_CENTROS[i % CORES_CENTROS.length]}
              name={centro}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              connectNulls
            />
          ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 overflow-x-auto pb-1">
        <CustomLegend centros={centros} />
      </div>
    </div>
  );
}
