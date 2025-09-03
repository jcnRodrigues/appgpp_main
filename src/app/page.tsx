import { getFuncionariosCard } from "@/backend/service/Funcionario.service/funcionario.service";
import Dashborad from "@/components/Dashboard/Dashboard";
import FuncionarioCard from "@/components/FuncionarioCard/FuncionarioCard";
import Header from "@/components/Header/Header";
import SectionHeader from "@/components/SectionHeader/SectionHeader";


const FuncCard = await getFuncionariosCard();

export default function Home() {
  return (
    <div>
      <Header />
      <SectionHeader title="Dashboard - AppGPP" />
      <div className="grid grid-cols-2 sm:grid-cols-3 mb:grid-cols-4 lg:grid-cols-4 gap-4">
        <Dashborad />
        <Dashborad />
        <Dashborad />
        <Dashborad />
      </div>
      <SectionHeader title="Funcionário - AppGPP" linkText="Ver Todos" linkHref="/appointments" />
      <div className="mt-4 mb-8 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {FuncCard.map((fCard) => (
          <FuncionarioCard
            key={fCard.idF}
            idMatFun={fCard.idMatFun}
            nomeFun={fCard.nomeFun}
            cpfFun={fCard.cpfFun || ""}
            idStatusFun={fCard.idStatusFun || ""}
            idFuncaoFun={fCard.idFuncaoFun ?? ""}
            avatarFun={fCard.avatarFun || ""} dataAdmFun={""} dataDemFun={""} idCustoFun={""}          />
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
