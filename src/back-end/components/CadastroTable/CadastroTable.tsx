'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Alocacao {
    idCad: string;
    dataCadPat: string | null;
    dataDevPat: string | null;
    tbFuncionario: {
        idMatFun: string;
        nomeFun: string;
    } | null;
    tbPatrimonio: {
        idPat: string;
        descricaoPat: string;
    } | null;
}

export default function CadastroTable() {
    const [alocacoes, setAlocacoes] = useState<Alocacao[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarAlocacoes = async () => {
            try {
                const res = await fetch('/api/cadastro');
                if (res.ok) {
                    const data = await res.json();
                    setAlocacoes(data.data || []);
                }
            } catch (error) {
                console.error('Erro ao carregar alocações:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarAlocacoes();
    }, []);

    const handleDelete = async (idCad: string) => {
        if (!confirm('Tem certeza que deseja deletar esta alocação?')) return;

        try {
            const res = await fetch(`/api/cadastro/${idCad}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setAlocacoes(alocacoes.filter(a => a.idCad !== idCad));
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

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    return (
        <div className="w-full">


            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-semibold">Funcionário</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Patrimônio</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data Alocação</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Data Devolução</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
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
                                <tr key={alocacao.idCad} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {alocacao.tbFuncionario?.nomeFun || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {alocacao.tbPatrimonio?.descricaoPat || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {formatarData(alocacao.dataCadPat)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {formatarData(alocacao.dataDevPat)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/alocacoes/${alocacao.idCad}/editar`}>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Pencil className="w-4 h-4" />
                                                    Editar
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(alocacao.idCad)}
                                                className="flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Deletar
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
    );
}
