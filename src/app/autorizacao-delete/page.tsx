'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import Header from '@/back-end/components/Header/Header';

export default function AutorizacaoDeletePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resource = searchParams.get('resource') || '';
    const id = searchParams.get('id') || '';
    const returnTo = searchParams.get('returnTo') || '/';

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const titulo = useMemo(() => {
        return 'Autorização de Exclusão';
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErro('');
        setLoading(true);
        try {
            const res = await fetch('/api/delete-authorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resource, id: id || undefined, email, senha })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setErro(data.message || 'Falha na autorização');
                return;
            }
            router.replace(returnTo);
            router.refresh();
        } catch (error) {
            console.error(error);
            setErro('Erro ao processar autorização');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
        <Header />
            <div className="max-w-md mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <h1 className="text-xl font-bold">{titulo}</h1>
                    <p className="text-sm text-gray-600">
                        Informe um usuário autorizado para concluir a exclusão.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email do autorizador"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Senha do autorizador"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        {erro && <p className="text-sm text-red-600">{erro}</p>}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => router.replace(returnTo)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Autorizando...' : 'Autorizar e Excluir'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

