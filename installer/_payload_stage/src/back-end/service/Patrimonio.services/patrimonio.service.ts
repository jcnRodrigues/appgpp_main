
import prisma from "../../../../prisma/prisma";

function normalizarStatus(valor?: string | null) {
    return (valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function isStatusDevolucao(valor?: string | null) {
    return normalizarStatus(valor).includes('devolu');
}

function buildPatrimonioWhere(filtro?: {
    idPat?: string;
    descricao?: string;
    status?: string;
    statusIds?: string[];
    tipo?: string;
    centroId?: string;
    centros?: string[];
}) {
    const statusIds = (filtro?.statusIds || []).filter(Boolean);
    const centroId = filtro?.centroId;
    const centrosPermitidos = filtro?.centros && filtro.centros.length > 0 ? filtro.centros : undefined;

    let filtroCentro: any = undefined;
    if (centroId) {
        if (centrosPermitidos) {
            filtroCentro = centrosPermitidos.includes(centroId) ? centroId : '__NO_MATCH__';
        } else {
            filtroCentro = centroId;
        }
    } else if (centrosPermitidos) {
        filtroCentro = { in: centrosPermitidos };
    }

    return {
        ...(filtro?.idPat && {
            idPat: {
                contains: filtro.idPat
            }
        }),
        ...(filtro?.descricao && {
            descricaoPat: {
                contains: filtro.descricao
            }
        }),
        ...(statusIds.length > 0 && {
            idPat_StatusPat: {
                in: statusIds
            }
        }),
        ...(statusIds.length === 0 && filtro?.status && {
            idPat_StatusPat: filtro.status
        }),
        ...(filtro?.tipo && {
            idPat_TipoPat: filtro.tipo
        }),
        ...(filtroCentro && {
            idPat_CustoPat: filtroCentro
        })
    };
}

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
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: 'desc'
                },
                take: 1
            },
            tbTransferenciaCustoPatrimonio: {
                include: {
                    custoOrigem: true,
                    custoDestino: true,
                    tbUser: true
                },
                orderBy: {
                    dataTransferencia: 'desc'
                }
            }
            
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
    idPat?: string;
    descricao?: string;
    status?: string;
    statusIds?: string[];
    tipo?: string;
    centroId?: string;
    centros?: string[];
    skip?: number;
    take?: number;
}) {
    return await prisma.tbPatrimonio.findMany({
        where: buildPatrimonioWhere(filtro),
        include: {
            tbStatusPat: true,
            tbTipoPat: true,
            tbCCusto: true,
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: 'desc'
                },
                take: 1
            }
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
    const existente = await prisma.tbPatrimonio.findUnique({
        where: { idPat: dados.idPat },
        include: { tbStatusPat: true }
    });

    if (existente) {
        const statusDescricao = existente.tbStatusPat?.descricaoStatPat;
        if (!isStatusDevolucao(statusDescricao)) {
            throw new Error('Já existe um patrimônio com este ID');
        }

        const ultimaDevolucao = await prisma.tbDevolucao.findFirst({
            where: { idPatrimonio: existente.idP, dataFimDevolucao: null },
            orderBy: { dataInicioDevolucao: 'desc' }
        });

        await prisma.tbPatrimonioHistorico.create({
            data: {
                idPatrimonioOriginal: existente.idP,
                idPat: existente.idPat,
                descricaoPat: existente.descricaoPat,
                valorPat: existente.valorPat,
                dataEntPat: existente.dataEntPat,
                dataSaiPat: existente.dataSaiPat,
                notaFiscalPat: existente.notaFiscalPat,
                idPat_TipoPat: existente.idPat_TipoPat,
                idPat_StatusPat: existente.idPat_StatusPat,
                idPat_CustoPat: existente.idPat_CustoPat,
                dataDevolucao: ultimaDevolucao?.dataInicioDevolucao || null,
                motivoDevolucao: ultimaDevolucao?.motivoDevolucao || null,
                notaFiscalDevolucao: ultimaDevolucao?.notaFiscalDevolucao || null
            }
        });

        if (ultimaDevolucao) {
            await prisma.tbDevolucao.update({
                where: { idDevolucao: ultimaDevolucao.idDevolucao },
                data: { dataFimDevolucao: new Date() }
            });
        }

        return await prisma.tbPatrimonio.update({
            where: { idP: existente.idP },
            data: {
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
                tbCCusto: true,
                tbDevolucao: {
                    orderBy: {
                        dataInicioDevolucao: 'desc'
                    },
                    take: 1
                }
            }
        });
    }

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
            tbCCusto: true,
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: 'desc'
                },
                take: 1
            }
        }
    });
}

