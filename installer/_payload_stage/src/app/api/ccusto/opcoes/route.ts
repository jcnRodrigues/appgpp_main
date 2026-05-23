import { NextRequest, NextResponse } from 'next/server';
import { listarEmpresas } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import { hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'CENTRO_CUSTO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
        }
        const empresas = await listarEmpresas();
        return NextResponse.json({ empresas });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json({ message: 'Erro ao obter opções' }, { status: 500 });
    }
}
