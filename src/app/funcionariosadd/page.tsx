import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import PermissionActionLink from '@/components/PermissionActionLink/PermissionActionLink';
import { hasModuleAccess, hasModuleActionPermission } from '@/lib/permissions';
import { listarFuncionarios } from '@/features/funcionario/server/funcionario.service';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import FuncionarioTable from '@/features/funcionario/components/FuncionarioTable/FuncionarioTable';
import { ArrowRightLeft, Plus, User } from 'lucide-react';

export default async function FuncionariosAdd() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Funcionários</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar os funcionários</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCIONARIOS')) {
        redirect('/acesso-negado');
    }
    const canTransfer = hasModuleActionPermission(formularios, 'FUNCIONARIOS', 'UPDATE');

    const funcionarios = await listarFuncionarios({ take: 10, skip: 0 });

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />

            <div className="mx-auto max-w-[86.4rem] px-2">
                <PageHeader
                    icon={User}
                    title="Funcionários"
                    description="Gerenciar funcionários da empresa"
                    backHref="/"
                    actions={
                        <>
                            {canTransfer ? (
                                <Button asChild variant="ghost" className="flex gap-2 bg-blue-500 hover:bg-blue-600">
                                    <Link href="/funcionariosadd/transferencia-custo">
                                        <ArrowRightLeft className="h-4 w-4" />
                                        Transferência de Custo
                                    </Link>
                                </Button>
                            ) : null}
                            <PermissionActionLink
                                href="/funcionario/cadastro"
                                action="CREATE"
                                module="FUNCIONARIOS"
                                deniedMessage="Você não tem permissão para adicionar registros."
                            >
                                <Button variant="ghost" className="flex gap-2 bg-green-500 hover:bg-green-600">
                                    <Plus className="h-5 w-5" />
                                    Novo Funcionário
                                </Button>
                            </PermissionActionLink>
                        </>
                    }
                />

                <FuncionarioTable funcionarios={funcionarios} />
            </div>
        </div>
    );
}
