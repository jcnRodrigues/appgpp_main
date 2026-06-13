import { NextRequest, NextResponse } from 'next/server';
import { alocacoesPorCentroCustoETipo } from '@/features/dashboard/server/dashboard.service';
import { getCentrosFiltro, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'DASHBOARD');
        if (!canAccess) {
            return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
        }
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
