"use server"

import prisma from "../../../../prisma/prisma";

// Contar funcionários
export async function contarFuncionarios() {
    return await prisma.tbFuncionario.count();
}

// Contar funcionários por status
export async function funcionariosPorStatus() {
    return await prisma.tbStatusFun.findMany({
        include: {
            tbFuncionario: {
                select: {
                    idF: true
                }
            }
        }
    });
}

// Contar funcionários por centro de custo
export async function funcionariosPorCentroCusto() {
    return await prisma.tbCCusto.findMany({
        select: {
            idCCusto: true,
            descricaoCCusto: true,
            tbFuncionario: {
                select: {
                    idF: true
                }
            }
        }
    });
}

// Contar alocações de patrimônio por centro de custo (total simples - compatível com chamadas existentes)
export async function alocacoesPorCentroCusto() {
    const centros = await prisma.tbCCusto.findMany({
        select: {
            idCCusto: true,
            descricaoCCusto: true,
            tbPatrimonio: {
                select: {
                    idP: true,
                    tbCadastro: {
                        select: {
                            idCad: true
                        }
                    }
                }
            }
        }
    });

    return centros.map(centro => ({
        nome: centro.descricaoCCusto || centro.idCCusto,
        total: centro.tbPatrimonio.reduce((acc, pat) => acc + pat.tbCadastro.length, 0)
    }));
}

// Alocações por centro de custo e por tipo de patrimônio (para gráfico de barras com tipo e custo)
export async function alocacoesPorCentroCustoETipo() {
    const centros = await prisma.tbCCusto.findMany({
        select: {
            idCCusto: true,
            descricaoCCusto: true,
            tbPatrimonio: {
                select: {
                    idP: true,
                    tbTipoPat: {
                        select: { descricaoTipPat: true }
                    },
                    tbCadastro: {
                        select: { idCad: true }
                    }
                }
            }
        }
    });

    const tiposSet = new Set<string>();
    const porCentro: Record<string, Record<string, number>> = {};

    for (const centro of centros) {
        const nomeCentro = centro.descricaoCCusto || centro.codigoCCusto || centro.idCCusto;
        if (!porCentro[nomeCentro]) porCentro[nomeCentro] = {};

        for (const pat of centro.tbPatrimonio) {
            const tipo = pat.tbTipoPat?.descricaoTipPat?.trim() || 'Sem tipo';
            tiposSet.add(tipo);
            const qtd = pat.tbCadastro.length;
            porCentro[nomeCentro][tipo] = (porCentro[nomeCentro][tipo] || 0) + qtd;
        }
    }

    const tiposOrdenados = Array.from(tiposSet).sort();
    const data = Object.entries(porCentro).map(([nome, contagem]) => {
        const ponto: Record<string, string | number> = { centro: nome };
        for (const tipo of tiposOrdenados) {
            ponto[tipo] = contagem[tipo] || 0;
        }
        return ponto;
    });

    return { data, tipos: tiposOrdenados };
}

// Dados para gráfico de linha (evoluação ao longo do tempo - por mês)
export async function alocacoesAoLongoDoTempo() {
    const alocacoes = await prisma.tbCadastro.findMany({
        select: {
            dataCadPat: true
        },
        where: {
            dataCadPat: {
                not: null
            }
        },
        orderBy: {
            dataCadPat: 'asc'
        }
    });

    const porMes: Record<string, number> = {};
    alocacoes.forEach(aloc => {
        if (aloc.dataCadPat) {
            const data = new Date(aloc.dataCadPat);
            const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
            porMes[chave] = (porMes[chave] || 0) + 1;
        }
    });

    return Object.entries(porMes)
        .map(([mes, quantidade]) => ({ mes, quantidade }))
        .slice(-12);
}

// Evolução das alocações ao longo do tempo por centro de custo (para gráfico de linha)
export async function alocacoesEvolucaoPorCentroCusto() {
    const alocacoes = await prisma.tbCadastro.findMany({
        select: {
            dataCadPat: true,
            idPatCad: true,
            tbPatrimonio: {
                select: {
                    idPat_CustoPat: true,
                    tbCCusto: {
                        select: {
                            idCCusto: true,
                            descricaoCCusto: true,
                            codigoCCusto: true
                        }
                    }
                }
            }
        },
        where: {
            dataCadPat: { not: null }
        },
        orderBy: {
            dataCadPat: 'asc'
        }
    });

    // porMes[mes][centro] = quantidade
    const porMesCentro: Record<string, Record<string, number>> = {};
    const centrosSet = new Set<string>();

    for (const aloc of alocacoes) {
        if (!aloc.dataCadPat) continue;
        const data = new Date(aloc.dataCadPat);
        const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
        const centro = aloc.tbPatrimonio?.tbCCusto
            ? (aloc.tbPatrimonio.tbCCusto.descricaoCCusto || aloc.tbPatrimonio.tbCCusto.codigoCCusto || aloc.tbPatrimonio.tbCCusto.idCCusto)
            : 'Sem centro';
        centrosSet.add(centro);
        if (!porMesCentro[mes]) porMesCentro[mes] = {};
        porMesCentro[mes][centro] = (porMesCentro[mes][centro] || 0) + 1;
    }

    const mesesOrdenados = Object.keys(porMesCentro).sort().slice(-12);
    const centrosOrdenados = Array.from(centrosSet).sort();

    const data = mesesOrdenados.map(mes => {
        const ponto: Record<string, string | number> = { mes };
        for (const centro of centrosOrdenados) {
            ponto[centro] = porMesCentro[mes]?.[centro] ?? 0;
        }
        return ponto;
    });

    return { data, centros: centrosOrdenados };
}
