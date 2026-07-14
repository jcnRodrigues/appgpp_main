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
    centroBusca?: string;
    statusIds?: string[];
    centros?: string[];
}) {
    const funcionarioBusca = filtro?.funcionarioBusca?.trim();
    const patrimonioBusca = filtro?.patrimonioBusca?.trim();
    const centroBusca = filtro?.centroBusca?.trim();

    return {
        ...(filtro?.idMatFun && {
            idMatFunCad: filtro.idMatFun
        }),
        ...(filtro?.idPat && {
            idPatCad: filtro.idPat
        }),
        ...(filtro?.statusIds && filtro.statusIds.length > 0 && {
            idStatusPatCad: {
                in: filtro.statusIds
            }
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
        }),
        ...(centroBusca && {
            AND: [
                {
                    OR: [
                        {
                            tbFuncionario: {
                                OR: [
                                    { idCustoFun: { contains: centroBusca } },
                                    { tbCCusto: { codigoCCusto: { contains: centroBusca } } },
                                    { tbCCusto: { descricaoCCusto: { contains: centroBusca } } }
                                ]
                            }
                        },
                        {
                            tbPatrimonio: {
                                OR: [
                                    { idPat_CustoPat: { contains: centroBusca } },
                                    { tbCCusto: { codigoCCusto: { contains: centroBusca } } },
                                    { tbCCusto: { descricaoCCusto: { contains: centroBusca } } }
                                ]
                            }
                        }
                    ]
                }
            ]
        })
    };
}

function getComparacaoCustos(alocacao: {
    tbFuncionario?: { tbCCusto?: { idCCusto?: string | null } | null } | null;
    tbPatrimonio?: { tbCCusto?: { idCCusto?: string | null } | null } | null;
}) {
    const custoFuncionario = alocacao.tbFuncionario?.tbCCusto?.idCCusto;
    const custoPatrimonio = alocacao.tbPatrimonio?.tbCCusto?.idCCusto;
    if (!custoFuncionario || !custoPatrimonio) return 'SEM_CUSTO' as const;
    return custoFuncionario === custoPatrimonio ? 'IGUAL' as const : 'DIFERENTE' as const;
}

function aplicarFiltroComparacao<T extends {
    tbFuncionario?: { tbCCusto?: { idCCusto?: string | null } | null } | null;
    tbPatrimonio?: { tbCCusto?: { idCCusto?: string | null } | null } | null;
}>(items: T[], comparacao?: 'IGUAL' | 'DIFERENTE') {
    if (!comparacao) return items;
    return items.filter((item) => getComparacaoCustos(item) === comparacao);
}

// Buscar todas as alocações de patrimônio
export async function listarAlocacoes(filtro?: {
    idMatFun?: string;
    idPat?: string;
    funcionarioBusca?: string;
    patrimonioBusca?: string;
    centroBusca?: string;
    statusIds?: string[];
    centros?: string[];
    comparacao?: 'IGUAL' | 'DIFERENTE';
    skip?: number;
    take?: number;
}) {
    const where = buildAlocacaoWhere(filtro) as any;
    if (!filtro?.statusIds || filtro.statusIds.length === 0) {
        where.tbStatusPat = {
            descricaoStatPat: {
                not: {
                    contains: "TRANSFER"
                }
            }
        };
    }

    const registros = await prisma.tbCadastro.findMany({
        where,
        include: {
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: "desc"
                },
                take: 1
            },
            tbStatusPat: true,
            tbFuncionario: {
                include: {
                    tbStatusFun: true,
                    tbFuncao: true,
                    tbCCusto: true
                }
            },
            tbPatrimonio: {
                include: {
                    tbStatusPat: true,
                    tbTipoPat: true,
                    tbCCusto: true,
                    tbDevolucao: {
                        orderBy: {
                            dataInicioDevolucao: "desc"
                        },
                        take: 1
                    }
                }
            }
        },
        orderBy: {
            dataCadPat: 'desc'
        }
    });

    const filtrados = aplicarFiltroComparacao(registros as any[], filtro?.comparacao);
    const skip = filtro?.skip || 0;
    const take = filtro?.take || 100;
    return filtrados.slice(skip, skip + take);
}

