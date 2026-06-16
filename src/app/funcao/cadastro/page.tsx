import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import FuncaoForm from '@/features/funcao/components/FuncaoForm/FuncaoForm';
import Header from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function CadastroFuncaoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCOES') || !hasModuleActionPermission(formularios, 'FUNCOES', 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <FuncaoForm />
        </>
    );
}


