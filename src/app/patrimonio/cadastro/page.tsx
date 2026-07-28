import Header from "@/components/Header/Header";
import PatrimonioForm from "@/features/patrimonio/components/PatrimonioForm/PatrimonioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { hasModuleActionPermission, hasModuleAccess } from "@/lib/permissions";

export default async function CadastroPat() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'PATRIMONIO') || !hasModuleActionPermission(formularios, 'PATRIMONIO', 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <PatrimonioForm />
        </>
    );
}

