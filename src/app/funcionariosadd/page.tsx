import { listarFuncionarios } from "@/back-end/service/Funcionario.service/funcionario.service";
import Header from "@/back-end/components/Header/Header"
import FuncionarioTable from "@/back-end/components/FuncionarioTable/FuncionarioTable";
import { ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/back-end/components/ui/button";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../api/auth/[...nextauth]/route";

export default async function FuncionariosAdd() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Funcionários</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para visualizar os funcionários</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const funcionarios = await listarFuncionarios({ take: 10, skip: 0 });

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
                            <h1 className="text-h2 font-bold">Funcionários</h1>
                            <p className="text-gray-600 text-sm mt-1">Gerenciar funcionários da empresa</p>
                        </div>
                    </div>
                    <Link href="/funcionario/cadastro">
                        <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-5 w-5" />
                            Novo Funcionário
                        </Button>
                    </Link>
                </div>

                {/* Tabela */}
                <FuncionarioTable funcionarios={funcionarios} />
            </div>
        </div>
    );
}
