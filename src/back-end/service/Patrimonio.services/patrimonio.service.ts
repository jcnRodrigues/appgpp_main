
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
            tbTipoPat: true,
            tbStatusPat: true,
            tbCCusto: true,
            tbCadastro: true,
            
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

// Função para listar todos os patrimônios com filtros
export async function listarPatrimonios(filtro?: {
    descricao?: string;
    status?: string;
    tipo?: string;
    skip?: number;
    take?: number;
}) {
    return await prisma.tbPatrimonio.findMany({
        where: {
            ...(filtro?.descricao && {
                descricaoPat: {
                    contains: filtro.descricao
                }
            }),
            ...(filtro?.status && {
                idPat_StatusPat: filtro.status
            }),
            ...(filtro?.tipo && {
                idPat_TipoPat: filtro.tipo
            })
        },
        include: {
            tbStatusPat: true,
            tbTipoPat: true,
            tbCCusto: true
        },
        skip: filtro?.skip || 0,
        take: filtro?.take || 100,
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Função para criar um novo patrimônio
export async function criarPatrimonio(dados: {
    idPat: string;
    descricaoPat: string;
    descricaoDetalhadaPat?: string;
    licencaPat?: string;
    dataEntPat: Date;
    dataSaiPat?: Date;
    notaFiscalPat?: string;
    valorPat: number;
    idPat_TipoPat?: string;
    idPat_StatusPat?: string;
    idPat_CustoPat?: string;
}) {
    return await prisma.tbPatrimonio.create({
        data: {
            idPat: dados.idPat,
            descricaoPat: dados.descricaoPat,
            descricaoDetalhadaPat: dados.descricaoDetalhadaPat,
            licencaPat: dados.licencaPat,
            dataEntPat: dados.dataEntPat,
            dataSaiPat: dados.dataSaiPat,
            notaFiscalPat: dados.notaFiscalPat,
            valorPat: dados.valorPat,
            idPat_TipoPat: dados.idPat_TipoPat,
            idPat_StatusPat: dados.idPat_StatusPat,
            idPat_CustoPat: dados.idPat_CustoPat
        },
        include: {
            tbStatusPat: true,
            tbTipoPat: true,
            tbCCusto: true
        }
    });
}

// Função para atualizar um patrimônio
export async function atualizarPatrimonio(idP: string, dados: Partial<{
    descricaoPat: string;
    descricaoDetalhadaPat?: string;
    licencaPat?: string;
    dataEntPat: Date;
    dataSaiPat?: Date;
    notaFiscalPat?: string;
    valorPat: number;
    idPat_TipoPat?: string;
    idPat_StatusPat?: string;
    idPat_CustoPat?: string;
}>) {
    return await prisma.tbPatrimonio.update({
        where: { idP },
        data: dados,
        include: {
            tbStatusPat: true,
            tbTipoPat: true,
            tbCCusto: true
        }
    });
}

// Função para obter tipos de patrimônio
export async function getTiposPatrimonio() {
    return await prisma.tbTipoPat.findMany();
}

// Função para obter status de patrimônio
export async function getStatusPatrimonio() {
    return await prisma.tbStatusPat.findMany();
}

// Função para obter centros de custo
export async function getCentrosCusto() {
    return await prisma.tbCCusto.findMany();
}

// Função para contar patrimônios
export async function contarPatrimonios() {
    return await prisma.tbPatrimonio.count();
}
