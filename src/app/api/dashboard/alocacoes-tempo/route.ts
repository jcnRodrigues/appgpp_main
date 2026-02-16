import { NextRequest, NextResponse } from 'next/server';
import { alocacoesAoLongoDoTempo } from '@/back-end/service/Dashboard.service/dashboard.service';

export async function GET(request: NextRequest) {
    try {
        const dados = await alocacoesAoLongoDoTempo();
        return NextResponse.json(dados);
    } catch (error) {
        console.error('Erro ao obter alocações ao longo do tempo:', error);
        return NextResponse.json(
            { message: 'Erro ao obter dados' },
            { status: 500 }
        );
    }
}
