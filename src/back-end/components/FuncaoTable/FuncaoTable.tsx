'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus } from 'lucide-react';

interface Funcao {
    idFuncao: string;
    nomeFuncao: string;
}

export default function FuncaoTable() {
    const [funcoes, setFuncoes] = useState<Funcao[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarFuncoes = async () => {
            try {
                const res = await fetch('/api/funcao');
                if (res.ok) {
                    const data = await res.json();
                    setFuncoes(data.data || []);
                }
            } catch (error) {
                console.error('Erro ao carregar funções:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarFuncoes();
    }, []);

    const handleDelete = async (idFuncao: string) => {
        if (!confirm('Tem certeza que deseja deletar esta função?')) return;

        try {
            const res = await fetch(`/api/funcao/${idFuncao}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setFuncoes(funcoes.filter(f => f.idFuncao !== idFuncao));
                alert('Função deletada com sucesso');
            } else {
                const err = await res.json();
                alert(err.message || 'Erro ao deletar');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao deletar');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="w-full">
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome da Função</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcoes.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                        Nenhuma função cadastrada
                                    </td>
                                </tr>
                            ) : (
                                funcoes.map(funcao => (
                                    <tr key={funcao.idFuncao} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm">{funcao.nomeFuncao}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Link href={`/funcao/${funcao.idFuncao}/editar`}>
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(funcao.idFuncao)}
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
                Total de Funções: {funcoes.length}
            </div>
        </div>
    );
}
