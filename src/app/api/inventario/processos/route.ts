import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { obterProximoCodigoInventario } from '@/features/inventario/server/inventarioCodigo.service';

type InventarioResumo = {
  codigoInventario: string;
  statusInventario: 'ABERTO' | 'FECHADO';
  dataInventario: string | null;
  dataFechamento: string | null;
  idCCusto: string | null;
  codigoCCusto: string;
  descricaoCCusto: string;
  responsavelInventario: string | null;
  criadoPorInventario: string | null;
  localInventario: string | null;
  totalItens: number;
  conferidos: number;
  divergentes: number;
  naoEncontrados: number;
  avariados: number;
  naoInventariados: number;
  updatedAt: string | null;
};

function formatarDataIso(value?: Date | string | null) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

async function resolverIdUserInventario(idUserInventario?: string | null) {
  const idNormalizado = String(idUserInventario || '').trim();
  if (!idNormalizado) return null;

  const usuario = await prisma.tbUser.findUnique({
    where: { id: idNormalizado },
    select: { id: true }
  });

  return usuario?.id ?? null;
}

function calcularResumoItens(resumoJson: unknown, itensJson: unknown) {
  const resumo = typeof resumoJson === 'object' && resumoJson && !Array.isArray(resumoJson) ? (resumoJson as Record<string, unknown>) : null;
  const itens = Array.isArray(itensJson) ? itensJson : [];

  const totalItens = Number(resumo?.total ?? itens.length ?? 0) || itens.length || 0;
  const conferidos = Number(resumo?.conferidos ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'CONFERIDO').length) || 0;
  const divergentes = Number(resumo?.divergentes ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'DIVERGENTE').length) || 0;
  const naoEncontrados = Number(resumo?.naoEncontrados ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'NAO_ENCONTRADO').length) || 0;
  const avariados = Number(resumo?.avariados ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'AVARIADO').length) || 0;
  const naoInventariados = Number(resumo?.naoInventariados ?? itens.filter((item) => String((item as Record<string, unknown>).statusConferencia || '').toUpperCase() === 'NAO_INVENTARIADO').length) || 0;

  return {
    totalItens,
    conferidos,
    divergentes,
    naoEncontrados,
    avariados,
    naoInventariados
  };
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'INVENTARIO');
  const canPrint = await hasActionPermissionForRequest(request, 'PRINT');
  if (!canAccess || !canPrint) {
    return NextResponse.json({ message: 'Sem permissão para acessar inventários' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFiltro = searchParams.get('status');
    const statusNormalizado = statusFiltro === 'FECHADO' ? 'FECHADO' : statusFiltro === 'ABERTO' ? 'ABERTO' : null;

    const processos = await prisma.tbInventarioProcesso.findMany({
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
            nomeUser: true,
            emailUser: true
          }
        }
      },
      orderBy: [
        { anoInventario: 'desc' },
        { mesInventario: 'desc' },
        { contadorInventario: 'desc' }
      ]
    });

    const processosResumo = processos
      .map((processo): InventarioResumo => {
        const resumo = calcularResumoItens(processo.resumoJson, processo.itensJson);
        return {
          codigoInventario: processo.codigoInventario,
          statusInventario: processo.statusInventario === 'FECHADO' ? 'FECHADO' : 'ABERTO',
          dataInventario: formatarDataIso(processo.dataInventario),
          dataFechamento: formatarDataIso(processo.dataFechamento),
          idCCusto: processo.idCCusto,
          codigoCCusto: processo.codigoCCusto || processo.tbCCusto?.codigoCCusto || '',
          descricaoCCusto: processo.descricaoCCusto || processo.tbCCusto?.descricaoCCusto || 'Inventário de patrimônio',
          responsavelInventario: processo.responsavelInventario || null,
          criadoPorInventario: processo.tbUser?.nomeUser || processo.tbUser?.emailUser || null,
          localInventario: processo.localInventario || null,
          totalItens: resumo.totalItens,
          conferidos: resumo.conferidos,
          divergentes: resumo.divergentes,
          naoEncontrados: resumo.naoEncontrados,
          avariados: resumo.avariados,
          naoInventariados: resumo.naoInventariados,
          updatedAt: formatarDataIso(processo.updatedAt)
        };
      })
      .filter((processo) => !statusNormalizado || processo.statusInventario === statusNormalizado);

    return NextResponse.json({
      data: processosResumo,
      total: processosResumo.length
    });
  } catch (error) {
    console.error('Erro ao listar inventários:', error);
    return NextResponse.json({ message: 'Erro ao listar inventários' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'INVENTARIO');
  const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
  if (!canAccess || !canCreate) {
    return NextResponse.json({ message: 'Sem permissão para iniciar inventário' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const codigoSolicitado = String(body?.codigoInventario || '').trim().toUpperCase();
    const codigoCCusto = String(body?.codigoCCusto || '').trim() || null;
    const descricaoCCusto = String(body?.descricaoCCusto || '').trim() || null;
    const idCCusto = String(body?.idCCusto || '').trim() || null;

    if (codigoSolicitado) {
      const processoExistente = await prisma.tbInventarioProcesso.findUnique({
        where: { codigoInventario: codigoSolicitado }
      });
      if (processoExistente) {
        return NextResponse.json({
          codigo: processoExistente.codigoInventario,
          idInventarioProcesso: processoExistente.idInventarioProcesso,
          created: false
        });
      }
    }

    const proximo = await obterProximoCodigoInventario();
    const idUserInventario = await resolverIdUserInventario(body?.idUserInventario);

    const processo = await prisma.tbInventarioProcesso.create({
      data: {
        codigoInventario: codigoSolicitado || proximo.codigo,
        mesInventario: codigoSolicitado ? Number(codigoSolicitado.slice(3, 5)) : proximo.mes,
        anoInventario: codigoSolicitado ? Number(codigoSolicitado.slice(5, 9)) : proximo.ano,
        contadorInventario: codigoSolicitado ? Number(codigoSolicitado.slice(10, 13)) : proximo.contador,
        idCCusto,
        codigoCCusto,
        descricaoCCusto,
        dataInventario: body?.dataInventario ? new Date(String(body.dataInventario)) : new Date(),
        statusInventario: String(body?.statusInventario || 'ABERTO').toUpperCase() === 'FECHADO' ? 'FECHADO' : 'ABERTO',
        responsavelInventario: String(body?.responsavelInventario || '').trim() || null,
        localInventario: String(body?.localInventario || '').trim() || null,
        observacaoInventario: String(body?.observacaoInventario || '').trim() || null,
        resumoJson: body?.resumoJson ?? null,
        itensJson: body?.itensJson ?? null,
        idUserInventario
      }
    });

    return NextResponse.json({
      codigo: processo.codigoInventario,
      idInventarioProcesso: processo.idInventarioProcesso,
      created: true
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao iniciar inventário:', error);
    return NextResponse.json({ message: 'Erro ao iniciar inventário' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'INVENTARIO');
  const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
  if (!canAccess || !canUpdate) {
    return NextResponse.json({ message: 'Sem permissão para atualizar inventário' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const codigoInventario = String(body?.codigoInventario || '').trim().toUpperCase();
    if (!codigoInventario) {
      return NextResponse.json({ message: 'codigoInventario é obrigatório.' }, { status: 400 });
    }

    const existente = await prisma.tbInventarioProcesso.findUnique({
      where: { codigoInventario }
    });

    if (!existente) {
      return NextResponse.json({ message: 'Inventário não encontrado.' }, { status: 404 });
    }

    const dataFechamento = body?.dataFechamento ? new Date(String(body.dataFechamento)) : existente.dataFechamento;
    const statusInventario = String(body?.statusInventario || existente.statusInventario || 'ABERTO').trim().toUpperCase() === 'FECHADO'
      ? 'FECHADO'
      : 'ABERTO';
    const idUserInventario = await resolverIdUserInventario(
      String(body?.idUserInventario || existente.idUserInventario || '').trim()
    );

    const processo = await prisma.tbInventarioProcesso.update({
      where: { codigoInventario },
      data: {
        idCCusto: String(body?.idCCusto || existente.idCCusto || '').trim() || null,
        codigoCCusto: String(body?.codigoCCusto || existente.codigoCCusto || '').trim() || null,
        descricaoCCusto: String(body?.descricaoCCusto || existente.descricaoCCusto || '').trim() || null,
        dataInventario: body?.dataInventario ? new Date(String(body.dataInventario)) : existente.dataInventario,
        dataFechamento: Number.isNaN(dataFechamento?.getTime?.() || NaN) ? existente.dataFechamento : dataFechamento,
        statusInventario,
        responsavelInventario: String(body?.responsavelInventario || existente.responsavelInventario || '').trim() || null,
        localInventario: String(body?.localInventario || existente.localInventario || '').trim() || null,
        observacaoInventario: String(body?.observacaoInventario || existente.observacaoInventario || '').trim() || null,
        resumoJson: body?.resumoJson ?? existente.resumoJson,
        itensJson: body?.itensJson ?? existente.itensJson,
        idUserInventario
      }
    });

    return NextResponse.json({
      codigo: processo.codigoInventario,
      idInventarioProcesso: processo.idInventarioProcesso,
      updated: true
    });
  } catch (error) {
    console.error('Erro ao atualizar inventário:', error);
    return NextResponse.json({ message: 'Erro ao atualizar inventário' }, { status: 500 });
  }
}
