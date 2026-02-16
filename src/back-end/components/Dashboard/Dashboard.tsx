/* eslint-disable @next/next/no-img-element */
import { contarPatrimonios } from "@/back-end/service/Patrimonio.services/patrimonio.service";
import { contarFuncionarios } from "@/back-end/service/Dashboard.service/dashboard.service";
import DashboardCards from "./DashboardCards";
import GraficoAlocacoesPorCentro from "./GraficoAlocacoesPorCentro";
import GraficoAlocacoesLinha from "./GraficoAlocacoesLinha";

export default async function Dashboard() {
    const totalPatrimonios = await contarPatrimonios();
    const totalFuncionarios = await contarFuncionarios();

    return (
        <div className="space-y-6">
            {/* Cards de Totais */}
            <DashboardCards 
                totalPatrimonios={totalPatrimonios}
                totalFuncionarios={totalFuncionarios}
            />

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Gráfico de Barras - Alocações por Centro de Custo */}
                <GraficoAlocacoesPorCentro />

                {/* Gráfico de Linha - Alocações ao longo do tempo */}
                <GraficoAlocacoesLinha />
            </div>
        </div>
    );
}