import { NextRequest, NextResponse } from 'next/server';
import {
    contarFuncionarios,
    alocacoesPorCentroCusto,
    alocacoesAoLongoDoTempo
} from '@/back-end/service/Dashboard.service/dashboard.service';
import { contarPatrimonios } from '@/back-end/service/Patrimonio.services/patrimonio.service';
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

        if (tipo === 'resumo') {
            const [totalPatrimonios, totalFuncionarios] = await Promise.all([
                contarPatrimonios({ centros: filtroCentros }),
                contarFuncionarios(filtroCentros),
            ]);

            return NextResponse.json({
                totalPatrimonios,
                totalFuncionarios,
            });
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
