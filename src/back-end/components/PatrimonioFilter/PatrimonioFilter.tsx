import { Badge } from "../ui/badge";

interface PatrimonioFilterProps {
    tipoPat: string[];
    onFilterChange: (tipoPatrimonio: string | null) => void;
    selectedTipoPat: string | null;
}

export default function PatrimonioFilter({
    tipoPat = ['desktop', 'notebook', 'monitor', 'station'],
    onFilterChange,
    selectedTipoPat }: PatrimonioFilterProps) {
    return (
        <div className="mb-4 overflow-hidden">
            <div className="flex overflow-x-auto pb-3 scroll-hide -mx-4 sm:flex sm:flex-wrap sm:justify-center">
                <div className="inline-flex gap-2 sm:flex-wrap sm:justify-center sm:gap-3">
                    <Badge
                        onClick={() => onFilterChange(null)}
                        className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full ${
                            selectedTipoPat
                                ? 'bg-accent to-white hover:bg-accent/90 hover:text-white border-0'
                                : 'bg-[#e6f7f1] border-0 text-[#1c7261] hover:bg-[#d1f0c6 shadow-sm'
                            }`}>
                        Todos os Tipos de Patrimonio
                    </Badge>
                    {tipoPat.map((tipoPatrimonio) => (
                        <Badge
                            key={tipoPatrimonio}
                            onClick={() => onFilterChange(tipoPatrimonio)}
                            className={`whitespace-nowrap cursor-pointer py-2 px-4 rounded-full ${
                                selectedTipoPat === tipoPatrimonio
                                    ? 'bg-accent to-white hover:bg-accent/90 hover:text-white border-0'
                                    : 'bg-[#e6f7f1] border-0 text-[#1c7261] hover:bg-[#d1f0c6] shadow-sm'
                                }`}>
                            {tipoPatrimonio}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
