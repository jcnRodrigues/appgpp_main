import { listarPatrimonios } from '@/features/patrimonio/server/patrimonio.service';
import Header from '@/components/Header/Header';
import PatrimonioTable from '@/features/patrimonio/components/PatrimonioTable/PatrimonioTable';
import { ArrowRightLeft, ChevronLeft, Plus, FileText } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Patrimonios</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg mb-6">Faca login para visualizar os patrimonios</p>
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
  const canUpdate = hasModuleActionPermission(formularios, 'PATRIMONIO', 'UPDATE');

  const patrimonios = await listarPatrimonios({ take: 10, skip: 0 });

  const patrimoniosFormatted = patrimonios.map((p) => ({
    ...p,
    dataEntPat: p.dataEntPat instanceof Date ? p.dataEntPat.toISOString().split('T')[0] : p.dataEntPat,
    tbTipoPat: p.tbTipoPat ? { descricaoTipPat: p.tbTipoPat.descricaoTipPat ?? undefined } : undefined,
    tbStatusPat: p.tbStatusPat ? { descricaoStatPat: p.tbStatusPat.descricaoStatPat } : undefined
  }));

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />

      <div className="max-w-[86.4rem] mx-auto px-4">
        <div className="form-title-sticky flex items-center justify-between mb-8 mt-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
            </Link>
            <div>
              <h1 className="text-h2 font-bold">Patrimonios</h1>
              <p className="text-gray-600 text-sm mt-1">Gerenciar patrimonios da empresa</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canPrint && (
              <Link href="/patrimoniolist/lista-devolucao">
                <Button
                  variant="ghost"
                  className="flex gap-2 bg-red-500 hover:bg-red-600 text-white">
                  <FileText className="h-5 w-5" />
                  Devolucao Patrimonio
                </Button>
              </Link>
            )}
            {canUpdate && (
              <Link href="/patrimoniolist/transferencia-custo">
                <Button
                  variant="ghost"
                  className="flex gap-2 bg-blue-500 hover:bg-blue-600">
                  <ArrowRightLeft className="h-5 w-5" />
                  Transferir Custo
                </Button>
              </Link>
            )}
            {canCreate && (
              <Link href="/patrimonio/cadastro">
                <Button
                  variant="ghost"
                  className="flex gap-2 bg-green-500 hover:bg-green-600">
                  <Plus className="h-5 w-5" />
                  Novo Patrimonio
                </Button>
              </Link>
            )}
          </div>
        </div>

        <PatrimonioTable patrimonios={patrimoniosFormatted} />
      </div>
    </div>
  );
}
