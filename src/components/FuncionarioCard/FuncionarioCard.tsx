/* eslint-disable @next/next/no-img-element */
import { FuncionarioGP } from "@/model/FuncionarioGP.model/FuncionarioGP.model";
import Link from "next/link";


export default function FuncionarioCard({ idMatFun, nomeFun, cpfFun, avatarFun, dataAdmFun, dataDemFun, idStatusFun,statusFun }: FuncionarioGP) {

    return (
        <div key={idMatFun} className="flex bg-white rounded-lg p-3 mb-3 shadow-sm">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">

                <img
                    src={avatarFun} //"https://github.com/jcnRodrigues.png"
                    alt={nomeFun}//"Joao Claudio N Rodrigues"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center flex-1">
                <h3 className="text-medium">
                    <Link href={`/patrimonio/${idMatFun}`} />{idMatFun} - {nomeFun}
                </h3>
                <p className="text-sm text-gray-500">
                    Função: {idStatusFun} 
                </p>
                <p className="text-sm text-gray-500">
                    CPF: {cpfFun}
                </p>
                <p className="text-sm text-gray-500">
                    Data de Admissão: {dataAdmFun ? new Date(dataAdmFun).toLocaleDateString(): 'Não informado'}
                </p>
                <p className="text-sm text-gray-500">
                    Data de Demissão: {dataDemFun ? new Date(dataDemFun).toLocaleDateString() : "Não informado"}
                </p>
            </div>
            <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${idStatusFun === 'ADMITIDO' ? 'bg-green-100 text-green-800' :
                        idStatusFun === 'DEMITIDO' ? 'bg-red-100 text-red-800' :
                            idStatusFun === 'FERIAS' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                    }`}>
                </span>
            </div>
        </div>
    );
}