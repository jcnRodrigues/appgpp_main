import prisma from '../../../../prisma/prisma';
import { extrairCodigoDevolucao, formatarCodigoDevolucao, type DevolucaoCodigoPartes } from '@/features/devolucao/devolucaoCodigo';

export function obterMesAnoAtualSaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    month: '2-digit',
    year: 'numeric'
  }).formatToParts(new Date());

  const mes = Number(parts.find((part) => part.type === 'month')?.value || '1');
  const ano = Number(parts.find((part) => part.type === 'year')?.value || new Date().getFullYear());

  return { mes, ano };
}

export async function obterProximoCodigoDevolucao() {
  const { mes, ano } = obterMesAnoAtualSaoPaulo();
  const ultimo = await prisma.tbDevolucaoProcesso.findFirst({
    where: {
      mesDevolucao: mes,
      anoDevolucao: ano
    },
    orderBy: {
      contadorDevolucao: 'desc'
    },
    select: {
      contadorDevolucao: true
    }
  });

  const contador = (ultimo?.contadorDevolucao || 0) + 1;
  return {
    codigo: formatarCodigoDevolucao({ mes, ano, contador }),
    mes,
    ano,
    contador
  };
}

export async function criarProcessoDevolucao() {
  const proximo = await obterProximoCodigoDevolucao();

  const processo = await prisma.tbDevolucaoProcesso.create({
    data: {
      codigoDevolucao: proximo.codigo,
      mesDevolucao: proximo.mes,
      anoDevolucao: proximo.ano,
      contadorDevolucao: proximo.contador,
      statusDevolucao: 'ABERTO'
    }
  });

  return {
    ...proximo,
    idDevolucaoProcesso: processo.idDevolucaoProcesso
  };
}

export async function obterOuCriarProcessoDevolucaoPorCodigo(codigo?: string | null) {
  const partes = extrairCodigoDevolucao(codigo);
  if (!partes) return null;

  const codigoNormalizado = formatarCodigoDevolucao(partes);
  const existente = await prisma.tbDevolucaoProcesso.findUnique({
    where: {
      codigoDevolucao: codigoNormalizado
    }
  });

  if (existente) return existente;

  return prisma.tbDevolucaoProcesso.create({
    data: {
      codigoDevolucao: codigoNormalizado,
      mesDevolucao: partes.mes,
      anoDevolucao: partes.ano,
      contadorDevolucao: partes.contador,
      statusDevolucao: 'ABERTO'
    }
  });
}

export async function obterProcessoDevolucaoPorCodigo(codigo?: string | null) {
  const partes = extrairCodigoDevolucao(codigo);
  if (!partes) return null;

  return prisma.tbDevolucaoProcesso.findUnique({
    where: {
      codigoDevolucao: formatarCodigoDevolucao(partes)
    }
  });
}

export async function vincularDevolucaoAoProcesso(params: {
  idPatrimonio: string;
  codigoDevolucao?: string | null;
  dataInicioDevolucao: Date;
  dataSaidaFornecedor?: Date | null;
  dataChegadaFornecedor?: Date | null;
  motivoDevolucao?: string | null;
  notaFiscalDevolucao?: string | null;
  idDevolucao?: string | null;
}) {
  const processo = await obterOuCriarProcessoDevolucaoPorCodigo(params.codigoDevolucao);
  if (!processo) {
    throw new Error('Não foi possível vincular a devolução ao processo.');
  }

  const payload = {
    idDevolucaoProcesso: processo.idDevolucaoProcesso,
    idPatrimonio: params.idPatrimonio,
    dataInicioDevolucao: params.dataInicioDevolucao,
    dataSaidaFornecedor: params.dataSaidaFornecedor ?? params.dataInicioDevolucao,
    dataChegadaFornecedor: params.dataChegadaFornecedor ?? null,
    motivoDevolucao: params.motivoDevolucao || null,
    notaFiscalDevolucao: params.notaFiscalDevolucao || null,
    dataFimDevolucao: null
  };

  if (params.idDevolucao) {
    return prisma.tbDevolucao.update({
      where: { idDevolucao: params.idDevolucao },
      data: payload
    });
  }

  return prisma.tbDevolucao.create({
    data: payload
  });
}

export async function criarLinhaInicialDevolucao(params: {
  idPatrimonio: string;
  codigoDevolucao?: string | null;
  dataInicioDevolucao?: Date;
}) {
  const processo = await obterOuCriarProcessoDevolucaoPorCodigo(params.codigoDevolucao);
  if (!processo) {
    throw new Error('Não foi possível criar a linha inicial da devolução.');
  }

  const existente = await prisma.tbDevolucao.findFirst({
    where: {
      idPatrimonio: params.idPatrimonio,
      idDevolucaoProcesso: processo.idDevolucaoProcesso
    }
  });
  if (existente) {
    return existente;
  }

  return prisma.tbDevolucao.create({
    data: {
      idDevolucaoProcesso: processo.idDevolucaoProcesso,
      idPatrimonio: params.idPatrimonio,
      dataInicioDevolucao: params.dataInicioDevolucao || new Date(),
      dataSaidaFornecedor: params.dataInicioDevolucao || new Date(),
      dataFimDevolucao: null
    }
  });
}

export async function resolverCodigoDevolucaoPersistencia(codigo?: string | null): Promise<DevolucaoCodigoPartes> {
  const partes = extrairCodigoDevolucao(codigo);
  if (partes) return partes;
  const proximo = await obterProximoCodigoDevolucao();
  return {
    mes: proximo.mes,
    ano: proximo.ano,
    contador: proximo.contador
  };
}
