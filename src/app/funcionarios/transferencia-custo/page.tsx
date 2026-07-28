import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import TransferenciaCustoFuncionariosTable from '@/features/funcionarios/components/FuncionariosTable/TransferenciaCustoFuncionariosTable';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import { ArrowRightLeft } from 'lucide-react';

export default async function TransferenciaCustoPage() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) redirect('/');

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'FUNCIONARIOS')) {
    redirect('/acesso-negado');
  }

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-2">
        <PageHeader
          icon={ArrowRightLeft}
          title="Transferência de Custo"
          description="Lista de funcionários transferidos com custo anterior e atual"
          backHref="/funcionarios"
        />

        <TransferenciaCustoFuncionariosTable />
      </div>
    </div>
  );
}

