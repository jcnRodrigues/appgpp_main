import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import FuncaoForm from '@/back-end/components/FuncaoForm/FuncaoForm';
import Header from '@/back-end/components/Header/Header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function CadastroFuncaoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }

    return (
        <>
            <Header />
            <FuncaoForm />
        </>
    );
}
