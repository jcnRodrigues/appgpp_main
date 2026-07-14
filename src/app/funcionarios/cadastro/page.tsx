import Header from "@/components/Header/Header";
import FuncionariosForm from "@/features/funcionarios/components/FuncionariosForm/FuncionariosForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasModuleActionPermission, hasModuleAccess } from "@/lib/permissions";

export default async function CadastroFuncionario() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCIONARIOS') || !hasModuleActionPermission(formularios, 'FUNCIONARIOS', 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <FuncionariosForm />
        </>
    );  
}
