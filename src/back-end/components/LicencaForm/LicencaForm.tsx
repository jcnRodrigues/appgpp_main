'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/back-end/components/ui/button';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';
import { useFormDraft } from '@/back-end/hooks/useFormDraft';

export default function LicencaForm({ licencaId }: { licencaId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);

    const initialLicenca = useMemo(() => ({
        descricaoLic: ''
    }), []);

    const {
        state: licenca,
        setState: setLicenca,
        clearDraft: clearLicencaDraft
    } = useFormDraft('licenca-form-create', initialLicenca, { enabled: !licencaId });

    useEffect(() => {
        const carregarDados = async () => {
            if (licencaId) {
                try {
                    const responseLicenca = await fetch(`/api/licenca/${licencaId}`);
                    if (responseLicenca.ok) {
                        const data = await responseLicenca.json();
                        setLicenca({
                            descricaoLic: data.descricaoLic || ''
                        });
                    }
                } catch (error) {
                    console.error('Erro ao carregar licenca:', error);
                }
            }
        };

        carregarDados();
    }, [licencaId, setLicenca]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['descricaoLic'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

        setLicenca((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dados = {
                descricaoLic: licenca.descricaoLic
            };

            let response;
            if (licencaId) {
                response = await fetch(`/api/licenca/${licencaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            } else {
                response = await fetch('/api/licenca', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            }

            if (response.ok) {
                const mensagemSucesso = licencaId
                    ? 'Licenca atualizada com sucesso'
                    : 'Licenca criada com sucesso';
                window.systemAlert?.('sucesso', mensagemSucesso);
                if (!licencaId) clearLicencaDraft();
                router.push('/licencas');
            } else {
                const error = await response.json();
                window.systemAlert?.('erro', error.message || 'Erro ao salvar licenca');
            }
        } catch (error) {
            console.error('Erro ao salvar licenca:', error);
            window.systemAlert?.('erro', 'Erro ao salvar licenca');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <div className="form-title-sticky flex items-center mb-6">
                    <Link href="/licencas" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">{licencaId ? 'Editar Licenca' : 'Cadastrar Licenca'}</h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Descricao da Licenca *</label>
                        <input
                            type="text"
                            name="descricaoLic"
                            value={licenca.descricaoLic}
                            onChange={handleChange}
                            required
                            placeholder="Ex: MICROSOFT OFFICE 365"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-4 justify-end pt-6">
                        <Link href="/licencas">
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                            {loading ? 'Salvando...' : licencaId ? 'Atualizar Licenca' : 'Criar Licenca'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
