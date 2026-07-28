import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { AuthOptions } from '@/lib/auth-options';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ServerCog, History } from 'lucide-react';
import ServiceControlPanel from './ServiceControlPanel';

export default async function ServicoWindowsPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Servico do AppGPP</h1>
          <div className="rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
            <p className="mb-6 text-lg">Faca login para acessar o painel do servico.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'SISTEMA')) redirect('/acesso-negado');

  const canUpdate = hasModuleAccess(formularios, 'SISTEMA') && hasActionPermission(formularios, 'UPDATE');

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={ServerCog}
          title="Servico Windows"
          description="Verifique o status do AppGPP-Service e execute iniciar ou parar quando necessario."
          backHref="/sistema"
          actions={(
            <Button asChild variant="outline" className="border-border/70 bg-card">
              <Link href="/sistema">
                <History className="h-4 w-4" />
                Voltar ao Sistema
              </Link>
            </Button>
          )}
        />

        <ServiceControlPanel serviceName="AppGPP-Service" canUpdate={canUpdate} />
      </div>
    </div>
  );
}
