import { NextRequest, NextResponse } from 'next/server';
import { getFuncionarioByIdInterno, atualizarFuncionario } from '@/back-end/service/Funcionario.service/funcionario.service';
import prisma from '../../../../../prisma/prisma';
import { getCentrosFiltro } from '@/lib/access';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const funcionario = await getFuncionarioByIdInterno(id);

        if (!funcionario) {
            return NextResponse.json(
                { message: 'Funcionário não encontrado' },
                { status: 404 }
            );
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0) {
            const centroId = funcionario.idCustoFun || '';
            if (!centros.includes(centroId)) {
                return NextResponse.json(
                    { message: 'Funcionário não encontrado' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(funcionario);
    } catch (error) {
        console.error('Erro ao obter funcionário:', error);
        return NextResponse.json(
            { message: 'Erro ao obter funcionário' },
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

        // Validação mínima
        if (!dados || Object.keys(dados).length === 0) {
            return NextResponse.json({ message: 'Nenhum dado para atualizar' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};
        if (typeof dados.nomeFun !== 'undefined') updateData.nomeFun = dados.nomeFun;
        if (typeof dados.cpfFun !== 'undefined') updateData.cpfFun = dados.cpfFun;
        if (typeof dados.dataAdmFun !== 'undefined' && dados.dataAdmFun !== null) updateData.dataAdmFun = new Date(dados.dataAdmFun);
        if (typeof dados.dataDesFun !== 'undefined' && dados.dataDesFun !== null) updateData.dataDesFun = new Date(dados.dataDesFun);
        if (typeof dados.avatarFun !== 'undefined') updateData.avatarFun = dados.avatarFun;
        if (typeof dados.idFuncaoFun !== 'undefined') updateData.idFuncaoFun = dados.idFuncaoFun;
        if (typeof dados.idStatusFun !== 'undefined') updateData.idStatusFun = dados.idStatusFun;
        if (typeof dados.idCustoFun !== 'undefined') updateData.idCustoFun = dados.idCustoFun;
        if (typeof dados.idUserFun !== 'undefined') updateData.idUserFun = dados.idUserFun;

        const funcionario = await atualizarFuncionario(id, updateData);

        return NextResponse.json(funcionario);
    } catch (error: unknown) {
        console.error('Erro ao atualizar funcionário:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao atualizar funcionário' },
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

        // Verificar se funcionário existe
        const funcionario = await getFuncionarioByIdInterno(id);
        if (!funcionario) {
            return NextResponse.json(
                { message: 'Funcionário não encontrado' },
                { status: 404 }
            );
        }

        // Deletar funcionário
        await prisma.tbFuncionario.delete({
            where: { idF: id }
        });

        return NextResponse.json({ message: 'Funcionário deletado com sucesso' });
    } catch (error: unknown) {
        console.error('Erro ao deletar funcionário:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erro ao deletar funcionário' },
            { status: 500 }
        );
    }
}
