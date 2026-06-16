import { NextRequest, NextResponse } from 'next/server';
import { contarLicencas, criarLicenca, listarLicencas } from '@/features/licenca/server/licenca.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'LICENCAS_SOFTWARE');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar licenças' }, { status: 403 });
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
        console.error('Erro ao listar licenças:', error);
        return NextResponse.json(
            { message: 'Erro ao listar licenças' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'LICENCAS_SOFTWARE');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissão para criar licença' }, { status: 403 });
    try {
        const dados = await request.json();

        if (!dados.descricaoLic) {
            return NextResponse.json(
                { message: 'Campo obrigat?rio faltando (descricaoLic)' },
                { status: 400 }
            );
        }

        const licenca = await criarLicenca({
            descricaoLic: dados.descricaoLic
        });

        return NextResponse.json(licenca, { status: 201 });
    } catch (error: any) {
        console.error('Erro ao criar licença:', error);
        return NextResponse.json(
            { message: error.message || 'Erro ao criar licença' },
            { status: 500 }
        );
    }
}


