import { use } from 'react';
import CadastroEditForm from '@/back-end/components/CadastroEditForm/CadastroEditForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/back-end/components/Header/Header';

export default async function EditarAlocacaoPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <CadastroEditForm cadastroId={id} />
        </>
    );
}
