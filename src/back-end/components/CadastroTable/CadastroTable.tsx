'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, FileDown } from 'lucide-react';
import { Button } from '@/back-end/components/ui/button';

interface Alocacao {
    idCad: string;
    dataCadPat: string | null;
    dataDevPat: string | null;
    tbFuncionario: {
        idMatFun: string;
        nomeFun: string;
        cpfFun?: string | null;
    } | null;
    tbPatrimonio: {
        idPat: string;
        descricaoPat: string;
    } | null;
}

export default function CadastroTable() {
    const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [totalItens, setTotalItens] = useState(0);

    const carregarAlocacoes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
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
    }, [paginaAtual]);

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
                const err = await res.json();
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

            // Recebe os dados binários do PDF (equivalente a responseType: 'arraybuffer')
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

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    return (
        <div className="w-full space-y-4">


            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-semibold">Funcionário</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Patrimônio</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data Alocação</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data Devolução</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alocacoes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
                                        {alocacao.tbPatrimonio?.idPat || '-'} - {alocacao.tbPatrimonio?.descricaoPat || '-'}

                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {formatarData(alocacao.dataCadPat)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {formatarData(alocacao.dataDevPat)}
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
                                            <Link href={`/alocacoes/${alocacao.idCad}/editar`}>
                                                <button
                                                    type="button"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </Link>
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
                    <Button
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
                            <button
                                key={pagina}
                                onClick={() => irParaPagina(pagina)}
                                className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                                    ativa
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-700 border hover:bg-gray-50'
                                }`}
                            >
                                {pagina}
                            </button>
                        );
                    })}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}
                    >
                        Próxima
                    </Button>
                </div>
                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1}–{Math.min(inicio + alocacoes.length, totalItens)} de {totalItens}
                </div>
            </div>
        </div>
    );
}
