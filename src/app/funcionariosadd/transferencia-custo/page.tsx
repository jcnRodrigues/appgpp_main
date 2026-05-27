import Header from "@/back-end/components/Header/Header";
import TransferenciaCustoTable from "@/back-end/components/FuncionarioTable/TransferenciaCustoTable";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasModuleAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function TransferenciaCustoPage() {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) redirect('/');

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'FUNCIONARIOS')) {
    redirect('/acesso-negado');
  }

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="max-w-[86.4rem] mx-auto px-2">
        <div className="form-title-sticky flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-4">
            <Link href="/funcionariosadd">
              <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
            </Link>
            <div>
              <h1 className="text-h2 font-bold">Transferencia de Custo</h1>
              <p className="text-gray-600 text-sm mt-1">Lista de funcionarios transferidos com custo anterior e atual</p>
            </div>
          </div>
        </div>

        <TransferenciaCustoTable />
      </div>
    </div>
  );
}
