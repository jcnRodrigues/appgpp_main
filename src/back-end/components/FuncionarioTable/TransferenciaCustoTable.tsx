'use client'

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, FileDown, Search, Shuffle, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/back-end/components/ui/button';
import { Badge } from '@/back-end/components/ui/badge';
import { hasActionPermission } from '@/lib/permissions';

type FuncionarioTransferencia = {
    idF: string;
    idMatFun: string;
    nomeFun: string;
    tbCCusto?: { idCCusto?: string; descricaoCCusto?: string | null } | null;
    custoAnteriorTransferencia?: string | null;
    custoAtualTransferencia?: string | null;
    dataUltimaTransferencia?: string | Date | null;
};

type ItemTransferencia = {
    funcionario: FuncionarioTransferencia;
    custoDestino: string;
    salvando: boolean;
};

export default function TransferenciaCustoTable() {
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canPrint = hasActionPermission(formularios, 'PRINT');
    const canUpdate = hasActionPermission(formularios, 'UPDATE');

    const [dados, setDados] = useState<FuncionarioTransferencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [matriculaBusca, setMatriculaBusca] = useState('');
    const [itensTransferencia, setItensTransferencia] = useState<ItemTransferencia[]>([]);
    const [centros, setCentros] = useState<Array<{ idCCusto: string; descricaoCCusto?: string | null }>>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(0);

    const carregar = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('modo', 'transferencia-custo');
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));

            const response = await fetch(`/api/funcionario?${params}`);
            if (response.ok) {
                const json = await response.json();
                setDados(json.data || []);
                setTotalItens(typeof json.total === 'number' ? json.total : (json.data || []).length);
            }
        } catch (error) {
            console.error('Erro ao carregar transferencias de custo:', error);
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
                const response = await fetch('/api/ccusto?take=500&forAcessoUsuario=1');
                if (!response.ok) return;
                const data = await response.json();
                setCentros(data.data || []);
            } catch (error) {
                console.error('Erro ao carregar centros de custo:', error);
            }
        };
        carregarCentros();
    }, []);

    const buscarPorMatricula = async () => {
        if (!matriculaBusca.trim()) {
            window.systemAlert?.('aviso', 'Informe a matricula para buscar.');
            return;
        }
        try {
            const params = new URLSearchParams();
            params.append('matricula', matriculaBusca.trim());
            params.append('take', '10');
            const response = await fetch(`/api/funcionario?${params}`);
            if (!response.ok) {
                window.systemAlert?.('erro', 'Nao foi possivel buscar o funcionario.');
                return;
            }

            const json = await response.json();
            const encontrado = (json.data || []).find((f: FuncionarioTransferencia) => f.idMatFun === matriculaBusca.trim()) || (json.data || [])[0] || null;
            if (!encontrado) {
                window.systemAlert?.('aviso', 'Funcionario nao encontrado para a matricula informada.');
                return;
            }

            setItensTransferencia((prev) => {
                const jaExiste = prev.some((item) => item.funcionario.idF === encontrado.idF);
                if (jaExiste) return prev;
                return [...prev, { funcionario: encontrado, custoDestino: '', salvando: false }];
            });
            setMatriculaBusca('');
        } catch (error) {
            console.error('Erro ao buscar por matricula:', error);
            window.systemAlert?.('erro', 'Erro ao buscar funcionario.');
        }
    };

    const atualizarCustoDestino = (idF: string, custoDestino: string) => {
        setItensTransferencia((prev) => prev.map((item) => item.funcionario.idF === idF ? { ...item, custoDestino } : item));
    };

    const removerItemTransferencia = (idF: string) => {
        setItensTransferencia((prev) => prev.filter((item) => item.funcionario.idF !== idF));
    };

    const executarTransferencia = async (idF: string) => {
        if (!canUpdate) {
            window.systemAlert?.('aviso', 'Voce nao tem permissao para alterar registros.');
            return;
        }

        const item = itensTransferencia.find((i) => i.funcionario.idF === idF);
        if (!item) return;
        if (!item.custoDestino) {
            window.systemAlert?.('aviso', 'Selecione o centro de custo de destino.');
            return;
        }
        if (item.custoDestino === item.funcionario.tbCCusto?.idCCusto) {
            window.systemAlert?.('aviso', 'Selecione um custo diferente do atual.');
            return;
        }

        try {
            setItensTransferencia((prev) => prev.map((i) => i.funcionario.idF === idF ? { ...i, salvando: true } : i));
            const response = await fetch(`/api/funcionario/${idF}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idCustoFun: item.custoDestino })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                window.systemAlert?.('erro', err.message || 'Nao foi possivel transferir custo.');
                return;
            }

            const centroDestino = centros.find((c) => c.idCCusto === item.custoDestino);
            const resultadoTransferencia: FuncionarioTransferencia = {
                ...item.funcionario,
                custoAnteriorTransferencia: item.funcionario.tbCCusto?.descricaoCCusto || '-',
                custoAtualTransferencia: centroDestino?.descricaoCCusto || item.custoDestino,
                dataUltimaTransferencia: new Date().toISOString(),
                tbCCusto: {
                    idCCusto: item.custoDestino,
                    descricaoCCusto: centroDestino?.descricaoCCusto || item.custoDestino
                }
            };

            setDados((prev) => {
                const jaExiste = prev.some((d) => d.idF === item.funcionario.idF);
                const semDuplicado = prev.filter((d) => d.idF !== item.funcionario.idF);
                if (!jaExiste) setTotalItens((total) => total + 1);
                return [resultadoTransferencia, ...semDuplicado];
            });

            window.systemAlert?.('sucesso', 'Transferencia de custo realizada com sucesso.');
            setItensTransferencia((prev) => prev.filter((i) => i.funcionario.idF !== idF));
        } catch (error) {
            console.error('Erro ao transferir custo:', error);
            window.systemAlert?.('erro', 'Erro ao transferir custo.');
        } finally {
            setItensTransferencia((prev) => prev.map((i) => i.funcionario.idF === idF ? { ...i, salvando: false } : i));
        }
    };

    const gerarCsv = () => {
        if (!canPrint) {
            window.systemAlert?.('aviso', 'Voce nao tem permissao para imprimir/gerar relatorios.');
            return;
        }
        if (dados.length === 0) {
            window.systemAlert?.('aviso', 'Nao ha dados para gerar o relatorio.');
            return;
        }

        const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
        const linhas = [
            ['Matricula', 'Nome', 'Custo Anterior', 'Custo Atual', 'Data Ultima Transferencia'],
            ...dados.map((f) => [
                f.idMatFun || '-',
                f.nomeFun || '-',
                f.custoAnteriorTransferencia || '-',
                f.custoAtualTransferencia || f.tbCCusto?.descricaoCCusto || '-',
                f.dataUltimaTransferencia ? new Date(f.dataUltimaTransferencia).toLocaleDateString('pt-BR') : '-'
            ])
        ];

        const csv = linhas.map((row) => row.map((c) => esc(c)).join(';')).join('\n');
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-transferencia-custo-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
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
                <h3 className="font-semibold">Transferir Funcionario por Matricula</h3>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <input
                        type="text"
                        value={matriculaBusca}
                        onChange={(e) => setMatriculaBusca(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                buscarPorMatricula();
                            }
                        }}
                        placeholder="Digite a matricula..."
                        className="w-full md:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={buscarPorMatricula}
                        className=" bg-blue-900 hover:bg-blue-100 rounded-lg transition">
                        <Search className="h-4 w-4" />
                    </Button>
                    <div className="md:ml-auto">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={gerarCsv}
                            disabled={dados.length === 0}
                            className="gap-2 bg-green-600 hover:bg-green-100 rounded-lg transition">
                            <FileDown className="h-4 w-4" />
                            Gerar Relatorio
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Matricula</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Nome</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Custo Atual</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Custo Destino</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold">Acao</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensTransferencia.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                        Nenhum funcionario relacionado para transferencia
                                    </td>
                                </tr>
                            ) : itensTransferencia.map((item) => (
                                <tr key={item.funcionario.idF}
                                    className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-[12px]">{item.funcionario.idMatFun}</td>
                                    <td className="px-4 py-3 text-[12px]">{item.funcionario.nomeFun}</td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <Badge className='bg-green-100 text-green-800 transition rounded-lg'>
                                            {item.funcionario.tbCCusto?.descricaoCCusto || '-'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <select
                                            value={item.custoDestino}
                                            onChange={(e) => atualizarCustoDestino(item.funcionario.idF, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Selecione o custo de destino</option>
                                            {centros.map((c) => (
                                                <option key={c.idCCusto} value={c.idCCusto}>{c.descricaoCCusto || c.idCCusto}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-[12px]">
                                        <div className="flex items-center gap-2">
                                            <Button type="button"
                                                variant="ghost"
                                                onClick={() => executarTransferencia(item.funcionario.idF)}
                                                disabled={item.salvando}
                                                aria-label={item.salvando ? 'Transferindo custo' : 'Executar transferencia de custo'}
                                                title={item.salvando ? 'Transferindo...' : 'Executar transferencia'}
                                                className="h-9 w-9 p-0">
                                                <Shuffle className="h-4 w-4 text-green-900 hover:bg-green-100 transition rounded-lg" />
                                            </Button>
                                            <Button type="button"
                                                variant="ghost"
                                                onClick={() => removerItemTransferencia(item.funcionario.idF)}
                                                disabled={item.salvando}
                                                aria-label="Remover registro da transferencia"
                                                title="Remover"
                                                className="h-9 w-9 p-0">
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
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Matricula</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Nome</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Custo Anterior</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Custo Atual</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold">Data Transferencia</th>
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
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Nenhuma transferencia encontrada</td></tr>
                        ) : dados.map((item) => (
                            <tr key={item.idF} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-[12px]">
                                    {item.idMatFun}
                                </td>
                                <td className="px-4 py-3 text-[12px]">
                                    {item.nomeFun}
                                </td>
                                <td className="px-4 py-3 text-[12px]">
                                    <Badge className='bg-red-100 text-red-800 transition rounded-lg'>
                                        {item.custoAnteriorTransferencia || '-'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-[12px]">
                                    <Badge className='bg-green-100 text-green-800 transition rounded-lg'>
                                        {item.custoAtualTransferencia || item.tbCCusto?.descricaoCCusto || '-'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-[12px]">
                                    {item.dataUltimaTransferencia ? new Date(item.dataUltimaTransferencia).toLocaleDateString('pt-BR') : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center gap-2 mt-1">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <label className="text-xs text-gray-600">Itens por pagina:</label>
                    <select value={itensPorPagina} onChange={(e) => setItensPorPagina(Number(e.target.value))} className="h-9 rounded-md border border-border bg-card px-2 text-sm text-foreground">
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
                    {paginasVisiveis.map((item, idx) => item === '...'
                        ? <span key={`ellipsis-${idx}`} className="px-1 text-sm text-muted-foreground">...</span>
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
                        Proxima
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-xs text-gray-500 text-center">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + dados.length, totalItens)} de {totalItens}
                </div>
                <div className="text-sm text-gray-600 text-center">Total de transferencias: {totalItens}</div>
            </div>
        </div>
    );
}
