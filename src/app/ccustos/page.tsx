import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { listarCentrosCusto, listarStatusCentroCusto } from '@/features/centro-custo/server/centrocusto.service';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import CCustoFilter from '@/features/centro-custo/components/CCustoFilter/CCustoFilter';
import CCustoTable from '@/features/centro-custo/components/CCustoTable/CCustoTable';
import { LandmarkIcon, Plus } from 'lucide-react';

type SearchParams = {
    statusId?: string;
};

export default async function CCustosPage({
    searchParams
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const session = await getServerSession(AuthOptions);
    const params = searchParams ? await searchParams : undefined;
    const statusId = params?.statusId?.trim() || '';

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Centros de Custo</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar os centros de custo.</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'CENTRO_CUSTO')) redirect('/acesso-negado');
    const centrosPerfil = Array.isArray((session.user as any).centros) ? ((session.user as any).centros as string[]) : [];
    const allowAll = centrosPerfil.includes('*');
    const idsFiltro = allowAll ? undefined : centrosPerfil;

    const statusOptions = await listarStatusCentroCusto();
    const centros = !allowAll && centrosPerfil.length === 0
        ? []
        : await listarCentrosCusto({ take: 10, skip: 0, ids: idsFiltro, statusId: statusId || undefined });

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={LandmarkIcon}
                    title="Centros de Custo"
                    description="Gerencie os centros de custo da empresa."
                    backHref="/"
                    actions={
                        <>
                            <PermissionActionLink
                                href="/ccusto/cadastro"
                                action="CREATE"
                                module="CENTRO_CUSTO"
                                deniedMessage="Você não tem permissão para adicionar registros."
                            >
                                <Button variant="ghost" className="flex gap-2 bg-green-500 hover:bg-green-600">
                                    <Plus className="h-5 w-5" />
                                    Novo Centro
                                </Button>
                            </PermissionActionLink>
                        </>
                    }
                />

                <CCustoFilter statusId={statusId} statusOptions={statusOptions} />
                <CCustoTable centros={centros} statusId={statusId} />
            </div>
        </div>
    );
}

