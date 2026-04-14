'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/back-end/components/ui/button';

interface Funcao {
    idFuncao: string;
    codigoFuncao: number;
    nomeFuncao: string;
}

export default function FuncaoTable() {
    const [funcoes, setFuncoes] = useState<Funcao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroNome, setFiltroNome] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(0);

    const carregarFuncoes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroNome) params.append('nome', filtroNome);
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));
            const res = await fetch(`/api/funcao?${params}`);
            if (res.ok) {
                const data = await res.json();
                setFuncoes(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            } else {
                setFuncoes([]);
                setTotalItens(0);
            }
        } catch (error) {
            console.error('Erro ao carregar funções:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarFuncoes();
    }, [paginaAtual, filtroNome]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroNome, itensPorPagina]);

    const handleDelete = async (idFuncao: string) => {
        if (!confirm('Tem certeza que deseja deletar esta função?')) return;

        try {
            const res = await fetch(`/api/funcao/${idFuncao}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await carregarFuncoes();
                alert('Função deletada com sucesso');
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Erro ao deletar');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar');
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
                            placeholder="Buscar por nome da funcao..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="md:hidden space-y-3">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Carregando...</div>
                    ) : funcoes.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Nenhuma função cadastrada</div>
                    ) : (
                        funcoes.map((funcao) => (
                            <div key={funcao.idFuncao} className="bg-white rounded-lg shadow p-4 space-y-3">
                                <div className="text-sm text-gray-600">Codigo: <span className="font-semibold text-gray-900">{funcao.codigoFuncao}</span></div>
                                <div className="text-sm text-gray-600">Funcao: <span className="font-semibold text-gray-900">{funcao.nomeFuncao}</span></div>
                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                        <Link href={`/funcao/${funcao.idFuncao}/editar`} title="Editar">
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(funcao.idFuncao)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="w-[25%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Código</th>
                                <th className="w-[50%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Nome da Função</th>
                                <th className="w-[10%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : funcoes.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        Nenhuma função cadastrada
                                    </td>
                                </tr>
                            ) : (
                                funcoes.map(funcao => (
                                    <tr key={funcao.idFuncao} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm">{funcao.codigoFuncao}</td>
                                        <td className="px-6 py-4 text-sm">{funcao.nomeFuncao}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Link href={`/funcao/${funcao.idFuncao}/editar`} title="Editar">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <button type="button"
                                                    onClick={() => handleDelete(funcao.idFuncao)}
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
            {/* Informações */}
            <div className="text-sm text-gray-600 text-center py-2">
                Total de Funções: {totalItens}
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
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} – {Math.min(inicio + funcoes.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}
