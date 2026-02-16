import { NextRequest, NextResponse } from 'next/server';
import { 
    alocacoesPorCentroCusto,
    alocacoesAoLongoDoTempo
} from '@/back-end/service/Dashboard.service/dashboard.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('tipo');

        if (tipo === 'centro') {
            const dados = await alocacoesPorCentroCusto();
            return NextResponse.json(dados);
        }

        if (tipo === 'tempo') {
            const dados = await alocacoesAoLongoDoTempo();
            return NextResponse.json(dados);
        }

        return NextResponse.json(
            { message: 'Tipo de gráfico não especificado' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Erro ao obter dados do dashboard:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
