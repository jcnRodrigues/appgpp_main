'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function FuncaoForm({ funcaoId }: { funcaoId?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [funcao, setFuncao] = useState({
        nomeFuncao: ''
    });

    useEffect(() => {
        if (funcaoId) {
            const carregar = async () => {
                try {
                    const r = await fetch(`/api/funcao/${funcaoId}`);
                    if (r.ok) {
                        const data = await r.json();
                        setFuncao({
                            nomeFuncao: data.nomeFuncao || ''
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            carregar();
        }
    }, [funcaoId]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        // Campo que deve ser convertido para uppercase
        const fieldsToUppercase = ['nomeFuncao'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;
        
        setFuncao(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                nomeFuncao: funcao.nomeFuncao
            };

            let res;
            if (funcaoId) {
                res = await fetch(`/api/funcao/${funcaoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/funcao', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                router.push('/funcoes');
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.message || 'Erro');
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
                    <Link href="/funcoes" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">{funcaoId ? 'Editar Função' : 'Cadastrar Função'}</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Nome da Função *</label>
                        <input
                            type="text"
                            name="nomeFuncao"
                            value={funcao.nomeFuncao}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Gerente, Desenvolvedor, Analista..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/funcoes">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : funcaoId ? 'Atualizar' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
