import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/back-end/components/Header/Header';
import LicencaForm from '@/back-end/components/LicencaForm/LicencaForm';

export default async function CadastroLicencaPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    return (
        <>
            <Header />
            <LicencaForm />
        </>
    );
}
