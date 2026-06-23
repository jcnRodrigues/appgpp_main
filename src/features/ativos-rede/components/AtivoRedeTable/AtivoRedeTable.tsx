/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Inbox, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TableState from '@/components/TableState/TableState';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { normalizeStatusText } from '@/lib/status';
import { notify as showNotify } from '@/lib/notify';

type AtivoRedeItem = {
    idAtivoRedePk: string;
    codigoAtivoRede: string;
    nomeAtivoRede: string;
    tipoAtivoRede?: string | null;
    fabricanteAtivoRede?: string | null;
    modeloAtivoRede?: string | null;
    fotoAtivoRede?: string | null;
    localInstalacaoAtivoRede?: string | null;
    centroResponsavelAtivoRede?: string | null;
    statusAtivoRede?: string | null;
    dataEntradaAtivoRede?: string | Date | null;
    tbTipoAtivoRede?: {
        descricaoTipoAtivoRede?: string | null;
    } | null;
    tbStatusAtivoRede?: {
        descricaoStatusAtivoRede?: string | null;
    } | null;
    tbCCusto?: {
        codigoCCusto?: string | null;
        descricaoCCusto?: string | null;
    } | null;
    tbTransferenciaAtivoRede?: Array<{
        dataTransferencia: string | Date;
    }> | null;
    tbDevolucaoAtivoRede?: Array<{
        dataInicioDevolucao: string | Date;
    }> | null;
};

type Props = {
    ativos: AtivoRedeItem[];
    totalItens: number;
    paginaAtual: number;
    itensPorPagina: number;
};

function formatarData(valor?: string | Date | null) {
    if (!valor) return '-';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR').format(data);
}

function formatarCentro(item: AtivoRedeItem) {
    if (item.tbCCusto) {
        return [item.tbCCusto.codigoCCusto, item.tbCCusto.descricaoCCusto].filter(Boolean).join(' - ');
    }

    return item.centroResponsavelAtivoRede || '-';
}

