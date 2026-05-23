
"use server"

import prisma from "../../../../prisma/prisma";

export async function getTipoPatId(id: string) {
    return await prisma.tbTipoPat.findUnique({
        where: {
            idTipPat: id,
        },
    });
}