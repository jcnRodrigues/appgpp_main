import Header from '@/back-end/components/Header/Header';
import CentroCustoForm from '@/back-end/components/CentroCustoForm/CentroCustoForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function NovoCC() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    return (
        <>
            <Header />
            <CentroCustoForm />
        </>
    );
}
