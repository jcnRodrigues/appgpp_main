import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, getStatusFuncionario, getCentrosCustoFun } from '@/back-end/service/Funcionario.service/funcionario.service';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(request: NextRequest) {
    try {
        const { centros, allowAll } = await getCentrosFiltro(request);
        const [funcoes, status, centrosDb] = await Promise.all([
            getFuncoes(),
            getStatusFuncionario(),
            getCentrosCustoFun()
        ]);

        const centrosFiltrados = allowAll
            ? centrosDb
            : centrosDb.filter((c: any) => centros.includes(c.idCCusto));

        return NextResponse.json({
            funcoes,
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
