import { NextRequest, NextResponse } from 'next/server';
import { contarPatrimoniosComFiltro, criarPatrimonio, listarPatrimonios } from '@/back-end/service/Patrimonio.services/patrimonio.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const descricao = searchParams.get('descricao');
        const status = searchParams.get('status');
        const tipo = searchParams.get('tipo');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '100');

        const [patrimonios, total] = await Promise.all([
            listarPatrimonios({
                descricao: descricao || undefined,
                status: status || undefined,
                tipo: tipo || undefined,
                skip,
                take
            }),
            contarPatrimoniosComFiltro({
                descricao: descricao || undefined,
                status: status || undefined,
                tipo: tipo || undefined
            })
        ]);

        return NextResponse.json({
            data: patrimonios,
            total
        });
    } catch (error) {
        console.error('Erro ao listar patrimônios:', error);
        return NextResponse.json(
            { message: 'Erro ao listar patrimônios' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();

        // Validação básica
        if (!dados.idPat || !dados.descricaoPat || !dados.valorPat || !dados.dataEntPat) {
            return NextResponse.json(
                { message: 'Campos obrigatórios faltando' },
                { status: 400 }
            );
        }

        const patrimonio = await criarPatrimonio({
            idPat: dados.idPat,
            descricaoPat: dados.descricaoPat,
            descricaoDetalhadaPat: dados.descricaoDetalhadaPat,
            licencaPat: dados.licencaPat,
            dataEntPat: new Date(dados.dataEntPat),
            dataSaiPat: dados.dataSaiPat ? new Date(dados.dataSaiPat) : undefined,
            notaFiscalPat: dados.notaFiscalPat,
            valorPat: parseFloat(dados.valorPat),
            idPat_TipoPat: dados.idPat_TipoPat,
            idPat_StatusPat: dados.idPat_StatusPat,
            idPat_CustoPat: dados.idPat_CustoPat
        });

        return NextResponse.json(patrimonio, { status: 201 });
    } catch (error: unknown) {
        console.error('Erro ao criar patrimônio:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar patrimônio';
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}
