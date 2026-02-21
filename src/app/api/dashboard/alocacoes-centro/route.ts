import { NextRequest, NextResponse } from 'next/server';
import { alocacoesPorCentroCustoETipo } from '@/back-end/service/Dashboard.service/dashboard.service';

export async function GET(request: NextRequest) {
    try {
        const resultado = await alocacoesPorCentroCustoETipo();
        return NextResponse.json(resultado);
    } catch (error) {
        console.error('Erro ao obter alocações por centro e tipo:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
