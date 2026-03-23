'use client'

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getDashboardRefreshMs } from './refreshConfig';

interface DashboardCardsProps {
    totalPatrimonios: number;
    totalFuncionarios: number;
}

interface DashboardResumoApi {
    totalPatrimonios: number;
    totalFuncionarios: number;
}

export default function DashboardCards({ totalPatrimonios, totalFuncionarios }: DashboardCardsProps) {
    const [resumo, setResumo] = useState<DashboardResumoApi>({
        totalPatrimonios,
        totalFuncionarios,
    });

    useEffect(() => {
        const refreshMs = getDashboardRefreshMs();

        const carregarResumo = async () => {
            try {
                const res = await fetch('/api/dashboard?tipo=resumo', { cache: 'no-store' });
                if (!res.ok) return;

                const data: DashboardResumoApi = await res.json();
                setResumo({
                    totalPatrimonios: data.totalPatrimonios ?? 0,
                    totalFuncionarios: data.totalFuncionarios ?? 0,
                });
            } catch (error) {
                console.error('Erro ao carregar resumo do dashboard:', error);
            }
        };

        carregarResumo();
        if (refreshMs <= 0) return;

        const timer = setInterval(() => {
            carregarResumo();
        }, refreshMs);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 relative shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500">Patrimônios</h4>
                        <div className="mt-2 flex items-end gap-3">
                            <span className="text-3xl font-bold">{resumo.totalPatrimonios}</span>
                            <span className="text-xs text-gray-400">cadastrados</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Total de patrimônios registrado no sistema.</p>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                        <span className="text-lg font-bold">📦</span>
                    </div>
                </div>

                <div className="absolute bottom-3 right-3">
                    <button className="bg-blue-600 text-white p-2 rounded-full" type="button" aria-label="Resumo de patrimônios">
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 relative shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500">Funcionários</h4>
                        <div className="mt-2 flex items-end gap-3">
                            <span className="text-3xl font-bold">{resumo.totalFuncionarios}</span>
                            <span className="text-xs text-gray-400">cadastrados</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Total de funcionários registrado no sistema.</p>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                        <span className="text-lg font-bold">👥</span>
                    </div>
                </div>

                <div className="absolute bottom-3 right-3">
                    <button className="bg-green-600 text-white p-2 rounded-full" type="button" aria-label="Resumo de funcionários">
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
