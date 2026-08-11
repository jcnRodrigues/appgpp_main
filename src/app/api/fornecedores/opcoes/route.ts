import { NextRequest, NextResponse } from 'next/server';
import { listarCentrosFornecedor } from '@/features/fornecedor/server/fornecedor.service';
import { hasModuleAccessForRequest } from '@/lib/access';

export async function GET(request: NextRequest) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'FORNECEDORES');
    if (!canAccess) {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 });
    }

    const centros = await listarCentrosFornecedor();
    return NextResponse.json({ centros });
  } catch (error) {
    console.error('Erro ao obter opções de fornecedores:', error);
    return NextResponse.json({ message: 'Erro ao obter opções de fornecedores' }, { status: 500 });
  }
}
