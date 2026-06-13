'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { Search } from 'lucide-react';

type CentroCusto = {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
};

type StatusAtivoRede = {
    idStatusAtivoRede: string;
    descricaoStatusAtivoRede?: string | null;
};

type Props = {
    codigo?: string;
    centroId?: string;
    statusId?: string;
    centros: CentroCusto[];
    statusOptions: StatusAtivoRede[];
};

function formatarCentro(centro: CentroCusto) {
    return [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(' - ');
}

export default function AtivoRedeFilter({ codigo = '', centroId = '', statusId = '', centros, statusOptions }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const aplicarFiltros = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const params = new URLSearchParams(searchParams?.toString() || '');

        const codigoValue = String(formData.get('codigo') || '').trim();
        const centroValue = String(formData.get('centroId') || '').trim();
        const statusValue = String(formData.get('statusId') || '').trim();

        if (codigoValue) params.set('codigo', codigoValue);
        else params.delete('codigo');

        if (centroValue) params.set('centroId', centroValue);
        else params.delete('centroId');

        if (statusValue) params.set('statusId', statusValue);
        else params.delete('statusId');

        params.delete('page');

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        aplicarFiltros(event.currentTarget);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-3 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Buscar por código</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="codigo"
                            defaultValue={codigo}
                            placeholder="Ex: NET001"
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Filtrar por centro de custo</label>
                    <select
                        name="centroId"
                        defaultValue={centroId}
                        onChange={(event) => {
                            if (event.currentTarget.form) {
                                aplicarFiltros(event.currentTarget.form);
                            }
                        }}
                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Todos os centros de custo</option>
                        {centros.map((centro) => (
                            <option key={centro.idCCusto} value={centro.idCCusto}>
                                {formatarCentro(centro)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">Filtrar por status</label>
                    <select
                        name="statusId"
                        defaultValue={statusId}
                        onChange={(event) => {
                            if (event.currentTarget.form) {
                                aplicarFiltros(event.currentTarget.form);
                            }
                        }}
                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Todos os status</option>
                        {statusOptions.map((status) => (
                            <option key={status.idStatusAtivoRede} value={status.idStatusAtivoRede}>
                                {status.descricaoStatusAtivoRede || status.idStatusAtivoRede}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
}
