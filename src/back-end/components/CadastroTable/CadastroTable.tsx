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
        tbStatusFun?: {
            descricaoStatusFun: string;
        } | null;
    } | null;
    tbPatrimonio: {
        idPat: string;
        descricaoPat: string;
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
    const itensPorPagina = 10;
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
    }, [paginaAtual, filtroFuncionario, filtroPatrimonio]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroFuncionario, filtroPatrimonio]);

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

    const formatarData = (data: string | null) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const [pdfLoading, setPdfLoading] = useState<string | null>(null);

    useEffect(() => {
        const totalPaginasAtual = Math.max(1, Math.ceil(totalItens / itensPorPagina));
        if (paginaAtual > totalPaginasAtual) {
            setPaginaAtual(totalPaginasAtual);
        }
    }, [totalItens, paginaAtual]);

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio = (paginaAtual - 1) * itensPorPagina;

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
                    descricaoPat: pat.descricaoPat
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Falha ao gerar o PDF.');
                return;
            }

            // Recebe os dados binÃ¡rios do PDF (equivalente a responseType: 'arraybuffer')
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


            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-semibold">Funcionário</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Status Funcionário</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Patrimônio</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data Alocação</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data Devolução</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : alocacoes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma alocação registrada
                                </td>
                            </tr>
                        ) : (
                            alocacoes.map(alocacao => (
                                <tr key={alocacao.idCad} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {alocacao.tbFuncionario?.idMatFun || '-'} - {alocacao.tbFuncionario?.nomeFun || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span 
                                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                                        ${
                                            alocacao.tbFuncionario?.tbStatusFun?.descricaoStatusFun === 'ADMITIDO' ? 'bg-green-100 text-green-800' :
                                            alocacao.tbFuncionario?.tbStatusFun?.descricaoStatusFun === 'DEMITIDO' ? 'bg-red-100 text-red-800' :
                                            alocacao.tbFuncionario?.tbStatusFun?.descricaoStatusFun === 'TRANSFERIDO' ? 'bg-yellow-100 text-yellow-800' :'bg-gray-100 text-gray-800'
                                        }`}>
                                            {alocacao.tbFuncionario?.tbStatusFun?.descricaoStatusFun || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {alocacao.tbPatrimonio?.idPat || '-'} - {alocacao.tbPatrimonio?.descricaoPat || '-'}

                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {formatarData(alocacao.dataCadPat)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {formatarData(alocacao.dataDevPat)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold 
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
                                    <td className="px-6 py-4 text-sm">
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

            {/* Paginação */}
            <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center gap-2">
                    <Button type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1 || totalItens === 0}
                    >
                        Anterior
                    </Button>
                    {Array.from({ length: totalPaginas }).map((_, index) => {
                        const pagina = index + 1;
                        const ativa = pagina === paginaAtual;
                        return (
                            <button type="button"
                                key={pagina}
                                onClick={() => irParaPagina(pagina)}
                                className={`h-9 w-9 rounded-lg text-sm font-medium transition ${ativa
                                    ? 'bg-accent/20 text-accent border border-accent/35'
                                    : 'bg-card text-foreground border border-border hover:bg-secondary'
                                    }`}
                            >
                                {pagina}
                            </button>
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
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} – {Math.min(inicio + alocacoes.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}

