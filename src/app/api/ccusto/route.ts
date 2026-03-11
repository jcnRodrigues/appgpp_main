import { NextRequest, NextResponse } from 'next/server';
import { listarCentrosCusto, criarCentroCusto, contarCentrosCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const descricao = searchParams.get('descricao');
        const codigo = searchParams.get('codigo');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '100');

        const data = await listarCentrosCusto({ descricao: descricao || undefined, codigo: codigo || undefined, skip, take });
        const total = await contarCentrosCusto({ descricao: descricao || undefined, codigo: codigo || undefined });
        return NextResponse.json({ data, total });
    } catch (error) {
        console.error('Erro ao listar centros de custo:', error);
        return NextResponse.json({ message: 'Erro ao listar centros de custo' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();
        if (!dados.descricaoCCusto && !dados.codigoCCusto) {
            return NextResponse.json({ message: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        const created = await criarCentroCusto({
            codigoCCusto: dados.codigoCCusto || null,
            descricaoCCusto: dados.descricaoCCusto || null,
            idEmp_Custo: dados.idEmp_Custo || null
        });

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar centro de custo:', error);
        return NextResponse.json({ message: 'Erro ao criar centro de custo' }, { status: 500 });
    }
}
