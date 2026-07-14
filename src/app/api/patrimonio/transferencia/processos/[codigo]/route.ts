import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { obterProcessoTransferenciaPorCodigo } from '@/features/transferencia/server/transferenciaCodigo.service';

function formatarDataIso(value?: Date | string | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canPrint = await hasActionPermissionForRequest(request, 'PRINT');
  if (!canAccess || !canPrint) {
    return NextResponse.json({ message: 'Sem permissão para acessar processo de transferência' }, { status: 403 });
  }

  try {
    const { codigo } = await params;
    const processo = await obterProcessoTransferenciaPorCodigo(codigo);
    if (!processo) {
      return NextResponse.json({ message: 'Processo de transferência não encontrado' }, { status: 404 });
    }

    const linhas = await prisma.tbTransferenciaCustoPatrimonio.findMany({
      where: { idTransferenciaProcesso: processo.idTransferenciaProcesso },
      include: {
        tbPatrimonio: {
          select: {
            idP: true,
            idPat: true,
            descricaoPat: true,
            valorPat: true,
            tbStatusPat: { select: { descricaoStatPat: true } },
            tbCCusto: { select: { descricaoCCusto: true } }
          }
        },
        custoDestino: { select: { descricaoCCusto: true, codigoCCusto: true } },
        custoOrigem: { select: { descricaoCCusto: true, codigoCCusto: true } }
      },
      orderBy: { dataTransferencia: 'asc' }
    });

    return NextResponse.json({
      idTransferenciaProcesso: processo.idTransferenciaProcesso,
      codigoTransferencia: processo.codigoTransferencia,
      statusTransferencia: processo.statusTransferencia,
      dataInicioTransferencia: formatarDataIso(processo.dataInicioTransferencia),
      dataFechamento: formatarDataIso(processo.dataFechamento),
      updatedAt: formatarDataIso(processo.updatedAt),
      linhas
    });
  } catch (error) {
    console.error('Erro ao carregar processo de transferência:', error);
    return NextResponse.json({ message: 'Erro ao carregar processo de transferência' }, { status: 500 });
  }
}
