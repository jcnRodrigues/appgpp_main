'use client'

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
    nome: string;
    total: number;
}

export default function GraficoAlocacoesPorCentro() {
    const [dados, setDados] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const res = await fetch('/api/dashboard/alocacoes-centro');
                if (res.ok) {
                    const data = await res.json();
                    setDados(data);
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
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="Quantidade" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
