import Header from '@/components/Header/Header';
import MedicaoCCustoForm from '@/features/centro-custo/components/MedicaoCCustoForm/MedicaoCCustoForm';
import { listarCentrosCusto } from '@/features/centro-custo/server/centrocusto.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function MedicaoCCustoPage({ searchParams }: { searchParams?: Promise<{ bmId?: string }> }) {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6"><Header /><div className="max-w-4xl mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold mb-4">Medicao por Centro de Custo</h1><div className="bg-white p-8 rounded-lg shadow-sm"><p className="text-lg mb-6">Faca login para acessar a medicao</p><Button asChild><Link href="/">Ir para Login</Link></Button></div></div></div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'MEDICAO_CCUSTO')) redirect('/acesso-negado');

  const centrosPerfil = Array.isArray((session.user as any).centros) ? ((session.user as any).centros as string[]) : [];
  const allowAll = centrosPerfil.includes('*');
  const idsFiltro = allowAll ? undefined : centrosPerfil;

  const centros = !allowAll && centrosPerfil.length === 0 ? [] : await listarCentrosCusto({ take: 1000, skip: 0, ids: idsFiltro });

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const bmIdInicial = typeof resolvedSearchParams?.bmId === 'string' ? resolvedSearchParams.bmId : null;

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="max-w-[86.4rem] mx-auto px-4">
        <div className="form-title-sticky flex items-center justify-between gap-4 mb-8 mt-4">
          <div className="flex items-center gap-4">
            <Link href="/ccustos">
              <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
            </Link>
            <div>
              <h1 className="text-h2 font-bold">
                Medicao por Centro de Custo
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Conferencia de patrimonios via importacao de Excel
              </p>
            </div>
          </div>
          <Link href="/ccusto/medicao/processo">
            <Button variant="ghost" 
            className="flex gap-2 bg-green-500 hover:bg-green-600">
              Medicoes em Processo
            </Button>
          </Link>
        </div>

        <MedicaoCCustoForm centros={centros} bmIdInicial={bmIdInicial} />
      </div>
    </div>
  );
}
