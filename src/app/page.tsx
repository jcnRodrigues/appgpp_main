import Dashboard from "@/features/dashboard/components/Dashboard/Dashboard";
import Header from "@/components/Header/Header";
import PageHeader from "@/components/PageHeader/PageHeader";
import { getServerSession } from "next-auth";
import { AuthOptions } from "./api/auth/[...nextauth]/route";
import { hasModuleAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Home as HomeIcon } from "lucide-react";


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

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, "DASHBOARD")) {
        redirect('/acesso-negado');
    }



  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <PageHeader
          icon={HomeIcon}
          title="Dashboard"
          description="Visão geral do sistema e atalhos principais"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
        <Dashboard />
      </div>
    </div>
  );
}
