import Header from "@/back-end/components/Header/Header";
import { Button } from "@/back-end/components/ui/button";
import Link from "next/link";
import FuncionarioAppointmentsCard from "./FuncionarioAppointmentsCard";
import { getFuncionariosAppointmentByUserID } from "@/back-end/service/Funcionario.service/funcionario.service";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../api/auth/[...nextauth]/route";

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

    //const funcionariosAppointment = await getFuncionariosAppointmentByUserID();
    //return (<FuncionarioAppointmentsCard funcionariosAppointments={funcionariosAppointment}/>)
    
}


