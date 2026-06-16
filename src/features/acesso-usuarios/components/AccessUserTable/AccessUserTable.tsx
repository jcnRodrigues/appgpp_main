'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit, Filter, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DeleteGuardButton from '@/components/DeleteGuardButton/DeleteGuardButton';
import { ACTION_TOKENS, MODULE_ACTIONS, type ActionPermission } from '@/lib/permissions';

interface AcessoUsuario {
    id: string;
    nome: string;
    email: string;
    authType: 'LOCAL' | 'GOOGLE';
    centros: string[];
    formularios: string[];
    status: 'ATIVO' | 'INATIVO';
}

type ResumoModulo = {
    id: string;
    label: string;
    actions: ActionPermission[];
};

type UsuarioComResumo = AcessoUsuario & {
    resumoAcessos: ResumoModulo[];
    possuiDeleteAny: boolean;
};

const FORMULARIOS_LABELS: Record<string, string> = {
    DASHBOARD: 'Dashboard',
    FUNCIONARIOS: 'Funcionários',
    PATRIMONIO: 'Patrimônio',
    UNIFI_CONFIG: 'Monitor de Rede Ubiquiti',
    CENTRO_CUSTO: 'Centros de Custo',
    MEDICAO_CCUSTO: 'Medição por Centro de Custo',
    FUNCOES: 'Funções',
    LICENCAS_SOFTWARE: 'Licenças de Software',
    ALOCACOES: 'Alocações de Patrimônios',
    ACESSO_USUARIOS: 'Acesso de Usuários',
    IMPORTACAO_EXPORTACAO: 'Importação e Exportação de Dados',
    ATIVOS_REDE: 'Ativos de Rede'
};

const ACTION_LABELS: Record<ActionPermission, string> = {
    CREATE: 'Adicionar',
    UPDATE: 'Alterar',
    DELETE: 'Excluir',
    PRINT: 'Relatório',
    TRANSFER: 'Transferir',
    RETURN: 'Devolver',
    IMPORT: 'Importar',
    EXPORT: 'Exportar'
};

const ACTION_ORDER: ActionPermission[] = ['CREATE', 'UPDATE', 'DELETE', 'PRINT', 'TRANSFER', 'RETURN', 'IMPORT', 'EXPORT'];
const MAX_VISIBLE_MODULES = 2;

function montarResumo(formularios: string[]): ResumoModulo[] {
    const set = new Set(formularios);

    return Object.keys(FORMULARIOS_LABELS)
        .filter((id) => set.has(id))
        .map((id) => ({
            id,
            label: FORMULARIOS_LABELS[id],
            actions: (MODULE_ACTIONS[id] || [])
                .filter((action) => set.has(ACTION_TOKENS[action]))
                .sort((a, b) => ACTION_ORDER.indexOf(a) - ACTION_ORDER.indexOf(b))
        }));
}

