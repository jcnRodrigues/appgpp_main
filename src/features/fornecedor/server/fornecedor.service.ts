import { randomUUID } from 'crypto';
import prisma from '../../../../prisma/prisma';
import { listarCentrosCustoAtivosEMobilizados } from '@/features/centro-custo/server/centrocusto.service';

function normalizarTexto(valor?: string | null) {
  return (valor || '').trim();
}

function normalizarCnpj(valor?: string | null) {
  const digits = (valor || '').replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
}

function buildFornecedorWhere(filtro?: {
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  centroIds?: string[];
}) {
  const conditions: Record<string, unknown>[] = [];

  if (filtro?.razaoSocial) {
    conditions.push({
      OR: [
        { razaoSocialFornecedor: { contains: filtro.razaoSocial } },
        { nomeFantasiaFornecedor: { contains: filtro.razaoSocial } }
      ]
    });
  }

  if (filtro?.nomeFantasia) {
    conditions.push({
      OR: [
        { nomeFantasiaFornecedor: { contains: filtro.nomeFantasia } },
        { razaoSocialFornecedor: { contains: filtro.nomeFantasia } }
      ]
    });
  }

  if (filtro?.cnpj) {
    conditions.push({
      cnpjFornecedor: {
        contains: normalizarCnpj(filtro.cnpj) || filtro.cnpj
      }
    });
  }

  if (filtro?.centroIds && filtro.centroIds.length > 0) {
    conditions.push({
      tbFornecedorCCusto: {
        some: {
          idCCusto: {
            in: filtro.centroIds
          }
        }
      }
    });
  }

  if (conditions.length === 0) {
    return {};
  }

  return { AND: conditions };
}

function normalizarCentros(centros?: Array<{ idCCusto: string; ehPrincipal?: boolean }>) {
  const lista = Array.isArray(centros) ? centros : [];
  const vistos = new Set<string>();
  const unicos: Array<{ idCCusto: string; ehPrincipal: boolean }> = [];

  for (const item of lista) {
    const idCCusto = normalizarTexto(item?.idCCusto);
    if (!idCCusto || vistos.has(idCCusto)) continue;
    vistos.add(idCCusto);
    unicos.push({
      idCCusto,
      ehPrincipal: Boolean(item?.ehPrincipal)
    });
  }

  if (unicos.length > 0 && !unicos.some((item) => item.ehPrincipal)) {
    unicos[0].ehPrincipal = true;
  }

  return unicos;
}

async function carregarFornecedorComCentros(client: any, idFornecedor: string) {
  return client.tbFornecedor.findUnique({
    where: { idFornecedor },
    include: {
      tbFornecedorCCusto: {
        include: {
          tbCCusto: {
            include: {
              tbEmpresa: true,
              tbStatusCCusto: true
            }
          }
        },
        orderBy: [
          { ehPrincipal: 'desc' },
          { createdAt: 'asc' }
        ]
      }
    }
  });
}

