'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

interface CadastroData {
    idCad: string;
    dataCadPat: string | null;
    dataDevPat: string | null;
    idPatCad?: string;
    idStatusPatCad?: string | null;
    tbDevolucao?: { motivoDevolucao?: string | null }[];
    tbStatusPat?: { idStatusPat: string; descricaoStatPat: string } | null;
    tbFuncionario: { idMatFun: string; nomeFun: string } | null;
    tbPatrimonio: {
        idPat: string;
        descricaoPat: string;
        tbCadastro?: {
            tbFuncionario?: {
                idMatFun: string;
                nomeFun: string;
            } | null;
        }[];
    } | null;
    tbTransferenciaAlocacao?: {
        idTransferenciaAlocacao: string;
        dataTransferencia: string;
        statusAnterior?: string | null;
        statusNovo: string;
        observacao?: string | null;
        tbFuncionario?: { idMatFun: string; nomeFun: string } | null;
        tbFuncionarioDestino?: { idMatFun: string; nomeFun: string } | null;
        tbUser?: { nomeUser?: string | null; emailUser?: string | null } | null;
    }[];
}

interface StatusPatrimonio {
    idStatusPat: string;
    descricaoStatPat: string;
}

interface FuncionarioOpcao {
    idMatFun: string;
    nomeFun: string;
}

