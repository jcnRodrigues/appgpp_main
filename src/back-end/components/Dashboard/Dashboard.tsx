/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import { contarPatrimonios } from "@/back-end/service/Patrimonio.services/patrimonio.service";

export default async function Dashborad() {
    const total = await contarPatrimonios();

    return (
        <div className="bg-white rounded-3xl p-6 mb-7 relative shadow">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-gray-500">Patrimônios</h4>
                    <div className="mt-2 flex items-end gap-3">
                        <span className="text-3xl font-bold">{total}</span>
                        <span className="text-xs text-gray-400">cadastrados</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">Total de patrimônios registrado no sistema.</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                    <span className="text-lg font-bold">📦</span>
                </div>
            </div>

            <div className="absolute bottom-3 right-3">
                <button className="bg-accent text-white p-2 rounded-full">
                    <ArrowUpRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}