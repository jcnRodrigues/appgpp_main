import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasModuleAccessForRequest } from '@/lib/access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeSingleQuotes(value: string) {
  return value.replace(/'/g, "''");
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'UNIFI_CONFIG');
  if (!canAccess) {
    return NextResponse.json({ error: 'Sem permissao para acessar o script do agente' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const serverUrl = searchParams.get('serverUrl')?.trim();
  const token = searchParams.get('token')?.trim() || process.env.HOST_INVENTORY_AGENT_TOKEN || '';

  const scriptPath = path.join(process.cwd(), 'scripts', 'HostInventoryAgent.ps1');
  const original = await fs.readFile(scriptPath, 'utf8');

  let content = original;
  if (serverUrl) {
    content = content.replace(
      /\[string\]\$ServerUrl = '([^']*)'/,
      `[string]$ServerUrl = '${escapeSingleQuotes(serverUrl)}'`
    );
  }

  if (token) {
    content = content.replace(
      /\[string\]\$Token = '([^']*)'/,
      `[string]$Token = '${escapeSingleQuotes(token)}'`
    );
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="HostInventoryAgent.ps1"',
      'Cache-Control': 'no-store',
    },
  });
}
