import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { criarProcessoTransferencia } from '@/features/transferencia/server/transferenciaCodigo.service';

function formatarDataIso(value?: Date | string | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canPrint = await hasActionPermissionForRequest(request, 'PRINT');
  if (!canAccess || !canPrint) {
    return NextResponse.json({ message: 'Sem permissão para acessar processos de transferência' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFiltro = searchParams.get('status');
    const statusNormalizado = statusFiltro === 'FECHADO' ? 'FECHADO' : statusFiltro === 'ABERTO' ? 'ABERTO' : null;

    const processos = await prisma.tbTransferenciaProcesso.findMany({
      include: {
        tbTransferenciaCustoPatrimonio: {
          select: {
            dataTransferencia: true,
            createdAt: true
          }
        }
      },
      orderBy: [
        { anoTransferencia: 'desc' },
        { mesTransferencia: 'desc' },
        { contadorTransferencia: 'desc' }
      ]
    });

    const processosResumo = processos
      .map((processo) => {
        const totalItens = processo.tbTransferenciaCustoPatrimonio.length;
        const dataInicio = processo.tbTransferenciaCustoPatrimonio.reduce<Date | null>((menor, item) => {
          if (!item.dataTransferencia) return menor;
          if (!menor) return item.dataTransferencia;
          return item.dataTransferencia < menor ? item.dataTransferencia : menor;
        }, null);
        const updatedAt = processo.tbTransferenciaCustoPatrimonio.reduce<Date | null>((maior, item) => {
          if (!item.createdAt) return maior;
          if (!maior) return item.createdAt;
          return item.createdAt > maior ? item.createdAt : maior;
        }, null);
        const itensPendentes = totalItens > 0 && processo.statusTransferencia === 'ABERTO' ? totalItens : 0;
        const itensConcluidos = totalItens - itensPendentes;

        return {
          codigoTransferencia: processo.codigoTransferencia,
          mesTransferencia: processo.mesTransferencia,
          anoTransferencia: processo.anoTransferencia,
          contadorTransferencia: processo.contadorTransferencia,
          statusTransferencia: processo.statusTransferencia === 'FECHADO' ? 'FECHADO' : 'ABERTO',
          totalItens,
          itensPendentes,
          itensConcluidos,
          centroAtual: 'Processo de transferência',
          dataInicioTransferencia: formatarDataIso(dataInicio || processo.dataInicioTransferencia),
          dataFechamento: formatarDataIso(processo.dataFechamento),
          updatedAt: formatarDataIso(processo.updatedAt || updatedAt)
        };
      })
      .filter((processo) => !statusNormalizado || processo.statusTransferencia === statusNormalizado);

    return NextResponse.json({ data: processosResumo, total: processosResumo.length });
  } catch (error) {
    console.error('Erro ao listar processos de transferência:', error);
    return NextResponse.json({ message: 'Erro ao listar processos de transferência' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
  if (!canAccess || !canCreate) {
    return NextResponse.json({ message: 'Sem permissão para iniciar transferência' }, { status: 403 });
  }

  try {
    const processo = await criarProcessoTransferencia();
    return NextResponse.json({
      codigo: processo.codigo,
      mes: processo.mes,
      ano: processo.ano,
      contador: processo.contador,
      idTransferenciaProcesso: processo.idTransferenciaProcesso,
      created: true
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao iniciar transferência:', error);
    return NextResponse.json({ message: 'Erro ao iniciar transferência' }, { status: 500 });
  }
}
