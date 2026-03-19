import { NextRequest, NextResponse } from 'next/server';
import { 
    listarAlocacoes, 
    criarAlocacao,
    listarFuncionarios,
    listarPatrimonios,
    contarAlocacoes
} from '@/back-end/service/Cadastro.service/cadastro.service';
import { getStatusPatrimonio } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const idMatFun = searchParams.get('funcionario');
        const idPat = searchParams.get('patrimonio');
        const opcoes = searchParams.get('opcoes');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');

        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;

        if (!allowAll && centros.length === 0 && opcoes !== 'true') {
            return NextResponse.json({ data: [], total: 0 });
        }

        // Se solicitar opções (funcionários e patrimônios)
        if (opcoes === 'true') {
            const [funcionarios, patrimonios, statusPatrimonio] = await Promise.all([
                listarFuncionarios(filtroCentros),
                listarPatrimonios(filtroCentros),
                getStatusPatrimonio()
            ]);

            return NextResponse.json({
                funcionarios,
                patrimonios,
                statusPatrimonio
            });
        }

        // Listar alocações com filtros
        const alocacoes = await listarAlocacoes({
            idMatFun: idMatFun || undefined,
            idPat: idPat || undefined,
            centros: filtroCentros,
            skip,
            take
        });
        const total = await contarAlocacoes({
            idMatFun: idMatFun || undefined,
            idPat: idPat || undefined,
            centros: filtroCentros
        });

        return NextResponse.json({
            data: alocacoes,
            total
        });
    } catch (error) {
        console.error('Erro ao listar alocações:', error);
        return NextResponse.json(
            { message: 'Erro ao listar alocações' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();

        // Validação básica
        if (!dados.idPatCad || !dados.idMatFunCad) {
            return NextResponse.json(
                { message: 'Campos obrigatórios faltando (idPatCad, idMatFunCad)' },
                { status: 400 }
            );
        }

        const alocacao = await criarAlocacao({
            idPatCad: dados.idPatCad,
            idMatFunCad: dados.idMatFunCad,
            dataCadPat: dados.dataCadPat ? new Date(dados.dataCadPat) : undefined,
            dataDevPat: dados.dataDevPat ? new Date(dados.dataDevPat) : undefined,
            idStatusPatCad: dados.idStatusPatCad || undefined
        });

        return NextResponse.json(alocacao, { status: 201 });
    } catch (error: any) {
        console.error('Erro ao criar alocação:', error);
        return NextResponse.json(
            { message: error.message || 'Erro ao criar alocação' },
            { status: 500 }
        );
    }
}
