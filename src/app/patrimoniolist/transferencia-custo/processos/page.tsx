import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import TransferenciasEmProcessoTable from '@/features/transferencia/components/TransferenciasEmProcessoTable';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { AuthOptions } from "@/lib/auth-options";
import { ArrowRightLeft, FileText } from 'lucide-react';

export default async function TransferenciasProcessosPage() {
  const session = await getServerSession(AuthOptions);
  const formularios = ((session?.user as any)?.formularios || []) as string[];

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Processos de Transferência</h1>
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
          <h1 className="mb-4 text-2xl font-bold">Processos de Transferência</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Seu perfil não tem permissão para acessar processos.</p>
            <Button asChild>
              <Link href="/patrimoniolist/transferencia-custo">Voltar para transferência</Link>
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
          icon={ArrowRightLeft}
          title="Processos de Transferência"
          description="Selecione um processo aberto ou fechado para carregar a lista principal"
          backHref="/patrimoniolist/transferencia-custo"
          actions={
            <Link href="/patrimoniolist/transferencia-custo">
              <Button variant="ghost" className="flex gap-2 bg-slate-700 text-white hover:bg-slate-600">
                <FileText className="h-5 w-5" />
                Transferência
              </Button>
            </Link>
          }
        />

        <TransferenciasEmProcessoTable />
      </div>
    </div>
  );
}

