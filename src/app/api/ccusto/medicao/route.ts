import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { listarPatrimoniosPorCentroCusto } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import prisma from '../../../../../prisma/prisma';

export const runtime = 'nodejs';

type LinhaMedicao = {
    linha: number;
    idPat: string;
    descricaoPat: string | null;
    matriculaAlocada: string | null;
    nomeFuncionarioAlocado: string | null;
    statusPatrimonio: string | null;
    badgeAlocacao?: string | null;
    dataTransferenciaConsiderada?: string | null;
    valorInformado: number | null;
    valorSistema: number | null;
    detalheRateio: string | null;
    movimentosPatrimonio: string | null;
    status: 'OK' | 'VALOR_DIVERGENTE' | 'NAO_ENCONTRADO' | 'INVALIDO';
    mensagem: string;
};

function normalizarTexto(value?: string | null) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function formatarDataPtBr(value?: Date | string | null) {
    if (!value) return null;
    const data = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(data.getTime())) return null;
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(data);
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formatarPercentual(fator: number) {
    return `${(fator * 100).toFixed(2).replace('.', ',')}%`;
}

function formatarDataCurta(value?: Date | string | null) {
    if (!value) return null;
    const data = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(data.getTime())) return null;
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(data);
}

function obterDetalheDevolucao(patrimonio: {
    tbStatusPat?: { descricaoStatPat?: string | null } | null;
    tbDevolucao?: Array<{
        dataInicioDevolucao: Date;
        dataFimDevolucao: Date | null;
        dataSaidaFornecedor?: Date | null;
        dataChegadaFornecedor?: Date | null;
    }>;
}) {
    const status = normalizarTexto(patrimonio.tbStatusPat?.descricaoStatPat);
    const statusDevolvido = status.includes('devolv');
    if (!statusDevolvido) {
        return { devolvido: false, detalhe: null as string | null };
    }

    const ultimaDevolucao = patrimonio.tbDevolucao?.[0];
    if (!ultimaDevolucao) {
        return {
            devolvido: true,
            detalhe: 'Sem movimentação de devolução registrada.'
        };
    }

    const inicio = formatarDataPtBr(ultimaDevolucao.dataInicioDevolucao) || 'data não informada';
    const chegadaFornecedor = formatarDataPtBr(ultimaDevolucao.dataChegadaFornecedor);
    const fim = formatarDataPtBr(ultimaDevolucao.dataFimDevolucao);
    return {
        devolvido: true,
        detalhe: fim
            ? `Movimentação de devolução: de ${inicio} até ${fim}.`
            : chegadaFornecedor
                ? `Movimentação de devolução: iniciada em ${inicio} com chegada ao fornecedor em ${chegadaFornecedor}.`
            : `Movimentação de devolução iniciada em ${inicio} (sem data de fim).`
    };
}

function validarStatusPatrimonio(patrimonio: {
    tbStatusPat?: { descricaoStatPat?: string | null } | null;
    tbDevolucao?: Array<{ dataInicioDevolucao: Date; dataFimDevolucao: Date | null }>;
}) {
    const statusOriginal = String(patrimonio.tbStatusPat?.descricaoStatPat || '').trim();
    const statusNormalizado = normalizarTexto(statusOriginal);
    const temMovimentacaoDevolucao = !!patrimonio.tbDevolucao?.[0];
    const statusEhDevolvido = statusNormalizado.includes('devolv');

    if (!statusOriginal) {
        return {
            statusExibicao: temMovimentacaoDevolucao ? 'SEM STATUS (COM DEVOLUÇÃO)' : 'SEM STATUS',
            alerta: 'Patrimônio sem status cadastrado.'
        };
    }

    if (statusEhDevolvido && !temMovimentacaoDevolucao) {
        return {
            statusExibicao: statusOriginal,
            alerta: 'Status devolvido sem movimentação de devolução registrada.'
        };
    }

    if (!statusEhDevolvido && temMovimentacaoDevolucao) {
        return {
            statusExibicao: `${statusOriginal} (COM MOV. DE DEVOLUÇÃO)`,
            alerta: 'Há movimentação de devolução vinculada a este patrimônio.'
        };
    }

    return {
        statusExibicao: statusOriginal,
        alerta: null as string | null
    };
}

