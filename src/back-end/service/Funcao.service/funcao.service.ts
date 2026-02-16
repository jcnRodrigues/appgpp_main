"use server"

import prisma from "../../../../prisma/prisma";

// Função para buscar todas as funções
export async function getFuncoes() {
    return await prisma.tbFuncao.findMany({
        orderBy: {
            nomeFuncao: 'asc'
        }
    });
}

// Função para buscar uma função pelo ID
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

// Função para criar uma nova função
export async function criarFuncao(dados: {
    nomeFuncao: string;
}) {
    return await prisma.tbFuncao.create({
        data: {
            nomeFuncao: dados.nomeFuncao
        }
    });
}

// Função para atualizar uma função
export async function atualizarFuncao(idFuncao: string, dados: Partial<{
    nomeFuncao: string;
}>) {
    return await prisma.tbFuncao.update({
        where: { idFuncao },
        data: dados
    });
}

// Função para deletar uma função
export async function deletarFuncao(idFuncao: string) {
    // Verifica se há funcionários com essa função
    const funcionariosComFuncao = await prisma.tbFuncionario.count({
        where: { idFuncaoFun: idFuncao }
    });

    if (funcionariosComFuncao > 0) {
        throw new Error(`Não é possível deletar. Existem ${funcionariosComFuncao} funcionário(s) com essa função.`);
    }

    return await prisma.tbFuncao.delete({
        where: { idFuncao }
    });
}
