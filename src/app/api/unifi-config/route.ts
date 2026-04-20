import { NextRequest, NextResponse } from 'next/server';
import {
  activateUnifiConfig,
  deactivateUnifiConfig,
  deleteUnifiConfig,
  getAllUnifiConfigs,
  getUnifiConfig,
  saveUnifiConfig,
} from '@/back-end/service/unifi.service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const all = searchParams.get('all');

  if (all === 'true') {
    // Retornar todas as configurações (histórico)
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
      console.error('Erro ao recuperar configurações:', error);
      return NextResponse.json({ error: 'Erro ao recuperar configurações' }, { status: 500 });
    }
  } else {
    // Retornar apenas configuração ativa
    try {
      const config = await getUnifiConfig();
      if (!config) {
        return NextResponse.json({ config: null });
      }

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
      console.error('Erro ao recuperar configuração:', error);
      return NextResponse.json({ error: 'Erro ao recuperar configuração' }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, apiKey, host, username, password } = body;

    if (!type) {
      return NextResponse.json({ error: 'Tipo de API é necessário' }, { status: 400 });
    }

    const config = await saveUnifiConfig({
      type,
      apiKey: apiKey || undefined,
      host: host || undefined,
      username: username || undefined,
      password: password || undefined,
    });

    return NextResponse.json({ config, message: 'Configuração salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (id) {
    // Desativar configuração específica
    try {
      await deactivateUnifiConfig(id);
      return NextResponse.json({ message: 'Configuração desativada com sucesso' });
    } catch (error) {
      console.error('Erro ao desativar configuração:', error);
      return NextResponse.json({ error: 'Erro ao desativar configuração' }, { status: 500 });
    }
  } else {
    // Deletar configuração ativa
    try {
      await deleteUnifiConfig();
      return NextResponse.json({ message: 'Configuração deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar configuração:', error);
      return NextResponse.json({ error: 'Erro ao deletar configuração' }, { status: 500 });
    }
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID é necessário para ativar configuração' }, { status: 400 });
    }

    const config = await activateUnifiConfig(id);
    return NextResponse.json({ config, message: 'Configuração ativa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao ativar configuração:', error);
    return NextResponse.json({ error: 'Erro ao ativar configuração' }, { status: 500 });
  }
}
