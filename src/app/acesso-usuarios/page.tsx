import Header from '@/back-end/components/Header/Header';
import AccessUserForm from '@/back-end/components/AccessUserForm/AccessUserForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AcessoUsuariosPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    return (
        <>
            <Header />
            <AccessUserForm />
        </>
    );
}
