import prisma from "../../../../prisma/prisma";

const STATUS_CENTRO_VISIVEL = ['ATIVO', 'MOBILIZADO'];

function buildCentroCustoWhere(filtro?: {
    descricao?: string;
    codigo?: string;
    statusId?: string;
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
        ...(filtro?.statusId && {
            idStatusCCusto: filtro.statusId
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
    statusId?: string;
    ids?: string[];
    skip?: number;
    take?: number;
}) {
    return await prisma.tbCCusto.findMany({
        where: buildCentroCustoWhere(filtro),
        include: {
            tbEmpresa: true,
            tbStatusCCusto: true
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
    statusId?: string;
    ids?: string[];
}) {
    return await prisma.tbCCusto.count({
        where: buildCentroCustoWhere(filtro)
    });
}

export async function getCentroCustoById(id: string) {
    return await prisma.tbCCusto.findUnique({
        where: { idCCusto: id },
        include: { tbEmpresa: true, tbStatusCCusto: true }
    });
}

export async function listarStatusCentroCusto() {
    return await prisma.tbStatusCCusto.findMany({
        orderBy: {
            descricaoStatusCCusto: 'asc'
        }
    });
}

export async function garantirStatusCentroCusto(descricao: string) {
    const descricaoNormalizada = descricao.trim().toUpperCase();
    if (!descricaoNormalizada) {
        throw new Error('Descricao do status e obrigatoria');
    }

    return await prisma.tbStatusCCusto.upsert({
        where: {
            descricaoStatusCCusto: descricaoNormalizada
        },
        update: {},
        create: {
            descricaoStatusCCusto: descricaoNormalizada
        }
    });
}

export async function garantirStatusPadraoCentroCusto() {
    const statusPadrao = ['ATIVO', 'MOBILIZADO', 'DESMOBILIZADO', 'INATIVO'];
    await Promise.all(statusPadrao.map((descricao) => garantirStatusCentroCusto(descricao)));
    return garantirStatusCentroCusto('ATIVO');
}

export async function criarCentroCusto(dados: {
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    idEmp_Custo?: string | null;
    idStatusCCusto?: string | null;
}) {
    const statusPadrao = await garantirStatusPadraoCentroCusto();
    return await prisma.tbCCusto.create({
        data: {
            codigoCCusto: dados.codigoCCusto,
            descricaoCCusto: dados.descricaoCCusto,
            idEmp_Custo: dados.idEmp_Custo,
            idStatusCCusto: dados.idStatusCCusto || statusPadrao.idStatusCCusto
        }
    });
}

export async function atualizarCentroCusto(id: string, dados: Partial<{
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    idEmp_Custo?: string | null;
    idStatusCCusto?: string | null;
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

export async function listarCentrosCustoAtivosEMobilizados(ids?: string[]) {
    const statusIds = await prisma.tbStatusCCusto.findMany({
        where: {
            descricaoStatusCCusto: {
                in: STATUS_CENTRO_VISIVEL
            }
        },
        select: {
            idStatusCCusto: true
        }
    });

    const idsStatus = statusIds.map((status) => status.idStatusCCusto);

    return await prisma.tbCCusto.findMany({
        where: {
            ...(ids && ids.length > 0 && {
                idCCusto: {
                    in: ids
                }
            }),
            ...(idsStatus.length > 0 && {
                idStatusCCusto: {
                    in: idsStatus
                }
            })
        },
        include: {
            tbEmpresa: true,
            tbStatusCCusto: true
        },
        orderBy: [
            {
                descricaoCCusto: 'asc'
            },
            {
                codigoCCusto: 'asc'
            }
        ]
    });
}

