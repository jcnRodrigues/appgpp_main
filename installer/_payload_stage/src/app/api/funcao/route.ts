import { NextRequest, NextResponse } from 'next/server';
import { getFuncoes, criarFuncao, contarFuncoes } from '@/back-end/service/Funcao.service/funcao.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'FUNCOES');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissao para acessar funcoes' }, { status: 403 });
    try {
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');
        const nome = (searchParams.get('nome') || '').trim();
        const centroId = (searchParams.get('centroId') || '').trim();

        const funcoes = await getFuncoes({ skip, take, nome, centroId: centroId || undefined });
        const total = await contarFuncoes(nome, centroId || undefined);

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
    const canAccess = await hasModuleAccessForRequest(request, 'FUNCOES');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissao para criar funcao' }, { status: 403 });
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
