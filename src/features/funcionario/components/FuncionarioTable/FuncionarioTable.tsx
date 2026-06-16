'use client'

import { useCallback, useEffect, useState } from 'react';
import { Edit, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import DeleteGuardButton from '@/components/DeleteGuardButton/DeleteGuardButton';
import { hasModuleActionPermission } from '@/lib/permissions';
import { notify as showNotify } from '@/lib/notify';

interface Funcionario {
    idF: string;
    idMatFun: string;
    nomeFun: string;
    cpfFun?: string | null;
    dataAdmFun?: string | Date | null;
    tbFuncao?: { nomeFuncao: string } | null;
    tbStatusFun?: { descricaoStatusFun: string } | null;
    tbCCusto?: { descricaoCCusto?: string | null } | null;
}

interface StatusOption {
    idStatusFun: string;
    descricaoStatusFun: string;
}

interface FuncionarioTableProps {
    funcionarios?: Funcionario[];
}

export default function FuncionarioTable({ funcionarios: initialFuncionarios }: FuncionarioTableProps) {
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canUpdate = hasModuleActionPermission(formularios, 'FUNCIONARIOS', 'UPDATE');

    const showNoPermissionAlert = (acao: string) => showNotify('aviso', `Você não tem permissão para ${acao}.`);
    const handleEditClick = (e: React.MouseEvent) => {
        if (canUpdate) return;
        e.preventDefault();
        showNoPermissionAlert('alterar registros');
    };

    const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios || []);
    const [matriculaFiltro, setMatriculaFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(initialFuncionarios?.length || 0);

    useEffect(() => {
        setPaginaAtual(1);
    }, [matriculaFiltro, statusFiltro]);

    const carregarFuncionarios = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (matriculaFiltro) params.append('matricula', matriculaFiltro);
            if (statusFiltro) params.append('status', statusFiltro);
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));

            const response = await fetch(`/api/funcionario?${params}`);
            if (response.ok) {
                const data = await response.json();
                setFuncionarios(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            }
        } catch (error) {
            console.error('Erro ao carregar funcionarios:', error);
        } finally {
            setLoading(false);
        }
    }, [matriculaFiltro, statusFiltro, paginaAtual, itensPorPagina]);

    useEffect(() => {
        carregarFuncionarios();
    }, [carregarFuncionarios]);

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const response = await fetch('/api/funcionario/opcoes');
                if (!response.ok) {
                    console.error('Resposta inválida ao carregar opções de funcionário:', response.status);
                    return;
                }
                const data = await response.json();
                setStatusOptions(Array.isArray(data?.status) ? data.status : []);
            } catch (error) {
                console.error('Erro ao carregar opções de status:', error);
            }
        };

        carregarOpcoes();
    }, []);

    const handleDelete = async (idF: string) => {
        const confirmou = window.systemConfirm
            ? await window.systemConfirm('Tem certeza que deseja deletar este funcionário?', 'Confirmar exclusão', {
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            })
            : window.confirm('Tem certeza que deseja deletar este funcionário?');
        if (!confirmou) return;

        try {
            const response = await fetch(`/api/funcionario/${idF}`, { method: 'DELETE' });
            if (response.ok) {
                await carregarFuncionarios();
                showNotify('sucesso', 'Funcionário deletado com sucesso');
            } else {
                showNotify('erro', 'Erro ao deletar funcionário');
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
            showNotify('erro', 'Erro ao deletar funcionário');
        }
    };

    useEffect(() => {
        const totalPaginasAtual = Math.max(1, Math.ceil(totalItens / itensPorPagina));
        if (paginaAtual > totalPaginasAtual) setPaginaAtual(totalPaginasAtual);
    }, [totalItens, paginaAtual, itensPorPagina]);

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio = (paginaAtual - 1) * itensPorPagina;

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

    const montarPaginasVisiveis = () => {
        if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        if (paginaAtual <= 4) return [1, 2, 3, 4, 5, '...', totalPaginas] as const;
        if (paginaAtual >= totalPaginas - 3) return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas] as const;
        return [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas] as const;
    };

    const paginasVisiveis = montarPaginasVisiveis();

    return (
        <div className="space-y-4">
            <div className="sticky top-[calc(var(--app-header-height)+70px)] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-1">
                <div className="bg-white rounded-lg shadow-md p-2 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Filtros</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por matricula..."
                            value={matriculaFiltro}
                            onChange={(e) => setMatriculaFiltro(e.target.value.toUpperCase())}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

                        <select
                            value={statusFiltro}
                            onChange={(e) => setStatusFiltro(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Filtrar por status...</option>
                            {statusOptions.map((status) => (
                                <option key={status.idStatusFun} value={status.idStatusFun}>
                                    {status.descricaoStatusFun}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
            </div>

            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[1200px] table-fixed">
                    <thead>
                        <tr>
                            <th className="w-[6%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Matrícula</th>
                            <th className="w-[25%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Nome</th>
                            <th className="w-[8%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">CPF</th>
                            <th className="w-[15%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Função</th>
                            <th className="w-[10%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Data Admissão</th>
                            <th className="w-[6%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Status</th>
                            <th className="w-[6%] bg-gray-50 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">Carregando...</td></tr>
                        ) : funcionarios.length === 0 ? (
                            <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">Nenhum funcionário encontrado</td></tr>
                        ) : funcionarios.map((funcionario) => (
                            <tr key={funcionario.idF} className="border-b hover:bg-gray-50 transition">
                                <td className="px-3 py-4 text-xs md:text-sm text-gray-900 font-medium">{funcionario.idMatFun}</td>
                                <td className="px-3 py-4 text-xs md:text-sm text-gray-700">{funcionario.nomeFun}</td>
                                <td className="px-3 py-4 text-xs md:text-sm text-gray-700">{maskCpf(funcionario.cpfFun)}</td>
                                <td className="px-3 py-4 text-xs md:text-sm text-gray-700">{funcionario.tbFuncao?.nomeFuncao || '-'}</td>
                                <td className="px-3 py-4 text-xs md:text-sm text-gray-700">{funcionario.dataAdmFun ? new Date(funcionario.dataAdmFun).toLocaleDateString('pt-BR') : '-'}</td>
                                <td className="px-3 py-4 text-xs md:text-sm"><span className={`px-3 py-1 rounded-full text-xs text-[9px] font-semibold ${getStatusBadgeClass(funcionario.tbStatusFun?.descricaoStatusFun)}`}>{funcionario.tbStatusFun?.descricaoStatusFun || '-'}</span></td>
                                <td className="px-3 py-4 text-xs md:text-sm whitespace-nowrap">
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <Button asChild
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                            <Link href={`/funcionario/${funcionario.idF}`}
                                                title="Editar"
                                                onClick={handleEditClick}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteGuardButton
                                            resource="funcionario"
                                            recordId={funcionario.idF}
                                            onAuthorizedDelete={() => handleDelete(funcionario.idF)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                            title="Excluir"
                                            unauthorizedBehavior="alert">
                                            <Trash2 className="h-4 w-4" />
                                        </DeleteGuardButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center gap-2 mt-1">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <label htmlFor="itensPorPagina" className="text-xs text-gray-600">Itens por pagina:</label>
                    <select id="itensPorPagina" value={itensPorPagina} onChange={(e) => setItensPorPagina(Number(e.target.value))} className="h-9 rounded-md border border-border bg-card px-2 text-sm text-foreground">
                        <option value={10}>
                            10
                        </option>
                        <option value={25}>
                            25
                        </option>
                        <option value={50}>
                            50
                        </option>
                        <option value={100}>
                            100
                        </option>
                    </select>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1 || totalItens === 0}
                        className="bg-card text-foreground border-border hover:bg-secondary"
                    >
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
                        className="bg-card text-foreground border-border hover:bg-secondary"
                    >
                        Proxima
                    </Button>
                </div>
                <div className="text-xs text-gray-500 text-center">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + funcionarios.length, totalItens)} de {totalItens}
                </div>
                <div className="text-sm text-gray-600 text-center">Total de funcionarios: {totalItens}</div>
            </div>
        </div>
    );
}

