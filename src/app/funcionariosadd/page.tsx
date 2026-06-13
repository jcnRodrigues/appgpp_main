import { listarFuncionarios } from "@/features/funcionario/server/funcionario.service";
import Header from "@/components/Header/Header";
import FuncionarioTable from "@/features/funcionario/components/FuncionarioTable/FuncionarioTable";
import { ArrowRightLeft, ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PermissionActionLink from "@/components/PermissionActionLink/PermissionActionLink";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../api/auth/[...nextauth]/route";
import { hasModuleAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function FuncionariosAdd() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Funcionarios</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faca login para visualizar os funcionarios</p>
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
    const funcionarios = await listarFuncionarios({ take: 10, skip: 0 });

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />

            <div className="max-w-[86.4rem] mx-auto px-2">
                <div className="form-title-sticky flex items-center justify-between mb- mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                        </Link>
                        <div>
                            <h1 className="text-h2 font-bold">Funcionarios</h1>
                            <p className="text-gray-600 text-sm mt-1">Gerenciar funcionarios da empresa</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild 
                        variant="ghost" 
                        className="flex gap-2 bg-blue-500 hover:bg-blue-600">
                            <Link href="/funcionariosadd/transferencia-custo">
                                <ArrowRightLeft className="h-4 w-4" />
                                Transferencia de Custo
                            </Link>
                        </Button>
                        <PermissionActionLink
                            href="/funcionario/cadastro"
                            action="CREATE"
                            module="FUNCIONARIOS"
                            deniedMessage="Você não tem permissão para adicionar registros."
                        >
                            <Button 
                            variant="ghost"
                            className="flex gap-2 bg-green-500 hover:bg-green-600">
                                <Plus className="h-5 w-5" />
                                Novo Funcionario
                            </Button>
                        </PermissionActionLink>
                    </div>
                </div>

                <FuncionarioTable funcionarios={funcionarios} />
            </div>
        </div>
    );
}
