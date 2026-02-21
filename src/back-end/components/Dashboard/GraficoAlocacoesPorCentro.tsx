'use client'

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
    nome: string;
    [key: string]: string | number;
}

const CORES = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#06b6d4', // cyan
    '#84cc16', // lime
];

export default function GraficoAlocacoesPorCentro() {
    const [dados, setDados] = useState<DataPoint[]>([]);
    const [tipos, setTipos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const res = await fetch('/api/dashboard/alocacoes-centro');
                if (res.ok) {
                    const data = await res.json();
                    setDados(data);

                    // Extrair todos os tipos únicos de patrimônio
                    const tiposSet = new Set<string>();
                    data.forEach((ponto: DataPoint) => {
                        Object.keys(ponto).forEach(chave => {
                            if (chave !== 'nome') {
                                tiposSet.add(chave);
                            }
                        });
                    });
                    setTipos(Array.from(tiposSet).sort());
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
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
            <h2 className="text-lg font-semibold mb-4">Alocações de Patrimônio por Centro de Custo</h2>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {tipos.map((tipo, index) => (
                        <Bar
                            key={tipo}
                            dataKey={tipo}
                            fill={CORES[index % CORES.length]}
                            name={tipo}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
