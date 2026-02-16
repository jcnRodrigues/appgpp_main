import FuncaoForm from '@/back-end/components/FuncaoForm/FuncaoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/back-end/components/Header/Header';

export default async function EditarFuncaoPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }


    const { id } = await params;


    return (
        <>
            <Header />
            <FuncaoForm funcaoId={id} />
        </>
    );
}
