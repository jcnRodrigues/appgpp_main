import Header from "@/components/Header/Header";
import FuncionarioForm from "@/features/funcionario/components/FuncionarioForm/FuncionarioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasModuleActionPermission, hasModuleAccess } from "@/lib/permissions";

export default async function EditarFuncionario({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'FUNCIONARIOS') || !hasModuleActionPermission(formularios, 'FUNCIONARIOS', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <FuncionarioForm funcionarioId={id} />
        </>
    );
}
