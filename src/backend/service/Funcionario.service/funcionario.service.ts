"use server"

import prisma from "../../../../prisma/prisma";

export async function getFuncionariosCard() {
    return await prisma.tbFuncionario.findMany({
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCadastro: true,
        },
        orderBy: {
            nomeFun: "asc"
        }
    }
    );
}