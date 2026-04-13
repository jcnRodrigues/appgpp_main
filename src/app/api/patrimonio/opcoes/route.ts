import { NextRequest, NextResponse } from 'next/server';
import { getTiposPatrimonio, getStatusPatrimonio, getCentrosCusto } from '@/back-end/service/Patrimonio.services/patrimonio.service';
import { getCentrosFiltro } from '@/lib/access';

function sortCentros<T extends { descricaoCCusto?: string | null; codigoCCusto?: string | null }>(centros: T[]) {
    return [...centros].sort((a, b) => {
        const descricaoA = (a.descricaoCCusto || '').trim();
        const descricaoB = (b.descricaoCCusto || '').trim();
        const byDescricao = descricaoA.localeCompare(descricaoB, 'pt-BR', { sensitivity: 'base' });
        if (byDescricao !== 0) return byDescricao;

        const codigoA = (a.codigoCCusto || '').trim();
        const codigoB = (b.codigoCCusto || '').trim();
        return codigoA.localeCompare(codigoB, 'pt-BR', { sensitivity: 'base' });
    });
}

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
            centros: sortCentros(centrosFiltrados)
        });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json(
            { message: 'Erro ao obter opções' },
            { status: 500 }
        );
    }
}
