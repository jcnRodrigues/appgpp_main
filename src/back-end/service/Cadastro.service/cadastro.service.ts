"use server"

import prisma from "../../../../prisma/prisma";

function buildAlocacaoWhere(filtro?: {
    idMatFun?: string;
    idPat?: string;
}) {
    return {
        ...(filtro?.idMatFun && {
            idMatFunCad: filtro.idMatFun
        }),
        ...(filtro?.idPat && {
            idPatCad: filtro.idPat
        })
    };
}

// Buscar todas as alocações de patrimônio
export async function listarAlocacoes(filtro?: {
    idMatFun?: string;
    idPat?: string;
    skip?: number;
    take?: number;
}) {
    return await prisma.tbCadastro.findMany({
        where: buildAlocacaoWhere(filtro),
        include: {
            tbFuncionario: true,
            tbPatrimonio: true
        },
        skip: filtro?.skip || 0,
        take: filtro?.take || 100,
        orderBy: {
            dataCadPat: 'desc'
        }
    });
}

export async function contarAlocacoes(filtro?: {
    idMatFun?: string;
    idPat?: string;
}) {
    return await prisma.tbCadastro.count({
        where: buildAlocacaoWhere(filtro)
    });
}

// Buscar uma alocação específica
export async function buscarAlocacaoById(idCad: string) {
    return await prisma.tbCadastro.findUnique({
        where: { idCad },
        include: {
            tbFuncionario: true,
            tbPatrimonio: true
        }
    });
}

// Criar nova alocação
export async function criarAlocacao(dados: {
    idPatCad: string;
    idMatFunCad: string;
    dataCadPat?: Date;
}) {
    // Validar se o patrimônio existe
    const patrimonio = await prisma.tbPatrimonio.findUnique({
        where: { idPat: dados.idPatCad }
    });
    
    if (!patrimonio) {
        throw new Error("Patrimônio não encontrado");
    }

    // Validar se o funcionário existe
    const funcionario = await prisma.tbFuncionario.findUnique({
        where: { idMatFun: dados.idMatFunCad }
    });
    
    if (!funcionario) {
        throw new Error("Funcionário não encontrado");
    }

    return await prisma.tbCadastro.create({
        data: {
            idPatCad: dados.idPatCad,
            idMatFunCad: dados.idMatFunCad,
            dataCadPat: dados.dataCadPat || new Date()
        },
        include: {
            tbFuncionario: true,
            tbPatrimonio: true
        }
    });
}

// Atualizar alocação (principalmente para registrar devolução)
export async function atualizarAlocacao(idCad: string, dados: Partial<{
    dataCadPat?: Date;
    dataDevPat?: Date;
}>) {
    return await prisma.tbCadastro.update({
        where: { idCad },
        data: dados,
        include: {
            tbFuncionario: true,
            tbPatrimonio: true
        }
    });
}

// Deletar alocação
export async function deletarAlocacao(idCad: string) {
    return await prisma.tbCadastro.delete({
        where: { idCad }
    });
}

// Buscar funcionários disponíveis
export async function listarFuncionarios() {
    return await prisma.tbFuncionario.findMany({
        orderBy: {
            nomeFun: 'asc'
        }
    });
}

// Buscar patrimônios disponíveis
export async function listarPatrimonios() {
    return await prisma.tbPatrimonio.findMany({
        orderBy: {
            descricaoPat: 'asc'
        }
    });
}

// Buscar patrimônios alocados a um funcionário
export async function patrimôniosPorFuncionário(idMatFun: string) {
    return await prisma.tbCadastro.findMany({
        where: {
            idMatFunCad: idMatFun,
            dataDevPat: null
        },
        include: {
            tbPatrimonio: true
        }
    });
}

// Buscar alocações de um patrimônio
export async function alocacoesPorPatrimonio(idPat: string) {
    return await prisma.tbCadastro.findMany({
        where: {
            idPatCad: idPat
        },
        include: {
            tbFuncionario: true
        },
        orderBy: {
            dataCadPat: 'desc'
        }
    });
}
