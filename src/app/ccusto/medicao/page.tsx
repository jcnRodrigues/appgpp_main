import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleAccess } from '@/lib/permissions';
import { listarCentrosCusto } from '@/features/centro-custo/server/centrocusto.service';
import MedicaoCCustoForm from '@/features/centro-custo/components/MedicaoCCustoForm/MedicaoCCustoForm';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { ClipboardCheck } from 'lucide-react';

export default async function MedicaoCCustoPage({ searchParams }: { searchParams?: Promise<{ bmId?: string }> }) {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Medição por Centro de Custo</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar a medição</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
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
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={ClipboardCheck}
          title="Medição por Centro de Custo"
          description="Conferência de patrimônios via importação de Excel"
          backHref="/"
          actions={
            <Link href="/ccusto/medicao/processo">
              <Button variant="ghost" className="flex gap-2 bg-green-500 hover:bg-green-600">
                Medições em Processo
              </Button>
            </Link>
          }
        />

        <MedicaoCCustoForm centros={centros} bmIdInicial={bmIdInicial} />
      </div>
    </div>
  );
}

