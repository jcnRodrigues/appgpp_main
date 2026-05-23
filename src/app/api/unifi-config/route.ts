import { NextRequest, NextResponse } from 'next/server';
import {
  activateUnifiConfig,
  deactivateUnifiConfig,
  deleteUnifiConfig,
  getAllUnifiConfigs,
  getUnifiConfig,
  saveUnifiConfig,
} from '@/back-end/service/unifi.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'UNIFI_CONFIG');
  if (!canAccess) return NextResponse.json({ error: 'Sem permissao para acessar configuracoes' }, { status: 403 });

  const searchParams = request.nextUrl.searchParams;
  const all = searchParams.get('all');

  if (all === 'true') {
    try {
      const configs = await getAllUnifiConfigs();
      const safeConfigs = configs.map(config => ({
        id: config.id,
        type: config.type,
        apiKey: config.apiKey ? `${config.apiKey.substring(0, 8)}...${config.apiKey.substring(config.apiKey.length - 4)}` : null,
        isActive: config.isActive,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      }));
      return NextResponse.json({ configs: safeConfigs });
    } catch (error) {
      console.error('Erro ao recuperar configuracoes:', error);
      return NextResponse.json({ error: 'Erro ao recuperar configuracoes' }, { status: 500 });
    }
  }

  try {
    const config = await getUnifiConfig();
    if (!config) return NextResponse.json({ config: null });

    const safeConfig = {
      id: config.id,
      type: config.type,
      host: config.host,
      username: config.username,
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };

    return NextResponse.json({ config: safeConfig });
  } catch (error) {
    console.error('Erro ao recuperar configuracao:', error);
    return NextResponse.json({ error: 'Erro ao recuperar configuracao' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'UNIFI_CONFIG');
  const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
  if (!canAccess || !canCreate) return NextResponse.json({ error: 'Sem permissao para salvar configuracao' }, { status: 403 });

  try {
    const body = await request.json();
    const { type, apiKey, host, username, password } = body;

    if (!type) {
      return NextResponse.json({ error: 'Tipo de API e necessario' }, { status: 400 });
    }

    const config = await saveUnifiConfig({
      type,
      apiKey: apiKey || undefined,
      host: host || undefined,
      username: username || undefined,
      password: password || undefined,
    });

    return NextResponse.json({ config, message: 'Configuracao salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar configuracao:', error);
    return NextResponse.json({ error: 'Erro ao salvar configuracao' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'UNIFI_CONFIG');
  const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
  if (!canAccess || !canDelete) return NextResponse.json({ error: 'Sem permissao para deletar' }, { status: 403 });

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (id) {
    try {
      await deactivateUnifiConfig(id);
      return NextResponse.json({ message: 'Configuracao desativada com sucesso' });
    } catch (error) {
      console.error('Erro ao desativar configuracao:', error);
      return NextResponse.json({ error: 'Erro ao desativar configuracao' }, { status: 500 });
    }
  }

  try {
    await deleteUnifiConfig();
    return NextResponse.json({ message: 'Configuracao deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar configuracao:', error);
    return NextResponse.json({ error: 'Erro ao deletar configuracao' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'UNIFI_CONFIG');
  const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
  if (!canAccess || !canUpdate) return NextResponse.json({ error: 'Sem permissao para ativar configuracao' }, { status: 403 });

  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID e necessario para ativar configuracao' }, { status: 400 });
    }

    const config = await activateUnifiConfig(id);
    return NextResponse.json({ config, message: 'Configuracao ativa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao ativar configuracao:', error);
    return NextResponse.json({ error: 'Erro ao ativar configuracao' }, { status: 500 });
  }
}
