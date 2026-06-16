import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import LicencaTable from '@/features/licenca/components/LicencaTable/LicencaTable';
import { KeyRound, Plus } from 'lucide-react';

export default async function LicencasPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
        <div className="bg-background min-h-screen py-4">
            <Header />
            <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Licenças de Software</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar as licenças</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'LICENCAS_SOFTWARE')) redirect('/acesso-negado');

    return (
        <div className="bg-background min-h-screen py-4">
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={KeyRound}
                    title="Licenças de Software"
                    description="Lista de licenças vinculadas aos funcionários"
                    backHref="/"
                    className="mt-0 mb-3"
                    actions={
                        <PermissionActionLink
                            href="/licenca/cadastro"
                            action="CREATE"
                            module="LICENCAS_SOFTWARE"
                            deniedMessage="Você não tem permissão para adicionar registros."
                        >
                            <Button variant="ghost" className="flex gap-2 bg-green-500 hover:bg-green-600">
                                <Plus className="h-5 w-5" />
                                Nova Licença
                            </Button>
                        </PermissionActionLink>
                    }
                />
                <LicencaTable />
            </div>
        </div>
    );
}