function construirMovimentosPatrimonio(params: {
    patrimonio: {
        dataEntPat?: Date | null;
        tbDevolucao?: Array<{
            dataInicioDevolucao: Date;
            dataFimDevolucao: Date | null;
            dataSaidaFornecedor?: Date | null;
            dataChegadaFornecedor?: Date | null;
        }>;
        tbTransferenciaAlocacao?: Array<{ dataTransferencia: Date }>;
        tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
        rateioInfo?: { fator: number };
    };
    dataInicioMedicao: Date;
    dataFimMedicao: Date;
}) {
    const { patrimonio, dataInicioMedicao, dataFimMedicao } = params;
    const movimentos: string[] = [];
    const inicio = dataInicioMedicao.getTime();
    const fim = dataFimMedicao.getTime();
    const estaRateado = !!patrimonio.rateioInfo && patrimonio.rateioInfo.fator > 0 && patrimonio.rateioInfo.fator < 1;

    const entrada = patrimonio.dataEntPat ? patrimonio.dataEntPat.getTime() : null;
    if (entrada !== null) {
        if (entrada < inicio) {
            movimentos.push(`Entrada antes do período (${formatarDataCurta(patrimonio.dataEntPat)})`);
        } else if (entrada >= inicio && entrada <= fim) {
            movimentos.push(`Entrada no período (${formatarDataCurta(patrimonio.dataEntPat)})${estaRateado ? ' com rateio' : ''}`);
        }
    }

    const transferenciaAlocacao = patrimonio.tbTransferenciaAlocacao
        ?.map((t) => t.dataTransferencia)
        .sort((a, b) => b.getTime() - a.getTime())[0] || null;
    if (transferenciaAlocacao) {
        const dataMs = transferenciaAlocacao.getTime();
        if (dataMs < inicio) {
            movimentos.push(`Transferência de alocação antes do período (${formatarDataCurta(transferenciaAlocacao)})`);
        } else if (dataMs >= inicio && dataMs <= fim) {
            movimentos.push(`Transferência de alocação no período (${formatarDataCurta(transferenciaAlocacao)})${estaRateado ? ' com rateio' : ''}`);
        }
    }

    const devolucao = patrimonio.tbDevolucao
        ?.map((d) => d.dataChegadaFornecedor || d.dataFimDevolucao || d.dataInicioDevolucao)
        .sort((a, b) => a.getTime() - b.getTime())[0] || null;
    if (devolucao) {
        const devolucaoMs = devolucao.getTime();
        if (devolucaoMs < inicio) {
            movimentos.push(`Devolvido em ${formatarDataCurta(devolucao)}`);
        } else if (devolucaoMs >= inicio && devolucaoMs <= fim) {
            movimentos.push(`Chegada do fornecedor no período (${formatarDataCurta(devolucao)})${estaRateado ? ' com rateio' : ''}`);
        } else {
            movimentos.push(`Chegada do fornecedor após o período (${formatarDataCurta(devolucao)})`);
        }
    }

    const transferenciasNoPeriodo = patrimonio.tbTransferenciaCustoPatrimonio?.filter((t) => {
        const data = t.dataTransferencia.getTime();
        return data <= fim;
    }) || [];
    if (transferenciasNoPeriodo.length > 0) {
        const dataReferencia = transferenciasNoPeriodo[transferenciasNoPeriodo.length - 1]?.dataTransferencia || transferenciasNoPeriodo[0]?.dataTransferencia;
        const ultimaTransferenciaAlocacao = patrimonio.tbTransferenciaAlocacao?.[0]?.dataTransferencia || null;
        if (dataReferencia) {
            const dataMs = dataReferencia.getTime();
            if (ultimaTransferenciaAlocacao && dataMs === ultimaTransferenciaAlocacao.getTime()) {
                return movimentos.join(' | ') || null;
            }
            if (dataMs < inicio) {
                movimentos.push(`Transferência antes do período (${formatarDataCurta(dataReferencia)})`);
            } else if (dataMs >= inicio && dataMs <= fim) {
                movimentos.push(`Transferência no período (${formatarDataCurta(dataReferencia)})${estaRateado ? ' com rateio' : ''}`);
            }
        }
    }

    return movimentos.filter((movimento) => !movimento.includes('Transferência de alocação')).join(' | ') || null;
}

function normalizarHeader(value: unknown) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function parseValor(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const texto = String(value)
        .trim()
        .replace(/r\$/gi, '')
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9.-]/g, '');
    if (!texto) return null;
    const numero = Number(texto);
    return Number.isFinite(numero) ? numero : null;
}

