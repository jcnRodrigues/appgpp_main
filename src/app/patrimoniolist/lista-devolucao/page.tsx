import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import ListaPatrimoniosPdfForm from '@/features/devolucao/components/ListaPatrimoniosPdfForm';
import ListaDevolucaoHeaderActions from '@/features/devolucao/components/ListaDevolucaoHeaderActions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { AuthOptions } from "@/lib/auth-options";
import { FileText } from 'lucide-react';

type ListaDevolucaoPageProps = {
  searchParams?: Promise<{ codigo?: string | string[] }>;
};

export default async function ListaPatrimoniosPdfPage({ searchParams }: ListaDevolucaoPageProps) {
  const session = await getServerSession(AuthOptions);
  const params = searchParams ? await searchParams : undefined;
  const codigoInicial = typeof params?.codigo === 'string'
    ? params.codigo
    : Array.isArray(params?.codigo)
      ? params.codigo[0]
      : undefined;
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
          description="Pesquisar patrimônios e montar a lista de devolução"
          backHref="/patrimoniolist"
          actions={<ListaDevolucaoHeaderActions />}
        />

        <ListaPatrimoniosPdfForm codigoInicial={codigoInicial} />
      </div>
    </div>
  );
}

