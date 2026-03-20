import Header from '@/back-end/components/Header/Header';
import AccessUserForm from '@/back-end/components/AccessUserForm/AccessUserForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

interface CadastroAcessoPageProps {
    searchParams?: { id?: string } | Promise<{ id?: string }>;
}

export default async function CadastroAcessoPage({ searchParams }: CadastroAcessoPageProps) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const params = searchParams ? await Promise.resolve(searchParams) : undefined;
    const usuarioId = params?.id;

    return (
        <>
            <Header />
            <AccessUserForm usuarioId={usuarioId} />
        </>
    );
}