async function carregarPatrimonioGlobal(idPat: string) {
    return prisma.tbPatrimonio.findFirst({
        where: { idPat },
        select: {
            idPat: true,
            descricaoPat: true,
            valorPat: true,
            dataEntPat: true,
            dataSaiPat: true,
            tbStatusPat: {
                select: {
                    descricaoStatPat: true
                }
            },
            tbDevolucao: {
                select: {
                    dataInicioDevolucao: true,
                    dataSaidaFornecedor: true,
                    dataChegadaFornecedor: true,
                    dataFimDevolucao: true
                },
                orderBy: {
                    dataInicioDevolucao: 'asc'
                }
            },
            tbTransferenciaAlocacao: {
                select: {
                    dataTransferencia: true
                },
                orderBy: {
                    dataTransferencia: 'asc'
                }
            },
            tbTransferenciaCustoPatrimonio: {
                select: {
                    dataTransferencia: true,
                    custoDestino: {
                        select: {
                            codigoCCusto: true,
                            descricaoCCusto: true
                        }
                    }
                },
                orderBy: {
                    dataTransferencia: 'desc'
                }
            },
            tbCadastro: {
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
        }
    });
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'MEDICAO_CCUSTO');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissao para processar medicao' }, { status: 403 });
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const idCCusto = formData.get('idCCusto');
        const dataInicioMedicaoRaw = formData.get('dataInicioMedicao');
        const dataFimMedicaoRaw = formData.get('dataFimMedicao');

        if (!idCCusto || typeof idCCusto !== 'string') {
            return NextResponse.json({ message: 'Centro de custo inválido.' }, { status: 400 });
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0 && !centros.includes(idCCusto)) {
            return NextResponse.json({ message: 'Centro de custo não permitido.' }, { status: 403 });
        }
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ message: 'Arquivo Excel não informado.' }, { status: 400 });
        }

        const dataInicioMedicao =
            typeof dataInicioMedicaoRaw === 'string' && dataInicioMedicaoRaw
                ? new Date(`${dataInicioMedicaoRaw}T00:00:00`)
                : null;
        const dataFimMedicao =
            typeof dataFimMedicaoRaw === 'string' && dataFimMedicaoRaw
                ? new Date(`${dataFimMedicaoRaw}T23:59:59.999`)
                : null;

        if (!dataInicioMedicao || Number.isNaN(dataInicioMedicao.getTime())) {
            return NextResponse.json({ message: 'Data de início da medição inválida.' }, { status: 400 });
        }
        if (!dataFimMedicao || Number.isNaN(dataFimMedicao.getTime())) {
            return NextResponse.json({ message: 'Data de fim da medição inválida.' }, { status: 400 });
        }
        if (dataInicioMedicao > dataFimMedicao) {
            return NextResponse.json(
                { message: 'Data de início não pode ser maior que a data de fim da medição.' },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            return NextResponse.json({ message: 'Planilha não encontrada no arquivo.' }, { status: 400 });
        }

        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Planilha vazia.' }, { status: 400 });
        }

        const header = rows[0] ?? [];
        const headerIndex = header.map(normalizarHeader);
        const idIndex = headerIndex.findIndex((h) => ['idpat', 'patrimonio', 'id'].includes(h));
        const valorIndex = headerIndex.findIndex((h) => ['valor', 'valorpat', 'valorpatrimonio'].includes(h));

        if (idIndex === -1 || valorIndex === -1) {
            return NextResponse.json(
                { message: 'Cabeçalho inválido. Use colunas "idPat" e "valor".' },
                { status: 400 }
            );
        }

        const patrimoniosCentro = await listarPatrimoniosPorCentroCusto(idCCusto, {
            dataInicioMedicao,
            dataFimMedicao,
            dataTransferenciaRef: dataFimMedicao
        });
        const mapaPatrimonios = new Map(
            patrimoniosCentro.map((p) => [String(p.idPat).toUpperCase(), p])
        );

        const resultados: LinhaMedicao[] = [];
        const idsArquivo = new Set<string>();

        for (let i = 1; i < rows.length; i += 1) {
            const row = rows[i] ?? [];
            const idPatRaw = row[idIndex];
            const valorRaw = row[valorIndex];

            const idPat = String(idPatRaw || '').trim().toUpperCase();
            const valorInformado = parseValor(valorRaw);

            if (!idPat) {
                resultados.push({
                    linha: i + 1,
                    idPat: '',
                    descricaoPat: null,
                    matriculaAlocada: null,
                    nomeFuncionarioAlocado: null,
                    statusPatrimonio: null,
                    valorInformado,
                    valorSistema: null,
                    detalheRateio: null,
                    movimentosPatrimonio: null,
                    status: 'INVALIDO',
                    mensagem: 'ID do patrimônio vazio.'
                });
                continue;
            }

            idsArquivo.add(idPat);
            const patrimonio = mapaPatrimonios.get(idPat);

            if (!patrimonio) {
                const patrimonioGlobal = await carregarPatrimonioGlobal(idPat);
                if (patrimonioGlobal) {
                    const movimentosPatrimonio = construirMovimentosPatrimonio({
                        patrimonio: patrimonioGlobal as {
                            dataEntPat?: Date | null;
                            tbDevolucao?: Array<{ dataInicioDevolucao: Date; dataFimDevolucao: Date | null }>;
                            tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
                            rateioInfo?: { fator: number };
                        },
                        dataInicioMedicao,
                        dataFimMedicao
                    });
                    resultados.push({
                        linha: i + 1,
                        idPat,
                        descricaoPat: patrimonioGlobal.descricaoPat ?? null,
                        matriculaAlocada: patrimonioGlobal.tbCadastro?.[0]?.idMatFunCad ?? null,
                        nomeFuncionarioAlocado: patrimonioGlobal.tbCadastro?.[0]?.tbFuncionario?.nomeFun ?? null,
                        statusPatrimonio: patrimonioGlobal.tbStatusPat?.descricaoStatPat ?? null,
                        valorInformado,
                        valorSistema: patrimonioGlobal.valorPat ?? null,
                        detalheRateio: null,
                        movimentosPatrimonio,
                        dataTransferenciaConsiderada: patrimonioGlobal.tbTransferenciaCustoPatrimonio?.[0]?.dataTransferencia
                            ? formatarDataPtBr(patrimonioGlobal.tbTransferenciaCustoPatrimonio[0].dataTransferencia)
                            : null,
                        status: 'NAO_ENCONTRADO',
                        mensagem: 'Patrimônio encontrado, mas fora do centro de custo selecionado.'
                    });
                    continue;
                }

                resultados.push({
                    linha: i + 1,
                    idPat,
                    descricaoPat: null,
                    matriculaAlocada: null,
                    nomeFuncionarioAlocado: null,
                    statusPatrimonio: null,
                    valorInformado,
                    valorSistema: null,
                    detalheRateio: null,
                    movimentosPatrimonio: null,
                    status: 'NAO_ENCONTRADO',
                    mensagem: 'Patrimônio não está atribuído ao centro de custo e não foi localizado na base.'
                });
                continue;
            }

            const valorSistema = (patrimonio as { valorRateado?: number }).valorRateado ?? patrimonio.valorPat ?? null;
            const valorBase = patrimonio.valorPat ?? null;
            const rateioInfo = (patrimonio as {
                rateioInfo?: { msNoCentro: number; totalPeriodoMs: number; fator: number }
            }).rateioInfo;
            const transferenciaAlocacaoData = (patrimonio as {
                tbTransferenciaAlocacao?: Array<{ dataTransferencia: Date }>;
            }).tbTransferenciaAlocacao?.[0]?.dataTransferencia || null;
            const transferenciaCustoData = (patrimonio as {
                tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
            }).tbTransferenciaCustoPatrimonio
                ?.filter((t) => t.dataTransferencia.getTime() <= dataFimMedicao.getTime())
                ?.sort((a, b) => b.dataTransferencia.getTime() - a.dataTransferencia.getTime())[0]?.dataTransferencia || null;
            const chegadaFornecedorData = patrimonio.tbDevolucao?.[0]?.dataChegadaFornecedor || null;
            const msDia = 1000 * 60 * 60 * 24;
            const diasNoCentro = rateioInfo ? Math.max(0, Math.round(rateioInfo.msNoCentro / msDia)) : null;
            const diasPeriodo = rateioInfo ? Math.max(1, Math.round(rateioInfo.totalPeriodoMs / msDia)) : null;
            const parametrosRateio = [
                `Base da medição: ${formatarDataPtBr(dataInicioMedicao) || '-' } até ${formatarDataPtBr(dataFimMedicao) || '-'}`,
                `Chegada do fornecedor: ${chegadaFornecedorData ? formatarDataPtBr(chegadaFornecedorData) : '-'}`,
                `Corte por transferência de alocação: ${transferenciaAlocacaoData ? formatarDataPtBr(transferenciaAlocacaoData) : '-'}`,
                `Transferência entre custos: ${transferenciaCustoData ? formatarDataPtBr(transferenciaCustoData) : '-'}`
            ].join(' | ');
            const detalheRateio =
                rateioInfo && valorBase !== null && valorSistema !== null
                    ? [
                        `Valor: ${formatarMoeda(valorBase)}`,
                        `Rateio: ${formatarPercentual(rateioInfo.fator)}`,
                        `Dias: ${diasNoCentro}/${diasPeriodo}`,
                        `Resultado: ${formatarMoeda(valorSistema)}`
                    ].join(' | ')
                    : null;
            const movimentosPatrimonio = construirMovimentosPatrimonio({
                patrimonio: patrimonio as {
                    dataEntPat?: Date | null;
                    tbDevolucao?: Array<{ dataInicioDevolucao: Date; dataFimDevolucao: Date | null }>;
                    tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
                    rateioInfo?: { fator: number };
                },
                dataInicioMedicao,
                dataFimMedicao
            });

            const tolerancia = 0.01;
            const valorOk =
                valorInformado !== null &&
                valorSistema !== null &&
                Math.abs(valorInformado - valorSistema) <= tolerancia;

            resultados.push({
                linha: i + 1,
                idPat,
                descricaoPat: patrimonio.descricaoPat ?? null,
                matriculaAlocada: (() => {
                    const transfAloc = (patrimonio as {
                        tbTransferenciaAlocacao?: Array<{
                            idMatriculaFuncionario: string | null;
                            idMatriculaFuncionarioDestino: string | null;
                            tbFuncionario?: { nomeFun?: string | null } | null;
                            tbFuncionarioDestino?: { nomeFun?: string | null } | null;
                            dataTransferencia: Date;
                        }>;
                    }).tbTransferenciaAlocacao?.[0];
                    const transfCusto = (patrimonio as {
                        tbTransferenciaCustoPatrimonio?: Array<{
                            dataTransferencia: Date;
                            custoDestino?: { codigoCCusto?: string | null; descricaoCCusto?: string | null } | null;
                        }>;
                    }).tbTransferenciaCustoPatrimonio
                        ?.filter((t) => t.dataTransferencia.getTime() <= dataFimMedicao.getTime())
                        ?.sort((a, b) => b.dataTransferencia.getTime() - a.dataTransferencia.getTime())[0];
                    const matriculaTransferencia = transfAloc?.idMatriculaFuncionarioDestino || transfAloc?.idMatriculaFuncionario || null;
                    if (!matriculaTransferencia) return patrimonio.tbCadastro?.[0]?.idMatFunCad ?? null;
                    const custoLabel = transfCusto?.custoDestino
                        ? `${transfCusto.custoDestino.codigoCCusto ? `${transfCusto.custoDestino.codigoCCusto} - ` : ''}${transfCusto.custoDestino.descricaoCCusto || ''}`.trim()
                        : '';
                    return custoLabel ? `${matriculaTransferencia} | ${custoLabel}` : matriculaTransferencia;
                })(),
                nomeFuncionarioAlocado: (() => {
                    const transfAloc = (patrimonio as {
                        tbTransferenciaAlocacao?: Array<{
                            idMatriculaFuncionario: string | null;
                            idMatriculaFuncionarioDestino: string | null;
                            tbFuncionario?: { nomeFun?: string | null } | null;
                            tbFuncionarioDestino?: { nomeFun?: string | null } | null;
                            dataTransferencia: Date;
                        }>;
                    }).tbTransferenciaAlocacao?.[0];
                    if (transfAloc?.idMatriculaFuncionarioDestino) return transfAloc?.tbFuncionarioDestino?.nomeFun ?? patrimonio.tbCadastro?.[0]?.tbFuncionario?.nomeFun ?? null;
                    if (transfAloc?.idMatriculaFuncionario) return transfAloc?.tbFuncionario?.nomeFun ?? patrimonio.tbCadastro?.[0]?.tbFuncionario?.nomeFun ?? null;
                    return patrimonio.tbCadastro?.[0]?.tbFuncionario?.nomeFun ?? null;
                })(),
                badgeAlocacao: (() => {
                    const transfAloc = (patrimonio as { tbTransferenciaAlocacao?: Array<unknown> }).tbTransferenciaAlocacao?.[0];
                    const transfCusto = (patrimonio as {
                        tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
                    }).tbTransferenciaCustoPatrimonio
                        ?.filter((t) => t.dataTransferencia.getTime() <= dataFimMedicao.getTime())
                        ?.sort((a, b) => b.dataTransferencia.getTime() - a.dataTransferencia.getTime())[0];
                    if (transfAloc) return 'Alocação por transferência';
                    if (transfCusto) return 'Transferência entre centros de custo';
                    return null;
                })(),
                dataTransferenciaConsiderada: (() => {
                    const transfAloc = (patrimonio as {
                        tbTransferenciaAlocacao?: Array<{ dataTransferencia: Date }>;
                    }).tbTransferenciaAlocacao?.[0]?.dataTransferencia || null;
                    const transfCusto = (patrimonio as {
                        tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
                    }).tbTransferenciaCustoPatrimonio
                        ?.filter((t) => t.dataTransferencia.getTime() <= dataFimMedicao.getTime())
                        ?.sort((a, b) => b.dataTransferencia.getTime() - a.dataTransferencia.getTime())[0]?.dataTransferencia || null;
                    const ultima = [transfAloc, transfCusto]
                        .filter((d): d is Date => !!d)
                        .sort((a, b) => b.getTime() - a.getTime())[0] || null;
                    return ultima ? formatarDataPtBr(ultima) : null;
                })(),
                statusPatrimonio: patrimonio.tbStatusPat?.descricaoStatPat ?? null,
                valorInformado,
                valorSistema,
                detalheRateio: detalheRateio
                    ? detalheRateio
                        .replace(/\s*\|\s*Base da medição:[^|]*/gi, '')
                        .replace(/\s*\|\s*Transferência de alocação:[^|]*/gi, '')
                        .replace(/\s{2,}/g, ' ')
                        .trim()
                    : null,
                movimentosPatrimonio,
                status: valorOk ? 'OK' : 'VALOR_DIVERGENTE',
                mensagem: valorOk ? 'Valor confere.' : 'Valor divergente.'
            });
        }

        const naoInformados = patrimoniosCentro
            .filter((p) => !idsArquivo.has(String(p.idPat).toUpperCase()))
            .map((p) => {
                const devolucao = obterDetalheDevolucao(p);
                const statusValidado = validarStatusPatrimonio(p);
                const detalheComValidacao = [
                    devolucao.detalhe,
                    statusValidado.alerta
                ]
                    .filter(Boolean)
                    .join(' ');
                const movimentosPatrimonio = construirMovimentosPatrimonio({
                    patrimonio: p as {
                        dataEntPat?: Date | null;
                        tbDevolucao?: Array<{ dataInicioDevolucao: Date; dataFimDevolucao: Date | null }>;
                        tbTransferenciaCustoPatrimonio?: Array<{ dataTransferencia: Date }>;
                        rateioInfo?: { fator: number };
                    },
                    dataInicioMedicao,
                    dataFimMedicao
                });
                return {
                    idPat: p.idPat,
                    descricaoPat: p.descricaoPat,
                    valorSistema: (p as { valorRateado?: number }).valorRateado ?? p.valorPat ?? null,
                    statusPatrimonio: statusValidado.statusExibicao,
                    devolvido: devolucao.devolvido,
                    detalheDevolucao: [movimentosPatrimonio, detalheComValidacao].filter(Boolean).join(' | ') || null
                };
            });

        const resumo = {
            totalLinhas: resultados.length,
            ok: resultados.filter((r) => r.status === 'OK').length,
            divergentes: resultados.filter((r) => r.status === 'VALOR_DIVERGENTE').length,
            naoEncontrados: resultados.filter((r) => r.status === 'NAO_ENCONTRADO').length,
            invalidos: resultados.filter((r) => r.status === 'INVALIDO').length
        };

        return NextResponse.json({
            resumo,
            resultados,
            naoInformados
        });
    } catch (error) {
        console.error('Erro ao processar medição:', error);
        return NextResponse.json(
            { message: 'Erro ao processar a medição.' },
            { status: 500 }
        );
    }
}




