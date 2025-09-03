"use server"

import prisma from "../../../../prisma/prisma";

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

export async function getFuncionarioStatusById(id: string) {
    return await prisma.tbStatusFun.findUnique({
        where: {
            idStatusFun: id
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
            tbCCusto: true
        }
    });
}