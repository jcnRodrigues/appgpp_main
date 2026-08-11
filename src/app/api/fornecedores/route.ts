import { NextRequest, NextResponse } from 'next/server';
import { contarFornecedores, criarFornecedor, listarFornecedores } from '@/features/fornecedor/server/fornecedor.service';
import { getAccessContext, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

function parseCentrosSelecionados(body: any) {
  const centros = Array.isArray(body?.centros) ? body.centros : [];
  return centros
    .map((item: any) => ({
      idCCusto: typeof item?.idCCusto === 'string' ? item.idCCusto.trim() : '',
      ehPrincipal: Boolean(item?.ehPrincipal)
    }))
    .filter((item: any) => Boolean(item.idCCusto));
}

async function validarCentrosEscopo(request: NextRequest, centrosSelecionados: Array<{ idCCusto: string }>) {
  const { centros, allowAll } = await getAccessContext(request);
  if (allowAll) return true;
  if (centros.length === 0) return centrosSelecionados.length === 0;
  return centrosSelecionados.every((item) => centros.includes(item.idCCusto));
}

export async function GET(request: NextRequest) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'FORNECEDORES');
    if (!canAccess) {
      return NextResponse.json({ message: 'Sem permissão para acessar fornecedores' }, { status: 403 });
    }

    const { centros, allowAll } = await getAccessContext(request);
    const { searchParams } = new URL(request.url);
    const razaoSocial = searchParams.get('razaoSocial') || undefined;
    const nomeFantasia = searchParams.get('nomeFantasia') || undefined;
    const cnpj = searchParams.get('cnpj') || undefined;
    const centroId = searchParams.get('centroId') || undefined;
    const skip = Number.parseInt(searchParams.get('skip') || '0', 10);
    const take = Number.parseInt(searchParams.get('take') || '100', 10);

    if (!allowAll && centros.length === 0) {
      return NextResponse.json({ data: [], total: 0 });
    }

    let centroIds: string[] | undefined = allowAll ? undefined : centros;
    if (centroId) {
      centroIds = allowAll || centros.includes(centroId) ? [centroId] : [];
    }

    if (!allowAll && centroId && (!centroIds || centroIds.length === 0)) {
      return NextResponse.json({ data: [], total: 0 });
    }

    const [data, total] = await Promise.all([
      listarFornecedores({ razaoSocial, nomeFantasia, cnpj, centroIds, skip, take }),
      contarFornecedores({ razaoSocial, nomeFantasia, cnpj, centroIds })
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    return NextResponse.json({ message: 'Erro ao listar fornecedores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'FORNECEDORES');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) {
      return NextResponse.json({ message: 'Sem permissão para criar fornecedor' }, { status: 403 });
    }

    const body = await request.json();
    const centros = parseCentrosSelecionados(body);
    const centrosAutorizados = await validarCentrosEscopo(request, centros);
    if (!centrosAutorizados) {
      return NextResponse.json({ message: 'Centros de custo selecionados não estão no seu escopo' }, { status: 403 });
    }

    const fornecedor = await criarFornecedor({
      razaoSocialFornecedor: typeof body.razaoSocialFornecedor === 'string' ? body.razaoSocialFornecedor : '',
      nomeFantasiaFornecedor: typeof body.nomeFantasiaFornecedor === 'string' ? body.nomeFantasiaFornecedor : null,
      cnpjFornecedor: typeof body.cnpjFornecedor === 'string' ? body.cnpjFornecedor : null,
      centros
    });

    return NextResponse.json(fornecedor, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    const message = error instanceof Error ? error.message : 'Erro ao criar fornecedor';
    return NextResponse.json({ message }, { status: 500 });
  }
}
