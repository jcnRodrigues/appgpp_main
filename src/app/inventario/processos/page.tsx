import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleAccess, hasModuleActionPermission } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { ClipboardList } from 'lucide-react';
import InventariosEmProcessoTable from '@/features/inventario/components/InventariosEmProcessoTable';

export default async function InventariosEmProcessoPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Inventários em Processo</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar a lista de inventários.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'INVENTARIO') || !hasModuleActionPermission(formularios, 'INVENTARIO', 'PRINT')) redirect('/acesso-negado');

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={ClipboardList}
          title="Inventários em Processo"
          description="Acompanhe inventários abertos e fechados e reabra a lista principal quando precisar"
          backHref="/inventario"
          actions={
            <Link href="/inventario">
              <Button variant="ghost" className="flex gap-2 border bg-slate-700 hover:bg-slate-600">
                Inventário
              </Button>
            </Link>
          }
        />

        <InventariosEmProcessoTable />
      </div>
    </div>
  );
}
