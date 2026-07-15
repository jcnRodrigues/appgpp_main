import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { criarLinhaInicialDevolucao, obterOuCriarProcessoDevolucaoPorCodigo } from '@/features/devolucao/server/devolucaoCodigo.service';

function normalizarTexto(valor: unknown) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function parseDateOrNull(valor: unknown) {
  const texto = normalizarTexto(valor);
  if (!texto) return null;
  const data = new Date(texto);
  return Number.isNaN(data.getTime()) ? null : data;
}

async function validarAcesso(request: NextRequest, action: 'CREATE' | 'DELETE' | 'UPDATE') {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canAction = await hasActionPermissionForRequest(request, action);
  return canAccess && canAction;
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  if (!canAccess) {
    return NextResponse.json({ message: 'Sem permissÃ£o para visualizar linha de devoluÃ§Ã£o' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const codigoDevolucao = normalizarTexto(searchParams.get('codigoDevolucao')).toUpperCase();
    const idPatrimonio = normalizarTexto(searchParams.get('idPatrimonio'));

    if (!codigoDevolucao || !idPatrimonio) {
      return NextResponse.json({ message: 'codigoDevolucao e idPatrimonio sÃ£o obrigatÃ³rios.' }, { status: 400 });
    }

    const processo = await obterOuCriarProcessoDevolucaoPorCodigo(codigoDevolucao);
    if (!processo) {
      return NextResponse.json({ message: 'Processo de devoluÃ§Ã£o nÃ£o encontrado.' }, { status: 404 });
    }

    const linha = await prisma.tbDevolucao.findFirst({
      where: {
        idPatrimonio,
        idDevolucaoProcesso: processo.idDevolucaoProcesso
      },
      include: {
        tbPatrimonio: {
          select: {
            idP: true,
            idPat: true,
            descricaoPat: true,
            valorPat: true,
            dataEntPat: true,
            dataSaiPat: true,
            tbTipoPat: { select: { descricaoTipPat: true } },
            tbStatusPat: { select: { descricaoStatPat: true } },
            tbCCusto: { select: { descricaoCCusto: true } }
          }
        }
      }
    });

    if (!linha) {
      return NextResponse.json({ message: 'Linha de devoluÃ§Ã£o nÃ£o encontrada.' }, { status: 404 });
    }

    return NextResponse.json({
      idDevolucao: linha.idDevolucao,
      idPatrimonio: linha.idPatrimonio,
      idDevolucaoProcesso: linha.idDevolucaoProcesso,
      dataInicioDevolucao: linha.dataInicioDevolucao,
      dataFimDevolucao: linha.dataFimDevolucao,
      dataSaidaFornecedor: linha.dataSaidaFornecedor,
      dataChegadaFornecedor: linha.dataChegadaFornecedor,
      motivoDevolucao: linha.motivoDevolucao,
      notaFiscalDevolucao: linha.notaFiscalDevolucao,
      patrimonio: linha.tbPatrimonio
    });
  } catch (error) {
    console.error('Erro ao carregar linha de devoluÃ§Ã£o:', error);
    return NextResponse.json({ message: 'Erro ao carregar linha de devoluÃ§Ã£o' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const canAccess = await validarAcesso(request, 'CREATE');
  if (!canAccess) {
    return NextResponse.json({ message: 'Sem permissÃ£o para adicionar linha de devoluÃ§Ã£o' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const idPatrimonio = normalizarTexto(body?.idPatrimonio);
    const codigoDevolucao = normalizarTexto(body?.codigoDevolucao).toUpperCase();

    if (!idPatrimonio || !codigoDevolucao) {
      return NextResponse.json({ message: 'idPatrimonio e codigoDevolucao sÃ£o obrigatÃ³rios.' }, { status: 400 });
    }

    const linha = await criarLinhaInicialDevolucao({
      idPatrimonio,
      codigoDevolucao
    });

    return NextResponse.json({
      idDevolucao: linha.idDevolucao,
      idPatrimonio: linha.idPatrimonio,
      idDevolucaoProcesso: linha.idDevolucaoProcesso,
      dataInicioDevolucao: linha.dataInicioDevolucao,
      dataSaidaFornecedor: linha.dataSaidaFornecedor,
      dataChegadaFornecedor: linha.dataChegadaFornecedor,
      motivoDevolucao: linha.motivoDevolucao,
      notaFiscalDevolucao: linha.notaFiscalDevolucao
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar linha de devoluÃ§Ã£o:', error);
    return NextResponse.json({ message: 'Erro ao criar linha de devoluÃ§Ã£o' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const canAccess = await validarAcesso(request, 'UPDATE');
  if (!canAccess) {
    return NextResponse.json({ message: 'Sem permissÃ£o para atualizar linha de devoluÃ§Ã£o' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const idPatrimonio = normalizarTexto(body?.idPatrimonio);
    const codigoDevolucao = normalizarTexto(body?.codigoDevolucao).toUpperCase();
    if (!idPatrimonio || !codigoDevolucao) {
      return NextResponse.json({ message: 'idPatrimonio e codigoDevolucao sÃ£o obrigatÃ³rios.' }, { status: 400 });
    }

    const processo = await obterOuCriarProcessoDevolucaoPorCodigo(codigoDevolucao);
    if (!processo) {
      return NextResponse.json({ message: 'Processo de devoluÃ§Ã£o nÃ£o encontrado.' }, { status: 404 });
    }

    const statusDevolvido = await prisma.tbStatusPat.findFirst({
      where: {
        descricaoStatPat: {
          contains: 'devolu'
        }
      },
      select: {
        idStatusPat: true,
        descricaoStatPat: true
      }
    }) || await prisma.tbStatusPat.findMany({
      select: {
        idStatusPat: true,
        descricaoStatPat: true
      }
    }).then((statusList) => statusList.find((status) => normalizarTexto(status.descricaoStatPat).includes('DEVOLU')) || null);

    if (!statusDevolvido) {
      return NextResponse.json({ message: 'Status de devoluÃ§Ã£o nÃ£o encontrado na base.' }, { status: 404 });
    }

    const dataSaidaFornecedor = parseDateOrNull(body?.dataSaidaFornecedor);
    const dataChegadaFornecedor = parseDateOrNull(body?.dataChegadaFornecedor);
    const dataFimDevolucao = dataChegadaFornecedor || parseDateOrNull(body?.dataFimDevolucao) || null;
    const dataInicioDevolucao = parseDateOrNull(body?.dataInicioDevolucao) || dataSaidaFornecedor || new Date();
    const motivoDevolucao = normalizarTexto(body?.motivoDevolucao).toUpperCase() || null;
    const notaFiscalDevolucao = normalizarTexto(body?.notaFiscalDevolucao).toUpperCase() || null;

    const resultado = await prisma.$transaction(async (tx) => {
      const existente = await tx.tbDevolucao.findFirst({
        where: {
          idPatrimonio,
          idDevolucaoProcesso: processo.idDevolucaoProcesso
        }
      });

      const payload = {
        idDevolucaoProcesso: processo.idDevolucaoProcesso,
        idPatrimonio,
        dataInicioDevolucao,
        dataSaidaFornecedor: dataSaidaFornecedor || dataInicioDevolucao,
        dataChegadaFornecedor: dataChegadaFornecedor || existente?.dataChegadaFornecedor || dataFimDevolucao,
        motivoDevolucao,
        notaFiscalDevolucao,
        dataFimDevolucao: dataFimDevolucao || existente?.dataFimDevolucao || null
      };

      const linha = existente
        ? await tx.tbDevolucao.update({
            where: { idDevolucao: existente.idDevolucao },
            data: payload
          })
        : await tx.tbDevolucao.create({ data: payload });

      const linhasProcesso = await tx.tbDevolucao.findMany({
        where: {
          idDevolucaoProcesso: processo.idDevolucaoProcesso
        },
        select: {
          dataChegadaFornecedor: true
        }
      });

      const todasLinhasComChegada = linhasProcesso.length > 0 && linhasProcesso.every((item) => Boolean(item.dataChegadaFornecedor));

      const processoAtualizado = todasLinhasComChegada
        ? await tx.tbDevolucaoProcesso.update({
            where: { idDevolucaoProcesso: processo.idDevolucaoProcesso },
            data: {
              statusDevolucao: 'FECHADO',
              dataFechamento: new Date()
            }
          })
        : processo;

      await tx.tbPatrimonio.update({
        where: { idP: idPatrimonio },
        data: {
          idPat_StatusPat: statusDevolvido.idStatusPat
        }
      });

      return {
        linha,
        processo: processoAtualizado
      };
    });

    return NextResponse.json({
      idDevolucao: resultado.linha.idDevolucao,
      idPatrimonio: resultado.linha.idPatrimonio,
      idDevolucaoProcesso: resultado.linha.idDevolucaoProcesso,
      dataInicioDevolucao: resultado.linha.dataInicioDevolucao,
      dataFimDevolucao: resultado.linha.dataFimDevolucao,
      dataSaidaFornecedor: resultado.linha.dataSaidaFornecedor,
      dataChegadaFornecedor: resultado.linha.dataChegadaFornecedor,
      motivoDevolucao: resultado.linha.motivoDevolucao,
      notaFiscalDevolucao: resultado.linha.notaFiscalDevolucao,
      statusPatrimonio: 'DEVOLUÇÃO',
      statusPatrimonioDescricao: statusDevolvido.descricaoStatPat,
      statusDevolucao: resultado.processo.statusDevolucao,
      dataFechamento: resultado.processo.dataFechamento
    });
  } catch (error) {
    console.error('Erro ao atualizar linha de devoluÃ§Ã£o:', error);
    return NextResponse.json({ message: 'Erro ao atualizar linha de devoluÃ§Ã£o' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const canAccess = await validarAcesso(request, 'DELETE');
  if (!canAccess) {
    return NextResponse.json({ message: 'Sem permissÃ£o para remover linha de devoluÃ§Ã£o' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const idPatrimonio = normalizarTexto(body?.idPatrimonio);
    const codigoDevolucao = normalizarTexto(body?.codigoDevolucao).toUpperCase();

    if (!idPatrimonio || !codigoDevolucao) {
      return NextResponse.json({ message: 'idPatrimonio e codigoDevolucao sÃ£o obrigatÃ³rios.' }, { status: 400 });
    }

    const processo = await prisma.tbDevolucaoProcesso.findUnique({
      where: { codigoDevolucao }
    });

    if (!processo) {
      return NextResponse.json({ message: 'Processo de devoluÃ§Ã£o nÃ£o encontrado.' }, { status: 404 });
    }

    const resultado = await prisma.tbDevolucao.deleteMany({
      where: {
        idPatrimonio,
        idDevolucaoProcesso: processo.idDevolucaoProcesso
      }
    });

    return NextResponse.json({
      deleted: resultado.count
    });
  } catch (error) {
    console.error('Erro ao remover linha de devoluÃ§Ã£o:', error);
    return NextResponse.json({ message: 'Erro ao remover linha de devoluÃ§Ã£o' }, { status: 500 });
  }
}
