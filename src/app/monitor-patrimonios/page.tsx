import MonitorPatrimoniosForm from '@/features/monitor-patrimonios/components/MonitorPatrimoniosForm/MonitorPatrimoniosForm';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Monitor de Rede Ubiquiti</h1>
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg">Faça login para visualizar esta página.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'MONITOR_PATRIMONIOS')) redirect('/acesso-negado');

  return <MonitorPatrimoniosForm />;
}

