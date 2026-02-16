import { NextRequest, NextResponse } from 'next/server';
import { alocacoesPorCentroCusto } from '@/back-end/service/Dashboard.service/dashboard.service';

export async function GET(request: NextRequest) {
    try {
        const dados = await alocacoesPorCentroCusto();
        return NextResponse.json(dados);
    } catch (error) {
        console.error('Erro ao obter alocações por centro:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
