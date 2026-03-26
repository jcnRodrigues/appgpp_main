import { NextRequest, NextResponse } from 'next/server';
import { contarLicencas, criarLicenca, listarLicencas } from '@/back-end/service/Licenca.service/licenca.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');
        const descricao = (searchParams.get('descricao') || '').trim();

        const licencas = await listarLicencas({
            descricao,
            skip,
            take
        });
        const total = await contarLicencas(descricao);

        return NextResponse.json({
            data: licencas,
            total
        });
    } catch (error) {
        console.error('Erro ao listar licencas:', error);
        return NextResponse.json(
            { message: 'Erro ao listar licencas' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();

        if (!dados.descricaoLic) {
            return NextResponse.json(
                { message: 'Campo obrigatorio faltando (descricaoLic)' },
                { status: 400 }
            );
        }

        const licenca = await criarLicenca({
            descricaoLic: dados.descricaoLic
        });

        return NextResponse.json(licenca, { status: 201 });
    } catch (error: any) {
        console.error('Erro ao criar licenca:', error);
        return NextResponse.json(
            { message: error.message || 'Erro ao criar licenca' },
            { status: 500 }
        );
    }
}
