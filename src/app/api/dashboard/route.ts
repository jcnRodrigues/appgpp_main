import { NextRequest, NextResponse } from 'next/server';
import { 
    alocacoesPorCentroCusto,
    alocacoesAoLongoDoTempo
} from '@/back-end/service/Dashboard.service/dashboard.service';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('tipo');
        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;

        if (tipo === 'centro') {
            const dados = await alocacoesPorCentroCusto(filtroCentros);
            return NextResponse.json(dados);
        }

        if (tipo === 'tempo') {
            const dados = await alocacoesAoLongoDoTempo(filtroCentros);
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
