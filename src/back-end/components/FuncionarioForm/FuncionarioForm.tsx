'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function FuncionarioForm({ funcionarioId }: { funcionarioId?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [funcoes, setFuncoes] = useState<Funcao[]>([]);
    const [status, setStatus] = useState<StatusFuncionario[]>([]);
    const [centros, setCentros] = useState<CentroCusto[]>([]);
    const [funcionario, setFuncionario] = useState({
        idMatFun: '',
        nomeFun: '',
        cpfFun: '',
        dataAdmFun: new Date().toISOString().split('T')[0],
        dataDesFun: '',
        avatarFun: '',
        idFuncaoFun: '',
        idStatusFun: '',
        idCustoFun: ''
    });

    // Carregar dados iniciais
    useEffect(() => {
        const carregarDados = async () => {
            try {
                const responseOpcoes = await fetch('/api/funcionario/opcoes');
                if (responseOpcoes.ok) {
                    const data = await responseOpcoes.json();
                    setFuncoes(data.funcoes || []);
                    setStatus(data.status || []);
                    setCentros(data.centros || []);
                }
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }

            // Se está editando, carregar dados do funcionário
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
                            idCustoFun: data.idCustoFun || ''
                        });
                    }
                } catch (error) {
                    console.error('Erro ao carregar funcionário:', error);
                }
            }
        };

        carregarDados();
    }, [funcionarioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFuncionario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dados = {
                idMatFun: funcionario.idMatFun,
                nomeFun: funcionario.nomeFun,
                cpfFun: funcionario.cpfFun || null,
                dataAdmFun: funcionario.dataAdmFun ? new Date(funcionario.dataAdmFun) : null,
                dataDesFun: funcionario.dataDesFun ? new Date(funcionario.dataDesFun) : null,
                avatarFun: funcionario.avatarFun || null,
                idFuncaoFun: funcionario.idFuncaoFun || null,
                idStatusFun: funcionario.idStatusFun || null,
                idCustoFun: funcionario.idCustoFun || null
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
                router.push('/funcionariosadd');
                router.refresh();
            } else {
                const error = await response.json();
                alert('Erro ao salvar funcionário: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar funcionário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Link href="/funcionariosadd" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">
                        {funcionarioId ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    
                    {/* Informações Pessoais */}
                    <div className="border-b pb-6">
                        <h2 className="text-h4 font-bold mb-4">Informações Pessoais</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Matrícula *</label>
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
                                    placeholder="Ex: João Rodrigues"
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

                    {/* Datas e Funções */}
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
                                <select
                                    name="idFuncaoFun"
                                    value={funcionario.idFuncaoFun}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Selecione uma função</option>
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
                                        {centro.descricaoCCusto || 'Sem descrição'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-4 justify-end pt-6">
                        <Link href="/funcionariosadd">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {loading ? 'Salvando...' : funcionarioId ? 'Atualizar' : 'Criar Funcionário'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
