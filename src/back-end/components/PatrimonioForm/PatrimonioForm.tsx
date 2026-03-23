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

export default function PatrimonioForm({ patrimonioId }: { patrimonioId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [tipos, setTipos] = useState<TipoPatrimonio[]>([]);
    const [status, setStatus] = useState<StatusPatrimonio[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
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
        idPat_CustoPat: ''
    }), []);
    const {
        state: patrimonio,
        setState: setPatrimonio,
        clearDraft: clearPatrimonioDraft
    } = useFormDraft('patrimonio-form-create', initialPatrimonio, { enabled: !patrimonioId });


    // Carregar dados iniciais
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

            // Se está editando, carregar dados do patrimônio
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
                            idPat_CustoPat: data.idPat_CustoPat || ''
                        });
                    }
                } catch (error) {
                    console.error('Erro ao carregar patrimônio:', error);
                }
            }
        };

        carregarDados();
    }, [patrimonioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Campos que devem ser convertidos para uppercase
        const fieldsToUppercase = ['idPat', 'descricaoPat', 'descricaoDetalhadaPat', 'licencaPat', 'notaFiscalPat'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

        setPatrimonio(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validações adicionais
        if (!patrimonio.idPat_TipoPat) {
            window.systemAlert?.("aviso", 'Por favor, selecione o tipo de patrimônio');
            setLoading(false);
            return;
        }

        if (!patrimonio.idPat_StatusPat) {
            window.systemAlert?.("aviso", 'Por favor, selecione o status do patrimônio');
            setLoading(false);
            return;
        }

        try {
            const dados = {
                ...patrimonio,
                valorPat: parseFloat(patrimonio.valorPat) || 0,
                dataEntPat: new Date(patrimonio.dataEntPat),
                dataSaiPat: patrimonio.dataSaiPat ? new Date(patrimonio.dataSaiPat) : null
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
                window.systemAlert?.("sucesso", mensagemSucesso);
                if (!patrimonioId) clearPatrimonioDraft();
                router.push('/patrimoniolist');
            } else {
                const error = await response.json();
                window.systemAlert?.("erro", 'Erro ao salvar patrimônio: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            window.systemAlert?.("erro", 'Erro ao salvar patrimônio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/patrimoniolist" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">
                        {patrimonioId ? 'Editar Patrimônio' : 'Cadastrar Novo Patrimônio'}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-8 space-y-6">

                    {/* Informações Básicas */}
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Informações Básicas</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">ID Patrimônio *</label>
                                <input
                                    type="text"
                                    name="idPat"
                                    value={patrimonio.idPat}
                                    onChange={handleChange}
                                    disabled={!!patrimonioId}
                                    placeholder="Ex: PAT001"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-red-600">
                                    Tipo de Patrimônio * (Obrigatório)
                                </label>
                                <select
                                    name="idPat_TipoPat"
                                    value={patrimonio.idPat_TipoPat}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!patrimonio.idPat_TipoPat ? 'border-red-300 bg-red-50' : ''
                                        }`}
                                    required
                                >
                                    <option value="">--- Selecione um tipo ---</option>
                                    {tipos.map(tipo => (
                                        <option key={tipo.idTipPat} value={tipo.idTipPat}>
                                            {tipo.descricaoTipPat || 'Sem descrição'}
                                        </option>
                                    ))}
                                </select>
                                {!patrimonio.idPat_TipoPat && (
                                    <p className="text-red-600 text-xs mt-1">Campo obrigatório</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Descrição *</label>
                            <input
                                type="text"
                                name="descricaoPat"
                                value={patrimonio.descricaoPat}
                                onChange={handleChange}
                                placeholder="Ex: Computador Dell"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Descrição Detalhada</label>
                            <textarea
                                name="descricaoDetalhadaPat"
                                value={patrimonio.descricaoDetalhadaPat}
                                onChange={handleChange}
                                placeholder="Detalhe as características do patrimônio"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                            />
                        </div>
                    </div>

                    {/* Informações de Entrada e Saída */}
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Datas e Documentação</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Entrada *</label>
                                <input
                                    type="date"
                                    name="dataEntPat"
                                    value={patrimonio.dataEntPat}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Saída</label>
                                <input
                                    type="date"
                                    name="dataSaiPat"
                                    value={patrimonio.dataSaiPat}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nota Fiscal</label>
                                <input
                                    type="text"
                                    name="notaFiscalPat"
                                    value={patrimonio.notaFiscalPat}
                                    onChange={handleChange}
                                    placeholder="Ex: NF 123456"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Licença/Série</label>
                                <input
                                    type="text"
                                    name="licencaPat"
                                    value={patrimonio.licencaPat}
                                    onChange={handleChange}
                                    placeholder="Ex: ABC123XYZ"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informações Financeiras e Status */}
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Dados Financeiros e Gestão</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
                                <input
                                    type="number"
                                    name="valorPat"
                                    value={patrimonio.valorPat}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-red-600">
                                    Status * (Obrigatório)
                                </label>
                                <select
                                    name="idPat_StatusPat"
                                    value={patrimonio.idPat_StatusPat}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!patrimonio.idPat_StatusPat ? 'border-red-300 bg-red-50' : ''
                                        }`}
                                    required
                                >
                                    <option value="">--- Selecione um status ---</option>
                                    {status.map(s => (
                                        <option key={s.idStatusPat} value={s.idStatusPat}>
                                            {s.descricaoStatPat}
                                        </option>
                                    ))}
                                </select>
                                {!patrimonio.idPat_StatusPat && (
                                    <p className="text-red-600 text-xs mt-1">Campo obrigatório</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Centro de Custo</label>
                            <select
                                name="idPat_CustoPat"
                                value={patrimonio.idPat_CustoPat}
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

                    {/* Botões */}
                    <div className="flex gap-4 justify-end pt-6">
                        <Link href="/patrimoniolist">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {loading ? 'Salvando...' : patrimonioId ? 'Atualizar' : 'Criar Patrimônio'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}









