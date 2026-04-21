import { contarPatrimonios } from "@/back-end/service/Patrimonio.services/patrimonio.service";
import { contarFuncionarios, resumoCentrosCusto } from "@/back-end/service/Dashboard.service/dashboard.service";
import DashboardCards from "./DashboardCards";
import CentrosResumoCards from "./CentrosResumoCards";
import GraficoAlocacoesPorCentro from "./GraficoAlocacoesPorCentro";
import GraficoAlocacoesLinha from "./GraficoAlocacoesLinha";

export default async function Dashboard() {
    const totalPatrimonios = await contarPatrimonios();
    const totalFuncionarios = await contarFuncionarios();
    const centrosResumo = await resumoCentrosCusto();

    return (
        <div className="space-y-6">
            {/* Cards de Totais */}
            <DashboardCards
                totalPatrimonios={totalPatrimonios}
                totalFuncionarios={totalFuncionarios}
            />

            {/* Cards por Centro de Custo */}
            <CentrosResumoCards centros={centrosResumo} />

            {/* Graficos */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Grafico de Barras - Alocacoes por Centro de Custo */}
                <GraficoAlocacoesPorCentro />

                {/* Grafico de Linha - Alocacoes ao longo do tempo */}
                <GraficoAlocacoesLinha />
            </div>
        </div>
    );
}
