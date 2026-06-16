import { NextRequest, NextResponse } from 'next/server';
import { listarTransferenciasAtivoRede, transferirAtivoRede } from '@/features/ativos-rede/server/ativo-rede.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar transferências' }, { status: 403 });

    try {
        const { id } = await params;
        const data = await listarTransferenciasAtivoRede(id);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar transferências:', error);
        return NextResponse.json({ message: 'Erro ao buscar transferências' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    const canTransfer = await hasActionPermissionForRequest(request, 'TRANSFER');
    if (!canAccess || !canTransfer) return NextResponse.json({ message: 'Sem permissão para transferir ativo de rede' }, { status: 403 });

    try {
        const { id } = await params;
        const body = await request.json();
        const ativo = await transferirAtivoRede({
            idAtivoRedePk: id,
            localDestinoAtivoRede: typeof body.localDestinoAtivoRede === 'string' ? body.localDestinoAtivoRede : undefined,
            idCCustoDestinoAtivoRede: typeof body.idCCustoDestinoAtivoRede === 'string' ? body.idCCustoDestinoAtivoRede : undefined,
            statusNovoAtivoRede: typeof body.statusNovoAtivoRede === 'string' ? body.statusNovoAtivoRede : undefined,
            observacao: typeof body.observacao === 'string' ? body.observacao : undefined,
            dataTransferencia: body.dataTransferencia ? parseDateInput(body.dataTransferencia) : undefined
        });

        return NextResponse.json(ativo);
    } catch (error) {
        console.error('Erro ao transferir ativo de rede:', error);
        const message = error instanceof Error ? error.message : 'Erro ao transferir ativo de rede';
        return NextResponse.json({ message }, { status: 500 });
    }
}

