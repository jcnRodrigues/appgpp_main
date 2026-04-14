"use server"

import prisma from "../../../../prisma/prisma";

async function getStatusIdByDescricao(
    tx: Pick<typeof prisma, "tbStatusPat">,
    options: { exact?: string[]; contains?: string[] }
) {
    const statusList = await tx.tbStatusPat.findMany();
    const normalize = (value: string) => value.trim().toLowerCase();

    if (options.exact && options.exact.length > 0) {
        const exactSet = options.exact.map(normalize);
        const match = statusList.find(s => exactSet.includes(normalize(s.descricaoStatPat)));
        if (match) return match.idStatusPat;
    }

    if (options.contains && options.contains.length > 0) {
        const containsSet = options.contains.map(normalize);
        const match = statusList.find(s =>
            containsSet.some(c => normalize(s.descricaoStatPat).includes(c))
        );
        if (match) return match.idStatusPat;
    }

    return null;
}

function buildAlocacaoWhere(filtro?: {
    idMatFun?: string;
    idPat?: string;
    funcionarioBusca?: string;
    patrimonioBusca?: string;
    centros?: string[];
}) {
    const funcionarioBusca = filtro?.funcionarioBusca?.trim();
    const patrimonioBusca = filtro?.patrimonioBusca?.trim();

    return {
        ...(filtro?.idMatFun && {
            idMatFunCad: filtro.idMatFun
        }),
        ...(filtro?.idPat && {
            idPatCad: filtro.idPat
        }),
        ...(filtro?.centros && filtro.centros.length > 0 && {
            OR: [
                {
                    tbFuncionario: {
                        idCustoFun: {
                            in: filtro.centros
                        }
                    }
                },
                {
                    tbPatrimonio: {
                        idPat_CustoPat: {
                            in: filtro.centros
                        }
                    }
                }
            ]
        }),
        ...(funcionarioBusca && {
            tbFuncionario: {
                OR: [
                    {
                        nomeFun: {
                            contains: funcionarioBusca
                        }
                    },
                    {
                        idMatFun: {
                            contains: funcionarioBusca
                        }
                    }
                ]
            }
        }),
        ...(patrimonioBusca && {
            tbPatrimonio: {
                OR: [
                    {
                        descricaoPat: {
                            contains: patrimonioBusca
                        }
                    },
                    {
                        idPat: {
                            contains: patrimonioBusca
                        }
                    }
                ]
            }
        })
    };
}

