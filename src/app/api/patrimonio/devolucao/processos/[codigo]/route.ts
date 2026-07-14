import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { obterProcessoDevolucaoPorCodigo } from '@/features/devolucao/server/devolucaoCodigo.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canPrint = await hasActionPermissionForRequest(request, 'PRINT');
  if (!canAccess || !canPrint) {
    return NextResponse.json({ message: 'Sem permissão para acessar processo de devolução' }, { status: 403 });
  }

  try {
    const { codigo } = await params;
    const codigoNormalizado = String(codigo || '').trim().toUpperCase();
    if (!codigoNormalizado) {
      return NextResponse.json({ message: 'Código de devolução inválido.' }, { status: 400 });
    }

    const processo = await obterProcessoDevolucaoPorCodigo(codigoNormalizado);
    if (!processo) {
      return NextResponse.json({ message: 'Processo de devolução não encontrado.' }, { status: 404 });
    }

    const devolucoes = await prisma.tbDevolucao.findMany({
      where: {
        idDevolucaoProcesso: processo.idDevolucaoProcesso
      },
      select: {
        idDevolucao: true,
        idDevolucaoProcesso: true,
        dataInicioDevolucao: true,
        dataFimDevolucao: true,
        updatedAt: true,
        motivoDevolucao: true,
        notaFiscalDevolucao: true,
        dataSaidaFornecedor: true,
        dataChegadaFornecedor: true,
        tbPatrimonio: {
          select: {
            idP: true,
            idPat: true,
            descricaoPat: true,
            valorPat: true,
            dataEntPat: true,
            dataSaiPat: true,
            tbTipoPat: {
              select: {
                descricaoTipPat: true
              }
            },
            tbStatusPat: {
              select: {
                descricaoStatPat: true
              }
            },
            tbCCusto: {
              select: {
                descricaoCCusto: true
              }
            }
          }
        }
      },
      orderBy: {
        dataInicioDevolucao: 'asc'
      }
    });

    const itens = devolucoes.map((item) => ({
      idP: item.tbPatrimonio.idP,
      idPat: item.tbPatrimonio.idPat,
      descricaoPat: item.tbPatrimonio.descricaoPat,
      valorPat: item.tbPatrimonio.valorPat,
      dataEntPat: item.tbPatrimonio.dataEntPat ? new Date(item.tbPatrimonio.dataEntPat).toISOString() : null,
      dataSaiPat: item.dataFimDevolucao ? new Date(item.dataFimDevolucao).toISOString() : item.tbPatrimonio.dataSaiPat ? new Date(item.tbPatrimonio.dataSaiPat).toISOString() : null,
      idDevolucao: item.idDevolucao,
      idDevolucaoProcesso: item.idDevolucaoProcesso,
      dataInicioDevolucao: item.dataInicioDevolucao ? new Date(item.dataInicioDevolucao).toISOString() : null,
      dataFimDevolucao: item.dataFimDevolucao ? new Date(item.dataFimDevolucao).toISOString() : null,
      dataSaidaFornecedor: item.dataSaidaFornecedor ? new Date(item.dataSaidaFornecedor).toISOString() : null,
      dataChegadaFornecedor: item.dataChegadaFornecedor ? new Date(item.dataChegadaFornecedor).toISOString() : null,
      motivoDevolucao: item.motivoDevolucao,
      notaFiscalDevolucao: item.notaFiscalDevolucao,
      tbTipoPat: item.tbPatrimonio.tbTipoPat,
      tbStatusPat: item.tbPatrimonio.tbStatusPat,
      tbCCusto: item.tbPatrimonio.tbCCusto
    }));

    const centroPrincipal = devolucoes[0]?.tbPatrimonio?.tbCCusto || null;

    return NextResponse.json({
      codigoDevolucao: codigoNormalizado,
      idDevolucaoProcesso: processo.idDevolucaoProcesso,
      processo: {
        statusDevolucao: processo.statusDevolucao,
        dataInicio: processo.dataInicio,
        dataFechamento: processo.dataFechamento,
        updatedAt: processo.updatedAt
      },
      total: devolucoes.length,
      itens,
      resumo: {
        centroCustoDescricao: centroPrincipal?.descricaoCCusto || 'Sem centro de custo'
      }
    });
  } catch (error) {
    console.error('Erro ao carregar processo de devolução:', error);
    return NextResponse.json({ message: 'Erro ao carregar processo de devolução' }, { status: 500 });
  }
}
