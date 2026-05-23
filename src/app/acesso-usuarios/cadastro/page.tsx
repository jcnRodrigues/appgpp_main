import Header from '@/back-end/components/Header/Header';
import AccessUserForm from '@/back-end/components/AccessUserForm/AccessUserForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasActionPermission, hasModuleAccess } from '@/lib/permissions';

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
    const formularios = ((session.user as any)?.formularios || []) as string[];
    const acao = usuarioId ? 'UPDATE' : 'CREATE';
    if (!hasModuleAccess(formularios, 'ACESSO_USUARIOS') || !hasActionPermission(formularios, acao)) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AccessUserForm usuarioId={usuarioId} />
        </>
    );
}
