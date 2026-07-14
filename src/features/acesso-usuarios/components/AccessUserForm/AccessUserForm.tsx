'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Inbox, Settings2, UserCog } from 'lucide-react';
import FormActions from '@/components/FormActions/FormActions';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { useFormDraft } from '@/hooks/useFormDraft';
import { ACTION_TOKENS, type ActionPermission, MODULE_ACTIONS, ROLE_ADMIN, buildAdminPermissions } from '@/lib/permissions';
import TableState from '@/components/TableState/TableState';
import { notify as showNotify } from '@/lib/notify';
import PageHeader from '@/components/PageHeader/PageHeader';

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
    { id: 'FUNCIONARIOS', label: 'Funcionários' },
    { id: 'PATRIMONIO', label: 'Patrimônio' },
    { id: 'INVENTARIO', label: 'Inventário' },
    { id: 'UNIFI_CONFIG', label: 'UniFi' },
    { id: 'SISTEMA', label: 'Sistema' },
    { id: 'MONITOR_PATRIMONIOS', label: 'Monitor de Patrimônios' },
    { id: 'AGENTE_INVENTARIO', label: 'Agente de Inventário' },
    { id: 'VARREDURA_PATRIMONIOS', label: 'Varredura de Patrimônios' },
    { id: 'BACKUP_DB', label: 'Backup DB' },
    { id: 'AUTORIZACAO_DELETE', label: 'Autorização de Exclusão' },
    { id: 'IMPORTAR_DADOS', label: 'Importar Dados' },
    { id: 'EXPORTAR_DADOS', label: 'Exportar Dados' },
    { id: 'CENTRO_CUSTO', label: 'Centros de Custo' },
    { id: 'MEDICAO_CCUSTO', label: 'Medição por Centro de Custo' },
    { id: 'FUNCOES', label: 'Funções' },
    { id: 'LICENCAS_SOFTWARE', label: 'Licenças de Software' },
    { id: 'ALOCACOES', label: 'Alocações de Patrimônios' },
    { id: 'ACESSO_USUARIOS', label: 'Acesso de Usuários' },
    { id: 'IMPORTACAO_EXPORTACAO', label: 'Importação e Exportação de Dados (legado)' },
    {
        id: 'ATIVOS_REDE',
        label: 'Ativos de Rede',
        hint: 'Libera transferência, devolução e cadastro de tipo/status no formulário de ativos de rede.'
    },
    { id: 'DELETE_ANY', label: 'Permitir excluir qualquer registro' }
];

const FORMULARIOS_COM_ACOES = FORMULARIOS_DISPONIVEIS.filter((item) => item.id !== 'DELETE_ANY');

const ACTION_LABELS: Record<ActionPermission, string> = {
    CREATE: 'Adicionar registros',
    UPDATE: 'Alterar registros',
    DELETE: 'Excluir registros',
    PRINT: 'Imprimir/Gerar relatórios',
    TRANSFER: 'Transferir registros',
    RETURN: 'Registrar devoluções',
    IMPORT: 'Importar dados',
    EXPORT: 'Exportar dados',
    OPTIONS: 'Cadastrar tipo/status'
};

const ACTION_DESCRIPTIONS: Record<ActionPermission, string> = {
    CREATE: 'Permite criar novos registros e abrir formulários de cadastro.',
    UPDATE: 'Permite editar, transferir e atualizar registros existentes.',
    DELETE: 'Permite excluir registros conforme as regras do módulo.',
    PRINT: 'Permite visualizar, imprimir e gerar relatórios.',
    TRANSFER: 'Permite movimentar itens entre centros, locais ou responsáveis.',
    RETURN: 'Permite registrar devoluções e encerramentos de saída.',
    IMPORT: 'Permite importar dados, planilhas ou lotes de registros.',
    EXPORT: 'Permite exportar dados, planilhas ou relatórios do módulo.',
    OPTIONS: 'Permite cadastrar e manter tipos/status do módulo.'
};

const ACTION_IDS = Object.values(ACTION_TOKENS);

