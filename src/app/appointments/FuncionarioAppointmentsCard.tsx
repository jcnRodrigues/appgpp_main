"use client"

import FuncionarioCard from "@/components/FuncionarioCard/FuncionarioCard";
import Header from "@/components/Header/Header";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { tbFuncionario } from "../../../prisma/generated/prisma";



type FuncionarioWithAppointment = tbFuncionario & { Funcionario: tbFuncionario }

interface Props {
    funcionariosAppointments: FuncionarioWithAppointment[];
}


type FilterStatus = 'todos' | 'ativo' | 'inativo' | 'pendente';


export default function FuncionarioAppointmentsCard({ funcionariosAppointments }: Props) {
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
    const filterAppointments = filterStatus === "todos"
        ? funcionariosAppointments
        : funcionariosAppointments.filter(appointment => appointment.idStatusFun === filterStatus)

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
                        cpfFun={appointment.cpfFun ?? ""}
                        avatarFun={appointment.avatarFun ?? ""} dataAdmFun={""} dataDemFun={""} idStatusFun={""} idCustoFun={""} idFuncaoFun={""}

                    />
                ))}
            </div>
        </div>
    );
}