import { NextRequest, NextResponse } from 'next/server';
import { criarFuncionario, listarFuncionarios, contarFuncionarios } from '@/back-end/service/Funcionario.service/funcionario.service';
import { getCentrosFiltro } from '@/lib/access';
import { parseDateInput, parseOptionalDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nome = searchParams.get('nome');
        const status = searchParams.get('status');
        const funcao = searchParams.get('funcao');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '100');

        const { centros, allowAll } = await getCentrosFiltro(request);
        const filtroCentros = allowAll ? undefined : centros;

        if (!allowAll && centros.length === 0) {
            return NextResponse.json({ data: [], total: 0 });
        }

        const funcionarios = await listarFuncionarios({
            nome: nome || undefined,
            status: status || undefined,
            funcao: funcao || undefined,
            centros: filtroCentros,
            skip,
            take
        });
        const total = await contarFuncionarios({
            nome: nome || undefined,
            status: status || undefined,
            funcao: funcao || undefined,
            centros: filtroCentros
        });

        return NextResponse.json({
            data: funcionarios,
            total
        });
    } catch (error) {
        console.error('Erro ao listar funcionarios:', error);
        return NextResponse.json(
            { message: 'Erro ao listar funcionarios' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const dados = await request.json();

        if (!dados.idMatFun || !dados.nomeFun) {
            return NextResponse.json(
                { message: 'Campos obrigatorios faltando (idMatFun, nomeFun)' },
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
        console.error('Erro ao criar funcionario:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Matricula ja existe' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: error.message || 'Erro ao criar funcionario' },
            { status: 500 }
        );
    }
}
