import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, getStatusFuncionario, getCentrosCustoFun } from '@/back-end/service/Funcionario.service/funcionario.service';

export async function GET(request: NextRequest) {
    try {
        const [funcoes, status, centros] = await Promise.all([
            getFuncoes(),
            getStatusFuncionario(),
            getCentrosCustoFun()
        ]);

        return NextResponse.json({
            funcoes,
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
