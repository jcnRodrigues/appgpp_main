import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { AuthOptions } from "@/lib/auth-options";
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Radar } from 'lucide-react';
import VarreduraPatrimoniosForm from '@/features/monitor-patrimonios/components/VarreduraPatrimoniosForm/VarreduraPatrimoniosForm';

export default async function VarreduraPatrimoniosPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Varredura de Patrimônios</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para acessar a varredura.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'VARREDURA_PATRIMONIOS')) redirect('/acesso-negado');

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto max-w-[86.4rem] px-4">
        <PageHeader
          icon={Radar}
          title="Varredura de Patrimônios"
          description="Consulta toda a rede e retorna apenas os patrimônios localizados, com ação para abrir a busca específica de cada item."
          backHref="/monitor-patrimonios/agente"
        />
        <VarreduraPatrimoniosForm />
      </div>
    </div>
  );
}

