import { NextRequest, NextResponse } from 'next/server';
import { getSystemConfig, saveSystemConfig } from '@/features/unifi-config/server/unifi.service';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { getAppPublicUrlInfo } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'SISTEMA');
  if (!canAccess) {
    return NextResponse.json({ error: 'Sem permissao para acessar a configuracao do sistema' }, { status: 403 });
  }

  const config = await getSystemConfig();
  const info = getAppPublicUrlInfo({ savedUrl: (config as any)?.publicUrl });

  return NextResponse.json({
    config: config
      ? {
          publicUrl: (config as any).publicUrl || '',
          identitySource: (config as any).identitySource || 'UNIFI',
          identitySourceNotes: (config as any).identitySourceNotes || '',
        }
      : null,
    effectivePublicUrl: info.url,
    effectivePublicUrlSource: info.source,
  });
}

export async function PATCH(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'SISTEMA');
  const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
  if (!canAccess || !canUpdate) {
    return NextResponse.json({ error: 'Sem permissao para alterar a configuracao do sistema' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const publicUrl = typeof body?.publicUrl === 'string' ? body.publicUrl.trim() : '';
    const identitySource = typeof body?.identitySource === 'string' ? body.identitySource.trim().toUpperCase() : 'UNIFI';
    const identitySourceNotes = typeof body?.identitySourceNotes === 'string' ? body.identitySourceNotes.trim() : '';

    const config = await saveSystemConfig({
      publicUrl: publicUrl || undefined,
      identitySource,
      identitySourceNotes: identitySourceNotes || undefined,
    });

    const info = getAppPublicUrlInfo({ savedUrl: (config as any)?.publicUrl });

    return NextResponse.json({
      config: {
        publicUrl: (config as any)?.publicUrl || '',
        identitySource: (config as any)?.identitySource || 'UNIFI',
        identitySourceNotes: (config as any)?.identitySourceNotes || '',
      },
      effectivePublicUrl: info.url,
      effectivePublicUrlSource: info.source,
      message: 'Configuracao do sistema atualizada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao salvar configuracao do sistema:', error);
    return NextResponse.json({ error: 'Erro ao salvar configuracao do sistema' }, { status: 500 });
  }
}
