import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import ListaPatrimoniosPdfForm from '@/features/patrimonio/components/PatrimonioTable/ListaPatrimoniosPdfForm';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { FileText } from 'lucide-react';

export default async function ListaPatrimoniosPdfPage() {
  const session = await getServerSession(AuthOptions);
  const formularios = ((session?.user as any)?.formularios || []) as string[];

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Lista de Patrimônios - Devolução</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canAccess = hasModuleAccess(formularios, 'PATRIMONIO');
  const canPrint = hasModuleActionPermission(formularios, 'PATRIMONIO', 'PRINT');
  if (!canAccess || !canPrint) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Lista de Patrimônios - Devolução</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Seu perfil não tem permissão para imprimir relatórios.</p>
            <Button asChild>
              <Link href="/patrimoniolist">Voltar para Patrimônios</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={FileText}
          title="Lista de Patrimônios - Devolução"
          description="Pesquisar, adicionar em lista e gerar PDF"
          backHref="/patrimoniolist"
        />

        <ListaPatrimoniosPdfForm />
      </div>
    </div>
  );
}
