import { NextRequest, NextResponse } from 'next/server';
import { criarPatrimonio, listarPatrimonios } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseDateInput, parseOptionalDateInput } from '@/lib/date-input';
import prisma from '../../../../prisma/prisma';

function normalizar(valor?: string | null) {
    return (valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissao para acessar patrimonio' }, { status: 403 });
    try {
        const { searchParams } = new URL(request.url);
        const idPat = searchParams.get('idPat');
        const descricao = searchParams.get('descricao');
        const status = searchParams.get('status');
        const statusIdsRaw = searchParams.get('statusIds');
        const statusIds = statusIdsRaw
            ? statusIdsRaw.split(',').map((s) => s.trim()).filter(Boolean)
            : [];
        const tipo = searchParams.get('tipo');
        const centroId = searchParams.get('centroId');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '100');

        const { centros, allowAll } = await getCentrosFiltro(request);
        const allowAllEfetivo = allowAll;
        const filtroCentros = allowAllEfetivo ? undefined : centros;

        if (!allowAllEfetivo && centros.length === 0) {
            return NextResponse.json({ data: [], total: 0 });
        }

        const patrimoniosBase = await listarPatrimonios({
            idPat: idPat || undefined,
            descricao: descricao || undefined,
            tipo: tipo || undefined,
            centroId: undefined,
            centros: filtroCentros,
            skip: 0,
            take: 5000
        });
        const historicoDelegate = (prisma as any).tbPatrimonioHistorico;
        const historicos = historicoDelegate
            ? await historicoDelegate.findMany({
                where: {
                    ...(idPat ? { idPat: { contains: idPat } } : {}),
                    ...(descricao ? { descricaoPat: { contains: descricao } } : {}),
                    ...(tipo ? { idPat_TipoPat: tipo } : {}),
                    ...(filtroCentros ? {
                        OR: [
                            { idPat_CustoPat: { in: filtroCentros } },
                            { idPat_CustoPat: null }
                        ]
                    } : {})
                },
                include: {
                    tbTipoPat: true,
                    tbStatusPat: true,
                    tbCCusto: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            : [];

        const historicosComoPatrimonio = historicos.map((h: any) => ({
            idP: `hist-${h.idHistorico}`,
            idPat: h.idPat,
            descricaoPat: h.descricaoPat,
            valorPat: h.valorPat,
            dataEntPat: h.dataEntPat,
            dataSaiPat: h.dataSaiPat,
            notaFiscalPat: h.notaFiscalPat,
            idPat_TipoPat: h.idPat_TipoPat,
            idPat_StatusPat: h.idPat_StatusPat,
            idPat_CustoPat: h.idPat_CustoPat,
            createdAt: h.createdAt,
            tbTipoPat: h.tbTipoPat,
            tbStatusPat: h.tbStatusPat,
            tbCCusto: h.tbCCusto,
            tbDevolucao: h.dataDevolucao ? [{
                dataInicioDevolucao: h.dataDevolucao,
                motivoDevolucao: h.motivoDevolucao,
                notaFiscalDevolucao: h.notaFiscalDevolucao
            }] : [],
            isHistorico: true
        }));

        const linhas = [...historicosComoPatrimonio, ...patrimoniosBase]
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        const porIdPat = new Map<string, typeof linhas>();
        for (const item of linhas) {
            const chave = item.idPat || '';
            if (!porIdPat.has(chave)) porIdPat.set(chave, []);
            porIdPat.get(chave)!.push(item);
        }

        const cicloPorLinha = new Map<string, number>();
        for (const [, itens] of porIdPat) {
            const ordenadoAntigoNovo = [...itens].sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
            ordenadoAntigoNovo.forEach((item, idx) => {
                cicloPorLinha.set(item.idP, idx + 1);
            });
        }

        const linhasComCiclo = linhas.map((item) => ({
            ...item,
            cicloPatrimonio: cicloPorLinha.get(item.idP) || 1
        }));

        const linhasFiltradas = linhasComCiclo.filter((item) => {
            if (centroId) {
                if (item.idPat_CustoPat !== centroId) return false;
            } else if (filtroCentros && filtroCentros.length > 0) {
                if (item.idPat_CustoPat && !filtroCentros.includes(item.idPat_CustoPat)) return false;
            }

            if (statusIds.length > 0) {
                return !!item.idPat_StatusPat && statusIds.includes(item.idPat_StatusPat);
            }
            if (status) {
                return item.idPat_StatusPat === status;
            }
            return true;
        });

        const dataPaginada = linhasFiltradas.slice(skip, skip + take);
        const total = linhasFiltradas.length;

        return NextResponse.json({
            data: dataPaginada,
            total
        });
    } catch (error) {
        console.error('Erro ao listar patrimônios:', error);
        return NextResponse.json(
            { message: 'Erro ao listar patrimônios' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissao para criar patrimonio' }, { status: 403 });
    try {
        const dados = await request.json();

        // Validação básica
        if (!dados.idPat || !dados.descricaoPat || !dados.valorPat || !dados.dataEntPat) {
            return NextResponse.json(
                { message: 'Campos obrigatórios faltando' },
                { status: 400 }
            );
        }

        const patrimonio = await criarPatrimonio({
            idPat: dados.idPat,
            descricaoPat: dados.descricaoPat,
            descricaoDetalhadaPat: dados.descricaoDetalhadaPat,
            licencaPat: dados.licencaPat,
            dataEntPat: parseDateInput(dados.dataEntPat),
            dataSaiPat: parseOptionalDateInput(dados.dataSaiPat),
            notaFiscalPat: dados.notaFiscalPat,
            valorPat: parseFloat(dados.valorPat),
            idPat_TipoPat: dados.idPat_TipoPat,
            idPat_StatusPat: dados.idPat_StatusPat,
            idPat_CustoPat: dados.idPat_CustoPat
        });

        if (patrimonio.idPat_StatusPat) {
            const status = await prisma.tbStatusPat.findUnique({
                where: { idStatusPat: patrimonio.idPat_StatusPat }
            });
            const isDevolucao = normalizar(status?.descricaoStatPat).includes('devolu');

            if (isDevolucao) {
                const dataDevolucao = parseOptionalDateInput(dados.dataDevPat) || parseOptionalDateInput(dados.dataSaiPat) || new Date();
                const devolucaoAberta = await prisma.tbDevolucao.findFirst({
                    where: {
                        idPatrimonio: patrimonio.idP,
                        dataFimDevolucao: null
                    },
                    orderBy: {
                        dataInicioDevolucao: 'desc'
                    }
                });
                if (devolucaoAberta) {
                    await prisma.tbDevolucao.update({
                        where: { idDevolucao: devolucaoAberta.idDevolucao },
                        data: {
                            dataInicioDevolucao: dataDevolucao,
                            motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao.trim() || null : null,
                            notaFiscalDevolucao: typeof dados.notaFiscalDevolucao === 'string' ? dados.notaFiscalDevolucao.trim() || null : null,
                            dataSaidaFornecedor: parseOptionalDateInput(dados.dataSaidaFornecedor),
                            dataChegadaFornecedor: parseOptionalDateInput(dados.dataChegadaFornecedor),
                            dataFimDevolucao: null
                        } as any
                    });
                } else {
                    await prisma.tbDevolucao.create({
                        data: {
                            idPatrimonio: patrimonio.idP,
                            dataInicioDevolucao: dataDevolucao,
                            motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao.trim() || null : null,
                            notaFiscalDevolucao: typeof dados.notaFiscalDevolucao === 'string' ? dados.notaFiscalDevolucao.trim() || null : null,
                            dataSaidaFornecedor: parseOptionalDateInput(dados.dataSaidaFornecedor),
                            dataChegadaFornecedor: parseOptionalDateInput(dados.dataChegadaFornecedor),
                            dataFimDevolucao: null
                        } as any
                    });
                }
            } else {
                await prisma.tbDevolucao.updateMany({
                    where: {
                        idPatrimonio: patrimonio.idP,
                        dataFimDevolucao: null
                    },
                    data: {
                        dataFimDevolucao: new Date()
                    }
                });
            }
        }

        return NextResponse.json(patrimonio, { status: 201 });
    } catch (error: unknown) {
        console.error('Erro ao criar patrimônio:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro ao criar patrimônio';
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}



