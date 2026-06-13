"use server"

import prisma from "../../../../prisma/prisma";


export async function getStatusFuncionarioById(id: string, descricao?: string) {
    return await prisma.tbStatusFun.findUnique({
        where: {
            idStatusFun: id,
            descricaoStatusFun: descricao
        },
    });
}

export async function getStatusFuncioanrio(StatusFuncionario?: string) {
    return await prisma.tbStatusFun.findMany({
        where: {
            descricaoStatusFun: StatusFuncionario
        },
        include: {  
            tbFuncionario: true
        }
    });
}