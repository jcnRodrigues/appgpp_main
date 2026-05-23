'use client'

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { getDashboardRefreshMs } from './refreshConfig';

const CORES_TIPOS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
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
  backgroundColor: 'var(--popover)',
  border: '1px solid var(--border)',
  color: 'var(--popover-foreground)',
} as const;

export default function GraficoAlocacoesPorCentro() {
  const [dados, setDados] = useState<DataPoint[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshMs = getDashboardRefreshMs();

    const carregarDados = async () => {
      try {
        const res = await fetch('/api/dashboard/alocacoes-centro', { cache: 'no-store' });
        if (res.ok) {
          const json: RespostaApi = await res.json();
          setDados(json.data ?? []);
          setTipos(json.tipos ?? []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-80 flex items-center justify-center">
          <span className="text-gray-400">Carregando grafico...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Alocacoes de Patrimonio por Centro de Custo e Tipo</h2>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart
          data={dados}
          layout="vertical"
          margin={{ top: 10, right: 28, left: 24, bottom: 10 }}
          barCategoryGap={12}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="centro" width={200} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'rgba(43, 111, 113, 0.12)' }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: 'var(--popover-foreground)', fontWeight: 600 }}
            itemStyle={{ color: 'var(--popover-foreground)' }}
            formatter={(value: number | undefined) => [value ?? 0, 'Quantidade']}
            labelFormatter={(label) => `Centro: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {tipos.map((tipo, i) => (
            <Bar
              key={`group-${tipo}`}
              dataKey={tipo}
              fill={CORES_TIPOS[i % CORES_TIPOS.length]}
              name={tipo}
              radius={[3, 3, 3, 3]}
              maxBarSize={20}
            >
              <LabelList
                dataKey={tipo}
                position="right"
                formatter={(value: unknown) => Number(value || 0)}
                style={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          ))}
          {tipos.length === 0 && <Bar dataKey="centro" fill="#e5e7eb" name="Sem dados" hide />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
