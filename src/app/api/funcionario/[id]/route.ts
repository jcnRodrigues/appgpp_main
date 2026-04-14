import { NextRequest, NextResponse } from 'next/server';
import { getFuncionarioByIdInterno, atualizarFuncionario } from '@/back-end/service/Funcionario.service/funcionario.service';
import prisma from '../../../../../prisma/prisma';
import { getCentrosFiltro } from '@/lib/access';
import { parseDateInput, parseNullableDateInput } from '@/lib/date-input';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const funcionario = await getFuncionarioByIdInterno(id);

        if (!funcionario) {
            return NextResponse.json(
                { message: 'Funcionario nao encontrado' },
                { status: 404 }
            );
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0) {
            const centroId = funcionario.idCustoFun || '';
            if (!centros.includes(centroId)) {
                return NextResponse.json(
                    { message: 'Funcionario nao encontrado' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(funcionario);
    } catch (error) {
        console.error('Erro ao obter funcionario:', error);
        return NextResponse.json(
            { message: 'Erro ao obter funcionario' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dados = await request.json();

        if (!dados || Object.keys(dados).length === 0) {
            return NextResponse.json({ message: 'Nenhum dado para atualizar' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};
        if (typeof dados.nomeFun !== 'undefined') updateData.nomeFun = dados.nomeFun;
        if (typeof dados.cpfFun !== 'undefined') updateData.cpfFun = dados.cpfFun;
        if (typeof dados.dataAdmFun !== 'undefined') updateData.dataAdmFun = parseNullableDateInput(dados.dataAdmFun);
        if (typeof dados.dataDesFun !== 'undefined') updateData.dataDesFun = parseNullableDateInput(dados.dataDesFun);
        if (typeof dados.avatarFun !== 'undefined') updateData.avatarFun = dados.avatarFun;
        if (typeof dados.idFuncaoFun !== 'undefined') updateData.idFuncaoFun = dados.idFuncaoFun;
        if (typeof dados.idStatusFun !== 'undefined') updateData.idStatusFun = dados.idStatusFun;
        if (typeof dados.idCustoFun !== 'undefined') updateData.idCustoFun = dados.idCustoFun;
        if (typeof dados.idUserFun !== 'undefined') updateData.idUserFun = dados.idUserFun;
        if (Array.isArray(dados.licencasVinculos)) {
            updateData.licencasVinculos = dados.licencasVinculos.map((v: any) => ({
                idLic: v.idLic,
                dataInicio: parseDateInput(v.dataInicio),
                dataVencimetno: parseDateInput(v.dataVencimetno)
            }));
        }

        const funcionario = await atualizarFuncionario(id, updateData);

        return NextResponse.json(funcionario);
    } catch (error: unknown) {
        console.error('Erro ao atualizar funcionario:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao atualizar funcionario' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const funcionario = await getFuncionarioByIdInterno(id);
        if (!funcionario) {
            return NextResponse.json(
                { message: 'Funcionario nao encontrado' },
                { status: 404 }
            );
        }

        await prisma.tbFuncionario.delete({
            where: { idF: id }
        });

        return NextResponse.json({ message: 'Funcionario deletado com sucesso' });
    } catch (error: unknown) {
        console.error('Erro ao deletar funcionario:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao deletar funcionario' },
            { status: 500 }
        );
    }
}
