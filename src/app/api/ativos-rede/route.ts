import { NextRequest, NextResponse } from 'next/server';
import {
    contarAtivosRede,
    criarAtivoRede,
    listarAtivosRede
} from '@/features/ativos-rede/server/ativo-rede.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { parseDateInput, parseOptionalDateInput } from '@/lib/date-input';

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar ativos de rede' }, { status: 403 });

    try {
        const { searchParams } = new URL(request.url);
        const codigo = searchParams.get('codigo');
        const nome = searchParams.get('nome');
        const tipo = searchParams.get('tipo');
        const status = searchParams.get('status');
        const statusId = searchParams.get('statusId');
        const local = searchParams.get('local');
        const skip = parseInt(searchParams.get('skip') || '0', 10);
        const take = parseInt(searchParams.get('take') || '100', 10);

        const [data, total] = await Promise.all([
            listarAtivosRede({
                codigo: codigo || undefined,
                nome: nome || undefined,
                tipo: tipo || undefined,
                status: status || undefined,
                idStatusAtivoRede: statusId || undefined,
                local: local || undefined,
                skip,
                take
            }),
            contarAtivosRede({
                codigo: codigo || undefined,
                nome: nome || undefined,
                tipo: tipo || undefined,
                status: status || undefined,
                idStatusAtivoRede: statusId || undefined,
                local: local || undefined
            })
        ]);

        return NextResponse.json({ data, total });
    } catch (error) {
        console.error('Erro ao listar ativos de rede:', error);
        return NextResponse.json({ message: 'Erro ao listar ativos de rede' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'ATIVOS_REDE');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) {
        return NextResponse.json({ message: 'Sem permissão para criar ativo de rede' }, { status: 403 });
    }

    try {
        const dados = await request.json();
        if (!dados.codigoAtivoRede || !dados.nomeAtivoRede || !dados.dataEntradaAtivoRede || !dados.idTipoAtivoRede || !dados.idStatusAtivoRede || !dados.idCCustoAtivoRede) {
            return NextResponse.json({ message: 'Campos obrigat?rios faltando' }, { status: 400 });
        }

        const ativo = await criarAtivoRede({
            codigoAtivoRede: String(dados.codigoAtivoRede).trim().toUpperCase(),
            nomeAtivoRede: String(dados.nomeAtivoRede).trim().toUpperCase(),
            idTipoAtivoRede: typeof dados.idTipoAtivoRede === 'string' ? dados.idTipoAtivoRede : null,
            tipoAtivoRede: typeof dados.tipoAtivoRede === 'string' ? String(dados.tipoAtivoRede).trim().toUpperCase() : undefined,
            idFornecedorAtivoRede: typeof dados.idFornecedorAtivoRede === 'string' ? dados.idFornecedorAtivoRede : null,
            fabricanteAtivoRede: typeof dados.fabricanteAtivoRede === 'string' ? dados.fabricanteAtivoRede.trim().toUpperCase() || undefined : undefined,
            modeloAtivoRede: typeof dados.modeloAtivoRede === 'string' ? dados.modeloAtivoRede.trim().toUpperCase() || undefined : undefined,
            serialAtivoRede: typeof dados.serialAtivoRede === 'string' ? dados.serialAtivoRede.trim().toUpperCase() || undefined : undefined,
            macAtivoRede: typeof dados.macAtivoRede === 'string' ? dados.macAtivoRede.trim().toUpperCase() || undefined : undefined,
            ipGerenciamentoAtivoRede: typeof dados.ipGerenciamentoAtivoRede === 'string' ? dados.ipGerenciamentoAtivoRede.trim() || undefined : undefined,
            hostnameAtivoRede: typeof dados.hostnameAtivoRede === 'string' ? dados.hostnameAtivoRede.trim().toUpperCase() || undefined : undefined,
            localInstalacaoAtivoRede: typeof dados.localInstalacaoAtivoRede === 'string' ? dados.localInstalacaoAtivoRede.trim().toUpperCase() || undefined : undefined,
            rackAtivoRede: typeof dados.rackAtivoRede === 'string' ? dados.rackAtivoRede.trim().toUpperCase() || undefined : undefined,
            portaSwitchAtivoRede: typeof dados.portaSwitchAtivoRede === 'string' ? dados.portaSwitchAtivoRede.trim().toUpperCase() || undefined : undefined,
            fotoAtivoRede: typeof dados.fotoAtivoRede === 'string' ? dados.fotoAtivoRede : null,
            dataEntradaAtivoRede: parseDateInput(dados.dataEntradaAtivoRede),
            dataInstalacaoAtivoRede: parseOptionalDateInput(dados.dataInstalacaoAtivoRede),
            idStatusAtivoRede: typeof dados.idStatusAtivoRede === 'string' ? dados.idStatusAtivoRede : null,
            statusAtivoRede: typeof dados.statusAtivoRede === 'string' ? String(dados.statusAtivoRede).trim().toUpperCase() : undefined,
            idCCustoAtivoRede: typeof dados.idCCustoAtivoRede === 'string' ? dados.idCCustoAtivoRede : null,
            centroResponsavelAtivoRede: typeof dados.centroResponsavelAtivoRede === 'string' ? dados.centroResponsavelAtivoRede.trim().toUpperCase() || undefined : undefined,
            observacaoAtivoRede: typeof dados.observacaoAtivoRede === 'string' ? dados.observacaoAtivoRede.trim() || undefined : undefined
        });

        return NextResponse.json(ativo, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar ativo de rede:', error);
        const message = error instanceof Error ? error.message : 'Erro ao criar ativo de rede';
        const status = message.includes('Já existe um ativo de rede com este código') || message.includes('Código do ativo de rede é obrigatório')
            ? 409
            : 500;
        return NextResponse.json({ message }, { status });
    }
}

