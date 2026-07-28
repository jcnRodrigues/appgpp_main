import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth-options';
import { hasModuleAccess } from '@/lib/permissions';
import { listarLogsSistema } from '@/features/system-logs/server/system-logs.service';

export async function GET() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Usuario nao autenticado.' }, { status: 401 });
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'SISTEMA')) {
    return NextResponse.json({ error: 'Sem permissao para acessar os logs do sistema.' }, { status: 403 });
  }

  const snapshot = await listarLogsSistema();
  return NextResponse.json(snapshot);
}
