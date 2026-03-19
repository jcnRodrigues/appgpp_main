import { NextRequest, NextResponse } from 'next/server';
import { alocacoesPorCentroCustoETipo } from '@/back-end/service/Dashboard.service/dashboard.service';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;
        const resultado = await alocacoesPorCentroCustoETipo(filtroCentros);
        return NextResponse.json(resultado);
    } catch (error) {
        console.error('Erro ao obter alocações por centro e tipo:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
