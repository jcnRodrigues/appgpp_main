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

    useEffect(() => {
        carregarFuncionarios();
    }, [filtro, statusFiltro, funcaoFiltro]);

    const carregarFuncionarios = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtro) params.append('nome', filtro);
            if (statusFiltro) params.append('status', statusFiltro);
            if (funcaoFiltro) params.append('funcao', funcaoFiltro);

            const response = await fetch(`/api/funcionario?${params}`);
            if (response.ok) {
                const data = await response.json();
                setFuncionarios(data.data || []);
            }
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idF: string) => {
        if (confirm('Tem certeza que deseja deletar este funcionário?')) {
            try {
                const response = await fetch(`/api/funcionario/${idF}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setFuncionarios(funcionarios.filter(f => f.idF !== idF));
                } else {
                    alert('Erro ao deletar funcionário');
                }
            } catch (error) {
                console.error('Erro ao deletar:', error);
                alert('Erro ao deletar funcionário');
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
                        placeholder="Buscar por nome..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por status..."
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por função..."
                        value={funcaoFiltro}
                        onChange={(e) => setFuncaoFiltro(e.target.value)}
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
                                                funcionario.tbStatusFun?.descricaoStatusFun === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                                funcionario.tbStatusFun?.descricaoStatusFun === 'INATIVO' ? 'bg-red-100 text-red-800' :
                                                funcionario.tbStatusFun?.descricaoStatusFun === 'AFASTADO' ? 'bg-yellow-100 text-yellow-800' :
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
                                                <Link href={`/funcionario/${funcionario.idF}`}>
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(funcionario.idF)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

            {/* Informações */}
            <div className="text-sm text-gray-600 text-center py-2">
                Total de funcionários: {funcionarios.length}
            </div>
        </div>
    );
}
