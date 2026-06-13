import Header from "@/components/Header/Header";
import PatrimonioForm from "@/features/patrimonio/components/PatrimonioForm/PatrimonioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasModuleActionPermission, hasModuleAccess } from "@/lib/permissions";

export default async function EditarPat({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'PATRIMONIO') || !hasModuleActionPermission(formularios, 'PATRIMONIO', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <PatrimonioForm patrimonioId={id} />
        </>
    );
}
