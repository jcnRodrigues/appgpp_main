'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import FormActions from '@/components/FormActions/FormActions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useFormDraft } from '@/hooks/useFormDraft';

export default function CentroCustoForm({ centroId }: { centroId?: string }) {
    const router = useRouter();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const initialCentro = useMemo(() => ({
        codigoCCusto: '',
        descricaoCCusto: '',
        idEmp_Custo: '',
        idStatusCCusto: ''
    }), []);
    const {
        state: centro,
        setState: setCentro,
        clearDraft: clearCentroDraft
    } = useFormDraft('ccusto-form-create', initialCentro, { enabled: !centroId });

    useEffect(() => {
        const carregar = async () => {
            try {
                const r = await fetch('/api/ccusto/opcoes');
                if (r.ok) {
                    const data = await r.json();
                    setEmpresas(data.empresas || []);
                    setStatusOptions(data.status || []);
                }
            } catch (e) {
                console.error(e);
            }

            if (centroId) {
                try {
                    const r2 = await fetch(`/api/ccusto/${centroId}`);
                    if (r2.ok) {
                        const data = await r2.json();
                        setCentro({
                            codigoCCusto: data.codigoCCusto || '',
                            descricaoCCusto: data.descricaoCCusto || '',
                            idEmp_Custo: data.idEmp_Custo || '',
                            idStatusCCusto: data.idStatusCCusto || data.tbStatusCCusto?.idStatusCCusto || ''
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        };
        carregar();
    }, [centroId, setCentro]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const fieldsToUppercase = ['codigoCCusto', 'descricaoCCusto'];
        const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

        setCentro(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                codigoCCusto: centro.codigoCCusto || null,
                descricaoCCusto: centro.descricaoCCusto || null,
                idEmp_Custo: centro.idEmp_Custo || null,
                idStatusCCusto: centro.idStatusCCusto || null
            };

            let res;
            if (centroId) {
                res = await fetch(`/api/ccusto/${centroId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            } else {
                res = await fetch('/api/ccusto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            }

            if (res.ok) {
                const mensagemSucesso = centroId
                    ? 'Centro de custo atualizado com sucesso'
                    : 'Centro de custo criado com sucesso';
                window.systemAlert?.('sucesso', mensagemSucesso);
                if (!centroId) clearCentroDraft();
                router.push('/ccustos');
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
                    <Link href="/ccustos" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h2 font-bold">
                        {centroId ? 'Editar Centro de Custo' : 'Cadastrar Centro de Custo'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit}
                    onKeyDown={handleEnterToNext}
                    className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Codigo
                        </label>
                        <input name="codigoCCusto"
                            value={centro.codigoCCusto}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Descricao *
                        </label>
                        <input name="descricaoCCusto"
                            value={centro.descricaoCCusto}
                            onChange={handleChange} required
                            className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Empresa
                        </label>
                        <select name="idEmp_Custo"
                            value={centro.idEmp_Custo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg">
                            <option value="">Selecione</option>
                            {empresas.map(emp => (
                                <option key={emp.idEmp}
                                    value={emp.idEmp}>
                                    {emp.fantasiaEmpresa || emp.razaoEmpresa || emp.idEmp}
                                </option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Status do Centro de Custo *
                        </label>
                        <select
                            name="idStatusCCusto"
                            value={centro.idStatusCCusto}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Selecione</option>
                            {statusOptions.map((status) => (
                                <option key={status.idStatusCCusto} value={status.idStatusCCusto}>
                                    {status.descricaoStatusCCusto}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormActions
                        cancelHref="/ccustos"
                        submitLabel={centroId ? 'Atualizar' : 'Criar'}
                        loading={loading}
                    />
                </form>
            </div>
        </div>
    );
}
