import Header from "@/back-end/components/Header/Header";
import { Button } from "@/back-end/components/ui/button";
import Link from "next/link";
import { getFuncionariosCard } from "@/back-end/service/Funcionario.service/funcionario.service";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../api/auth/[...nextauth]/route";
import { ChevronLeft } from "lucide-react";
import FuncionarioCard from "@/back-end/components/FuncionarioCard/FuncionarioCard";
import SectionHeader from "@/back-end/components/SectionHeader/SectionHeader";

const FuncCard = await getFuncionariosCard();

export default async function AppointmentsPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Meus Funcionarios</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login</p>
                        <Button asChild>
                            <Link href="/">Faça login para visualizar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/" className="mr-4" >
                    <ChevronLeft className="h-6 w-6 text-primary text-center" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">
                    <SectionHeader title="Lista de Funcionários - AppGPP" linkText="Ver Todos" linkHref="/" />
                </h6>

                <div className="w-6 text-center"></div>
            </div>

            <div className="mt-4 mb-8 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {FuncCard.map((fCard) => (
                    <FuncionarioCard
                        key={fCard.idF}
                        idMatFun={fCard.idMatFun}
                        nomeFun={fCard.nomeFun}
                        cpfFun={fCard.cpfFun || ""}
                        idStatusFun={fCard.idStatusFun || ""}
                        idFuncaoFun={fCard.idFuncaoFun ?? ""}
                        avatarFun={fCard.avatarFun || ""} 
                        dataAdmFun={fCard.dataAdmFun} 
                        dataDemFun={fCard.dataDemFun} 
                        idCustoFun={fCard.idCustoFun || ""} />
                ))}
            </div>
            <div className="mt-8 flex justify-center">
                <div className="bg-accent text-white px-6 py-3 rounded-2xl hover:bg-accent/90 transition-colors duration-200 shadow-md">
                    Mais Funcionários
                </div>
            </div>
        </div>
    );
}


