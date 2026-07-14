'use client'

import { useCallback, useEffect, useState } from 'react';
import { Edit, Filter, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import DeleteGuardButton from '@/components/DeleteGuardButton/DeleteGuardButton';
import { hasModuleActionPermission } from '@/lib/permissions';
import { notify as showNotify } from '@/lib/notify';

interface Licenca {
    idLic: string;
    descricaoLic: string;
    _count?: {
        tbHasLicencaFuncionario: number;
    };
}

export default function LicencaTable() {
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canUpdate = hasModuleActionPermission(formularios, 'LICENCAS_SOFTWARE', 'UPDATE');
    const showNoPermissionAlert = (acao: string) => showNotify('aviso', `Você não tem permissão para ${acao}.`);
    const handleEditClick = (e: React.MouseEvent) => {
        if (canUpdate) return;
        e.preventDefault();
        showNoPermissionAlert('alterar registros');
    };

    const [licencas, setLicencas] = useState<Licenca[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroDescricao, setFiltroDescricao] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(0);

    const carregarLicencas = useCallback(async () => {
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
    }, [filtroDescricao, paginaAtual, itensPorPagina]);

    useEffect(() => {
        carregarLicencas();
    }, [carregarLicencas]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroDescricao, itensPorPagina]);

    const handleDelete = async (idLic: string) => {
        const confirmou = window.systemConfirm
            ? await window.systemConfirm('Tem certeza que deseja deletar esta licenca?', 'Confirmar exclusão', {
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            })
            : window.confirm('Tem certeza que deseja deletar esta licenca?');
        if (!confirmou) return;

        try {
            const response = await fetch(`/api/licenca/${idLic}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await carregarLicencas();
                showNotify('sucesso', 'Licenca deletada com sucesso');
            } else {
                const error = await response.json().catch(() => ({}));
                showNotify('erro', error.message || 'Erro ao deletar licenca');
            }
        } catch (error) {
            console.error('Erro ao deletar licenca:', error);
            showNotify('erro', 'Erro ao deletar licenca');
        }
    };

    useEffect(() => {
        const totalPaginasAtual = Math.max(1, Math.ceil(totalItens / itensPorPagina));
        if (paginaAtual > totalPaginasAtual) {
            setPaginaAtual(totalPaginasAtual);
        }
    }, [totalItens, paginaAtual, itensPorPagina]);

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
        <div className="table-surface w-full space-y-4">
            <div className="sticky top-[calc(var(--app-header-height)+84px)] 
            z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-1">
                <div className="rounded-2xl border border-border/60 bg-[#10191b] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">
                            Filtros
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <input
                            type="text"
                            placeholder="Buscar por descricao da licenca..."
                            value={filtroDescricao}
                            onChange={(e) => setFiltroDescricao(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-1"
                        />
                    </div>
                </div>
            </div>

            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="rounded-2xl border border-border/60 bg-[#10191b] p-4 text-center text-slate-300 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                        Carregando...
                    </div>
                ) : licencas.length === 0 ? (
                    <div className="rounded-2xl border border-border/60 bg-[#10191b] p-4 text-center text-slate-300 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                        Nenhuma licença cadastrada
                    </div>
                ) : (
                    licencas.map((licenca) => (
                        <div key={licenca.idLic} className="rounded-2xl border border-border/60 bg-[#10191b] p-4 space-y-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                            <div className="text-sm font-semibold text-slate-50">{licenca.descricaoLic}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">Qtde Vínculos</div>
                                <div className="text-gray-800 text-right">{licenca._count?.tbHasLicencaFuncionario || 0}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-cyan-500/30 bg-background p-0 text-cyan-500 transition hover:bg-cyan-500/10">
                                    <Link href={`/licenca/${licenca.idLic}/editar`} title="Editar" onClick={handleEditClick}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <DeleteGuardButton
                                    resource="licenca"
                                    recordId={licenca.idLic}
                                    onAuthorizedDelete={() => handleDelete(licenca.idLic)}
                                    className="h-10 w-10 rounded-xl border border-red-500/35 bg-background p-0 text-red-500 transition hover:bg-red-500/10"
                                    title="Excluir"
                                    unauthorizedBehavior="alert"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </DeleteGuardButton>
                            </div>
                        </div>
                    ))
                )}
            </div>

                <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/60 bg-[#10191b] shadow-[0_20px_60px_rgba(0,0,0,0.22)] relative z-0 ">
                <table className="w-full min-w-[900px] table-fixed">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="w-[65%] px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                            <th className="w-[15%] px-6 py-3 text-left text-sm font-semibold text-gray-900">Qtde Vínculos</th>
                            <th className="w-[20%] px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
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
                                                className="h-10 w-10 rounded-xl border border-cyan-500/30 bg-background p-0 text-cyan-500 transition hover:bg-cyan-500/10"
                                            >
                                                <Link href={`/licenca/${licenca.idLic}/editar`} title="Editar" onClick={handleEditClick}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteGuardButton
                                                resource="licenca"
                                                recordId={licenca.idLic}
                                                onAuthorizedDelete={() => handleDelete(licenca.idLic)}
                                                className="h-10 w-10 rounded-xl border border-red-500/35 bg-background p-0 text-red-500 transition hover:bg-red-500/10"
                                                title="Excluir"
                                                unauthorizedBehavior="alert"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </DeleteGuardButton>
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
                    <Button
                        type="button"
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
                                <button
                                    type="button"
                                    onClick={() => irParaPagina(pagina)}
                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${ativa
                                        ? 'bg-accent/20 text-accent border border-accent/35'
                                        : 'bg-card text-foreground border border-border hover:bg-secondary'
                                        }`}
                                >
                                    {pagina}
                                </button>
                            </div>
                        );
                    })}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}
                    >
                        Próxima
                    </Button>
                </div>
                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + licencas.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}
