"use server"

import prisma from "../../../../prisma/prisma";

function buildFuncionarioWhere(filtro?: {
    nome?: string;
    status?: string;
    funcao?: string;
    centros?: string[];
}) {
    return {
        ...(filtro?.nome && {
            nomeFun: {
                contains: filtro.nome
            }
        }),
        ...(filtro?.status && {
            idStatusFun: filtro.status
        }),
        ...(filtro?.funcao && {
            idFuncaoFun: filtro.funcao
        }),
        ...(filtro?.centros && filtro.centros.length > 0 && {
            idCustoFun: {
                in: filtro.centros
            }
        })
    };
}

export async function getFuncionariosAppointmentByUserID(userId: string) {
    return await prisma.tbFuncionario.findMany({
        where: {
            idUserFun: userId
        } 
    })
}


export async function getFuncionariosCard() {
    return await prisma.tbFuncionario.findMany({
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCCusto: true
        },
        orderBy: {
            nomeFun: "asc"
        }
    }
    );
}

export async function getFuncionarioFuncaoById(id: string) {
    return await prisma.tbFuncao.findUnique({
        where: {
            idFuncao: id
        },
    });
}

export async function getFuncionarioStatusById(id: string, descricao?: string) {
    return await prisma.tbStatusFun.findUnique({
        where: {
            idStatusFun: id,
            descricaoStatusFun: descricao
        },
    });
}

export async function getFuncionarioById(id: string) {
    return await prisma.tbFuncionario.findUnique({
        where: {
            idMatFun: id
        },
        include: {
            tbFuncao: true,
            tbCCusto: true,
            tbStatusFun: true
        }
    });
}

// Função para listar todos os funcionários com filtros
export async function listarFuncionarios(filtro?: {
    nome?: string;
    status?: string;
    funcao?: string;
    centros?: string[];
    skip?: number;
    take?: number;
}) {
    return await prisma.tbFuncionario.findMany({
        where: buildFuncionarioWhere(filtro),
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCCusto: true
        },
        skip: filtro?.skip || 0,
        take: filtro?.take || 100,
        orderBy: {
            nomeFun: 'asc'
        }
    });
}

export async function contarFuncionarios(filtro?: {
    nome?: string;
    status?: string;
    funcao?: string;
    centros?: string[];
}) {
    return await prisma.tbFuncionario.count({
        where: buildFuncionarioWhere(filtro)
    });
}

// Função para criar um novo funcionário
export async function criarFuncionario(dados: {
    idMatFun: string;
    nomeFun: string;
    cpfFun?: string;
    dataAdmFun?: Date;
    avatarFun?: string;
    idFuncaoFun?: string;
    idStatusFun?: string;
    idCustoFun?: string;
    idUserFun?: string;
}) {
    return await prisma.tbFuncionario.create({
        data: {
            idMatFun: dados.idMatFun,
            nomeFun: dados.nomeFun,
            cpfFun: dados.cpfFun,
            dataAdmFun: dados.dataAdmFun,
            avatarFun: dados.avatarFun,
            idFuncaoFun: dados.idFuncaoFun,
            idStatusFun: dados.idStatusFun,
            idCustoFun: dados.idCustoFun,
            idUserFun: dados.idUserFun
        },
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCCusto: true
        }
    });
}

// Função para atualizar um funcionário
export async function atualizarFuncionario(idF: string, dados: Partial<{
    nomeFun: string;
    cpfFun?: string;
    dataAdmFun?: Date;
    dataDesFun?: Date;
    avatarFun?: string;
    idFuncaoFun?: string;
    idStatusFun?: string;
    idCustoFun?: string;
    idUserFun?: string;
}>) {
    return await prisma.tbFuncionario.update({
        where: { idF },
        data: dados,
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCCusto: true
        }
    });
}

// Função para obter funções disponíveis
export async function getFuncoes() {
    return await prisma.tbFuncao.findMany();
}

// Função para obter status disponíveis
export async function getStatusFuncionario() {
    return await prisma.tbStatusFun.findMany();
}

// Função para obter centros de custo
export async function getCentrosCustoFun() {
    return await prisma.tbCCusto.findMany();
}

// Função para obter funcionário pelo ID interno
export async function getFuncionarioByIdInterno(idF: string) {
    return await prisma.tbFuncionario.findUnique({
        where: { idF },
        include: {
            tbFuncao: true,
            tbCCusto: true,
            tbStatusFun: true
        }
    });
}



