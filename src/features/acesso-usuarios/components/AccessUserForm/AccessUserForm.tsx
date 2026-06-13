'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import FormActions from '@/components/FormActions/FormActions';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { useFormDraft } from '@/hooks/useFormDraft';
import { ACTION_TOKENS, type ActionPermission, MODULE_ACTIONS, ROLE_ADMIN, buildAdminPermissions } from '@/lib/permissions';

interface CentroCusto {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
}

interface AcessoUsuario {
    id: string;
    nome: string;
    email: string;
    authType: 'LOCAL' | 'GOOGLE';
    centros: string[];
    formularios: string[];
    status: 'ATIVO' | 'INATIVO';
}

const FORMULARIOS_DISPONIVEIS = [
    { id: 'DASHBOARD', label: 'Dashboard' },
    { id: 'FUNCIONARIOS', label: 'Funcionarios' },
    { id: 'PATRIMONIO', label: 'Patrimonio' },
    { id: 'UNIFI_CONFIG', label: 'Monitor de Rede Ubiquiti' },
    { id: 'CENTRO_CUSTO', label: 'Centros de Custo' },
    { id: 'MEDICAO_CCUSTO', label: 'Medicao por Centro de Custo' },
    { id: 'FUNCOES', label: 'Funcoes' },
    { id: 'LICENCAS_SOFTWARE', label: 'Licencas de Software' },
    { id: 'ALOCACOES', label: 'Alocacao de Patrimonios' },
    { id: 'ACESSO_USUARIOS', label: 'Acesso de Usuarios' },
    { id: 'IMPORTACAO_EXPORTACAO', label: 'Importacao e Exportacao de Dados' },
    { id: 'ATIVOS_REDE', label: 'Ativos de Rede' },
    { id: 'DELETE_ANY', label: 'Permitir excluir qualquer registro' }
];

const FORMULARIOS_COM_ACOES = FORMULARIOS_DISPONIVEIS.filter((item) => item.id !== 'DELETE_ANY');
const ACTION_LABELS: Record<ActionPermission, string> = {
    CREATE: 'Adicionar registros',
    UPDATE: 'Alterar registros',
    DELETE: 'Excluir registros',
    PRINT: 'Imprimir/Gerar relatorios'
};

const ACTION_IDS = Object.values(ACTION_TOKENS);

const initialForm = {
    perfil: 'OPERACIONAL' as 'ADMIN' | 'OPERACIONAL',
    nome: '',
    email: '',
    authType: 'GOOGLE' as 'LOCAL' | 'GOOGLE',
    senha: '',
    confirmSenha: '',
    centros: [] as string[],
    formularios: [] as string[],
    status: 'ATIVO' as 'ATIVO' | 'INATIVO'
};

