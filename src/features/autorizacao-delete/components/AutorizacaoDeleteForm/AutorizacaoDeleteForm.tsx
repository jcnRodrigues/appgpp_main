'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormActions from '@/components/FormActions/FormActions';

export default function AutorizacaoDeleteForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resource = searchParams.get('resource') || '';
    const id = searchParams.get('id') || '';
    const returnTo = searchParams.get('returnTo') || '/';

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const titulo = useMemo(() => 'Autorização de Exclusão', []);
    const recursoLabel = resource ? resource.replace(/_/g, ' ') : 'Recurso não informado';

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
            <div className="max-w-md mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-5">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold">{titulo}</h1>
                        <p className="text-sm text-gray-600">
                            Informe um usuário autorizado para concluir a exclusão.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-700 space-y-1">
                        <p>
                            <span className="font-medium">Recurso:</span> {recursoLabel}
                        </p>
                        {id && (
                            <p>
                                <span className="font-medium">Registro:</span> {id}
                            </p>
                        )}
                    </div>

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

                        <FormActions
                            cancelLabel="Cancelar"
                            submitLabel="Autorizar e excluir"
                            loadingLabel="Autorizando..."
                            loading={loading}
                            className="flex justify-end gap-2 pt-2"
                            onCancel={() => router.replace(returnTo)}
                            cancelClassName="border-slate-300 bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-white shadow-sm"
                            submitClassName="bg-rose-600 text-white hover:bg-rose-500 shadow-sm"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
