import { NextRequest, NextResponse } from 'next/server';
import { applyHostInventoryAgentOverrides, loadHostInventoryAgentScript } from '@/lib/monitor-patrimonios-agent-script';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expectedToken = (process.env.HOST_INVENTORY_AGENT_DOWNLOAD_TOKEN || process.env.HOST_INVENTORY_AGENT_TOKEN || '').trim();
  const providedToken = (searchParams.get('downloadToken') || searchParams.get('token') || '').trim();

  if (!expectedToken) {
    return NextResponse.json({ error: 'Token de download nao configurado no servidor.' }, { status: 403 });
  }

  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: 'Token invalido para download do agente.' }, { status: 403 });
  }

  const serverUrl = searchParams.get('serverUrl')?.trim();
  const agentToken = searchParams.get('agentToken')?.trim() || process.env.HOST_INVENTORY_AGENT_TOKEN || '';

  const original = await loadHostInventoryAgentScript();
  const content = applyHostInventoryAgentOverrides(original, { serverUrl, token: agentToken, serviceMode: false });

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="HostInventoryAgent.ps1"',
      'Cache-Control': 'no-store',
    },
  });
}
