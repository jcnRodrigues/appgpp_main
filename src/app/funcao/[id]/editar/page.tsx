import FuncaoForm from '@/features/funcao/components/FuncaoForm/FuncaoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import Header from '@/components/Header/Header';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarFuncaoPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCOES') || !hasModuleActionPermission(formularios, 'FUNCOES', 'UPDATE')) {
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



