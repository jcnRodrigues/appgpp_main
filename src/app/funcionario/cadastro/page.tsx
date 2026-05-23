import Header from "@/back-end/components/Header/Header";
import FuncionarioForm from "@/back-end/components/FuncionarioForm/FuncionarioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasActionPermission, hasModuleAccess } from "@/lib/permissions";

export default async function CadastroFuncionario() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCIONARIOS') || !hasActionPermission(formularios, 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <FuncionarioForm />
        </>
    );  
}
