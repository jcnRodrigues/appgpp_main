import { NextRequest, NextResponse } from 'next/server';
import { hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { obterProximoCodigoDevolucao } from '@/features/devolucao/server/devolucaoCodigo.service';

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'PATRIMONIO');
  const canPrint = await hasActionPermissionForRequest(request, 'PRINT');
  if (!canAccess || !canPrint) {
    return NextResponse.json({ message: 'Sem permissão para gerar código de devolução' }, { status: 403 });
  }

  try {
    const { codigo, mes, ano, contador } = await obterProximoCodigoDevolucao();

    return NextResponse.json({
      codigo,
      mes,
      ano,
      contador
    });
  } catch (error) {
    console.error('Erro ao gerar código de devolução:', error);
    return NextResponse.json({ message: 'Erro ao gerar código de devolução' }, { status: 500 });
  }
}
