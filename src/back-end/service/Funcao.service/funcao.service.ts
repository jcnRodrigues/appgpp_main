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
export async function getFuncoes(paginacao?: { skip?: number; take?: number; nome?: string }) {
    const nome = paginacao?.nome?.trim();
    const skip = paginacao?.skip ?? 0;
    const take = paginacao?.take ?? 10;

    if (!nome) {
        return await prisma.tbFuncao.findMany({
            skip,
            take,
            orderBy: {
                nomeFuncao: 'asc'
            }
        });
    }

    const filtroNormalizado = normalizarTexto(nome);
    const todasFuncoes = await prisma.tbFuncao.findMany({
        orderBy: {
            nomeFuncao: 'asc'
        }
    });

    const filtradas = todasFuncoes.filter((funcao) =>
        normalizarTexto(funcao.nomeFuncao).includes(filtroNormalizado)
    );

    return filtradas.slice(skip, skip + take);
}

export async function contarFuncoes(nome?: string) {
    const nomeFiltro = nome?.trim();

    if (!nomeFiltro) {
        return await prisma.tbFuncao.count();
    }

    const filtroNormalizado = normalizarTexto(nomeFiltro);
    const todasFuncoes = await prisma.tbFuncao.findMany({
        select: { nomeFuncao: true }
    });

    return todasFuncoes.filter((funcao) =>
        normalizarTexto(funcao.nomeFuncao).includes(filtroNormalizado)
    ).length;
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
