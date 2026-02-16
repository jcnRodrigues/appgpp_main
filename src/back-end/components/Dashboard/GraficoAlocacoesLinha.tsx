'use client'

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
    mes: string;
    quantidade: number;
}

export default function GraficoAlocacoesLinha() {
    const [dados, setDados] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const res = await fetch('/api/dashboard/alocacoes-tempo');
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
            <h2 className="text-lg font-semibold mb-4">Evolução de Alocações (Últimos 12 Meses)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="quantidade" 
                        stroke="#10b981" 
                        name="Alocações"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
