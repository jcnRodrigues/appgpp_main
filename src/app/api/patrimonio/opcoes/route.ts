import { NextRequest, NextResponse } from 'next/server';
import { getTiposPatrimonio, getStatusPatrimonio, getCentrosCusto } from '@/back-end/service/Patrimonio.services/patrimonio.service';

export async function GET(request: NextRequest) {
    try {
        const [tipos, status, centros] = await Promise.all([
            getTiposPatrimonio(),
            getStatusPatrimonio(),
            getCentrosCusto()
        ]);

        return NextResponse.json({
            tipos,
            status,
            centros
        });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json(
            { message: 'Erro ao obter opções' },
            { status: 500 }
        );
    }
}
