import { NextRequest, NextResponse } from 'next/server';
import { getPatrimonioCardById, atualizarPatrimonio } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import prisma from '../../../../../prisma/prisma';
import { getCentrosFiltro, hasDeleteAnyPermission } from '@/lib/access';
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
        const { id } = await params;
        const patrimonio = await getPatrimonioCardById(id);

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
        const { id } = await params;
        const dados = await request.json();

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

            if (isDevolucao) {
                const dataDevolucao = parseNullableDateInput(dados.dataDevPat) || parseNullableDateInput(dados.dataSaiPat) || new Date();
                const devolucaoAberta = await prisma.tbDevolucao.findFirst({
                    where: {
                        idPatrimonio: patrimonio.idPat,
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
                            dataFimDevolucao: parseNullableDateInput(dados.dataChegadaFornecedor)
                        }
                    });
                } else {
                    await prisma.tbDevolucao.create({
                        data: {
                            idPatrimonio: patrimonio.idPat,
                            dataInicioDevolucao: dataDevolucao,
                            motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao.trim() || null : null,
                            notaFiscalDevolucao: typeof dados.notaFiscalDevolucao === 'string' ? dados.notaFiscalDevolucao.trim() || null : null,
                            dataFimDevolucao: parseNullableDateInput(dados.dataChegadaFornecedor)
                        }
                    });
                }
            } else {
                await prisma.tbDevolucao.updateMany({
                    where: {
                        idPatrimonio: patrimonio.idPat,
                        dataFimDevolucao: null
                    },
                    data: {
                        dataFimDevolucao: new Date()
                    }
                });
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
        const canDelete = await hasDeleteAnyPermission(request);
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