export default function AccessUserForm({ usuarioId }: { usuarioId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();

    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const {
        state: form,
        setState: setForm,
        clearDraft: clearAccessUserDraft
    } = useFormDraft('access-user-form-create', initialForm, { enabled: !usuarioId });

    const notify = (tipo: 'erro' | 'sucesso', mensagem: string) => {
        if (typeof window !== 'undefined' && typeof window.systemAlert === 'function') {
            window.systemAlert?.(tipo, mensagem);
            return;
        }
        window.alert(mensagem);
    };

    const isEditing = !!usuarioId;
    const centrosSelecionados = useMemo(() => new Set(form.centros), [form.centros]);
    const formulariosSelecionados = useMemo(() => new Set(form.formularios), [form.formularios]);

    useEffect(() => {
        if (form.perfil === 'ADMIN') return;

        const actionsPermitidas = new Set<string>();
        Object.entries(MODULE_ACTIONS).forEach(([moduloId, actions]) => {
            if (!form.formularios.includes(moduloId)) return;
            actions.forEach((action) => actionsPermitidas.add(ACTION_TOKENS[action]));
        });

        const formulariosSanitizados = form.formularios.filter(
            (item) => !ACTION_IDS.includes(item as any) || actionsPermitidas.has(item)
        );

        if (formulariosSanitizados.length === form.formularios.length) {
            return;
        }

        setForm((prev) => ({ ...prev, formularios: formulariosSanitizados }));
    }, [form.formularios, form.perfil, setForm]);

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            try {
                const centroRes = await fetch('/api/ccusto?take=500&forAcessoUsuario=1');
                if (centroRes.ok) {
                    const centroData = await centroRes.json();
                    setCentros(centroData.data || []);
                }

                if (usuarioId) {
                    const userRes = await fetch(`/api/usuarios-acesso?id=${usuarioId}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        const u: AcessoUsuario | undefined = userData.data;
                        if (u) {
                            setForm({
                                perfil: Array.isArray(u.formularios) && u.formularios.includes(ROLE_ADMIN) ? 'ADMIN' : 'OPERACIONAL',
                                nome: u.nome || '',
                                email: u.email || '',
                                authType: u.authType || 'GOOGLE',
                                senha: '',
                                confirmSenha: '',
                                centros: Array.isArray(u.centros) ? u.centros : [],
                                formularios: Array.isArray(u.formularios) ? u.formularios : [],
                                status: u.status || 'ATIVO'
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, [usuarioId, setForm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['nome'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;
        setForm((prev) => ({ ...prev, [name]: newValue }));
    };

    const toggleItem = (list: string[], value: string) => {
        if (list.includes(value)) return list.filter((item) => item !== value);
        return [...list, value];
    };

    const handleToggleCentro = (id: string) => {
        setForm((prev) => ({ ...prev, centros: toggleItem(prev.centros, id) }));
    };

    const handleToggleFormulario = (id: string) => {
        setForm((prev) => {
            if (id === 'DELETE_ANY') {
                return { ...prev, formularios: toggleItem(prev.formularios, id) };
            }

            const estaSelecionado = prev.formularios.includes(id);

            if (estaSelecionado) {
                const tokensDoModulo = (MODULE_ACTIONS[id] || []).map((action) => ACTION_TOKENS[action]);
                return {
                    ...prev,
                    formularios: prev.formularios.filter((item) => item !== id && !tokensDoModulo.includes(item))
                };
            }

            return {
                ...prev,
                formularios: [...prev.formularios, id]
            };
        });
    };

    const handleToggleAcao = (moduloId: string, action: ActionPermission) => {
        setForm((prev) => {
            if (!prev.formularios.includes(moduloId)) {
                return prev;
            }

            return {
                ...prev,
                formularios: toggleItem(prev.formularios, ACTION_TOKENS[action])
            };
        });
    };

    const handlePerfilChange = (perfil: 'ADMIN' | 'OPERACIONAL') => {
        if (perfil === 'ADMIN') {
            setForm((prev) => ({
                ...prev,
                perfil,
                centros: ['*'],
                formularios: buildAdminPermissions()
            }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            perfil,
            centros: prev.centros.filter((id) => id !== '*'),
            formularios: prev.formularios.filter((id) => id !== ROLE_ADMIN)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!form.nome || !form.email) {
            notify('erro', 'Nome e Email sao obrigatorios');
            setLoading(false);
            return;
        }

        if (form.perfil !== 'ADMIN' && form.centros.length === 0) {
            notify('erro', 'Selecione ao menos um centro de custo');
            setLoading(false);
            return;
        }

        if (form.authType === 'LOCAL') {
            if (!form.senha && !isEditing) {
                notify('erro', 'Senha obrigatoria para acesso local');
                setLoading(false);
                return;
            }
            if (form.senha && form.senha !== form.confirmSenha) {
                notify('erro', 'Senha e confirmacao nao conferem');
                setLoading(false);
                return;
            }
        }

        try {
            const payload: any = {
                id: usuarioId,
                nome: form.nome,
                email: form.email,
                authType: form.authType,
                centros: form.centros,
                formularios: form.formularios,
                status: form.status
            };

            if (form.authType === 'LOCAL' && form.senha) {
                payload.senha = form.senha;
            }

            const res = await fetch('/api/usuarios-acesso', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                notify('sucesso', isEditing ? 'Acesso atualizado' : 'Acesso criado');
                if (!isEditing) clearAccessUserDraft();
                router.push('/acesso-usuarios');
            } else {
                const err = await res.json();
                notify('erro', err.message || 'Erro ao salvar');
            }
        } catch (error) {
            console.error(error);
            notify('erro', 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-4xl mx-auto px-4">
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/acesso-usuarios" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">{isEditing ? 'Editar Acesso de Usuario' : 'Novo Usuario de Acesso'}</h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Dados do Usuario</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nome *</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Ex: Maria Silva"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="maria@empresa.com"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Perfil</label>
                                <select
                                    name="perfil"
                                    value={form.perfil}
                                    onChange={(e) => handlePerfilChange(e.target.value as 'ADMIN' | 'OPERACIONAL')}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="OPERACIONAL">Operacional</option>
                                    <option value="ADMIN">Admin (acesso total)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Tipo de Acesso</label>
                                <select
                                    name="authType"
                                    value={form.authType}
                                    onChange={(e) => {
                                        const value = e.target.value as 'LOCAL' | 'GOOGLE';
                                        setForm((prev) => ({
                                            ...prev,
                                            authType: value,
                                            senha: value === 'LOCAL' ? prev.senha : '',
                                            confirmSenha: value === 'LOCAL' ? prev.confirmSenha : ''
                                        }));
                                    }}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="GOOGLE">Google</option>
                                    <option value="LOCAL">Local (senha)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="ATIVO">Ativo</option>
                                    <option value="INATIVO">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {form.authType === 'LOCAL' && (
                        <div className="border-b pb-6">
                            <h2 className="text-h4 font-bold mb-4">Credenciais Locais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Senha {isEditing ? '(opcional)' : '*'}</label>
                                    <input
                                        type="password"
                                        name="senha"
                                        value={form.senha}
                                        onChange={handleChange}
                                        placeholder={isEditing ? 'Deixe em branco para manter' : 'Senha temporaria'}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required={!isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirmar Senha {isEditing ? '(opcional)' : '*'}</label>
                                    <input
                                        type="password"
                                        name="confirmSenha"
                                        value={form.confirmSenha}
                                        onChange={handleChange}
                                        placeholder={isEditing ? 'Deixe em branco para manter' : 'Confirmar senha'}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Acesso aos Formularios</h2>
                        {form.perfil === 'ADMIN' && (
                            <p className="text-sm text-muted-foreground mb-3">Perfil Admin possui acesso completo automaticamente.</p>
                        )}

                        <div className="space-y-4">
                            {FORMULARIOS_COM_ACOES.map((formulario, index) => {
                                const actions = MODULE_ACTIONS[formulario.id] || [];
                                const moduloSelecionado = formulariosSelecionados.has(formulario.id);

                                return (
                                    <div key={formulario.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">
                                                    {index + 1} - {formulario.label}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Marque o formulário para liberar as permissões.
                                                </p>
                                            </div>

                                            <label className="flex items-center gap-2 text-sm font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={moduloSelecionado}
                                                    onChange={() => handleToggleFormulario(formulario.id)}
                                                    disabled={form.perfil === 'ADMIN'}
                                                />
                                                <span>Acesso ao formulário</span>
                                            </label>
                                        </div>

                                        <div className="mt-4 pl-4 border-l border-slate-200">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                                Permissões de Ação
                                            </div>

                                            {actions.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {actions.map((action) => (
                                                        <label key={`${formulario.id}-${action}`} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={formulariosSelecionados.has(ACTION_TOKENS[action])}
                                                                onChange={() => handleToggleAcao(formulario.id, action)}
                                                                disabled={form.perfil === 'ADMIN' || !moduloSelecionado}
                                                            />
                                                            <span>{ACTION_LABELS[action]}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    Sem permissões de ação adicionais para este formulário.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {FORMULARIOS_COM_ACOES.length + 1} - Permissão extra
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Libera exclusão de qualquer registro sem depender de um módulo específico.
                                        </p>
                                    </div>

                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <input
                                            type="checkbox"
                                            checked={formulariosSelecionados.has('DELETE_ANY')}
                                            onChange={() => handleToggleFormulario('DELETE_ANY')}
                                            disabled={form.perfil === 'ADMIN'}
                                        />
                                        <span>Excluir qualquer registro</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-h4 font-bold mb-4 mt-6">Centros de Custo</h2>
                        {form.perfil === 'ADMIN' && (
                            <p className="text-sm text-muted-foreground mb-3">Perfil Admin utiliza todos os centros de custo.</p>
                        )}
                        {loadingData ? (
                            <p className="text-sm text-muted-foreground">Carregando centros...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-auto border rounded-lg p-4">
                                {centros.map((centro) => (
                                    <label key={centro.idCCusto} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={centrosSelecionados.has(centro.idCCusto)}
                                            onChange={() => handleToggleCentro(centro.idCCusto)}
                                            disabled={form.perfil === 'ADMIN'}
                                        />
                                        <span>
                                            {centro.descricaoCCusto || 'Sem descricao'}
                                            {centro.codigoCCusto ? ` (${centro.codigoCCusto})` : ''}
                                        </span>
                                    </label>
                                ))}
                                {centros.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Nenhum centro de custo encontrado.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <FormActions
                        cancelHref="/acesso-usuarios"
                        submitLabel={isEditing ? 'Atualizar Acesso' : 'Criar Acesso'}
                        loading={loading}
                    />
                </form>
            </div>
        </div>
    );
}
