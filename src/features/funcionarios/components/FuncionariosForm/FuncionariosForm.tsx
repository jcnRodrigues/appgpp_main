'use client'

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { Button } from '@/components/ui/button';
import FormActions from '@/components/FormActions/FormActions';
import { Search, Check, UserPlus, UserPen, FileText, ArrowRight, Inbox } from 'lucide-react';
import { useFormDraft } from '@/hooks/useFormDraft';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { notify as showNotify } from '@/lib/notify';
import { Badge } from '@/components/ui/badge';

interface Funcao {
    [x: string]: ReactNode;
    idFuncao: string;
    nomeFuncao: string;
}

interface StatusFuncionario {
    idStatusFun: string;
    descricaoStatusFun: string;
}

interface CentroCusto {
    idCCusto: string;
    descricaoCCusto?: string;
}

interface LicencaDisponivel {
    idLic: string;
    descricaoLic: string;
}

interface TermoFuncionario {
    idCad: string;
    idPatCad: string;
    dataCadPat?: string | null;
    dataDevPat?: string | null;
    tbStatusPat?: {
        descricaoStatPat?: string | null;
    } | null;
    tbPatrimonio?: {
        idPat: string;
        descricaoPat?: string | null;
        tbCCusto?: {
            descricaoCCusto?: string | null;
        } | null;
        tbTipoPat?: {
            descricaoTipPat?: string | null;
        } | null;
        tbStatusPat?: {
            descricaoStatPat?: string | null;
        } | null;
    } | null;
}

type LicencaVinculo = {
    idLic: string;
    dataInicio: string;
    dataVencimetno: string;
};

