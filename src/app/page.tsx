import Dashborad from "@/back-end/components/Dashboard/Dashboard";
import Header from "@/back-end/components/Header/Header";
import SectionHeader from "@/back-end/components/SectionHeader/SectionHeader";
import { getServerSession } from "next-auth";
import { AuthOptions } from "./api/auth/[...nextauth]/route";


export default async function Home() {
      const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Tela Inicial - Dashboard</h1>
                    <div className="bg-white text-center p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para visualizar os Dashboard</p>
                    </div>
                </div>
            </div>
        )
    }



  return (
    <div>
      <Header />
      <SectionHeader title="Dashboard" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 pb-8">
        <Dashborad />
      </div>
    </div>
  );
}
