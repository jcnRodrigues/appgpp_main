'use client'

import { useState, useEffect } from 'react';
import { Edit, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface Funcionario {
    idF: string;
    idMatFun: string;
    nomeFun: string;
    cpfFun?: string | null;
    dataAdmFun?: string | Date | null;
    dataDesFun?: string | Date | null;
    avatarFun?: string | null;
    tbFuncao?: {
        nomeFuncao: string;
    } | null;
    tbStatusFun?: {
        descricaoStatusFun: string;
    } | null;
    tbCCusto?: {
        descricaoCCusto?: string | null;
    } | null;
}

interface FuncionarioTableProps {
    funcionarios?: Funcionario[];
}

export default function FuncionarioTable({ funcionarios: initialFuncionarios }: FuncionarioTableProps) {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios || []);
    const [filtro, setFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [funcaoFiltro, setFuncaoFiltro] = useState('');
    const [loading, setLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(initialFuncionarios?.length || 0);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtro, statusFiltro, funcaoFiltro]);

    useEffect(() => {
        carregarFuncionarios();
    }, [filtro, statusFiltro, funcaoFiltro, paginaAtual]);

    const carregarFuncionarios = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtro) params.append('nome', filtro);
            if (statusFiltro) params.append('status', statusFiltro);
            if (funcaoFiltro) params.append('funcao', funcaoFiltro);
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));

            const response = await fetch(`/api/funcionario?${params}`);
            if (response.ok) {
                const data = await response.json();
                setFuncionarios(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            }
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idF: string) => {
        if (!confirm('Tem certeza que deseja deletar este funcionário?')) return;

        try {
            const response = await fetch(`/api/funcionario/${idF}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await carregarFuncionarios();
                alert('Funcionário deletado com sucesso');
            } else {
                alert('Erro ao deletar funcionário');
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao deletar funcionário');
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

    const maskCpf = (cpf?: string | null) => {
        if (!cpf) return '-';

        const digits = cpf.replace(/\D/g, '');
        if (digits.length !== 11) return cpf;

        return `***.***.***-${digits.slice(-2)}`;
    };

    const getStatusBadgeClass = (status?: string) => {
        if (status === 'ADMITIDO') return 'bg-green-100 text-green-800';
        if (status === 'DEMITIDO') return 'bg-red-100 text-red-800';
        if (status === 'TRANSFERIDO') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="sticky top-[calc(var(--app-header-height)+96px)] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-2">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Filtros</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value.toUpperCase())}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por status..."
                            value={statusFiltro}
                            onChange={(e) => setStatusFiltro(e.target.value.toUpperCase())}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por função..."
                            value={funcaoFiltro}
                            onChange={(e) => setFuncaoFiltro(e.target.value.toUpperCase())}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Lista mobile */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
                        Carregando...
                    </div>
                ) : funcionarios.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
                        Nenhum funcionário encontrado
                    </div>
                ) : (
                    funcionarios.map((funcionario) => (
                        <div key={funcionario.idF} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{funcionario.nomeFun}</div>
                                    <div className="text-xs text-gray-500">Matrícula: {funcionario.idMatFun}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${getStatusBadgeClass(funcionario.tbStatusFun?.descricaoStatusFun)}`}>
                                    {funcionario.tbStatusFun?.descricaoStatusFun || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">CPF</div>
                                <div className="text-gray-800 text-right">{maskCpf(funcionario.cpfFun)}</div>
                                <div className="text-gray-500">Função</div>
                                <div className="text-gray-800 text-right">{funcionario.tbFuncao?.nomeFuncao || '-'}</div>
                                <div className="text-gray-500">Admissão</div>
                                <div className="text-gray-800 text-right">
                                    {funcionario.dataAdmFun ? new Date(funcionario.dataAdmFun).toLocaleDateString('pt-BR') : '-'}
                                </div>
                                <div className="text-gray-500">Centro Custo</div>
                                <div className="text-gray-800 text-right">{funcionario.tbCCusto?.descricaoCCusto || '-'}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                >
                                    <Link href={`/funcionario/${funcionario.idF}`} title="Editar">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(funcionario.idF)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Tabela desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-hidden">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="w-[8%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Matrícula</th>
                                <th className="w-[20%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Nome</th>
                                <th className="w-[10%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">CPF</th>
                                <th className="w-[15%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Função</th>
                                <th className="w-[10%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Data Admissão</th>
                                <th className="w-[10%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Status</th>
                                <th className="w-[15%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-normal break-words">Centro Custo</th>
                                <th className="w-[8%] px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : funcionarios.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        Nenhum funcionário encontrado
                                    </td>
                                </tr>
                            ) : (
                                funcionarios.map((funcionario) => (
                                    <tr key={funcionario.idF} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-3 py-4 text-xs md:text-sm text-gray-900 font-medium whitespace-normal break-words">
                                            {funcionario.idMatFun}
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm text-gray-700 whitespace-normal break-words">
                                            {funcionario.nomeFun}
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm text-gray-700 whitespace-normal break-words">
                                            {maskCpf(funcionario.cpfFun)}
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm text-gray-700 whitespace-normal break-words">
                                            {funcionario.tbFuncao?.nomeFuncao || '-'}
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm text-gray-700 whitespace-normal break-words">
                                            {funcionario.dataAdmFun ? new Date(funcionario.dataAdmFun).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(funcionario.tbStatusFun?.descricaoStatusFun)}`}>
                                                {funcionario.tbStatusFun?.descricaoStatusFun || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm text-gray-700 whitespace-normal break-words">
                                            {funcionario.tbCCusto?.descricaoCCusto || '-'}
                                        </td>
                                        <td className="px-3 py-4 text-xs md:text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-1 md:gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Link href={`/funcionario/${funcionario.idF}`} title="Editar">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <button type="button"
                                                    onClick={() => handleDelete(funcionario.idF)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
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
            </div>

            {/* PaginaÃ§Ã£o */}
            <div className="flex flex-col items-center gap-2 mt-1">
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
                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                                        ativa
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
                <div className="text-xs text-gray-500 text-center">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + funcionarios.length, totalItens)} de {totalItens}
                </div>
                <div className="text-sm text-gray-600 text-center">
                    Total de funcionários: {totalItens}
                </div>
            </div>
        </div>
    );
}



