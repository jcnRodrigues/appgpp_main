'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/back-end/components/ui/button';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';

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
    { id: 'CENTRO_CUSTO', label: 'Centros de Custo' },
    { id: 'MEDICAO_CCUSTO', label: 'Medicao por Centro de Custo' },
    { id: 'FUNCOES', label: 'Funcoes' },
    { id: 'ALOCACOES', label: 'Alocacao de Patrimonios' },
    { id: 'ACESSO_USUARIOS', label: 'Acesso de Usuarios' }
];

const initialForm = {
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
    const [form, setForm] = useState(initialForm);

    const isEditing = !!usuarioId;
    const centrosSelecionados = useMemo(() => new Set(form.centros), [form.centros]);
    const formulariosSelecionados = useMemo(() => new Set(form.formularios), [form.formularios]);

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
    }, [usuarioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['nome'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;
        setForm(prev => ({ ...prev, [name]: newValue }));
    };

    const toggleItem = (list: string[], value: string) => {
        if (list.includes(value)) return list.filter(item => item !== value);
        return [...list, value];
    };

    const handleToggleCentro = (id: string) => {
        setForm(prev => ({ ...prev, centros: toggleItem(prev.centros, id) }));
    };

    const handleToggleFormulario = (id: string) => {
        setForm(prev => ({ ...prev, formularios: toggleItem(prev.formularios, id) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!form.nome || !form.email) {
            window.systemAlert('erro', 'Nome e Email sao obrigatorios');
            setLoading(false);
            return;
        }

        if (form.centros.length === 0) {
            window.systemAlert('erro', 'Selecione ao menos um centro de custo');
            setLoading(false);
            return;
        }

        if (form.authType === 'LOCAL') {
            if (!form.senha && !isEditing) {
                window.systemAlert('erro', 'Senha obrigatoria para acesso local');
                setLoading(false);
                return;
            }
            if (form.senha && form.senha !== form.confirmSenha) {
                window.systemAlert('erro', 'Senha e confirmacao nao conferem');
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
                window.systemAlert('sucesso', isEditing ? 'Acesso atualizado' : 'Acesso criado');
                router.push('/acesso-usuarios');
                router.refresh();
            } else {
                const err = await res.json();
                window.systemAlert('erro', err.message || 'Erro ao salvar');
            }
        } catch (error) {
            console.error(error);
            window.systemAlert('erro', 'Erro ao salvar');
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
                                <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Maria Silva" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="maria@empresa.com" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tipo de Acesso</label>
                                <select name="authType" value={form.authType} onChange={(e) => {
                                    const value = e.target.value as 'LOCAL' | 'GOOGLE';
                                    setForm(prev => ({ ...prev, authType: value, senha: value === 'LOCAL' ? prev.senha : '', confirmSenha: value === 'LOCAL' ? prev.confirmSenha : '' }));
                                }} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="GOOGLE">Google</option>
                                    <option value="LOCAL">Local (senha)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
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
                                    <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder={isEditing ? 'Deixe em branco para manter' : 'Senha temporaria'} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required={!isEditing} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirmar Senha {isEditing ? '(opcional)' : '*'}</label>
                                    <input type="password" name="confirmSenha" value={form.confirmSenha} onChange={handleChange} placeholder={isEditing ? 'Deixe em branco para manter' : 'Confirmar senha'} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required={!isEditing} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Acesso aos Formularios</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {FORMULARIOS_DISPONIVEIS.map((formulario) => (
                                <label key={formulario.id} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={formulariosSelecionados.has(formulario.id)} onChange={() => handleToggleFormulario(formulario.id)} />
                                    <span>{formulario.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-h4 font-bold mb-4">Centros de Custo</h2>
                        {loadingData ? (
                            <p className="text-sm text-muted-foreground">Carregando centros...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-auto border rounded-lg p-4">
                                {centros.map((centro) => (
                                    <label key={centro.idCCusto} className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={centrosSelecionados.has(centro.idCCusto)} onChange={() => handleToggleCentro(centro.idCCusto)} />
                                        <span>{centro.descricaoCCusto || 'Sem descricao'}{centro.codigoCCusto ? ` (${centro.codigoCCusto})` : ''}</span>
                                    </label>
                                ))}
                                {centros.length === 0 && (<p className="text-sm text-muted-foreground">Nenhum centro de custo encontrado.</p>)}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 justify-end pt-6">
                        <Link href="/acesso-usuarios">
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                            {loading ? 'Salvando...' : isEditing ? 'Atualizar Acesso' : 'Criar Acesso'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
