'use client'

import { useCallback, useEffect, useState } from 'react';
import { Edit, Inbox, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import DeleteGuardButton from '@/components/DeleteGuardButton/DeleteGuardButton';
import { hasModuleActionPermission } from '@/lib/permissions';
import { normalizeStatusText } from '@/lib/status';
import TableState from '@/components/TableState/TableState';
import { notify as showNotify } from '@/lib/notify';

interface Centro {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    tbStatusCCusto?: {
        idStatusCCusto: string;
        descricaoStatusCCusto: string;
    } | null;
    tbEmpresa?: {
        idEmp: string;
        fantasiaEmpresa?: string | null;
        razaoEmpresa?: string | null;
    } | null;
}

type Props = {
    centros: Centro[];
    statusId?: string;
};

export default function CCustoTable({ centros: inicial, statusId = '' }: Props) {
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canUpdate = hasModuleActionPermission(formularios, 'CENTRO_CUSTO', 'UPDATE');
    const showNoPermissionAlert = (acao: string) => showNotify('aviso', `Você não tem permissão para ${acao}.`);
    const handleEditClick = (e: React.MouseEvent) => {
        if (canUpdate) return;
        e.preventDefault();
        showNoPermissionAlert('alterar registros');
    };

    const [centros, setCentros] = useState(inicial);
    const [loading, setLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(inicial.length);

    const getStatusBadgeClass = (status?: string | null) => {
        const value = normalizeStatusText(status);
        if (value === 'ATIVO') return 'bg-green-100 text-green-800';
        if (value === 'MOBILIZADO') return 'bg-blue-100 text-blue-800';
        if (value === 'DESMOBILIZADO') return 'bg-orange-100 text-orange-800';
        if (value === 'INATIVO') return 'bg-gray-100 text-gray-700';
        return 'bg-slate-100 text-slate-700';
    };

    const carregarCentros = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));
            if (statusId) {
                params.append('statusId', statusId);
            }
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
    }, [paginaAtual, itensPorPagina, statusId]);

    useEffect(() => {
        carregarCentros();
    }, [carregarCentros]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [itensPorPagina, statusId]);

    const handleDelete = async (id: string, descricao: string) => {
        const confirmou = window.systemConfirm
            ? await window.systemConfirm(`Deletar "${descricao}"?`, 'Confirmar exclusão', {
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            })
            : window.confirm(`Deletar "${descricao}"?`);
        if (!confirmou) return;

        try {
            const res = await fetch(`/api/ccusto/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await carregarCentros();
            } else {
                showNotify('erro', 'Erro ao deletar');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            showNotify('erro', 'Erro ao deletar');
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
        <div className="space-y-4">
            <div className="md:hidden space-y-3">
                {loading ? (
                    <TableState icon={Inbox}
                        title="Carregando centros de custo" compact />
                ) : centros.length === 0 ? (
                    <TableState icon={Inbox}
                        title="Nenhum centro de custo cadastrado"
                        description="Ajuste os filtros ou adicione um novo centro." compact />
                ) : (
                    centros.map((c) => (
                        <div key={c.idCCusto}
                            className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            <div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {c.descricaoCCusto || '-'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Código: {c.codigoCCusto || '-'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">
                                    Empresa
                                </div>
                                <div className="text-gray-800 text-right">
                                    {c.tbEmpresa?.fantasiaEmpresa || c.tbEmpresa?.razaoEmpresa || '-'}
                                </div>
                                <div className="text-gray-500">
                                    Status
                                </div>
                                <div className="text-gray-800 text-right">
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold 
                                        ${getStatusBadgeClass(c.tbStatusCCusto?.descricaoStatusCCusto)}`}>
                                        {c.tbStatusCCusto?.descricaoStatusCCusto || 'ATIVO'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button asChild
                                    variant="ghost" size="icon"
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                    <Link href={`/ccusto/${c.idCCusto}`}
                                        title="Editar"
                                        onClick={handleEditClick}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <DeleteGuardButton
                                    resource="ccusto"
                                    recordId={c.idCCusto}
                                    onAuthorizedDelete={() => handleDelete(c.idCCusto, c.descricaoCCusto || 'Centro de Custo')}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
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

            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empresa</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4">
                                        <TableState icon={Inbox}
                                            title="Carregando centros de custo" compact />
                                    </td>
                                </tr>
                            ) : centros.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4"><TableState icon={Inbox} title="Nenhum centro de custo cadastrado" description="Ajuste os filtros ou adicione um novo centro." compact /></td>
                                </tr>
                            ) : (
                                centros.map(c => (
                                    <tr key={c.idCCusto} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm">{c.codigoCCusto || '-'}</td>
                                        <td className="px-6 py-4 text-sm">{c.descricaoCCusto || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(c.tbStatusCCusto?.descricaoStatusCCusto)}`}>
                                                {c.tbStatusCCusto?.descricaoStatusCCusto || 'ATIVO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{c.tbEmpresa?.fantasiaEmpresa || c.tbEmpresa?.razaoEmpresa || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Link href={`/ccusto/${c.idCCusto}`}
                                                        title="Editar"
                                                        onClick={handleEditClick}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteGuardButton
                                                    resource="ccusto"
                                                    recordId={c.idCCusto}
                                                    onAuthorizedDelete={() => handleDelete(c.idCCusto, c.descricaoCCusto || 'Centro de Custo')}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
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
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + centros.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}