export async function contarAlocacoes(filtro?: {
    idMatFun?: string;
    idPat?: string;
    funcionarioBusca?: string;
    patrimonioBusca?: string;
    centroBusca?: string;
    statusIds?: string[];
    centros?: string[];
    comparacao?: 'IGUAL' | 'DIFERENTE';
}) {
    const where = buildAlocacaoWhere(filtro) as any;
    if (!filtro?.statusIds || filtro.statusIds.length === 0) {
        where.tbStatusPat = {
            descricaoStatPat: {
                not: {
                    contains: "TRANSFER"
                }
            }
        };
    }

    const registros = await prisma.tbCadastro.findMany({
        where,
        include: {
            tbFuncionario: {
                include: {
                    tbCCusto: true
                }
            },
            tbPatrimonio: {
                include: {
                    tbCCusto: true
                }
            }
        },
        orderBy: {
            dataCadPat: 'desc'
        }
    });

    return aplicarFiltroComparacao(registros as any[], filtro?.comparacao).length;
}

// Buscar uma alocação específica
export async function buscarAlocacaoById(idCad: string) {
    return await prisma.tbCadastro.findUnique({
        where: { idCad },
        include: {
            tbTransferenciaAlocacao: {
                orderBy: {
                    dataTransferencia: "desc"
                },
                include: {
                    tbFuncionario: true,
                    tbFuncionarioDestino: true,
                    tbUser: true
                }
            },
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: "desc"
                },
                take: 1
            },
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
                    tbCadastro: {
                        where: {
                            dataDevPat: null
                        },
                        orderBy: {
                            dataCadPat: "desc"
                        },
                        take: 1,
                        include: {
                            tbFuncionario: true
                        }
                    },
                    tbStatusPat: true,
                    tbCCusto: true,
                    tbTipoPat: true,
                    tbDevolucao: {
                        orderBy: {
                            dataInicioDevolucao: "desc"
                        },
                        take: 1
                    }
                }
            }
        }
    });
}

