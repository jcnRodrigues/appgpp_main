import MonitorPatrimoniosForm from '@/back-end/components/MonitorPatrimoniosForm/MonitorPatrimoniosForm';
import Header from '@/back-end/components/Header/Header';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';


export default async function Page() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Monitor de Rede Ubiquiti</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg mb-6">Faça login para visualizar esta página</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'UNIFI_CONFIG')) redirect('/acesso-negado');

  return <MonitorPatrimoniosForm />;
}
