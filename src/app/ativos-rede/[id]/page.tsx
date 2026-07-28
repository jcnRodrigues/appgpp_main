import Header from '@/components/Header/Header';
import AtivoRedeForm from '@/features/ativos-rede/components/AtivoRedeForm/AtivoRedeForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarAtivoRedePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const { id } = await params;
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE') || !hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AtivoRedeForm ativoRedeId={id} />
        </>
    );
}

