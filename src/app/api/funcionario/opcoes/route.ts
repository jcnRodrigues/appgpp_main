import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, getStatusFuncionario, getCentrosCustoFun, getLicencasDisponiveisParaFuncionario } from '@/back-end/service/Funcionario.service/funcionario.service';
import { getCentrosFiltro } from '@/lib/access';

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
            centros: centrosFiltrados,
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