export default function CadastroEditForm({ cadastroId }: { cadastroId: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [cadastro, setCadastro] = useState<CadastroData | null>(null);
    const [statusPatrimonio, setStatusPatrimonio] = useState<StatusPatrimonio[]>([]);
    const [funcionarios, setFuncionarios] = useState<FuncionarioOpcao[]>([]);
    const [modalTransferenciaAberto, setModalTransferenciaAberto] = useState(false);
    const [funcionarioDestino, setFuncionarioDestino] = useState('');
    const [dataTransferencia, setDataTransferencia] = useState('');
    const [buscaFuncionario, setBuscaFuncionario] = useState('');
    const [funcionariosFiltrados, setFuncionariosFiltrados] = useState<FuncionarioOpcao[]>([]);
    const [mostrarHistorico, setMostrarHistorico] = useState(false);
    const [dados, setDados] = useState({
        dataCadPat: '',
        dataDevPat: '',
        idStatusPatCad: '',
        motivoDevolucao: '',
        observacaoTransferencia: ''
    });

    const hojeISO = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resCadastro, resOpcoes] = await Promise.all([
                    fetch(`/api/cadastro/${cadastroId}`),
                    fetch('/api/cadastro?opcoes=true')
                ]);

                if (resOpcoes.ok) {
                    const opcoes = await resOpcoes.json();
                    setStatusPatrimonio(opcoes.statusPatrimonio || []);
                    setFuncionarios(opcoes.funcionarios || []);
                }

                if (resCadastro.ok) {
                    const data = await resCadastro.json();
                    setCadastro(data);
                    setDados({
                        dataCadPat: data.dataCadPat ? new Date(data.dataCadPat).toISOString().split('T')[0] : '',
                        dataDevPat: data.dataDevPat ? new Date(data.dataDevPat).toISOString().split('T')[0] : '',
                        idStatusPatCad: data.idStatusPatCad || data.tbStatusPat?.idStatusPat || '',
                        motivoDevolucao: data.tbDevolucao?.[0]?.motivoDevolucao || '',
                        observacaoTransferencia: ''
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [cadastroId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'idStatusPatCad') {
            const statusSelecionado = statusPatrimonio.find((s) => s.idStatusPat === value);
            const isTransferidoSelecionado = (statusSelecionado?.descricaoStatPat || '').trim().toUpperCase().includes('TRANSFER');
            if (isTransferidoSelecionado) {
                setModalTransferenciaAberto(true);
            }
        }
        setDados((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (!statusPatrimonio.length) return;
        const statusDevolvido = statusPatrimonio.find((s) => s.descricaoStatPat.toLowerCase().includes('devolv'));
        const statusAtivo = statusPatrimonio.find((s) => s.descricaoStatPat.toLowerCase() === 'ativo');

        if (dados.dataDevPat) {
            if (statusDevolvido && dados.idStatusPatCad !== statusDevolvido.idStatusPat) {
                setDados((prev) => ({ ...prev, idStatusPatCad: statusDevolvido.idStatusPat }));
            }
        } else if (statusAtivo && dados.idStatusPatCad === (statusDevolvido?.idStatusPat || '')) {
            setDados((prev) => ({ ...prev, idStatusPatCad: statusAtivo.idStatusPat }));
        }
    }, [dados.dataDevPat, dados.idStatusPatCad, statusPatrimonio]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const payload = {
                dataCadPat: dados.dataCadPat,
                dataDevPat: dados.dataDevPat || null,
                idStatusPatCad: dados.idStatusPatCad || null,
                motivoDevolucao: dados.motivoDevolucao || null,
                observacaoTransferencia: dados.observacaoTransferencia || null
            };

            const res = await fetch(`/api/cadastro/${cadastroId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                window.systemAlert?.('sucesso', 'Alocação atualizada com sucesso');
                router.push('/alocacoes');
            } else {
                const err = await res.json();
                window.systemAlert?.('erro', err.message || 'Erro ao atualizar');
            }
        } catch (error) {
            console.error(error);
            window.systemAlert?.('erro', 'Erro ao salvar');
        } finally {
            setSalvando(false);
        }
    };

    const handleConfirmarTransferencia = async () => {
        if (!funcionarioDestino) {
            window.systemAlert?.('erro', 'Selecione o funcionário de destino.');
            return;
        }
        if (!dataTransferencia) {
            window.systemAlert?.('erro', 'Informe a data da transferência.');
            return;
        }

        setSalvando(true);
        try {
            const res = await fetch(`/api/cadastro/${cadastroId}/transferir`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idMatFunDestino: funcionarioDestino,
                    dataTransferencia,
                    observacaoTransferencia: dados.observacaoTransferencia || null
                })
            });

            if (!res.ok) {
                const err = await res.json();
                window.systemAlert?.('erro', err.message || 'Erro ao transferir alocação');
                return;
            }

            window.systemAlert?.('sucesso', 'Transferência concluída e nova alocação criada automaticamente.');
            router.push('/alocacoes');
        } catch (error) {
            console.error(error);
            window.systemAlert?.('erro', 'Erro ao transferir alocação');
        } finally {
            setSalvando(false);
            setModalTransferenciaAberto(false);
        }
    };

    useEffect(() => {
        if (modalTransferenciaAberto) {
            setDataTransferencia(hojeISO());
        }
    }, [modalTransferenciaAberto]);

    const filtrarFuncionarios = (textoBusca: string) => {
        const termo = textoBusca.trim().toLowerCase();
        const base = funcionarios.filter((f) => f.idMatFun !== cadastro?.tbFuncionario?.idMatFun);
        if (!termo) return base;
        return base.filter((f) =>
            f.nomeFun.toLowerCase().includes(termo) || f.idMatFun.toLowerCase().includes(termo)
        );
    };

    const handlePesquisarFuncionario = () => {
        setFuncionariosFiltrados(filtrarFuncionarios(buscaFuncionario));
    };

    if (loading) return <div className="text-center py-8">Carregando...</div>;
    if (!cadastro) return <div className="text-center py-8">Alocação não encontrada</div>;

    const statusSelecionado = statusPatrimonio.find((s) => s.idStatusPat === dados.idStatusPatCad);
    const isTransferido = (statusSelecionado?.descricaoStatPat || '').trim().toUpperCase().includes('TRANSFER');
    const funcionarioDestinoAtual = cadastro.tbPatrimonio?.tbCadastro?.[0]?.tbFuncionario;

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-[95vw] lg:max-w-[92vw] mx-auto px-4">
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/alocacoes" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">Editar Alocação</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleEnterToNext}
                        className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Funcionário
                                </label>
                                <input
                                    type="text" disabled
                                    value={cadastro.tbFuncionario ? `${cadastro.tbFuncionario.idMatFun} - ${cadastro.tbFuncionario.nomeFun}` : '-'}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Patrimônio
                                </label>
                                <input type="text" disabled
                                    value={cadastro.tbPatrimonio ? `${cadastro.tbPatrimonio.idPat} - ${cadastro.tbPatrimonio.descricaoPat}` : '-'}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Data de Alocação *
                                </label>
                                <input type="date" disabled={isTransferido}
                                    name="dataCadPat"
                                    value={dados.dataCadPat}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Data Devolução Interna
                                </label>
                                <input type="date" disabled={isTransferido}
                                    name="dataDevPat"
                                    value={dados.dataDevPat}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Status da Alocação
                            </label>
                            <select name="idStatusPatCad" disabled={isTransferido}
                                value={dados.idStatusPatCad}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="" disabled>
                                    Selecione o status
                                </option>
                                {statusPatrimonio.map((status) => (
                                    <option
                                        key={status.idStatusPat}
                                        value={status.idStatusPat}>
                                        {status.descricaoStatPat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!isTransferido && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Motivo da Devolução
                                </label>
                                <input
                                    type="text"
                                    name="motivoDevolucao"
                                    value={dados.motivoDevolucao}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: equipamento com defeito" />
                            </div>
                        )}

                        {isTransferido && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Observação da Transferência
                                </label>
                                <input type="text"
                                    name="observacaoTransferencia"
                                    value={dados.observacaoTransferencia}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: transferência para outro responsável/setor" />
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <Link href="/alocacoes">
                                <Button variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit"
                                disabled={salvando || isTransferido}
                                >
                                {salvando ? 'Salvando...' : 'Atualizar'}
                            </Button>
                        </div>
                    </form>

                    <aside className="bg-white rounded-lg shadow-lg p-6 space-y-4 h-fit">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Histórico de Transferência</h2>
                            <button
                                type="button"
                                onClick={() => setMostrarHistorico((prev) => !prev)}
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                                aria-label={mostrarHistorico ? 'Ocultar histórico' : 'Visualizar histórico'}
                            >
                                {mostrarHistorico ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span>{mostrarHistorico ? 'Ocultar' : 'Visualizar'}</span>
                            </button>
                        </div>
                        {mostrarHistorico && (
                            (cadastro.tbTransferenciaAlocacao?.length || 0) === 0 ? (
                                <p className="text-xs text-gray-500">
                                    Sem transferências registradas.
                                </p>
                            ) : (
                                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                                    {cadastro.tbTransferenciaAlocacao?.map((item) => (
                                        <div key={item.idTransferenciaAlocacao}
                                            className="rounded border p-3">
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.dataTransferencia).toLocaleString('pt-BR')}
                                            </p>
                                            <p className="text-xs mt-1">
                                                {item.statusAnterior || 'SEM STATUS'} ? {item.statusNovo}
                                            </p>
                                            <p className="text-xs mt-1">
                                                Funcionário origem: {item.tbFuncionario ? `${item.tbFuncionario.idMatFun} - ${item.tbFuncionario.nomeFun}` : '-'}
                                            </p>
                                            <p className="text-xs mt-1">
                                                Funcionário destino: {funcionarioDestinoAtual ? `${funcionarioDestinoAtual.idMatFun} - ${funcionarioDestinoAtual.nomeFun}` : (item.tbFuncionarioDestino ? `${item.tbFuncionarioDestino.idMatFun} - ${item.tbFuncionarioDestino.nomeFun}` : '-')}
                                            </p>
                                            <p className="text-xs mt-1">
                                                Responsável: {item.tbUser?.nomeUser || item.tbUser?.emailUser || '-'}
                                            </p>
                                            <p className="text-xs mt-1 text-gray-600">
                                                Obs: {item.observacao || '-'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </aside>
                </div>
            </div>

            {modalTransferenciaAberto && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Transferir Alocação</h3>
                        <p className="text-sm text-gray-600">Selecione o funcionário de destino. Ao confirmar, a alocação atual será marcada como transferida e uma nova alocação será criada automaticamente.</p>
                        <div>
                            <label className="block text-sm font-medium mb-2">Pesquisar funcionário</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={buscaFuncionario}
                                    onChange={(e) => setBuscaFuncionario(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Digite matrícula ou nome"
                                />
                                <Button type="button" variant="outline" onClick={handlePesquisarFuncionario}>
                                    Pesquisar
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Funcionário destino</label>
                            <select value={funcionarioDestino} onChange={(e) => setFuncionarioDestino(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Selecione o funcionário</option>
                                {(funcionariosFiltrados.length > 0 ? funcionariosFiltrados : filtrarFuncionarios(buscaFuncionario))
                                    .map((f) => (
                                        <option key={f.idMatFun} value={f.idMatFun}>{f.idMatFun} - {f.nomeFun}</option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Data da transferência</label>
                            <input
                                type="date"
                                value={dataTransferencia}
                                onChange={(e) => setDataTransferencia(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setModalTransferenciaAberto(false);
                                    setBuscaFuncionario('');
                                    setFuncionariosFiltrados([]);
                                    setDataTransferencia('');
                                }}
                                disabled={salvando}
                            >
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleConfirmarTransferencia} disabled={salvando}>{salvando ? 'Transferindo...' : 'Confirmar Transferência'}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
