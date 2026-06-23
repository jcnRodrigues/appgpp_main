import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import TransferenciaCustoPatrimonioTable from '@/features/patrimonio/components/PatrimonioTable/TransferenciaCustoPatrimonioTable';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { ArrowRightLeft } from 'lucide-react';

export default async function TransferenciaCustoPatrimonioPage() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) redirect('/');

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'PATRIMONIO')) {
    redirect('/acesso-negado');
  }
  if (!hasModuleActionPermission(formularios, 'PATRIMONIO', 'TRANSFER')) {
    redirect('/acesso-negado');
  }

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-2">
        <PageHeader
          icon={ArrowRightLeft}
          title="Transferência de Patrimônio"
          description="Transferir patrimônio entre centros de custo"
          backHref="/patrimoniolist"
        />

        <TransferenciaCustoPatrimonioTable />
      </div>
    </div>
  );
}

