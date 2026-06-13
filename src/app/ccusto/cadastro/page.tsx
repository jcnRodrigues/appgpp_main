import Header from '@/components/Header/Header';
import CentroCustoForm from '@/features/centro-custo/components/CentroCustoForm/CentroCustoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function NovoCC() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'CENTRO_CUSTO') || !hasModuleActionPermission(formularios, 'CENTRO_CUSTO', 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <CentroCustoForm />
        </>
    );
}
