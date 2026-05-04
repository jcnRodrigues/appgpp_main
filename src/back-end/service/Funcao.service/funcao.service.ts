"use server"

import prisma from "../../../../prisma/prisma";

function normalizarTexto(valor: string) {
    return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// Funcao para buscar todas as funcoes
export async function getFuncoes(paginacao?: { skip?: number; take?: number; nome?: string; centroId?: string }) {
    const nome = paginacao?.nome?.trim();
    const centroId = paginacao?.centroId?.trim();
    const skip = paginacao?.skip ?? 0;
    const take = paginacao?.take ?? 10;

    const whereCentro = centroId
        ? {
            tbFuncionario: {
                some: {
                    idCustoFun: centroId
                }
            }
        }
        : {};

    if (!nome) {
        const funcoes = await prisma.tbFuncao.findMany({
            where: whereCentro,
            skip,
            take,
            orderBy: {
                nomeFuncao: 'asc'
            }
        });
        return await adicionarQuantidadeFuncionarios(funcoes, centroId);
    }

    const filtroNormalizado = normalizarTexto(nome);
    const todasFuncoes = await prisma.tbFuncao.findMany({
        where: whereCentro,
        orderBy: {
            nomeFuncao: 'asc'
        }
    });

    const filtradas = todasFuncoes.filter((funcao) =>
        normalizarTexto(funcao.nomeFuncao).includes(filtroNormalizado)
    );

    const paginadas = filtradas.slice(skip, skip + take);
    return await adicionarQuantidadeFuncionarios(paginadas, centroId);
}

export async function contarFuncoes(nome?: string, centroId?: string) {
    const nomeFiltro = nome?.trim();
    const centro = centroId?.trim();
    const whereCentro = centro
        ? {
            tbFuncionario: {
                some: {
                    idCustoFun: centro
                }
            }
        }
        : {};

    if (!nomeFiltro) {
        return await prisma.tbFuncao.count({ where: whereCentro });
    }

    const filtroNormalizado = normalizarTexto(nomeFiltro);
    const todasFuncoes = await prisma.tbFuncao.findMany({
        where: whereCentro,
        select: { nomeFuncao: true }
    });

    return todasFuncoes.filter((funcao) =>
        normalizarTexto(funcao.nomeFuncao).includes(filtroNormalizado)
    ).length;
}

async function adicionarQuantidadeFuncionarios(
    funcoes: Array<{ idFuncao: string; codigoFuncao: number; nomeFuncao: string }>,
    centroId?: string
) {
    const idsFuncoes = funcoes.map((funcao) => funcao.idFuncao);

    if (idsFuncoes.length === 0) return [];

    const funcionariosAgrupados = await prisma.tbFuncionario.groupBy({
        by: ['idFuncaoFun'],
        where: {
            idFuncaoFun: { in: idsFuncoes },
            ...(centroId ? { idCustoFun: centroId } : {})
        },
        _count: {
            idF: true
        }
    });

    const contagemPorFuncao = new Map(
        funcionariosAgrupados
            .filter((item) => item.idFuncaoFun)
            .map((item) => [item.idFuncaoFun as string, item._count.idF])
    );

    return funcoes.map((funcao) => ({
        ...funcao,
        quantidadeFuncionarios: contagemPorFuncao.get(funcao.idFuncao) ?? 0
    }));
}

// Funcao para buscar uma funcao pelo ID
export async function getFuncaoById(idFuncao: string) {
    return await prisma.tbFuncao.findUnique({
        where: { idFuncao },
        include: {
            tbFuncionario: {
                select: {
                    idF: true,
                    nomeFun: true
                }
            }
        }
    });
}

// Funcao para criar uma nova funcao
export async function criarFuncao(dados: {
    nomeFuncao: string;
}) {
    return await prisma.tbFuncao.create({
        data: {
            nomeFuncao: dados.nomeFuncao
        }
    });
}

// Funcao para atualizar uma funcao
export async function atualizarFuncao(idFuncao: string, dados: Partial<{
    nomeFuncao: string;
}>) {
    return await prisma.tbFuncao.update({
        where: { idFuncao },
        data: dados
    });
}

// Funcao para deletar uma funcao
export async function deletarFuncao(idFuncao: string) {
    // Verifica se ha funcionarios com essa funcao
    const funcionariosComFuncao = await prisma.tbFuncionario.count({
        where: { idFuncaoFun: idFuncao }
    });

    if (funcionariosComFuncao > 0) {
        throw new Error(`Nao e possivel deletar. Existem ${funcionariosComFuncao} funcionario(s) com essa funcao.`);
    }

    return await prisma.tbFuncao.delete({
        where: { idFuncao }
    });
}
