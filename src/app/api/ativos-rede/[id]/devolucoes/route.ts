import { NextRequest, NextResponse } from 'next/server';
import { devolverAtivoRede, listarDevolucoesAtivoRede } from '@/features/ativos-rede/server/ativo-rede.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissao para acessar devolucoes' }, { status: 403 });

    try {
        const { id } = await params;
        const data = await listarDevolucoesAtivoRede(id);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar devolucoes:', error);
        return NextResponse.json({ message: 'Erro ao buscar devolucoes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
    if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissao para devolver ativo de rede' }, { status: 403 });

    try {
        const { id } = await params;
        const body = await request.json();
        const ativo = await devolverAtivoRede({
            idAtivoRedePk: id,
            motivoDevolucao: typeof body.motivoDevolucao === 'string' ? body.motivoDevolucao : undefined,
            destinoDevolucao: typeof body.destinoDevolucao === 'string' ? body.destinoDevolucao : undefined,
            notaFiscalDevolucao: typeof body.notaFiscalDevolucao === 'string' ? body.notaFiscalDevolucao : undefined,
            observacao: typeof body.observacao === 'string' ? body.observacao : undefined,
            dataInicioDevolucao: body.dataInicioDevolucao ? parseDateInput(body.dataInicioDevolucao) : undefined
        });

        return NextResponse.json(ativo);
    } catch (error) {
        console.error('Erro ao devolver ativo de rede:', error);
        const message = error instanceof Error ? error.message : 'Erro ao devolver ativo de rede';
        return NextResponse.json({ message }, { status: 500 });
    }
}
