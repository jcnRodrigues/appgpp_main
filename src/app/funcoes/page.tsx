import FuncaoTable from '@/features/funcao/components/FuncaoTable/FuncaoTable';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import Link from 'next/link';
import { ChevronLeft, Plus } from 'lucide-react';
import { hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function FuncoesPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Fun��es</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faca login para visualizar as funcoes</p>
                        <Button asChild>
                            <Link href="/">
                                Ir para Login
                            </Link>
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
            <div className="max-w-[86.4rem] mx-auto px-4">
                <div className="form-title-sticky flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                        </Link>
                        <div>
                            <h1 className="text-h2 font-bold">
                                Funcoes
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Gerenciar funcoes da empresa
                            </p>
                        </div>
                    </div>
                    <PermissionActionLink
                        href="/funcao/cadastro"
                        action="CREATE"
                        module="FUNCOES"
                        deniedMessage="Voc� n�o tem permiss�o para adicionar registros."
                    >
                        <Button
                            variant="ghost"
                            className="flex gap-2 bg-green-600 hover:bg-green-100">
                            <Plus className="h-5 w-5" />
                            Nova Funcao
                        </Button>
                    </PermissionActionLink>
                </div>
                <FuncaoTable />
            </div>
        </div>
    );
}
