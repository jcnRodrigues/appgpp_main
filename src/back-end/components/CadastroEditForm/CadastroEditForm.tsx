'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface CadastroData {
    idCad: string;
    dataCadPat: string | null;
    dataDevPat: string | null;
    idPatCad?: string;
    tbFuncionario: {
        nomeFun: string;
    } | null;
    tbPatrimonio: {
        descricaoPat: string;
    } | null;
}

export default function CadastroEditForm({ cadastroId }: { cadastroId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [cadastro, setCadastro] = useState<CadastroData | null>(null);
    const [dados, setDados] = useState({
        dataCadPat: '',
        dataDevPat: '',
        
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                // Carregar dados do cadastro
                const resCadastro = await fetch(`/api/cadastro/${cadastroId}`);
                if (resCadastro.ok) {
                    const data = await resCadastro.json();
                    setCadastro(data);
                    setDados({
                        dataCadPat: data.dataCadPat ? new Date(data.dataCadPat).toISOString().split('T')[0] : '',
                        dataDevPat: data.dataDevPat ? new Date(data.dataDevPat).toISOString().split('T')[0] : '',
                        statusPatrimonio: data.tbPatrimonio?.idPat_StatusPat || ''
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

    const handleChange = (e: any) => {
        setDados(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSalvando(true);

        try {
                const payload = {
                    dataCadPat: dados.dataCadPat,
                    dataDevPat: dados.dataDevPat || null
                };

            const res = await fetch(`/api/cadastro/${cadastroId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/alocacoes');
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.message || 'Erro ao atualizar');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar');
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    if (!cadastro) {
        return <div className="text-center py-8">Alocação não encontrada</div>;
    }

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center mb-6">
                    <Link href="/alocacoes" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">Editar Alocação</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Funcionário</label>
                            <input
                                type="text"
                                disabled
                                value={cadastro.tbFuncionario?.nomeFun || '-'}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Patrimônio</label>
                            <input
                                type="text"
                                disabled
                                value={cadastro.tbPatrimonio?.descricaoPat || '-'}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Data de Alocação *</label>
                            <input
                                type="date"
                                name="dataCadPat"
                                value={dados.dataCadPat}
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
                                value={dados.dataDevPat}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Deixe em branco se ainda não foi devolvido"
                            />
                        </div>
                    </div>

                    

                    <div className="flex justify-end gap-4">
                        <Link href="/alocacoes">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Atualizar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
