import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { hasModuleAccess } from '@/lib/permissions';
import FuncaoTable from '@/features/funcao/components/FuncaoTable/FuncaoTable';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from "@/lib/auth-options";
import { Plus, UserSearch } from 'lucide-react';

export default async function FuncoesPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Funções</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar as funções</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCOES')) redirect('/acesso-negado');

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={UserSearch}
                    title="Funções"
                    description="Gerenciar funções da empresa"
                    backHref="/"
                    actions={
                        <PermissionActionLink
                            href="/funcao/cadastro"
                            action="CREATE"
                            module="FUNCOES"
                            deniedMessage="Você não tem permissão para adicionar registros."
                        >
                            <Button variant="ghost" className="flex gap-2 bg-green-600 hover:bg-green-100">
                                <Plus className="h-5 w-5" />
                                Nova Função
                            </Button>
                        </PermissionActionLink>
                    }
                />
                <FuncaoTable />
            </div>
        </div>
    );
}




