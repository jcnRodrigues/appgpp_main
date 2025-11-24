import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FuncionarioAppointmentsCard from "./FuncionarioAppointmentsCard";
import { getFuncionariosAppointmentByUserID } from "@/backend/service/Funcionario.service/funcionario.service";

export default async function AppointmentsPage() {
    const userId = '7c4603b1-aafc-4559-adee-937fdb0a6bda';



    if (!userId) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Meus Funcionarios</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login</p>
                        <Button asChild>
                            <Link href="/">Volta para o Inicio</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const funcionariosAppointment = await getFuncionariosAppointmentByUserID(userId);

    const formattedFuncionariosAppointment = funcionariosAppointment.map(funcionario => ({
        Funcionario: funcionario,
        ...funcionario,
    }));

    return (
        <FuncionarioAppointmentsCard funcionariosAppointments={formattedFuncionariosAppointment} />
    )
}