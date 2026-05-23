import FuncaoForm from '@/back-end/components/FuncaoForm/FuncaoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/back-end/components/Header/Header';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarFuncaoPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCOES') || !hasActionPermission(formularios, 'UPDATE')) {
        redirect('/acesso-negado');
    }


    const { id } = await params;


    return (
        <>
            <Header />
            <FuncaoForm funcaoId={id} />
        </>
    );
}
