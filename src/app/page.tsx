import { getFuncionariosCard } from "@/backend/service/Funcionario.service/funcionario.service";
import { getPatrimonioCard } from "@/backend/service/Patrimonio.services/patrimonio.service";
import FuncionarioCard from "@/components/FuncionarioCard/FuncionarioCard";
import Header from "@/components/Header/Header";
import PatrimonioCard from "@/components/PatrimonioCard/PatrimonioCard";
import SectionHeader from "@/components/SectionHeader/SectionHeader";



const FuncionariosCard = await getFuncionariosCard();

const PatrmonioCard = await getPatrimonioCard();

export default function Home() {
  return (
    <div>
      <Header />
      <SectionHeader title="Funcionário - AppGPP" linkText="Ver Todos" linkHref="/appointments" />
      <div className="mt-4 mb-8 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FuncionariosCard.map((card) => (
          <FuncionarioCard
            key={card.idMatFun}
            idMatFun={card.idMatFun}
            avatarFun={card.avatarFun}
            nomeFun={card.nomeFun}
            cpfFun={card.cpfFun}
            dataAdmFun={card.dataAdmFun}
            idFuncaoFun={card.idFuncaoFun}
            idStatusFun={card.idStatusFun}
            funcaoFun={card.tbStatusFun}
          />
        ))}
      </div>

      <SectionHeader title="Patrimonio - Atribuidos " />
      <div className="grid grid-cols-2 sm:grid-cols-3 mb:grid-cols-4 lg:grid-cols-4 gap-4">
        {PatrmonioCard.map((card) => (
          <PatrimonioCard
            key={card.idPat}
            idPat={card.idPat} 
            descricaoPat={card.descricaoPat} 
            valorPat={card.valorPat}
            idStatusPat={card.tbStatusPat}

          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="bg-accent text-white px-6 py-3 rounded-2xl hover:bg-accent/90 transition-colors duration-200 shadow-md">
          Mais Patrimonios
        </div>
      </div>
    </div>
  );
}
