import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPatrimonioCardById, atualizarPatrimonio } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import prisma from '../../../../../prisma/prisma';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
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
            return NextResponse.json({ message: 'Sem permissao para acessar patrimonio' }, { status: 403 });
        }
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canUpdate) {
            return NextResponse.json({ message: 'Sem permissao para alterar patrimonio' }, { status: 403 });
        }
        const { id } = await params;
        const patrimonio = await getPatrimonioCardById(id);

        if (!patrimonio) {
            return NextResponse.json(
                { message: 'Patrim�nio n�o encontrado' },
                { status: 404 }
            );
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0) {
            const centroId = patrimonio.idPat_CustoPat || '';
            if (!centros.includes(centroId)) {
                return NextResponse.json(
                    { message: 'Patrim�nio n�o encontrado' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(patrimonio);
    } catch (error) {
        console.error('Erro ao obter patrim�nio:', error);
        return NextResponse.json(
            { message: 'Erro ao obter patrim�nio' },
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
            return NextResponse.json({ message: 'Sem permissao para acessar patrimonio' }, { status: 403 });
        }
        const { id } = await params;
        const dados = await request.json();
        const patrimonioAntes = await getPatrimonioCardById(id);
        if (!patrimonioAntes) {
            return NextResponse.json({ message: 'Patrimônio não encontrado' }, { status: 404 });
        }

        // Valida��o m�nima
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
            if (Number.isNaN(v)) return NextResponse.json({ message: 'Valor inv�lido' }, { status: 400 });
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
                            dataSaidaFornecedor: parseNullableDateInput(dados.dataSaidaFornecedor),
                            dataChegadaFornecedor: parseNullableDateInput(dados.dataChegadaFornecedor),
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
                            dataSaidaFornecedor: parseNullableDateInput(dados.dataSaidaFornecedor),
                            dataChegadaFornecedor: parseNullableDateInput(dados.dataChegadaFornecedor),
                            dataFimDevolucao: null
                        } as any
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
                        VALUES (UUID(), ${patrimonio.idP}, ${patrimonio.idPat}, ${statusAnterior}, ${statusNovo}, ${true}, ${resultadoDelete.count}, ${idUserAcao}, ${userEmail || null}, ${'Limpeza de dados de devolução solicitada ao trocar status no formulário de patrimônio.'}, CAST(${JSON.stringify({
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
        console.error('Erro ao atualizar patrim�nio:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao atualizar patrim�nio' },
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
            return NextResponse.json({ message: 'Sem permissao para acessar patrimonio' }, { status: 403 });
        }
        const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canDelete) {
            return NextResponse.json({ message: 'Sem permiss�o para deletar' }, { status: 403 });
        }
        const { id } = await params;
        // Verificar se patrim�nio existe
        const patrimonio = await getPatrimonioCardById(id);
        if (!patrimonio) {
            return NextResponse.json(
                { message: 'Patrim�nio n�o encontrado' },
                { status: 404 }
            );
        }

        // Deletar patrim�nio
        await prisma.tbPatrimonio.delete({
            where: { idP: id }
        });

        return NextResponse.json({
            message: 'Patrim�nio deletado com sucesso'
        });
    } catch (error: unknown) {
        console.error('Erro ao deletar patrim�nio:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao deletar patrim�nio' },
            { status: 500 }
        );
    }

    
}



