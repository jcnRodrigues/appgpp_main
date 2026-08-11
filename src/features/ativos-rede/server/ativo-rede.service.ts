import prisma from '../../../../prisma/prisma';
import { listarCentrosCustoAtivosEMobilizados } from '@/features/centro-custo/server/centrocusto.service';

function normalizarTexto(valor?: string | null) {
    return (valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function normalizarCodigoAtivoRede(valor?: string | null) {
    return (valor || '').trim().toUpperCase();
}

function buildAtivoRedeWhere(filtro?: {
    codigo?: string;
    nome?: string;
    serial?: string;
    tipo?: string;
    status?: string;
    local?: string;
    idCCustoAtivoRede?: string;
    idStatusAtivoRede?: string;
}) {
    const conditions: Record<string, unknown>[] = [];

    if (filtro?.codigo) {
        conditions.push({
            codigoAtivoRede: {
                contains: filtro.codigo
            }
        });
    }

    if (filtro?.nome) {
        conditions.push({
            OR: [
                { nomeAtivoRede: { contains: filtro.nome } },
                { fabricanteAtivoRede: { contains: filtro.nome } },
                { modeloAtivoRede: { contains: filtro.nome } },
                { hostnameAtivoRede: { contains: filtro.nome } }
            ]
        });
    }

    if (filtro?.serial) {
        conditions.push({
            OR: [
                { serialAtivoRede: { contains: filtro.serial } },
                { hostnameAtivoRede: { contains: filtro.serial } },
                { nomeAtivoRede: { contains: filtro.serial } }
            ]
        });
    }

    if (filtro?.tipo) {
        conditions.push({
            OR: [
                { tipoAtivoRede: filtro.tipo },
                { tbTipoAtivoRede: { descricaoTipoAtivoRede: filtro.tipo } }
            ]
        });
    }

    if (filtro?.status) {
        conditions.push({
            OR: [
                { statusAtivoRede: filtro.status },
                { tbStatusAtivoRede: { descricaoStatusAtivoRede: filtro.status } }
            ]
        });
    }

    if (filtro?.idStatusAtivoRede) {
        conditions.push({
            idStatusAtivoRede: filtro.idStatusAtivoRede
        });
    }

    if (filtro?.local) {
        conditions.push({
            localInstalacaoAtivoRede: {
                contains: filtro.local
            }
        });
    }

    if (filtro?.idCCustoAtivoRede) {
        conditions.push({
            idCCustoAtivoRede: filtro.idCCustoAtivoRede
        });
    }

    if (conditions.length === 0) {
        return {};
    }

    return {
        AND: conditions
    };
}

type ResolvedLookup = {
    id: string | null;
    descricao: string | null;
};

async function resolverTipoAtivoRede(idTipoAtivoRede?: string | null, fallback?: string | null): Promise<ResolvedLookup> {
    if (idTipoAtivoRede) {
        const tipo = await prisma.tbTipoAtivoRede.findUnique({
            where: { idTipoAtivoRede }
        });
        if (!tipo) {
            throw new Error('Tipo de ativo de rede nÃ£o encontrado');
        }
        return { id: tipo.idTipoAtivoRede, descricao: tipo.descricaoTipoAtivoRede };
    }

    const descricao = fallback?.trim() || null;
    if (!descricao) {
        return { id: null, descricao: null };
    }

    const tipo = await prisma.tbTipoAtivoRede.findFirst({
        where: {
            descricaoTipoAtivoRede: descricao
        }
    });

    return {
        id: tipo?.idTipoAtivoRede || null,
        descricao: tipo?.descricaoTipoAtivoRede || descricao
    };
}

async function resolverStatusAtivoRede(idStatusAtivoRede?: string | null, fallback?: string | null): Promise<ResolvedLookup> {
    if (idStatusAtivoRede) {
        const status = await prisma.tbStatusAtivoRede.findUnique({
            where: { idStatusAtivoRede }
        });
        if (!status) {
            throw new Error('Status de ativo de rede nÃ£o encontrado');
        }
        return { id: status.idStatusAtivoRede, descricao: status.descricaoStatusAtivoRede };
    }

    const descricao = fallback?.trim() || null;
    if (!descricao) {
        return { id: null, descricao: null };
    }

    const status = await prisma.tbStatusAtivoRede.findFirst({
        where: {
            descricaoStatusAtivoRede: descricao
        }
    });

    return {
        id: status?.idStatusAtivoRede || null,
        descricao: status?.descricaoStatusAtivoRede || descricao
    };
}

async function resolverCentroAtivoRede(idCCustoAtivoRede?: string | null, fallback?: string | null): Promise<ResolvedLookup> {
    if (idCCustoAtivoRede) {
        const centro = await prisma.tbCCusto.findUnique({
            where: { idCCusto: idCCustoAtivoRede }
        });
        if (!centro) {
            throw new Error('Centro de custo nÃ£o encontrado');
        }
        return { id: centro.idCCusto, descricao: centro.descricaoCCusto || centro.codigoCCusto || null };
    }

    const descricao = fallback?.trim() || null;
    if (!descricao) {
        return { id: null, descricao: null };
    }

    const centro = await prisma.tbCCusto.findFirst({
        where: {
            OR: [
                { descricaoCCusto: descricao },
                { codigoCCusto: descricao }
            ]
        }
    });

    return {
        id: centro?.idCCusto || null,
        descricao: centro?.descricaoCCusto || centro?.codigoCCusto || descricao
    };
}

async function buscarCentroParaupebasObrigatorio() {
    const centro = await prisma.tbCCusto.findFirst({
        where: {
            OR: [
                { descricaoCCusto: { contains: 'PARAUPEBAS' } },
                { descricaoCCusto: { contains: 'PARAUAPEBAS' } },
                { codigoCCusto: { contains: 'PARAUPEBAS' } },
                { codigoCCusto: { contains: 'PARAUAPEBAS' } }
            ]
        },
        orderBy: {
            descricaoCCusto: 'asc'
        }
    });

    if (!centro) {
        throw new Error('Centro de custo Filial Paraupebas nÃ£o encontrado');
    }

    return centro;
}

export async function listarTiposAtivoRede() {
    return prisma.tbTipoAtivoRede.findMany({
        orderBy: {
            descricaoTipoAtivoRede: 'asc'
        }
    });
}

export async function listarStatusAtivoRede() {
    return prisma.tbStatusAtivoRede.findMany({
        orderBy: {
            descricaoStatusAtivoRede: 'asc'
        }
    });
}

export async function listarCentrosAtivoRede() {
    return listarCentrosCustoAtivosEMobilizados();
}

export async function listarFornecedoresAtivoRede() {
    return prisma.tbFornecedor.findMany({
        select: {
            idFornecedor: true,
            razaoSocialFornecedor: true,
            nomeFantasiaFornecedor: true,
            cnpjFornecedor: true
        },
        orderBy: {
            razaoSocialFornecedor: 'asc'
        }
    });
}

export async function criarTipoAtivoRede(descricaoTipoAtivoRede: string) {
    const descricao = descricaoTipoAtivoRede.trim().toUpperCase();
    if (!descricao) {
        throw new Error('DescriÃ§Ã£o do tipo Ã© obrigatÃ³ria');
    }

    const existente = await prisma.tbTipoAtivoRede.findFirst({
        where: {
            descricaoTipoAtivoRede: descricao
        }
    });

    if (existente) {
        return existente;
    }

    return prisma.tbTipoAtivoRede.create({
        data: {
            descricaoTipoAtivoRede: descricao
        }
    });
}

export async function criarStatusAtivoRede(descricaoStatusAtivoRede: string) {
    const descricao = descricaoStatusAtivoRede.trim().toUpperCase();
    if (!descricao) {
        throw new Error('DescriÃ§Ã£o do status Ã© obrigatÃ³ria');
    }

    const existente = await prisma.tbStatusAtivoRede.findFirst({
        where: {
            descricaoStatusAtivoRede: descricao
        }
    });

    if (existente) {
        return existente;
    }

    return prisma.tbStatusAtivoRede.create({
        data: {
            descricaoStatusAtivoRede: descricao
        }
    });
}

export async function listarAtivosRede(filtro?: {
    codigo?: string;
    nome?: string;
    serial?: string;
    tipo?: string;
    status?: string;
    local?: string;
    idCCustoAtivoRede?: string;
    idStatusAtivoRede?: string;
    skip?: number;
    take?: number;
}) {
    return prisma.tbAtivoRede.findMany({
        where: buildAtivoRedeWhere(filtro),
        include: {
            tbTipoAtivoRede: true,
            tbFornecedor: true,
            tbStatusAtivoRede: true,
            tbCCusto: true,
            tbTransferenciaAtivoRede: {
                include: {
                    tbUser: true
                },
                orderBy: {
                    dataTransferencia: 'desc'
                },
                take: 1
            },
            tbDevolucaoAtivoRede: {
                include: {
                    tbUser: true
                },
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

export async function listarAtivosRedeRelatorio(filtro?: {
    codigo?: string;
    nome?: string;
    serial?: string;
    tipo?: string;
    status?: string;
    local?: string;
    idCCustoAtivoRede?: string;
    idStatusAtivoRede?: string;
}) {
    return prisma.tbAtivoRede.findMany({
        where: buildAtivoRedeWhere(filtro),
        include: {
            tbTipoAtivoRede: true,
            tbFornecedor: true,
            tbStatusAtivoRede: true,
            tbCCusto: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export async function contarAtivosRede(filtro?: {
    codigo?: string;
    nome?: string;
    serial?: string;
    tipo?: string;
    status?: string;
    local?: string;
    idCCustoAtivoRede?: string;
    idStatusAtivoRede?: string;
}) {
    return prisma.tbAtivoRede.count({
        where: buildAtivoRedeWhere(filtro)
    });
}

export async function getAtivoRedeById(idAtivoRedePk: string) {
    return prisma.tbAtivoRede.findUnique({
        where: { idAtivoRedePk },
        include: {
            tbTipoAtivoRede: true,
            tbFornecedor: true,
            tbStatusAtivoRede: true,
            tbCCusto: true,
            tbTransferenciaAtivoRede: {
                include: {
                    tbUser: true
                },
                orderBy: {
                    dataTransferencia: 'desc'
                }
            },
            tbDevolucaoAtivoRede: {
                include: {
                    tbUser: true
                },
                orderBy: {
                    dataInicioDevolucao: 'desc'
                }
            }
        }
    });
}

export async function criarAtivoRede(dados: {
    codigoAtivoRede: string;
    nomeAtivoRede: string;
    idTipoAtivoRede?: string | null;
    tipoAtivoRede?: string;
    idFornecedorAtivoRede?: string | null;
    fabricanteAtivoRede?: string;
    modeloAtivoRede?: string;
    serialAtivoRede?: string;
    macAtivoRede?: string;
    ipGerenciamentoAtivoRede?: string;
    hostnameAtivoRede?: string;
    localInstalacaoAtivoRede?: string;
    rackAtivoRede?: string;
    portaSwitchAtivoRede?: string;
    fotoAtivoRede?: string | null;
    dataEntradaAtivoRede: Date;
    dataInstalacaoAtivoRede?: Date | null;
    idStatusAtivoRede?: string | null;
    statusAtivoRede?: string;
    idCCustoAtivoRede?: string | null;
    centroResponsavelAtivoRede?: string;
    observacaoAtivoRede?: string;
}) {
    const codigoAtivoRede = normalizarCodigoAtivoRede(dados.codigoAtivoRede);
    if (!codigoAtivoRede) {
        throw new Error('Código do ativo de rede é obrigatório');
    }

    const existente = await prisma.tbAtivoRede.findUnique({
        where: { codigoAtivoRede }
    });

    if (existente) {
        throw new Error('Já existe um ativo de rede com este código');
    }

    const tipo = await resolverTipoAtivoRede(dados.idTipoAtivoRede, dados.tipoAtivoRede);
    const status = await resolverStatusAtivoRede(dados.idStatusAtivoRede, dados.statusAtivoRede);
    const centro = await resolverCentroAtivoRede(dados.idCCustoAtivoRede, dados.centroResponsavelAtivoRede);

    if (!tipo.id && !tipo.descricao) {
        throw new Error('Tipo de ativo de rede é obrigatório');
    }

    if (!status.id && !status.descricao) {
        throw new Error('Status de ativo de rede é obrigatório');
    }

    if (!centro.id && !centro.descricao) {
        throw new Error('Centro de custo é obrigatório');
    }

    return prisma.tbAtivoRede.create({
        data: {
            codigoAtivoRede,
            nomeAtivoRede: dados.nomeAtivoRede,
        tipoAtivoRede: tipo.descricao || dados.tipoAtivoRede || 'OUTRO',
        idTipoAtivoRede: tipo.id,
        idFornecedorAtivoRede: dados.idFornecedorAtivoRede || null,
        fabricanteAtivoRede: dados.fabricanteAtivoRede,
            modeloAtivoRede: dados.modeloAtivoRede,
            serialAtivoRede: dados.serialAtivoRede,
            macAtivoRede: dados.macAtivoRede,
            ipGerenciamentoAtivoRede: dados.ipGerenciamentoAtivoRede,
            hostnameAtivoRede: dados.hostnameAtivoRede,
            localInstalacaoAtivoRede: dados.localInstalacaoAtivoRede,
            rackAtivoRede: dados.rackAtivoRede,
            portaSwitchAtivoRede: dados.portaSwitchAtivoRede,
            fotoAtivoRede: dados.fotoAtivoRede ?? null,
            dataEntradaAtivoRede: dados.dataEntradaAtivoRede,
            dataInstalacaoAtivoRede: dados.dataInstalacaoAtivoRede ?? null,
            statusAtivoRede: status.descricao || dados.statusAtivoRede || 'ATIVO',
            idStatusAtivoRede: status.id,
            centroResponsavelAtivoRede: centro.descricao,
            idCCustoAtivoRede: centro.id,
            observacaoAtivoRede: dados.observacaoAtivoRede
        },
        include: {
            tbTipoAtivoRede: true,
            tbFornecedor: true,
            tbStatusAtivoRede: true,
            tbCCusto: true,
            tbTransferenciaAtivoRede: {
                orderBy: {
                    dataTransferencia: 'desc'
                },
                take: 1
            },
            tbDevolucaoAtivoRede: {
                orderBy: {
                    dataInicioDevolucao: 'desc'
                },
                take: 1
            }
        }
    });
}

export async function atualizarAtivoRede(
    idAtivoRedePk: string,
    dados: Partial<{
        codigoAtivoRede: string;
        nomeAtivoRede: string;
        idTipoAtivoRede?: string | null;
        tipoAtivoRede?: string;
        idFornecedorAtivoRede?: string | null;
        fabricanteAtivoRede?: string;
        modeloAtivoRede?: string;
        serialAtivoRede?: string;
        macAtivoRede?: string;
        ipGerenciamentoAtivoRede?: string;
        hostnameAtivoRede?: string;
        localInstalacaoAtivoRede?: string;
        rackAtivoRede?: string;
        portaSwitchAtivoRede?: string;
        fotoAtivoRede?: string | null;
        dataEntradaAtivoRede?: Date;
        dataInstalacaoAtivoRede?: Date | null;
        idStatusAtivoRede?: string | null;
        statusAtivoRede?: string;
        idCCustoAtivoRede?: string | null;
        centroResponsavelAtivoRede?: string;
        observacaoAtivoRede?: string;
    }>
) {
    if (Object.prototype.hasOwnProperty.call(dados, 'codigoAtivoRede') && dados.codigoAtivoRede) {
        const codigoAtivoRede = normalizarCodigoAtivoRede(dados.codigoAtivoRede);
        const existente = await prisma.tbAtivoRede.findFirst({
            where: {
                codigoAtivoRede,
                NOT: {
                    idAtivoRedePk
                }
            },
            select: {
                idAtivoRedePk: true
            }
        });

        if (existente) {
            throw new Error('Já existe um ativo de rede com este código');
        }

        dados.codigoAtivoRede = codigoAtivoRede;
    }

    const payload: Record<string, unknown> = { ...dados };
    const centro = Object.prototype.hasOwnProperty.call(dados, 'idCCustoAtivoRede')
        ? await resolverCentroAtivoRede(dados.idCCustoAtivoRede ?? null, dados.centroResponsavelAtivoRede)
        : null;
    const tipo = Object.prototype.hasOwnProperty.call(dados, 'idTipoAtivoRede') || Object.prototype.hasOwnProperty.call(dados, 'tipoAtivoRede')
        ? await resolverTipoAtivoRede(dados.idTipoAtivoRede ?? null, dados.tipoAtivoRede)
        : null;
    const status = Object.prototype.hasOwnProperty.call(dados, 'idStatusAtivoRede') || Object.prototype.hasOwnProperty.call(dados, 'statusAtivoRede')
        ? await resolverStatusAtivoRede(dados.idStatusAtivoRede ?? null, dados.statusAtivoRede)
        : null;

    if (tipo) {
        payload.tipoAtivoRede = tipo.descricao || dados.tipoAtivoRede || 'OUTRO';
        payload.idTipoAtivoRede = tipo.id;
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'idFornecedorAtivoRede')) {
        payload.idFornecedorAtivoRede = dados.idFornecedorAtivoRede ?? null;
    }

    if (status) {
        payload.statusAtivoRede = status.descricao || dados.statusAtivoRede || 'ATIVO';
        payload.idStatusAtivoRede = status.id;
    }

    if (centro) {
        payload.centroResponsavelAtivoRede = centro.descricao;
        payload.idCCustoAtivoRede = centro.id;
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'fotoAtivoRede')) {
        payload.fotoAtivoRede = dados.fotoAtivoRede ?? null;
    }

    return prisma.tbAtivoRede.update({
        where: { idAtivoRedePk },
        data: payload,
        include: {
            tbTipoAtivoRede: true,
            tbFornecedor: true,
            tbStatusAtivoRede: true,
            tbCCusto: true,
            tbTransferenciaAtivoRede: {
                orderBy: {
                    dataTransferencia: 'desc'
                },
                take: 1
            },
            tbDevolucaoAtivoRede: {
                orderBy: {
                    dataInicioDevolucao: 'desc'
                },
                take: 1
            }
        }
    });
}

export async function listarTransferenciasAtivoRede(idAtivoRedePk: string) {
    return prisma.tbTransferenciaAtivoRede.findMany({
        where: { idAtivoRede: idAtivoRedePk },
        include: { tbUser: true },
        orderBy: { dataTransferencia: 'desc' }
    });
}

export async function listarDevolucoesAtivoRede(idAtivoRedePk: string) {
    return prisma.tbDevolucaoAtivoRede.findMany({
        where: { idAtivoRede: idAtivoRedePk },
        include: { tbUser: true },
        orderBy: { dataInicioDevolucao: 'desc' }
    });
}

export async function transferirAtivoRede(params: {
    idAtivoRedePk: string;
    localDestinoAtivoRede?: string;
    idCCustoDestinoAtivoRede?: string;
    statusNovoAtivoRede?: string;
    observacao?: string;
    idUserTransferencia?: string;
    dataTransferencia?: Date;
}) {
    const ativo = await prisma.tbAtivoRede.findUnique({
        where: { idAtivoRedePk: params.idAtivoRedePk },
        include: {
            tbCCusto: true
        }
    });

    if (!ativo) {
        throw new Error('Ativo de rede nÃ£o encontrado');
    }

    const centroDestino = await resolverCentroAtivoRede(params.idCCustoDestinoAtivoRede, null);
    if (!centroDestino.id) {
        throw new Error('Centro de custo de destino Ã© obrigatÃ³rio');
    }

    const centroDestinoCompleto = await prisma.tbCCusto.findUnique({
        where: { idCCusto: centroDestino.id }
    });

    if (!centroDestinoCompleto) {
        throw new Error('Centro de custo de destino nÃ£o encontrado');
    }

    const statusNovo = (params.statusNovoAtivoRede?.trim() || 'TRANSFERIDO').toUpperCase();
    const statusTransferencia = await resolverStatusAtivoRede(null, statusNovo);

    await prisma.$transaction(async (tx) => {
        await tx.tbTransferenciaAtivoRede.create({
            data: {
                idAtivoRede: params.idAtivoRedePk,
                localOrigemAtivoRede: ativo.localInstalacaoAtivoRede || null,
                localDestinoAtivoRede: params.localDestinoAtivoRede?.trim() || null,
                centroOrigemAtivoRede: ativo.centroResponsavelAtivoRede || null,
                centroDestinoAtivoRede: centroDestinoCompleto.descricaoCCusto || centroDestinoCompleto.codigoCCusto || null,
                statusAnteriorAtivoRede: ativo.statusAtivoRede,
                statusNovoAtivoRede: statusNovo,
                observacao: params.observacao?.trim() || null,
                idUserTransferencia: params.idUserTransferencia || null,
                dataTransferencia: params.dataTransferencia || new Date()
            }
        });

        await tx.tbAtivoRede.update({
            where: { idAtivoRedePk: params.idAtivoRedePk },
            data: {
                localInstalacaoAtivoRede: params.localDestinoAtivoRede?.trim() || ativo.localInstalacaoAtivoRede,
                centroResponsavelAtivoRede: centroDestinoCompleto.descricaoCCusto || centroDestinoCompleto.codigoCCusto || ativo.centroResponsavelAtivoRede,
                idCCustoAtivoRede: centroDestinoCompleto.idCCusto,
                statusAtivoRede: statusTransferencia.descricao || statusNovo,
                idStatusAtivoRede: statusTransferencia.id
            }
        });
    });

    return getAtivoRedeById(params.idAtivoRedePk);
}

export async function devolverAtivoRede(params: {
    idAtivoRedePk: string;
    motivoDevolucao?: string;
    destinoDevolucao?: string;
    notaFiscalDevolucao?: string;
    observacao?: string;
    idUserDevolucao?: string;
    dataInicioDevolucao?: Date;
}) {
    const ativo = await prisma.tbAtivoRede.findUnique({
        where: { idAtivoRedePk: params.idAtivoRedePk }
    });

    if (!ativo) {
        throw new Error('Ativo de rede nÃ£o encontrado');
    }

    const centroParaupebas = await buscarCentroParaupebasObrigatorio();
    const statusDevolucao = await resolverStatusAtivoRede(null, 'DEVOLVIDO');
    const dataInicio = params.dataInicioDevolucao || new Date();

    const devolucaoAberta = await prisma.tbDevolucaoAtivoRede.findFirst({
        where: {
            idAtivoRede: params.idAtivoRedePk,
            dataFimDevolucao: null
        },
        orderBy: {
            dataInicioDevolucao: 'desc'
        }
    });

    if (devolucaoAberta) {
        await prisma.tbDevolucaoAtivoRede.update({
            where: {
                idDevolucaoAtivoRede: devolucaoAberta.idDevolucaoAtivoRede
            },
            data: {
                dataInicioDevolucao: dataInicio,
                motivoDevolucao: params.motivoDevolucao?.trim() || null,
                destinoDevolucao: params.destinoDevolucao?.trim() || centroParaupebas.descricaoCCusto || centroParaupebas.codigoCCusto || null,
                notaFiscalDevolucao: params.notaFiscalDevolucao?.trim() || null,
                observacao: params.observacao?.trim() || null,
                idUserDevolucao: params.idUserDevolucao || null,
                dataFimDevolucao: null
            }
        });
    } else {
        await prisma.tbDevolucaoAtivoRede.create({
            data: {
                idAtivoRede: params.idAtivoRedePk,
                dataInicioDevolucao: dataInicio,
                motivoDevolucao: params.motivoDevolucao?.trim() || null,
                destinoDevolucao: params.destinoDevolucao?.trim() || centroParaupebas.descricaoCCusto || centroParaupebas.codigoCCusto || null,
                notaFiscalDevolucao: params.notaFiscalDevolucao?.trim() || null,
                observacao: params.observacao?.trim() || null,
                idUserDevolucao: params.idUserDevolucao || null
            }
        });
    }

    await prisma.tbAtivoRede.update({
        where: { idAtivoRedePk: params.idAtivoRedePk },
        data: {
            statusAtivoRede: statusDevolucao.descricao || 'DEVOLVIDO',
            idStatusAtivoRede: statusDevolucao.id,
            localInstalacaoAtivoRede: params.destinoDevolucao?.trim() || ativo.localInstalacaoAtivoRede,
            centroResponsavelAtivoRede: centroParaupebas.descricaoCCusto || centroParaupebas.codigoCCusto || ativo.centroResponsavelAtivoRede,
            idCCustoAtivoRede: centroParaupebas.idCCusto
        }
    });

    return getAtivoRedeById(params.idAtivoRedePk);
}

export function normalizarStatusAtivoRede(valor?: string | null) {
    return normalizarTexto(valor);
}


