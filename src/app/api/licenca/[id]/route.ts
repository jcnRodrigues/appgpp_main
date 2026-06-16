import { NextRequest, NextResponse } from 'next/server';
import { atualizarLicenca, deletarLicenca, getLicencaById } from '@/features/licenca/server/licenca.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'LICENCAS_SOFTWARE');
        if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar licenças' }, { status: 403 });

        const { id } = await params;
        const licenca = await getLicencaById(id);

        if (!licenca) {
            return NextResponse.json(
                { message: 'Licen?a não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(licenca);
    } catch (error) {
        console.error('Erro ao obter licença:', error);
        return NextResponse.json(
            { message: 'Erro ao obter licença' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'LICENCAS_SOFTWARE');
        const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
        if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissão para alterar licença' }, { status: 403 });

        const { id } = await params;
        const dados = await request.json();

        if (!dados.descricaoLic) {
            return NextResponse.json(
                { message: 'Campo obrigat?rio faltando (descricaoLic)' },
                { status: 400 }
            );
        }

        const licenca = await atualizarLicenca(id, {
            descricaoLic: dados.descricaoLic
        });

        return NextResponse.json(licenca);
    } catch (error: any) {
        console.error('Erro ao atualizar licença:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Licen?a não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao atualizar licença' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const canAccess = await hasModuleAccessForRequest(request, 'LICENCAS_SOFTWARE');
        const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canAccess || !canDelete) return NextResponse.json({ message: 'Sem permissão para deletar licença' }, { status: 403 });

        const { id } = await params;
        await deletarLicenca(id);

        return NextResponse.json({ message: 'Licenca deletada com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar licença:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Licen?a não encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao deletar licença' },
            { status: 500 }
        );
    }
}

