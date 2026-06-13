import CadastroEditForm from '@/features/alocacoes/components/CadastroEditForm/CadastroEditForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/components/Header/Header';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function EditarAlocacaoPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ALOCACOES') || !hasModuleActionPermission(formularios, 'ALOCACOES', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <CadastroEditForm cadastroId={id} />
        </>
    );
}
