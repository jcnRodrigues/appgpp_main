'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormActions from '@/components/FormActions/FormActions';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { useFormDraft } from '@/hooks/useFormDraft';
import { notify as showNotify } from '@/lib/notify';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Pencil, Plus } from 'lucide-react';

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
                showNotify('sucesso', mensagemSucesso);
                if (!licencaId) clearLicencaDraft();
                router.push('/licencas');
            } else {
                const error = await response.json();
                showNotify('erro', error.message || 'Erro ao salvar licença');
            }
        } catch (error) {
            console.error('Erro ao salvar licenca:', error);
            showNotify('erro', 'Erro ao salvar licença');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-2xl mx-auto px-4">
                <PageHeader
                    icon={licencaId ? Pencil : Plus}
                    title={licencaId ? 'Editar Licença' : 'Cadastrar Nova Licença'}
                    description="Gerencie os dados cadastrais da licença."
                    backHref="/licencas"
                    iconClassName="from-slate-950 via-slate-800 to-emerald-700"
                />

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={handleEnterToNext}
                    className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Descricao da Licenca *
                        </label>
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

                    <FormActions
                        cancelHref="/licencas"
                        submitLabel={licencaId ? 'Atualizar Licenca' : 'Criar Licenca'}
                        loading={loading}
                    />
                </form>
            </div>
        </div>
    );
}

