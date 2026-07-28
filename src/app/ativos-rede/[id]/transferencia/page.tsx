import Header from '@/components/Header/Header';
import AtivoRedeTransferenciaForm from '@/features/ativos-rede/components/AtivoRedeTransferenciaForm/AtivoRedeTransferenciaForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function TransferenciaAtivoRedePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const { id } = await params;
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE') || !hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'TRANSFER')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AtivoRedeTransferenciaForm ativoRedeId={id} />
        </>
    );
}