// Criar nova alocação
export async function criarAlocacao(dados: {
    idPatCad: string;
    idMatFunCad: string;
    dataCadPat?: Date;
    dataDevPat?: Date;
    idStatusPatCad?: string;
    motivoDevolucao?: string | null;
    preservarHistoricoPatrimonio?: boolean;
}) {
    return await prisma.$transaction(async (tx) => {
        // Validar se o patrimônio existe
        const patrimonio = await tx.tbPatrimonio.findUnique({
            where: { idPat: dados.idPatCad },
            include: {
                tbStatusPat: true
            }
        });

        if (!patrimonio) {
            throw new Error("patrimônio não encontrado");
        }

        // Validar se o funcionário existe
        const funcionario = await tx.tbFuncionario.findUnique({
            where: { idMatFun: dados.idMatFunCad }
        });

        if (!funcionario) {
            throw new Error("funcionário não encontrado");
        }

        const devolucaoFornecedorFinalizada = await tx.tbDevolucao.findFirst({
            where: {
                idPatrimonio: dados.idPatCad,
                dataFimDevolucao: {
                    not: null
                }
            },
            orderBy: {
                dataFimDevolucao: "desc"
            }
        });

        if (devolucaoFornecedorFinalizada) {
            throw new Error("patrimônio com devolução finalizada ao fornecedor não pode ser alocado.");
        }

        const statusDescricao = patrimonio.tbStatusPat?.descricaoStatPat?.toLowerCase() || "";
        const statusDevolvido = statusDescricao.includes("devolv");
        const devePreservarHistoricoPatrimonio = dados.preservarHistoricoPatrimonio === true;

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
            throw new Error("patrimônio já está alocado. Registre a devolução antes de realocar.");
        }

        if (alocacaoAtiva && statusDevolvido && !devePreservarHistoricoPatrimonio) {
            await tx.tbCadastro.update({
                where: { idCad: alocacaoAtiva.idCad },
                data: { dataDevPat: new Date() }
            });
            await tx.tbDevolucao.updateMany({
                where: {
                    idPatrimonio: dados.idPatCad,
                    dataFimDevolucao: null
                },
                data: {
                    dataFimDevolucao: dados.dataCadPat || new Date()
                }
            });
        }

        const statusAtivoId = await getStatusIdByDescricao(tx, { exact: ["ATIVO"] });
        const statusDevolvidoId = await getStatusIdByDescricao(tx, {
            exact: ["DEVOLVIDO", "DEVOLUÇÃO", "DEVOLUCAO"],
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
            throw new Error("Status do patrimônio não encontrado para o cadastro.");
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

        if (dados.dataDevPat && !devePreservarHistoricoPatrimonio) {
            if (statusDevolvidoId) {
                await tx.tbPatrimonio.update({
                    where: { idPat: dados.idPatCad },
                    data: { idPat_StatusPat: statusDevolvidoId }
                });
            }
        } else if (!devePreservarHistoricoPatrimonio && statusAtivoId) {
            await tx.tbPatrimonio.update({
                where: { idPat: dados.idPatCad },
                data: { idPat_StatusPat: statusAtivoId }
            });
        }

        return novaAlocacao;
    });
}

// Atualizar alocação (principalmente para registrar devolução)
export async function atualizarAlocacao(idCad: string, dados: Partial<{
    dataCadPat?: Date;
    dataDevPat?: Date | null;
    idStatusPatCad?: string;
    motivoDevolucao?: string | null;
    observacaoTransferencia?: string | null;
    idUserTransferencia?: string | null;
}>) {
    return await prisma.$transaction(async (tx) => {
        const dataCadastroUpdate: Partial<{
            dataCadPat?: Date;
            dataDevPat?: Date | null;
            idStatusPatCad?: string;
        }> = {};

        if (typeof dados.dataCadPat !== "undefined") dataCadastroUpdate.dataCadPat = dados.dataCadPat;
        if (typeof dados.dataDevPat !== "undefined") dataCadastroUpdate.dataDevPat = dados.dataDevPat;
        if (typeof dados.idStatusPatCad !== "undefined") dataCadastroUpdate.idStatusPatCad = dados.idStatusPatCad;

        const registroAnterior = await tx.tbCadastro.findUnique({
            where: { idCad },
            include: {
                tbStatusPat: true
            }
        });

        if (!registroAnterior) {
            throw new Error("Alocação não encontrada.");
        }

        const alocacao = await tx.tbCadastro.update({
            where: { idCad },
            data: dataCadastroUpdate,
            include: {
                tbFuncionario: true,
                tbPatrimonio: true,
                tbStatusPat: true
            }
        });

        if (alocacao.idPatCad) {
            const statusDevolvidoId = await getStatusIdByDescricao(tx, {
                exact: ["DEVOLVIDO", "DEVOLUÇÃO", "DEVOLUCAO"],
                contains: ["devolv"]
            });
            const statusAtivoId = await getStatusIdByDescricao(tx, { exact: ["ATIVO"] });
            const statusTransferidoId = await getStatusIdByDescricao(tx, {
                exact: ["TRANSFERIDO"],
                contains: ["transfer"]
            });
            const statusDefinidoExplicitamente = typeof dados.idStatusPatCad !== "undefined";

            if (!statusDefinidoExplicitamente && dados.dataDevPat instanceof Date) {
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
            } else if (!statusDefinidoExplicitamente && dados.dataDevPat === null) {
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

            if (statusDefinidoExplicitamente && dados.idStatusPatCad) {
                const novoStatusEhTransferido = dados.idStatusPatCad === statusTransferidoId;
                if (!novoStatusEhTransferido) {
                    await tx.tbPatrimonio.update({
                        where: { idPat: alocacao.idPatCad },
                        data: { idPat_StatusPat: dados.idStatusPatCad }
                    });
                }
            }

            const eraTransferido = registroAnterior.idStatusPatCad === statusTransferidoId;
            const virouTransferido = alocacao.idStatusPatCad === statusTransferidoId;

            if (statusTransferidoId && !eraTransferido && virouTransferido) {
                try {
                    await tx.tbTransferenciaAlocacao.create({
                        data: {
                            idCadastro: alocacao.idCad,
                            idPatrimonio: alocacao.idPatCad,
                            idMatriculaFuncionario: alocacao.idMatFunCad || null,
                            idMatriculaFuncionarioDestino: null,
                            statusAnterior: registroAnterior.tbStatusPat?.descricaoStatPat || null,
                            statusNovo: alocacao.tbStatusPat?.descricaoStatPat || "TRANSFERIDO",
                            observacao: dados.observacaoTransferencia || dados.motivoDevolucao || null,
                            idUserTransferencia: dados.idUserTransferencia || null,
                            dataTransferencia: new Date()
                        }
                    });
                } catch (error: any) {
                    // Permite atualização da alocação mesmo sem a migration da tabela de histórico aplicada.
                    if (error?.code !== "P2021") throw error;
                }
            }
        }

        return alocacao;
    });
}

// Deletar alocação
export async function deletarAlocacao(idCad: string) {
    return await prisma.tbCadastro.delete({
        where: { idCad }
    });
}

// Buscar funcionários disponíveis
export async function listarFuncionarios(centros?: string[]) {
    return await prisma.tbFuncionario.findMany({
        where: centros && centros.length > 0 ? { idCustoFun: { in: centros } } : undefined,
        orderBy: {
            nomeFun: 'asc'
        }
    });
}

// Buscar patrimônios disponíveis
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
            NOT: {
                tbDevolucao: {
                    some: {
                        dataFimDevolucao: {
                            not: null
                        }
                    }
                }
            },
            ...(centros && centros.length > 0 && {
                idPat_CustoPat: { in: centros }
            })
        },
        include: {
            tbStatusPat: true,
            tbCCusto: true,
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: "desc"
                },
                take: 1
            }
        },
        orderBy: {
            descricaoPat: 'asc'
        }
    });
}

