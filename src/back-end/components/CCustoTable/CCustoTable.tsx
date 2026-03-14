'use client'

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface Centro {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    tbEmpresa?: {
        idEmp: string;
        fantasiaEmpresa?: string | null;
        razaoEmpresa?: string | null;
    } | null;
}

export default function CCustoTable({ centros: inicial }: { centros: Centro[] }) {
    const [centros, setCentros] = useState(inicial);
    const [loading, setLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [totalItens, setTotalItens] = useState(inicial.length);

    const carregarCentros = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));
            const res = await fetch(`/api/ccusto?${params}`);
            if (res.ok) {
                const data = await res.json();
                setCentros(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            }
        } catch (error) {
            console.error('Erro ao carregar centros de custo:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCentros();
    }, [paginaAtual]);

    const handleDelete = async (id: string, descricao: string) => {
        if (confirm(`Deletar "${descricao}"?`)) {
            try {
                const res = await fetch(`/api/ccusto/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    await carregarCentros();
                } else {
                    alert('Erro ao deletar');
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                alert('Erro ao deletar');
            }
        }
    };

    useEffect(() => {
        const totalPaginasAtual = Math.max(1, Math.ceil(totalItens / itensPorPagina));
        if (paginaAtual > totalPaginasAtual) {
            setPaginaAtual(totalPaginasAtual);
        }
    }, [totalItens, paginaAtual]);

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio = (paginaAtual - 1) * itensPorPagina;

    const irParaPagina = (pagina: number) => {
        const paginaValida = Math.min(Math.max(pagina, 1), totalPaginas);
        setPaginaAtual(paginaValida);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">CÃ³digo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">DescriÃ§Ã£o</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empresa</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AÃ§Ãµes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : centros.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Nenhum centro de custo cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                centros.map(c => (
                                    <tr key={c.idCCusto} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm">{c.codigoCCusto || '-'}</td>
                                        <td className="px-6 py-4 text-sm">{c.descricaoCCusto || '-'}</td>
                                        <td className="px-6 py-4 text-sm">{c.tbEmpresa?.fantasiaEmpresa || c.tbEmpresa?.razaoEmpresa || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Link href={`/ccusto/${c.idCCusto}`} title="Editar">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <button type="button"
                                                    onClick={() => handleDelete(c.idCCusto, c.descricaoCCusto || 'Centro de Custo')}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* PaginaÃ§Ã£o */}
            <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-2">
                    <Button type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1 || totalItens === 0}
                    >
                        Anterior
                    </Button>
                    {Array.from({ length: totalPaginas }).map((_, index) => {
                        const pagina = index + 1;
                        const ativa = pagina === paginaAtual;
                        return (
                            <button type="button"
                                key={pagina}
                                onClick={() => irParaPagina(pagina)}
                                className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                                    ativa
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                                }`}
                            >
                                {pagina}
                            </button>
                        );
                    })}
                    <Button type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}
                    >
                        PrÃ³xima
                    </Button>
                </div>
                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1}â€“{Math.min(inicio + centros.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}
