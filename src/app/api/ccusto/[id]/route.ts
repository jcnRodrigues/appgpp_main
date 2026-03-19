import { NextRequest, NextResponse } from 'next/server';
import { getCentroCustoById, atualizarCentroCusto, deletarCentroCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0 && !centros.includes(params.id)) {
            return NextResponse.json({ message: 'Centro de custo não encontrado' }, { status: 404 });
        }

        const centro = await getCentroCustoById(params.id);
        if (!centro) return NextResponse.json({ message: 'Centro de custo não encontrado' }, { status: 404 });
        return NextResponse.json(centro);
    } catch (error) {
        console.error('Erro ao obter centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao obter centro de custo' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const dados = await request.json();
        const updated = await atualizarCentroCusto(params.id, {
            codigoCCusto: dados.codigoCCusto,
            descricaoCCusto: dados.descricaoCCusto,
            idEmp_Custo: dados.idEmp_Custo
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Erro ao atualizar centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao atualizar centro de custo' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await deletarCentroCusto(params.id);
        return NextResponse.json({ message: 'Centro de custo deletado' });
    } catch (error) {
        console.error('Erro ao deletar centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao deletar centro de custo' }, { status: 500 });
    }
}