export default function AtivoRedeTable({ ativos, totalItens, paginaAtual, itensPorPagina }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [fotoSelecionada, setFotoSelecionada] = useState<{ src: string; nome: string } | null>(null);

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const paginaValida = Math.min(Math.max(paginaAtual, 1), totalPaginas);
    const inicio = totalItens === 0 ? 0 : (paginaValida - 1) * itensPorPagina;

    const getQuery = (pagina?: number, take?: number) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (typeof pagina === 'number') params.set('page', String(pagina));
        if (typeof take === 'number') params.set('take', String(take));
        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
    };

    const irParaPagina = (pagina: number) => {
        const paginaDestino = Math.min(Math.max(pagina, 1), totalPaginas);
        router.push(getQuery(paginaDestino, itensPorPagina));
    };

    const alterarItensPorPagina = (novoTake: number) => {
        router.push(getQuery(1, novoTake));
    };

    const excluirAtivo = async (idAtivoRedePk: string) => {
        const confirmou = window.systemConfirm
            ? await window.systemConfirm('Tem certeza que deseja deletar este ativo de rede?', 'Confirmar exclusão', {
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            })
            : window.confirm('Tem certeza que deseja deletar este ativo de rede?');
        if (!confirmou) return;

        try {
            const response = await fetch(`/api/ativos-rede/${idAtivoRedePk}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.message || 'Erro ao excluir ativo de rede');
            }

            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao excluir ativo de rede';
            showNotify('erro', message);
        }
    };

    const getPaginasVisiveis = () => {
        if (totalPaginas <= 7) {
            return Array.from({ length: totalPaginas }, (_, index) => index + 1);
        }

        const paginas = new Set<number>([1, totalPaginas, paginaValida]);

        if (paginaValida <= 4) {
            [2, 3, 4, 5].forEach((p) => paginas.add(p));
        } else if (paginaValida >= totalPaginas - 3) {
            [totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1].forEach((p) => paginas.add(p));
        } else {
            [paginaValida - 1, paginaValida, paginaValida + 1].forEach((p) => paginas.add(p));
        }

        return Array.from(paginas)
            .filter((p) => p >= 1 && p <= totalPaginas)
            .sort((a, b) => a - b);
    };
    const getStatusPatBadgeClass = (status?: string | null) => {
        const normalizado = normalizeStatusText(status);
        if (normalizado === 'ATIVO') return 'bg-green-100 text-green-800';
        if (normalizado === 'DESMOBILIZACAO') return 'bg-red-100 text-red-800';
        if (normalizado === 'RESERVA') return 'bg-purple-100 text-purple-800';
        if (normalizado === 'EM ESTOQUE') return 'bg-orange-100 text-orange-800';
        if (normalizado === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const paginasVisiveis = getPaginasVisiveis();

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="overflow-hidden">
                <table className="w-full min-w-[1200px] table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-[8%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                            <th className="w-[35%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                            <th className="w-[12%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                            <th className="w-[20%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Local</th>
                            <th className="w-[15%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="w-[8%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Entrada</th>
                            <th className="w-[8%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Últ. Transf.</th>
                            <th className="w-[8%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Últ. Devol.</th>
                            <th className="w-[16%] px-3 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ativos.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-6">
                                    <TableState
                                        icon={Inbox}
                                        title="Nenhum ativo de rede cadastrado"
                                        description="Crie um novo ativo ou ajuste os filtros."
                                        compact
                                    />
                                </td>
                            </tr>
                        ) : (
                            ativos.map((ativo) => {
                                const ultimaTransferencia = ativo.tbTransferenciaAtivoRede?.[0];
                                const ultimaDevolucao = ativo.tbDevolucaoAtivoRede?.[0];

                                return (
                                    <tr key={ativo.idAtivoRedePk} className="border-b transition hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                            {ativo.codigoAtivoRede}
                                            <div className="flex h-14 w-14 shrink-0 items-start justify-center overflow-hidden rounded-xl border bg-slate-50">
                                                {ativo.fotoAtivoRede ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFotoSelecionada({ src: ativo.fotoAtivoRede || '', nome: ativo.nomeAtivoRede })}
                                                        className="h-full w-full cursor-zoom-in"
                                                        title="Ampliar foto"
                                                    >
                                                        <img
                                                            src={ativo.fotoAtivoRede}
                                                            alt={`Foto de ${ativo.nomeAtivoRede}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-semibold uppercase text-slate-400">Sem foto</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            <div className="flex items-start gap-3">

                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900">{ativo.nomeAtivoRede}</div>
                                                    <div className="truncate text-xs text-gray-500">
                                                        {ativo.fabricanteAtivoRede || '-'} {ativo.modeloAtivoRede ? `| ${ativo.modeloAtivoRede}` : ''}
                                                    </div>
                                                    <span
                                                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusPatBadgeClass(
                                                            ativo.tbStatusAtivoRede?.descricaoStatusAtivoRede
                                                        )}`}
                                                    >
                                                        {formatarCentro(ativo)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ativo.tbTipoAtivoRede?.descricaoTipoAtivoRede || ativo.tipoAtivoRede || '-'}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ativo.localInstalacaoAtivoRede || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusPatBadgeClass(
                                                    ativo.tbStatusAtivoRede?.descricaoStatusAtivoRede
                                                )}`}
                                            >
                                                {ativo.tbStatusAtivoRede?.descricaoStatusAtivoRede || ativo.statusAtivoRede || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatarData(ativo.dataEntradaAtivoRede)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ultimaTransferencia ? formatarData(ultimaTransferencia.dataTransferencia) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ultimaDevolucao ? formatarData(ultimaDevolucao.dataInicioDevolucao) : '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    title="Editar ativo de rede"
                                                    className="rounded-lg bg-gray-100 p-2.5 text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <Link href={`/ativos-rede/${ativo.idAtivoRedePk}`}>
                                                        <SquarePen className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    title="Excluir ativo de rede"
                                                    onClick={() => excluirAtivo(ativo.idAtivoRedePk)}
                                                    className="rounded-lg bg-gray-100 p-2.5 text-red-800 transition hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <AlertDialog open={!!fotoSelecionada} onOpenChange={(open) => !open && setFotoSelecionada(null)}>
                <AlertDialogContent className="max-w-4xl border-slate-800 bg-slate-950 text-slate-100">
                    <AlertDialogHeader className="text-left">
                        <AlertDialogTitle className="text-xl text-white">Foto do equipamento</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-300">
                            {fotoSelecionada?.nome || 'Ativo de rede'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {fotoSelecionada ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black">
                            <img
                                src={fotoSelecionada.src}
                                alt={fotoSelecionada.nome}
                                className="max-h-[70vh] w-full object-contain"
                            />
                        </div>
                    ) : null}

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={() => setFotoSelecionada(null)}
                            className="bg-slate-700 text-white hover:bg-slate-600"
                        >
                            Fechar
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>


            <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <label htmlFor="itensPorPagina" className="text-xs text-gray-600">
                        Itens por página:
                    </label>
                    <select
                        id="itensPorPagina"
                        value={itensPorPagina}
                        onChange={(e) => alterarItensPorPagina(Number(e.target.value))}
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
                        onClick={() => irParaPagina(paginaValida - 1)}
                        disabled={paginaValida === 1 || totalItens === 0}
                    >
                        Anterior
                    </Button>

                    {paginasVisiveis.map((pagina, index) => {
                        const ativa = pagina === paginaValida;
                        const paginaAnterior = paginasVisiveis[index - 1];
                        const mostrarReticencias = Boolean(paginaAnterior) && pagina - paginaAnterior > 1;

                        return (
                            <div key={pagina} className="flex items-center gap-2">
                                {mostrarReticencias &&
                                    <span className="px-1 text-sm text-muted-foreground">
                                        ...</span>}
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
                        onClick={() => irParaPagina(paginaValida + 1)}
                        disabled={paginaValida === totalPaginas || totalItens === 0}
                    >
                        Próxima
                    </Button>
                </div>

                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + ativos.length, totalItens)} de {totalItens}
                </div>

                <div className="text-xs text-gray-600 font-medium">
                    Total de ativos de rede: {totalItens}
                </div>
            </div>

        </div>
    );
}

