'use client'

import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Centro {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    tbEmpresa?: {
        idEmp: string;
        fantasiaEmpresa?: string | null;
        razaoEmpresa?: string | null;
    } | null;
}

export default function CCustoTable({ centros: inicial }: { centros: Centro[] }) {
    const [centros, setCentros] = useState(inicial);

    const handleDelete = async (id: string, descricao: string) => {
        if (confirm(`Deletar "${descricao}"?`)) {
            try {
                const res = await fetch(`/api/ccusto/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setCentros(centros.filter(c => c.idCCusto !== id));
                } else {
                    alert('Erro ao deletar');
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                alert('Erro ao deletar');
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Código</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Empresa</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {centros.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    Nenhum centro de custo cadastrado.
                                </td>
                            </tr>
                        ) : (
                            centros.map(c => (
                                <tr key={c.idCCusto} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">{c.codigoCCusto || '-'}</td>
                                    <td className="px-6 py-4 text-sm">{c.descricaoCCusto || '-'}</td>
                                    <td className="px-6 py-4 text-sm">{c.tbEmpresa?.fantasiaEmpresa || c.tbEmpresa?.razaoEmpresa || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <Link href={`/ccusto/${c.idCCusto}`}>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(c.idCCusto, c.descricaoCCusto || 'Centro de Custo')}
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
    );
}
