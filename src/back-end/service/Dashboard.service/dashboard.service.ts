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

// Contar alocações de patrimônio por centro de custo
export async function alocacoesPorCentroCusto() {
    const centros = await prisma.tbCCusto.findMany({
        select: {
            idCCusto: true,
            descricaoCCusto: true,
            tbPatrimonio: {
                select: {
                    idP: true,
                    tbTipoPat: {
                        select: {
                            descricaoTipPat: true
                        }
                    },
                    tbCadastro: {
                        select: {
                            idCad: true
                        }
                    }
                }
            }
        }
    });

    return centros.map(centro => {
        const resultado: Record<string, any> = {
            nome: centro.descricaoCCusto || centro.idCCusto,
        };

        // Agrupar por tipo de patrimônio
        const tiposCont: Record<string, number> = {};
        centro.tbPatrimonio.forEach(pat => {
            const tipoNome = pat.tbTipoPat?.descricaoTipPat || 'Sem Tipo';
            const quantidade = pat.tbCadastro.length;
            tiposCont[tipoNome] = (tiposCont[tipoNome] || 0) + quantidade;
        });

        // Adicionar contagens por tipo ao resultado
        Object.assign(resultado, tiposCont);

        return resultado;
    });
}

// Dados para gráfico de linha (evoluação ao longo do tempo - por month)
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

    // Agrupar por mês
    const porMes: Record<string, number> = {};

    alocacoes.forEach(aloc => {
        if (aloc.dataCadPat) {
            const data = new Date(aloc.dataCadPat);
            const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
            porMes[chave] = (porMes[chave] || 0) + 1;
        }
    });

    return Object.entries(porMes)
        .map(([mes, quantidade]) => ({
            mes,
            quantidade
        }))
        .slice(-12); // Últimos 12 meses
}
