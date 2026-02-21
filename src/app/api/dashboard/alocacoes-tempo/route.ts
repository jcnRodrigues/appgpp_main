import { NextRequest, NextResponse } from 'next/server';
import { alocacoesEvolucaoPorCentroCusto } from '@/back-end/service/Dashboard.service/dashboard.service';

export async function GET(request: NextRequest) {
    try {
        const resultado = await alocacoesEvolucaoPorCentroCusto();
        return NextResponse.json(resultado);
    } catch (error) {
        console.error('Erro ao obter evolução de alocações por centro:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
