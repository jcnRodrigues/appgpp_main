'use client'

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { Button } from '@/components/ui/button';
import FormActions from '@/components/FormActions/FormActions';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { PackagePlus, Search, Check } from 'lucide-react';
import { useFormDraft } from '@/hooks/useFormDraft';
import { notify as showNotify } from '@/lib/notify';
import PageHeader from '@/components/PageHeader/PageHeader';

interface Funcionario {
    idF: string;
    idMatFun: string;
    nomeFun: string;
    cpfFun?: string;
    tbFuncao?: {
        nomeFuncao: string;
    };
    tbStatusFun?: {
        descricaoStatusFun: string;
    };
}

interface Patrimonio {
    idPat: string;
    descricaoPat: string;
    descricaoDetalhadaPat?: string;
    tbStatusPat?: {
        descricaoStatPat: string;
    };
    tbCCusto?: {
        descricaoCCusto?: string;
    };
}

interface StatusPatrimonio {
    idStatusPat: string;
    descricaoStatPat: string;
}

function normalizarTexto(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export default function CadastroForm({
    funcionarioId,
    patrimonioId,
    preservarHistoricoPatrimonio = false
}: {
    funcionarioId?: string;
    patrimonioId?: string;
    preservarHistoricoPatrimonio?: boolean;
}) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
    const [statusPatrimonio, setStatusPatrimonio] = useState<StatusPatrimonio[]>([]);
    const initialCadastro = useMemo(() => ({
        idMatFunCad: funcionarioId || '',
        idPatCad: patrimonioId || '',
        dataCadPat: new Date().toISOString().split('T')[0],
        dataDevPat: '',
        idStatusPatCad: '',
        motivoDevolucao: ''
    }), [funcionarioId, patrimonioId]);
    const {
        state: cadastro,
        setState: setCadastro,
        clearDraft: clearCadastroDraft
    } = useFormDraft(
        `cadastro-form-create:${funcionarioId || 'none'}:${patrimonioId || 'none'}:${preservarHistoricoPatrimonio ? 'historico' : 'normal'}`,
        initialCadastro
    );

    // Estados para os modais de pesquisa
    const [isFuncionarioSheetOpen, setIsFuncionarioSheetOpen] = useState(false);
    const [isPatrimonioSheetOpen, setIsPatrimonioSheetOpen] = useState(false);

    // Estados para busca
    const [funcionarioSearch, setFuncionarioSearch] = useState('');
    const [patrimonioSearch, setPatrimonioSearch] = useState('');
    const [funcionariosFiltrados, setFuncionariosFiltrados] = useState<Funcionario[]>([]);
    const [patrimoniosFiltrados, setPatrimoniosFiltrados] = useState<Patrimonio[]>([]);

    const carregarOpcoes = useCallback(async () => {
        try {
            const res = await fetch('/api/cadastro?opcoes=true');
            if (res.ok) {
                const data = await res.json();
                setFuncionarios(data.funcionarios || []);
                setPatrimonios(data.patrimonios || []);
                setStatusPatrimonio(data.statusPatrimonio || []);
                if (!cadastro.idStatusPatCad && data.statusPatrimonio?.length) {
                    setCadastro(prev => ({ ...prev, idStatusPatCad: data.statusPatrimonio[0].idStatusPat }));
                }
            }
        } catch (error) {
            console.error('Erro ao carregar opções:', error);
        }
    }, [cadastro.idStatusPatCad, setCadastro]);

    useEffect(() => {
        carregarOpcoes();
    }, [carregarOpcoes]);

    // Efeito para filtrar funcionários (matricula + nome)
    useEffect(() => {
        const filtrarFuncionarios = () => {
            if (!funcionarioSearch.trim()) {
                setFuncionariosFiltrados(funcionarios.slice(0, 50));
                return;
            }

            const busca = normalizarTexto(funcionarioSearch);
            const filtrados = funcionarios.filter((func) => {
                const matricula = normalizarTexto(func.idMatFun || '');
                const nome = normalizarTexto(func.nomeFun || '');
                return matricula.includes(busca) || nome.includes(busca);
            });

            setFuncionariosFiltrados(filtrados.slice(0, 50));
        };

        filtrarFuncionarios();
    }, [funcionarioSearch, funcionarios]);

    // Efeito para filtrar patrimônios (codigo + descricao)
    useEffect(() => {
        const filtrarPatrimonios = () => {
            if (!patrimonioSearch.trim()) {
                setPatrimoniosFiltrados(patrimonios.slice(0, 50));
                return;
            }

            const busca = normalizarTexto(patrimonioSearch);
            const filtrados = patrimonios.filter((pat) => {
                const codigo = normalizarTexto(pat.idPat || '');
                const descricao = normalizarTexto(pat.descricaoPat || '');
                const descricaoDetalhada = normalizarTexto(pat.descricaoDetalhadaPat || '');
                return codigo.includes(busca) || descricao.includes(busca) || descricaoDetalhada.includes(busca);
            });

            setPatrimoniosFiltrados(filtrados.slice(0, 50));
        };

        filtrarPatrimonios();
    }, [patrimonioSearch, patrimonios]);

    const handleChange = (e: any) => {
        setCadastro(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        if (!statusPatrimonio.length) return;
        const statusDevolvido = statusPatrimonio.find(
            s => s.descricaoStatPat.toLowerCase().includes('devolv')
        );
        const statusAtivo = statusPatrimonio.find(
            s => s.descricaoStatPat.toLowerCase() === 'ativo'
        );

        if (cadastro.dataDevPat) {
            if (statusDevolvido && cadastro.idStatusPatCad !== statusDevolvido.idStatusPat) {
                setCadastro(prev => ({ ...prev, idStatusPatCad: statusDevolvido.idStatusPat }));
            }
        } else if (statusAtivo && cadastro.idStatusPatCad === (statusDevolvido?.idStatusPat || '')) {
            setCadastro(prev => ({ ...prev, idStatusPatCad: statusAtivo.idStatusPat }));
        }
    }, [cadastro.dataDevPat, cadastro.idStatusPatCad, statusPatrimonio, setCadastro]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true); //  Corrigido: era setLoading(false)

        // Validações
        if (!cadastro.idMatFunCad) {
            showNotify("aviso", 'Por favor, selecione um funcionário');
            setLoading(false);
            return;
        }

        if (!cadastro.idPatCad) {
            showNotify("aviso", 'Por favor, selecione um patrimônio');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                idMatFunCad: cadastro.idMatFunCad,
                idPatCad: cadastro.idPatCad,
                dataCadPat: cadastro.dataCadPat,
                dataDevPat: cadastro.dataDevPat || null,
                idStatusPatCad: cadastro.idStatusPatCad || undefined,
                motivoDevolucao: cadastro.motivoDevolucao || null,
                preservarHistoricoPatrimonio
            };

            const res = await fetch('/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showNotify("sucesso", 'Alocação criada com sucesso');
                clearCadastroDraft();
                router.push('/alocacoes');
            } else {
                const err = await res.json();
                showNotify("erro", err.message || 'Erro ao vincular patrimônio');
            }
        } catch (error) {
            console.error(error);
            showNotify("erro", 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    const selectFuncionario = (func: Funcionario) => {
        setCadastro(prev => ({ ...prev, idMatFunCad: func.idMatFun }));
        setIsFuncionarioSheetOpen(false);
        setFuncionarioSearch('');
    };

    const selectPatrimonio = (pat: Patrimonio) => {
        setCadastro(prev => ({ ...prev, idPatCad: pat.idPat }));
        setIsPatrimonioSheetOpen(false);
        setPatrimonioSearch('');
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-[54.6rem] mx-auto px-4">
                <PageHeader
                    icon={PackagePlus}
                    title={'Vincular Patrimônio ao Funcionário'}
                    description={'Associe um patrimônio a um funcionário com segurança.'}
                    backHref="/alocacoes"
                    iconClassName="from-slate-950 via-slate-800 to-emerald-700"
                />

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="form-surface space-y-6 p-4 sm:p-6 lg:p-8">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-red-600">{'Funcionário *'}</label>
                        <div className="flex w-full gap-2 items-stretch">
                            <select
                                name="idMatFunCad"
                                value={cadastro.idMatFunCad}
                                onChange={handleChange}
                                required
                                className={`min-w-0 w-full flex-1 h-10 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    !cadastro.idMatFunCad ? 'border-red-300 bg-red-50' : ''
                                }`}
                            >
                                <option value="">{'--- Selecione um funcionário ---'}</option>
                                {funcionarios.map(func => (
                                    <option key={func.idMatFun} value={func.idMatFun}>
                                        {func.idMatFun} - {func.nomeFun}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setFuncionariosFiltrados(funcionarios.slice(0, 50));
                                    setIsFuncionarioSheetOpen(true);
                                }}
                                title={'Pesquisar funcionário'}
                                className="h-10 w-10 shrink-0 p-0"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        {!cadastro.idMatFunCad && (
                            <p className="text-red-600 text-xs mt-1">{'Campo obrigatório'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-red-600">{'Patrimônio *'}</label>
                        <div className="flex w-full gap-2 items-stretch">
                            <select
                                name="idPatCad"
                                value={cadastro.idPatCad}
                                onChange={handleChange}
                                required
                                className={`min-w-0 w-full flex-1 h-10 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    !cadastro.idPatCad ? 'border-red-300 bg-red-50' : ''
                                }`}
                            >
                                <option value="">{'--- Selecione um patrimônio ---'}</option>
                                {patrimonios.map(pat => (
                                    <option key={pat.idPat} value={pat.idPat}>
                                        {pat.idPat} - {pat.descricaoPat}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setPatrimoniosFiltrados(patrimonios.slice(0, 50));
                                    setIsPatrimonioSheetOpen(true);
                                }}
                                title={'Pesquisar patrimônio'}
                                className="h-10 w-10 shrink-0 p-0"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        {!cadastro.idPatCad && (
                            <p className="text-red-600 text-xs mt-1">{'Campo obrigatório'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{'Data de Alocação *'}</label>
                        <input
                            type="date"
                            name="dataCadPat"
                            value={cadastro.dataCadPat}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{'Status da Alocação *'}</label>
                        <select
                            name="idStatusPatCad"
                            value={cadastro.idStatusPatCad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">{'---Selecione o status---'}</option>
                            {statusPatrimonio.map(status => (
                                <option key={status.idStatusPat} value={status.idStatusPat}>
                                    {status.descricaoStatPat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{'Data de Devolução'}</label>
                        <input
                            type="date"
                            name="dataDevPat"
                            value={cadastro.dataDevPat}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Deixe em branco se ainda não foi devolvido"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">{'Motivo da Devolução'}</label>
                        <input
                            type="text"
                            name="motivoDevolucao"
                            value={cadastro.motivoDevolucao}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={'Ex: equipamento com defeito'}
                        />
                    </div>

                    <FormActions
                        cancelHref="/alocacoes"
                        submitLabel={'Vincular'}
                        loading={loading}
                    />
                </form>
            </div>

            {/* Sheet de Pesquisa de Funcionário */}
            <Sheet open={isFuncionarioSheetOpen} onOpenChange={setIsFuncionarioSheetOpen}>
                <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle>{'Pesquisar Funcionário'}</SheetTitle>
                        <SheetDescription>
                            {'Digite o nome ou matrícula do funcionário para buscar'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={'Buscar por nome ou matrícula...'}
                                value={funcionarioSearch}
                                onChange={(e) => setFuncionarioSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>

                        <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Matrícula'}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Nome'}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Função'}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Status'}</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">{'Ação'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funcionariosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                {'Nenhum funcionário encontrado'}
                                            </td>
                                        </tr>
                                    ) : (
                                        funcionariosFiltrados.map((func) => (
                                            <tr key={func.idF} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium">{func.idMatFun}</td>
                                                <td className="px-4 py-3 text-sm">{func.nomeFun}</td>
                                                <td className="px-4 py-3 text-sm">{func.tbFuncao?.nomeFuncao || '-'}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${func.tbStatusFun?.descricaoStatusFun === 'ADMITIDO' ? 'bg-green-100 text-green-800' :
                                                        func.tbStatusFun?.descricaoStatusFun === 'DEMITIDO' ? 'bg-red-100 text-red-800' :
                                                            'bg-muted text-foreground'
                                                        }`}>
                                                        {func.tbStatusFun?.descricaoStatusFun || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => selectFuncionario(func)}
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

            {/* Sheet de Pesquisa de Patrimônio */}
            <Sheet open={isPatrimonioSheetOpen} onOpenChange={setIsPatrimonioSheetOpen}>
                <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle>{'Pesquisar Patrimônio'}</SheetTitle>
                        <SheetDescription>
                            {'Digite a descrição ou ID do patrimônio para buscar'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={'Buscar por código ou descrição...'}
                                value={patrimonioSearch}
                                onChange={(e) => setPatrimonioSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>

                        <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'ID'}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Descrição'}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Status'}</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{'Centro Custo'}</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">{'Ação'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patrimoniosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                {'Nenhum patrimônio encontrado'}
                                            </td>
                                        </tr>
                                    ) : (
                                        patrimoniosFiltrados.map((pat) => (
                                            <tr key={pat.idPat} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium">{pat.idPat}</td>
                                                <td className="px-4 py-3 text-sm max-w-xs truncate">{pat.descricaoPat}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${pat.tbStatusPat?.descricaoStatPat === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                                            pat.tbStatusPat?.descricaoStatPat === 'INATIVO' ? 'bg-blue-100 text-foreground' :
                                                                pat.tbStatusPat?.descricaoStatPat === 'DEVOLUÇÃO' ? 'bg-yellow-100 text-red-800' :
                                                                    pat.tbStatusPat?.descricaoStatPat === 'TRANSFERIDO' ? 'bg-green-100 text-blue-800' :
                                                                        pat.tbStatusPat?.descricaoStatPat === 'PENDENTE' ? 'bg-blue-100 text-yellow-800' :
                                                                            pat.tbStatusPat?.descricaoStatPat === 'MANUTENÇÃO' ? 'bg-yellow-100 text-purple-800' :
                                                                                'bg-muted text-foreground'
                                                        }`}>
                                                        {pat.tbStatusPat?.descricaoStatPat || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{pat.tbCCusto?.descricaoCCusto || '-'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => selectPatrimonio(pat)}
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
        </div>
    );
}













