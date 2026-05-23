import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/back-end/components/Header/Header';
import LicencaForm from '@/back-end/components/LicencaForm/LicencaForm';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function CadastroLicencaPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'LICENCAS_SOFTWARE') || !hasActionPermission(formularios, 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <LicencaForm />
        </>
    );
}
