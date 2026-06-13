import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {
    buscarAlocacaoById,
    atualizarAlocacao,
    deletarAlocacao
} from '@/features/alocacoes/server/cadastro.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseNullableDateInput } from '@/lib/date-input';
import prisma from '../../../../../prisma/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'ALOCACOES');
        if (!canAccess) return NextResponse.json({ message: 'Sem permissao para acessar alocacoes' }, { status: 403 });

        const { id } = await params;
        const alocacao = await buscarAlocacaoById(id);

        if (!alocacao) {
            return NextResponse.json({ message: 'Alocacao nao encontrada' }, { status: 404 });
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        const centroFun = alocacao.tbFuncionario?.idCustoFun || '';
        const centroPat = alocacao.tbPatrimonio?.idPat_CustoPat || '';

        if (!allowAll && (!centros.includes(centroFun) || !centros.includes(centroPat))) {
            return NextResponse.json({ message: 'Alocacao nao encontrada' }, { status: 404 });
        }

        return NextResponse.json(alocacao);
    } catch (error) {
        console.error('Erro ao obter alocacao:', error);
        return NextResponse.json({ message: 'Erro ao obter alocacao' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'ALOCACOES');
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissao para alterar alocacao' }, { status: 403 });

        const { id } = await params;
        const dados = await request.json();
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        let idUserTransferencia: string | null = null;
        const userEmail = String(token?.email || '').trim().toLowerCase();
        if (userEmail) {
            const acesso = await prisma.tbUser.findFirst({ where: { emailUser: userEmail }, select: { id: true } });
            idUserTransferencia = acesso?.id || null;
        }
        const hasDataCadPat = Object.prototype.hasOwnProperty.call(dados, 'dataCadPat');
        const hasDataDevPat = Object.prototype.hasOwnProperty.call(dados, 'dataDevPat');

        const alocacao = await atualizarAlocacao(id, {
            dataCadPat: hasDataCadPat ? parseNullableDateInput(dados.dataCadPat) ?? undefined : undefined,
            dataDevPat: hasDataDevPat ? parseNullableDateInput(dados.dataDevPat) : undefined,
            idStatusPatCad: dados.idStatusPatCad || undefined,
            motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao : null,
            observacaoTransferencia: typeof dados.observacaoTransferencia === 'string' ? dados.observacaoTransferencia : null,
            idUserTransferencia
        });

        return NextResponse.json(alocacao);
    } catch (error: any) {
        console.error('Erro ao atualizar alocacao:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Alocacao nao encontrada' }, { status: 404 });
        }
        return NextResponse.json({ message: error.message || 'Erro ao atualizar alocacao' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'ALOCACOES');
        const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canAccess || !canDelete) return NextResponse.json({ message: 'Sem permissao para deletar alocacao' }, { status: 403 });

        const { id } = await params;
        await deletarAlocacao(id);

        return NextResponse.json({ message: 'Alocacao deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar alocacao:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Alocacao nao encontrada' }, { status: 404 });
        }
        return NextResponse.json({ message: error.message || 'Erro ao deletar alocacao' }, { status: 500 });
    }
}
