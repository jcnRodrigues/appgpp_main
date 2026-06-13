import CadastroTable from '@/features/alocacoes/components/CadastroTable/CadastroTable';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { hasModuleAccess } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function AlocacoesPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6"><Header /><div className="max-w-4xl mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold mb-4">Alocacao de Patrimonio</h1><div className="bg-white p-8 rounded-lg shadow-sm"><p className="text-lg mb-6">Faca login para visualizar as alocacoes de patrimonio</p><Button asChild><Link href="/">Ir para Login</Link></Button></div></div></div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ALOCACOES')) redirect('/acesso-negado');
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
                            <h1 className="text-h2 font-bold">Alocacao de Patrimonio</h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Gerencie a alocacao de patrimonio nos centros de custo da empresa
                            </p>
                        </div>
                    </div>
                    <PermissionActionLink
                        href="/alocacoes/nova"
                        action="CREATE"
                        module="ALOCACOES"
                        deniedMessage="VocÃª nÃ£o tem permissÃ£o para adicionar registros."
                    >
                        <Button variant="ghost" 
                        className="flex gap-2 bg-green-600 hover:bg-green-100">
                            <Plus className="h-5 w-5" />
                            Nova Alocacao
                        </Button>
                    </PermissionActionLink>
                </div>
                <CadastroTable />
            </div>
        </div>
    );
}
