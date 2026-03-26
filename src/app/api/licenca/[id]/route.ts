import { NextRequest, NextResponse } from 'next/server';
import { atualizarLicenca, deletarLicenca, getLicencaById } from '@/back-end/service/Licenca.service/licenca.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const licenca = await getLicencaById(id);

        if (!licenca) {
            return NextResponse.json(
                { message: 'Licenca nao encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(licenca);
    } catch (error) {
        console.error('Erro ao obter licenca:', error);
        return NextResponse.json(
            { message: 'Erro ao obter licenca' },
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

        if (!dados.descricaoLic) {
            return NextResponse.json(
                { message: 'Campo obrigatorio faltando (descricaoLic)' },
                { status: 400 }
            );
        }

        const licenca = await atualizarLicenca(id, {
            descricaoLic: dados.descricaoLic
        });

        return NextResponse.json(licenca);
    } catch (error: any) {
        console.error('Erro ao atualizar licenca:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Licenca nao encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao atualizar licenca' },
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
        await deletarLicenca(id);

        return NextResponse.json({ message: 'Licenca deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar licenca:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Licenca nao encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar licenca' },
            { status: 500 }
        );
    }
}
