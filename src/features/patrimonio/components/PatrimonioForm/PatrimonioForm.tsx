'use client'

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/hooks/useEnterToNext';

import FormActions from '@/components/FormActions/FormActions';
import PageHeader from '@/components/PageHeader/PageHeader';
import { PackagePlus, Pencil } from 'lucide-react';
import { useFormDraft } from '@/hooks/useFormDraft';
import { notify as showNotify } from '@/lib/notify';

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
    const [tipos, setTipos] = useState<TipoPatrimonio[]>([]);
    const [status, setStatus] = useState<StatusPatrimonio[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [historicoTransferencias, setHistoricoTransferencias] = useState<TransferenciaCusto[]>([]);
    const [limparDadosDevolucaoNoBanco, setLimparDadosDevolucaoNoBanco] = useState(false);
    const [statusInicialEhPendente, setStatusInicialEhPendente] = useState(false);
    const [devolucaoProcessoCodigo, setDevolucaoProcessoCodigo] = useState('');
    const [devolucaoProcessoId, setDevolucaoProcessoId] = useState('');
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
        dataSaidaFornecedor: '',
        dataChegadaFornecedor: ''
    }), []);
    const {
        state: patrimonio,
        setState: setPatrimonio,
        clearDraft: clearPatrimonioDraft
    } = useFormDraft('patrimonio-form-create', initialPatrimonio, { enabled: !patrimonioId });

    const normalizarTexto = (valor?: string | null) => {
        return (valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toUpperCase();
    };

    const isStatusDevolucaoById = (statusId?: string) => {
        const statusSelecionado = status.find((s) => s.idStatusPat === statusId);
        return normalizarTexto(statusSelecionado?.descricaoStatPat).includes('DEVOLU');
    };

    const isStatusPendenteById = (statusId?: string) => {
        const statusSelecionado = status.find((s) => s.idStatusPat === statusId);
        return normalizarTexto(statusSelecionado?.descricaoStatPat).includes('PENDENTE');
    };

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
                    setStatusInicialEhPendente(false);
                    const patrimonioData = await fetch(`/api/patrimonio/${patrimonioId}`);
                    if (patrimonioData.ok) {
                        const data = await patrimonioData.json();
                        const statusOriginal = data.tbStatusPat?.descricaoStatPat || data.statusPatrimonio?.descricaoStatPat || '';
                        const devolucaoProcesso = data.tbDevolucao?.[0]?.tbDevolucaoProcesso || null;
                        setStatusInicialEhPendente(normalizarTexto(statusOriginal).includes('PENDENTE'));
                        setDevolucaoProcessoCodigo(devolucaoProcesso?.codigoDevolucao || '');
                        setDevolucaoProcessoId(devolucaoProcesso?.idDevolucaoProcesso || '');
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
                            dataSaidaFornecedor: data.tbDevolucao?.[0]?.dataSaidaFornecedor ? new Date(data.tbDevolucao[0].dataSaidaFornecedor).toISOString().split('T')[0] : '',
                            dataChegadaFornecedor: data.tbDevolucao?.[0]?.dataChegadaFornecedor ? new Date(data.tbDevolucao[0].dataChegadaFornecedor).toISOString().split('T')[0] : (data.tbDevolucao?.[0]?.dataFimDevolucao ? new Date(data.tbDevolucao[0].dataFimDevolucao).toISOString().split('T')[0] : '')
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

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['idPat', 'descricaoPat', 'descricaoDetalhadaPat', 'licencaPat', 'notaFiscalPat'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

        if (name === 'idPat_StatusPat') {
            const statusAnteriorEhDevolucao = isStatusDevolucaoById(patrimonio.idPat_StatusPat);
            const statusNovoEhDevolucao = isStatusDevolucaoById(value);
            const temDadosDevolucao =
                Boolean(patrimonio.dataDevPat) ||
                Boolean(patrimonio.notaFiscalDevolucao) ||
                Boolean(patrimonio.dataSaidaFornecedor) ||
                Boolean(patrimonio.dataChegadaFornecedor) ||
                Boolean(patrimonio.motivoDevolucao);

            if (statusAnteriorEhDevolucao && !statusNovoEhDevolucao && temDadosDevolucao) {
                const apagarDadosDevolucao = window.systemConfirm
                    ? await window.systemConfirm(
                        'Você mudou o status para uma opção diferente de devolução. Deseja apagar os dados da devolução para evitar duplicidade no banco?',
                        'Limpar dados de devolução',
                        {
                            confirmText: 'Apagar dados',
                            cancelText: 'Manter dados'
                        }
                    )
                    : window.confirm('Deseja apagar os dados da devolução para evitar duplicidade no banco?');

                setPatrimonio((prev) => ({
                    ...prev,
                    [name]: value,
                    ...(apagarDadosDevolucao
                        ? {
                            dataDevPat: '',
                            motivoDevolucao: '',
                            notaFiscalDevolucao: '',
                            dataSaidaFornecedor: '',
                            dataChegadaFornecedor: ''
                        }
                        : {})
                }));
                if (apagarDadosDevolucao) {
                    setDevolucaoProcessoCodigo('');
                    setDevolucaoProcessoId('');
                }
                setLimparDadosDevolucaoNoBanco(apagarDadosDevolucao);
                return;
            }
        }

        if (name === 'idPat_StatusPat' && isStatusDevolucaoById(value)) {
            setLimparDadosDevolucaoNoBanco(false);
        }

        if (name === 'idPat_StatusPat' && !isStatusDevolucaoById(value)) {
            setDevolucaoProcessoCodigo('');
            setDevolucaoProcessoId('');
        }

        setPatrimonio(prev => ({
            ...prev,
            [name]: newValue
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!patrimonio.idPat_TipoPat) {
            showNotify('aviso', 'Por favor, selecione o tipo de patrimônio');
            setLoading(false);
            return;
        }

        if (!patrimonio.idPat_StatusPat) {
            showNotify('aviso', 'Por favor, selecione o status do patrimônio');
            setLoading(false);
            return;
        }

        if (patrimonio.dataSaiPat && patrimonio.dataEntPat && patrimonio.dataSaiPat < patrimonio.dataEntPat) {
            showNotify('aviso', 'A data de entrega no almoxarifado não pode ser menor que a data de entrada');
            setLoading(false);
            return;
        }

        const statusSelecionado = status.find((s) => s.idStatusPat === patrimonio.idPat_StatusPat);
        const isDevolucao = normalizarTexto(statusSelecionado?.descricaoStatPat).includes('DEVOLU');

        if (isDevolucao && !patrimonio.dataDevPat) {
            showNotify('aviso', 'Informe a data de devolução');
            setLoading(false);
            return;
        }

        if (isDevolucao && patrimonio.dataDevPat && patrimonio.dataEntPat && patrimonio.dataDevPat < patrimonio.dataEntPat) {
            showNotify('aviso', 'A data de devolução não pode ser menor que a data de entrada');
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
                notaFiscalDevolucao: patrimonio.notaFiscalDevolucao || null,
                dataSaidaFornecedor: patrimonio.dataSaidaFornecedor || null,
                dataChegadaFornecedor: patrimonio.dataChegadaFornecedor || null,
                limparDadosDevolucao: limparDadosDevolucaoNoBanco
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
                showNotify('sucesso', mensagemSucesso);
                if (!patrimonioId) clearPatrimonioDraft();
                setLimparDadosDevolucaoNoBanco(false);
                router.push('/patrimoniolist');
            } else {
                const error = await response.json();
                showNotify('erro', `Erro ao salvar patrimônio: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            showNotify('erro', 'Erro ao salvar patrimônio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <PageHeader
                    icon={patrimonioId ? Pencil : PackagePlus}
                    title={patrimonioId ? 'Editar Patrimônio' : 'Cadastrar Novo Patrimônio'}
                    description="Gerencie os dados básicos, status e centro de custo do patrimônio."
                    backHref="/patrimoniolist"
                    className="px-5 py-5"
                    iconClassName="from-slate-950 via-slate-800 to-emerald-700"
                />

                <form onSubmit={handleSubmit}
                    onKeyDown={handleEnterToNext}
                    className="form-surface space-y-6 p-4 sm:p-6 lg:p-8">
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Informações Básicas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">ID Patrimônio *</label>
                                <input
                                    type="text"
                                    name="idPat"
                                    value={patrimonio.idPat}
                                    onChange={handleChange}
                                    disabled={!!patrimonioId}
                                    placeholder="Ex: PAT001"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-red-600">
                                    Tipo de Patrimônio * (Obrigatório)
                                </label>
                                <select name="idPat_TipoPat"
                                    value={patrimonio.idPat_TipoPat}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary 
                                    ${!patrimonio.idPat_TipoPat ? 'border-red-300 bg-red-50' : ''}`}
                                    required>
                                    <option value="">--- Selecione um tipo ---</option>
                                    {tipos.map(tipo => (
                                        <option key={tipo.idTipPat}
                                            value={tipo.idTipPat}>{tipo.descricaoTipPat || 'Sem descrição'}
                                        </option>
                                    ))}
                                </select>
                                {!patrimonio.idPat_TipoPat && <p className="text-red-600 text-xs mt-1">
                                    Campo obrigatório
                                </p>}
                            </div>
                            <div className="relative flex items-center justify-end">
                                <Image
                                    src={`https://placehold.co/10x10?text=PAT${patrimonio.idPat || 'XX'}`}
                                    alt="Patrimonio Icon"
                                    title="Patrimônio"
                                    width={160}
                                    height={80}
                                    unoptimized
                                    className="w-40 h-20 object-cover rounded-3xl text-center bg-gray-200 hover:bg-gray-900"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Descrição *
                            </label>
                            <input type="text"
                                name="descricaoPat"
                                value={patrimonio.descricaoPat}
                                onChange={handleChange} placeholder="Ex: Computador Dell"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Descrição Detalhada
                            </label>
                            <textarea name="descricaoDetalhadaPat"
                                value={patrimonio.descricaoDetalhadaPat}
                                onChange={handleChange}
                                placeholder="Detalhe as características do patrimônio"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Licença/Série
                                </label>
                                <input type="text"
                                    name="licencaPat"
                                    value={patrimonio.licencaPat}
                                    onChange={handleChange}
                                    placeholder="Ex: ABC123XYZ"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Datas de Documentação e Movimentação</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Data de Entrada - NF *
                                </label>
                                <input type="date"
                                    name="dataEntPat"
                                    value={patrimonio.dataEntPat}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nota Fiscal
                                </label>
                                <input type="text"
                                    name="notaFiscalPat"
                                    value={patrimonio.notaFiscalPat}
                                    onChange={handleChange}
                                    placeholder="Ex: NF 123456"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Data de Entrega - Almoxarifado
                                </label>
                                <input type="date"
                                    name="dataSaiPat"
                                    value={patrimonio.dataSaiPat}
                                    onChange={handleChange} min={patrimonio.dataEntPat}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                        {((status.find((s) => s.idStatusPat === patrimonio.idPat_StatusPat)?.descricaoStatPat || '').toUpperCase().includes('DEVOLU')) && (
                            <div className="mt-2 border border-amber-200 rounded-lg p-4  space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-sm font-semibold text-amber-800">Dados da devolução</h2>
                                    {devolucaoProcessoCodigo ? (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                                                Processo: {devolucaoProcessoCodigo}
                                            </span>
                                            {devolucaoProcessoId ? (
                                                <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                                    ID: {devolucaoProcessoId}
                                                </span>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Data da Emissão - Nota Fiscal *
                                        </label>
                                        <input type="date"
                                            name="dataDevPat"
                                            value={patrimonio.dataDevPat}
                                            onChange={handleChange}
                                            min={patrimonio.dataEntPat}
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            NF da devolução
                                        </label>
                                        <input type="text"
                                            name="notaFiscalDevolucao"
                                            value={patrimonio.notaFiscalDevolucao}
                                            onChange={handleChange}
                                            placeholder="Ex: NF-DEV-123"
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Data Saida - fornecedor
                                        </label>
                                        <input type="date"
                                            name="dataSaidaFornecedor"
                                            value={patrimonio.dataSaidaFornecedor}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Data Chegada - fornecedor
                                        </label>
                                        <input type="date"
                                            name="dataChegadaFornecedor"
                                            value={patrimonio.dataChegadaFornecedor}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Motivo da devolução
                                    </label>
                                    <textarea name="motivoDevolucao"
                                        value={patrimonio.motivoDevolucao}
                                        onChange={handleChange}
                                        placeholder="Informe o motivo"
                                        className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 h-20 resize-none" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Dados Financeiros e Gestão</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Valor (R$) *
                                </label>
                                <input type="number"
                                    name="valorPat"
                                    value={patrimonio.valorPat}
                                    onChange={handleChange}
                                    placeholder="R$ - 0.00" step="0.01"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-red-600">
                                    Status * (Obrigatório)
                                </label>
                                <select name="idPat_StatusPat"
                                    value={patrimonio.idPat_StatusPat}
                                    onChange={handleChange}
                                    disabled={!!patrimonioId && !statusInicialEhPendente}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed ${!patrimonio.idPat_StatusPat ? 'border-red-300 bg-red-50' : ''}`} required>
                                    <option value="">
                                        --- Selecione um status ---
                                    </option>
                                    {status.map(s => (
                                        <option key={s.idStatusPat}
                                            value={s.idStatusPat}>
                                            {s.descricaoStatPat}
                                        </option>
                                    ))}
                                </select>
                                {patrimonioId && !isStatusPendenteById(patrimonio.idPat_StatusPat) && (
                                    <p className="text-xs text-amber-600 mb-2">
                                        A seleção de status só fica liberada quando o patrimônio está como PENDENTE.
                                    </p>
                                )}
                                {!patrimonio.idPat_StatusPat &&
                                    <p className="text-red-600 text-xs mt-1">
                                        Campo obrigatório
                                    </p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Centro de Custo
                                </label>
                                <select name="idPat_CustoPat"
                                    value={patrimonio.idPat_CustoPat}
                                    onChange={handleChange}
                                    disabled={!!patrimonioId}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed">
                                    <option value="">
                                        Selecione um centro de custo
                                    </option>
                                    {centros.map(centro => (
                                        <option
                                            key={centro.idCCusto}
                                            value={centro.idCCusto}>
                                            {centro.descricaoCCusto || 'Sem descrição'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            {patrimonioId && (
                                <div className="mt-4 space-y-3">
                                    <div className="border rounded-lg p-3">
                                        <p className="font-semibold mb-2">Histórico de Transferências</p>
                                        {historicoTransferencias.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">Nenhuma transferência registrada.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {historicoTransferencias.map((item) => (
                                                    <div key={item.idTransferencia} className="text-sm border-b pb-2 last:border-b-0">
                                                        <p>{item.custoOrigem?.descricaoCCusto || 'Sem centro anterior'} {' -> '} {item.custoDestino?.descricaoCCusto || 'Sem centro destino'}</p>
                                                        <p className="text-muted-foreground">
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
                                                            <p className="text-muted-foreground">
                                                                Transferido por: {item.tbUser?.nomeUser || item.tbUser?.emailUser}
                                                            </p>
                                                        )}
                                                        {item.observacao && <p className="text-muted-foreground">{item.observacao}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <FormActions
                        cancelHref="/patrimoniolist"
                        submitLabel={patrimonioId ? 'Atualizar' : 'Criar Patrimônio'}
                        loading={loading}
                    />
                </form>
            </div>
        </div>
    );
}
