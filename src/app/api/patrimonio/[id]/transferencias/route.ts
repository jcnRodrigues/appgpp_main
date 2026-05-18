import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../../../prisma/prisma';
import { getCentrosFiltro } from '@/lib/access';
import { getPatrimonioCardById, listarTransferenciasCustoPatrimonio, transferirCentroCustoPatrimonio } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { parseOptionalDateInput } from '@/lib/date-input';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const patrimonio = await getPatrimonioCardById(id);

        if (!patrimonio) {
            return NextResponse.json({ message: 'Patrimônio não encontrado' }, { status: 404 });
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0) {
            const centroAtual = patrimonio.idPat_CustoPat || '';
            if (!centros.includes(centroAtual)) {
                return NextResponse.json({ message: 'Patrimônio não encontrado' }, { status: 404 });
            }
        }

        const historico = await listarTransferenciasCustoPatrimonio(id);
        return NextResponse.json(historico);
    } catch (error) {
        console.error('Erro ao listar transferências:', error);
        return NextResponse.json({ message: 'Erro ao listar transferências' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!body?.idCustoDestino) {
            return NextResponse.json({ message: 'Centro de custo de destino é obrigatório' }, { status: 400 });
        }

        const patrimonio = await getPatrimonioCardById(id);
        if (!patrimonio) {
            return NextResponse.json({ message: 'Patrimônio não encontrado' }, { status: 404 });
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0) {
            const centroAtual = patrimonio.idPat_CustoPat || '';
            if (!centros.includes(centroAtual) || !centros.includes(body.idCustoDestino)) {
                return NextResponse.json({ message: 'Sem permissão para transferir entre estes centros de custo' }, { status: 403 });
            }
        }

        let idUserTransferencia: string | undefined;
        const userEmail = String(token?.email || '').trim().toLowerCase();
        if (userEmail) {
            const acesso = await prisma.tbUser.findFirst({
                where: { emailUser: userEmail },
                select: { id: true }
            });
            idUserTransferencia = acesso?.id;
        }

        const atualizado = await transferirCentroCustoPatrimonio({
            idPatrimonio: id,
            idCustoDestino: body.idCustoDestino,
            observacao: body.observacao,
            dataTransferencia: parseOptionalDateInput(body.dataTransferencia),
            idUserTransferencia
        });

        return NextResponse.json(atualizado);
    } catch (error: unknown) {
        console.error('Erro ao transferir centro de custo:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao transferir centro de custo' },
            { status: 500 }
        );
    }
}
