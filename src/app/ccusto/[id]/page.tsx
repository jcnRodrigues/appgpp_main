import Header from '@/components/Header/Header';
import CentroCustoForm from '@/features/centro-custo/components/CentroCustoForm/CentroCustoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarCC({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'CENTRO_CUSTO') || !hasModuleActionPermission(formularios, 'CENTRO_CUSTO', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <CentroCustoForm centroId={id} />
        </>
    );
}

