import { NextRequest, NextResponse } from 'next/server';
import { getFuncaoById, atualizarFuncao, deletarFuncao } from '@/features/funcao/server/funcao.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'FUNCOES');
        if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar funcoes' }, { status: 403 });

        const { id } = await params;
        const função = await getFuncaoById(id);

        if (!função) {
            return NextResponse.json(
                { message: 'Funcao não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(função);
    } catch (error) {
        console.error('Erro ao obter função:', error);
        return NextResponse.json(
            { message: 'Erro ao obter função' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'FUNCOES');
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissão para alterar função' }, { status: 403 });

        const { id } = await params;
        const dados = await request.json();

        if (!dados.nomeFuncao) {
            return NextResponse.json(
                { message: 'Campo obrigat?rio faltando (nomeFuncao)' },
                { status: 400 }
            );
        }

        const função = await atualizarFuncao(id, {
            nomeFuncao: dados.nomeFuncao
        });

        return NextResponse.json(função);
    } catch (error: any) {
        console.error('Erro ao atualizar função:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Funcao não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao atualizar função' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'FUNCOES');
        const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canAccess || !canDelete) return NextResponse.json({ message: 'Sem permissão para deletar função' }, { status: 403 });

        const { id } = await params;
        await deletarFuncao(id);

        return NextResponse.json({ message: 'Funcao deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar função:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Funcao não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar função' },
            { status: 500 }
        );
    }
}


