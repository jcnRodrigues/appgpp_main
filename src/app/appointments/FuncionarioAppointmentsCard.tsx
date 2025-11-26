"use client"

import FuncionarioCard from "@/back-end/components/FuncionarioCard/FuncionarioCard";
import Header from "@/back-end/components/Header/Header";
import { Badge } from "@/back-end/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { tbFuncionario } from "../../../prisma/generated/prisma";



type FuncionarioWithAppointment = tbFuncionario & { Funcionario: tbFuncionario }

interface Props {
    funcionariosAppointments: FuncionarioWithAppointment[];
}


//type FilterStatus = "ADMITIDO" | "DEMITIDO" | "FERIAS";


export default function FuncionarioAppointmentsCard({ funcionariosAppointments }: Props) {

    const [filterStatus, setFilterStatus] = useState<FuncionarioWithAppointment>();
    const filterAppointments = filterStatus === undefined
        ? funcionariosAppointments
        : funcionariosAppointments.filter(appointment => appointment === filterStatus)

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
                        onClick={() => setFilterStatus(funcionariosAppointments.find(app => app.idStatusFun === 'ADMITIDO'))}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                            ${filterStatus === funcionariosAppointments.find(app => app.idStatusFun === 'ADMITIDO')
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        ADMITIDO
                    </Badge>
                    <Badge
                        onClick={() => setFilterStatus(funcionariosAppointments.find(app => app.idStatusFun === 'DEMITIDO'))}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                            ${filterStatus === funcionariosAppointments.find(app => app.idStatusFun === 'DEMITIDO')
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        DEMITIDO
                    </Badge>
                    <Badge
                        onClick={() => setFilterStatus(funcionariosAppointments.find(app => app.idStatusFun === 'FERIAS'))}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full
                            ${filterStatus === funcionariosAppointments.find(app => app.idStatusFun === 'FERIAS')
                                ? "bg-accent text-white border-accent hover:bg-accent/90"
                                : "bg-transparent text-accent border-accent hover:bg-accent/10"}`}
                    >
                        FERIAS
                    </Badge>
                </div>
            </div>
            <div className="mt-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterAppointments.map((appointment) => (
                    <FuncionarioCard
                        key={appointment.idMatFun}
                        idMatFun={appointment.idMatFun}
                        nomeFun={appointment.nomeFun}
                        cpfFun={appointment.cpfFun ?? ""}
                        avatarFun={appointment.avatarFun ?? ""} dataAdmFun={""} dataDemFun={""} idStatusFun={""} idCustoFun={""} idFuncaoFun={""}

                    />
                ))}
            </div>
        </div>
    );
}