// Buscar todas as alocaÃ§Ãµes de patrimÃ´nio
export async function listarAlocacoes(filtro?: {
    idMatFun?: string;
    idPat?: string;
    funcionarioBusca?: string;
    patrimonioBusca?: string;
    centros?: string[];
    skip?: number;
    take?: number;
}) {
    return await prisma.tbCadastro.findMany({
        where: buildAlocacaoWhere(filtro),
        include: {
            tbStatusPat: true,
            tbFuncionario: {
                include: {
                    tbStatusFun: true
                }
            },
            tbPatrimonio: {
                include: {
                    tbStatusPat: true,
                    tbTipoPat: true
                }
            }
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
    funcionarioBusca?: string;
    patrimonioBusca?: string;
    centros?: string[];
}) {
    return await prisma.tbCadastro.count({
        where: buildAlocacaoWhere(filtro)
    });
}

// Buscar uma alocaÃ§Ã£o especÃ­fica
export async function buscarAlocacaoById(idCad: string) {
    return await prisma.tbCadastro.findUnique({
        where: { idCad },
        include: {
            tbStatusPat: true,
            tbFuncionario: {
                include: {
                    tbFuncao: true,
                    tbCCusto: {
                        include: {
                            tbEmpresa: true
                        }
                    },
                    tbStatusFun: true
                }
            },
            tbPatrimonio: {
                include: {
                    tbStatusPat: true,
                    tbCCusto: true,
                    tbTipoPat: true
                }
            }
        }
    });
}

// Criar nova alocaÃ§Ã£o
export async function criarAlocacao(dados: {
    idPatCad: string;
    idMatFunCad: string;
    dataCadPat?: Date;
    dataDevPat?: Date;
    idStatusPatCad?: string;
}) {
    return await prisma.$transaction(async (tx) => {
        // Validar se o patrimÃ´nio existe
        const patrimonio = await tx.tbPatrimonio.findUnique({
            where: { idPat: dados.idPatCad },
            include: {
                tbStatusPat: true
            }
        });

        if (!patrimonio) {
            throw new Error("PatrimÃ´nio nÃ£o encontrado");
        }

        // Validar se o funcionÃ¡rio existe
        const funcionario = await tx.tbFuncionario.findUnique({
            where: { idMatFun: dados.idMatFunCad }
        });

        if (!funcionario) {
            throw new Error("FuncionÃ¡rio nÃ£o encontrado");
        }

        const statusDescricao = patrimonio.tbStatusPat?.descricaoStatPat?.toLowerCase() || "";
        const statusDevolvido = statusDescricao.includes("devolv");

        const alocacaoAtiva = await tx.tbCadastro.findFirst({
            where: {
                idPatCad: dados.idPatCad,
                dataDevPat: null
            },
            orderBy: {
                dataCadPat: "desc"
            }
        });

        if (alocacaoAtiva && !statusDevolvido) {
            throw new Error("PatrimÃ´nio jÃ¡ estÃ¡ alocado. Registre a devoluÃ§Ã£o antes de realocar.");
        }

        if (alocacaoAtiva && statusDevolvido) {
            await tx.tbCadastro.update({
                where: { idCad: alocacaoAtiva.idCad },
                data: { dataDevPat: new Date() }
            });
        }

        const statusAtivoId = await getStatusIdByDescricao(tx, { exact: ["ATIVO"] });
        const statusDevolvidoId = await getStatusIdByDescricao(tx, {
            exact: ["DEVOLVIDO", "DEVOLUÃ‡ÃƒO", "DEVOLUCAO"],
            contains: ["devolv"]
        });
        const statusCadastroId =
            dados.idStatusPatCad ||
            (dados.dataDevPat ? statusDevolvidoId : null) ||
            statusAtivoId ||
            patrimonio.idPat_StatusPat ||
            (await getStatusIdByDescricao(tx, { contains: ["ativo"] })) ||
            (await getStatusIdByDescricao(tx, { contains: ["devolv"] }));

        if (!statusCadastroId) {
            throw new Error("Status do patrimÃ´nio nÃ£o encontrado para o cadastro.");
        }

        const novaAlocacao = await tx.tbCadastro.create({
            data: {
                idPatCad: dados.idPatCad,
                idMatFunCad: dados.idMatFunCad,
                dataCadPat: dados.dataCadPat || new Date(),
                dataDevPat: dados.dataDevPat || null,
                idStatusPatCad: statusCadastroId
            },
            include: {
                tbFuncionario: true,
                tbPatrimonio: true,
                tbStatusPat: true
            }
        });

        if (dados.dataDevPat) {
            if (statusDevolvidoId) {
                await tx.tbPatrimonio.update({
                    where: { idPat: dados.idPatCad },
                    data: { idPat_StatusPat: statusDevolvidoId }
                });
            }
        } else if (statusAtivoId) {
            await tx.tbPatrimonio.update({
                where: { idPat: dados.idPatCad },
                data: { idPat_StatusPat: statusAtivoId }
            });
        }

        return novaAlocacao;
    });
}

// Atualizar alocaÃ§Ã£o (principalmente para registrar devoluÃ§Ã£o)
export async function atualizarAlocacao(idCad: string, dados: Partial<{
    dataCadPat?: Date;
    dataDevPat?: Date | null;
    idStatusPatCad?: string;
}>) {
    return await prisma.$transaction(async (tx) => {
        const alocacao = await tx.tbCadastro.update({
            where: { idCad },
            data: dados,
            include: {
                tbFuncionario: true,
                tbPatrimonio: true
            }
        });

        if (alocacao.idPatCad) {
            const statusDevolvidoId = await getStatusIdByDescricao(tx, {
                exact: ["DEVOLVIDO", "DEVOLUÃ‡ÃƒO", "DEVOLUCAO"],
                contains: ["devolv"]
            });
            const statusAtivoId = await getStatusIdByDescricao(tx, { exact: ["ATIVO"] });

            if (dados.dataDevPat instanceof Date) {
                if (statusDevolvidoId) {
                    await tx.tbPatrimonio.update({
                        where: { idPat: alocacao.idPatCad },
                        data: { idPat_StatusPat: statusDevolvidoId }
                    });
                    await tx.tbCadastro.update({
                        where: { idCad },
                        data: { idStatusPatCad: statusDevolvidoId }
                    });
                }
            } else if (dados.dataDevPat === null) {
                if (statusAtivoId) {
                    await tx.tbPatrimonio.update({
                        where: { idPat: alocacao.idPatCad },
                        data: { idPat_StatusPat: statusAtivoId }
                    });
                    await tx.tbCadastro.update({
                        where: { idCad },
                        data: { idStatusPatCad: statusAtivoId }
                    });
                }
            }
        }

        return alocacao;
    });
}

// Deletar alocaÃ§Ã£o
export async function deletarAlocacao(idCad: string) {
    return await prisma.tbCadastro.delete({
        where: { idCad }
    });
}

// Buscar funcionÃ¡rios disponÃ­veis
export async function listarFuncionarios(centros?: string[]) {
    return await prisma.tbFuncionario.findMany({
        where: centros && centros.length > 0 ? { idCustoFun: { in: centros } } : undefined,
        orderBy: {
            nomeFun: 'asc'
        }
    });
}

// Buscar patrimÃ´nios disponÃ­veis
export async function listarPatrimonios(centros?: string[]) {
    return await prisma.tbPatrimonio.findMany({
        where: {
            OR: [
                {
                    tbCadastro: {
                        none: { dataDevPat: null }
                    }
                },
                {
                    tbStatusPat: {
                        descricaoStatPat: {
                            contains: "DEVOLV"
                        }
                    }
                }
            ],
            ...(centros && centros.length > 0 && {
                idPat_CustoPat: { in: centros }
            })
        },
        orderBy: {
            descricaoPat: 'asc'
        }
    });
}

// Buscar patrimÃ´nios alocados a um funcionÃ¡rio
export async function patrimoniosPorFuncionario(idMatFun: string) {
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

// Buscar alocaÃ§Ãµes de um patrimÃ´nio
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

