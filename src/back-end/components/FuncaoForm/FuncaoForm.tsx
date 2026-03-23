'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useFormDraft } from '@/back-end/hooks/useFormDraft';

export default function FuncaoForm({ funcaoId }: { funcaoId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const initialFuncao = useMemo(() => ({ nomeFuncao: '' }), []);
    const {
        state: funcao,
        setState: setFuncao,
        clearDraft: clearFuncaoDraft
    } = useFormDraft('funcao-form-create', initialFuncao, { enabled: !funcaoId });

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
    }, [funcaoId, setFuncao]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
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
                const mensagemSucesso = funcaoId
                    ? 'Funcao atualizada com sucesso'
                    : 'Funcao criada com sucesso';
                window.systemAlert?.('sucesso', mensagemSucesso);
                if (!funcaoId) clearFuncaoDraft();
                router.push('/funcoes');
            } else {
                const err = await res.json();
                window.systemAlert?.('erro', err.message || 'Erro');
            }
        } catch (error) {
            console.error(error);
            window.systemAlert?.('erro', 'Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/funcoes" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">{funcaoId ? 'Editar Funcao' : 'Cadastrar Funcao'}</h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Nome da Funcao *</label>
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
