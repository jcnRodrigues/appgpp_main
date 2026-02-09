import Header from "@/back-end/components/Header/Header";
import PatrimonioForm from "@/back-end/components/PatrimonioForm/PatrimonioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { Button } from "@/back-end/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CadastroPat() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }

    return (
        <>
            <Header />
            <PatrimonioForm />
        </>
    );
}
