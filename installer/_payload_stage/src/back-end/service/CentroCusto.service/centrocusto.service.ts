import prisma from "../../../../prisma/prisma";

function buildCentroCustoWhere(filtro?: {
    descricao?: string;
    codigo?: string;
    ids?: string[];
}) {
    return {
        ...(filtro?.descricao && {
            descricaoCCusto: {
                contains: filtro.descricao
            }
        }),
        ...(filtro?.codigo && {
            codigoCCusto: {
                contains: filtro.codigo
            }
        }),
        ...(filtro?.ids && filtro.ids.length > 0 && {
            idCCusto: {
                in: filtro.ids
            }
        })
    };
}

export async function listarCentrosCusto(filtro?: {
    descricao?: string;
    codigo?: string;
    ids?: string[];
    skip?: number;
    take?: number;
}) {
    return await prisma.tbCCusto.findMany({
        where: buildCentroCustoWhere(filtro),
        include: {
            tbEmpresa: true
        },
        skip: filtro?.skip || 0,
        take: filtro?.take || 100,
        orderBy: {
            descricaoCCusto: 'asc'
        }
    });
}

export async function contarCentrosCusto(filtro?: {
    descricao?: string;
    codigo?: string;
    ids?: string[];
}) {
    return await prisma.tbCCusto.count({
        where: buildCentroCustoWhere(filtro)
    });
}

export async function getCentroCustoById(id: string) {
    return await prisma.tbCCusto.findUnique({
        where: { idCCusto: id },
        include: { tbEmpresa: true }
    });
}

export async function criarCentroCusto(dados: {
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    idEmp_Custo?: string | null;
}) {
    return await prisma.tbCCusto.create({
        data: {
            codigoCCusto: dados.codigoCCusto,
            descricaoCCusto: dados.descricaoCCusto,
            idEmp_Custo: dados.idEmp_Custo
        }
    });
}

export async function atualizarCentroCusto(id: string, dados: Partial<{
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    idEmp_Custo?: string | null;
}>) {
    return await prisma.tbCCusto.update({
        where: { idCCusto: id },
        data: dados
    });
}

export async function deletarCentroCusto(id: string) {
    return await prisma.tbCCusto.delete({ where: { idCCusto: id } });
}

export async function listarEmpresas() {
    return await prisma.tbEmpresa.findMany({ orderBy: { fantasiaEmpresa: 'asc' } });
}

