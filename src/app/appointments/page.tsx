import { getFuncionariosAppointmentByUserID } from "@/backend/service/Funcionario.service/funcionario.service";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FuncionarioAppointmentsCard from "./FuncionarioAppointmentsCard";

export default async function AppointmentsPage() {
    const userId = 'a155c8d0-8d71-4322-ad20-ed2779ce263b';
    

    if (userId) {
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
    const AppointmentsFuncionarios = await getFuncionariosAppointmentByUserID();
    return (
        <div></div>
        )
}