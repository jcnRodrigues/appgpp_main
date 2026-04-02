'use client'

import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface Patrimonio {
    idP: string;
    idPat: string;
    descricaoPat: string;
    valorPat: number | null;
    dataEntPat: string | Date | null;
    tbTipoPat?: {
        descricaoTipPat?: string | null;
    } | null;
    tbStatusPat?: {
        descricaoStatPat: string;
    } | null;
    tbCCusto?: {
        descricaoCCusto?: string | null;
    } | null;
}

interface StatusOption {
    idStatusPat: string;
    descricaoStatPat: string;
}

interface CentroOption {
    idCCusto: string;
    descricaoCCusto?: string | null;
    codigoCCusto?: string | null;
}

interface PatrimonioTableProps {
    patrimonios?: Patrimonio[];
}

export default function PatrimonioTable({ patrimonios: initialPatrimonios }: PatrimonioTableProps) {
    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>(initialPatrimonios || []);
    const [idFiltro, setIdFiltro] = useState('');
    const [statusSelecionados, setStatusSelecionados] = useState<string[]>([]);
    const [centroFiltro, setCentroFiltro] = useState('');
    const [statusOpcoes, setStatusOpcoes] = useState<StatusOption[]>([]);
    const [centroOpcoes, setCentroOpcoes] = useState<CentroOption[]>([]);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [totalItens, setTotalItens] = useState(initialPatrimonios?.length || 0);

    useEffect(() => {
        setPaginaAtual(1);
    }, [idFiltro, statusSelecionados, centroFiltro, itensPorPagina]);

    useEffect(() => {
        carregarPatrimonios();
    }, [idFiltro, statusSelecionados, centroFiltro, paginaAtual]);

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const response = await fetch('/api/patrimonio/opcoes');
                if (response.ok) {
                    const data = await response.json();
                    setStatusOpcoes(data.status || []);
                    setCentroOpcoes(data.centros || []);
                }
            } catch (error) {
                console.error('Erro ao carregar opções de filtro:', error);
            }
        };

        carregarOpcoes();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!statusDropdownRef.current) return;
            if (!statusDropdownRef.current.contains(event.target as Node)) {
                setStatusDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const carregarPatrimonios = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (idFiltro) params.append('idPat', idFiltro);
            if (statusSelecionados.length > 0) params.append('statusIds', statusSelecionados.join(','));
            if (centroFiltro) params.append('centroId', centroFiltro);
            params.append('skip', String((paginaAtual - 1) * itensPorPagina));
            params.append('take', String(itensPorPagina));

            const response = await fetch(`/api/patrimonio?${params}`);
            if (response.ok) {
                const data = await response.json();
                setPatrimonios(data.data || []);
                setTotalItens(typeof data.total === 'number' ? data.total : (data.data || []).length);
            }
        } catch (error) {
            console.error('Erro ao carregar patrimônios:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = (idStatusPat: string) => {
        setStatusSelecionados((prev) =>
            prev.includes(idStatusPat)
                ? prev.filter((id) => id !== idStatusPat)
                : [...prev, idStatusPat]
        );
    };

    const handleDelete = async (idP: string) => {
        if (!confirm('Tem certeza que deseja deletar este patrimônio?')) return;

        try {
            const response = await fetch(`/api/patrimonio/${idP}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await carregarPatrimonios();
                alert('Patrimônio deletado com sucesso');
            } else {
                alert('Erro ao deletar patrimônio');
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao deletar patrimônio');
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
                            placeholder="Buscar por ID..."
                            value={idFiltro}
                            onChange={(e) => setIdFiltro(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                            value={centroFiltro}
                            onChange={(e) => setCentroFiltro(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Todos os centros de custo</option>
                            {centroOpcoes.map((centro) => (
                                <option key={centro.idCCusto} value={centro.idCCusto}>
                                    {centro.descricaoCCusto || 'Sem descricao'}{centro.codigoCCusto ? ` (${centro.codigoCCusto})` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setStatusDropdownOpen((prev) => !prev)}
                                className="w-full px-4 py-2 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between"
                            >
                                <span className="truncate">
                                    {statusSelecionados.length > 0
                                        ? `Status selecionados: ${statusSelecionados.length}`
                                        : 'Todos os status'}
                                </span>
                                <ChevronDown className={`h-4 w-4 transition ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {statusDropdownOpen && (
                                <div className="absolute z-30 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-auto p-2 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => setStatusSelecionados([])}
                                        className="w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100"
                                    >
                                        Todos os status
                                    </button>
                                    {statusOpcoes.map((status) => (
                                        <label key={status.idStatusPat} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={statusSelecionados.includes(status.idStatusPat)}
                                                onChange={() => toggleStatus(status.idStatusPat)}
                                            />
                                            <span>{status.descricaoStatPat}</span>
                                        </label>
                                    ))}
                                    {statusOpcoes.length === 0 && (
                                        <span className="text-xs text-gray-500 px-2 py-1 block">Sem status disponíveis</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista mobile */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">Carregando...</div>
                ) : patrimonios.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">Nenhum patrimônio encontrado</div>
                ) : (
                    patrimonios.map((patrimonio) => (
                        <div key={patrimonio.idP} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{patrimonio.idPat}</div>
                                    <div className="text-xs text-gray-500">{patrimonio.descricaoPat}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                                    patrimonio.tbStatusPat?.descricaoStatPat === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                    patrimonio.tbStatusPat?.descricaoStatPat === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' :
                                    patrimonio.tbStatusPat?.descricaoStatPat === 'INATIVO' ? 'bg-orange-100 text-orange-800' :
                                    patrimonio.tbStatusPat?.descricaoStatPat === 'MANUTENÇÃO' ? 'bg-gray-100 text-purple-800' :
                                    patrimonio.tbStatusPat?.descricaoStatPat === 'TRANSFERIDO' ? 'bg-gray-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {patrimonio.tbStatusPat?.descricaoStatPat || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">Tipo</div>
                                <div className="text-gray-800 text-right">{patrimonio.tbTipoPat?.descricaoTipPat || '-'}</div>
                                <div className="text-gray-500">Valor</div>
                                <div className="text-gray-800 text-right">R$ {patrimonio.valorPat?.toFixed(2) || '0.00'}</div>
                                <div className="text-gray-500">Entrada</div>
                                <div className="text-gray-800 text-right">{patrimonio.dataEntPat ? new Date(patrimonio.dataEntPat).toLocaleDateString('pt-BR') : '-'}</div>
                                <div className="text-gray-500">Centro Custo</div>
                                <div className="text-gray-800 text-right">{patrimonio.tbCCusto?.descricaoCCusto || '-'}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                    <Link href={`/patrimonio/${patrimonio.idP}`} title="Editar">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button type="button" onClick={() => handleDelete(patrimonio.idP)} className="p-2.5 bg-gray-100 hover:bg-red-100 text-red-800 rounded-lg transition" title="Deletar patrimônio">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Tabela desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data Entrada</th>
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
                            ) : patrimonios.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                        Nenhum patrimônio encontrado
                                    </td>
                                </tr>
                            ) : (
                                patrimonios.map((patrimonio) => (
                                    <tr key={patrimonio.idP} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {patrimonio.idPat}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                            {patrimonio.descricaoPat}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {patrimonio.tbTipoPat?.descricaoTipPat || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            R$ {patrimonio.valorPat?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {patrimonio.dataEntPat ? new Date(patrimonio.dataEntPat).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                            ${patrimonio.tbStatusPat?.descricaoStatPat === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                                    patrimonio.tbStatusPat?.descricaoStatPat === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' :
                                                        patrimonio.tbStatusPat?.descricaoStatPat === 'INATIVO' ? 'bg-orange-100 text-orange-800' :
                                                            patrimonio.tbStatusPat?.descricaoStatPat === 'MANUTENÇÃO' ? 'bg-gray-100 text-purple-800' :
                                                                patrimonio.tbStatusPat?.descricaoStatPat === 'TRANSFERIDO' ? 'bg-gray-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {patrimonio.tbStatusPat?.descricaoStatPat || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {patrimonio.tbCCusto?.descricaoCCusto || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3 items-center">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="default"
                                                    className="w-full gap-2 bg-gray-100 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Link href={`/patrimonio/${patrimonio.idP}`} className="flex-1" title="Editar">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button type="button" onClick={() => handleDelete(patrimonio.idP)} className="p-2.5 bg-gray-100 hover:bg-red-100 text-red-800 rounded-lg transition" title="Deletar patrimÃ´nio">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
                <div className="text-xs text-gray-500">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} – {Math.min(inicio + patrimonios.length, totalItens)} de {totalItens}
                </div>
            </div>

            {/* Informações */}
            <div className="text-sm text-gray-600 text-center py-2">
                Total de patrimônios: {totalItens}
            </div>
        </div>
    );
}
