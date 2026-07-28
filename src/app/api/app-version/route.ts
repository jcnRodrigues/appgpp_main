import { NextResponse } from 'next/server';
import { getInstalledAppVersion } from '@/lib/app-version';

export async function GET() {
  try {
    const version = await getInstalledAppVersion();
    return NextResponse.json(version);
  } catch (error: any) {
    return NextResponse.json(
      { version: 'desconhecida', updatedAt: null, source: 'unknown', message: error?.message || 'Erro ao obter versão.' },
      { status: 500 }
    );
  }
}
