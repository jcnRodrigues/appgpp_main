import Header from '@/back-end/components/Header/Header';
import AccessUserTable from '@/back-end/components/AccessUserTable/AccessUserTable';
import { Button } from '@/back-end/components/ui/button';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AcessoUsuariosPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

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
                            <h1 className="text-h2 font-bold">Gestao de Acesso de Usuarios</h1>
                            <p className="text-gray-600 text-sm mt-1">Gerenciar usuarios locais e Google</p>
                        </div>
                    </div>
                    <Link href="/acesso-usuarios/cadastro">
                        <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-5 w-5" />
                            Novo Usuario
                        </Button>
                    </Link>
                </div>

                <AccessUserTable />
            </div>
        </div>
    );
}
