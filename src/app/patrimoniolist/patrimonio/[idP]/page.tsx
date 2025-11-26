/* eslint-disable @next/next/no-img-element */

import Header from "@/back-end/components/Header/Header";
import { ChevronLeft, CircleDollarSign, HardDriveIcon, Laptop, LibraryBig, NotebookIcon, ScrollText } from "lucide-react";
import { getPatrimonioCardById } from "@/back-end/service/Patrimonio.services/patrimonio.service";
import Link from "next/link";


interface PatrimonioProps {
    params: {
        idP: string;
    }
}

export default async function PatrimonioProfilePage({ params }: PatrimonioProps) {

    const { idP } = await params;
    const Patrimonio = await getPatrimonioCardById(idP);


    if (!Patrimonio?.idPat) {
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
    }
    return (
        <div>
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/patrimoniolist" className="mr-4">
                    <ChevronLeft className="h-6 w-6 text-primary" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">Detalhes do Patrimonio</h6>
                <div className="w-6"></div>
            </div>
            <div key={idP} className="grid grid-cols-1 sm:grid-cols-3 mb:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <div className="bg-white shadow rounded-lg p-4 mb-6 flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4">
                        <div className="h-16 w-16 md:h-32 md:w-32 flex-shrink-0 rounded-full overflow-hidden">
                            <img
                                src={`${'https://placehold.co/600x400?text=00' + Patrimonio?.idPat}`}
                                alt={Patrimonio?.descricaoPat}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="md:text-center">
                            <h3>{Patrimonio.idPat}</h3>
                            <h4>{Patrimonio.descricaoPat}</h4>
                            <div className="flex items-center mt-1 md:justify-center">
                                <Laptop className=" h-4 w-4 text-accent mr-2" />
                                <span className="font-medium">
                                    {Patrimonio?.tbTipoPat?.descricaoTipPat}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-3 md:mb-0">
                        <h3 className="mb-2">Descrição Detalahada</h3>
                        <div className="flex items-center">
                            <NotebookIcon className="h-4 w-4 text-accent mr-2" />
                            <span >
                                {Patrimonio.descricaoPat}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <HardDriveIcon className="h-4 w-4 text-accent mr-2" />
                            <span>
                                {Patrimonio?.descricaoDetalhadaPat}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <LibraryBig className="h-4 w-4 text-accent mr-2" />
                            <span>
                                {Patrimonio.licencaPat}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Laptop className="h-4 w-4 text-accent mr-2" />
                            <span>
                                {Patrimonio?.tbTipoPat?.descricaoTipPat}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <ScrollText className="h-4 w-4 text-accent mr-2" />
                            <span>
                                {Patrimonio.notaFiscalPat}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <CircleDollarSign className="h-4 w-4 text-accent mr-2" />
                            <span>
                                {Patrimonio.valorPat}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className=" bg-white rounded-lg shadow p-4 mb-6">
                        <h3 className="mb-2">Detalhes do Patrimônio</h3>
                        <p>
                            {Patrimonio.tbCCusto?.descricaoCCusto}
                        </p>
                        <p>
                            {Patrimonio.tbStatusPat?.descricaoStatPat}
                        </p>
                        <p>

                        </p>
                    </div>
                    <div className="justify-center flex">
                        <Link href={`/patrimoniolist/patrimonio/${Patrimonio?.idP}/schedule`}>
                            <button className="bg-accent w-50 text-white p-2 rounded-full">
                                Atribuir Patrimônio
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}