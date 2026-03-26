'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';
import { Button } from '@/back-end/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useFormDraft } from '@/back-end/hooks/useFormDraft';

interface Funcao {
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

export default function FuncionarioForm({ funcionarioId }: { funcionarioId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [funcoes, setFuncoes] = useState<Funcao[]>([]);
    const [status, setStatus] = useState<StatusFuncionario[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [licencasDisponiveis, setLicencasDisponiveis] = useState<LicencaDisponivel[]>([]);

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
                }
            } catch (error) {
                console.error('Erro ao carregar opcoes:', error);
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
                    console.error('Erro ao carregar funcionario:', error);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            for (const vinculo of funcionario.licencasVinculos) {
                if (!vinculo.dataInicio || !vinculo.dataVencimetno) {
                    window.systemAlert?.('erro', 'Preencha as datas de inicio e vencimento das licencas selecionadas');
                    setLoading(false);
                    return;
                }

                if (vinculo.dataVencimetno < vinculo.dataInicio) {
                    window.systemAlert?.('erro', 'A data de vencimento da licenca nao pode ser menor que a data de inicio');
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
                    ? 'Funcionario atualizado com sucesso'
                    : 'Funcionario criado com sucesso';
                window.systemAlert?.('sucesso', mensagemSucesso);
                if (!funcionarioId) clearFuncionarioDraft();
                router.push('/funcionariosadd');
            } else {
                const error = await response.json();
                window.systemAlert?.('erro', 'Erro ao salvar funcionario: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            window.systemAlert?.('erro', 'Erro ao salvar funcionario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/funcionariosadd" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">
                        {funcionarioId ? 'Editar Funcionario' : 'Cadastrar Novo Funcionario'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Informacoes Pessoais</h2>

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
                                <label className="block text-sm font-medium mb-2">Data de Admissao</label>
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
                                <label className="block text-sm font-medium mb-2">Funcao</label>
                                <select
                                    name="idFuncaoFun"
                                    value={funcionario.idFuncaoFun}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Selecione uma funcao</option>
                                    {funcoes.map(funcao => (
                                        <option key={funcao.idFuncao} value={funcao.idFuncao}>
                                            {funcao.nomeFuncao}
                                        </option>
                                    ))}
                                </select>
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
                                        {centro.descricaoCCusto || 'Sem descricao'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Licencas Vinculadas</h2>
                        {licencasDisponiveis.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhuma licenca disponivel para vinculacao.</p>
                        ) : (
                            <div className="space-y-4 max-h-80 overflow-auto border rounded-lg p-4">
                                {licencasDisponiveis.map((licenca) => {
                                    const selecionada = isLicencaSelecionada(licenca.idLic);
                                    const vinculo = getVinculoLicenca(licenca.idLic);

                                    return (
                                        <div key={licenca.idLic} className="border-b pb-3 last:border-b-0">
                                            <label className="flex items-center gap-2 text-sm font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={selecionada}
                                                    onChange={() => handleToggleLicenca(licenca.idLic)}
                                                />
                                                <span>{licenca.descricaoLic}</span>
                                            </label>

                                            {selecionada && vinculo && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 ml-6">
                                                    <div>
                                                        <label className="block text-xs font-medium mb-1">Data Inicio</label>
                                                        <input
                                                            type="date"
                                                            value={vinculo.dataInicio}
                                                            onChange={(e) => handleChangeDataLicenca(licenca.idLic, 'dataInicio', e.target.value)}
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
                                                            onChange={(e) => handleChangeDataLicenca(licenca.idLic, 'dataVencimetno', e.target.value)}
                                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 justify-end pt-6">
                        <Link href="/funcionariosadd">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {loading ? 'Salvando...' : funcionarioId ? 'Atualizar' : 'Criar Funcionario'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
