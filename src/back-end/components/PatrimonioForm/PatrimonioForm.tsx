'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';
import { Button } from '@/back-end/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useFormDraft } from '@/back-end/hooks/useFormDraft';

interface TipoPatrimonio {
    idTipPat: string;
    descricaoTipPat?: string;
}

interface StatusPatrimonio {
    idStatusPat: string;
    descricaoStatPat: string;
}

interface CentroCusto {
    idCCusto: string;
    descricaoCCusto?: string;
}

interface TransferenciaCusto {
    idTransferencia: string;
    idCustoOrigem?: string | null;
    idCustoDestino: string;
    valorTransferido?: number | null;
    observacao?: string | null;
    dataTransferencia: string;
    custoOrigem?: { descricaoCCusto?: string | null } | null;
    custoDestino?: { descricaoCCusto?: string | null } | null;
    tbUser?: { nomeUser?: string | null; emailUser?: string | null } | null;
}

export default function PatrimonioForm({ patrimonioId }: { patrimonioId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [transferindo, setTransferindo] = useState(false);
    const [mostrarTransferencia, setMostrarTransferencia] = useState(false);
    const [tipos, setTipos] = useState<TipoPatrimonio[]>([]);
    const [status, setStatus] = useState<StatusPatrimonio[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [historicoTransferencias, setHistoricoTransferencias] = useState<TransferenciaCusto[]>([]);
    const [novoCentroCusto, setNovoCentroCusto] = useState('');
    const [observacaoTransferencia, setObservacaoTransferencia] = useState('');
    const [dataTransferencia, setDataTransferencia] = useState(new Date().toISOString().split('T')[0]);
    const initialPatrimonio = useMemo(() => ({
        idPat: '',
        descricaoPat: '',
        descricaoDetalhadaPat: '',
        licencaPat: '',
        dataEntPat: new Date().toISOString().split('T')[0],
        dataSaiPat: '',
        notaFiscalPat: '',
        valorPat: '',
        idPat_TipoPat: '',
        idPat_StatusPat: '',
        idPat_CustoPat: '',
        dataDevPat: '',
        motivoDevolucao: '',
        notaFiscalDevolucao: '',
        dataChegadaFornecedor: ''
    }), []);
    const {
        state: patrimonio,
        setState: setPatrimonio,
        clearDraft: clearPatrimonioDraft
    } = useFormDraft('patrimonio-form-create', initialPatrimonio, { enabled: !patrimonioId });

    const carregarHistoricoTransferencias = async (id: string) => {
        try {
            const response = await fetch(`/api/patrimonio/${id}/transferencias`);
            if (response.ok) {
                const data = await response.json();
                setHistoricoTransferencias(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico de transferências:', error);
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const responseData = await fetch('/api/patrimonio/opcoes');
                if (responseData.ok) {
                    const data = await responseData.json();
                    setTipos(data.tipos || []);
                    setStatus(data.status || []);
                    setCentros(data.centros || []);
                }
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }

            if (patrimonioId) {
                try {
                    const patrimonioData = await fetch(`/api/patrimonio/${patrimonioId}`);
                    if (patrimonioData.ok) {
                        const data = await patrimonioData.json();
                        setPatrimonio({
                            idPat: data.idPat || '',
                            descricaoPat: data.descricaoPat || '',
                            descricaoDetalhadaPat: data.descricaoDetalhadaPat || '',
                            licencaPat: data.licencaPat || '',
                            dataEntPat: data.dataEntPat ? new Date(data.dataEntPat).toISOString().split('T')[0] : '',
                            dataSaiPat: data.dataSaiPat ? new Date(data.dataSaiPat).toISOString().split('T')[0] : '',
                            notaFiscalPat: data.notaFiscalPat || '',
                            valorPat: data.valorPat?.toString() || '',
                            idPat_TipoPat: data.idPat_TipoPat || '',
                            idPat_StatusPat: data.idPat_StatusPat || '',
                            idPat_CustoPat: data.idPat_CustoPat || '',
                            dataDevPat: data.tbDevolucao?.[0]?.dataInicioDevolucao ? new Date(data.tbDevolucao[0].dataInicioDevolucao).toISOString().split('T')[0] : '',
                            motivoDevolucao: data.tbDevolucao?.[0]?.motivoDevolucao || '',
                            notaFiscalDevolucao: data.tbDevolucao?.[0]?.notaFiscalDevolucao || '',
                            dataChegadaFornecedor: data.tbDevolucao?.[0]?.dataFimDevolucao ? new Date(data.tbDevolucao[0].dataFimDevolucao).toISOString().split('T')[0] : ''
                        });
                        await carregarHistoricoTransferencias(patrimonioId);
                    }
                } catch (error) {
                    console.error('Erro ao carregar patrimônio:', error);
                }
            }
        };

        carregarDados();
    }, [patrimonioId, setPatrimonio]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['idPat', 'descricaoPat', 'descricaoDetalhadaPat', 'licencaPat', 'notaFiscalPat'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

        setPatrimonio(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleTransferenciaCentroCusto = async () => {
        if (!patrimonioId) return;

        if (!novoCentroCusto) {
            window.systemAlert?.('aviso', 'Selecione o centro de custo de destino');
            return;
        }

        if (novoCentroCusto === patrimonio.idPat_CustoPat) {
            window.systemAlert?.('aviso', 'O centro de custo de destino é igual ao atual');
            return;
        }

        try {
            setTransferindo(true);
            const response = await fetch(`/api/patrimonio/${patrimonioId}/transferencias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idCustoDestino: novoCentroCusto,
                    observacao: observacaoTransferencia,
                    dataTransferencia
                })
            });

            if (!response.ok) {
                const erro = await response.json();
                window.systemAlert?.('erro', erro.message || 'Erro ao transferir centro de custo');
                return;
            }

            const atualizado = await response.json();
            setPatrimonio(prev => ({
                ...prev,
                idPat_CustoPat: atualizado.idPat_CustoPat || ''
            }));
            await carregarHistoricoTransferencias(patrimonioId);
            setNovoCentroCusto('');
            setObservacaoTransferencia('');
            setDataTransferencia(new Date().toISOString().split('T')[0]);
            setMostrarTransferencia(false);
            window.systemAlert?.('sucesso', 'Transferência de centro de custo realizada');
        } catch (error) {
            console.error('Erro ao transferir centro de custo:', error);
            window.systemAlert?.('erro', 'Erro ao transferir centro de custo');
        } finally {
            setTransferindo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!patrimonio.idPat_TipoPat) {
            window.systemAlert?.('aviso', 'Por favor, selecione o tipo de patrimônio');
            setLoading(false);
            return;
        }

        if (!patrimonio.idPat_StatusPat) {
            window.systemAlert?.('aviso', 'Por favor, selecione o status do patrimônio');
            setLoading(false);
            return;
        }

        const statusSelecionado = status.find((s) => s.idStatusPat === patrimonio.idPat_StatusPat);
        const isDevolucao = (statusSelecionado?.descricaoStatPat || '').toUpperCase().includes('DEVOLU');

        if (isDevolucao && !patrimonio.dataDevPat) {
            window.systemAlert?.('aviso', 'Informe a data de devolução');
            setLoading(false);
            return;
        }

        try {
            const dados = {
                ...patrimonio,
                valorPat: parseFloat(patrimonio.valorPat) || 0,
                dataEntPat: patrimonio.dataEntPat,
                dataSaiPat: patrimonio.dataSaiPat || null,
                dataDevPat: patrimonio.dataDevPat || null,
                dataChegadaFornecedor: patrimonio.dataChegadaFornecedor || null
            };

            let response;
            if (patrimonioId) {
                response = await fetch(`/api/patrimonio/${patrimonioId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            } else {
                response = await fetch('/api/patrimonio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            }

            if (response.ok) {
                const mensagemSucesso = patrimonioId
                    ? 'Patrimônio atualizado com sucesso'
                    : 'Patrimônio criado com sucesso';
                window.systemAlert?.('sucesso', mensagemSucesso);
                if (!patrimonioId) clearPatrimonioDraft();
                router.push('/patrimoniolist');
            } else {
                const error = await response.json();
                window.systemAlert?.('erro', `Erro ao salvar patrimônio: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            window.systemAlert?.('erro', 'Erro ao salvar patrimônio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/patrimoniolist" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">
                        {patrimonioId ? 'Editar Patrimônio' : 'Cadastrar Novo Patrimônio'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-5 sm:p-8 space-y-6">
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Informações Básicas</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">ID Patrimônio *</label>
                                <input type="text" name="idPat" value={patrimonio.idPat} onChange={handleChange} disabled={!!patrimonioId} placeholder="Ex: PAT001" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-red-600">Tipo de Patrimônio * (Obrigatório)</label>
                                <select name="idPat_TipoPat" value={patrimonio.idPat_TipoPat} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!patrimonio.idPat_TipoPat ? 'border-red-300 bg-red-50' : ''}`} required>
                                    <option value="">--- Selecione um tipo ---</option>
                                    {tipos.map(tipo => (
                                        <option key={tipo.idTipPat} value={tipo.idTipPat}>{tipo.descricaoTipPat || 'Sem descrição'}</option>
                                    ))}
                                </select>
                                {!patrimonio.idPat_TipoPat && <p className="text-red-600 text-xs mt-1">Campo obrigatório</p>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Descrição *</label>
                            <input type="text" name="descricaoPat" value={patrimonio.descricaoPat} onChange={handleChange} placeholder="Ex: Computador Dell" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Descrição Detalhada</label>
                            <textarea name="descricaoDetalhadaPat" value={patrimonio.descricaoDetalhadaPat} onChange={handleChange} placeholder="Detalhe as características do patrimônio" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none" />
                        </div>

                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Datas e Documentação</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Entrada *</label>
                                <input type="date" name="dataEntPat" value={patrimonio.dataEntPat} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Saída</label>
                                <input type="date" name="dataSaiPat" value={patrimonio.dataSaiPat} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Nota Fiscal</label>
                                <input type="text" name="notaFiscalPat" value={patrimonio.notaFiscalPat} onChange={handleChange} placeholder="Ex: NF 123456" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Licença/Série</label>
                                <input type="text" name="licencaPat" value={patrimonio.licencaPat} onChange={handleChange} placeholder="Ex: ABC123XYZ" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                        {((status.find((s) => s.idStatusPat === patrimonio.idPat_StatusPat)?.descricaoStatPat || '').toUpperCase().includes('DEVOLU')) && (
                            <div className="mt-2 border border-amber-200 rounded-lg p-4  space-y-4">
                                <h2 className="text-sm font-semibold text-amber-800">Dados da devolução</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Data da devolução *</label>
                                        <input type="date" name="dataDevPat" value={patrimonio.dataDevPat} onChange={handleChange} className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">NF da devolução</label>
                                        <input type="text" name="notaFiscalDevolucao" value={patrimonio.notaFiscalDevolucao} onChange={handleChange} placeholder="Ex: NF-DEV-123" className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Data chegada no fornecedor</label>
                                        <input type="date" name="dataChegadaFornecedor" value={patrimonio.dataChegadaFornecedor} onChange={handleChange} className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Motivo da devolução</label>
                                    <textarea name="motivoDevolucao" value={patrimonio.motivoDevolucao} onChange={handleChange} placeholder="Informe o motivo" className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 h-20 resize-none" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Dados Financeiros e Gestão</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
                                <input type="number" name="valorPat" value={patrimonio.valorPat} onChange={handleChange} placeholder="0.00" step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-red-600">Status * (Obrigatório)</label>
                                <select name="idPat_StatusPat" value={patrimonio.idPat_StatusPat} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!patrimonio.idPat_StatusPat ? 'border-red-300 bg-red-50' : ''}`} required>
                                    <option value="">--- Selecione um status ---</option>
                                    {status.map(s => (
                                        <option key={s.idStatusPat} value={s.idStatusPat}>{s.descricaoStatPat}</option>
                                    ))}
                                </select>
                                {!patrimonio.idPat_StatusPat && <p className="text-red-600 text-xs mt-1">Campo obrigatório</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Centro de Custo</label>
                                <select name="idPat_CustoPat" value={patrimonio.idPat_CustoPat} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Selecione um centro de custo</option>
                                    {centros.map(centro => (
                                        <option key={centro.idCCusto} value={centro.idCCusto}>{centro.descricaoCCusto || 'Sem descrição'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            {patrimonioId && (
                                <div className="mt-4 space-y-3">
                                    <Button type="button" variant="outline" onClick={() => setMostrarTransferencia((prev) => !prev)}>
                                        {mostrarTransferencia ? 'Cancelar transferência' : 'Transferir custo para outro centro'}
                                    </Button>

                                    {mostrarTransferencia && (
                                        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Centro de custo de destino *</label>
                                                <select value={novoCentroCusto} onChange={(e) => setNovoCentroCusto(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                                    <option value="">Selecione o centro de destino</option>
                                                    {centros.filter((c) => c.idCCusto !== patrimonio.idPat_CustoPat).map((centro) => (
                                                        <option key={centro.idCCusto} value={centro.idCCusto}>{centro.descricaoCCusto || 'Sem descrição'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Data da transferência</label>
                                                <input type="date" value={dataTransferencia} onChange={(e) => setDataTransferencia(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Observação</label>
                                                <textarea value={observacaoTransferencia} onChange={(e) => setObservacaoTransferencia(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none" placeholder="Motivo da transferência (opcional)" />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="button" disabled={transferindo} onClick={handleTransferenciaCentroCusto}>
                                                    {transferindo ? 'Transferindo...' : 'Confirmar transferência'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border rounded-lg p-3">
                                        <p className="font-semibold mb-2">Histórico de Transferências</p>
                                        {historicoTransferencias.length === 0 ? (
                                            <p className="text-sm text-gray-500">Nenhuma transferência registrada.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {historicoTransferencias.map((item) => (
                                                    <div key={item.idTransferencia} className="text-sm border-b pb-2 last:border-b-0">
                                                        <p>{item.custoOrigem?.descricaoCCusto || 'Sem centro anterior'} {' -> '} {item.custoDestino?.descricaoCCusto || 'Sem centro destino'}</p>
                                                        <p className="text-gray-600">
                                                            {new Date(item.dataTransferencia).toLocaleString('pt-BR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                            {item.valorTransferido ? ` | Valor: R$ ${item.valorTransferido.toFixed(2)}` : ''}
                                                        </p>
                                                        {(item.tbUser?.nomeUser || item.tbUser?.emailUser) && (
                                                            <p className="text-gray-600">
                                                                Transferido por: {item.tbUser?.nomeUser || item.tbUser?.emailUser}
                                                            </p>
                                                        )}
                                                        {item.observacao && <p className="text-gray-600">{item.observacao}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end pt-6">
                        <Link href="/patrimoniolist"><Button variant="outline">Cancelar</Button></Link>
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                            {loading ? 'Salvando...' : patrimonioId ? 'Atualizar' : 'Criar Patrimônio'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