export async function transferirAlocacao(idCad: string, dados: {
    idMatFunDestino: string;
    dataTransferencia?: Date;
    observacaoTransferencia?: string | null;
    idUserTransferencia?: string | null;
}) {
    return await prisma.$transaction(async (tx) => {
        const alocacaoAtual = await tx.tbCadastro.findUnique({
            where: { idCad },
            include: {
                tbStatusPat: true,
                tbFuncionario: true,
                tbPatrimonio: true
            }
        });

        if (!alocacaoAtual) {
            throw new Error("Alocação não encontrada.");
        }
        if (!alocacaoAtual.idPatCad) {
            throw new Error("Alocação sem patrimônio vinculado.");
        }

        const funcionarioDestino = await tx.tbFuncionario.findUnique({
            where: { idMatFun: dados.idMatFunDestino }
        });
        if (!funcionarioDestino) {
            throw new Error("Funcionário de destino não encontrado.");
        }

        const statusTransferidoId = await getStatusIdByDescricao(tx, {
            exact: ["TRANSFERIDO"],
            contains: ["transfer"]
        });
        const statusAtivoId = await getStatusIdByDescricao(tx, { exact: ["ATIVO"] })
            || await getStatusIdByDescricao(tx, { contains: ["ativo"] });

        if (!statusTransferidoId) {
            throw new Error("Status TRANSFERIDO não encontrado.");
        }
        if (!statusAtivoId) {
            throw new Error("Status ATIVO não encontrado.");
        }

        const dataTransferencia = dados.dataTransferencia || new Date();

        await tx.tbCadastro.update({
            where: { idCad: alocacaoAtual.idCad },
            data: {
                idStatusPatCad: statusTransferidoId,
                dataDevPat: dataTransferencia
            }
        });

        await tx.tbTransferenciaAlocacao.create({
            data: {
                idCadastro: alocacaoAtual.idCad,
                idPatrimonio: alocacaoAtual.idPatCad,
                idMatriculaFuncionario: alocacaoAtual.idMatFunCad || null,
                idMatriculaFuncionarioDestino: dados.idMatFunDestino,
                statusAnterior: alocacaoAtual.tbStatusPat?.descricaoStatPat || null,
                statusNovo: "TRANSFERIDO",
                observacao: dados.observacaoTransferencia || null,
                idUserTransferencia: dados.idUserTransferencia || null,
                dataTransferencia
            }
        });

        const novaAlocacao = await tx.tbCadastro.create({
            data: {
                idPatCad: alocacaoAtual.idPatCad,
                idMatFunCad: dados.idMatFunDestino,
                dataCadPat: dataTransferencia,
                dataDevPat: null,
                idStatusPatCad: statusAtivoId
            },
            include: {
                tbFuncionario: true,
                tbPatrimonio: true,
                tbStatusPat: true
            }
        });

        return {
            alocacaoTransferida: alocacaoAtual.idCad,
            novaAlocacao
        };
    });
}

// Buscar patrimônios alocados a um funcionário
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

// Buscar alocações de um patrimônio
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

export async function listarTermosFuncionario(idMatFun: string) {
    return await prisma.tbCadastro.findMany({
        where: {
            idMatFunCad: idMatFun
        },
        include: {
            tbStatusPat: true,
            tbPatrimonio: {
                include: {
                    tbStatusPat: true,
                    tbCCusto: true,
                    tbTipoPat: true
                }
            }
        },
        orderBy: {
            dataCadPat: 'desc'
        }
    });
}

