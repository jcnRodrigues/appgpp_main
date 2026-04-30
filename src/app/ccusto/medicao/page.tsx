import Header from '@/back-end/components/Header/Header';
import MedicaoCCustoForm from '@/back-end/components/MedicaoCCustoForm/MedicaoCCustoForm';
import { listarCentrosCusto } from '@/back-end/service/CentroCusto.service/centrocusto.service';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function MedicaoCCustoPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Medição por Centro de Custo</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para acessar a medição</p>
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
        : await listarCentrosCusto({ take: 1000, skip: 0, ids: idsFiltro });

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="max-w-[86.4rem] mx-auto px-4">
                <div className="form-title-sticky flex items-center gap-4 mb-8 mt-4">
                    <Link href="/ccustos">
                        <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                    </Link>
                    <div>
                        <h1 className="text-h2 font-bold">Medição por Centro de Custo</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Conferência de patrimônios via importação de Excel
                        </p>
                    </div>
                </div>

                <MedicaoCCustoForm centros={centros} />
            </div>
        </div>
    );
}