function AccessSummaryList({ itens }: { itens: ResumoModulo[] }) {
    const visiveis = itens.slice(0, MAX_VISIBLE_MODULES);
    const restantes = Math.max(0, itens.length - visiveis.length);

    return (
        <div className="space-y-1.5">
            {visiveis.map((item) => (
                <div key={item.id} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 text-sm font-semibold text-slate-900 truncate">{item.label}</div>
                        <div className="shrink-0 text-[11px] font-medium text-slate-500">
                            {item.actions.length} ação(ões)
                        </div>
                    </div>

                    {item.actions.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.actions.map((action) => (
                                <span
                                    key={`${item.id}-${action}`}
                                    className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                                >
                                    {ACTION_LABELS[action]}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-1 text-[11px] text-slate-500">Sem ações adicionais</p>
                    )}
                </div>
            ))}

            {restantes > 0 ? (
                <div className="text-[11px] text-slate-500">+{restantes} módulo(s) adicional(is)</div>
            ) : null}
        </div>
    );
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

    const usuariosComResumo = useMemo<UsuarioComResumo[]>(() => {
        return usuariosFiltrados.map((usuario) => ({
            ...usuario,
            resumoAcessos: montarResumo(usuario.formularios || []),
            possuiDeleteAny: (usuario.formularios || []).includes('DELETE_ANY')
        }));
    }, [usuariosFiltrados]);

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/usuarios-acesso');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data.data || []);
            } else {
                window.systemAlert?.('erro', 'Erro ao carregar usuários');
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            window.systemAlert?.('erro', 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmou = window.systemConfirm
            ? await window.systemConfirm('Tem certeza que deseja remover este acesso?', 'Confirmar exclusão', {
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            })
            : window.confirm('Tem certeza que deseja remover este acesso?');

        if (!confirmou) return;

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
            <div className="sticky top-[calc(var(--app-header-height)+96px)] z-30 bg-background/95 pb-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="space-y-4 rounded-lg bg-white p-4 shadow-md">
                    <div className="mb-2 flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Filtros</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="text"
                            placeholder="Buscar por email..."
                            value={filtroEmail}
                            onChange={(e) => setFiltroEmail(e.target.value)}
                            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Todos os status</option>
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-3 md:hidden">
                {loading ? (
                    <div className="rounded-lg bg-white p-4 text-center text-gray-500 shadow-md">Carregando...</div>
                ) : usuariosComResumo.length === 0 ? (
                    <div className="rounded-lg bg-white p-4 text-center text-gray-500 shadow-md">Nenhum usuário encontrado</div>
                ) : (
                    usuariosComResumo.map((usuario) => (
                        <div key={usuario.id} className="space-y-3 rounded-lg bg-white p-4 shadow-md">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-gray-900">{usuario.nome}</div>
                                    <div className="truncate text-xs text-gray-500">{usuario.email}</div>
                                </div>
                                <span
                                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                                        usuario.status === 'ATIVO'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-500">Tipo</div>
                                <div className="text-right text-gray-800">{usuario.authType === 'LOCAL' ? 'Local' : 'Google'}</div>
                                <div className="text-gray-500">Centros</div>
                                <div className="text-right text-gray-800">{usuario.centros?.length || 0}</div>
                            </div>

                            <div className="space-y-2 border-t pt-3">
                                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Acessos</div>
                                {usuario.resumoAcessos.length > 0 ? (
                                    <AccessSummaryList itens={usuario.resumoAcessos} />
                                ) : (
                                    <p className="text-xs text-gray-500">Nenhum acesso de formulário concedido.</p>
                                )}

                                {usuario.possuiDeleteAny ? (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                        <div className="text-sm font-semibold text-amber-900">Permissão extra</div>
                                        <div className="mt-2">
                                            <span className="rounded-full bg-amber-200 px-2 py-1 text-[11px] text-amber-900">
                                                Excluir qualquer registro
                                            </span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                                <Button asChild variant="ghost" size="icon" className="rounded-lg text-blue-600 transition hover:bg-blue-100">
                                    <Link href={`/acesso-usuarios/cadastro?id=${usuario.id}`} title="Editar">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <DeleteGuardButton
                                    resource="usuario_acesso"
                                    recordId={usuario.id}
                                    onAuthorizedDelete={() => handleDelete(usuario.id)}
                                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </DeleteGuardButton>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="hidden overflow-hidden rounded-lg bg-white shadow-md md:block">
                <div className="overflow-x-auto">
                    <table className="min-w-[1100px] w-full">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Centros</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acessos</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Carregando...</td>
                                </tr>
                            ) : usuariosComResumo.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Nenhum usuário encontrado</td>
                                </tr>
                            ) : (
                                usuariosComResumo.map((usuario) => (
                                    <tr key={usuario.id} className="border-b transition hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{usuario.nome}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.authType === 'LOCAL' ? 'Local' : 'Google'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    usuario.status === 'ATIVO'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{usuario.centros?.length || 0}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {usuario.resumoAcessos.length > 0 ? (
                                                <AccessSummaryList itens={usuario.resumoAcessos} />
                                            ) : (
                                                <span className="text-xs text-gray-500">Nenhum acesso de formulário concedido.</span>
                                            )}

                                            {usuario.possuiDeleteAny ? (
                                                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                                    <div className="text-sm font-semibold text-amber-900">Permissão extra</div>
                                                    <div className="mt-2">
                                                        <span className="rounded-full bg-amber-200 px-2 py-1 text-[11px] text-amber-900">
                                                            Excluir qualquer registro
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button asChild variant="ghost" size="icon" className="rounded-lg text-blue-600 transition hover:bg-blue-100">
                                                    <Link href={`/acesso-usuarios/cadastro?id=${usuario.id}`} title="Editar">
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteGuardButton
                                                    resource="usuario_acesso"
                                                    recordId={usuario.id}
                                                    onAuthorizedDelete={() => handleDelete(usuario.id)}
                                                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </DeleteGuardButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="py-2 text-center text-sm text-gray-600">
                Total de usuários: {usuariosComResumo.length}
            </div>
        </div>
    );
}


