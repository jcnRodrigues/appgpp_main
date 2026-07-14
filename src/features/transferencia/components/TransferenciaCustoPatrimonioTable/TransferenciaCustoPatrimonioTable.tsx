'use client'

import { useCallback, useEffect, useState } from 'react';
import { CalendarClock, Plus, Search, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { hasModuleActionPermission } from '@/lib/permissions';
import { gerarTransferenciaCustoPatrimonioPdf, type ItemTransferenciaRelatorio } from '../TransferenciaCustoPatrimonioReport';
import { TableEmptyState } from '../TableEmptyState';

import { notify as showNotify } from '@/lib/notify';

type CentroCusto = {
    idCCusto?: string;
    descricaoCCusto?: string | null;
    codigoCCusto?: string | null;
};

type PatrimonioTransferencia = {
    idP: string;
    idPat: string;
    descricaoPat: string;
    tbStatusPat?: {
        idStatusPat?: string | null;
        descricaoStatPat?: string | null;
    } | null;
    tbCCusto?: CentroCusto | null;
    valorPat?: number | null;
    createdAt?: string | Date | null;
};

type ItemSelecionado = {
    patrimonio: PatrimonioTransferencia;
    custoDestino: string;
    dataTransferencia: string;
    observacao: string;
};

type MovimentacaoExecutada = {
    idPat: string;
    descricaoPat: string;
    situacaoPatrimonio: string;
    custoAnterior: string;
    custoAtual: string;
    observacao?: string | null;
    dataTransferencia: string | Date | null;
    valorPat?: number | null;
};

type ProcessoTransferenciaApi = {
    codigoTransferencia: string;
    statusTransferencia: 'ABERTO' | 'FECHADO';
    dataInicioTransferencia?: string | null;
    dataFechamento?: string | null;
    updatedAt?: string | null;
    linhas?: Array<{
        dataTransferencia?: string | null;
        tbPatrimonio?: {
            idPat?: string | null;
            descricaoPat?: string | null;
            valorPat?: number | null;
            tbStatusPat?: { descricaoStatPat?: string | null } | null;
            tbCCusto?: { descricaoCCusto?: string | null; codigoCCusto?: string | null } | null;
        } | null;
        custoOrigem?: { descricaoCCusto?: string | null; codigoCCusto?: string | null } | null;
        custoDestino?: { descricaoCCusto?: string | null; codigoCCusto?: string | null } | null;
        observacao?: string | null;
    }>;
};

function formatarDataHoraInputAgora() {
    const agora = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;
}

function formatarCentro(centro?: CentroCusto | null, fallback = '-') {
    if (!centro) return fallback;
    return `${centro.codigoCCusto ? `${centro.codigoCCusto} - ` : ''}${centro.descricaoCCusto || centro.idCCusto}`;
}

function formatarSituacao(status?: string | null) {
    return status?.trim() || '-';
}

function getStatusBadgeClass(status?: string | null) {
    const normalizado = (status || '').trim().toUpperCase();
    if (normalizado === 'ATIVO') return 'bg-green-100 text-green-800';
    if (normalizado === 'INATIVO') return 'bg-gray-100 text-gray-700';
    if (normalizado === 'DEVOLUÇÃO' || normalizado === 'DEVOLUCAO') return 'bg-red-100 text-red-800';
    if (normalizado === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
    if (normalizado === 'MANUTENÇÃO' || normalizado === 'MANUTENCAO') return 'bg-yellow-100 text-yellow-800';
    if (normalizado === 'PENDENTE') return 'bg-orange-100 text-orange-800';
    return 'bg-slate-100 text-slate-700';
}

export default function TransferenciaCustoPatrimonioTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canPrint = hasModuleActionPermission(formularios, 'PATRIMONIO', 'PRINT');
    const canTransfer = hasModuleActionPermission(formularios, 'PATRIMONIO', 'TRANSFER');

    const [resultadoBusca, setResultadoBusca] = useState<PatrimonioTransferencia | null>(null);
    const [selecionados, setSelecionados] = useState<ItemSelecionado[]>([]);
    const [movimentacoesExecutadas, setMovimentacoesExecutadas] = useState<MovimentacaoExecutada[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [idBusca, setIdBusca] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [executando, setExecutando] = useState(false);
    const [codigoTransferencia, setCodigoTransferencia] = useState('');
    const [carregandoCodigoTransferencia, setCarregandoCodigoTransferencia] = useState(false);
    const [statusTransferencia, setStatusTransferencia] = useState<'ABERTO' | 'FECHADO'>('ABERTO');
    const [carregandoProcesso, setCarregandoProcesso] = useState(false);

    useEffect(() => {
        const carregarCentros = async () => {
            try {
                const response = await fetch('/api/patrimonio/opcoes');
                if (!response.ok) return;
                const data = await response.json();
                setCentros(data.centros || []);
            } catch (error) {
                console.error('Erro ao carregar centros de custo:', error);
            }
        };
        carregarCentros();
    }, []);

    useEffect(() => {
        const codigo = String(searchParams.get('codigo') || '').trim().toUpperCase();
        if (codigo) setCodigoTransferencia(codigo);
    }, [searchParams]);

    useEffect(() => {
        if (!codigoTransferencia) {
            setMovimentacoesExecutadas([]);
            setStatusTransferencia('ABERTO');
            return;
        }

        const controller = new AbortController();

        const carregarProcesso = async () => {
            setCarregandoProcesso(true);
            try {
                const response = await fetch(`/api/patrimonio/transferencia/processos/${encodeURIComponent(codigoTransferencia)}`, {
                    cache: 'no-store',
                    signal: controller.signal
                });
                const data = (await response.json().catch(() => ({}))) as ProcessoTransferenciaApi;
                if (!response.ok) {
                    throw new Error((data as any).message || 'Falha ao carregar processo de transferência.');
                }

                const linhas = Array.isArray(data.linhas) ? data.linhas : [];
                const executadas = linhas.map((linha) => ({
                    idPat: linha.tbPatrimonio?.idPat || '-',
                    descricaoPat: linha.tbPatrimonio?.descricaoPat || '-',
                    situacaoPatrimonio: linha.tbPatrimonio?.tbStatusPat?.descricaoStatPat || '-',
                    custoAnterior: formatarCentro(linha.custoOrigem || linha.tbPatrimonio?.tbCCusto, '-'),
                    custoAtual: formatarCentro(linha.custoDestino || linha.tbPatrimonio?.tbCCusto, '-'),
                    observacao: linha.observacao || null,
                    dataTransferencia: linha.dataTransferencia || data.dataInicioTransferencia || null,
                    valorPat: linha.tbPatrimonio?.valorPat || null
                })) as MovimentacaoExecutada[];

                setMovimentacoesExecutadas(executadas);
                setStatusTransferencia(data.statusTransferencia || 'ABERTO');
                if (data.statusTransferencia === 'FECHADO') {
                    setSelecionados([]);
                }
            } catch (error) {
                if ((error as any)?.name === 'AbortError') return;
                console.error('Erro ao carregar processo de transferência:', error);
                showNotify('erro', error instanceof Error ? error.message : 'Falha ao carregar processo de transferência.');
            } finally {
                setCarregandoProcesso(false);
            }
        };

        void carregarProcesso();
        return () => controller.abort();
    }, [codigoTransferencia]);

    useEffect(() => {
        const handler = async () => {
            if (carregandoCodigoTransferencia) return;
            setCarregandoCodigoTransferencia(true);
            try {
                const response = await fetch('/api/patrimonio/transferencia/processos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(data.message || 'Falha ao gerar processo de transferência.');
                const codigo = String(data.codigo || '').trim().toUpperCase();
                if (!codigo) throw new Error('Código de transferência inválido.');
                setCodigoTransferencia(codigo);
                router.replace(`/patrimoniolist/transferencia-custo?codigo=${encodeURIComponent(codigo)}`);
            } catch (error) {
                console.error('Erro ao iniciar processo de transferência:', error);
                showNotify('erro', error instanceof Error ? error.message : 'Falha ao gerar processo de transferência.');
            } finally {
                setCarregandoCodigoTransferencia(false);
            }
        };

        window.addEventListener('patrimonio-transferencia:novo-processo', handler);
        return () => window.removeEventListener('patrimonio-transferencia:novo-processo', handler);
    }, [carregandoCodigoTransferencia, router]);

    const agoraInput = formatarDataHoraInputAgora();

    const buscarPorId = async () => {
        const idBruto = idBusca.trim();
        const id = idBruto.toUpperCase();

        if (!id) {
            showNotify('aviso', 'Informe o idPat do patrimônio para buscar.');
            return;
        }

        try {
            setBuscando(true);
            const response = await fetch(`/api/patrimonio/${encodeURIComponent(id)}`, { cache: 'no-store' });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                showNotify('erro', err.message || 'Não foi possível buscar o patrimônio.');
                setResultadoBusca(null);
                return;
            }

            const encontrado = (await response.json()) as PatrimonioTransferencia;
            if (!encontrado?.idPat) {
                setResultadoBusca(null);
                showNotify('aviso', 'patrimônio não encontrado para o ID informado.');
                return;
            }

            setResultadoBusca(encontrado);
            setIdBusca('');
        } catch (error) {
            console.error('Erro ao buscar patrimonio:', error);
            showNotify('erro', 'Erro ao buscar patrimonio.');
        } finally {
            setBuscando(false);
        }
    };

    const adicionarNaLista = () => {
        if (statusTransferencia === 'FECHADO') {
            showNotify('aviso', 'Este processo de transferência está fechado.');
            return;
        }
        if (!resultadoBusca) return;

        const jaExiste = selecionados.some((item) => item.patrimonio.idP === resultadoBusca.idP);
        if (jaExiste) {
            showNotify('aviso', 'Este patrimônio já foi inserido na lista abaixo.');
            return;
        }

        setSelecionados((prev) => [
            ...prev,
            {
                patrimonio: resultadoBusca,
                custoDestino: '',
                dataTransferencia: agoraInput,
                observacao: ''
            }
        ]);
        setResultadoBusca(null);
        setIdBusca('');
    };

    const atualizarItem = (idP: string, campos: Partial<ItemSelecionado>) => {
        setSelecionados((prev) => prev.map((item) => (item.patrimonio.idP === idP ? { ...item, ...campos } : item)));
    };

    const removerItem = (idP: string) => {
        setSelecionados((prev) => prev.filter((item) => item.patrimonio.idP !== idP));
    };

    const executarTransferencias = async () => {
        if (statusTransferencia === 'FECHADO') {
            showNotify('aviso', 'Não é possível editar um processo de transferência fechado.');
            return;
        }
        if (!canTransfer) {
            showNotify('aviso', 'Você não tem permissão para transferir registros.');
            return;
        }
        if (selecionados.length === 0) {
            showNotify('aviso', 'Adicione pelo menos um patrimônio na lista selecionada.');
            return;
        }

        const itensValidos = selecionados.filter((item) => item.custoDestino && item.custoDestino !== item.patrimonio.tbCCusto?.idCCusto);
        if (itensValidos.length === 0) {
            showNotify('aviso', 'Selecione o centro de custo de destino em pelo menos um item.');
            return;
        }

        setExecutando(true);
        try {
            const resultados = await Promise.allSettled(
                itensValidos.map(async (item) => {
                    const response = await fetch(`/api/patrimonio/${item.patrimonio.idP}/transferencias`, {
                        method: 'POST',
                        cache: 'no-store',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            idCustoDestino: item.custoDestino,
                            observacao: item.observacao,
                            dataTransferencia: item.dataTransferencia,
                            codigoTransferencia
                        })
                    });

                    if (!response.ok) {
                        const err = await response.json().catch(() => ({}));
                        throw new Error(err.message || `Falha ao transferir ${item.patrimonio.idPat}`);
                    }

                    await response.json().catch(() => ({}));
                    const centroAtualizado = centros.find((c) => c.idCCusto === item.custoDestino);
                    return {
                        idPat: item.patrimonio.idPat,
                        descricaoPat: item.patrimonio.descricaoPat,
                        situacaoPatrimonio: item.patrimonio.tbStatusPat?.descricaoStatPat || '-',
                        custoAnterior: formatarCentro(item.patrimonio.tbCCusto, '-'),
                        custoAtual: formatarCentro(centroAtualizado, item.custoDestino),
                        observacao: item.observacao?.trim() || null,
                        dataTransferencia: item.dataTransferencia,
                        valorPat: item.patrimonio.valorPat
                    } satisfies MovimentacaoExecutada;
                })
            );

            const concluidos: MovimentacaoExecutada[] = [];
            const concluidosIds = new Set<string>();
            const erros: string[] = [];

            resultados.forEach((resultado, index) => {
                const item = itensValidos[index];
                if (resultado.status === 'fulfilled') {
                    concluidos.push(resultado.value);
                    concluidosIds.add(item.patrimonio.idP);
                } else {
                    erros.push(resultado.reason instanceof Error ? resultado.reason.message : 'Erro ao transferir item.');
                }
            });

            if (concluidos.length > 0) {
                setMovimentacoesExecutadas((prev) => [...concluidos, ...prev]);
                setSelecionados((prev) => prev.filter((item) => !concluidosIds.has(item.patrimonio.idP)));
            }

            if (erros.length > 0) {
                showNotify('aviso', `Transferência parcial concluída. Falhas: ${erros.length}.`);
            } else {
                showNotify('sucesso', 'Transferência de patrimônio realizada com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao transferir patrimonio:', error);
            showNotify('erro', 'Erro ao transferir patrimônio.');
        } finally {
            setExecutando(false);
        }
    };

    const gerarPdf = useCallback(() => {
        if (!canPrint) {
            showNotify('aviso', 'Você não tem permissão para imprimir/gerar relatórios.');
            return;
        }
        if (movimentacoesExecutadas.length === 0) {
            showNotify('aviso', 'Não há dados para gerar o relatório.');
            return;
        }

        const dadosRelatorio: ItemTransferenciaRelatorio[] = movimentacoesExecutadas.map((item) => ({
            idPat: item.idPat,
            descricaoPat: item.descricaoPat,
            situacaoPatrimonio: item.situacaoPatrimonio,
            custoAnteriorTransferencia: item.custoAnterior,
            custoAtualTransferencia: item.custoAtual,
            dataUltimaTransferencia: item.dataTransferencia,
            valorPat: item.valorPat,
            observacao: item.observacao
        }));

        gerarTransferenciaCustoPatrimonioPdf(dadosRelatorio);
    }, [canPrint, movimentacoesExecutadas]);

    useEffect(() => {
        const handler = () => gerarPdf();

        window.addEventListener('patrimonio-transferencia:gerar-pdf', handler);
        return () => window.removeEventListener('patrimonio-transferencia:gerar-pdf', handler);
    }, [gerarPdf]);

    return (
        <div className="table-surface space-y-4">
            <div className="rounded-2xl border border-border/60 bg-[#10191b] p-4 space-y-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">Transferir patrimônio por ID</h3>
                    <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold 
                            ${statusTransferencia === 'FECHADO'
                                ? 'border-rose-200 bg-red-900 text-red-50'
                                : 'border-green-200 bg-green-900 text-green-50'
                            }`}
                    >
                        Processo: {carregandoCodigoTransferencia || carregandoProcesso ? 'Carregando...' : codigoTransferencia || 'TRF--'}
                    </span>
                </div>

                <p className="text-xs text-gray-500">
                    A Transferência pode ser validada para patrimônio em qualquer situação cadastrada; a situação atual é exibida na lista e no relatório.
                </p>

                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <input
                        type="text"
                        value={idBusca}
                        onChange={(e) => setIdBusca(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                buscarPorId();
                            }
                        }}
                        placeholder="Digite o ID do patrimônio...      
                        "
                    className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"

                    />
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={buscarPorId}
                        disabled={buscando}
                        className="text-blue-900 hover:bg-blue-50 rounded-lg transition"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-gray-500">
                    Use `idPat` para localizar o patrimônio.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-border/60 bg-[#0d1416]">
                    <table className="w-full min-w-[980px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Descrição</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Situação</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Centro Atual</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultadoBusca ? (
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-[12px]">{resultadoBusca.idPat}</td>
                                    <td className="px-4 py-3 text-[12px]">
                                        {resultadoBusca.descricaoPat}
                                        <div className="text-[10px] text-gray-500 mt-1">
                                            {resultadoBusca.valorPat != null ? `Valor: R$ ${Number(resultadoBusca.valorPat).toFixed(2)}` : ''}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <Badge className={`transition rounded-lg ${getStatusBadgeClass(resultadoBusca.tbStatusPat?.descricaoStatPat)}`}>
                                            {formatarSituacao(resultadoBusca.tbStatusPat?.descricaoStatPat)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <Badge className="bg-red-100 text-red-800 transition rounded-lg">
                                            {formatarCentro(resultadoBusca.tbCCusto)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <Button
                                            type="button"
                                            onClick={adicionarNaLista}
                                            disabled={selecionados.some((item) => item.patrimonio.idP === resultadoBusca.idP)}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar na lista
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Busque um patrimônio para transferir
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-[#10191b] p-4 space-y-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="font-semibold">Lista Selecionada ({selecionados.length})</h2>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-8 border-yellow-300 bg-yellow-700 hover:bg-yellow-100"
                        onClick={executarTransferencias}
                        disabled={selecionados.length === 0 || executando}
                        title="Executar Transferências selecionadas"
                    >
                        <CalendarClock className="h-4 w-4 mr-2" />
                        {executando ? 'Executando...' : 'Executar Transferências'}
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[920px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-2 py-2 text-left text-[11px]">ID</th>
                                <th className="px-2 py-2 text-left text-[11px]">Descrição</th>
                                <th className="px-2 py-2 text-left text-[11px]">Situação</th>
                                <th className="px-2 py-2 text-left text-[11px]">Centro Atual</th>
                                <th className="px-2 py-2 text-left text-[11px]">Centro Destino | Data/Hora</th>
                                <th className="px-2 py-2 text-left text-[11px]">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selecionados.map((item) => (
                                <tr key={item.patrimonio.idP} className="border-b">
                                    <td className="px-2 py-2 align-middle text-center text-xs">{item.patrimonio.idPat}</td>
                                    <td className="px-2 py-2 align-middle text-center text-xs">
                                        <div>{item.patrimonio.descricaoPat}</div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center text-xs">
                                        <Badge className={`transition rounded-lg px-2 py-0.5 text-[10px] ${getStatusBadgeClass(item.patrimonio.tbStatusPat?.descricaoStatPat)}`}>
                                            {formatarSituacao(item.patrimonio.tbStatusPat?.descricaoStatPat)}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center text-xs">
                                        <Badge className="bg-red-100 text-red-800 transition rounded-lg px-2 py-0.5 text-[10px]">
                                            {formatarCentro(item.patrimonio.tbCCusto)}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <div className="mx-auto max-w-[360px] space-y-2 text-left">
                                            <select
                                                value={item.custoDestino}
                                                onChange={(e) => atualizarItem(item.patrimonio.idP, { custoDestino: e.target.value })}
                                            className="w-full rounded border border-border/60 bg-[#0d1416] px-2 py-1.5 text-xs text-slate-50"
                                            >
                                                <option value="">Selecione o custo de destino</option>
                                                {centros.map((c) => (
                                                    <option key={c.idCCusto} value={c.idCCusto}>
                                                        {formatarCentro(c)}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="datetime-local"
                                                value={item.dataTransferencia}
                                                onChange={(e) => atualizarItem(item.patrimonio.idP, { dataTransferencia: e.target.value })}
                                                className="w-full rounded border border-border/60 bg-[#0d1416] px-2 py-1.5 text-xs text-slate-50"
                                            />
                                            <div className="text-[10px] text-gray-500">
                                                Hora do sistema sugerida no momento da inclusão.
                                            </div>
                                            <textarea
                                                value={item.observacao}
                                                onChange={(e) => atualizarItem(item.patrimonio.idP, { observacao: e.target.value })}
                                            className="h-16 w-full resize-none rounded-lg border border-border/60 bg-[#0d1416] px-2 py-1.5 text-xs text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="Observação (opcional)"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="mt-1 h-7 w-7 text-red-700 hover:text-red-800"
                                            onClick={() => removerItem(item.patrimonio.idP)}
                                            title="Remover da lista"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {selecionados.length === 0 && (
                                <TableEmptyState
                                    colSpan={6}
                                    title="Nenhum patrimônio selecionado"
                                    description="Adicione patrimônios acima para montar a transferência."
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-[#10191b] p-4 space-y-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
                <h2 className="text-sm font-semibold">Movimentos Executados ({movimentacoesExecutadas.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[980px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-2 py-2 text-left text-[11px]">ID</th>
                                <th className="px-2 py-2 text-left text-[11px]">Descrição</th>
                                <th className="px-2 py-2 text-left text-[11px]">Situação</th>
                                <th className="px-2 py-2 text-left text-[11px]">Movimento</th>
                                <th className="px-2 py-2 text-left text-[11px]">Data/Hora</th>
                                <th className="px-2 py-2 text-left text-[11px]">Valor</th>
                                <th className="px-2 py-2 text-left text-[11px]">Observação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentacoesExecutadas.map((item) => (
                                <tr key={`${item.idPat}-${String(item.dataTransferencia)}`} className="border-b">
                                    <td className="px-2 py-2 align-middle text-center text-xs">{item.idPat}</td>
                                    <td className="px-2 py-2 align-middle text-xs">
                                        <div>{item.descricaoPat}</div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center text-xs">
                                        <Badge className={`transition rounded-lg px-2 py-0.5 text-[10px] ${getStatusBadgeClass(item.situacaoPatrimonio)}`}>
                                            {formatarSituacao(item.situacaoPatrimonio)}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-xs">
                                        <div className="text-[11px] text-gray-800">
                                            {item.custoAnterior} <span className="text-gray-500">→</span> {item.custoAtual}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center text-xs">
                                        {item.dataTransferencia ? new Date(item.dataTransferencia).toLocaleString('pt-BR') : '-'}
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center text-xs">
                                        {item.valorPat != null ? `R$ ${Number(item.valorPat).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-2 py-2 align-middle text-left text-xs">
                                        {item.observacao || '-'}
                                    </td>
                                </tr>
                            ))}
                            {movimentacoesExecutadas.length === 0 && (
                                <TableEmptyState
                                    colSpan={7}
                                    title="Nenhum movimento executado"
                                    description="As movimentações concluídas vão aparecer aqui."
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

