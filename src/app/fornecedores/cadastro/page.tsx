import Header from '@/components/Header/Header';
import FornecedorForm from '@/features/fornecedor/components/FornecedorForm/FornecedorForm';
import { AuthOptions } from '@/lib/auth-options';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function NovoFornecedorPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    redirect('/');
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'FORNECEDORES') || !hasModuleActionPermission(formularios, 'FORNECEDORES', 'CREATE')) {
    redirect('/acesso-negado');
  }

  return (
    <>
      <Header />
      <FornecedorForm />
    </>
  );
}
