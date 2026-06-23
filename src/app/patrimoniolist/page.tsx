import { listarPatrimonios } from '@/features/patrimonio/server/patrimonio.service';
import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import PatrimonioTable from '@/features/patrimonio/components/PatrimonioTable/PatrimonioTable';
import { ArrowRightLeft, Boxes, Plus, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function PatrimonioList() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Patrimônios</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para visualizar os patrimônios.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'PATRIMONIO')) redirect('/acesso-negado');
  const canCreate = hasModuleActionPermission(formularios, 'PATRIMONIO', 'CREATE');
  const canPrint = hasModuleActionPermission(formularios, 'PATRIMONIO', 'PRINT');
  const canTransfer = hasModuleActionPermission(formularios, 'PATRIMONIO', 'TRANSFER');

  const patrimonios = await listarPatrimonios({ take: 10, skip: 0 });

  const patrimoniosFormatted = patrimonios.map((p: any) => ({
    ...p,
    dataEntPat: p.dataEntPat instanceof Date ? p.dataEntPat.toISOString().split('T')[0] : p.dataEntPat,
    tbTipoPat: p.tbTipoPat ? { descricaoTipPat: p.tbTipoPat.descricaoTipPat ?? undefined } : undefined,
    tbStatusPat: p.tbStatusPat ? { descricaoStatPat: p.tbStatusPat.descricaoStatPat } : undefined
  }));

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />

      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={Boxes}
          title="Patrimônios"
          description="Gerenciar patrimônios da empresa"
          backHref="/"
          actions={
            <>
              {canPrint ? (
                <Link href="/patrimoniolist/lista-devolucao">
                  <Button variant="ghost" className="flex gap-2 bg-red-500 text-white hover:bg-red-600">
                    <FileText className="h-5 w-5" />
                    Devolução Patrimônio
                  </Button>
                </Link>
              ) : null}
              {canTransfer ? (
                <Link href="/patrimoniolist/transferencia-custo">
                  <Button variant="ghost" className="flex gap-2 bg-blue-500 hover:bg-blue-600">
                    <ArrowRightLeft className="h-5 w-5" />
                    Transferir Custo
                  </Button>
                </Link>
              ) : null}
              <Link href="/patrimoniolist/inventario">
                <Button variant="ghost" className="flex gap-2 bg-slate-900 hover:bg-slate-800">
                  <ClipboardList className="h-5 w-5" />
                  Inventário
                </Button>
              </Link>
              {canCreate ? (
                <Link href="/patrimonio/cadastro">
                  <Button variant="ghost" className="flex gap-2 bg-green-500 hover:bg-green-600">
                    <Plus className="h-5 w-5" />
                    Novo Patrimônio
                  </Button>
                </Link>
              ) : null}
            </>
          }
        />

        <PatrimonioTable patrimonios={patrimoniosFormatted} />
      </div>
    </div>
  );
}
