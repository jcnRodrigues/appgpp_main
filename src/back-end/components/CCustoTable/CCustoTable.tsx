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
    const [itensPorPagina, setItensPorPagina] = useState(10);
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
    }, [paginaAtual, itensPorPagina]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [itensPorPagina]);

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

    const getPaginasVisiveis = () => {
        if (totalPaginas <= 7) {
            return Array.from({ length: totalPaginas }, (_, index) => index + 1);
        }

        const paginas = new Set<number>([1, totalPaginas, paginaAtual]);

        if (paginaAtual <= 4) {
            [2, 3, 4, 5].forEach((p) => paginas.add(p));
        } else if (paginaAtual >= totalPaginas - 3) {
            [totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1].forEach((p) => paginas.add(p));
        } else {
            [paginaAtual - 1, paginaAtual, paginaAtual + 1].forEach((p) => paginas.add(p));
        }

        return Array.from(paginas)
            .filter((p) => p >= 1 && p <= totalPaginas)
            .sort((a, b) => a - b);
    };

    const paginasVisiveis = getPaginasVisiveis();

    const irParaPagina = (pagina: number) => {
        const paginaValida = Math.min(Math.max(pagina, 1), totalPaginas);
        setPaginaAtual(paginaValida);
    };

    return (
        <div className="space-y-4">
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">Carregando...</div>
                ) : centros.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">Nenhum centro de custo cadastrado.</div>
                ) : (
                    centros.map((c) => (
                        <div key={c.idCCusto} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            <div>
                                <div className="text-sm font-semibold text-gray-900">{c.descricaoCCusto || '-'}</div>
                                <div className="text-xs text-gray-500">Código: {c.codigoCCusto || '-'}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">Empresa</div>
                                <div className="text-gray-800 text-right">{c.tbEmpresa?.fantasiaEmpresa || c.tbEmpresa?.razaoEmpresa || '-'}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                    <Link href={`/ccusto/${c.idCCusto}`} title="Editar">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(c.idCCusto, c.descricaoCCusto || 'Centro de Custo')}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empresa</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
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
            {/* Paginação */}
            <div className="flex flex-col gap-3 items-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <label htmlFor="itensPorPagina" className="text-xs text-gray-600">
                        Itens por página:
                    </label>
                    <select
                        id="itensPorPagina"
                        value={itensPorPagina}
                        onChange={(e) => setItensPorPagina(Number(e.target.value))}
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <Button type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1 || totalItens === 0}
                    >
                        Anterior
                    </Button>
                    {paginasVisiveis.map((pagina, index) => {
                        const ativa = pagina === paginaAtual;
                        const paginaAnterior = paginasVisiveis[index - 1];
                        const mostrarReticencias = Boolean(paginaAnterior) && pagina - paginaAnterior > 1;
                        return (
                            <div key={pagina} className="flex items-center gap-2">
                                {mostrarReticencias && <span className="px-1 text-sm text-muted-foreground">...</span>}
                                <button type="button"
                                    onClick={() => irParaPagina(pagina)}
                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                                        ativa
                                            ? 'bg-accent/20 text-accent border border-accent/35'
                                            : 'bg-card text-foreground border border-border hover:bg-secondary'
                                    }`}
                                >
                                    {pagina}
                                </button>
                            </div>
                        );
                    })}
                    <Button type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}
                    >
                        Próxima
                    </Button>
                </div>
                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} – {Math.min(inicio + centros.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}

