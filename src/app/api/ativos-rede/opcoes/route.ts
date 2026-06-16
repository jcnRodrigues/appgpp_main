import { NextRequest, NextResponse } from 'next/server';
import {
    criarStatusAtivoRede,
    criarTipoAtivoRede,
    listarCentrosAtivoRede,
    listarStatusAtivoRede,
    listarTiposAtivoRede
} from '@/features/ativos-rede/server/ativo-rede.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    if (!canAccess) {
        return NextResponse.json({ message: 'Sem permissão para acessar opções de ativos de rede' }, { status: 403 });
    }

    try {
        const [tipos, status, centros] = await Promise.all([
            listarTiposAtivoRede(),
            listarStatusAtivoRede(),
            listarCentrosAtivoRede()
        ]);

        return NextResponse.json({ tipos, status, centros });
    } catch (error) {
        console.error('Erro ao listar opções de ativos de rede:', error);
        return NextResponse.json({ message: 'Erro ao listar opções de ativos de rede' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) {
        return NextResponse.json({ message: 'Sem permissão para cadastrar tipo ou status' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const kind = String(body.kind || '').trim().toUpperCase();
        const descricao = String(body.descricao || '').trim();

        if (!kind || !descricao) {
            return NextResponse.json({ message: 'Tipo e descricao sao obrigat?rios' }, { status: 400 });
        }

        if (kind === 'TIPO') {
            const tipo = await criarTipoAtivoRede(descricao);
            return NextResponse.json(tipo, { status: 201 });
        }

        if (kind === 'STATUS') {
            const status = await criarStatusAtivoRede(descricao);
            return NextResponse.json(status, { status: 201 });
        }

        return NextResponse.json({ message: 'Kind invalido' }, { status: 400 });
    } catch (error) {
        console.error('Erro ao cadastrar opcao de ativo de rede:', error);
        const message = error instanceof Error ? error.message : 'Erro ao cadastrar opcao de ativo de rede';
        return NextResponse.json({ message }, { status: 500 });
    }
}

