import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, criarFuncao } from '@/back-end/service/Funcao.service/funcao.service';

export async function GET(request: NextRequest) {
    try {
        const funcoes = await getFuncoes();

        return NextResponse.json({
            data: funcoes,
            total: funcoes.length
        });
    } catch (error) {
        console.error('Erro ao listar funções:', error);
        return NextResponse.json(
            { message: 'Erro ao listar funções' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();

        // Validação básica
        if (!dados.nomeFuncao) {
            return NextResponse.json(
                { message: 'Campo obrigatório faltando (nomeFuncao)' },
                { status: 400 }
            );
        }

        const funcao = await criarFuncao({
            nomeFuncao: dados.nomeFuncao
        });

        return NextResponse.json(funcao, { status: 201 });
    } catch (error: any) {
        console.error('Erro ao criar função:', error);
        return NextResponse.json(
            { message: error.message || 'Erro ao criar função' },
            { status: 500 }
        );
    }
}