export async function listarPatrimoniosPorCentroCusto(
    idCCusto: string,
    options?: { dataInicioMedicao?: Date | null; dataFimMedicao?: Date | null; dataTransferenciaRef?: Date | null }
) {
    const dataInicioMedicao = options?.dataInicioMedicao || null;
    const dataFimMedicao = options?.dataFimMedicao || null;
    const dataTransferenciaRef = options?.dataTransferenciaRef || null;

    const patrimonios = await prisma.tbPatrimonio.findMany({
        where: dataFimMedicao
            ? {
                dataEntPat: { lte: dataFimMedicao },
                OR: [
                    { dataSaiPat: null },
                    { dataSaiPat: { gte: dataInicioMedicao || dataFimMedicao } }
                ],
                AND: [
                    {
                        OR: [
                            { idPat_CustoPat: idCCusto },
                            {
                                tbTransferenciaCustoPatrimonio: {
                                    some: {
                                        OR: [
                                            { idCustoOrigem: idCCusto },
                                            { idCustoDestino: idCCusto }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
            : {
                idPat_CustoPat: idCCusto
            },
        select: {
            idP: true,
            idPat: true,
            descricaoPat: true,
            valorPat: true,
            dataEntPat: true,
            dataSaiPat: true,
            idPat_CustoPat: true,
            tbStatusPat: {
                select: {
                    descricaoStatPat: true
                }
            },
            tbTransferenciaCustoPatrimonio: {
                select: {
                    idCustoOrigem: true,
                    idCustoDestino: true,
                    dataTransferencia: true,
                    custoOrigem: {
                        select: {
                            codigoCCusto: true,
                            descricaoCCusto: true
                        }
                    },
                    custoDestino: {
                        select: {
                            codigoCCusto: true,
                            descricaoCCusto: true
                        }
                    }
                },
                orderBy: {
                    dataTransferencia: 'asc'
                }
            },
            tbTransferenciaAlocacao: {
                where: dataTransferenciaRef
                    ? {
                        dataTransferencia: { lte: dataTransferenciaRef }
                    }
                    : undefined,
                select: {
                    idMatriculaFuncionario: true,
                    idMatriculaFuncionarioDestino: true,
                    dataTransferencia: true
                    ,
                    tbFuncionario: {
                        select: {
                            nomeFun: true
                        }
                    },
                    tbFuncionarioDestino: {
                        select: {
                            nomeFun: true
                        }
                    }
                },
                orderBy: {
                    dataTransferencia: 'desc'
                }
            },
            tbDevolucao: {
                select: {
                    dataInicioDevolucao: true,
                    dataFimDevolucao: true
                },
                orderBy: {
                    dataInicioDevolucao: 'asc'
                }
            },
            tbCadastro: {
                where: dataFimMedicao
                    ? {
                        dataCadPat: { lte: dataFimMedicao },
                        OR: [
                            { dataDevPat: null },
                            { dataDevPat: { gt: dataFimMedicao } }
                        ]
                    }
                    : {
                        dataDevPat: null
                    },
                select: {
                    idMatFunCad: true,
                    tbFuncionario: {
                        select: {
                            nomeFun: true
                        }
                    }
                },
                orderBy: {
                    dataCadPat: 'desc'
                },
                take: 1
            }
        },
        orderBy: {
            idPat: 'asc'
        }
    });

    if (!dataInicioMedicao || !dataFimMedicao) {
        return patrimonios as Array<(typeof patrimonios)[number] & { valorRateado: number }>;
    }

    const inicio = dataInicioMedicao.getTime();
    const fim = dataFimMedicao.getTime();
    const fimExclusivo = fim + 1;
    const totalPeriodoMs = Math.max(1, fimExclusivo - inicio);

    const calcularMsNoCentro = (pat: (typeof patrimonios)[number]) => {
        const transferencias = [...pat.tbTransferenciaCustoPatrimonio].sort(
            (a, b) => a.dataTransferencia.getTime() - b.dataTransferencia.getTime()
        );

        let centroInicial = pat.idPat_CustoPat;
        for (let i = transferencias.length - 1; i >= 0; i -= 1) {
            const t = transferencias[i];
            if (centroInicial && t.idCustoDestino === centroInicial && t.idCustoOrigem) {
                centroInicial = t.idCustoOrigem;
            }
        }

        let centroAtual = centroInicial;
        let cursor = pat.dataEntPat.getTime();
        const primeiraDevolucaoMs = pat.tbDevolucao
            .map((d) => d.dataInicioDevolucao.getTime())
            .sort((a, b) => a - b)[0];
        const limiteSaida = Math.min(
            pat.dataSaiPat ? pat.dataSaiPat.getTime() : Number.POSITIVE_INFINITY,
            primeiraDevolucaoMs ?? Number.POSITIVE_INFINITY
        );
        let msNoCentro = 0;

        const somarSobreposicao = (segInicio: number, segFim: number) => {
            if (segFim <= segInicio) return;
            const inicioOverlap = Math.max(segInicio, inicio);
            const fimOverlap = Math.min(segFim, fimExclusivo);
            if (fimOverlap > inicioOverlap && centroAtual === idCCusto) {
                msNoCentro += fimOverlap - inicioOverlap;
            }
        };

        for (const t of transferencias) {
            const dataTransf = t.dataTransferencia.getTime();
            if (dataTransf <= cursor) continue;
            const segFim = Math.min(dataTransf, limiteSaida);
            somarSobreposicao(cursor, segFim);
            if (segFim >= limiteSaida) {
                cursor = limiteSaida;
                break;
            }
            if (t.idCustoDestino) {
                centroAtual = t.idCustoDestino;
            }
            cursor = dataTransf;
        }

        if (cursor < limiteSaida) {
            somarSobreposicao(cursor, limiteSaida);
        }

        return msNoCentro;
    };

    return patrimonios.map((p) => {
            const msNoCentro = calcularMsNoCentro(p);
            const fator = msNoCentro / totalPeriodoMs;
            const valorRateado = Number(((p.valorPat || 0) * fator).toFixed(2));
            return {
                ...p,
                valorRateado,
                rateioInfo: {
                    msNoCentro,
                    totalPeriodoMs,
                    fator
                }
            };
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
            tbCCusto: true,
            tbDevolucao: {
                orderBy: {
                    dataInicioDevolucao: 'desc'
                },
                take: 1
            }
        }
    });
}

export async function listarTransferenciasCustoPatrimonio(idPatrimonio: string) {
    return await prisma.tbTransferenciaCustoPatrimonio.findMany({
        where: { idPatrimonio },
        include: {
            custoOrigem: true,
            custoDestino: true,
            tbUser: true
        },
        orderBy: {
            dataTransferencia: 'desc'
        }
    });
}

export async function transferirCentroCustoPatrimonio(params: {
    idPatrimonio: string;
    idCustoDestino: string;
    observacao?: string;
    dataTransferencia?: Date;
    idUserTransferencia?: string;
}) {
    const patrimonio = await prisma.tbPatrimonio.findUnique({
        where: { idP: params.idPatrimonio },
        select: {
            idP: true,
            valorPat: true,
            idPat_CustoPat: true
        }
    });

    if (!patrimonio) {
        throw new Error('Patrimônio não encontrado');
    }

    if (patrimonio.idPat_CustoPat === params.idCustoDestino) {
        throw new Error('O centro de custo de destino é igual ao centro atual');
    }

    const centroDestino = await prisma.tbCCusto.findUnique({
        where: { idCCusto: params.idCustoDestino },
        select: { idCCusto: true }
    });

    if (!centroDestino) {
        throw new Error('Centro de custo de destino não encontrado');
    }

    await prisma.$transaction(async (tx) => {
        await tx.tbTransferenciaCustoPatrimonio.create({
            data: {
                idPatrimonio: params.idPatrimonio,
                idCustoOrigem: patrimonio.idPat_CustoPat || null,
                idCustoDestino: params.idCustoDestino,
                valorTransferido: patrimonio.valorPat,
                observacao: params.observacao?.trim() || null,
                idUserTransferencia: params.idUserTransferencia || null,
                dataTransferencia: params.dataTransferencia || new Date()
            }
        });

        await tx.tbPatrimonio.update({
            where: { idP: params.idPatrimonio },
            data: {
                idPat_CustoPat: params.idCustoDestino
            }
        });
    });

    return await getPatrimonioCardById(params.idPatrimonio);
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
export async function contarPatrimonios(filtro?: {
    idPat?: string;
    descricao?: string;
    status?: string;
    statusIds?: string[];
    tipo?: string;
    centroId?: string;
    centros?: string[];
}) {
    return await prisma.tbPatrimonio.count({
        where: buildPatrimonioWhere(filtro)
    });
}

