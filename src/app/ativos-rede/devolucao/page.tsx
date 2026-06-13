import Header from '@/components/Header/Header';
import AtivoRedeAtalhoForm from '@/features/ativos-rede/components/AtivoRedeAtalhoForm/AtivoRedeAtalhoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function DevolucaoAtivoRedeAtalhoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE') || !hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AtivoRedeAtalhoForm modo="devolucao" />
        </>
    );
}