function getFormularioResumo(formularioId: string, actionsCount: number) {
    if (formularioId === 'ATIVOS_REDE') {
        return 'Libera transferência, devolução e cadastro de tipo/status no formulário de ativos de rede.';
    }

    return actionsCount > 0
        ? `Este módulo possui ${actionsCount} ação(ões) configuráveis.`
        : 'Módulo sem ações adicionais.';
}

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
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [mostrarFormularios, setMostrarFormularios] = useState(false);
    const [mostrarCentros, setMostrarCentros] = useState(false);
    const [selectedFormularioId, setSelectedFormularioId] = useState(FORMULARIOS_COM_ACOES[0]?.id || '');

    const {
        state: form,
        setState: setForm,
        clearDraft: clearAccessUserDraft
    } = useFormDraft('access-user-form-create', initialForm, { enabled: !usuarioId });

    const notify = (tipo: 'erro' | 'sucesso', mensagem: string) => {
        showNotify(tipo, mensagem);
    };

    const isEditing = !!usuarioId;
    const centrosSelecionados = useMemo(() => new Set(form.centros), [form.centros]);
    const formulariosSelecionados = useMemo(() => new Set(form.formularios), [form.formularios]);
    const selectedFormulario = useMemo(
        () => FORMULARIOS_COM_ACOES.find((item) => item.id === selectedFormularioId) || FORMULARIOS_COM_ACOES[0],
        [selectedFormularioId]
    );
    const selectedActions = useMemo(
        () => (selectedFormulario ? MODULE_ACTIONS[selectedFormulario.id] || [] : []),
        [selectedFormulario]
    );
    const selectedModuleEnabled = selectedFormulario ? formulariosSelecionados.has(selectedFormulario.id) : false;

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

        if (formulariosSanitizados.length === form.formularios.length) return;
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const abrirPermissoes = (id: string) => {
        setSelectedFormularioId(id);
        setPermissionsOpen(true);
    };

    const handleToggleAcao = (moduloId: string, action: ActionPermission) => {
        setForm((prev) => {
            if (!prev.formularios.includes(moduloId)) return prev;
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!form.nome || !form.email) {
            notify('erro', 'Nome e email são obrigatórios');
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
                notify('erro', 'Senha obrigatória para acesso local');
                setLoading(false);
                return;
            }

            if (form.senha && form.senha !== form.confirmSenha) {
                notify('erro', 'Senha e confirmação não conferem');
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
                clearAccessUserDraft();
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
            <div className="mx-auto max-w-7xl px-4">
                <PageHeader
                    icon={UserCog}
                    title={isEditing ? 'Editar Acesso' : 'Novo Acesso'}
                    description="Defina permissões, centros e status de acesso."
                    backHref="/acesso-usuarios"
                    iconClassName="from-slate-950 via-slate-800 to-emerald-700"
                    compact
                />

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="form-surface space-y-4 p-4 md:p-5">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="space-y-4">
                            <div className="rounded-xl border border-slate-200 p-4">
                                <h2 className="mb-3 text-base font-bold">Dados do Usuário</h2>

                                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Nome *</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={form.nome}
                                            onChange={handleChange}
                                            placeholder="Ex: Maria Silva"
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="maria@empresa.com"
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Perfil</label>
                                        <select
                                            name="perfil"
                                            value={form.perfil}
                                            onChange={(e) => handlePerfilChange(e.target.value as 'ADMIN' | 'OPERACIONAL')}
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="OPERACIONAL">Operacional</option>
                                            <option value="ADMIN">Admin (acesso total)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Tipo de Acesso</label>
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
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="GOOGLE">Google</option>
                                            <option value="LOCAL">Local (senha)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Status</label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="ATIVO">Ativo</option>
                                            <option value="INATIVO">Inativo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {form.authType === 'LOCAL' ? (
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <h2 className="mb-3 text-base font-bold">Credenciais Locais</h2>
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium">Senha {isEditing ? '(opcional)' : '*'}</label>
                                            <input
                                                type="password"
                                                name="senha"
                                                value={form.senha}
                                                onChange={handleChange}
                                                placeholder={isEditing ? 'Deixe em branco para manter' : 'Senha temporária'}
                                                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                required={!isEditing}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium">Confirmar Senha {isEditing ? '(opcional)' : '*'}</label>
                                            <input
                                                type="password"
                                                name="confirmSenha"
                                                value={form.confirmSenha}
                                                onChange={handleChange}
                                                placeholder={isEditing ? 'Deixe em branco para manter' : 'Confirmar senha'}
                                                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                required={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold">Centros de Custo</h2>
                                        {form.perfil === 'ADMIN' ? (
                                            <p className="mt-1 text-sm text-muted-foreground">Perfil Admin utiliza todos os centros de custo.</p>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {mostrarCentros
                                                    ? 'Selecione os centros de custo liberados para este usuário.'
                                                    : `Seção oculta. ${form.centros.length} centro(s) selecionado(s).`}
                                            </p>
                                        )}
                                    </div>

                                    {form.perfil !== 'ADMIN' ? (
                                        <button
                                            type="button"
                                            onClick={() => setMostrarCentros((prev) => !prev)}
                                            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm transition ${
                                                mostrarCentros
                                                    ? 'border border-red-500 bg-red-600 hover:bg-red-500'
                                                    : 'border border-emerald-500 bg-emerald-600 hover:bg-emerald-500'
                                            }`}
                                            aria-expanded={mostrarCentros}
                                            aria-label={mostrarCentros ? 'Ocultar centros de custo' : 'Visualizar centros de custo'}
                                        >
                                            {mostrarCentros ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            {mostrarCentros ? 'Ocultar' : 'Visualizar'}
                                        </button>
                                    ) : null}
                                </div>

                                {mostrarCentros ? (
                                    loadingData ? (
                                        <div className="mt-3">
                                            <TableState icon={Inbox} title="Carregando centros" compact />
                                        </div>
                                    ) : (
                                        <div className="mt-3 max-h-56 overflow-auto rounded-md border p-3">
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                {centros.map((centro) => (
                                                    <label key={centro.idCCusto} className="flex items-center gap-2 text-sm leading-tight">
                                                        <input
                                                            type="checkbox"
                                                            checked={centrosSelecionados.has(centro.idCCusto)}
                                                            onChange={() => handleToggleCentro(centro.idCCusto)}
                                                            disabled={form.perfil === 'ADMIN'}
                                                        />
                                                        <span>
                                                            {centro.descricaoCCusto || 'Sem descrição'}
                                                            {centro.codigoCCusto ? ` (${centro.codigoCCusto})` : ''}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            {centros.length === 0 ? (
                                                <div className="pt-2">
                                                    <TableState icon={Inbox} title="Nenhum centro de custo encontrado" compact />
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold">Acesso aos Formulários</h2>
                                        {form.perfil === 'ADMIN' ? (
                                            <p className="mt-1 text-sm text-muted-foreground">Perfil Admin possui acesso completo automaticamente.</p>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {mostrarFormularios
                                                    ? 'Selecione os formulários que este usuário poderá acessar.'
                                                    : `Seção oculta. ${form.formularios.length} permissão(ões) selecionada(s).`}
                                            </p>
                                        )}
                                    </div>

                                    {form.perfil !== 'ADMIN' ? (
                                        <button
                                            type="button"
                                            onClick={() => setMostrarFormularios((prev) => !prev)}
                                            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm transition ${
                                                mostrarFormularios
                                                    ? 'border border-red-500 bg-red-600 hover:bg-red-500'
                                                    : 'border border-emerald-500 bg-emerald-600 hover:bg-emerald-500'
                                            }`}
                                            aria-expanded={mostrarFormularios}
                                            aria-label={mostrarFormularios ? 'Ocultar formulários' : 'Visualizar formulários'}
                                        >
                                            {mostrarFormularios ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            {mostrarFormularios ? 'Ocultar' : 'Visualizar'}
                                        </button>
                                    ) : null}
                                </div>

                                {mostrarFormularios ? (
                                    <div className="mt-3 grid grid-cols-1 gap-2.5 lg:grid-cols-2 2xl:grid-cols-2">
                                        {FORMULARIOS_COM_ACOES.map((formulario, index) => {
                                            const actions = MODULE_ACTIONS[formulario.id] || [];
                                            const moduloSelecionado = formulariosSelecionados.has(formulario.id);
                                            const moduleResumo = getFormularioResumo(formulario.id, actions.length);

                                            return (
                                                <div
                                                    key={formulario.id}
                                                    className={`flex h-full flex-col rounded-xl border p-4 transition ${
                                                        moduloSelecionado
                                                            ? 'border-emerald-400/60 bg-emerald-50/60 shadow-sm shadow-emerald-100/40'
                                                            : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-2 text-[11px] font-semibold text-white">
                                                                    {index + 1}
                                                                </span>
                                                                <div className="truncate text-sm font-semibold leading-tight text-slate-950">
                                                                    {formulario.label}
                                                                </div>
                                                            </div>
                                                            <p className="mt-1 text-[11px] leading-snug text-slate-600">
                                                                {moduleResumo}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                                moduloSelecionado
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-200 text-slate-600'
                                                            }`}
                                                        >
                                                            {moduloSelecionado ? 'Ativo' : 'Oculto'}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                                        {moduloSelecionado ? `${actions.length} ação(ões) liberada(s)` : 'Permissões fechadas'}
                                                    </p>

                                                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => abrirPermissoes(formulario.id)}
                                                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-white shadow-sm transition ${
                                                                moduloSelecionado
                                                                    ? 'border border-emerald-500 bg-emerald-600 hover:bg-emerald-500'
                                                                    : 'border border-red-500 bg-red-600 hover:bg-red-500'
                                                            }`}
                                                        >
                                                            <Settings2 className="h-3.5 w-3.5" />
                                                            Permissões
                                                        </button>

                                                        <label
                                                            className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                                moduloSelecionado
                                                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                                                    : 'border-red-300 bg-red-50 text-red-800'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={moduloSelecionado}
                                                                onChange={() => handleToggleFormulario(formulario.id)}
                                                                disabled={form.perfil === 'ADMIN'}
                                                                className={`h-4 w-4 rounded focus:ring-offset-0 ${
                                                                    moduloSelecionado
                                                                        ? 'border-emerald-300 text-emerald-600 focus:ring-emerald-500'
                                                                        : 'border-red-300 text-red-600 focus:ring-red-500'
                                                                }`}
                                                            />
                                                            <span>{moduloSelecionado ? 'Ativo' : 'Inativo'}</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 lg:col-span-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold leading-tight text-amber-950">
                                                        {FORMULARIOS_COM_ACOES.length + 1} - Permissão extra
                                                    </div>
                                                    <p className="mt-0.5 text-[10px] text-amber-800/90">
                                                        Libera exclusão de qualquer registro sem depender de um módulo específico.
                                                    </p>
                                                </div>

                                                <label className="flex items-center gap-2 whitespace-nowrap rounded-full border border-amber-200 bg-white px-2.5 py-1 text-xs font-medium text-amber-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={formulariosSelecionados.has('DELETE_ANY')}
                                                        onChange={() => handleToggleFormulario('DELETE_ANY')}
                                                        disabled={form.perfil === 'ADMIN'}
                                                        className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                                    />
                                                    <span>Excluir</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <Sheet open={permissionsOpen} onOpenChange={setPermissionsOpen}>
                        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
                            <SheetHeader className="pr-10">
                                <SheetTitle className="text-xl">{selectedFormulario ? selectedFormulario.label : 'Permissões'}</SheetTitle>
                                <SheetDescription>
                                    Ajuste o acesso ao formulário e as ações liberadas para este módulo.
                                </SheetDescription>
                            </SheetHeader>

                            {selectedFormulario ? (
                                <div className="space-y-4 px-4 pb-6">
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{selectedFormulario.label}</div>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {selectedModuleEnabled ? 'Módulo ativo' : 'Módulo desativado'}
                                                </p>
                                            </div>
                                            <label className="flex items-center gap-2 text-sm font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedModuleEnabled}
                                                    onChange={() => handleToggleFormulario(selectedFormulario.id)}
                                                    disabled={form.perfil === 'ADMIN'}
                                                />
                                                <span>Acesso</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-end justify-between gap-3">
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    Permissões de ação
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-500">
                                                    Organize as permissões liberadas para este módulo.
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                                {selectedActions.length} ações
                                            </span>
                                        </div>

                                        {selectedActions.length > 0 ? (
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {selectedActions.map((action) => {
                                                    const actionKey = ACTION_TOKENS[action];
                                                    const checked = formulariosSelecionados.has(actionKey);

                                                    return (
                                                        <label
                                                            key={`${selectedFormulario.id}-${action}`}
                                                            className={`flex h-full cursor-pointer flex-col rounded-xl border p-3 transition ${
                                                                checked
                                                                    ? 'border-emerald-400/60 bg-emerald-50/80 shadow-sm shadow-emerald-100'
                                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                            } ${form.perfil === 'ADMIN' || !selectedModuleEnabled ? 'cursor-not-allowed opacity-70' : ''}`}
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <span className="block text-sm font-semibold text-slate-900">
                                                                        {ACTION_LABELS[action]}
                                                                    </span>
                                                                    <span className="mt-1 block text-[11px] leading-snug text-slate-500">
                                                                        {ACTION_DESCRIPTIONS[action]}
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                                    checked={checked}
                                                                    onChange={() => handleToggleAcao(selectedFormulario.id, action)}
                                                                    disabled={form.perfil === 'ADMIN' || !selectedModuleEnabled}
                                                                />
                                                            </div>

                                                            <div className="mt-3 flex items-center justify-between gap-2">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                                        checked
                                                                            ? 'bg-emerald-100 text-emerald-700'
                                                                            : 'bg-slate-100 text-slate-600'
                                                                    }`}
                                                                >
                                                                    {checked ? 'Liberada' : 'Pendente'}
                                                                </span>
                                                                <span className="text-[11px] font-medium text-slate-400">
                                                                    {action}
                                                                </span>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-muted-foreground">
                                                Este formulário não possui ações adicionais.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </SheetContent>
                    </Sheet>

                    <FormActions
                        cancelHref="/acesso-usuarios"
                        submitLabel={isEditing ? 'Atualizar Acesso' : 'Criar Acesso'}
                        loading={loading}
                        className="grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2 sm:justify-end"
                        cancelClassName="h-11 border-red-500 bg-red-600 text-white shadow-sm hover:bg-red-500"
                        submitClassName="h-11 bg-emerald-600 text-white shadow-sm hover:bg-emerald-500"
                    />
                </form>
            </div>
        </div>
    );
}


