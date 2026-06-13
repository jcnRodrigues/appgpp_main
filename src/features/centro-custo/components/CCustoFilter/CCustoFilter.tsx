'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';

type StatusCentroCusto = {
    idStatusCCusto: string;
    descricaoStatusCCusto?: string | null;
};

type Props = {
    statusId?: string;
    statusOptions: StatusCentroCusto[];
};

export default function CCustoFilter({ statusId = '', statusOptions }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const aplicarFiltros = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const params = new URLSearchParams(searchParams?.toString() || '');
        const statusValue = String(formData.get('statusId') || '').trim();

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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr] gap-3 items-end">
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
                            <option key={status.idStatusCCusto} value={status.idStatusCCusto}>
                                {status.descricaoStatusCCusto || status.idStatusCCusto}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
}
