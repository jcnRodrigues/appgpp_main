import { contarPatrimonios } from "@/features/patrimonio/server/patrimonio.service";
import { contarFuncionarios, resumoCentrosCusto } from "@/features/dashboard/server/dashboard.service";
import DashboardCards from "./DashboardCards";
import CentrosResumoCards from "./CentrosResumoCards";
import GraficoAlocacoesPorCentro from "./GraficoAlocacoesPorCentro";
import GraficoAlocacoesLinha from "./GraficoAlocacoesLinha";
import DashboardSectionToggle from "./DashboardSectionToggle";

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
            <DashboardSectionToggle
                title="Graficos"
                description="Alocacoes por centro de custo e evolucao nos ultimos 12 meses"
                storageKey="appgpp-dashboard-graficos-visible"
                collapsedMessage="Graficos ocultos."
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                    <GraficoAlocacoesPorCentro />
                    <GraficoAlocacoesLinha />
                </div>
            </DashboardSectionToggle>
        </div>
    );
}
