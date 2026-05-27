import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../prisma/prisma';
import { deletarAlocacao } from '@/back-end/service/Cadastro.service/cadastro.service';
import { deletarCentroCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import { deletarFuncao } from '@/back-end/service/Funcao.service/funcao.service';
import { deletarLicenca } from '@/back-end/service/Licenca.service/licenca.service';
import { deleteUnifiConfig } from '@/back-end/service/unifi.service';
import { hasActionPermissionForRequest } from '@/lib/access';

type DeleteResource =
    | 'funcionario'
    | 'patrimonio'
    | 'cadastro'
    | 'ccusto'
    | 'funcao'
    | 'licenca'
    | 'usuario_acesso'
    | 'unifi_config';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const attemptStore = new Map<string, { count: number; firstAt: number; blockedUntil?: number }>();

function getClientKey(request: NextRequest, email: string) {
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown-ip';
    return `${ip}::${email}`;
}

function checkRateLimit(key: string) {
    const now = Date.now();
    const record = attemptStore.get(key);
    if (!record) return { allowed: true };

    if (record.blockedUntil && record.blockedUntil > now) {
        return { allowed: false, retryAfterMs: record.blockedUntil - now };
    }

    if (now - record.firstAt > WINDOW_MS) {
        attemptStore.delete(key);
        return { allowed: true };
    }

    return { allowed: true };
}

function registerFailedAttempt(key: string) {
    const now = Date.now();
    const record = attemptStore.get(key);
    if (!record || now - record.firstAt > WINDOW_MS) {
        attemptStore.set(key, { count: 1, firstAt: now });
        return;
    }

    const nextCount = record.count + 1;
    const blockedUntil = nextCount >= MAX_ATTEMPTS ? now + BLOCK_MS : undefined;
    attemptStore.set(key, { count: nextCount, firstAt: record.firstAt, blockedUntil });
}

function clearAttempts(key: string) {
    attemptStore.delete(key);
}

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
        const canRequestDelete = await hasActionPermissionForRequest(request, 'DELETE');
        if (!canRequestDelete) {
            return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
        }
        const body = await request.json();
        const resource = body?.resource as DeleteResource;
        const id = typeof body?.id === 'string' ? body.id : undefined;
        const email = String(body?.email || '').trim().toLowerCase();
        const senha = String(body?.senha || '');

        if (!resource || !email || !senha) {
            return NextResponse.json({ message: 'Dados obrigatorios faltando' }, { status: 400 });
        }

        const key = getClientKey(request, email);
        const limitState = checkRateLimit(key);
        if (!limitState.allowed) {
            const retryAfter = Math.ceil((limitState.retryAfterMs || BLOCK_MS) / 1000);
            return NextResponse.json(
                { message: `Muitas tentativas. Tente novamente em ${retryAfter}s.` },
                { status: 429, headers: { 'Retry-After': String(retryAfter) } }
            );
        }

        const autorizador = await (prisma as any).tbUser.findFirst({
            where: {
                emailUser: email,
                authTypeUser: 'LOCAL',
                statusUser: 'ATIVO'
            }
        });

        if (!autorizador?.senhaUser) {
            registerFailedAttempt(key);
            return NextResponse.json({ message: 'Usuario autorizador invalido' }, { status: 401 });
        }

        const formularios = Array.isArray(autorizador.formulariosUser) ? autorizador.formulariosUser : [];
        if (!formularios.includes('DELETE_ANY')) {
            registerFailedAttempt(key);
            return NextResponse.json({ message: 'Usuario sem permissao de exclusao' }, { status: 403 });
        }

        if (!verifySenha(senha, autorizador.senhaUser)) {
            registerFailedAttempt(key);
            return NextResponse.json({ message: 'Credenciais invalidas' }, { status: 401 });
        }

        clearAttempts(key);
        await executeDelete(resource, id);
        return NextResponse.json({ message: 'Registro deletado com sucesso' });
    } catch (error: any) {
        console.error('Erro ao executar exclusao autorizada:', error);
        return NextResponse.json({ message: error?.message || 'Erro ao deletar registro' }, { status: 500 });
    }
}
