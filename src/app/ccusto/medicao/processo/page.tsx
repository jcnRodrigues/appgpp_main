import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import MedicoesEmProcessoTable from '@/features/centro-custo/components/MedicaoCCustoForm/MedicoesEmProcessoTable';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from "@/lib/auth-options";
import { ClipboardCheck } from 'lucide-react';

export default async function MedicaoProcessoPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Medições em Processo</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar as medições em processo</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'MEDICAO_CCUSTO')) {
    redirect('/acesso-negado');
  }

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={ClipboardCheck}
          title="Medições em Processo"
          description="Consulta e gestão de BMs abertos e fechados"
          backHref="/ccusto/medicao"
        />

        <MedicoesEmProcessoTable />
      </div>
    </div>
  );
}


