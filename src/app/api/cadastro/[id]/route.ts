import { NextRequest, NextResponse } from 'next/server';
import { 
    buscarAlocacaoById, 
    atualizarAlocacao, 
    deletarAlocacao 
} from '@/back-end/service/Cadastro.service/cadastro.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const alocacao = await buscarAlocacaoById(id);

        if (!alocacao) {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(alocacao);
    } catch (error) {
        console.error('Erro ao obter alocação:', error);
        return NextResponse.json(
            { message: 'Erro ao obter alocação' },
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

        const alocacao = await atualizarAlocacao(id, {
            dataCadPat: dados.dataCadPat ? new Date(dados.dataCadPat) : undefined,
            dataDevPat: dados.dataDevPat ? new Date(dados.dataDevPat) : undefined,
            idStatusPatCad: dados.idStatusPatCad || undefined
        });

        return NextResponse.json(alocacao);
    } catch (error: any) {
        console.error('Erro ao atualizar alocação:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao atualizar alocação' },
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
        await deletarAlocacao(id);

        return NextResponse.json({ message: 'Alocação deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar alocação:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar alocação' },
            { status: 500 }
        );
    }
}
