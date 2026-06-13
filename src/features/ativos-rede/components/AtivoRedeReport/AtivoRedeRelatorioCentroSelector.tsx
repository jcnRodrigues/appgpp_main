'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent } from 'react';

type CentroCusto = {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
};

type Props = {
    centros: CentroCusto[];
    centroId?: string;
};

function formatarCentro(centro: CentroCusto) {
    return [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(' - ');
}

export default function AtivoRedeRelatorioCentroSelector({ centros, centroId = '' }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        const value = event.target.value.trim();

        if (value) {
            params.set('centroId', value);
        } else {
            params.delete('centroId');
        }

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="block text-sm font-medium mb-2">Centro de custo</label>
            <select
                value={centroId}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="">Selecione um centro de custo</option>
                {centros.map((centro) => (
                    <option key={centro.idCCusto} value={centro.idCCusto}>
                        {formatarCentro(centro)}
                    </option>
                ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
                Ao escolher um centro, a lista abaixo é carregada automaticamente para gerar o PDF.
            </p>
        </div>
    );
}