function normalizarTexto(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export default function FuncionariosForm({ funcionarioId, hideHeader = false }: { funcionarioId?: string; hideHeader?: boolean }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [funcoes, setFuncoes] = useState<Funcao[]>([]);
    const [status, setStatus] = useState<StatusFuncionario[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [licencasDisponiveis, setLicencasDisponiveis] = useState<LicencaDisponivel[]>([]);
    const [termosFuncionario, setTermosFuncionario] = useState<TermoFuncionario[]>([]);
    const [termosLoading, setTermosLoading] = useState(false);
    const [isFuncaoSheetOpen, setIsFuncaoSheetOpen] = useState(false);
    const [isLicencaSheetOpen, setIsLicencaSheetOpen] = useState(false);
    const [funçãoSearch, setFuncaoSearch] = useState('');
    const [licencaSearch, setLicencaSearch] = useState('');

    const initialFuncionario = useMemo(() => ({
        idMatFun: '',
        nomeFun: '',
        cpfFun: '',
        dataAdmFun: new Date().toISOString().split('T')[0],
        dataDesFun: '',
        avatarFun: '',
        idFuncaoFun: '',
        idStatusFun: '',
        idCustoFun: '',
        licencasVinculos: [] as LicencaVinculo[]
    }), []);

    const {
        state: funcionario,
        setState: setFuncionario,
        clearDraft: clearFuncionarioDraft
    } = useFormDraft('funcionario-form-create', initialFuncionario, { enabled: !funcionarioId });

    const funcoesFiltradas = useMemo(() => {
        if (!funçãoSearch.trim()) return funcoes.slice(0, 50);

        const busca = normalizarTexto(funçãoSearch);
        return funcoes
            .filter((função) => {
                const id = normalizarTexto(função.idFuncao || '');
                const nome = normalizarTexto(função.nomeFuncao || '');
                return id.includes(busca) || nome.includes(busca);
            })
            .slice(0, 50);
    }, [funcoes, funçãoSearch]);

    const licencasFiltradas = useMemo(() => {
        if (!licencaSearch.trim()) return licencasDisponiveis;

        const busca = normalizarTexto(licencaSearch);
        return licencasDisponiveis.filter((licenca) => {
            const id = normalizarTexto(licenca.idLic || '');
            const descricao = normalizarTexto(licenca.descricaoLic || '');
            return id.includes(busca) || descricao.includes(busca);
        });
    }, [licencaSearch, licencasDisponiveis]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const responseOpcoes = await fetch('/api/funcionarios/opcoes');
                if (responseOpcoes.ok) {
                    const data = await responseOpcoes.json();
                    setFuncoes(data.funcoes || []);
                    setStatus(data.status || []);
                    setCentros(data.centros || []);
                    setLicencasDisponiveis(data.licencas || []);
                } else {
                    console.error('Falha ao carregar opções do funcionário:', responseOpcoes.status);
                }
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }

            if (funcionarioId) {
                try {
                    const funcionarioData = await fetch(`/api/funcionarios/${funcionarioId}`);
                    if (funcionarioData.ok) {
                        const data = await funcionarioData.json();
                        setFuncionario({
                            idMatFun: data.idMatFun || '',
                            nomeFun: data.nomeFun || '',
                            cpfFun: data.cpfFun || '',
                            dataAdmFun: data.dataAdmFun ? new Date(data.dataAdmFun).toISOString().split('T')[0] : '',
                            dataDesFun: data.dataDesFun ? new Date(data.dataDesFun).toISOString().split('T')[0] : '',
                            avatarFun: data.avatarFun || '',
                            idFuncaoFun: data.idFuncaoFun || '',
                            idStatusFun: data.idStatusFun || '',
                            idCustoFun: data.idCustoFun || '',
                            licencasVinculos: Array.isArray(data.tbHasLicencaFuncionario)
                                ? data.tbHasLicencaFuncionario.map((v: any) => ({
                                    idLic: v.idLinc,
                                    dataInicio: v.dataInicio ? new Date(v.dataInicio).toISOString().split('T')[0] : '',
                                    dataVencimetno: v.dataVencimetno ? new Date(v.dataVencimetno).toISOString().split('T')[0] : ''
                                }))
                                : []
                        });
                    }
                } catch (error) {
                    console.error('Erro ao carregar funcionário:', error);
                }
            }
        };

        carregarDados();
    }, [funcionarioId, setFuncionario]);

    useEffect(() => {
        if (!funcionarioId) {
            setTermosFuncionario([]);
            return;
        }

        const controller = new AbortController();

        const carregarTermos = async () => {
            setTermosLoading(true);
            try {
                const response = await fetch(`/api/cadastro?funcionario=${encodeURIComponent(funcionarioId)}&take=100`, {
                    cache: 'no-store',
                    signal: controller.signal
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(data.message || 'Falha ao carregar termos do funcionário.');
                }

                setTermosFuncionario(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                if ((error as any)?.name === 'AbortError') return;
                console.error('Erro ao carregar termos do funcionário:', error);
                setTermosFuncionario([]);
            } finally {
                setTermosLoading(false);
            }
        };

        void carregarTermos();
        return () => controller.abort();
    }, [funcionarioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['idMatFun', 'nomeFun', 'cpfFun'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

        setFuncionario(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleToggleLicenca = (idLic: string) => {
        setFuncionario((prev) => {
            const existe = prev.licencasVinculos.some((v) => v.idLic === idLic);
            if (existe) {
                return {
                    ...prev,
                    licencasVinculos: prev.licencasVinculos.filter((v) => v.idLic !== idLic)
                };
            }

            return {
                ...prev,
                licencasVinculos: [
                    ...prev.licencasVinculos,
                    {
                        idLic,
                        dataInicio: new Date().toISOString().split('T')[0],
                        dataVencimetno: ''
                    }
                ]
            };
        });
    };

    const handleChangeDataLicenca = (idLic: string, campo: 'dataInicio' | 'dataVencimetno', valor: string) => {
        setFuncionario((prev) => ({
            ...prev,
            licencasVinculos: prev.licencasVinculos.map((v) =>
                v.idLic === idLic ? { ...v, [campo]: valor } : v
            )
        }));
    };

    const isLicencaSelecionada = (idLic: string) => {
        return funcionario.licencasVinculos.some((v) => v.idLic === idLic);
    };

    const getLicencaDisponivel = (idLic: string) => {
        return licencasDisponiveis.find((licenca) => licenca.idLic === idLic);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            for (const vinculo of funcionario.licencasVinculos) {
                if (!vinculo.dataInicio || !vinculo.dataVencimetno) {
                    showNotify('erro', 'Preencha as datas de início e vencimento das licenças selecionadas');
                    setLoading(false);
                    return;
                }

                if (vinculo.dataVencimetno < vinculo.dataInicio) {
                    showNotify('erro', 'A data de vencimento da licença não pode ser menor que a data de início');
                    setLoading(false);
                    return;
                }
            }

            const dados = {
                idMatFun: funcionario.idMatFun,
                nomeFun: funcionario.nomeFun,
                cpfFun: funcionario.cpfFun || null,
                dataAdmFun: funcionario.dataAdmFun ? new Date(funcionario.dataAdmFun) : null,
                dataDesFun: funcionario.dataDesFun ? new Date(funcionario.dataDesFun) : null,
                avatarFun: funcionario.avatarFun || null,
                idFuncaoFun: funcionario.idFuncaoFun || null,
                idStatusFun: funcionario.idStatusFun || null,
                idCustoFun: funcionario.idCustoFun || null,
                licencasVinculos: funcionario.licencasVinculos
            };

            let response;
            if (funcionarioId) {
                response = await fetch(`/api/funcionarios/${funcionarioId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            } else {
                response = await fetch('/api/funcionarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            }

            if (response.ok) {
                const mensagemSucesso = funcionarioId
                    ? 'Funcionário atualizado com sucesso'
                    : 'Funcionário criado com sucesso';
                showNotify('sucesso', mensagemSucesso);
                if (!funcionarioId) clearFuncionarioDraft();
                router.push('/funcionarios');
            } else {
                const error = await response.json();
                showNotify('erro', 'Erro ao salvar funcionário: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotify('erro', 'Erro ao salvar funcionário');
        } finally {
            setLoading(false);
        }
    };

    const selecionarFuncao = (função: Funcao) => {
        setFuncionario((prev) => ({ ...prev, idFuncaoFun: função.idFuncao }));
        setIsFuncaoSheetOpen(false);
        setFuncaoSearch('');
    };

    const abrirBuscaLicencas = () => {
        setLicencaSearch('');
        setIsLicencaSheetOpen(true);
    };

    const HeaderIcon = funcionarioId ? UserPen : UserPlus;

    const formatarDataTermo = (valor?: string | null) => {
        if (!valor) return '-';
        const data = new Date(valor);
        return Number.isNaN(data.getTime()) ? '-' : data.toLocaleDateString('pt-BR');
    };

    const getStatusClass = (status?: string | null) => {
        const normalizado = (status || '').trim().toUpperCase();
        if (normalizado.includes('TRANSFER')) return 'bg-blue-100 text-blue-800';
        if (normalizado.includes('DEVOL')) return 'bg-rose-100 text-rose-800';
        if (normalizado.includes('ATIVO')) return 'bg-emerald-100 text-emerald-800';
        return 'bg-slate-100 text-slate-700';
    };

    return (
        <div className="bg-background min-h-screen py-4 w-full min-w-0">
            <div className="mx-auto w-full max-w-[1800px] px-4">
                <div className="mb-6 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] lg:px-5 lg:py-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-foreground transition hover:bg-secondary"
                            aria-label="Voltar"
                        >
                            <span className="-mt-0.5 text-2xl leading-none">‹ </span>
                        </button>

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white shadow-lg shadow-emerald-950/20">
                            <UserPen className="h-8 w-8" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-[1.45rem] font-semibold tracking-tight text-foreground lg:text-[1.55rem]">
                                Editar Funcionário
                            </h1>
                            <p className="text-[0.95rem] text-muted-foreground">
                                Gerenciar dados cadastrais e profissionais do funcionário
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={handleEnterToNext}
                    className="rounded-2xl border border-border/60 bg-card p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] lg:p-6">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
                        <div className="space-y-6 min-w-0">
                            <section className="rounded-2xl border border-border/60 bg-card p-6">
                                <p className="mb-4 text-sm font-medium text-foreground">Funcionário</p>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Matricula *</label>
                                        <input
                                            type="text"
                                            name="idMatFun"
                                            value={funcionario.idMatFun}
                                            onChange={handleChange}
                                            disabled={!!funcionarioId}
                                            placeholder="Ex: 001"
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-muted/60"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Nome *</label>
                                        <input
                                            type="text"
                                            name="nomeFun"
                                            value={funcionario.nomeFun}
                                            onChange={handleChange}
                                            placeholder="Ex: Joao Rodrigues"
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">CPF</label>
                                        <input
                                            type="text"
                                            name="cpfFun"
                                            value={funcionario.cpfFun}
                                            onChange={handleChange}
                                            placeholder="000.000.000-00"
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Avatar URL</label>
                                        <input
                                            type="text"
                                            name="avatarFun"
                                            value={funcionario.avatarFun}
                                            onChange={handleChange}
                                            placeholder="https://exemplo.com/avatar.jpg"
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-border/60 bg-card p-6">
                                <h2 className="mb-6 text-xl font-semibold text-foreground">Dados Profissionais</h2>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Data de Admissão</label>
                                        <input
                                            type="date"
                                            name="dataAdmFun"
                                            value={funcionario.dataAdmFun}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Data de Desligamento</label>
                                        <input
                                            type="date"
                                            name="dataDesFun"
                                            value={funcionario.dataDesFun}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Função</label>
                                        <div className="flex items-stretch gap-2">
                                            <select
                                                name="idFuncaoFun"
                                                value={funcionario.idFuncaoFun}
                                                onChange={handleChange}
                                                className="min-w-0 h-11 w-full flex-1 rounded-xl border border-border/80 bg-background px-4 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            >
                                                <option value="">Selecione uma função</option>
                                                {funcoes.map(função => (
                                                    <option key={função.idFuncao} value={função.idFuncao}>
                                                        {função.nomeFuncao}
                                                    </option>
                                                ))}
                                            </select>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsFuncaoSheetOpen(true)}
                                                className="h-11 w-11 shrink-0 rounded-xl border-border/80 bg-background p-0 text-foreground hover:bg-secondary"
                                                title="Pesquisar função"
                                                aria-label="Pesquisar função"
                                            >
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                                        <select
                                            name="idStatusFun"
                                            value={funcionario.idStatusFun}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        >
                                            <option value="">Selecione um status</option>
                                            {status.map(s => (
                                                <option key={s.idStatusFun} value={s.idStatusFun}>
                                                    {s.descricaoStatusFun}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Centro de Custo</label>
                                    <select
                                        name="idCustoFun"
                                        value={funcionario.idCustoFun}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        <option value="">Selecione um centro de custo</option>
                                        {centros.map(centro => (
                                            <option key={centro.idCCusto} value={centro.idCCusto}>
                                                {centro.descricaoCCusto || 'Sem descrição'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-border/60 bg-card p-6">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h2 className="text-xl font-semibold text-foreground">Licenças Vinculadas</h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={abrirBuscaLicencas}
                                        className="shrink-0 rounded-xl border-border/80 bg-background text-foreground hover:bg-secondary"
                                    >
                                        Buscar licença
                                    </Button>
                                </div>

                                {funcionario.licencasVinculos.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Nenhuma licença vinculada ao funcionário.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {funcionario.licencasVinculos.map((vinculo) => {
                                            const licenca = getLicencaDisponivel(vinculo.idLic);
                                            return (
                                                <div key={vinculo.idLic} className="rounded-xl border border-border/80 bg-background p-4">
                                                    <div className="mb-3 flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-medium text-foreground">
                                                                {licenca?.descricaoLic || vinculo.idLic}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{vinculo.idLic}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleLicenca(vinculo.idLic)}
                                                            className="text-sm font-medium text-rose-400 transition hover:text-rose-300"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div>
                                                            <label className="mb-1 block text-xs font-medium text-foreground">Data Início</label>
                                                            <input
                                                                type="date"
                                                                value={vinculo.dataInicio}
                                                                onChange={(e) => handleChangeDataLicenca(vinculo.idLic, 'dataInicio', e.target.value)}
                                                                className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-xs font-medium text-foreground">Data Vencimento</label>
                                                            <input
                                                                type="date"
                                                                value={vinculo.dataVencimetno}
                                                                min={vinculo.dataInicio || undefined}
                                                                onChange={(e) => handleChangeDataLicenca(vinculo.idLic, 'dataVencimetno', e.target.value)}
                                                                className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>

                        <aside className="lg:sticky lg:top-6">
                            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-foreground">Histórico de Termos</h2>
                                            <p className="text-sm text-muted-foreground">Visualize os termos vinculados à matrícula.</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="gap-2 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Visualizar
                                    </Button>
                                </div>

                                <div className="mt-4">
                                    {!funcionarioId ? (
                                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background px-4 py-8 text-center">
                                            <Inbox className="h-10 w-10 text-muted-foreground" />
                                            <p className="mt-3 text-sm font-medium text-foreground">Salve o funcionário para listar os termos</p>
                                        </div>
                                    ) : termosLoading ? (
                                        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-border/80 bg-background px-4 py-8 text-sm text-muted-foreground">
                                            Carregando termos...
                                        </div>
                                    ) : termosFuncionario.length === 0 ? (
                                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background px-4 py-8 text-center">
                                            <Inbox className="h-10 w-10 text-muted-foreground" />
                                            <p className="mt-3 text-sm font-medium text-foreground">Nenhum termo encontrado</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Quando houver uma alocação para esta matrícula, ela aparecerá aqui.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {termosFuncionario.map((termo) => {
                                                const patrimonio = termo.tbPatrimonio;
                                                const status = termo.tbStatusPat?.descricaoStatPat || patrimonio?.tbStatusPat?.descricaoStatPat || '-';
                                                const tituloPatrimonio = patrimonio
                                                    ? `${patrimonio.idPat}${patrimonio.descricaoPat ? ` - ${patrimonio.descricaoPat}` : ''}`
                                                    : termo.idPatCad;

                                                return (
                                                    <div key={termo.idCad} className="rounded-xl border border-border/80 bg-background p-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-semibold text-foreground">{tituloPatrimonio}</p>
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    Termo gerado em {formatarDataTermo(termo.dataCadPat)}
                                                                </p>
                                                            </div>
                                                            <Badge className={getStatusClass(status)}>{status}</Badge>
                                                        </div>

                                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                            <div>
                                                                <span className="block font-medium text-foreground">Centro</span>
                                                                {patrimonio?.tbCCusto?.descricaoCCusto || '-'}
                                                            </div>
                                                            <div>
                                                                <span className="block font-medium text-foreground">Tipo</span>
                                                                {patrimonio?.tbTipoPat?.descricaoTipPat || '-'}
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-end">
                                                            <Button asChild size="sm" variant="outline" className="gap-2 border-border/80 bg-background text-foreground hover:bg-secondary">
                                                                <a href={`/alocacoes/${termo.idCad}/termo`}>
                                                                    Abrir termo
                                                                    <ArrowRight className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="mt-6">
                        <FormActions
                            cancelHref="/funcionarios"
                            submitLabel={funcionarioId ? 'Atualizar' : 'Criar Funcionário'}
                            loading={loading}
                        />
                    </div>
                </form>
            </div>

            <Sheet open={isFuncaoSheetOpen} onOpenChange={setIsFuncaoSheetOpen}>
                <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle>Pesquisar Função</SheetTitle>
                        <SheetDescription>
                            Digite o nome ou código da função para buscar
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por código ou função..."
                                value={funçãoSearch}
                                onChange={(e) => setFuncaoSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>

                        <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Código</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Função</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funcoesFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                                Nenhuma função encontrada
                                            </td>
                                        </tr>
                                    ) : (
                                        funcoesFiltradas.map((função) => (
                                            <tr key={função.idFuncao}
                                                className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium">
                                                    {função.codigoFuncao}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {função.nomeFuncao}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => selecionarFuncao(função)}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Selecionar"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isLicencaSheetOpen} onOpenChange={setIsLicencaSheetOpen}>
                <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle>Buscar Licença</SheetTitle>
                        <SheetDescription>
                            Pesquise por código ou descrição e marque as licenças que deseja vincular.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por código ou licença..."
                                value={licencaSearch}
                                onChange={(e) => setLicencaSearch(e.target.value)}
                                className="w-full rounded-lg border px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                            {licencasFiltradas.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground">
                                    Nenhuma licença encontrada.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {licencasFiltradas.map((licenca) => {
                                        const selecionada = isLicencaSelecionada(licenca.idLic);
                                        return (
                                            <label
                                                key={licenca.idLic}
                                                className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-secondary/40"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selecionada}
                                                    onChange={() => handleToggleLicenca(licenca.idLic)}
                                                    className="h-4 w-4"
                                                />
                                                <div className="min-w-0">
                                                    <div className="font-medium text-foreground">
                                                        {licenca.descricaoLic}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{licenca.idLic}</div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
