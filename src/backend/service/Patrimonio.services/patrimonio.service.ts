
import prisma from "../../../../prisma/prisma";

export async function getPatrimonioCard(count?: number, id?: string) {
    return await prisma.tbPatrimonio.findMany({
        where: {
            idP: id
        },
        include: {
            tbStatusPat: true,
            tbTipoPat: true

        },
        take: count
    });
}

export async function getPatrimonioCardById(id: string) {
    return await prisma.tbPatrimonio.findUnique({
        where: {
            idP: id 
        },
        include: {
            tbTipoPat: true
        }
    });
}
export async function getTipoPatrimonioById(id: string) {
    return await prisma.tbTipoPat.findUnique({
        where: {
            idTipPat: id
        },
    });
}

export async function getStatusPatrimonioById(id: string) {
    return await prisma.tbStatusPat.findUnique({
        where: {
            idStatusPat: id
        },
    });
}
