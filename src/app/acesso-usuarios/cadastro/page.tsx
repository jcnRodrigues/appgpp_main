import Header from '@/components/Header/Header';
import AccessUserForm from '@/features/acesso-usuarios/components/AccessUserForm/AccessUserForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

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
    if (!hasModuleAccess(formularios, 'ACESSO_USUARIOS') || !hasModuleActionPermission(formularios, 'ACESSO_USUARIOS', acao)) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <AccessUserForm usuarioId={usuarioId} />
        </>
    );
}


