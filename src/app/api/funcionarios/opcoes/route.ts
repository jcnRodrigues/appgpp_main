import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, getStatusFuncionarios, getCentrosCustoFun, getLicencasDisponiveisParaFuncionarios } from '@/features/funcionarios/server/funcionario.service';
import { getCentrosFiltro, hasModuleAccessForRequest } from '@/lib/access';

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
        const canAccess = await hasModuleAccessForRequest(request, 'FUNCIONARIOS');
        if (!canAccess) {
            return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
        }
        const { centros, allowAll } = await getCentrosFiltro(request);
        const [funcoes, status, centrosDb, licencas] = await Promise.all([
            getFuncoes(),
            getStatusFuncionarios(),
            getCentrosCustoFun(),
            getLicencasDisponiveisParaFuncionarios()
        ]);

        const centrosFiltrados = allowAll
            ? centrosDb
            : centrosDb.filter((c: any) => centros.includes(c.idCCusto));

        return NextResponse.json({
            funcoes,
            status,
            centros: sortCentros(centrosFiltrados),
            licencas
        });
    } catch (error) {
        console.error('Erro ao obter opções:', error);
        return NextResponse.json(
            { message: 'Erro ao obter opções' },
            { status: 500 }
        );
    }
}

