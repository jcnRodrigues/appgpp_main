/* eslint-disable @next/next/no-img-element */
"use client"

import FuncionarioCard from "@/components/FuncionarioCard/FuncionarioCard";
import Header from "@/components/Header/Header";
import { Badge } from "@/components/ui/badge";
import { FuncionarioGP } from "@/model/FuncionarioGP.model/FuncionarioGP.model";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FuncioanrioGP: FuncionarioGP[] = [
    {
        idMatFun: "049694",
        nomeFun: "Joao Claudio N Rodrigues",
        cpfFun: "123.456.789-00",
        idFuncaoFun: "Analista de Ssistemas",
        dataAdmFun: "01/01/2023",
        dataDemFun: "",
        idStatusFun: "ativo"

    },
    {
        idMatFun: "049695",
        nomeFun: "Suellen Piedade Rodrigues",
        cpfFun: "123.456.789-00",
        idFuncaoFun: "Analista de Ssistemas",
        dataAdmFun: "01/01/2023",
        dataDemFun: "30/01/2024",
        idStatusFun: "inativo"

    }
]

const Appointments: FuncionarioGP[] = [
    {
        idMatFun: FuncioanrioGP[0].idMatFun,
        nomeFun: FuncioanrioGP[0].nomeFun,
        cpfFun: FuncioanrioGP[0].cpfFun,
        idFuncaoFun: FuncioanrioGP[0].idFuncaoFun,
        dataAdmFun: FuncioanrioGP[0].dataAdmFun,
        dataDemFun: FuncioanrioGP[0].dataDemFun,
        idStatusFun: FuncioanrioGP[0].idStatusFun
    },
    {
        idMatFun: FuncioanrioGP[1].idMatFun,
        nomeFun: FuncioanrioGP[1].nomeFun,
        cpfFun: FuncioanrioGP[1].cpfFun,
        idFuncaoFun: FuncioanrioGP[1].idFuncaoFun,
        dataAdmFun: FuncioanrioGP[1].dataAdmFun,
        dataDemFun: FuncioanrioGP[1].dataDemFun,
        idStatusFun: FuncioanrioGP[1].idStatusFun
    },
    {
        idMatFun: FuncioanrioGP[1].idMatFun,
        nomeFun: FuncioanrioGP[1].nomeFun,
        cpfFun: FuncioanrioGP[1].cpfFun,
        idFuncaoFun: FuncioanrioGP[1].idFuncaoFun,
        dataAdmFun: FuncioanrioGP[1].dataAdmFun,
        dataDemFun: FuncioanrioGP[1].dataDemFun,
        idStatusFun: FuncioanrioGP[1].idStatusFun
    }

]

type FilterStatus = 'todos' | 'ativo' | 'inativo' | 'pendente';

export default function AppointmentsPage() {

    const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
    const filterAppointments = filterStatus === "todos"
        ? Appointments
        : Appointments.filter(appointment => appointment.idStatusFun === filterStatus)

    return (
        <div className="bg-background min-h-screen">
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/" className="mr-4">
                    <ChevronLeft className="h-6 w-6 text-primary" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">Todos os Funcionánrios</h6>
                <div className="w-6"></div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 mb-4">
                <h2>Funcionários ({filterAppointments.length})</h2>
                <div className="flex gap-2">
                    <Badge
                        onClick={() => setFilterStatus('todos')}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                             ${filterStatus === "todos"
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        Todos
                    </Badge>
                    <Badge
                        onClick={() => setFilterStatus('ativo')}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                            ${filterStatus === "ativo"
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        Ativo
                    </Badge>
                    <Badge
                        onClick={() => setFilterStatus('inativo')}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                            ${filterStatus === "inativo"
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        Inativo
                    </Badge>
                    <Badge
                        onClick={() => setFilterStatus('pendente')}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                            ${filterStatus === "pendente"
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        Pendente
                    </Badge>
                </div>
            </div>
            <div className="mt-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterAppointments.map((appointment) => (
                    <FuncionarioCard
                        key={appointment.idMatFun}
                        idMatFun={appointment.idMatFun}
                        nomeFun={appointment.nomeFun}
                        cpfFun={appointment.cpfFun}
                        idFuncaoFun={appointment.idFuncaoFun}
                        dataAdmFun={appointment.dataAdmFun}
                        dataDemFun={appointment.dataDemFun}
                        idStatusFun={appointment.idStatusFun}
                    />
                ))}


            </div>
        </div>
    );
}