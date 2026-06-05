'use client'

import { useEffect, useState } from 'react';
import { CalendarClock, FileDown, Plus, Search, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/back-end/components/ui/button';
import { Badge } from '@/back-end/components/ui/badge';
import { hasActionPermission } from '@/lib/permissions';
import { gerarTransferenciaCustoPatrimonioPdf, type ItemTransferenciaRelatorio } from '@/back-end/components/PatrimonioTable/TransferenciaCustoPatrimonioReport';

type CentroCusto = {
    idCCusto: string;
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
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canPrint = hasActionPermission(formularios, 'PRINT');
    const canUpdate = hasActionPermission(formularios, 'UPDATE');

    const [resultadoBusca, setResultadoBusca] = useState<PatrimonioTransferencia | null>(null);
    const [selecionados, setSelecionados] = useState<ItemSelecionado[]>([]);
    const [movimentacoesExecutadas, setMovimentacoesExecutadas] = useState<MovimentacaoExecutada[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [idBusca, setIdBusca] = useState('');
    const [modoBusca, setModoBusca] = useState<'idPat' | 'idP'>('idPat');
    const [buscando, setBuscando] = useState(false);
    const [executando, setExecutando] = useState(false);

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

    const agoraInput = formatarDataHoraInputAgora();

    const buscarPorId = async () => {
        const idBruto = idBusca.trim();
        const id = modoBusca === 'idPat' ? idBruto.toUpperCase() : idBruto;

        if (!id) {
            window.systemAlert?.('aviso', `Informe o ${modoBusca === 'idPat' ? 'idPat' : 'idP'} do patrimônio para buscar.`);
            return;
        }

        try {
            setBuscando(true);
            const response = await fetch(`/api/patrimonio/${encodeURIComponent(id)}`, { cache: 'no-store' });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                window.systemAlert?.('erro', err.message || 'Nao foi possivel buscar o patrimonio.');
                setResultadoBusca(null);
                return;
            }

            const encontrado = (await response.json()) as PatrimonioTransferencia;
            if (!encontrado?.idPat) {
                setResultadoBusca(null);
                window.systemAlert?.('aviso', 'Patrimônio não encontrado para o ID informado.');
                return;
            }

            setResultadoBusca(encontrado);
            setIdBusca('');
        } catch (error) {
            console.error('Erro ao buscar patrimonio:', error);
            window.systemAlert?.('erro', 'Erro ao buscar patrimonio.');
        } finally {
            setBuscando(false);
        }
    };

    const adicionarNaLista = () => {
        if (!resultadoBusca) return;

        const jaExiste = selecionados.some((item) => item.patrimonio.idP === resultadoBusca.idP);
        if (jaExiste) {
            window.systemAlert?.('aviso', 'Este patrimônio já foi inserido na lista abaixo.');
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
        if (!canUpdate) {
            window.systemAlert?.('aviso', 'Voce nao tem permissao para alterar registros.');
            return;
        }
        if (selecionados.length === 0) {
            window.systemAlert?.('aviso', 'Adicione pelo menos um patrimônio na lista selecionada.');
            return;
        }

        const itensValidos = selecionados.filter((item) => item.custoDestino && item.custoDestino !== item.patrimonio.tbCCusto?.idCCusto);
        if (itensValidos.length === 0) {
            window.systemAlert?.('aviso', 'Selecione o centro de custo de destino em pelo menos um item.');
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
                            dataTransferencia: item.dataTransferencia
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
                window.systemAlert?.('aviso', `Transferência parcial concluída. Falhas: ${erros.length}.`);
            } else {
                window.systemAlert?.('sucesso', 'Transferencia de patrimonio realizada com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao transferir patrimonio:', error);
            window.systemAlert?.('erro', 'Erro ao transferir patrimonio.');
        } finally {
            setExecutando(false);
        }
    };

    const gerarPdf = () => {
        if (!canPrint) {
            window.systemAlert?.('aviso', 'Voce nao tem permissao para imprimir/gerar relatorios.');
            return;
        }
        if (movimentacoesExecutadas.length === 0) {
            window.systemAlert?.('aviso', 'Nao ha dados para gerar o relatorio.');
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
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">Transferir Patrimônio por ID</h3>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={gerarPdf}
                        disabled={movimentacoesExecutadas.length === 0}
                        className="h-8 border-yellow-300 bg-yellow-700 hover:bg-yellow-100 gap-2"
                    >
                        <FileDown className="h-4 w-4" />
                        Gerar Relatório
                    </Button>
                </div>

                <p className="text-xs text-gray-500">
                    A transferência pode ser validada para patrimônio em qualquer situação cadastrada; a situação atual é exibida na lista e no relatório.
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
                        placeholder={modoBusca === 'idPat' ? 'Digite o idPat do patrimônio...' : 'Digite o idP do patrimônio...'}
                        className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                        value={modoBusca}
                        onChange={(e) => setModoBusca(e.target.value as 'idPat' | 'idP')}
                        className="w-full md:w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="idPat">idPat</option>
                        <option value="idP">idP</option>
                    </select>
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
                    Use `idPat` para o código do cadastro ou `idP` para o UUID interno.
                </p>

                <div className="overflow-x-auto border rounded-lg">
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

            <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="font-semibold">Lista Selecionada ({selecionados.length})</h2>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-8 border-yellow-300 bg-yellow-700 hover:bg-yellow-100"
                        onClick={executarTransferencias}
                        disabled={selecionados.length === 0 || executando}
                        title="Executar transferências selecionadas"
                    >
                        <CalendarClock className="h-4 w-4 mr-2" />
                        {executando ? 'Executando...' : 'Executar Transferências'}
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[980px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 text-left">Descrição</th>
                                <th className="px-4 text-left">Situação</th>
                                <th className="px-4 text-left">Centro Atual</th>
                                <th className="px-4 text-left">Centro Destino | Data/Hora</th>
                                <th className="px-4 text-left">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selecionados.map((item) => (
                                <tr key={item.patrimonio.idP} className="border-b">
                                    <td className="px-2 py-2 align-middle text-center">{item.patrimonio.idPat}</td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <div>{item.patrimonio.descricaoPat}</div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <Badge className={`transition rounded-lg ${getStatusBadgeClass(item.patrimonio.tbStatusPat?.descricaoStatPat)}`}>
                                            {formatarSituacao(item.patrimonio.tbStatusPat?.descricaoStatPat)}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <Badge className="bg-red-100 text-red-800 transition rounded-lg">
                                            {formatarCentro(item.patrimonio.tbCCusto)}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <div className="mx-auto max-w-[400px] space-y-2 text-left">
                                            <select
                                                value={item.custoDestino}
                                                onChange={(e) => atualizarItem(item.patrimonio.idP, { custoDestino: e.target.value })}
                                                className="w-full border rounded px-3 py-2"
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
                                                className="w-full border rounded px-3 py-2"
                                            />
                                            <div className="text-[10px] text-gray-500">
                                                Hora do sistema sugerida no momento da inclusão.
                                            </div>
                                            <textarea
                                                value={item.observacao}
                                                onChange={(e) => atualizarItem(item.patrimonio.idP, { observacao: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                                                placeholder="Observação (opcional)"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8 text-red-700 hover:text-red-800 mt-1"
                                            onClick={() => removerItem(item.patrimonio.idP)}
                                            title="Remover da lista"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {selecionados.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-2 py-3 text-center text-gray-500">Nenhum patrimônio selecionado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <h2 className="font-semibold">Movimentos Executados ({movimentacoesExecutadas.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[1100px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 text-left">Descrição</th>
                                <th className="px-4 text-left">Situação</th>
                                <th className="px-4 text-left">Movimento</th>
                                <th className="px-4 text-left">Data/Hora</th>
                                <th className="px-4 text-left">Valor</th>
                                <th className="px-4 text-left">Observação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentacoesExecutadas.map((item) => (
                                <tr key={`${item.idPat}-${String(item.dataTransferencia)}`} className="border-b">
                                    <td className="px-2 py-2 align-middle text-center">{item.idPat}</td>
                                    <td className="px-2 py-2 align-middle">
                                        <div>{item.descricaoPat}</div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        <Badge className={`transition rounded-lg ${getStatusBadgeClass(item.situacaoPatrimonio)}`}>
                                            {formatarSituacao(item.situacaoPatrimonio)}
                                        </Badge>
                                    </td>
                                    <td className="px-2 py-2 align-middle">
                                        <div className="text-[12px] text-gray-800">
                                            {item.custoAnterior} <span className="text-gray-500">→</span> {item.custoAtual}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        {item.dataTransferencia ? new Date(item.dataTransferencia).toLocaleString('pt-BR') : '-'}
                                    </td>
                                    <td className="px-2 py-2 align-middle text-center">
                                        {item.valorPat != null ? `R$ ${Number(item.valorPat).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-2 py-2 align-middle text-left">
                                        {item.observacao || '-'}
                                    </td>
                                </tr>
                            ))}
                            {movimentacoesExecutadas.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-2 py-3 text-center text-gray-500">Nenhum movimento executado ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
