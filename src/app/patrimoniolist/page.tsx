import { getPatrimonioCard } from "@/back-end/service/Patrimonio.services/patrimonio.service";
import Header from "@/back-end/components/Header/Header"
import PatrimonioCard from "@/back-end/components/PatrimonioCard/PatrimonioCard";
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const PatCard = await getPatrimonioCard();

export default function PatrimonioList() {
    return (
        <div>
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/" className="mr-4">
                    <ChevronLeft className="h-6 w-6 text-primary" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">Lista de Patrimônios</h6>
                <div className="w-6"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 mb:grid-cols-4 lg:grid-cols-4 gap-4">
                {PatCard.map((card) => (
                    <PatrimonioCard
                        key={card.idP}
                        idP={card.idP}
                        idPat={card.idPat}
                        descricaoPat={card.descricaoPat}
                        idTipoPat={card.idPat_TipoPat?.toString()}
                        idStatusPat={card.tbStatusPat?.descricaoStatPat || ""}
                    />
                ))
                }
            </div>
        </div>
    );
}