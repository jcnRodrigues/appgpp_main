import { ArrowUpRight } from "lucide-react";

interface DashboardCardsProps {
    totalPatrimonios: number;
    totalFuncionarios: number;
}

export default function DashboardCards({ totalPatrimonios, totalFuncionarios }: DashboardCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Patrimônios */}
            <div className="bg-white rounded-3xl p-6 relative shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500">Patrimônios</h4>
                        <div className="mt-2 flex items-end gap-3">
                            <span className="text-3xl font-bold">{totalPatrimonios}</span>
                            <span className="text-xs text-gray-400">cadastrados</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Total de patrimônios registrado no sistema.</p>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                        <span className="text-lg font-bold">📦</span>
                    </div>
                </div>

                <div className="absolute bottom-3 right-3">
                    <button className="bg-blue-600 text-white p-2 rounded-full">
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Card Funcionários */}
            <div className="bg-white rounded-3xl p-6 relative shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500">Funcionários</h4>
                        <div className="mt-2 flex items-end gap-3">
                            <span className="text-3xl font-bold">{totalFuncionarios}</span>
                            <span className="text-xs text-gray-400">cadastrados</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">Total de funcionários registrado no sistema.</p>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                        <span className="text-lg font-bold">👥</span>
                    </div>
                </div>

                <div className="absolute bottom-3 right-3">
                    <button className="bg-green-600 text-white p-2 rounded-full">
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
