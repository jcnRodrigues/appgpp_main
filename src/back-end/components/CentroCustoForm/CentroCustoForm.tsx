'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CentroCustoForm({ centroId }: { centroId?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [centro, setCentro] = useState({
        codigoCCusto: '',
        descricaoCCusto: '',
        idEmp_Custo: ''
    });

    useEffect(() => {
        const carregar = async () => {
            try {
                const r = await fetch('/api/ccusto/opcoes');
                if (r.ok) {
                    const data = await r.json();
                    setEmpresas(data.empresas || []);
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
                            idEmp_Custo: data.idEmp_Custo || ''
                        });
                    }
                } catch (e) { console.error(e) }
            }
        };
        carregar();
    }, [centroId]);

    const handleChange = (e: any) => setCentro(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                codigoCCusto: centro.codigoCCusto || null,
                descricaoCCusto: centro.descricaoCCusto || null,
                idEmp_Custo: centro.idEmp_Custo || null
            };

            let res;
            if (centroId) {
                res = await fetch(`/api/ccusto/${centroId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            } else {
                res = await fetch('/api/ccusto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            }

            if (res.ok) {
                router.push('/ccustos');
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
                    <Link href="/ccustos" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                    <h1 className="text-h3 font-bold">{centroId ? 'Editar Centro de Custo' : 'Cadastrar Centro de Custo'}</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Código</label>
                        <input name="codigoCCusto" value={centro.codigoCCusto} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Descrição *</label>
                        <input name="descricaoCCusto" value={centro.descricaoCCusto} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Empresa</label>
                        <select name="idEmp_Custo" value={centro.idEmp_Custo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                            <option value="">Selecione</option>
                            {empresas.map(emp => (<option key={emp.idEmp} value={emp.idEmp}>{emp.fantasiaEmpresa || emp.razaoEmpresa || emp.idEmp}</option>))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/ccustos"><Button variant="outline">Cancelar</Button></Link>
                        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : centroId ? 'Atualizar' : 'Criar'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
