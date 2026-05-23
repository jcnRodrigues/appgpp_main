import Header from '@/back-end/components/Header/Header';
import CentroCustoForm from '@/back-end/components/CentroCustoForm/CentroCustoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarCC({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'CENTRO_CUSTO') || !hasActionPermission(formularios, 'UPDATE')) {
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
