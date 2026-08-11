import { NextRequest, NextResponse } from 'next/server';
import { atualizarFornecedor, deletarFornecedor, getFornecedorById } from '@/features/fornecedor/server/fornecedor.service';
import { getAccessContext, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';

function parseCentrosSelecionados(body: any) {
  if (!Object.prototype.hasOwnProperty.call(body, 'centros')) {
    return undefined;
  }

  const centros = Array.isArray(body?.centros) ? body.centros : [];
  return centros
    .map((item: any) => ({
      idCCusto: typeof item?.idCCusto === 'string' ? item.idCCusto.trim() : '',
      ehPrincipal: Boolean(item?.ehPrincipal)
    }))
    .filter((item: any) => Boolean(item.idCCusto));
}

async function fornecedorEstaNoEscopo(request: NextRequest, fornecedorId: string) {
  const { centros, allowAll } = await getAccessContext(request);
  if (allowAll) return true;
  if (centros.length === 0) return false;

  const fornecedor = await getFornecedorById(fornecedorId);
  return Boolean(
    fornecedor?.tbFornecedorCCusto?.some((link) => centros.includes(link.idCCusto))
  );
}

async function validarCentrosEscopo(request: NextRequest, centrosSelecionados?: Array<{ idCCusto: string }>) {
  if (!centrosSelecionados) return true;
  const { centros, allowAll } = await getAccessContext(request);
  if (allowAll) return true;
  return centrosSelecionados.every((item) => centros.includes(item.idCCusto));
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'FORNECEDORES');
    if (!canAccess) {
      return NextResponse.json({ message: 'Sem permissão para acessar fornecedores' }, { status: 403 });
    }

    const { id } = await params;
    const visible = await fornecedorEstaNoEscopo(request, id);
    if (!visible) {
      return NextResponse.json({ message: 'Fornecedor não encontrado' }, { status: 404 });
    }

    const fornecedor = await getFornecedorById(id);
    if (!fornecedor) {
      return NextResponse.json({ message: 'Fornecedor não encontrado' }, { status: 404 });
    }

    return NextResponse.json(fornecedor);
  } catch (error) {
    console.error('Erro ao obter fornecedor:', error);
    return NextResponse.json({ message: 'Erro ao obter fornecedor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'FORNECEDORES');
    const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
    if (!canAccess || !canUpdate) {
      return NextResponse.json({ message: 'Sem permissão para alterar fornecedor' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const centros = parseCentrosSelecionados(body);
    const centrosAutorizados = await validarCentrosEscopo(request, centros);
    if (!centrosAutorizados) {
      return NextResponse.json({ message: 'Centros de custo selecionados não estão no seu escopo' }, { status: 403 });
    }

    const fornecedor = await atualizarFornecedor(id, {
      razaoSocialFornecedor: typeof body.razaoSocialFornecedor === 'string' ? body.razaoSocialFornecedor : undefined,
      nomeFantasiaFornecedor: Object.prototype.hasOwnProperty.call(body, 'nomeFantasiaFornecedor')
        ? (typeof body.nomeFantasiaFornecedor === 'string' ? body.nomeFantasiaFornecedor : null)
        : undefined,
      cnpjFornecedor: Object.prototype.hasOwnProperty.call(body, 'cnpjFornecedor')
        ? (typeof body.cnpjFornecedor === 'string' ? body.cnpjFornecedor : null)
        : undefined,
      centros
    });

    return NextResponse.json(fornecedor);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    const message = error instanceof Error ? error.message : 'Erro ao atualizar fornecedor';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const canAccess = await hasModuleAccessForRequest(request, 'FORNECEDORES');
    const canDelete = await hasActionPermissionForRequest(request, 'DELETE');
    if (!canAccess || !canDelete) {
      return NextResponse.json({ message: 'Sem permissão para deletar fornecedor' }, { status: 403 });
    }

    const { id } = await params;
    const visible = await fornecedorEstaNoEscopo(request, id);
    if (!visible) {
      return NextResponse.json({ message: 'Fornecedor não encontrado' }, { status: 404 });
    }

    await deletarFornecedor(id);
    return NextResponse.json({ message: 'Fornecedor deletado' });
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    return NextResponse.json({ message: 'Erro ao deletar fornecedor' }, { status: 500 });
  }
}
