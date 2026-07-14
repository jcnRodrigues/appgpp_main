import { NextRequest, NextResponse } from 'next/server';
import { resolveAppBaseUrl } from '@/lib/app-url';
import { applyHostInventoryAgentOverrides, loadHostInventoryAgentScript } from '@/lib/monitor-patrimonios-agent-script';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serverUrl = searchParams.get('serverUrl')?.trim();
  const token = searchParams.get('token')?.trim() || process.env.HOST_INVENTORY_AGENT_TOKEN || '';

  const original = await loadHostInventoryAgentScript();
  const content = applyHostInventoryAgentOverrides(original, {
    serverUrl: resolveAppBaseUrl({ explicitUrl: serverUrl, requestOrigin: request.nextUrl.origin }),
    token,
    serviceMode: false,
  });

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="HostInventoryAgent.ps1"',
      'Cache-Control': 'no-store',
    },
  });
}
