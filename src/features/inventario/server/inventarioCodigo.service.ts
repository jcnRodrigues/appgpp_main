import prisma from '../../../../prisma/prisma';
import { extrairCodigoInventario, formatarCodigoInventario, type InventarioCodigoPartes } from '@/lib/inventarioCodigo';

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

export async function obterProximoCodigoInventario() {
  const { mes, ano } = obterMesAnoAtualSaoPaulo();
  const ultimo = await prisma.tbInventarioProcesso.findFirst({
    where: {
      mesInventario: mes,
      anoInventario: ano
    },
    orderBy: {
      contadorInventario: 'desc'
    },
    select: {
      contadorInventario: true
    }
  });

  const contador = (ultimo?.contadorInventario || 0) + 1;
  return {
    codigo: formatarCodigoInventario({ mes, ano, contador }),
    mes,
    ano,
    contador
  };
}

export async function criarProcessoInventario() {
  const proximo = await obterProximoCodigoInventario();

  const processo = await prisma.tbInventarioProcesso.create({
    data: {
      codigoInventario: proximo.codigo,
      mesInventario: proximo.mes,
      anoInventario: proximo.ano,
      contadorInventario: proximo.contador,
      statusInventario: 'ABERTO',
      dataInventario: new Date()
    }
  });

  return {
    ...proximo,
    idInventarioProcesso: processo.idInventarioProcesso
  };
}

export async function obterOuCriarProcessoInventarioPorCodigo(codigo?: string | null) {
  const partes = extrairCodigoInventario(codigo);
  if (!partes) return null;

  const codigoNormalizado = formatarCodigoInventario(partes);
  const existente = await prisma.tbInventarioProcesso.findUnique({
    where: {
      codigoInventario: codigoNormalizado
    }
  });

  if (existente) return existente;

  return prisma.tbInventarioProcesso.create({
    data: {
      codigoInventario: codigoNormalizado,
      mesInventario: partes.mes,
      anoInventario: partes.ano,
      contadorInventario: partes.contador,
      statusInventario: 'ABERTO',
      dataInventario: new Date()
    }
  });
}

export async function obterProcessoInventarioPorCodigo(codigo?: string | null) {
  const partes = extrairCodigoInventario(codigo);
  if (!partes) return null;

  return prisma.tbInventarioProcesso.findUnique({
    where: {
      codigoInventario: formatarCodigoInventario(partes)
    }
  });
}

export async function resolverCodigoInventarioPersistencia(codigo?: string | null): Promise<InventarioCodigoPartes> {
  const partes = extrairCodigoInventario(codigo);
  if (partes) return partes;
  const proximo = await obterProximoCodigoInventario();
  return {
    mes: proximo.mes,
    ano: proximo.ano,
    contador: proximo.contador
  };
}
