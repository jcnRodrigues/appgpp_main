'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Funcionario {
    idMatFun: string;
    nomeFun: string;
}

interface Patrimonio {
    idPat: string;
    descricaoPat: string;
}

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
    const [cadastro, setCadastro] = useState({
        idMatFunCad: funcionarioId || '',
        idPatCad: patrimonioId || '',
        dataCadPat: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const res = await fetch('/api/cadastro?opcoes=true');
                if (res.ok) {
                    const data = await res.json();
                    setFuncionarios(data.funcionarios || []);
                    setPatrimonios(data.patrimonios || []);
                }
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }
        };

        carregarOpcoes();
    }, []);

    const handleChange = (e: any) => {
        setCadastro(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                idMatFunCad: cadastro.idMatFunCad,
                idPatCad: cadastro.idPatCad,
                dataCadPat: cadastro.dataCadPat
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
                        <select
                            name="idMatFunCad"
                            value={cadastro.idMatFunCad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Selecione um funcionário</option>
                            {funcionarios.map(func => (
                                <option key={func.idMatFun} value={func.idMatFun}>
                                    {func.nomeFun} ({func.idMatFun})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Patrimônio *</label>
                        <select
                            name="idPatCad"
                            value={cadastro.idPatCad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Selecione um patrimônio</option>
                            {patrimonios.map(pat => (
                                <option key={pat.idPat} value={pat.idPat}>
                                   {pat.idPat} - {pat.descricaoPat}
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

                    <div className="flex justify-end gap-4">
                        <Link href="/alocacoes">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Vincular'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
