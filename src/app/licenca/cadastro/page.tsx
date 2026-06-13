import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/components/Header/Header';
import LicencaForm from '@/features/licenca/components/LicencaForm/LicencaForm';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function CadastroLicencaPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'LICENCAS_SOFTWARE') || !hasModuleActionPermission(formularios, 'LICENCAS_SOFTWARE', 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <LicencaForm />
        </>
    );
}
