import { NextRequest, NextResponse } from 'next/server';
import { getCentroCustoById, atualizarCentroCusto, deletarCentroCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'CENTRO_CUSTO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Sem permissao para acessar centro de custo' }, { status: 403 });
        }
        const { id } = await params;
        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0 && !centros.includes(id)) {
            return NextResponse.json({ message: 'Centro de custo nÃ£o encontrado' }, { status: 404 });
        }

        const centro = await getCentroCustoById(id);
        if (!centro) return NextResponse.json({ message: 'Centro de custo nÃ£o encontrado' }, { status: 404 });
        return NextResponse.json(centro);
    } catch (error) {
        console.error('Erro ao obter centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao obter centro de custo' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'CENTRO_CUSTO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Sem permissao para acessar centro de custo' }, { status: 403 });
        }
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canUpdate) {
            return NextResponse.json({ message: 'Sem permissao para alterar centro de custo' }, { status: 403 });
        }
        const { id } = await params;
        const dados = await request.json();
        const updated = await atualizarCentroCusto(id, {
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'CENTRO_CUSTO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Sem permissao para acessar centro de custo' }, { status: 403 });
        }
        const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canDelete) {
            return NextResponse.json({ message: 'Sem permissÃ£o para deletar' }, { status: 403 });
        }
        const { id } = await params;
        await deletarCentroCusto(id);
        return NextResponse.json({ message: 'Centro de custo deletado' });
    } catch (error) {
        console.error('Erro ao deletar centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao deletar centro de custo' }, { status: 500 });
    }
}


