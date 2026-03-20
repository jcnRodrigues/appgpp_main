import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, criarFuncao, contarFuncoes } from '@/back-end/service/Funcao.service/funcao.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');
        const nome = (searchParams.get('nome') || '').trim();

        const funcoes = await getFuncoes({ skip, take, nome });
        const total = await contarFuncoes(nome);

        return NextResponse.json({
            data: funcoes,
            total
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
