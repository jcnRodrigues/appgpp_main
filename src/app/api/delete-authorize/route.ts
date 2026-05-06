import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../prisma/prisma';
import { deletarAlocacao } from '@/back-end/service/Cadastro.service/cadastro.service';
import { deletarCentroCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import { deletarFuncao } from '@/back-end/service/Funcao.service/funcao.service';
import { deletarLicenca } from '@/back-end/service/Licenca.service/licenca.service';
import { deleteUnifiConfig } from '@/back-end/service/unifi.service';

type DeleteResource =
    | 'funcionario'
    | 'patrimonio'
    | 'cadastro'
    | 'ccusto'
    | 'funcao'
    | 'licenca'
    | 'usuario_acesso'
    | 'unifi_config';

function verifySenha(senha: string, hash: string) {
    const [saltHex, storedHex] = hash.split(':');
    if (!saltHex || !storedHex) return false;
    const salt = Buffer.from(saltHex, 'hex');
    const stored = Buffer.from(storedHex, 'hex');
    const computed = crypto.scryptSync(senha, salt, stored.length);
    return crypto.timingSafeEqual(stored, computed);
}

async function executeDelete(resource: DeleteResource, id?: string) {
    switch (resource) {
        case 'funcionario':
            if (!id) throw new Error('ID obrigatorio para funcionario');
            await prisma.tbFuncionario.delete({ where: { idF: id } });
            return;
        case 'patrimonio':
            if (!id) throw new Error('ID obrigatorio para patrimonio');
            await prisma.tbPatrimonio.delete({ where: { idP: id } });
            return;
        case 'cadastro':
            if (!id) throw new Error('ID obrigatorio para alocacao');
            await deletarAlocacao(id);
            return;
        case 'ccusto':
            if (!id) throw new Error('ID obrigatorio para centro de custo');
            await deletarCentroCusto(id);
            return;
        case 'funcao':
            if (!id) throw new Error('ID obrigatorio para funcao');
            await deletarFuncao(id);
            return;
        case 'licenca':
            if (!id) throw new Error('ID obrigatorio para licenca');
            await deletarLicenca(id);
            return;
        case 'usuario_acesso':
            if (!id) throw new Error('ID obrigatorio para usuario de acesso');
            await prisma.tbUser.delete({ where: { id } });
            return;
        case 'unifi_config':
            await deleteUnifiConfig();
            return;
        default:
            throw new Error('Recurso de exclusao invalido');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const resource = body?.resource as DeleteResource;
        const id = typeof body?.id === 'string' ? body.id : undefined;
        const email = String(body?.email || '').trim().toLowerCase();
        const senha = String(body?.senha || '');

        if (!resource || !email || !senha) {
            return NextResponse.json({ message: 'Dados obrigatorios faltando' }, { status: 400 });
        }

        const autorizador = await (prisma as any).tbUser.findFirst({
            where: {
                emailUser: email,
                authTypeUser: 'LOCAL',
                statusUser: 'ATIVO'
            }
        });

        if (!autorizador?.senhaUser) {
            return NextResponse.json({ message: 'Usuario autorizador invalido' }, { status: 401 });
        }

        const formularios = Array.isArray(autorizador.formulariosUser) ? autorizador.formulariosUser : [];
        if (!formularios.includes('DELETE_ANY')) {
            return NextResponse.json({ message: 'Usuario sem permissao de exclusao' }, { status: 403 });
        }

        if (!verifySenha(senha, autorizador.senhaUser)) {
            return NextResponse.json({ message: 'Credenciais invalidas' }, { status: 401 });
        }

        await executeDelete(resource, id);
        return NextResponse.json({ message: 'Registro deletado com sucesso' });
    } catch (error: any) {
        console.error('Erro ao executar exclusao autorizada:', error);
        return NextResponse.json({ message: error?.message || 'Erro ao deletar registro' }, { status: 500 });
    }
}

