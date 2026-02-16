import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import CadastroForm from '@/back-end/components/CadastroForm/CadastroForm';
import Header from '@/back-end/components/Header/Header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function NovaAlocacaoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    return (
        <>
        <Header />
        <CadastroForm />
        </>
        
    );
}
