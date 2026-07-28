import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from "@/lib/auth-options";
import InventarioPatrimonioForm from '@/features/inventario/components/InventarioPatrimonioForm/InventarioPatrimonioForm';
import { ClipboardList } from 'lucide-react';
import InventarioHeaderActions from '@/features/inventario/components/InventarioHeaderActions';

type InventarioPageProps = {
  searchParams?: Promise<{ codigo?: string | string[] }>;
};

export default async function InventarioPatrimoniosPage({ searchParams }: InventarioPageProps) {
  const session = await getServerSession(AuthOptions);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const codigoInicial = typeof resolvedSearchParams?.codigo === 'string'
    ? resolvedSearchParams.codigo
    : Array.isArray(resolvedSearchParams?.codigo)
      ? resolvedSearchParams.codigo[0]
      : undefined;

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Inventário de Patrimônios</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar o inventário.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'INVENTARIO')) redirect('/acesso-negado');

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={ClipboardList}
          title="Inventário de Patrimônios"
          description="Monte a conferência manual dos bens, salve o rascunho e exporte o resultado em JSON."
          backHref="/patrimoniolist"
          actions={<InventarioHeaderActions />}
          iconClassName="from-slate-950 via-slate-800 to-emerald-700"
        />

        <InventarioPatrimonioForm codigoInicial={codigoInicial} />
      </div>
    </div>
  );
}

