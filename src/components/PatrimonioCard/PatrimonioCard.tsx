/* eslint-disable @next/next/no-img-element */

import { PatrimonioGP } from "@/model/PatrimonioGP.model/PatrimonioGP.model";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";


export default function PatrimonioCard({
    idPat,
    descricaoPat,
    valorPat,
    idTipoPat,
    idStatusPat }: PatrimonioGP) {
    return (
        <Link href={`/patrimonio/${idPat}`}>
            <div className="bg-white rounded-3xl p-3 mb-7 relative">
                <div className="relative">
                    <img src={`https://placehold.co/600x400?text=00${idPat}`}
                        alt="Patrimonio Icon"
                        width={200}
                        height={300}
                        className="w-full h-40 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-3 right-2 bg-white rounded-full py-1 px-3 flex items-center gapt-1">
                        <Star className="h-4 w-4 fill-accent text-accent-foreground" >5.0</Star>
                    </div>
                </div>
                <div className="px-4 pt-2 pb-4 text-center mb-3">
                    <h3 className=" text-h3 mb-1 truncate overflow-hidden whitespace-nowrap">
                        {idPat} - {idTipoPat?.toUpperCase()}
                    </h3>
                    <p>
                        {descricaoPat}
                    </p>
                    <p>
                        {valorPat}
                    </p>
                    <span className={`text-medium px-2 py-1 rounded-full text-xs font-semibold
                        ${idStatusPat === 'ativo' ? 'bg-green-100 text-green-800' :
                            idStatusPat === 'inativo' ? 'bg-red-100 text-red-800' :
                                idStatusPat === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                    idStatusPat === 'em manutenção' ? 'bg-orange-100 text-orange-800' :
                                        idStatusPat === 'transferido' ? 'bg-blue-100 text-blue-800' :
                                            idStatusPat === 'devolvido' ? 'bg-gray-100 text-gray-800' :
                                                idStatusPat === 'reservado' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-yellow-100 text-yellow-800'
                        }`}>
                        
                    </span>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                    <button
                        className="bg-accent text-white p-2 rounded-full">
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
}