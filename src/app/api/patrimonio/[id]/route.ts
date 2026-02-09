import { NextRequest, NextResponse } from 'next/server';
import { getPatrimonioCardById, atualizarPatrimonio } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import prisma from '../../../../../prisma/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const patrimonio = await getPatrimonioCardById(id);

        if (!patrimonio) {
            return NextResponse.json(
                { message: 'Patrimônio não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(patrimonio);
    } catch (error) {
        console.error('Erro ao obter patrimônio:', error);
        return NextResponse.json(
            { message: 'Erro ao obter patrimônio' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const dados = await request.json();

        // Validação mínima
        if (!dados || Object.keys(dados).length === 0) {
            return NextResponse.json({ message: 'Nenhum dado para atualizar' }, { status: 400 });
        }

        const updateData: any = {};
        if (typeof dados.descricaoPat !== 'undefined') updateData.descricaoPat = dados.descricaoPat;
        if (typeof dados.descricaoDetalhadaPat !== 'undefined') updateData.descricaoDetalhadaPat = dados.descricaoDetalhadaPat;
        if (typeof dados.licencaPat !== 'undefined') updateData.licencaPat = dados.licencaPat;
        if (typeof dados.dataEntPat !== 'undefined' && dados.dataEntPat !== null) updateData.dataEntPat = new Date(dados.dataEntPat);
        if (typeof dados.dataSaiPat !== 'undefined' && dados.dataSaiPat !== null) updateData.dataSaiPat = new Date(dados.dataSaiPat);
        if (typeof dados.notaFiscalPat !== 'undefined') updateData.notaFiscalPat = dados.notaFiscalPat;
        if (typeof dados.valorPat !== 'undefined') {
            const v = typeof dados.valorPat === 'number' ? dados.valorPat : parseFloat(dados.valorPat);
            if (Number.isNaN(v)) return NextResponse.json({ message: 'Valor inválido' }, { status: 400 });
            updateData.valorPat = v;
        }
        if (typeof dados.idPat_TipoPat !== 'undefined') updateData.idPat_TipoPat = dados.idPat_TipoPat;
        if (typeof dados.idPat_StatusPat !== 'undefined') updateData.idPat_StatusPat = dados.idPat_StatusPat;
        if (typeof dados.idPat_CustoPat !== 'undefined') updateData.idPat_CustoPat = dados.idPat_CustoPat;

        const patrimonio = await atualizarPatrimonio(id, updateData);

        return NextResponse.json(patrimonio);
    } catch (error: unknown) {
        console.error('Erro ao atualizar patrimônio:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao atualizar patrimônio' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Verificar se patrimônio existe
        const patrimonio = await getPatrimonioCardById(id);
        if (!patrimonio) {
            return NextResponse.json(
                { message: 'Patrimônio não encontrado' },
                { status: 404 }
            );
        }

        // Deletar patrimônio
        await prisma.tbPatrimonio.delete({
            where: { idP: id }
        });

        return NextResponse.json({ message: 'Patrimônio deletado com sucesso' });
    } catch (error: unknown) {
        console.error('Erro ao deletar patrimônio:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao deletar patrimônio' },
            { status: 500 }
        );
    }
}
