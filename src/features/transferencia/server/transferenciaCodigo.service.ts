import prisma from '../../../../prisma/prisma';
import { extrairCodigoTransferencia, formatarCodigoTransferencia, type TransferenciaCodigoPartes } from '@/features/transferencia/transferenciaCodigo';

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

export async function obterProximoCodigoTransferencia() {
  const { mes, ano } = obterMesAnoAtualSaoPaulo();
  const ultimo = await prisma.tbTransferenciaProcesso.findFirst({
    where: { mesTransferencia: mes, anoTransferencia: ano },
    orderBy: { contadorTransferencia: 'desc' },
    select: { contadorTransferencia: true }
  });

  const contador = (ultimo?.contadorTransferencia || 0) + 1;
  return {
    codigo: formatarCodigoTransferencia({ mes, ano, contador }),
    mes,
    ano,
    contador
  };
}

export async function criarProcessoTransferencia() {
  const proximo = await obterProximoCodigoTransferencia();
  const processo = await prisma.tbTransferenciaProcesso.create({
    data: {
      codigoTransferencia: proximo.codigo,
      mesTransferencia: proximo.mes,
      anoTransferencia: proximo.ano,
      contadorTransferencia: proximo.contador,
      statusTransferencia: 'ABERTO'
    }
  });

  return {
    ...proximo,
    idTransferenciaProcesso: processo.idTransferenciaProcesso
  };
}

export async function obterOuCriarProcessoTransferenciaPorCodigo(codigo?: string | null) {
  const partes = extrairCodigoTransferencia(codigo);
  if (!partes) return null;

  const codigoNormalizado = formatarCodigoTransferencia(partes);
  const existente = await prisma.tbTransferenciaProcesso.findUnique({
    where: { codigoTransferencia: codigoNormalizado }
  });

  if (existente) return existente;

  return prisma.tbTransferenciaProcesso.create({
    data: {
      codigoTransferencia: codigoNormalizado,
      mesTransferencia: partes.mes,
      anoTransferencia: partes.ano,
      contadorTransferencia: partes.contador,
      statusTransferencia: 'ABERTO'
    }
  });
}

export async function obterProcessoTransferenciaPorCodigo(codigo?: string | null) {
  const partes = extrairCodigoTransferencia(codigo);
  if (!partes) return null;

  return prisma.tbTransferenciaProcesso.findUnique({
    where: { codigoTransferencia: formatarCodigoTransferencia(partes) }
  });
}

export async function resolverCodigoTransferenciaPersistencia(codigo?: string | null): Promise<TransferenciaCodigoPartes> {
  const partes = extrairCodigoTransferencia(codigo);
  if (partes) return partes;
  const proximo = await obterProximoCodigoTransferencia();
  return { mes: proximo.mes, ano: proximo.ano, contador: proximo.contador };
}
