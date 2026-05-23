import { NextRequest, NextResponse } from 'next/server';
import { alocacoesEvolucaoPorCentroCusto } from '@/back-end/service/Dashboard.service/dashboard.service';
import { getCentrosFiltro, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'DASHBOARD');
        if (!canAccess) {
            return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
        }
        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;
        const resultado = await alocacoesEvolucaoPorCentroCusto(filtroCentros);
        return NextResponse.json(resultado);
    } catch (error) {
        console.error('Erro ao obter evolução de alocações por centro:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
