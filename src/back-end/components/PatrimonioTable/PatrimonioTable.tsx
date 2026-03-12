'use client'

import { useState, useEffect } from 'react';
import { Edit, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface Patrimonio {
    idP: string;
    idPat: string;
    descricaoPat: string;
    valorPat: number;
    dataEntPat: string;
    tbTipoPat?: {
        descricaoTipPat?: string;
    };
    tbStatusPat?: {
        descricaoStatPat: string;
    };
    tbCCusto?: {
        descricaoCCusto?: string;
    };
}

interface PatrimonioTableProps {
    patrimonios?: Patrimonio[];
}

export default function PatrimonioTable({ patrimonios: initialPatrimonios }: PatrimonioTableProps) {
    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>(initialPatrimonios || []);
    const [filtro, setFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(initialPatrimonios?.length || 0);
    const pageSize = 10;

    useEffect(() => {
        carregarPatrimonios();
    }, [filtro, statusFiltro, tipoFiltro, currentPage]);

    const carregarPatrimonios = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtro) params.append('descricao', filtro);
            if (statusFiltro) params.append('status', statusFiltro);
            if (tipoFiltro) params.append('tipo', tipoFiltro);
            params.append('skip', String((currentPage - 1) * pageSize));
            params.append('take', String(pageSize));

            const response = await fetch(`/api/patrimonio?${params}`);
            if (response.ok) {
                const data = await response.json();
                setPatrimonios(data.data || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar patrimônios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idP: string) => {
        if (confirm('Tem certeza que deseja deletar este patrimônio?')) {
            try {
                const response = await fetch(`/api/patrimonio/${idP}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setPatrimonios((prev) => prev.filter(p => p.idP !== idP));
                    setTotal((prev) => Math.max(0, prev - 1));
                    if (patrimonios.length === 1 && currentPage > 1) {
                        setCurrentPage((prev) => Math.max(1, prev - 1));
                    }
                } else {
                    alert('Erro ao deletar patrimônio');
                }
            } catch (error) {
                console.error('Erro ao deletar:', error);
                alert('Erro ao deletar patrimônio');
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Filtros</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por descrição..."
                        value={filtro}
                        onChange={(e) => {
                            setFiltro(e.target.value.toUpperCase());
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por status..."
                        value={statusFiltro}
                        onChange={(e) => {
                            setStatusFiltro(e.target.value.toUpperCase());
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por tipo..."
                        value={tipoFiltro}
                        onChange={(e) => {
                            setTipoFiltro(e.target.value.toUpperCase());
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                                            {new Date(patrimonio.dataEntPat).toLocaleDateString('pt-BR')}
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
                                                <Link href={`/patrimonio/${patrimonio.idP}`} className="flex-1">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="w-full gap-2 bg-gray-100 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(patrimonio.idP)}
                                                    className="p-2.5 bg-gray-100 hover:bg-red-100 text-red-800 rounded-lg transition"
                                                    title="Deletar patrimônio"
                                                >
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
            <div className="bg-white rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-t bg-gray-50">
                    <div className="text-sm text-gray-600">
                        {total === 0
                            ? 'Exibindo 0-0 de 0'
                            : `Exibindo ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, total)} de ${total}`
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || total === 0}
                        >
                            Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.max(1, Math.ceil(total / pageSize)) }, (_, index) => index + 1)
                                .filter((page) => {
                                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                                    const maxButtons = 5;
                                    const half = Math.floor(maxButtons / 2);
                                    let start = Math.max(1, currentPage - half);
                                    let end = Math.min(totalPages, start + maxButtons - 1);
                                    start = Math.max(1, end - maxButtons + 1);
                                    return page >= start && page <= end;
                                })
                                .map((page) => (
                                    <Button
                                        key={page}
                                        size="sm"
                                        variant={page === currentPage ? 'default' : 'outline'}
                                        onClick={() => setCurrentPage(page)}
                                        className={page === currentPage ? 'bg-primary text-white' : ''}
                                    >
                                        {page}
                                    </Button>
                                ))}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={total === 0 || currentPage >= Math.max(1, Math.ceil(total / pageSize))}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
