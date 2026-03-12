'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/back-end/components/ui/sheet';
import Link from 'next/link';
import { ChevronLeft, Search, Filter } from 'lucide-react';

interface Funcionario {
    idMatFun: string;
    nomeFun: string;
}

interface Patrimonio {
    idPat: string;
    descricaoPat: string;
}

interface StatusPatrimonio {
    idStatusPat: string;
    descricaoStatPat: string;
}

type SheetTipo = 'funcionario' | 'patrimonio' | null;

export default function CadastroForm({
    funcionarioId,
    patrimonioId
}: {
    funcionarioId?: string;
    patrimonioId?: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
    const [statusPatrimonio, setStatusPatrimonio] = useState<StatusPatrimonio[]>([]);
    const [sheetAberto, setSheetAberto] = useState<SheetTipo>(null);
    const [filtroFuncionario, setFiltroFuncionario] = useState('');
    const [filtroPatrimonio, setFiltroPatrimonio] = useState('');
    const [cadastro, setCadastro] = useState({
        idMatFunCad: funcionarioId || '',
        idPatCad: patrimonioId || '',
        dataCadPat: new Date().toISOString().split('T')[0],
        dataDevPat: '',
        idStatusPatCad: ''
    });

    useEffect(() => {
        const carregarOpcoes = async () => {
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
        };

        carregarOpcoes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCadastro(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectFuncionario = (func: Funcionario) => {
        setCadastro(prev => ({ ...prev, idMatFunCad: func.idMatFun }));
        setSheetAberto(null);
    };

    const handleSelectPatrimonio = (pat: Patrimonio) => {
        setCadastro(prev => ({ ...prev, idPatCad: pat.idPat }));
        setSheetAberto(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cadastro.idMatFunCad) {
            alert('Selecione um funcionário.');
            return;
        }
        if (!cadastro.idPatCad) {
            alert('Selecione um patrimônio.');
            return;
        }
        setLoading(true);

        try {
            const payload = {
                idMatFunCad: cadastro.idMatFunCad,
                idPatCad: cadastro.idPatCad,
                dataCadPat: cadastro.dataCadPat,
                dataDevPat: cadastro.dataDevPat || null,
                idStatusPatCad: cadastro.idStatusPatCad || undefined
            };

            const res = await fetch('/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/alocacoes');
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.message || 'Erro ao vincular patrimônio');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    const funcionarioSelecionado = funcionarios.find(f => f.idMatFun === cadastro.idMatFunCad);
    const patrimonioSelecionado = patrimonios.find(p => p.idPat === cadastro.idPatCad);

    const funcionariosFiltrados = useMemo(() => {
        if (!filtroFuncionario.trim()) return funcionarios;
        const termo = filtroFuncionario.trim().toLowerCase();
        return funcionarios.filter(
            f =>
                f.nomeFun.toLowerCase().includes(termo) ||
                f.idMatFun.toLowerCase().includes(termo)
        );
    }, [funcionarios, filtroFuncionario]);

    const patrimoniosFiltrados = useMemo(() => {
        if (!filtroPatrimonio.trim()) return patrimonios;
        const termo = filtroPatrimonio.trim().toLowerCase();
        return patrimonios.filter(
            p =>
                p.idPat.toLowerCase().includes(termo) ||
                (p.descricaoPat && p.descricaoPat.toLowerCase().includes(termo))
        );
    }, [patrimonios, filtroPatrimonio]);

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
    }, [cadastro.dataDevPat, cadastro.idStatusPatCad, statusPatrimonio]);

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center mb-6">
                    <Link href="/alocacoes" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">Vincular Patrimônio ao Funcionário</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Funcionário *</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={funcionarioSelecionado ? `${funcionarioSelecionado.nomeFun} (${funcionarioSelecionado.idMatFun})` : ''}
                                placeholder="Selecione um funcionário"
                                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSheetAberto('funcionario')}
                                className="shrink-0"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Pesquisar
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Patrimônio *</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={patrimonioSelecionado ? `${patrimonioSelecionado.idPat} - ${patrimonioSelecionado.descricaoPat}` : ''}
                                placeholder="Selecione um patrimônio"
                                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSheetAberto('patrimonio')}
                                className="shrink-0"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Pesquisar
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Status da Alocação *</label>
                        <select
                            name="idStatusPatCad"
                            value={cadastro.idStatusPatCad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="" disabled>Selecione o status</option>
                            {statusPatrimonio.map(status => (
                                <option key={status.idStatusPat} value={status.idStatusPat}>
                                    {status.descricaoStatPat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Data de Alocação *</label>
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
                        <label className="block text-sm font-medium mb-2">Data de Devolução</label>
                        <input
                            type="date"
                            name="dataDevPat"
                            value={cadastro.dataDevPat}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Deixe em branco se ainda não foi devolvido"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/alocacoes">
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Vincular'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Sheet de seleção de funcionário */}
            <Sheet
                open={sheetAberto === 'funcionario'}
                onOpenChange={(open) => {
                    if (!open) {
                        setSheetAberto(null);
                        setFiltroFuncionario('');
                    }
                }}
            >
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Pesquisar Funcionário</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary shrink-0" />
                            <input
                                type="text"
                                placeholder="Filtrar por matrícula ou nome..."
                                value={filtroFuncionario}
                                onChange={(e) => setFiltroFuncionario(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Matrícula</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold w-24">Selecionar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funcionarios.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                                Nenhum funcionário cadastrado
                                            </td>
                                        </tr>
                                    ) : funcionariosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                                Nenhum resultado para &quot;{filtroFuncionario}&quot;
                                            </td>
                                        </tr>
                                    ) : (
                                        funcionariosFiltrados.map(func => (
                                        <tr
                                            key={func.idMatFun}
                                            className="border-b hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => handleSelectFuncionario(func)}
                                        >
                                            <td className="px-4 py-3 text-sm font-medium">{func.idMatFun}</td>
                                            <td className="px-4 py-3 text-sm">{func.nomeFun}</td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectFuncionario(func);
                                                    }}
                                                >
                                                    Selecionar
                                                </Button>
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

            {/* Sheet de seleção de patrimônio */}
            <Sheet
                open={sheetAberto === 'patrimonio'}
                onOpenChange={(open) => {
                    if (!open) {
                        setSheetAberto(null);
                        setFiltroPatrimonio('');
                    }
                }}
            >
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Pesquisar Patrimônio</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary shrink-0" />
                            <input
                                type="text"
                                placeholder="Filtrar por código ou descrição..."
                                value={filtroPatrimonio}
                                onChange={(e) => setFiltroPatrimonio(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Código</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Descrição</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold w-24">Selecionar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patrimonios.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                                Nenhum patrimônio cadastrado
                                            </td>
                                        </tr>
                                    ) : patrimoniosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                                Nenhum resultado para &quot;{filtroPatrimonio}&quot;
                                            </td>
                                        </tr>
                                    ) : (
                                        patrimoniosFiltrados.map(pat => (
                                        <tr
                                            key={pat.idPat}
                                            className="border-b hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => handleSelectPatrimonio(pat)}
                                        >
                                            <td className="px-4 py-3 text-sm font-medium">{pat.idPat}</td>
                                            <td className="px-4 py-3 text-sm">{pat.descricaoPat}</td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectPatrimonio(pat);
                                                    }}
                                                >
                                                    Selecionar
                                                </Button>
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
