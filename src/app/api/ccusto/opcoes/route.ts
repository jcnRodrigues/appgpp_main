import { NextRequest, NextResponse } from 'next/server';
import { garantirStatusPadraoCentroCusto, listarEmpresas, listarStatusCentroCusto } from '@/features/centro-custo/server/centrocusto.service';
import { hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'CENTRO_CUSTO');
        if (!canAccess) {
            return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
        }
        await garantirStatusPadraoCentroCusto();
        const [empresas, status] = await Promise.all([
            listarEmpresas(),
            listarStatusCentroCusto()
        ]);
        return NextResponse.json({ empresas, status });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json({ message: 'Erro ao obter opções' }, { status: 500 });
    }
}
