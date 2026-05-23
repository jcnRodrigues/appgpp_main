import Header from '@/back-end/components/Header/Header';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/back-end/components/ui/button';
import ListaPatrimoniosPdfForm from '@/back-end/components/PatrimonioTable/ListaPatrimoniosPdfForm';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function ListaPatrimoniosPdfPage() {
  const session = await getServerSession(AuthOptions);
  const formularios = ((session?.user as any)?.formularios || []) as string[];

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Lista de Patrimônios (PDF)</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg mb-6">Faça login para acessar</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canAccess = hasModuleAccess(formularios, 'PATRIMONIO');
  const canPrint = hasActionPermission(formularios, 'PRINT');
  if (!canAccess || !canPrint) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Lista de Patrimônios (PDF)</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg mb-6">Seu perfil não tem permissão para imprimir relatórios.</p>
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
      <div className="max-w-[86.4rem] mx-auto px-4">
        <div className="form-title-sticky flex items-center gap-4 mb-8 mt-4">
          <Link href="/patrimoniolist">
            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
          </Link>
          <div>
            <h1 className="text-h2 font-bold">Lista de Patrimônios (PDF)</h1>
            <p className="text-gray-600 text-sm mt-1">Pesquisar, adicionar em lista e gerar PDF</p>
          </div>
        </div>

        <ListaPatrimoniosPdfForm />
      </div>
    </div>
  );
}
