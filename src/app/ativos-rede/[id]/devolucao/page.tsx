import Header from '@/components/Header/Header';
import AtivoRedeDevolucaoForm from '@/features/ativos-rede/components/AtivoRedeDevolucaoForm/AtivoRedeDevolucaoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function DevolucaoAtivoRedePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const { id } = await params;
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE') || !hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'RETURN')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AtivoRedeDevolucaoForm ativoRedeId={id} />
        </>
    );
}

