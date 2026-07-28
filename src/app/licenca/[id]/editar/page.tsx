import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import Header from '@/components/Header/Header';
import LicencaForm from '@/features/licenca/components/LicencaForm/LicencaForm';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarLicencaPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'LICENCAS_SOFTWARE') || !hasModuleActionPermission(formularios, 'LICENCAS_SOFTWARE', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <LicencaForm licencaId={id} />
        </>
    );
}

