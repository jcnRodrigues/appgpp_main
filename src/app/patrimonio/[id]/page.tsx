import Header from "@/back-end/components/Header/Header";
import PatrimonioForm from "@/back-end/components/PatrimonioForm/PatrimonioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function EditarPat({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }

    const { id } = await params;

    return (
        <>
            <Header />
            <PatrimonioForm patrimonioId={id} />
        </>
    );
}
