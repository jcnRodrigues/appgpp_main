/* eslint-disable @next/next/no-img-element */
"use server"
import { FuncionarioGP } from "@/backend/model/FuncionarioGP.model/FuncionarioGP.model";
import { getFuncionarioFuncaoById, getFuncionarioStatusById } from "@/backend/service/Funcionario.service/funcionario.service";
import Link from "next/link";


export default async function FuncionarioCard({ idMatFun, nomeFun, cpfFun, avatarFun, dataAdmFun, dataDemFun, idStatusFun, idFuncaoFun }: FuncionarioGP) {

    const funFuncao = await getFuncionarioFuncaoById(idFuncaoFun);
    const statusFun = await getFuncionarioStatusById(idStatusFun);


    return (
        <div key={idMatFun} className="flex bg-white rounded-lg p-2 mb-3 shadow-sm relative">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img
                    src={avatarFun} //"https://github.com/jcnRodrigues.png"
                    alt={nomeFun}//"Joao Claudio N Rodrigues"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center flex-1">
                <h3 className="text-medium">
                    <Link href={`/patrimonio/${idMatFun}`} />
                    {idMatFun} - {nomeFun}
                </h3>
                <p className="text-sm text-gray-500">
                    Função: {funFuncao?.nomeFuncao}
                </p>
                <p className="text-sm text-gray-500">
                    CPF: {cpfFun}
                </p>
                <p className="text-sm text-gray-500">
                    Data de Admissão: {dataAdmFun ? new Date(dataAdmFun).toLocaleDateString() : 'Não informado'}
                </p>
                <p className="text-sm text-gray-500">
                    Data de Demissão: {dataDemFun ? new Date(dataDemFun).toLocaleDateString() : "Não informado"}
                </p>
            </div>
            <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${statusFun?.descricaoStatusFun === 'ADMITIDO' ? 'bg-green-100 text-green-800' :
                        statusFun?.descricaoStatusFun === 'DEMITIDO' ? 'bg-red-100 text-red-800' :
                            statusFun?.descricaoStatusFun === 'FERIAS' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'

                    }`}>
                    {statusFun?.descricaoStatusFun.toLocaleUpperCase()}
                </span>
            </div>
        </div>
    );
}