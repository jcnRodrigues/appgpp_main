import { NextRequest, NextResponse } from 'next/server';
import { criarFuncionario, listarFuncionarios, contarFuncionarios, listarFuncionariosTransferenciaCusto } from '@/features/funcionario/server/funcionario.service';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseDateInput, parseOptionalDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'FUNCIONARIOS');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar funcionários' }, { status: 403 });
    try {
        const { searchParams } = new URL(request.url);
        const nome = searchParams.get('nome');
        const matricula = searchParams.get('matricula');
        const status = searchParams.get('status');
        const função = searchParams.get('função');
        const modo = searchParams.get('modo');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '100');

        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;

        if (!allowAll && centros.length === 0) {
            return NextResponse.json({ data: [], total: 0 });
        }

        const filtro = {
            nome: nome || undefined,
            matricula: matricula || undefined,
            status: status || undefined,
            função: função || undefined,
            centros: filtroCentros,
            skip,
            take
        };

        const funcionarios = modo === 'transferencia-custo'
            ? await listarFuncionariosTransferenciaCusto(filtro)
            : await listarFuncionarios(filtro);

        const total = modo === 'transferencia-custo'
            ? funcionarios.length
            : await contarFuncionarios({
            nome: nome || undefined,
            matricula: matricula || undefined,
            status: status || undefined,
            função: função || undefined,
            centros: filtroCentros
        });

        return NextResponse.json({
            data: funcionarios,
            total
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
    const canAccess = await hasModuleAccessForRequest(request, 'FUNCIONARIOS');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissão para criar funcionário' }, { status: 403 });
    try {
        const dados = await request.json();

        if (!dados.idMatFun || !dados.nomeFun) {
            return NextResponse.json(
                { message: 'Campos obrigat?rios faltando (idMatFun, nomeFun)' },
                { status: 400 }
            );
        }

        const licencasVinculos = Array.isArray(dados.licencasVinculos)
            ? dados.licencasVinculos.map((v: any) => ({
                idLic: v.idLic,
                dataInicio: parseDateInput(v.dataInicio),
                dataVencimetno: parseDateInput(v.dataVencimetno)
            }))
            : [];

        const funcionario = await criarFuncionario({
            idMatFun: dados.idMatFun,
            nomeFun: dados.nomeFun,
            cpfFun: dados.cpfFun,
            dataAdmFun: parseOptionalDateInput(dados.dataAdmFun),
            avatarFun: dados.avatarFun,
            idFuncaoFun: dados.idFuncaoFun,
            idStatusFun: dados.idStatusFun,
            idCustoFun: dados.idCustoFun,
            idUserFun: dados.idUserFun,
            licencasVinculos
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



