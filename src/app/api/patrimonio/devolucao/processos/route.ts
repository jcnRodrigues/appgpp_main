import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { criarProcessoDevolucao } from '@/features/devolucao/server/devolucaoCodigo.service';

type ProcessoDevolucaoResumo = {
  codigoDevolucao: string;
  mesDevolucao: number;
  anoDevolucao: number;
  contadorDevolucao: number;
  statusDevolucao: 'ABERTO' | 'FECHADO';
  totalItens: number;
  itensAbertos: number;
  itensFechados: number;
  centroCustoDescricao: string;
  centroCustoCodigo: string;
  dataInicioDevolucao: string | null;
  dataFimDevolucao: string | null;
  updatedAt: string | null;
};

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
    return NextResponse.json({ message: 'Sem permissão para acessar processos de devolução' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFiltro = searchParams.get('status');
    const statusNormalizado = statusFiltro === 'FECHADO' ? 'FECHADO' : statusFiltro === 'ABERTO' ? 'ABERTO' : null;

    const processos = await prisma.tbDevolucaoProcesso.findMany({
      include: {
        tbDevolucao: {
          select: {
            dataInicioDevolucao: true,
            dataFimDevolucao: true,
            updatedAt: true
          }
        }
      },
      orderBy: [
        { anoDevolucao: 'desc' },
        { mesDevolucao: 'desc' },
        { contadorDevolucao: 'desc' }
      ]
    });

    const processosResumo = processos
      .map((processo): ProcessoDevolucaoResumo => {
        const totalItens = processo.tbDevolucao.length;
        const dataInicio = processo.tbDevolucao.reduce<Date | null>((menor, item) => {
          if (!item.dataInicioDevolucao) return menor;
          if (!menor) return item.dataInicioDevolucao;
          return item.dataInicioDevolucao < menor ? item.dataInicioDevolucao : menor;
        }, null);
        const dataFim = processo.tbDevolucao.reduce<Date | null>((maior, item) => {
          const valor = item.dataFimDevolucao;
          if (!valor) return maior;
          if (!maior) return valor;
          return valor > maior ? valor : maior;
        }, null);
        const updatedAt = processo.tbDevolucao.reduce<Date | null>((maior, item) => {
          const valor = item.updatedAt;
          if (!valor) return maior;
          if (!maior) return valor;
          return valor > maior ? valor : maior;
        }, null);

        const itensAbertos = totalItens > 0 && processo.statusDevolucao === 'ABERTO' ? totalItens : 0;
        const itensFechados = totalItens - itensAbertos;

        return {
          codigoDevolucao: processo.codigoDevolucao,
          mesDevolucao: processo.mesDevolucao,
          anoDevolucao: processo.anoDevolucao,
          contadorDevolucao: processo.contadorDevolucao,
          statusDevolucao: processo.statusDevolucao === 'FECHADO' ? 'FECHADO' : 'ABERTO',
          totalItens,
          itensAbertos,
          itensFechados,
          centroCustoCodigo: '',
          centroCustoDescricao: 'Processo de devolução',
          dataInicioDevolucao: formatarDataIso(dataInicio || processo.dataInicio),
          dataFimDevolucao: formatarDataIso(processo.dataFechamento || dataFim),
          updatedAt: formatarDataIso(processo.updatedAt || updatedAt)
        };
      })
      .filter((processo) => !statusNormalizado || processo.statusDevolucao === statusNormalizado);

    return NextResponse.json({
      data: processosResumo,
      total: processosResumo.length
    });
  } catch (error) {
    console.error('Erro ao listar processos de devolução:', error);
    return NextResponse.json({ message: 'Erro ao listar processos de devolução' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
  if (!canAccess || !canCreate) {
    return NextResponse.json({ message: 'Sem permissão para iniciar devolução' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const codigoSolicitado = String(body?.codigoDevolucao || '').trim().toUpperCase();

    if (codigoSolicitado) {
      const existente = await prisma.tbDevolucaoProcesso.findUnique({
        where: { codigoDevolucao: codigoSolicitado }
      });
      if (existente) {
        return NextResponse.json({
          codigo: existente.codigoDevolucao,
          mes: existente.mesDevolucao,
          ano: existente.anoDevolucao,
          contador: existente.contadorDevolucao,
          created: false
        });
      }
    }

    const processo = await criarProcessoDevolucao();
    return NextResponse.json({
      codigo: processo.codigo,
      mes: processo.mes,
      ano: processo.ano,
      contador: processo.contador,
      created: true
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao iniciar devolução:', error);
    return NextResponse.json({ message: 'Erro ao iniciar devolução' }, { status: 500 });
  }
}
