import { NextRequest, NextResponse } from 'next/server';
import { getFuncaoById, atualizarFuncao, deletarFuncao } from '@/features/funcao/server/funcao.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'FUNCOES');
        if (!canAccess) return NextResponse.json({ message: 'Sem permissao para acessar funcoes' }, { status: 403 });

        const { id } = await params;
        const funcao = await getFuncaoById(id);

        if (!funcao) {
            return NextResponse.json(
                { message: 'Funcao nao encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(funcao);
    } catch (error) {
        console.error('Erro ao obter funcao:', error);
        return NextResponse.json(
            { message: 'Erro ao obter funcao' },
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
        if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissao para alterar funcao' }, { status: 403 });

        const { id } = await params;
        const dados = await request.json();

        if (!dados.nomeFuncao) {
            return NextResponse.json(
                { message: 'Campo obrigatorio faltando (nomeFuncao)' },
                { status: 400 }
            );
        }

        const funcao = await atualizarFuncao(id, {
            nomeFuncao: dados.nomeFuncao
        });

        return NextResponse.json(funcao);
    } catch (error: any) {
        console.error('Erro ao atualizar funcao:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Funcao nao encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao atualizar funcao' },
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
        if (!canAccess || !canDelete) return NextResponse.json({ message: 'Sem permissao para deletar funcao' }, { status: 403 });

        const { id } = await params;
        await deletarFuncao(id);

        return NextResponse.json({ message: 'Funcao deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar funcao:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Funcao nao encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar funcao' },
            { status: 500 }
        );
    }
}
