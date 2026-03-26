import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/back-end/components/Header/Header';
import LicencaForm from '@/back-end/components/LicencaForm/LicencaForm';

export default async function EditarLicencaPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <LicencaForm licencaId={id} />
        </>
    );
}
