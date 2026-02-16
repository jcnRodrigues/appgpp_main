import { NextRequest, NextResponse } from 'next/server';
import { 
    listarAlocacoes, 
    criarAlocacao,
    listarFuncionarios,
    listarPatrimonios 
} from '@/back-end/service/Cadastro.service/cadastro.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const idMatFun = searchParams.get('funcionario');
        const idPat = searchParams.get('patrimonio');
        const opcoes = searchParams.get('opcoes');

        // Se solicitar opções (funcionários e patrimônios)
        if (opcoes === 'true') {
            const [funcionarios, patrimonios] = await Promise.all([
                listarFuncionarios(),
                listarPatrimonios()
            ]);

            return NextResponse.json({
                funcionarios,
                patrimonios
            });
        }

        // Listar alocações com filtros
        const alocacoes = await listarAlocacoes({
            idMatFun: idMatFun || undefined,
            idPat: idPat || undefined,
            skip: 0,
            take: 100
        });

        return NextResponse.json({
            data: alocacoes,
            total: alocacoes.length
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
            dataCadPat: dados.dataCadPat ? new Date(dados.dataCadPat) : undefined
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
