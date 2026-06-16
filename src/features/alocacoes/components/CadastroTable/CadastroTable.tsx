'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, FileDown, Filter } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import DeleteGuardButton from '@/components/DeleteGuardButton/DeleteGuardButton';
import { hasModuleActionPermission } from '@/lib/permissions';
import { normalizeStatusText } from '@/lib/status';
import { notify as showNotify } from '@/lib/notify';

interface Alocacao {
    idCad: string;
    dataCadPat: string | null;
    dataDevPat: string | null;
    tbDevolucao?: {
        dataInicioDevolucao: string;
        dataFimDevolucao: string | null;
        dataChegadaFornecedor: string | null;
        motivoDevolucao: string | null;
    }[];
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
        tbDevolucao?: {
            dataInicioDevolucao: string;
            dataFimDevolucao: string | null;
            dataChegadaFornecedor: string | null;
            motivoDevolucao: string | null;
        }[];
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

interface CentroOption {
    idCCusto: string;
    descricaoCCusto?: string | null;
    codigoCCusto?: string | null;
}

interface StatusOption {
    idStatusPat: string;
    descricaoStatPat: string;
}

export default function CadastroTable() {
    const { data: session } = useSession();
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canUpdate = hasModuleActionPermission(formularios, 'ALOCACOES', 'UPDATE');
    const canPrint = hasModuleActionPermission(formularios, 'ALOCACOES', 'PRINT');
    const showNoPermissionAlert = (acao: string) => window.systemAlert?.('aviso', `Você não tem permissão para ${acao}.`);
    const handleEditClick = (e: React.MouseEvent) => {
        if (canUpdate) return;
        e.preventDefault();
        showNoPermissionAlert('alterar registros');
    };

    const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroFuncionario, setFiltroFuncionario] = useState('');
    const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
    const [filtroCentroCusto, setFiltroCentroCusto] = useState('');
    const [filtroStatusIds, setFiltroStatusIds] = useState<string[]>([]);
    const [centroOpcoes, setCentroOpcoes] = useState<CentroOption[]>([]);
    const [statusOpcoes, setStatusOpcoes] = useState<StatusOption[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(0);
    const [pdfLoading, setPdfLoading] = useState<string | null>(null);
    const statusDropdownRef = useRef<HTMLDetailsElement | null>(null);

    const centroOpcoesOrdenadas = useMemo(() => {
        return [...centroOpcoes].sort((a, b) => {
            const descricaoA = (a.descricaoCCusto || '').trim();
            const descricaoB = (b.descricaoCCusto || '').trim();
            const byDescricao = descricaoA.localeCompare(descricaoB, 'pt-BR', { sensitivity: 'base' });
            if (byDescricao !== 0) return byDescricao;

            const codigoA = (a.codigoCCusto || '').trim();
            const codigoB = (b.codigoCCusto || '').trim();
            return codigoA.localeCompare(codigoB, 'pt-BR', { sensitivity: 'base' });
        });
    }, [centroOpcoes]);

    const carregarAlocacoes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtroFuncionario) params.append('funcionarioBusca', filtroFuncionario);
            if (filtroPatrimonio) params.append('patrimonioBusca', filtroPatrimonio);
            if (filtroCentroCusto) params.append('centroBusca', filtroCentroCusto);
            filtroStatusIds.forEach((statusId) => params.append('statusId', statusId));
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
    }, [filtroFuncionario, filtroPatrimonio, filtroCentroCusto, filtroStatusIds, paginaAtual, itensPorPagina]);

    useEffect(() => {
        carregarAlocacoes();
    }, [carregarAlocacoes]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [filtroFuncionario, filtroPatrimonio, filtroCentroCusto, filtroStatusIds, itensPorPagina]);

    useEffect(() => {
        const carregarCentros = async () => {
            try {
                const response = await fetch('/api/ccusto?take=500&forAcessoUsuario=1');
                if (!response.ok) return;
                const data = await response.json();
                setCentroOpcoes(data.data || []);
            } catch (error) {
                console.error('Erro ao carregar centros de custo:', error);
            }
        };
        carregarCentros();
    }, []);

    useEffect(() => {
        const carregarStatus = async () => {
            try {
                const response = await fetch('/api/cadastro?opções=true');
                if (!response.ok) return;
                const data = await response.json();
                setStatusOpcoes(data.statusPatrimonio || []);
            } catch (error) {
                console.error('Erro ao carregar status de patrimônio:', error);
            }
        };
        carregarStatus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = statusDropdownRef.current;
            if (!dropdown || !dropdown.open) return;
            const target = event.target as Node | null;
            if (target && !dropdown.contains(target)) {
                dropdown.open = false;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const totalPaginasAtual = Math.max(1, Math.ceil(totalItens / itensPorPagina));
        if (paginaAtual > totalPaginasAtual) setPaginaAtual(totalPaginasAtual);
    }, [totalItens, paginaAtual, itensPorPagina]);

    const handleDelete = async (idCad: string) => {
        const confirmou = window.systemConfirm
            ? await window.systemConfirm('Tem certeza que deseja deletar esta alocação?', 'Confirmar exclusão', {
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            })
            : window.confirm('Tem certeza que deseja deletar esta alocação?');
        if (!confirmou) return;
        try {
            const res = await fetch(`/api/cadastro/${idCad}`, { method: 'DELETE' });
            if (res.ok) {
                await carregarAlocacoes();
                showNotify('sucesso', 'Alocação deletada com sucesso');
            } else {
                const err = await res.json().catch(() => ({}));
                showNotify('erro', err.message || 'Erro ao deletar');
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotify('erro', 'Erro ao deletar');
        }
    };

    const getStatusBadgeClass = (status?: string) => {
        const normalizado = normalizeStatusText(status);
        if (normalizado === 'ADMITIDO') return 'bg-green-100 text-green-800';
        if (normalizado === 'DEMITIDO') return 'bg-red-100 text-red-800';
        if (normalizado === 'TRANSFERIDO') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };
    const getStatusPatBadgeClass = (status?: string) => {
        const normalizado = normalizeStatusText(status);
        if (normalizado === 'ATIVO') return 'bg-green-100 text-green-800';
        if (normalizado === 'INATIVO') return 'bg-purple-100 text-purple-800';
        if (normalizado === 'DEVOLUCAO') return 'bg-red-100 text-red-800';
        if (normalizado === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
        if (normalizado === 'MANUTENCAO') return 'bg-orange-100 text-orange-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const formatarData = (data: string | null) => {
        if (!data) return '-';
        const match = data.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            const [, ano, mes, dia] = match;
            return `${dia}/${mes}/${ano}`;
        }
        const parsed = new Date(data);
        if (Number.isNaN(parsed.getTime())) return '-';
        return parsed.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

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

    const handleGerarTermoPdf = async (alocacao: Alocacao) => {
        if (!canPrint) {
            showNoPermissionAlert('imprimir/gerar relatórios');
            return;
        }
        const func = alocacao.tbFuncionario;
        const pat = alocacao.tbPatrimonio;
        if (!func || !pat) {
            showNotify('aviso', 'Dados do funcionário ou patrimônio não disponíveis para gerar o termo.');
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
                showNotify('erro', err.message || 'Falha ao gerar o PDF.');
                return;
            }

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
            showNotify('sucesso', 'PDF gerado com sucesso. Iniciando o download...');
        } catch (e) {
            console.error(e);
            showNotify('erro', 'Erro ao gerar PDF. Tente novamente.');
        } finally {
            setPdfLoading(null);
        }
    };

    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio = (paginaAtual - 1) * itensPorPagina;

    const getPaginasVisiveis = () => {
        if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, index) => index + 1);
        const paginas = new Set<number>([1, totalPaginas, paginaAtual]);
        if (paginaAtual <= 4) {
            [2, 3, 4, 5].forEach((p) => paginas.add(p));
        } else if (paginaAtual >= totalPaginas - 3) {
            [totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1].forEach((p) => paginas.add(p));
        } else {
            [paginaAtual - 1, paginaAtual, paginaAtual + 1].forEach((p) => paginas.add(p));
        }
        return Array.from(paginas).filter((p) => p >= 1 && p <= totalPaginas).sort((a, b) => a - b);
    };

    const paginasVisiveis = getPaginasVisiveis();
    const irParaPagina = (pagina: number) => setPaginaAtual(Math.min(Math.max(pagina, 1), totalPaginas));

    return (
        <div className="w-full space-y-4">
            <div className="sticky top-[calc(var(--app-header-height)+96px)] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-2">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Filtros</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="text"
                            placeholder="Filtrar funcionário (matrícula ou nome)..."
                            value={filtroFuncionario}
                            onChange={(e) => setFiltroFuncionario(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="text"
                            placeholder="Filtrar patrimônio (código ou descrição)..."
                            value={filtroPatrimonio}
                            onChange={(e) => setFiltroPatrimonio(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        <select value={filtroCentroCusto}
                            onChange={(e) => setFiltroCentroCusto(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">
                                Todos os centros de custo
                            </option>
                            {centroOpcoesOrdenadas.map((centro) => (
                                <option key={centro.idCCusto} value={centro.idCCusto}>
                                    {centro.descricaoCCusto || 'Sem descrição'}{centro.codigoCCusto ? ` (${centro.codigoCCusto})` : ''}
                                </option>
                            ))}
                        </select>
                        <details ref={statusDropdownRef} className="relative">
                            <summary className="list-none px-4 py-2 border rounded-lg cursor-pointer select-none flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary">
                                <span className="text-sm text-gray-700">{filtroStatusIds.length > 0 ? `${filtroStatusIds.length} status selecionado(s)` : 'Todos os status'}
                                </span>
                                <span className="text-gray-500 text-xs">?
                                </span>
                            </summary>
                            <div className="absolute z-40 mt-1 w-full bg-white border rounded-lg shadow-lg p-3 max-h-56 overflow-y-auto space-y-2">
                                {statusOpcoes.map((status) => (
                                    <label key={status.idStatusPat} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox"
                                            checked={filtroStatusIds.includes(status.idStatusPat)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFiltroStatusIds((prev) => [...prev, status.idStatusPat]);
                                                    return;
                                                }
                                                setFiltroStatusIds((prev) => prev.filter((id) => id !== status.idStatusPat));
                                            }} className="h-4 w-4 accent-primary" />
                                        <span>{status.descricaoStatPat}</span>
                                    </label>
                                ))}
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Carregando...</div>
                ) : alocacoes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">Nenhuma alocação registrada</div>
                ) : alocacoes.map((alocacao) => (
                    <div key={alocacao.idCad} className="bg-white rounded-lg shadow p-4 space-y-3">
                        <div>
                            <div className="text-xs font-semibold text-gray-900">
                                {alocacao.tbFuncionario?.nomeFun || '-'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {alocacao.tbFuncionario?.idMatFun || '-'} - {alocacao.tbPatrimonio?.idPat || '-'}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-gray-500">
                                Patrimônio
                            </div>
                            <div className="text-gray-800 text-right">
                                {alocacao.tbPatrimonio?.descricaoPat || '-'}
                            </div>
                            <div className="text-gray-500">
                                Alocação
                            </div>
                            <div className="text-gray-800 text-right">
                                {formatarData(alocacao.dataCadPat)}
                            </div>
                            <div className="text-gray-500">
                                Devolução Interna
                            </div>
                            <div className="text-gray-800 text-right">
                                {formatarData(alocacao.dataDevPat)}
                            </div>
                            <div className="text-gray-500">
                                Status
                            </div>
                            <div className="text-gray-800 text-right">
                                {alocacao.tbStatusPat?.descricaoStatPat || '-'}
                            </div>
                            <div className="text-gray-500">
                                Início Devolução
                            </div>
                            <div className="text-gray-800 text-right">
                                {formatarData(alocacao.tbPatrimonio?.tbDevolucao?.[0]?.dataInicioDevolucao || null)}
                            </div>
                            <div className="text-gray-500">
                                Fim Devolução
                            </div>
                            <div className="text-gray-800 text-right">
                                {formatarData(alocacao.tbPatrimonio?.tbDevolucao?.[0]?.dataFimDevolucao ||
                                    alocacao.tbPatrimonio?.tbDevolucao?.[0]?.dataChegadaFornecedor || null
                                )}
                            </div>
                            <div className="text-gray-500">
                                Custo Funcionário
                            </div>
                            <div className="text-gray-800 text-right">
                                {formatarCentroCusto(alocacao.tbFuncionario?.tbCCusto)}
                            </div>
                            <div className="text-gray-500">
                                Custo Patrimônio
                            </div>
                            <div className="text-gray-800 text-right">
                                {formatarCentroCusto(alocacao.tbPatrimonio?.tbCCusto)}
                            </div>
                            <div className="text-gray-500">
                                Comparação
                            </div>
                            <div className="text-gray-800 text-right">
                                {compararCustos(alocacao) === 'IGUAL' ? 'Permanecer custo' : compararCustos(alocacao) === 'DIFERENTE' ? 'Mudar custo' : '-'}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button type="button"
                                onClick={() => handleGerarTermoPdf(alocacao)}
                                disabled={pdfLoading === alocacao.idCad}
                                className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                                title={pdfLoading === alocacao.idCad ? 'Gerando PDF...' : 'Gerar Termo de Responsabilidade (PDF)'}>
                                <FileDown className="h-4 w-4" />
                            </button>
                            <Button asChild
                                variant="ghost"
                                size="icon"
                                className="text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                <Link href={`/alocacoes/${alocacao.idCad}/editar`}
                                    title="Editar"
                                    onClick={handleEditClick}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <DeleteGuardButton resource="cadastro"
                                recordId={alocacao.idCad}
                                onAuthorizedDelete={() => handleDelete(alocacao.idCad)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Excluir"
                                unauthorizedBehavior="alert">
                                <Trash2 className="h-4 w-4" />
                            </DeleteGuardButton>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full min-w-[1000px] table-fixed">
                    <thead className="bg-gray-50 border-b">
                        <tr className="border-b bg-gray-50">
                            <th className="w-[20%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Funcionário</th>
                            <th className="w-[20%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Patrimônio</th>
                            <th className="w-[6%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Data Alocação</th>
                            <th className="w-[6%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Data Devolução Interna</th>
                            <th className="w-[6%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Início Devolução</th>
                            <th className="w-[6%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Fim Devolução</th>
                            <th className="w-[12%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Comparação</th>
                            <th className="w-[9%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Status</th>
                            <th className="w-[12%] px-4 py-3 text-left text-[11px] font-semibold text-gray-900">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">Carregando...</td>
                            </tr>
                        ) : alocacoes.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">Nenhuma alocação registrada</td></tr>
                        ) : alocacoes.map((alocacao) => (
                            <tr key={alocacao.idCad} className="border-b hover:bg-gray-50 transition">
                                <td className="px-4 py-2.5 text-[11px] font-medium leading-snug">
                                    {alocacao.tbFuncionario?.idMatFun || '-'} - {alocacao.tbFuncionario?.nomeFun || '-'}
                                    <p className="text-s text-gray-500">
                                        <span className={`inline-flex px-3 py-1 rounded-full  text-[7px] font-semibold 
                                            ${getStatusBadgeClass(alocacao.tbFuncionario?.tbStatusFun?.descricaoStatusFun)}`}>
                                            {alocacao.tbFuncionario?.tbCCusto?.descricaoCCusto || '-'}
                                        </span>
                                    </p>
                                </td>
                                <td className="px-4 py-2.5 text-[11px]">
                                    {alocacao.tbPatrimonio?.idPat || '-'} - {alocacao.tbPatrimonio?.descricaoPat || '-'}
                                    <p className="text-s text-gray-500">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[7px] font-semibold 
                                        ${getStatusPatBadgeClass(alocacao.tbStatusPat?.descricaoStatPat)}`}>
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
                                    {formatarData(alocacao.tbPatrimonio?.tbDevolucao?.[0]?.dataInicioDevolucao || null)}
                                </td>
                                <td className="px-4 py-2.5 text-[11px]">
                                    {formatarData(alocacao.tbPatrimonio?.tbDevolucao?.[0]?.dataFimDevolucao ||
                                        alocacao.tbPatrimonio?.tbDevolucao?.[0]?.dataChegadaFornecedor || null)}
                                </td>
                                <td className="px-4 py-2.5 text-[11px]">
                                    {compararCustos(alocacao) === 'IGUAL' ?
                                        <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-100 text-green-800">
                                            Permanecer custo
                                        </span>
                                        : compararCustos(alocacao) === 'DIFERENTE' ?
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-100 text-red-800">
                                                Mudar custo
                                            </span> : '-'}
                                </td>
                                <td className="px-4 py-2.5 text-[11px]">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold 
                                        ${getStatusPatBadgeClass(alocacao.tbStatusPat?.descricaoStatPat)}`}>{alocacao.tbStatusPat?.descricaoStatPat || '-'}
                                    </span>
                                </td>
                                <td className="px-3 py-2.5 text-[10px]">
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleGerarTermoPdf(alocacao)}
                                            disabled={pdfLoading === alocacao.idCad}
                                            className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                                            title={pdfLoading === alocacao.idCad ? 'Gerando PDF...' : 'Gerar Termo de Responsabilidade (PDF)'}>
                                            <FileDown className="h-4 w-4" />
                                        </button>
                                        <Button asChild
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                            <Link href={`/alocacoes/${alocacao.idCad}/editar`}
                                                title="Editar"
                                                onClick={handleEditClick}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteGuardButton
                                            resource="cadastro"
                                            recordId={alocacao.idCad}
                                            onAuthorizedDelete={() => handleDelete(alocacao.idCad)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir" unauthorizedBehavior="alert">
                                            <Trash2 className="h-4 w-4" />
                                        </DeleteGuardButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 items-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <label htmlFor="itensPorPagina" className="text-xs text-gray-600">Itens por página:</label>
                    <select id="itensPorPagina" value={itensPorPagina} onChange={(e) => setItensPorPagina(Number(e.target.value))} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                        <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
                    </select>
                    <Button type="button" variant="outline" size="sm" onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1 || totalItens === 0}>Anterior</Button>
                    {paginasVisiveis.map((pagina, index) => {
                        const ativa = pagina === paginaAtual;
                        const paginaAnterior = paginasVisiveis[index - 1];
                        const mostrarReticencias = Boolean(paginaAnterior) && pagina - paginaAnterior > 1;
                        return (
                            <div key={pagina} className="flex items-center gap-2">
                                {mostrarReticencias && <span className="px-1 text-sm text-muted-foreground">...</span>}
                                <button
                                    type="button"
                                    onClick={() => irParaPagina(pagina)}
                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition 
                                ${ativa ? 'bg-accent/20 text-accent border border-accent/35' : 'bg-card text-foreground border border-border hover:bg-secondary'}`}>
                                    {pagina}
                                </button>
                            </div>
                        );
                    })}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas || totalItens === 0}>
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




