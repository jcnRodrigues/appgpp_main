'use client'

import { useState, useEffect } from 'react';
import { Edit, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface Funcionario {
    idF: string;
    idMatFun: string;
    nomeFun: string;
    cpfFun?: string;
    dataAdmFun?: string;
    dataDesFun?: string;
    avatarFun?: string;
    tbFuncao?: {
        nomeFuncao: string;
    };
    tbStatusFun?: {
        descricaoStatusFun: string;
    };
    tbCCusto?: {
        descricaoCCusto?: string;
    };
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
    const itensPorPagina = 10;
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
    }, [totalItens, paginaAtual]);

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio = (paginaAtual - 1) * itensPorPagina;

    const irParaPagina = (pagina: number) => {
        const paginaValida = Math.min(Math.max(pagina, 1), totalPaginas);
        setPaginaAtual(paginaValida);
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

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Matrícula</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">CPF</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Função</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data Admissão</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Centro Custo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
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
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {funcionario.idMatFun}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                            {funcionario.nomeFun}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {funcionario.cpfFun || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {funcionario.tbFuncao?.nomeFuncao || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {funcionario.dataAdmFun ? new Date(funcionario.dataAdmFun).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                funcionario.tbStatusFun?.descricaoStatusFun === 'ADMITIDO' ? 'bg-green-100 text-green-800' :
                                                funcionario.tbStatusFun?.descricaoStatusFun === 'DEMITIDO' ? 'bg-red-100 text-red-800' :
                                                funcionario.tbStatusFun?.descricaoStatusFun === 'TRANSFERIDO' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {funcionario.tbStatusFun?.descricaoStatusFun || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {funcionario.tbCCusto?.descricaoCCusto || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
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
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} – {Math.min(inicio + funcionarios.length, totalItens)} de {totalItens}
                </div>
            </div>

            {/* Informações */}
            <div className="text-sm text-gray-600 text-center py-2">
                Total de funcionários: {totalItens}
            </div>
        </div>
    );
}
