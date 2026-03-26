'use client'

import { useEffect, useState } from 'react';
import { Edit, Filter, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface Licenca {
    idLic: string;
    descricaoLic: string;
    _count?: {
        tbHasLicencaFuncionario: number;
    };
}

export default function LicencaTable() {
    const [licencas, setLicencas] = useState<Licenca[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroDescricao, setFiltroDescricao] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [totalItens, setTotalItens] = useState(0);

    const carregarLicencas = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroDescricao) params.append('descricao', filtroDescricao);
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));

            const res = await fetch(`/api/licenca?${params}`);
            if (res.ok) {
                const data = await res.json();
                setLicencas(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            } else {
                setLicencas([]);
                setTotalItens(0);
            }
        } catch (error) {
            console.error('Erro ao carregar licencas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarLicencas();
    }, [paginaAtual, filtroDescricao]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroDescricao]);

    const handleDelete = async (idLic: string) => {
        if (!confirm('Tem certeza que deseja deletar esta licenca?')) return;

        try {
            const response = await fetch(`/api/licenca/${idLic}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await carregarLicencas();
                window.systemAlert?.('sucesso', 'Licenca deletada com sucesso');
            } else {
                const error = await response.json().catch(() => ({}));
                window.systemAlert?.('erro', error.message || 'Erro ao deletar licenca');
            }
        } catch (error) {
            console.error('Erro ao deletar licenca:', error);
            window.systemAlert?.('erro', 'Erro ao deletar licenca');
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
        <div className="w-full space-y-4">
            <div className="sticky top-[calc(var(--app-header-height)+96px)] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-2">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Filtros</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por descricao da licenca..."
                            value={filtroDescricao}
                            onChange={(e) => setFiltroDescricao(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descricao</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Qtde Vinculos</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : licencas.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma licenca cadastrada
                                </td>
                            </tr>
                        ) : (
                            licencas.map((licenca) => (
                                <tr key={licenca.idLic} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm">{licenca.descricaoLic}</td>
                                    <td className="px-6 py-4 text-sm">{licenca._count?.tbHasLicencaFuncionario || 0}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                                className="text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                            >
                                                <Link href={`/licenca/${licenca.idLic}/editar`} title="Editar">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(licenca.idLic)}
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

            <div className="text-sm text-gray-600 text-center py-2">
                Total de Licencas: {totalItens}
            </div>

            <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
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
                            <button
                                type="button"
                                key={pagina}
                                onClick={() => irParaPagina(pagina)}
                                className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                                    ativa
                                        ? 'bg-accent/20 text-accent border border-accent/35'
                                        : 'bg-card text-foreground border border-border hover:bg-secondary'
                                }`}
                            >
                                {pagina}
                            </button>
                        );
                    })}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}
                    >
                        Proxima
                    </Button>
                </div>
                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + licencas.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}
