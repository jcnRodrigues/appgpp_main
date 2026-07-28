import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import SystemConfigForm from '@/features/system-config/components/SystemConfigForm/SystemConfigForm';
import { AuthOptions } from '@/lib/auth-options';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, ServerCog, Settings } from 'lucide-react';

export default async function SistemaPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Sistema</h1>
          <div className="rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
            <p className="mb-6 text-lg text-foreground">Faça login para visualizar esta página</p>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'SISTEMA')) redirect('/acesso-negado');

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={Settings}
          title="Sistema"
          description="URL publica e parametros globais"
          backHref="/"
          actions={(
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" className="border-border/70 bg-card">
                <Link href="/sistema/servico">
                  <ServerCog className="h-4 w-4" />
                  Servico Windows
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-border/70 bg-card">
                <Link href="/sistema/logs">
                  <FileText className="h-4 w-4" />
                  Logs do Sistema
                </Link>
              </Button>
            </div>
          )}
        />
        <SystemConfigForm />
      </div>
    </div>
  );
}
