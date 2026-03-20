import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../prisma/prisma';

const prismaClient = prisma as any;

export const runtime = 'nodejs';

function hashSenha(senha: string) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(senha, salt, 64);
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function normalizeArray(value: any) {
    return Array.isArray(value) ? value : [];
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const usuario = await prismaClient.tbUser.findUnique({ where: { id } });

            if (!usuario) {
                return NextResponse.json({ message: 'Usuario nao encontrado' }, { status: 404 });
            }

            return NextResponse.json({
                data: {
                    id: usuario.id,
                    nome: usuario.nomeUser || '',
                    email: usuario.emailUser || '',
                    authType: (usuario.authTypeUser as 'LOCAL' | 'GOOGLE') || 'GOOGLE',
                    centros: normalizeArray(usuario.centrosUser),
                    formularios: normalizeArray(usuario.formulariosUser),
                    status: (usuario.statusUser as 'ATIVO' | 'INATIVO') || 'ATIVO',
                    createdAt: usuario.createdAt.toISOString(),
                    updatedAt: usuario.updatedAt.toISOString()
                }
            });
        }

        const usuarios = await prismaClient.tbUser.findMany({
            where: {
                authTypeUser: {
                    in: ['LOCAL', 'GOOGLE']
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        const data = usuarios.map((u: any) => ({
            id: u.id,
            nome: u.nomeUser || '',
            email: u.emailUser || '',
            authType: (u.authTypeUser as 'LOCAL' | 'GOOGLE') || 'GOOGLE',
            centros: normalizeArray(u.centrosUser),
            formularios: normalizeArray(u.formulariosUser),
            status: (u.statusUser as 'ATIVO' | 'INATIVO') || 'ATIVO',
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString()
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Erro ao listar acessos:', error);
        return NextResponse.json({ message: 'Erro ao listar acessos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        const nome = String(payload.nome || '').trim();
        const email = String(payload.email || '').trim().toLowerCase();
        const authType = payload.authType === 'LOCAL' ? 'LOCAL' : 'GOOGLE';
        const status = payload.status === 'INATIVO' ? 'INATIVO' : 'ATIVO';
        const centros = normalizeArray(payload.centros);
        const formularios = normalizeArray(payload.formularios);
        const senha = payload.senha ? String(payload.senha) : '';

        if (!nome || !email) {
            return NextResponse.json({ message: 'Nome e email sao obrigatorios' }, { status: 400 });
        }

        if (authType === 'LOCAL' && !senha) {
            return NextResponse.json({ message: 'Senha obrigatoria para acesso local' }, { status: 400 });
        }

        const existente = await prismaClient.tbUser.findFirst({
            where: {
                emailUser: email,
                authTypeUser: authType
            }
        });
        if (existente) {
            return NextResponse.json({ message: 'Ja existe acesso para este email e tipo' }, { status: 409 });
        }

        const created = await prismaClient.tbUser.create({
            data: {
                nomeUser: nome,
                emailUser: email,
                authTypeUser: authType,
                senhaUser: authType === 'LOCAL' ? hashSenha(senha) : null,
                formulariosUser: formularios,
                centrosUser: centros,
                statusUser: status
            }
        });

        return NextResponse.json({
            data: {
                id: created.id,
                nome: created.nomeUser || '',
                email: created.emailUser || '',
                authType: (created.authTypeUser as 'LOCAL' | 'GOOGLE') || 'GOOGLE',
                centros,
                formularios,
                status: (created.statusUser as 'ATIVO' | 'INATIVO') || 'ATIVO',
                createdAt: created.createdAt.toISOString(),
                updatedAt: created.updatedAt.toISOString()
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar acesso:', error);
        return NextResponse.json({ message: 'Erro ao criar acesso' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json();
        const id = String(payload.id || '').trim();

        if (!id) {
            return NextResponse.json({ message: 'ID obrigatorio' }, { status: 400 });
        }

        const nome = String(payload.nome || '').trim();
        const email = String(payload.email || '').trim().toLowerCase();
        const authType = payload.authType === 'LOCAL' ? 'LOCAL' : 'GOOGLE';
        const status = payload.status === 'INATIVO' ? 'INATIVO' : 'ATIVO';
        const centros = normalizeArray(payload.centros);
        const formularios = normalizeArray(payload.formularios);
        const senha = payload.senha ? String(payload.senha) : '';

        if (!nome || !email) {
            return NextResponse.json({ message: 'Nome e email sao obrigatorios' }, { status: 400 });
        }

        const existente = await prismaClient.tbUser.findFirst({
            where: {
                id: { not: id },
                emailUser: email,
                authTypeUser: authType
            }
        });
        if (existente) {
            return NextResponse.json({ message: 'Ja existe acesso para este email e tipo' }, { status: 409 });
        }

        const dataToUpdate: any = {
            nomeUser: nome,
            emailUser: email,
            authTypeUser: authType,
            formulariosUser: formularios,
            centrosUser: centros,
            statusUser: status
        };

        if (authType === 'LOCAL') {
            if (senha) {
                dataToUpdate.senhaUser = hashSenha(senha);
            }
        } else {
            dataToUpdate.senhaUser = null;
        }

        const updated = await prismaClient.tbUser.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json({
            data: {
                id: updated.id,
                nome: updated.nomeUser || '',
                email: updated.emailUser || '',
                authType: (updated.authTypeUser as 'LOCAL' | 'GOOGLE') || 'GOOGLE',
                centros,
                formularios,
                status: (updated.statusUser as 'ATIVO' | 'INATIVO') || 'ATIVO',
                createdAt: updated.createdAt.toISOString(),
                updatedAt: updated.updatedAt.toISOString()
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar acesso:', error);
        return NextResponse.json({ message: 'Erro ao atualizar acesso' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID obrigatorio' }, { status: 400 });
        }

        await prismaClient.tbUser.delete({ where: { id } });

        return NextResponse.json({ message: 'Acesso removido' });
    } catch (error) {
        console.error('Erro ao remover acesso:', error);
        return NextResponse.json({ message: 'Erro ao remover acesso' }, { status: 500 });
    }
}