export async function listarFornecedores(filtro?: {
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  centroIds?: string[];
  skip?: number;
  take?: number;
}) {
  return prisma.tbFornecedor.findMany({
    where: buildFornecedorWhere(filtro),
    include: {
      tbFornecedorCCusto: {
        include: {
          tbCCusto: {
            include: {
              tbEmpresa: true,
              tbStatusCCusto: true
            }
          }
        },
        orderBy: [
          { ehPrincipal: 'desc' },
          { createdAt: 'asc' }
        ]
      }
    },
    skip: filtro?.skip || 0,
    take: filtro?.take || 100,
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function contarFornecedores(filtro?: {
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  centroIds?: string[];
}) {
  return prisma.tbFornecedor.count({
    where: buildFornecedorWhere(filtro)
  });
}

export async function getFornecedorById(idFornecedor: string) {
  return carregarFornecedorComCentros(prisma, idFornecedor);
}

export async function listarCentrosFornecedor() {
  return listarCentrosCustoAtivosEMobilizados();
}

export async function criarFornecedor(dados: {
  razaoSocialFornecedor: string;
  nomeFantasiaFornecedor?: string | null;
  cnpjFornecedor?: string | null;
  centros?: Array<{ idCCusto: string; ehPrincipal?: boolean }>;
}) {
  const razaoSocialFornecedor = normalizarTexto(dados.razaoSocialFornecedor);
  if (!razaoSocialFornecedor) {
    throw new Error('Razão social do fornecedor é obrigatória');
  }

  const cnpjFornecedor = normalizarCnpj(dados.cnpjFornecedor);
  if (cnpjFornecedor) {
    const existente = await prisma.tbFornecedor.findUnique({
      where: { cnpjFornecedor }
    });
    if (existente) {
      throw new Error('Já existe um fornecedor com este CNPJ');
    }
  }

  const centros = normalizarCentros(dados.centros);

  return prisma.$transaction(async (tx) => {
    const fornecedor = await tx.tbFornecedor.create({
      data: {
        razaoSocialFornecedor,
        nomeFantasiaFornecedor: normalizarTexto(dados.nomeFantasiaFornecedor) || null,
        cnpjFornecedor,
        updatedAt: new Date()
      }
    });

    if (centros.length > 0) {
      await tx.tbFornecedorCCusto.createMany({
        data: centros.map((centro) => ({
          idFornecedorCCusto: randomUUID(),
          idFornecedor: fornecedor.idFornecedor,
          idCCusto: centro.idCCusto,
          ehPrincipal: centro.ehPrincipal,
          updatedAt: new Date()
        }))
      });
    }

    return carregarFornecedorComCentros(tx, fornecedor.idFornecedor);
  });
}

export async function atualizarFornecedor(
  idFornecedor: string,
  dados: Partial<{
    razaoSocialFornecedor: string;
    nomeFantasiaFornecedor: string | null;
    cnpjFornecedor: string | null;
    centros: Array<{ idCCusto: string; ehPrincipal?: boolean }>;
  }>
) {
  const razaoSocialFornecedor = Object.prototype.hasOwnProperty.call(dados, 'razaoSocialFornecedor')
    ? normalizarTexto(dados.razaoSocialFornecedor)
    : undefined;
  const nomeFantasiaFornecedor = Object.prototype.hasOwnProperty.call(dados, 'nomeFantasiaFornecedor')
    ? normalizarTexto(dados.nomeFantasiaFornecedor)
    : undefined;
  const cnpjFornecedor = Object.prototype.hasOwnProperty.call(dados, 'cnpjFornecedor')
    ? normalizarCnpj(dados.cnpjFornecedor)
    : undefined;

  if (cnpjFornecedor) {
    const existente = await prisma.tbFornecedor.findFirst({
      where: {
        cnpjFornecedor,
        NOT: {
          idFornecedor
        }
      }
    });

    if (existente) {
      throw new Error('Já existe um fornecedor com este CNPJ');
    }
  }

  const centros = Object.prototype.hasOwnProperty.call(dados, 'centros')
    ? normalizarCentros(dados.centros)
    : null;

  return prisma.$transaction(async (tx) => {
    const fornecedor = await tx.tbFornecedor.update({
      where: { idFornecedor },
      data: {
        ...(razaoSocialFornecedor !== undefined ? { razaoSocialFornecedor } : {}),
        ...(nomeFantasiaFornecedor !== undefined ? { nomeFantasiaFornecedor: nomeFantasiaFornecedor || null } : {}),
        ...(cnpjFornecedor !== undefined ? { cnpjFornecedor } : {}),
        updatedAt: new Date()
      }
    });

    if (centros) {
      await tx.tbFornecedorCCusto.deleteMany({
        where: { idFornecedor }
      });

      if (centros.length > 0) {
        await tx.tbFornecedorCCusto.createMany({
          data: centros.map((centro) => ({
            idFornecedorCCusto: randomUUID(),
            idFornecedor: fornecedor.idFornecedor,
            idCCusto: centro.idCCusto,
            ehPrincipal: centro.ehPrincipal,
            updatedAt: new Date()
          }))
        });
      }
    }

    return carregarFornecedorComCentros(tx, fornecedor.idFornecedor);
  });
}

export async function deletarFornecedor(idFornecedor: string) {
  return prisma.tbFornecedor.delete({
    where: { idFornecedor }
  });
}
