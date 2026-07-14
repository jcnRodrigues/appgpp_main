import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import { Settings } from 'lucide-react';
import SystemConfigForm from '@/features/system-config/components/SystemConfigForm/SystemConfigForm';

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
          description="URL pública e parâmetros globais"
          backHref="/"
        />
        <SystemConfigForm />
      </div>
    </div>
  );
}
