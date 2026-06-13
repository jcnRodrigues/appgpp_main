import { NextRequest, NextResponse } from 'next/server';
import { atualizarAtivoRede, getAtivoRedeById } from '@/features/ativos-rede/server/ativo-rede.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseDateInput, parseOptionalDateInput } from '@/lib/date-input';
import prisma from '../../../../../prisma/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissao para acessar ativo de rede' }, { status: 403 });

    const { id } = await params;
    try {
        const ativo = await getAtivoRedeById(id);
        if (!ativo) {
            return NextResponse.json({ message: 'Ativo de rede nao encontrado' }, { status: 404 });
        }
        return NextResponse.json(ativo);
    } catch (error) {
        console.error('Erro ao buscar ativo de rede:', error);
        return NextResponse.json({ message: 'Erro ao buscar ativo de rede' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
    if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissao para alterar ativo de rede' }, { status: 403 });

    const { id } = await params;

    try {
        const dados = await request.json();
        const ativo = await atualizarAtivoRede(id, {
            codigoAtivoRede: typeof dados.codigoAtivoRede === 'string' ? String(dados.codigoAtivoRede).trim().toUpperCase() : undefined,
            nomeAtivoRede: typeof dados.nomeAtivoRede === 'string' ? String(dados.nomeAtivoRede).trim().toUpperCase() : undefined,
            idTipoAtivoRede: typeof dados.idTipoAtivoRede === 'string' ? dados.idTipoAtivoRede : undefined,
            tipoAtivoRede: typeof dados.tipoAtivoRede === 'string' ? String(dados.tipoAtivoRede).trim().toUpperCase() : undefined,
            fabricanteAtivoRede: typeof dados.fabricanteAtivoRede === 'string' ? dados.fabricanteAtivoRede.trim().toUpperCase() || undefined : undefined,
            modeloAtivoRede: typeof dados.modeloAtivoRede === 'string' ? dados.modeloAtivoRede.trim().toUpperCase() || undefined : undefined,
            serialAtivoRede: typeof dados.serialAtivoRede === 'string' ? dados.serialAtivoRede.trim().toUpperCase() || undefined : undefined,
            macAtivoRede: typeof dados.macAtivoRede === 'string' ? dados.macAtivoRede.trim().toUpperCase() || undefined : undefined,
            ipGerenciamentoAtivoRede: typeof dados.ipGerenciamentoAtivoRede === 'string' ? dados.ipGerenciamentoAtivoRede.trim() || undefined : undefined,
            hostnameAtivoRede: typeof dados.hostnameAtivoRede === 'string' ? dados.hostnameAtivoRede.trim().toUpperCase() || undefined : undefined,
            localInstalacaoAtivoRede: typeof dados.localInstalacaoAtivoRede === 'string' ? dados.localInstalacaoAtivoRede.trim().toUpperCase() || undefined : undefined,
            rackAtivoRede: typeof dados.rackAtivoRede === 'string' ? dados.rackAtivoRede.trim().toUpperCase() || undefined : undefined,
            portaSwitchAtivoRede: typeof dados.portaSwitchAtivoRede === 'string' ? dados.portaSwitchAtivoRede.trim().toUpperCase() || undefined : undefined,
            dataEntradaAtivoRede: dados.dataEntradaAtivoRede ? parseDateInput(dados.dataEntradaAtivoRede) : undefined,
            dataInstalacaoAtivoRede: dados.dataInstalacaoAtivoRede ? parseOptionalDateInput(dados.dataInstalacaoAtivoRede) : undefined,
            idStatusAtivoRede: typeof dados.idStatusAtivoRede === 'string' ? dados.idStatusAtivoRede : undefined,
            statusAtivoRede: typeof dados.statusAtivoRede === 'string' ? String(dados.statusAtivoRede).trim().toUpperCase() : undefined,
            idCCustoAtivoRede: typeof dados.idCCustoAtivoRede === 'string' ? dados.idCCustoAtivoRede : undefined,
            centroResponsavelAtivoRede: typeof dados.centroResponsavelAtivoRede === 'string' ? dados.centroResponsavelAtivoRede.trim().toUpperCase() || undefined : undefined,
            observacaoAtivoRede: typeof dados.observacaoAtivoRede === 'string' ? dados.observacaoAtivoRede.trim() || undefined : undefined
        });

        return NextResponse.json(ativo);
    } catch (error) {
        console.error('Erro ao atualizar ativo de rede:', error);
        const message = error instanceof Error ? error.message : 'Erro ao atualizar ativo de rede';
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
    if (!canAccess || !canDelete) return NextResponse.json({ message: 'Sem permissao para excluir ativo de rede' }, { status: 403 });

    const { id } = await params;

    try {
        await prisma.tbAtivoRede.delete({
            where: { idAtivoRedePk: id }
        });
        return NextResponse.json({ message: 'Ativo de rede excluido com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir ativo de rede:', error);
        return NextResponse.json({ message: 'Erro ao excluir ativo de rede' }, { status: 500 });
    }
}
