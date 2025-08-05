/* eslint-disable @next/next/no-img-element */

import Header from "@/components/Header/Header";
import { PatrimonioGP } from "@/model/PatrimonioGP.model/PatrimonioGP.model";
import { ChevronLeft, CircleDollarSign, HardDriveIcon, Laptop, LibraryBig, NotebookIcon, ScrollText } from "lucide-react";
import Link from "next/link";


const PatrimonioPropsDados: PatrimonioGP[] = [
    {
        idPat: "1",
        descricaoPat: "DELL VOSTRO 3480 INTEL CORE I5-8256U",
        descricaoDetalhadaPat: "RAM 12GB DDR4, HD SSD 240GB, HD 1TB",
        licencaPat: "WINDOWS 10, OFFICE 2019, ANTIVIRUS",
        imagenPat: "https://placehold.co/10x10?text=00000",
        dataEntradaPat: "29/11/2024",
        notaFiscalPat: "6659",
        valorPat: "R$ 1000,00",
        idTipoPat: "notebook",
        idStatusPat: "ativo"

    }
]

const PatrimonioDetalhesPage: PatrimonioGP[] = [
    {
        idPat: PatrimonioPropsDados[0].idPat,
        descricaoPat: PatrimonioPropsDados[0].descricaoPat,
        descricaoDetalhadaPat: PatrimonioPropsDados[0].descricaoDetalhadaPat,
        licencaPat: PatrimonioPropsDados[0].licencaPat,
        imagenPat: PatrimonioPropsDados[0].imagenPat,
        dataEntradaPat: PatrimonioPropsDados[0].dataEntradaPat,
        notaFiscalPat: PatrimonioPropsDados[0].notaFiscalPat,
        valorPat: PatrimonioPropsDados[0].valorPat,
        idTipoPat: PatrimonioPropsDados[0].idTipoPat,
        idStatusPat: PatrimonioPropsDados[0].idStatusPat
    }
]


export default async function PatrimonioProfilePage() {
    //const { idPat } = await params;
    const idPat = PatrimonioDetalhesPage.find(p => p.idPat === PatrimonioDetalhesPage[0].idPat);
     const Pat = PatrimonioDetalhesPage[0]
    /*if (patrimonio) {
        return (
            <div>
                <Header />
                <div className="flex items-center mb-6 mt-4">
                    <Link href="/" className="mr-4">
                        <ChevronLeft className="h-6 w-6 text-primary" />
                    </Link>
                </div>
                <div className=" flex flex-col items-center justify-center h-screen">
                    <h1 className=" text-2xl font-bold">
                        Patrimonio não encontrado
                    </h1>
                </div>
            </div>


        );
    }*/

    return (
        <div>
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/" className="mr-4">
                    <ChevronLeft className="h-6 w-6 text-primary" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">Detalhes do Patrimonio</h6>
                <div className="w-6"></div>
            </div>
            {PatrimonioDetalhesPage.map((detPat) => (
                <div key={detPat.idPat} className="md:grid md:grig-cols-2 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-white shadow rounded-lg p-4 mb-6 flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
                            <div className="h-16 w-16 md:h-32 md:w-32 flex-shrink-0 rounded-full overflow-hidden">
                                <img
                                    src={`${detPat.imagenPat}` + `${detPat.idPat}`}
                                    alt={detPat.idPat}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="md:text-center">
                                <h3>{detPat.idPat}</h3>
                                <h4>{detPat.descricaoPat}</h4>
                                <div className="flex items-center mt-1 md:justify-center">
                                    <Laptop className=" h-4 w-4 text-accent mr-2" />
                                    <span className="font-medium">{detPat.idTipoPat?.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-3 md:mb-0">
                            <h3 className="mb-2">Descrição Detalahada</h3>
                            <div className="flex items-center">
                                <NotebookIcon className="h-4 w-4 text-accent mr-2" />
                                <span >{detPat.descricaoPat}</span>
                            </div>
                            <div className="flex items-center">
                                <HardDriveIcon className="h-4 w-4 text-accent mr-2" />
                                <span>{detPat.descricaoDetalhadaPat}</span>
                            </div>
                            <div className="flex items-center">
                                <LibraryBig className="h-4 w-4 text-accent mr-2" />
                                <span>{detPat.licencaPat}</span>
                            </div>
                            <div className="flex items-center">
                                <Laptop className="h-4 w-4 text-accent mr-2" />
                                <span>{detPat.idTipoPat?.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center">
                                <ScrollText className="h-4 w-4 text-accent mr-2" />
                                <span>{detPat.notaFiscalPat}</span>
                            </div>
                            <div className="flex items-center">
                                <CircleDollarSign className="h-4 w-4 text-accent mr-2" />
                                <span>{detPat.valorPat}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className=" bg-white rounded-lg shadow p-4 mb-6">
                            <h3 className="mb-2">Detalhes do Patrimônio</h3>
                            <p>{detPat.descricaoDetalhadaPat}</p>
                        </div>
                        <div className="justify-center flex">
                            <Link href={`/patrimonio/${Pat.idPat}/schedule`}>
                            <button className="bg-accent w-70 text-white p-2 rounded-full">
                                Atribuir Patrimônio
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}