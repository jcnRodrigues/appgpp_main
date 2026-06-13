"use server"

import prisma from "../../../../prisma/prisma";

function normalizarTexto(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export async function listarLicencas(filtro?: {
    descricao?: string;
    skip?: number;
    take?: number;
}) {
    const descricao = filtro?.descricao?.trim();
    const skip = filtro?.skip ?? 0;
    const take = filtro?.take ?? 10;

    if (!descricao) {
        return await prisma.tbLicenca.findMany({
            include: {
                _count: {
                    select: {
                        tbHasLicencaFuncionario: true
                    }
                }
            },
            skip,
            take,
            orderBy: {
                descricaoLic: 'asc'
            }
        });
    }

    const filtroNormalizado = normalizarTexto(descricao);
    const todasLicencas = await prisma.tbLicenca.findMany({
        include: {
            _count: {
                select: {
                    tbHasLicencaFuncionario: true
                }
            }
        },
        orderBy: {
            descricaoLic: 'asc'
        }
    });

    const filtradas = todasLicencas.filter((licenca) =>
        normalizarTexto(licenca.descricaoLic).includes(filtroNormalizado)
    );

    return filtradas.slice(skip, skip + take);
}

export async function contarLicencas(descricao?: string) {
    const descricaoFiltro = descricao?.trim();

    if (!descricaoFiltro) {
        return await prisma.tbLicenca.count();
    }

    const filtroNormalizado = normalizarTexto(descricaoFiltro);
    const todasLicencas = await prisma.tbLicenca.findMany({
        select: {
            descricaoLic: true
        }
    });

    return todasLicencas.filter((licenca) =>
        normalizarTexto(licenca.descricaoLic).includes(filtroNormalizado)
    ).length;
}

export async function criarLicenca(dados: {
    descricaoLic: string;
}) {
    return await prisma.tbLicenca.create({
        data: {
            descricaoLic: dados.descricaoLic
        },
        include: {
            _count: {
                select: {
                    tbHasLicencaFuncionario: true
                }
            }
        }
    });
}

export async function getLicencaById(idLic: string) {
    return await prisma.tbLicenca.findUnique({
        where: {
            idLic
        },
        include: {
            _count: {
                select: {
                    tbHasLicencaFuncionario: true
                }
            }
        }
    });
}

export async function atualizarLicenca(idLic: string, dados: Partial<{
    descricaoLic: string;
}>) {
    return await prisma.tbLicenca.update({
        where: {
            idLic
        },
        data: dados,
        include: {
            _count: {
                select: {
                    tbHasLicencaFuncionario: true
                }
            }
        }
    });
}

export async function deletarLicenca(idLic: string) {
    return await prisma.tbLicenca.delete({
        where: {
            idLic
        }
    });
}
