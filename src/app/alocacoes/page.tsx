import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { hasModuleAccess } from '@/lib/permissions';
import CadastroTable from '@/features/alocacoes/components/CadastroTable/CadastroTable';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from "@/lib/auth-options";
import { Plus, PackagePlus } from 'lucide-react';

export default async function AlocacoesPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Alocação de Patrimônio</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar as alocações de patrimônio.</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ALOCACOES')) redirect('/acesso-negado');

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="mx-auto max-w-[120rem] px-2">
                <PageHeader
                    icon={PackagePlus}
                    title="Alocação de Patrimônio"
                    description="Gerencie a alocação de patrimônio nos centros de custo da empresa."
                    backHref="/"
                    actions={
                        <PermissionActionLink
                            href="/alocacoes/nova"
                            action="CREATE"
                            module="ALOCACOES"
                            deniedMessage="Você não tem permissão para adicionar registros."
                        >
                            <Button variant="ghost" className="flex gap-2 bg-green-600 hover:bg-green-100">
                                <Plus className="h-5 w-5" />
                                Nova Alocação
                            </Button>
                        </PermissionActionLink>
                    }
                />
                <CadastroTable />
            </div>
        </div>
    );
}

