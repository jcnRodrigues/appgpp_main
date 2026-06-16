import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import AccessUserTable from '@/features/acesso-usuarios/components/AccessUserTable/AccessUserTable';
import { Plus, UserCog } from 'lucide-react';

export default async function AcessoUsuariosPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];

    if (!hasModuleAccess(formularios, 'ACESSO_USUARIOS')) {
        redirect('/acesso-negado');
    }

    const canCreate = hasModuleActionPermission(formularios, 'ACESSO_USUARIOS', 'CREATE');

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />

            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={UserCog}
                    title="Gestão de Acesso de Usuários"
                    description="Gerenciar usuários locais e Google"
                    backHref="/"
                    actions={
                        canCreate ? (
                            <Link href="/acesso-usuarios/cadastro">
                                <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                                    <Plus className="h-5 w-5" />
                                    Novo Usuário
                                </Button>
                            </Link>
                        ) : null
                    }
                />
                <AccessUserTable />
            </div>
        </div>
    );
}
