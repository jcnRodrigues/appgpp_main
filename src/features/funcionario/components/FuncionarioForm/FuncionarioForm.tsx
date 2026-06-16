'use client'

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { Button } from '@/components/ui/button';
import FormActions from '@/components/FormActions/FormActions';
import { Search, Check, UserPenIcon, UserPlus, UserPen } from 'lucide-react';
import Link from 'next/link';
import { useFormDraft } from '@/hooks/useFormDraft';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { notify as showNotify } from '@/lib/notify';
import PageHeader from '@/components/PageHeader/PageHeader';

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

export default function FuncionarioForm({ funcionarioId }: { funcionarioId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [funcoes, setFuncoes] = useState<Funcao[]>([]);
    const [status, setStatus] = useState<StatusFuncionario[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [licencasDisponiveis, setLicencasDisponiveis] = useState<LicencaDisponivel[]>([]);
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
                const responseOpcoes = await fetch('/api/funcionario/opcoes');
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
                    const funcionarioData = await fetch(`/api/funcionario/${funcionarioId}`);
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

    const getVinculoLicenca = (idLic: string) => {
        return funcionario.licencasVinculos.find((v) => v.idLic === idLic);
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
                response = await fetch(`/api/funcionario/${funcionarioId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            } else {
                response = await fetch('/api/funcionario', {
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
                router.push('/funcionariosadd');
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

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <PageHeader
                    icon={HeaderIcon}
                    title={funcionarioId ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
                    description="Gerenciar dados cadastrais e profissionais do funcionário"
                    backHref="/funcionariosadd"
                />

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Informações Pessoais</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Matricula *</label>
                                <input
                                    type="text"
                                    name="idMatFun"
                                    value={funcionario.idMatFun}
                                    onChange={handleChange}
                                    disabled={!!funcionarioId}
                                    placeholder="Ex: 001"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Nome *</label>
                                <input
                                    type="text"
                                    name="nomeFun"
                                    value={funcionario.nomeFun}
                                    onChange={handleChange}
                                    placeholder="Ex: Joao Rodrigues"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">CPF</label>
                                <input
                                    type="text"
                                    name="cpfFun"
                                    value={funcionario.cpfFun}
                                    onChange={handleChange}
                                    placeholder="000.000.000-00"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                                <input
                                    type="text"
                                    name="avatarFun"
                                    value={funcionario.avatarFun}
                                    onChange={handleChange}
                                    placeholder="https://exemplo.com/avatar.jpg"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Dados Profissionais</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Admissão</label>
                                <input
                                    type="date"
                                    name="dataAdmFun"
                                    value={funcionario.dataAdmFun}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Desligamento</label>
                                <input
                                    type="date"
                                    name="dataDesFun"
                                    value={funcionario.dataDesFun}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Função</label>
                                <div className="flex w-full gap-2 items-stretch">
                                    <select
                                        name="idFuncaoFun"
                                        value={funcionario.idFuncaoFun}
                                        onChange={handleChange}
                                        className="min-w-0 w-full flex-1 h-10 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="h-10 w-10 shrink-0 p-0"
                                        title="Pesquisar função"
                                        aria-label="Pesquisar função"
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    name="idStatusFun"
                                    value={funcionario.idStatusFun}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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

                        <div>
                            <label className="block text-sm font-medium mb-2">Centro de Custo</label>
                            <select
                                name="idCustoFun"
                                value={funcionario.idCustoFun}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione um centro de custo</option>
                                {centros.map(centro => (
                                    <option key={centro.idCCusto} value={centro.idCCusto}>
                                        {centro.descricaoCCusto || 'Sem descrição'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-h4 font-bold">Licenças Vinculadas</h2>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={abrirBuscaLicencas}
                                className="shrink-0"
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
                                        <div key={vinculo.idLic} className="rounded-lg border border-border p-4">
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
                                                    className="text-sm font-medium text-red-600 transition hover:text-red-700"
                                                >
                                                    Remover
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                <div>
                                                    <label className="block text-xs font-medium mb-1">Data Início</label>
                                                    <input
                                                        type="date"
                                                        value={vinculo.dataInicio}
                                                        onChange={(e) => handleChangeDataLicenca(vinculo.idLic, 'dataInicio', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium mb-1">Data Vencimento</label>
                                                    <input
                                                        type="date"
                                                        value={vinculo.dataVencimetno}
                                                        min={vinculo.dataInicio || undefined}
                                                        onChange={(e) => handleChangeDataLicenca(vinculo.idLic, 'dataVencimetno', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <FormActions
                        cancelHref="/funcionariosadd"
                        submitLabel={funcionarioId ? 'Atualizar' : 'Criar Funcionário'}
                        loading={loading}
                    />
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
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Código</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Função</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funcoesFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
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
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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





