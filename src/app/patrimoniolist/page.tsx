import { getPatrimonioCard } from "@/back-end/service/Patrimonio.services/patrimonio.service";
import Header from "@/back-end/components/Header/Header"
import PatrimonioCard from "@/back-end/components/PatrimonioCard/PatrimonioCard";
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/back-end/components/ui/button";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../api/auth/[...nextauth]/route";
import SectionHeader from "@/back-end/components/SectionHeader/SectionHeader";

const PatCard = await getPatrimonioCard();

export default async function PatrimonioList() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Meus Patrimonios</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login</p>
                        <Button asChild>
                            <Link href="/">Faça login para visualizar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <Header />
            <div className="flex items-center mb-6 mt-4">
                <Link href="/" className="mr-4">
                    <ChevronLeft className="h-6 w-6 text-primary" />
                </Link>
                <h6 className="text-h6 text-center flex-grow">
                    <SectionHeader title="Lista de Patrimônios - AppGPP" linkText="Ver Todos" linkHref="/patrimoniolist" />
                </h6>
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
            <div className="mt-8 flex justify-center">
                <div className="bg-accent text-white px-6 py-3 rounded-2xl hover:bg-accent/90 transition-colors duration-200 shadow-md">
                    Mais Patrimonios
                </div>
            </div>
        </div>
    );
}