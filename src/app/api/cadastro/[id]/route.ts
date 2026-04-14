import { NextRequest, NextResponse } from 'next/server';
import { 
    buscarAlocacaoById, 
    atualizarAlocacao, 
    deletarAlocacao 
} from '@/back-end/service/Cadastro.service/cadastro.service';
import { getCentrosFiltro } from '@/lib/access';
import { parseNullableDateInput } from '@/lib/date-input';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const alocacao = await buscarAlocacaoById(id);

        if (!alocacao) {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        const centroFun = alocacao.tbFuncionario?.idCustoFun || '';
        const centroPat = alocacao.tbPatrimonio?.idPat_CustoPat || '';

        if (!allowAll && (!centros.includes(centroFun) || !centros.includes(centroPat))) {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(alocacao);
    } catch (error) {
        console.error('Erro ao obter alocação:', error);
        return NextResponse.json(
            { message: 'Erro ao obter alocação' },
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
        const hasDataCadPat = Object.prototype.hasOwnProperty.call(dados, 'dataCadPat');
        const hasDataDevPat = Object.prototype.hasOwnProperty.call(dados, 'dataDevPat');

        const alocacao = await atualizarAlocacao(id, {
            dataCadPat: hasDataCadPat ? parseNullableDateInput(dados.dataCadPat) ?? undefined : undefined,
            dataDevPat: hasDataDevPat ? parseNullableDateInput(dados.dataDevPat) : undefined,
            idStatusPatCad: dados.idStatusPatCad || undefined
        });

        return NextResponse.json(alocacao);
    } catch (error: any) {
        console.error('Erro ao atualizar alocação:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao atualizar alocação' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deletarAlocacao(id);

        return NextResponse.json({ message: 'Alocação deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar alocação:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Alocação não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar alocação' },
            { status: 500 }
        );
    }
}
