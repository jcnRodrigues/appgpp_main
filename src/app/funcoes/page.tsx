import FuncaoTable from '@/back-end/components/FuncaoTable/FuncaoTable';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/back-end/components/Header/Header';
import { Button } from '@/back-end/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Plus } from 'lucide-react';




export default async function FuncoesPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Funções</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para visualizar as Funções</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )  
    }


    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            
            <div className="max-w-6xl mx-auto px-4">
                {/* Header da Página */}
                <div className="form-title-sticky flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                        </Link>
                        <div>
                            <h1 className="text-h2 font-bold">Funções</h1>
                            <p className="text-gray-600 text-sm mt-1">Gerenciar funções da empresa</p>
                        </div>
                    </div>
                    <Link href="/funcao/cadastro">
                        <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-5 w-5" />
                            Nova Função
                        </Button>
                    </Link>
                </div>

                {/* Tabela */}
                <FuncaoTable />
            </div>
        </div>
    );
}
