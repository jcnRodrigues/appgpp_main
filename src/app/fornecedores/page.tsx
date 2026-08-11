import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { Button } from '@/components/ui/button';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { Building2, Plus } from 'lucide-react';
import FornecedorTable from '@/features/fornecedor/components/FornecedorTable/FornecedorTable';

export default async function FornecedoresPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    redirect('/');
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'FORNECEDORES')) {
    redirect('/acesso-negado');
  }

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={Building2}
          title="Fornecedores"
          description="Cadastre fornecedores e vincule centros de custo."
          backHref="/"
          actions={
            <PermissionActionLink
              href="/fornecedores/cadastro"
              action="CREATE"
              module="FORNECEDORES"
              deniedMessage="Você não tem permissão para adicionar fornecedores."
            >
              <Button variant="ghost" className="flex gap-2 bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-5 w-5" />
                Novo Fornecedor
              </Button>
            </PermissionActionLink>
          }
        />

        <FornecedorTable />
      </div>
    </div>
  );
}
