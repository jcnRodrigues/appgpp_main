import { NextRequest, NextResponse } from 'next/server';
import { getTiposPatrimonio, getStatusPatrimonio, getCentrosCusto } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const { centros, allowAll } = await getCentrosFiltro(request);
        const [tipos, status, centrosDb] = await Promise.all([
            getTiposPatrimonio(),
            getStatusPatrimonio(),
            getCentrosCusto()
        ]);

        const centrosFiltrados = allowAll
            ? centrosDb
            : centrosDb.filter((c: any) => centros.includes(c.idCCusto));

        return NextResponse.json({
            tipos,
            status,
            centros: centrosFiltrados
        });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json(
            { message: 'Erro ao obter opções' },
            { status: 500 }
        );
    }
}
