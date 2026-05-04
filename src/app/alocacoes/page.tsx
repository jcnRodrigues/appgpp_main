import CadastroTable from '@/back-end/components/CadastroTable/CadastroTable';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/back-end/components/Header/Header';
import { Button } from '@/back-end/components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AlocacoesPage() {
const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Alocação de Patrimonio</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para visualizar as alocações de patrimônio</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="max-w-[120rem] mx-auto px-2">
                <div className="form-title-sticky flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                        </Link>
                        <div>
                            <h1 className="text-h2 font-bold">Alocação de Patrimonio</h1>
                            <p className="text-gray-600 text-sm mt-1">Gerencie a alocação de patrimônio nos centros de custo da empresa</p>
                        </div>
                    </div>
                    <Link href="/alocacoes/nova">
                        <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-5 w-5" />
                            Nova Alocação
                        </Button>
                    </Link>
                </div>
                <CadastroTable />
            </div>
        </div>
    );
}
