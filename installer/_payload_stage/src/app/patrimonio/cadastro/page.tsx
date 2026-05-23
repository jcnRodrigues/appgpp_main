import Header from "@/back-end/components/Header/Header";
import PatrimonioForm from "@/back-end/components/PatrimonioForm/PatrimonioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasActionPermission, hasModuleAccess } from "@/lib/permissions";

export default async function CadastroPat() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'PATRIMONIO') || !hasActionPermission(formularios, 'CREATE')) {
        redirect('/acesso-negado');
    }

    return (
        <>
            <Header />
            <PatrimonioForm />
        </>
    );
}
