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

type VinculoLicencaInput = {
    idLic: string;
    dataInicio: Date;
    dataVencimetno: Date;
};

async function sincronizarLicencasDoFuncionario(funcionarioId: string, vinculos: VinculoLicencaInput[]) {
    const idsSelecionados = vinculos.map((v) => v.idLic);

    await prisma.$transaction(async (tx) => {
        await tx.tbHasLicencaFuncionario.deleteMany({
            where: {
                idFunc: funcionarioId,
                ...(idsSelecionados.length > 0
                    ? { idLinc: { notIn: idsSelecionados } }
                    : {})
            }
        });

        for (const vinculo of vinculos) {
            await tx.tbHasLicencaFuncionario.upsert({
                where: {
                    idFunc_idLinc: {
                        idFunc: funcionarioId,
                        idLinc: vinculo.idLic
                    }
                },
                update: {
                    dataInicio: vinculo.dataInicio,
                    dataVencimetno: vinculo.dataVencimetno
                },
                create: {
                    idFunc: funcionarioId,
                    idLinc: vinculo.idLic,
                    dataInicio: vinculo.dataInicio,
                    dataVencimetno: vinculo.dataVencimetno
                }
            });
        }
    });
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
            tbCCusto: true,
            tbHasLicencaFuncionario: {
                include: {
                    tbLicenca: true
                }
            }
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
            tbStatusFun: true,
            tbHasLicencaFuncionario: {
                include: {
                    tbLicenca: true
                }
            }
        }
    });
}

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
            tbCCusto: true,
            tbHasLicencaFuncionario: {
                include: {
                    tbLicenca: true
                }
            }
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
    licencasVinculos?: VinculoLicencaInput[];
}) {
    const funcionario = await prisma.tbFuncionario.create({
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
        }
    });

    await sincronizarLicencasDoFuncionario(funcionario.idF, dados.licencasVinculos || []);

    return await prisma.tbFuncionario.findUnique({
        where: { idF: funcionario.idF },
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCCusto: true,
            tbHasLicencaFuncionario: {
                include: {
                    tbLicenca: true
                }
            }
        }
    });
}

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
    licencasVinculos?: VinculoLicencaInput[];
}>) {
    const { licencasVinculos, ...dadosFuncionario } = dados;

    await prisma.tbFuncionario.update({
        where: { idF },
        data: dadosFuncionario
    });

    if (Array.isArray(licencasVinculos)) {
        await sincronizarLicencasDoFuncionario(idF, licencasVinculos);
    }

    return await prisma.tbFuncionario.findUnique({
        where: { idF },
        include: {
            tbStatusFun: true,
            tbFuncao: true,
            tbCCusto: true,
            tbHasLicencaFuncionario: {
                include: {
                    tbLicenca: true
                }
            }
        }
    });
}

export async function getFuncoes() {
    return await prisma.tbFuncao.findMany();
}

export async function getStatusFuncionario() {
    return await prisma.tbStatusFun.findMany();
}

export async function getCentrosCustoFun() {
    return await prisma.tbCCusto.findMany();
}

export async function getLicencasDisponiveisParaFuncionario() {
    return await prisma.tbLicenca.findMany({
        select: {
            idLic: true,
            descricaoLic: true
        },
        orderBy: {
            descricaoLic: 'asc'
        }
    });
}

export async function getFuncionarioByIdInterno(idF: string) {
    return await prisma.tbFuncionario.findUnique({
        where: { idF },
        include: {
            tbFuncao: true,
            tbCCusto: true,
            tbStatusFun: true,
            tbHasLicencaFuncionario: {
                include: {
                    tbLicenca: true
                },
                orderBy: {
                    tbLicenca: {
                        descricaoLic: 'asc'
                    }
                }
            }
        }
    });
}
