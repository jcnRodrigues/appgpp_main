import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, getStatusFuncionario, getCentrosCustoFun, getLicencasDisponiveisParaFuncionario } from '@/back-end/service/Funcionario.service/funcionario.service';
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
        const [funcoes, status, centrosDb, licencas] = await Promise.all([
            getFuncoes(),
            getStatusFuncionario(),
            getCentrosCustoFun(),
            getLicencasDisponiveisParaFuncionario()
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
        console.error('Erro ao obter opcoes:', error);
        return NextResponse.json(
            { message: 'Erro ao obter opcoes' },
            { status: 500 }
        );
    }
}
