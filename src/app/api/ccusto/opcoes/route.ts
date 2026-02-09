import { NextRequest, NextResponse } from 'next/server';
import { listarEmpresas } from '@/back-end/service/CentroCusto.service/centrocusto.service';

export async function GET(request: NextRequest) {
    try {
        const empresas = await listarEmpresas();
        return NextResponse.json({ empresas });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json({ message: 'Erro ao obter opções' }, { status: 500 });
    }
}
