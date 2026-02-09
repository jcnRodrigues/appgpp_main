import { NextRequest, NextResponse } from 'next/server';
import { getCentroCustoById, atualizarCentroCusto, deletarCentroCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const centro = await getCentroCustoById(id);
        if (!centro) return NextResponse.json({ message: 'Centro de custo não encontrado' }, { status: 404 });
        return NextResponse.json(centro);
    } catch (error) {
        console.error('Erro ao obter centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao obter centro de custo' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const dados = await request.json();
        const updated = await atualizarCentroCusto(id, {
            codigoCCusto: typeof dados.codigoCCusto !== 'undefined' ? dados.codigoCCusto : undefined,
            descricaoCCusto: typeof dados.descricaoCCusto !== 'undefined' ? dados.descricaoCCusto : undefined,
            idEmp_Custo: typeof dados.idEmp_Custo !== 'undefined' ? dados.idEmp_Custo : undefined
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Erro ao atualizar centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao atualizar centro de custo' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await deletarCentroCusto(id);
        return NextResponse.json({ message: 'Deletado' });
    } catch (error) {
        console.error('Erro ao deletar centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao deletar centro de custo' }, { status: 500 });
    }
}
