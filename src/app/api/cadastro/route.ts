import { NextRequest, NextResponse } from 'next/server';
import { 
    listarAlocacoes, 
    criarAlocacao,
    listarFuncionarios,
    listarPatrimonios,
    contarAlocacoes
} from '@/features/alocacoes/server/cadastro.service';
import { getStatusPatrimonio } from '@/features/patrimonio/server/patrimonio.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseOptionalDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'ALOCACOES');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar alocações' }, { status: 403 });
    try {
        const { searchParams } = new URL(request.url);
        const idMatFun = searchParams.get('funcionario');
        const idPat = searchParams.get('patrimonio');
        const funcionarioBusca = searchParams.get('funcionarioBusca');
        const patrimonioBusca = searchParams.get('patrimonioBusca');
        const centroBusca = searchParams.get('centroBusca');
        const statusIds = searchParams.getAll('statusId').filter(Boolean);
        const opções = searchParams.get('opções');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');

        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;

        if (!allowAll && centros.length === 0 && opções !== 'true') {
            return NextResponse.json({ data: [], total: 0 });
        }

        // Se solicitar opÃ§Ãµes (funcionÃ¡rios e patrimÃ´nios)
        if (opções === 'true') {
            const [funcionarios, patrimonios, statusPatrimonio] = await Promise.all([
                listarFuncionarios(filtroCentros),
                listarPatrimonios(filtroCentros),
                getStatusPatrimonio()
            ]);

            return NextResponse.json({
                funcionarios,
                patrimonios,
                statusPatrimonio
            });
        }

        // Listar alocaÃ§Ãµes com filtros
        const alocacoes = await listarAlocacoes({
            idMatFun: idMatFun || undefined,
            idPat: idPat || undefined,
            funcionarioBusca: funcionarioBusca || undefined,
            patrimonioBusca: patrimonioBusca || undefined,
            centroBusca: centroBusca || undefined,
            statusIds: statusIds.length > 0 ? statusIds : undefined,
            centros: filtroCentros,
            skip,
            take
        });
        const total = await contarAlocacoes({
            idMatFun: idMatFun || undefined,
            idPat: idPat || undefined,
            funcionarioBusca: funcionarioBusca || undefined,
            patrimonioBusca: patrimonioBusca || undefined,
            centroBusca: centroBusca || undefined,
            statusIds: statusIds.length > 0 ? statusIds : undefined,
            centros: filtroCentros
        });

        return NextResponse.json({
            data: alocacoes,
            total
        });
    } catch (error) {
        console.error('Erro ao listar alocaÃ§Ãµes:', error);
        return NextResponse.json(
            { message: 'Erro ao listar alocaÃ§Ãµes' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'ALOCACOES');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissão para criar alocação' }, { status: 403 });
    try {
        const dados = await request.json();

        // ValidaÃ§Ã£o bÃ¡sica
        if (!dados.idPatCad || !dados.idMatFunCad) {
            return NextResponse.json(
                { message: 'Campos obrigatÃ³rios faltando (idPatCad, idMatFunCad)' },
                { status: 400 }
            );
        }

        const alocacao = await criarAlocacao({
            idPatCad: dados.idPatCad,
            idMatFunCad: dados.idMatFunCad,
            dataCadPat: parseOptionalDateInput(dados.dataCadPat),
            dataDevPat: parseOptionalDateInput(dados.dataDevPat),
            idStatusPatCad: dados.idStatusPatCad || undefined,
            motivoDevolucao: typeof dados.motivoDevolucao === 'string' ? dados.motivoDevolucao : null
        });

        return NextResponse.json(alocacao, { status: 201 });
    } catch (error: any) {
        console.error('Erro ao criar alocaÃ§Ã£o:', error);
        return NextResponse.json(
            { message: error.message || 'Erro ao criar alocaÃ§Ã£o' },
            { status: 500 }
        );
    }
}


