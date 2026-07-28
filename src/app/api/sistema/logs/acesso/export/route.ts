import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth-options';
import { hasModuleAccess } from '@/lib/permissions';
import {
  exportarLogsAcessoCsv,
  filtrarLogsAcesso,
  listarLogsAcesso,
  type AccessLogStatusFilter
} from '@/features/system-logs/server/access-logs.service';

function parseStatus(value: string | null): AccessLogStatusFilter {
  if (value === 'SUCCESS' || value === 'FAILED') return value;
  return 'ALL';
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Usuario nao autenticado.' }, { status: 401 });
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'SISTEMA')) {
    return NextResponse.json({ error: 'Sem permissao para exportar os logs do sistema.' }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = parseStatus(url.searchParams.get('status'));
  const logs = await listarLogsAcesso(500);
  const filtered = filtrarLogsAcesso(logs, status);
  const csv = exportarLogsAcessoCsv(filtered);
  const filename = `appgpp-logins-${status.toLowerCase()}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store'
    }
  });
}
