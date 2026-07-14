import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPatrimonioCardById, atualizarPatrimonio } from '@/features/patrimonio/server/patrimonio.service';
import prisma from '../../../../../prisma/prisma';
import { criarLinhaInicialDevolucao, vincularDevolucaoAoProcesso, obterProximoCodigoDevolucao } from '@/features/devolucao/server/devolucaoCodigo.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { extrairCodigoDevolucao, formatarCodigoDevolucao } from '@/features/devolucao/devolucaoCodigo';
import { parseNullableDateInput } from '@/lib/date-input';

function normalizar(valor?: string | null) {
    return (valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Sem permissão para acessar patrimônio' }, { status: 403 });
        }
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canUpdate) {
            return NextResponse.json({ message: 'Sem permissão para alterar patrimônio' }, { status: 403 });
        }
        const { id } = await params;
        let patrimonio = await getPatrimonioCardById(id);
        if (!patrimonio) {
            patrimonio = await prisma.tbPatrimonio.findFirst({
                where: { idPat: id },
                include: {
                    tbTipoPat: true,
                    tbStatusPat: true,
                    tbCCusto: true,
                    tbCadastro: true,
                    tbDevolucao: {
                        orderBy: {
                            dataInicioDevolucao: 'desc'
                        },
                        select: {
                            dataInicioDevolucao: true,
                            dataSaidaFornecedor: true,
                            dataChegadaFornecedor: true,
                            dataFimDevolucao: true,
                            motivoDevolucao: true,
                            notaFiscalDevolucao: true,
                            tbDevolucaoProcesso: {
                                select: {
                                    idDevolucaoProcesso: true,
                                    codigoDevolucao: true,
                                    statusDevolucao: true,
                                    dataInicio: true,
                                    dataFechamento: true
                                }
                            }
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

        if (!patrimonio) {
            return NextResponse.json(
                { message: 'PatrimÃ´nio nÃ£o encontrado' },
                { status: 404 }
            );
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0) {
            const centroId = patrimonio.idPat_CustoPat || '';
            if (!centros.includes(centroId)) {
                return NextResponse.json(
                    { message: 'PatrimÃ´nio nÃ£o encontrado' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(patrimonio);
    } catch (error) {
        console.error('Erro ao obter patrimÃ´nio:', error);
        return NextResponse.json(
            { message: 'Erro ao obter patrimÃ´nio' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Sem permissão para acessar patrimônio' }, { status: 403 });
        }
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canUpdate) {
            return NextResponse.json({ message: 'Sem permissão para alterar patrimônio' }, { status: 403 });
        }
        const { id } = await params;
        const dados = await request.json();
        const patrimonioAntes = await getPatrimonioCardById(id);
        if (!patrimonioAntes) {
            return NextResponse.json({ message: 'PatrimÃ´nio nÃ£o encontrado' }, { status: 404 });
        }

        // ValidaÃ§Ã£o mÃ­nima
        if (!dados || Object.keys(dados).length === 0) {
            return NextResponse.json({ message: 'Nenhum dado para atualizar' }, { status: 400 });
        }

        const updateData: any = {};
        if (typeof dados.descricaoPat !== 'undefined') updateData.descricaoPat = dados.descricaoPat;
        if (typeof dados.descricaoDetalhadaPat !== 'undefined') updateData.descricaoDetalhadaPat = dados.descricaoDetalhadaPat;
        if (typeof dados.licencaPat !== 'undefined') updateData.licencaPat = dados.licencaPat;
        if (typeof dados.dataEntPat !== 'undefined') updateData.dataEntPat = parseNullableDateInput(dados.dataEntPat);
        if (typeof dados.dataSaiPat !== 'undefined') updateData.dataSaiPat = parseNullableDateInput(dados.dataSaiPat);
        if (typeof dados.notaFiscalPat !== 'undefined') updateData.notaFiscalPat = dados.notaFiscalPat;
        if (typeof dados.valorPat !== 'undefined') {
            const v = typeof dados.valorPat === 'number' ? dados.valorPat : parseFloat(dados.valorPat);
            if (Number.isNaN(v)) return NextResponse.json({ message: 'Valor invÃ¡lido' }, { status: 400 });
            updateData.valorPat = v;
        }
        if (typeof dados.idPat_TipoPat !== 'undefined') updateData.idPat_TipoPat = dados.idPat_TipoPat;
        if (typeof dados.idPat_StatusPat !== 'undefined') updateData.idPat_StatusPat = dados.idPat_StatusPat;
        if (typeof dados.idPat_CustoPat !== 'undefined') updateData.idPat_CustoPat = dados.idPat_CustoPat;

        const patrimonio = await atualizarPatrimonio(id, updateData);

        if (patrimonio.idPat_StatusPat) {
            const status = await prisma.tbStatusPat.findUnique({
                where: { idStatusPat: patrimonio.idPat_StatusPat }
            });
            const isDevolucao = normalizar(status?.descricaoStatPat).includes('devolu');
            const statusAnterior = patrimonioAntes.tbStatusPat?.descricaoStatPat || null;
            const statusNovo = status?.descricaoStatPat || null;
            const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
            const userEmail = String(token?.email || '').trim().toLowerCase();
            let idUserAcao: string | null = null;
            if (userEmail) {
                const acesso = await prisma.tbUser.findFirst({
                    where: { emailUser: userEmail },
                    select: { id: true }
                });
                idUserAcao = acesso?.id || null;
            }

            if (isDevolucao) {
                const dataDevolucao = parseNullableDateInput(dados.dataDevPat) || parseNullableDateInput(dados.dataSaiPat) || new Date();
                const codigoEntrada = typeof dados.codigoDevolucao === 'string' ? dados.codigoDevolucao.trim().toUpperCase() : '';
                const codigoEntradaValido = extrairCodigoDevolucao(codigoEntrada);
                const partesCodigo = codigoEntradaValido || await obterProximoCodigoDevolucao();
                const codigoDevolucao = codigoEntradaValido ? codigoEntrada : formatarCodigoDevolucao(partesCodigo);
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
                    const dataSaidaFornecedor = parseNullableDateInput(dados.dataSaidaFornecedor) || dataDevolucao;
                    await vincularDevolucaoAoProcesso({
                        idPatrimonio: patrimonio.idP,
                        idDevolucao: devolucaoAberta.idDevolucao,
                        codigoDevolucao,
                        dataInicioDevolucao: dataDevolucao,
                        dataSaidaFornecedor,
                        dataChegadaFornecedor: parseNullableDateInput(dados.dataChegadaFornecedor),
                        motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao.trim() || null : null,
                        notaFiscalDevolucao: typeof dados.notaFiscalDevolucao === 'string' ? dados.notaFiscalDevolucao.trim() || null : null
                    });
                } else {
                    const dataSaidaFornecedor = parseNullableDateInput(dados.dataSaidaFornecedor) || dataDevolucao;
                    const novaLinha = await criarLinhaInicialDevolucao({
                        idPatrimonio: patrimonio.idP,
                        codigoDevolucao,
                        dataInicioDevolucao: dataDevolucao
                    });
                    await vincularDevolucaoAoProcesso({
                        idPatrimonio: patrimonio.idP,
                        idDevolucao: novaLinha.idDevolucao,
                        codigoDevolucao,
                        dataInicioDevolucao: dataDevolucao,
                        dataSaidaFornecedor,
                        dataChegadaFornecedor: parseNullableDateInput(dados.dataChegadaFornecedor),
                        motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao.trim() || null : null,
                        notaFiscalDevolucao: typeof dados.notaFiscalDevolucao === 'string' ? dados.notaFiscalDevolucao.trim() || null : null
                    });
                }
            } else {
                const limparDadosDevolucao = Boolean(dados.limparDadosDevolucao);
                if (limparDadosDevolucao) {
                    const resultadoDelete = await prisma.tbDevolucao.deleteMany({
                        where: {
                            idPatrimonio: patrimonio.idP
                        }
                    });

                    await prisma.$executeRaw`
                        INSERT INTO tbAuditoriaDevolucaoPatrimonio
                        (idAuditoria, idPatrimonioRef, idPat, statusAnterior, statusNovo, limpezaSolicitada, registrosRemovidos, idUserAcao, emailUserAcao, observacao, detalhesJson, createdAt)
                        VALUES (UUID(), ${patrimonio.idP}, ${patrimonio.idPat}, ${statusAnterior}, ${statusNovo}, ${true}, ${resultadoDelete.count}, ${idUserAcao}, ${userEmail || null}, ${'Limpeza de dados de devoluÃ§Ã£o solicitada ao trocar status no formulÃ¡rio de patrimÃ´nio.'}, CAST(${JSON.stringify({
                            origem: 'PatrimonioForm',
                            endpoint: 'PUT /api/patrimonio/[id]'
                        })} AS JSON), NOW())
                    `;
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
        }

        return NextResponse.json(patrimonio);
    } catch (error: unknown) {
        console.error('Erro ao atualizar patrimÃ´nio:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao atualizar patrimÃ´nio' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Sem permissão para acessar patrimônio' }, { status: 403 });
        }
        const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canDelete) {
            return NextResponse.json({ message: 'Sem permissÃ£o para deletar' }, { status: 403 });
        }
        const { id } = await params;
        // Verificar se patrimÃ´nio existe
        const patrimonio = await getPatrimonioCardById(id);
        if (!patrimonio) {
            return NextResponse.json(
                { message: 'PatrimÃ´nio nÃ£o encontrado' },
                { status: 404 }
            );
        }

        // Deletar patrimÃ´nio
        await prisma.tbPatrimonio.delete({
            where: { idP: id }
        });

        return NextResponse.json({
            message: 'PatrimÃ´nio deletado com sucesso'
        });
    } catch (error: unknown) {
        console.error('Erro ao deletar patrimÃ´nio:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao deletar patrimÃ´nio' },
            { status: 500 }
        );
    }

    
}




