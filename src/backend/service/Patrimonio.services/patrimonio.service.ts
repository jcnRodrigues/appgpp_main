"use server"

import prisma from "../../../../prisma/prisma";

export async function getPatrimonioCard( count?: number) {
    return await prisma.tbPatrimonio.findMany({
        where: {

        },
        include: {
            tbStatusPat: true,
            tbTipoPat: true,
            tbCusto: true,
            tbCadastro: true
        },
        take: count
    });
}
