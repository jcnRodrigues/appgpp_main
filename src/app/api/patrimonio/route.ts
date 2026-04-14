import { NextRequest, NextResponse } from 'next/server';
import { criarPatrimonio, listarPatrimonios, contarPatrimonios } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { getCentrosFiltro } from '@/lib/access';
import { parseDateInput, parseOptionalDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest) {
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
        const filtroCentros = allowAll ? undefined : centros;

        if (!allowAll && centros.length === 0) {
            return NextResponse.json({ data: [], total: 0 });
        }

        const patrimonios = await listarPatrimonios({
            idPat: idPat || undefined,
            descricao: descricao || undefined,
            status: status || undefined,
            statusIds: statusIds.length > 0 ? statusIds : undefined,
            tipo: tipo || undefined,
            centroId: centroId || undefined,
            centros: filtroCentros,
            skip,
            take
        });
        const total = await contarPatrimonios({
            idPat: idPat || undefined,
            descricao: descricao || undefined,
            status: status || undefined,
            statusIds: statusIds.length > 0 ? statusIds : undefined,
            tipo: tipo || undefined,
            centroId: centroId || undefined,
            centros: filtroCentros
        });

        return NextResponse.json({
            data: patrimonios,
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
