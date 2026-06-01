'use client'

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, FileDown, Search, Shuffle, Trash2 } from 'lucide-react';
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
    tbCCusto?: CentroCusto | null;
    custoAnteriorTransferencia?: string | null;
    custoAtualTransferencia?: string | null;
    dataUltimaTransferencia?: string | Date | null;
    valorPat?: number | null;
};

type ItemTransferencia = {
    patrimonio: PatrimonioTransferencia;
    custoDestino: string;
    dataTransferencia: string;
    observacao: string;
    salvando: boolean;
};

function formatarData(valor?: string | Date | null) {
    if (!valor) return '-';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(data);
}

export default function TransferenciaCustoPatrimonioTable() {
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canPrint = hasActionPermission(formularios, 'PRINT');
    const canUpdate = hasActionPermission(formularios, 'UPDATE');

    const [dados, setDados] = useState<PatrimonioTransferencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [idBusca, setIdBusca] = useState('');
    const [itensTransferencia, setItensTransferencia] = useState<ItemTransferencia[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(0);

    const carregar = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));
            params.append('statusAtivo', 'true');
            const response = await fetch(`/api/patrimonio?${params}`);
            if (response.ok) {
                const json = await response.json();
                const dadosFiltrados = (json.data || []).filter((item: PatrimonioTransferencia) =>
                    item.custoAnteriorTransferencia && item.dataUltimaTransferencia
                );
                setDados(dadosFiltrados);
                setTotalItens(typeof json.total === 'number' ? json.total : dadosFiltrados.length);
            }
        } catch (error) {
            console.error('Erro ao carregar patrimonios:', error);
        } finally {
            setLoading(false);
        }
    }, [paginaAtual, itensPorPagina]);

    useEffect(() => {
        carregar();
    }, [carregar]);

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

    const buscarPorId = async () => {
        if (!idBusca.trim()) {
            window.systemAlert?.('aviso', 'Informe o ID do patrimônio para buscar.');
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('idPat', idBusca.trim().toUpperCase());
            params.append('take', '10');
            params.append('statusAtivo', 'true');
            const response = await fetch(`/api/patrimonio?${params}`);
            if (!response.ok) {
                window.systemAlert?.('erro', 'Nao foi possivel buscar o patrimonio.');
                return;
            }

            const json = await response.json();
            const encontrado = (json.data || []).find((p: PatrimonioTransferencia) => p.idPat === idBusca.trim().toUpperCase()) || (json.data || [])[0] || null;
            if (!encontrado) {
                window.systemAlert?.('aviso', 'Patrimônio ativo nao encontrado para o ID informado.');
                return;
            }

            setItensTransferencia((prev) => {
                const jaExiste = prev.some((item) => item.patrimonio.idP === encontrado.idP);
                if (jaExiste) return prev;
                return [
                    ...prev,
                    {
                        patrimonio: encontrado,
                        custoDestino: '',
                        dataTransferencia: new Date().toISOString().slice(0, 10),
                        observacao: '',
                        salvando: false
                    }
                ];
            });
            setIdBusca('');
        } catch (error) {
            console.error('Erro ao buscar patrimonio:', error);
            window.systemAlert?.('erro', 'Erro ao buscar patrimonio.');
        }
    };

    const atualizarItem = (idP: string, campos: Partial<ItemTransferencia>) => {
        setItensTransferencia((prev) => prev.map((item) => item.patrimonio.idP === idP ? { ...item, ...campos } : item));
    };

    const removerItem = (idP: string) => {
        setItensTransferencia((prev) => prev.filter((item) => item.patrimonio.idP !== idP));
    };

    const executarTransferencia = async (idP: string) => {
        if (!canUpdate) {
            window.systemAlert?.('aviso', 'Voce nao tem permissao para alterar registros.');
            return;
        }

        const item = itensTransferencia.find((i) => i.patrimonio.idP === idP);
        if (!item) return;
        if (!item.custoDestino) {
            window.systemAlert?.('aviso', 'Selecione o centro de custo de destino.');
            return;
        }
        if (item.custoDestino === item.patrimonio.tbCCusto?.idCCusto) {
            window.systemAlert?.('aviso', 'Selecione um custo diferente do atual.');
            return;
        }

        try {
            setItensTransferencia((prev) => prev.map((i) => i.patrimonio.idP === idP ? { ...i, salvando: true } : i));
            const response = await fetch(`/api/patrimonio/${idP}/transferencias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idCustoDestino: item.custoDestino,
                    observacao: item.observacao,
                    dataTransferencia: item.dataTransferencia
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                window.systemAlert?.('erro', err.message || 'Nao foi possivel transferir patrimonio.');
                return;
            }

            const resultado = await response.json();
            const centroDestino = centros.find((c) => c.idCCusto === item.custoDestino);
            const atualizado: PatrimonioTransferencia = {
                ...item.patrimonio,
                custoAnteriorTransferencia: item.patrimonio.tbCCusto?.descricaoCCusto || item.patrimonio.tbCCusto?.codigoCCusto || '-',
                custoAtualTransferencia: centroDestino?.descricaoCCusto || centroDestino?.codigoCCusto || item.custoDestino,
                dataUltimaTransferencia: new Date().toISOString(),
                tbCCusto: {
                    idCCusto: item.custoDestino,
                    descricaoCCusto: centroDestino?.descricaoCCusto || centroDestino?.codigoCCusto || item.custoDestino,
                    codigoCCusto: centroDestino?.codigoCCusto || null
                }
            };

            setDados((prev) => {
                const restantes = prev.filter((d) => d.idP !== item.patrimonio.idP);
                return [atualizado, ...restantes];
            });

            window.systemAlert?.('sucesso', 'Transferencia de patrimonio realizada com sucesso.');
            setItensTransferencia((prev) => prev.filter((i) => i.patrimonio.idP !== idP));
            if (resultado?.idPat_CustoPat) {
                await carregar();
            }
        } catch (error) {
            console.error('Erro ao transferir patrimonio:', error);
            window.systemAlert?.('erro', 'Erro ao transferir patrimonio.');
        } finally {
            setItensTransferencia((prev) => prev.map((i) => i.patrimonio.idP === idP ? { ...i, salvando: false } : i));
        }
    };

    const gerarPdf = () => {
        if (!canPrint) {
            window.systemAlert?.('aviso', 'Voce nao tem permissao para imprimir/gerar relatorios.');
            return;
        }
        if (dados.length === 0) {
            window.systemAlert?.('aviso', 'Nao ha dados para gerar o relatorio.');
            return;
        }

        const dadosRelatorio: ItemTransferenciaRelatorio[] = dados.map((p) => ({
            idPat: p.idPat || '-',
            descricaoPat: p.descricaoPat || '-',
            custoAnteriorTransferencia: p.custoAnteriorTransferencia || p.tbCCusto?.descricaoCCusto || '-',
            custoAtualTransferencia: p.custoAtualTransferencia || p.tbCCusto?.descricaoCCusto || '-',
            dataUltimaTransferencia: p.dataUltimaTransferencia,
            valorPat: p.valorPat
        }));

        gerarTransferenciaCustoPatrimonioPdf(dadosRelatorio);
    };

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio = (paginaAtual - 1) * itensPorPagina;

    useEffect(() => {
        const totalPaginasAtual = Math.max(1, Math.ceil(totalItens / itensPorPagina));
        if (paginaAtual > totalPaginasAtual) setPaginaAtual(totalPaginasAtual);
    }, [totalItens, paginaAtual, itensPorPagina]);

    const irParaPagina = (pagina: number) => {
        const paginaValida = Math.min(Math.max(pagina, 1), totalPaginas);
        setPaginaAtual(paginaValida);
    };

    const montarPaginasVisiveis = () => {
        if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        if (paginaAtual <= 4) return [1, 2, 3, 4, 5, '...', totalPaginas] as const;
        if (paginaAtual >= totalPaginas - 3) return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas] as const;
        return [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas] as const;
    };

    const paginasVisiveis = montarPaginasVisiveis();

    return (
        <div className="space-y-4">
            <div className="rounded-lg shadow-md p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">Transferir Patrimônio por ID</h3>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={gerarPdf}
                        disabled={dados.length === 0}
                        className="gap-2"
                    >
                        <FileDown className="h-4 w-4" />
                        Gerar Relatório
                    </Button>
                </div>
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
                        placeholder="Digite o ID do patrimônio..."
                        className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={buscarPorId}
                        className="text-blue-900 hover:bg-blue-50 rounded-lg transition"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full min-w-[980px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Descrição</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Centro Atual</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Centro Destino</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensTransferencia.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Nenhum patrimônio relacionado para transferência
                                    </td>
                                </tr>
                            ) : itensTransferencia.map((item) => (
                                <tr key={item.patrimonio.idP} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-[12px]">{item.patrimonio.idPat}</td>
                                    <td className="px-4 py-3 text-[12px]">
                                        {item.patrimonio.descricaoPat}
                                        <div className="text-[10px] text-gray-500 mt-1">
                                            {item.patrimonio.valorPat != null ? `Valor: R$ ${Number(item.patrimonio.valorPat).toFixed(2)}` : ''}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <Badge className="bg-red-100 text-red-800 transition rounded-lg">
                                            {(item.patrimonio.tbCCusto?.codigoCCusto ? `${item.patrimonio.tbCCusto.codigoCCusto} - ` : '') + (item.patrimonio.tbCCusto?.descricaoCCusto || '-')}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <select
                                            value={item.custoDestino}
                                            onChange={(e) => atualizarItem(item.patrimonio.idP, { custoDestino: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Selecione o custo de destino</option>
                                            {centros.map((c) => (
                                                <option key={c.idCCusto} value={c.idCCusto}>
                                                    {(c.codigoCCusto ? `${c.codigoCCusto} - ` : '') + (c.descricaoCCusto || c.idCCusto)}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="date"
                                            value={item.dataTransferencia}
                                            onChange={(e) => atualizarItem(item.patrimonio.idP, { dataTransferencia: e.target.value })}
                                            className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <textarea
                                            value={item.observacao}
                                            onChange={(e) => atualizarItem(item.patrimonio.idP, { observacao: e.target.value })}
                                            className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                                            placeholder="Observação (opcional)"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => executarTransferencia(item.patrimonio.idP)}
                                                disabled={item.salvando}
                                                aria-label={item.salvando ? 'Transferindo patrimônio' : 'Executar transferência de patrimônio'}
                                                title={item.salvando ? 'Transferindo...' : 'Executar transferência'}
                                                className="h-9 w-9 p-0"
                                            >
                                                <Shuffle className="h-4 w-4 text-green-900 hover:bg-green-100 transition rounded-lg" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removerItem(item.patrimonio.idP)}
                                                disabled={item.salvando}
                                                aria-label="Remover registro da transferência"
                                                title="Remover"
                                                className="h-9 w-9 p-0"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-900 hover:bg-red-100 transition rounded-lg" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[980px]">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Descrição</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Centro Anterior</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Centro Atual</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Data Transferência</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : dados.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Nenhuma transferência encontrada
                                </td>
                            </tr>
                        ) : dados.map((item) => (
                            <tr key={item.idP} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-[10px]">{item.idPat}</td>
                                <td className="px-4 py-3 text-[10px]">{item.descricaoPat}</td>
                                <td className="px-4 py-3 text-[10px]">
                                    <Badge className="bg-red-100 text-red-800 transition rounded-lg">
                                        {item.custoAnteriorTransferencia || item.tbCCusto?.descricaoCCusto || '-'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-[9px]">
                                    <Badge className="bg-green-100 text-green-800 transition rounded-lg">
                                        {item.custoAtualTransferencia || item.tbCCusto?.descricaoCCusto || '-'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-[10px]">
                                    {formatarData(item.dataUltimaTransferencia)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center gap-2 mt-1">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <label className="text-xs text-gray-600">Itens por página:</label>
                    <select
                        value={itensPorPagina}
                        onChange={(e) => setItensPorPagina(Number(e.target.value))}
                        className="h-9 rounded-md border border-border bg-card px-2 text-sm text-foreground"
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
                        className="gap-2 bg-card text-foreground border-border hover:bg-secondary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Anterior
                    </Button>
                    {paginasVisiveis.map((item, idx) =>
                        item === '...'
                            ? <span key={`ellipsis-${idx}`}
                                className="px-1 text-sm text-muted-foreground">
                                ...
                            </span>
                            : (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => irParaPagina(item)}
                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${item === paginaAtual
                                        ? 'bg-accent/20 text-accent border border-accent/35'
                                        : 'bg-card text-foreground border border-border hover:bg-secondary'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}
                        className="gap-2 bg-card text-foreground border-border hover:bg-secondary"
                    >
                        Próxima
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-xs text-gray-500 text-center">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + dados.length, totalItens)} de {totalItens}
                </div>
                <div className="text-sm text-gray-600 text-center">
                    Total de transferências: {totalItens}
                </div>
            </div>
        </div>
    );
}
