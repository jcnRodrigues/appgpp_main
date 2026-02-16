import Header from "@/back-end/components/Header/Header";
import FuncionarioForm from "@/back-end/components/FuncionarioForm/FuncionarioForm";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function CadastroFuncionario() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }

    return (
        <>
            <Header />
            <FuncionarioForm />
        </>
    );  
}
