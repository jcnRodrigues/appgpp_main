'use client'

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardRefreshMs } from './refreshConfig';

const CORES_CENTROS = [
    '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

interface DataPoint {
    mes: string;
    [centro: string]: string | number;
}

interface RespostaApi {
    data: DataPoint[];
    centros: string[];
}

function formatarMes(mes: string) {
    const [ano, m] = mes.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const i = parseInt(m, 10) - 1;
    return i >= 0 && i < 12 ? `${meses[i]}/${ano}` : mes;
}

export default function GraficoAlocacoesLinha() {
    const [dados, setDados] = useState<DataPoint[]>([]);
    const [centros, setCentros] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refreshMs = getDashboardRefreshMs();

        const carregarDados = async () => {
            try {
                const res = await fetch('/api/dashboard/alocacoes-tempo', { cache: 'no-store' });
                if (res.ok) {
                    const json: RespostaApi = await res.json();
                    setDados(json.data ?? []);
                    setCentros(json.centros ?? []);
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
                    <span className="text-gray-400">Carregando gráfico...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Evolução de Alocações por Centro de Custo (Últimos 12 Meses)</h2>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="mes"
                        tickFormatter={formatarMes}
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        labelFormatter={(mes) => formatarMes(mes)}
                        contentStyle={{ borderRadius: 8 }}
                        formatter={(value: number | undefined) => [value ?? 0, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {centros.map((centro, i) => (
                        <Line
                            key={centro}
                            type="monotone"
                            dataKey={centro}
                            stroke={CORES_CENTROS[i % CORES_CENTROS.length]}
                            name={centro}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
