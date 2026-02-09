import { NextRequest, NextResponse } from 'next/server';
import { criarFuncionario, listarFuncionarios } from '@/back-end/service/Funcionario.service/funcionario.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nome = searchParams.get('nome');
        const status = searchParams.get('status');
        const funcao = searchParams.get('funcao');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '100');

        const funcionarios = await listarFuncionarios({
            nome: nome || undefined,
            status: status || undefined,
            funcao: funcao || undefined,
            skip,
            take
        });

        return NextResponse.json({
            data: funcionarios,
            total: funcionarios.length
        });
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        return NextResponse.json(
            { message: 'Erro ao listar funcionários' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();

        // Validação básica
        if (!dados.idMatFun || !dados.nomeFun) {
            return NextResponse.json(
                { message: 'Campos obrigatórios faltando (idMatFun, nomeFun)' },
                { status: 400 }
            );
        }

        const funcionario = await criarFuncionario({
            idMatFun: dados.idMatFun,
            nomeFun: dados.nomeFun,
            cpfFun: dados.cpfFun,
            dataAdmFun: dados.dataAdmFun ? new Date(dados.dataAdmFun) : undefined,
            avatarFun: dados.avatarFun,
            idFuncaoFun: dados.idFuncaoFun,
            idStatusFun: dados.idStatusFun,
            idCustoFun: dados.idCustoFun,
            idUserFun: dados.idUserFun
        });

        return NextResponse.json(funcionario, { status: 201 });
    } catch (error: any) {
        console.error('Erro ao criar funcionário:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Matrícula já existe' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao criar funcionário' },
            { status: 500 }
        );
    }
}
