import Header from '@/components/Header/Header';
import CCustoFilter from '@/features/centro-custo/components/CCustoFilter/CCustoFilter';
import CCustoTable from '@/features/centro-custo/components/CCustoTable/CCustoTable';
import { listarCentrosCusto, listarStatusCentroCusto } from '@/features/centro-custo/server/centrocusto.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { Plus, ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import { hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';

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
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Centros de Custo</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faca login para visualizar os centros de custo</p>
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
            <div className="max-w-[86.4rem] mx-auto px-4">
                <div className="form-title-sticky flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                        </Link>
                        <div>
                            <h1 className="text-h2 font-bold">Centros de Custo</h1>
                            <p className="text-gray-600 text-sm mt-1">Gerencie os centros de custo da empresa</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/ccusto/medicao">
                            <Button variant="ghost" className="flex gap-2 bg-green-500 hover:bg-green-600">
                                Medição
                            </Button>
                        </Link>
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
                    </div>
                </div>

                <CCustoFilter statusId={statusId} statusOptions={statusOptions} />
                <CCustoTable centros={centros} statusId={statusId} />
            </div>
        </div>
    );
}
