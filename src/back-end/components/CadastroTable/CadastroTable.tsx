'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, FileDown, Filter } from 'lucide-react';
import { Button } from '@/back-end/components/ui/button';

interface Alocacao {
    idCad: string;
    dataCadPat: string | null;
    dataDevPat: string | null;

    tbFuncionario: {
        idMatFun: string;
        nomeFun: string;
        cpfFun?: string | null;
        tbCCusto?: {
            idCCusto: string;
            codigoCCusto?: string | null;
            descricaoCCusto?: string | null;
        } | null;
        tbStatusFun?: {
            descricaoStatusFun: string;
        } | null;
    } | null;
    tbPatrimonio: {
        idPat: string;
        descricaoPat: string;
        tbCCusto?: {
            idCCusto: string;
            codigoCCusto?: string | null;
            descricaoCCusto?: string | null;
        } | null;
        tbTipoPat?: {
            descricaoTipPat: string;
        } | null;
    } | null;
    tbStatusPat?: {
        idStatusPat: string;
        descricaoStatPat: string;
    } | null;

}

export default function CadastroTable() {
    const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroFuncionario, setFiltroFuncionario] = useState('');
    const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(0);

    const carregarAlocacoes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroFuncionario) params.append('funcionarioBusca', filtroFuncionario);
            if (filtroPatrimonio) params.append('patrimonioBusca', filtroPatrimonio);
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));
            const res = await fetch(`/api/cadastro?${params}`);
            if (res.ok) {
                const data = await res.json();
                setAlocacoes(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            }
        } catch (error) {
            console.error('Erro ao carregar alocações:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarAlocacoes();
    }, [paginaAtual, filtroFuncionario, filtroPatrimonio, itensPorPagina]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroFuncionario, filtroPatrimonio, itensPorPagina]);

    const handleDelete = async (idCad: string) => {
        if (!confirm('Tem certeza que deseja deletar esta alocação?')) return;

        try {
            const res = await fetch(`/api/cadastro/${idCad}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await carregarAlocacoes();
                alert('Alocação deletada com sucesso');
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Erro ao deletar');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar');
        }
    };

    const getStatusBadgeClass = (status?: string) => {
        if (status === 'ADMITIDO') return 'bg-green-100 text-green-800';
        if (status === 'DEMITIDO') return 'bg-red-100 text-red-800';
        if (status === 'TRANSFERIDO') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    const formatarData = (data: string | null) => {
        if (!data) return '-';

        // Preserva a data civil gravada no banco (evita deslocamento por fuso horario).
        const match = data.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            const [, ano, mes, dia] = match;
            return `${dia}/${mes}/${ano}`;
        }

        const parsed = new Date(data);
        if (Number.isNaN(parsed.getTime())) return '-';

        return parsed.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const [pdfLoading, setPdfLoading] = useState<string | null>(null);

    const formatarCentroCusto = (centro?: {
        idCCusto: string;
        codigoCCusto?: string | null;
        descricaoCCusto?: string | null;
    } | null) => {
        if (!centro) return '-';
        return centro.descricaoCCusto || centro.codigoCCusto || centro.idCCusto;
    };

    const compararCustos = (alocacao: Alocacao) => {
        const custoFuncionario = alocacao.tbFuncionario?.tbCCusto?.idCCusto;
        const custoPatrimonio = alocacao.tbPatrimonio?.tbCCusto?.idCCusto;

        if (!custoFuncionario || !custoPatrimonio) return 'SEM_CUSTO';
        return custoFuncionario === custoPatrimonio ? 'IGUAL' : 'DIFERENTE';
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

    const handleGerarTermoPdf = async (alocacao: Alocacao) => {
        const func = alocacao.tbFuncionario;
        const pat = alocacao.tbPatrimonio;
        if (!func || !pat) {
            alert('Dados do funcionário ou patrimônio não disponíveis para gerar o termo.');
            return;
        }
        setPdfLoading(alocacao.idCad);
        try {
            const res = await fetch('/api/cadastro/termo-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nomeFun: func.nomeFun,
                    idMatFun: func.idMatFun,
                    cpfFun: func.cpfFun ?? null,
                    idPat: pat.idPat,
                    descricaoPat: pat.descricaoPat,
                    statusAlocacao: alocacao.tbStatusPat?.descricaoStatPat,
                    tipoPatrimonio: pat.tbTipoPat?.descricaoTipPat
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Falha ao gerar o PDF.');
                return;
            }

            // Recebe os dados binÃƒÂ¡rios do PDF (equivalente a responseType: 'arraybuffer')
            const arrayBuffer = await res.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Termo-Responsabilidade-${func.idMatFun}-${pat.idPat}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            alert('PDF gerado com sucesso. Iniciando o download...');
        } catch (e) {
            console.error(e);
            alert('Erro ao gerar PDF. Tente novamente.');
        } finally {
            setPdfLoading(null);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="sticky top-[calc(var(--app-header-height)+96px)] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-2">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Filtros</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Filtrar funcionario (matricula ou nome)..."
                            value={filtroFuncionario}
                            onChange={(e) => setFiltroFuncionario(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar patrimonio (codigo ou descricao)..."
                            value={filtroPatrimonio}
                            onChange={(e) => setFiltroPatrimonio(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>


            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Carregando...</div>
                ) : alocacoes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Nenhuma alocação registrada</div>
                ) : (
                    alocacoes.map((alocacao) => (
                        <div key={alocacao.idCad} className="bg-white rounded-lg shadow p-4 space-y-3">
                            <div>
                                <div className="text-xs font-semibold text-gray-900">{alocacao.tbFuncionario?.nomeFun || '-'}</div>
                                <div className="text-xs text-gray-500">{alocacao.tbFuncionario?.idMatFun || '-'} • {alocacao.tbPatrimonio?.idPat || '-'}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">Patrimônio</div>
                                <div className="text-gray-800 text-right">{alocacao.tbPatrimonio?.descricaoPat || '-'}</div>
                                <div className="text-gray-500">Alocação</div>
                                <div className="text-gray-800 text-right">{formatarData(alocacao.dataCadPat)}</div>
                                <div className="text-gray-500">Devolução</div>
                                <div className="text-gray-800 text-right">{formatarData(alocacao.dataDevPat)}</div>
                                <div className="text-gray-500">Status</div>
                                <div className="text-gray-800 text-right">{alocacao.tbStatusPat?.descricaoStatPat || '-'}</div>
                                <div className="text-gray-500">Custo Funcionário</div>
                                <div className="text-gray-800 text-right">{formatarCentroCusto(alocacao.tbFuncionario?.tbCCusto)}</div>
                                <div className="text-gray-500">Custo Patrimônio</div>
                                <div className="text-gray-800 text-right">{formatarCentroCusto(alocacao.tbPatrimonio?.tbCCusto)}</div>
                                <div className="text-gray-500">Comparação</div>
                                <div className="text-gray-800 text-right">
                                    {compararCustos(alocacao) === 'IGUAL'
                                        ? 'Permanecer custo'
                                        : compararCustos(alocacao) === 'DIFERENTE'
                                            ? 'Mudar custo'
                                            : '-'}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => handleGerarTermoPdf(alocacao)}
                                    disabled={pdfLoading === alocacao.idCad}
                                    className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                                    title={pdfLoading === alocacao.idCad ? 'Gerando PDF...' : 'Gerar Termo de Responsabilidade (PDF)'}
                                >
                                    <FileDown className="h-4 w-4" />
                                </button>
                                <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                    <Link href={`/alocacoes/${alocacao.idCad}/editar`} title="Editar">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(alocacao.idCad)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full min-w-[1200px] table-fixed">
                    <thead className="bg-gray-50 border-b">
                        <tr className="border-b bg-gray-50">
                            <th className="w-[10%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Funcionário</th>
                            <th className="w-[10%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Patrimônio</th>
                            <th className="w-[3%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Data Alocação</th>
                            <th className="w-[3%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Data Devolução</th>
                            <th className="w-[5%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Comparação</th>
                            <th className="w-[4%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Status</th>
                            <th className="w-[4%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : alocacoes.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma alocação registrada
                                </td>
                            </tr>
                        ) : (
                            alocacoes.map(alocacao => (
                                <tr key={alocacao.idCad} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-2.5 text-[11px] font-medium leading-snug">
                                        {alocacao.tbFuncionario?.idMatFun || '-'} - {alocacao.tbFuncionario?.nomeFun || '-'}
                                        <p className="text-s text-gray-500">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-100 text-green-800">
                                                {formatarCentroCusto(alocacao.tbFuncionario?.tbCCusto)}
                                            </span>
                                        </p>
                                    </td>
                                    <td className="px-4 py-2.5 text-[11px]">
                                        {alocacao.tbPatrimonio?.idPat || '-'} - {alocacao.tbPatrimonio?.descricaoPat || '-'}
                                        <p className="text-s text-gray-500">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-100 text-green-800">
                                                {formatarCentroCusto(alocacao.tbPatrimonio?.tbCCusto)}
                                            </span>
                                        </p>
                                    </td>
                                    <td className="px-4 py-2.5 text-[11px]">
                                        {formatarData(alocacao.dataCadPat)}
                                    </td>
                                    <td className="px-4 py-2.5 text-[11px]">
                                        {formatarData(alocacao.dataDevPat)}
                                    </td>
                                    <td className="px-4 py-2.5 text-[11px]">
                                        {compararCustos(alocacao) === 'IGUAL' ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-100 text-green-800">
                                                Permanecer custo
                                            </span>
                                        ) : compararCustos(alocacao) === 'DIFERENTE' ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-100 text-red-800">
                                                Mudar custo
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-[11px]">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold 
                                            ${alocacao.tbStatusPat?.descricaoStatPat === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                                    alocacao.tbStatusPat?.descricaoStatPat === 'INATIVO' ? 'bg-purple-100 text-purpler-800' :
                                                        alocacao.tbStatusPat?.descricaoStatPat === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' :
                                                            alocacao.tbStatusPat?.descricaoStatPat === 'TRANSFERIDO' ? 'bg-blue-100 text-blue-800' :
                                                                alocacao.tbStatusPat?.descricaoStatPat === 'MANUTENÇÃO' ? 'bg-orange-100 text-orange-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                            {alocacao.tbStatusPat?.descricaoStatPat || '-'}
                                        </span>

                                    </td>
                                    <td className="px-3 py-2.5 text-[11px]">
                                        <div className="flex gap-2 items-center">
                                            <button
                                                type="button"
                                                onClick={() => handleGerarTermoPdf(alocacao)}
                                                disabled={pdfLoading === alocacao.idCad}
                                                className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                                                title={pdfLoading === alocacao.idCad ? 'Gerando PDF...' : 'Gerar Termo de Responsabilidade (PDF)'}
                                            >
                                                <FileDown className="h-4 w-4" />
                                            </button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                                className="text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Link href={`/alocacoes/${alocacao.idCad}/editar`} title="Editar">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(alocacao.idCad)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Excluir"
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

            {/* PaginaÃ§Ã£o */}
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
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + alocacoes.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}










