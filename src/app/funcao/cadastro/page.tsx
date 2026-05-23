import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import FuncaoForm from '@/back-end/components/FuncaoForm/FuncaoForm';
import Header from '@/back-end/components/Header/Header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function CadastroFuncaoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCOES') || !hasActionPermission(formularios, 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <FuncaoForm />
        </>
    );
}
