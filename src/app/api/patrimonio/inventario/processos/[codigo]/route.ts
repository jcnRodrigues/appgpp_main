import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

function formatarDataIso(value?: Date | string | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function calcularResumoItens(resumoJson: unknown, itensJson: unknown) {
  const resumo = typeof resumoJson === 'object' && resumoJson && !Array.isArray(resumoJson) ? (resumoJson as Record<string, unknown>) : null;
  const itens = Array.isArray(itensJson) ? itensJson : [];

  return {
    totalItens: Number(resumo?.total ?? itens.length ?? 0) || itens.length || 0,
    conferidos: Number(resumo?.conferidos ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'CONFERIDO').length) || 0,
    divergentes: Number(resumo?.divergentes ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'DIVERGENTE').length) || 0,
    naoEncontrados: Number(resumo?.naoEncontrados ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'NAO_ENCONTRADO').length) || 0,
    avariados: Number(resumo?.avariados ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'AVARIADO').length) || 0,
    naoInventariados: Number(resumo?.naoInventariados ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'NAO_INVENTARIADO').length) || 0
  };
}

export async function GET(request: NextRequest, context: { params: Promise<{ codigo: string }> }) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canPrint = await hasActionPermissionForRequest(request, 'PRINT');
  if (!canAccess || !canPrint) {
    return NextResponse.json({ message: 'Sem permissão para visualizar inventário' }, { status: 403 });
  }

  try {
    const { codigo } = await context.params;
    const codigoNormalizado = String(codigo || '').trim().toUpperCase();
    if (!codigoNormalizado) {
      return NextResponse.json({ message: 'Código do inventário é obrigatório.' }, { status: 400 });
    }

    const processo = await prisma.tbInventarioProcesso.findUnique({
      where: { codigoInventario: codigoNormalizado },
      include: {
        tbCCusto: {
          select: {
            idCCusto: true,
            codigoCCusto: true,
            descricaoCCusto: true
          }
        },
        tbUser: {
          select: {
            id: true,
            nomeUser: true,
            emailUser: true
          }
        }
      }
    });

    if (!processo) {
      return NextResponse.json({ message: 'Inventário não encontrado.' }, { status: 404 });
    }

    const resumo = calcularResumoItens(processo.resumoJson, processo.itensJson);

    return NextResponse.json({
      idInventarioProcesso: processo.idInventarioProcesso,
      codigoInventario: processo.codigoInventario,
      statusInventario: processo.statusInventario === 'FECHADO' ? 'FECHADO' : 'ABERTO',
      dataInventario: formatarDataIso(processo.dataInventario),
      dataFechamento: formatarDataIso(processo.dataFechamento),
      idCCusto: processo.idCCusto,
      codigoCCusto: processo.codigoCCusto || processo.tbCCusto?.codigoCCusto || '',
      descricaoCCusto: processo.descricaoCCusto || processo.tbCCusto?.descricaoCCusto || '',
      responsavelInventario: processo.responsavelInventario || processo.tbUser?.nomeUser || processo.tbUser?.emailUser || null,
      localInventario: processo.localInventario || null,
      observacaoInventario: processo.observacaoInventario || null,
      resumoJson: processo.resumoJson,
      itensJson: processo.itensJson,
      ...resumo,
      updatedAt: formatarDataIso(processo.updatedAt)
    });
  } catch (error) {
    console.error('Erro ao carregar inventário:', error);
    return NextResponse.json({ message: 'Erro ao carregar inventário' }, { status: 500 });
  }
}
