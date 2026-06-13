import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import CadastroForm from '@/features/alocacoes/components/CadastroForm/CadastroForm';
import Header from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function NovaAlocacaoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ALOCACOES') || !hasModuleActionPermission(formularios, 'ALOCACOES', 'CREATE')) {
        redirect('/acesso-negado');
    }
    return (
        <>
        <Header />
        <CadastroForm />
        </>
        
    );
}
