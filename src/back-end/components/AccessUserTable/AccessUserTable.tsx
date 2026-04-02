'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit, Filter, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';

interface AcessoUsuario {
    id: string;
    nome: string;
    email: string;
    authType: 'LOCAL' | 'GOOGLE';
    centros: string[];
    formularios: string[];
    status: 'ATIVO' | 'INATIVO';
}

export default function AccessUserTable() {
    const [usuarios, setUsuarios] = useState<AcessoUsuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');

    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter((usuario) => {
            const nomeOk = filtroNome ? usuario.nome.toUpperCase().includes(filtroNome.toUpperCase()) : true;
            const emailOk = filtroEmail ? usuario.email.toUpperCase().includes(filtroEmail.toUpperCase()) : true;
            const statusOk = filtroStatus ? usuario.status === filtroStatus : true;
            return nomeOk && emailOk && statusOk;
        });
    }, [usuarios, filtroNome, filtroEmail, filtroStatus]);

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/usuarios-acesso');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data.data || []);
            } else {
                window.systemAlert?.('erro', 'Erro ao carregar usuarios');
            }
        } catch (error) {
            console.error('Erro ao carregar usuarios:', error);
            window.systemAlert?.('erro', 'Erro ao carregar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este acesso?')) return;

        try {
            const response = await fetch(`/api/usuarios-acesso?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                window.systemAlert?.('sucesso', 'Acesso removido');
                await carregarUsuarios();
            } else {
                const err = await response.json();
                window.systemAlert?.('erro', err.message || 'Erro ao remover acesso');
            }
        } catch (error) {
            console.error('Erro ao remover acesso:', error);
            window.systemAlert?.('erro', 'Erro ao remover acesso');
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    return (
        <div className="space-y-4">
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
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Buscar por email..."
                            value={filtroEmail}
                            onChange={(e) => setFiltroEmail(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Todos os status</option>
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">Carregando...</div>
                ) : usuariosFiltrados.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">Nenhum usuário encontrado</div>
                ) : (
                    usuariosFiltrados.map((usuario) => (
                        <div key={usuario.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{usuario.nome}</div>
                                    <div className="text-xs text-gray-500">{usuario.email}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${usuario.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">Tipo</div>
                                <div className="text-gray-800 text-right">{usuario.authType === 'LOCAL' ? 'Local' : 'Google'}</div>
                                <div className="text-gray-500">Centros</div>
                                <div className="text-gray-800 text-right">{usuario.centros?.length || 0}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                    <Link href={`/acesso-usuarios/cadastro?id=${usuario.id}`} title="Editar">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(usuario.id)}
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

            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Centros</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Carregando...</td>
                                </tr>
                            ) : usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum usuario encontrado</td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map((usuario) => (
                                    <tr key={usuario.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{usuario.nome}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.authType === 'LOCAL' ? 'Local' : 'Google'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${usuario.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.centros?.length || 0}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button asChild variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 rounded-lg transition">
                                                    <Link href={`/acesso-usuarios/cadastro?id=${usuario.id}`} title="Editar">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(usuario.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                    title="Excluir"
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

            <div className="text-sm text-gray-600 text-center py-2">
                Total de usuarios: {usuariosFiltrados.length}
            </div>
        </div>
    );
}
