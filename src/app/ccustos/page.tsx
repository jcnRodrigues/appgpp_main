import Header from '@/back-end/components/Header/Header';
import CCustoTable from '@/back-end/components/CCustoTable/CCustoTable';
import { listarCentrosCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';
import { Plus, ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';

export default async function CCustosPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Centros de Custo</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para visualizar os centros de custo</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const centrosPerfil = Array.isArray((session.user as any).centros) ? ((session.user as any).centros as string[]) : [];
    const allowAll = centrosPerfil.includes('*');
    const idsFiltro = allowAll ? undefined : centrosPerfil;

    const centros = !allowAll && centrosPerfil.length === 0
        ? []
        : await listarCentrosCusto({ take: 10, skip: 0, ids: idsFiltro });

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
                            <Button variant="outline">Medição</Button>
                        </Link>
                        <Link href="/ccusto/cadastro">
                            <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                                <Plus className="h-5 w-5" />
                                Novo Centro
                            </Button>
                        </Link>
                    </div>
                </div>

                <CCustoTable centros={centros} />
            </div>
        </div>
    );
}
