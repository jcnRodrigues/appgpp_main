import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../../../prisma/prisma';
import { transferirAlocacao } from '@/features/alocacoes/server/cadastro.service';
import { parseOptionalDateInput } from '@/lib/date-input';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'ALOCACOES');
    const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');

    if (!canAccess || !canUpdate) {
      return NextResponse.json({ message: 'Sem permissão para transferir alocação' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body?.idMatFunDestino) {
      return NextResponse.json({ message: 'Funcionário de destino é obrigatório.' }, { status: 400 });
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    let idUserTransferencia: string | null = null;
    const userEmail = String(token?.email || '').trim().toLowerCase();

    if (userEmail) {
      const acesso = await prisma.tbUser.findFirst({
        where: { emailUser: userEmail },
        select: { id: true }
      });
      idUserTransferencia = acesso?.id || null;
    }

    const resultado = await transferirAlocacao(id, {
      idMatFunDestino: String(body.idMatFunDestino),
      dataTransferencia: parseOptionalDateInput(body.dataTransferencia),
      observacaoTransferencia: typeof body.observacaoTransferencia === 'string' ? body.observacaoTransferencia : null,
      idUserTransferencia
    });

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao transferir alocação:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao transferir alocação' },
      { status: 500 }
    );
  }
}
