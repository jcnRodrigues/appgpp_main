import Header from '@/components/Header/Header';
import AtivoRedeForm from '@/features/ativos-rede/components/AtivoRedeForm/AtivoRedeForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function CadastroAtivoRede() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE') || !hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AtivoRedeForm />
        </>
    );
}
