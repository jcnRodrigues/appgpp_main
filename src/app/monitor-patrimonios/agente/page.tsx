import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { SearchCheck } from 'lucide-react';
import AgenteInventarioForm from '@/features/monitor-patrimonios/components/AgenteInventarioForm/AgenteInventarioForm';

export default async function AgenteInventarioPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Agente de Inventário</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar o agente.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'UNIFI_CONFIG')) redirect('/acesso-negado');

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={SearchCheck}
          title="Agente de Inventário"
          description="Consulta hostname, confirma conectividade, identifica 802.1x e cruza periféricos com a base de ativos."
          backHref="/"
        />
        <AgenteInventarioForm />
      </div>
    </div>
  );
}
