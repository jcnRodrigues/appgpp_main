'use client'

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
                    <span className="text-gray-400">Carregando gráfico...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Alocações de Patrimônio por Centro de Custo e Tipo</h2>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="centro" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{ borderRadius: 8 }}
                        formatter={(value: number | undefined) => [value ?? 0, '']}
                        labelFormatter={(label) => `Centro: ${label}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {tipos.map((tipo, i) => (
                        <Bar
                            key={tipo}
                            dataKey={tipo}
                            fill={CORES_TIPOS[i % CORES_TIPOS.length]}
                            name={tipo}
                            radius={[0, 0, 0, 0]}
                        />
                    ))}
                    {tipos.length === 0 && (
                        <Bar dataKey="centro" fill="#e5e7eb" name="Sem dados" hide />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
