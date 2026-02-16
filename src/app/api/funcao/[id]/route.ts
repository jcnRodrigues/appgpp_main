import { NextRequest, NextResponse } from 'next/server';
import { getFuncaoById, atualizarFuncao, deletarFuncao } from '@/back-end/service/Funcao.service/funcao.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const funcao = await getFuncaoById(id);

        if (!funcao) {
            return NextResponse.json(
                { message: 'Função não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(funcao);
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
        const { id } = await params;
        const dados = await request.json();

        // Validação básica
        if (!dados.nomeFuncao) {
            return NextResponse.json(
                { message: 'Campo obrigatório faltando (nomeFuncao)' },
                { status: 400 }
            );
        }

        const funcao = await atualizarFuncao(id, {
            nomeFuncao: dados.nomeFuncao
        });

        return NextResponse.json(funcao);
    } catch (error: any) {
        console.error('Erro ao atualizar função:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Função não encontrada' },
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
        const { id } = await params;
        await deletarFuncao(id);

        return NextResponse.json({ message: 'Função deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar função:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Função não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar função' },
            { status: 500 }
        );
    }
}
