import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import CadastroForm from '@/features/alocacoes/components/CadastroForm/CadastroForm';
import Header from '@/components/Header/Header';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';

export default async function NovaAlocacaoPage({
    searchParams
}: {
    searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
}) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ALOCACOES') || !hasModuleActionPermission(formularios, 'ALOCACOES', 'CREATE')) {
        redirect('/acesso-negado');
    }

    const params = searchParams ? await searchParams : {};
    const patrimonioId = typeof params.patrimonio === 'string' ? params.patrimonio : undefined;
    const funcionarioId = typeof params.funcionario === 'string' ? params.funcionario : undefined;
    const preservarHistoricoValor = params.preservarHistorico;
    const preservarHistoricoPatrimonio =
        preservarHistoricoValor === '1' ||
        preservarHistoricoValor === 'true';
    return (
        <>
        <Header />
        <CadastroForm
            funcionarioId={funcionarioId}
            patrimonioId={patrimonioId}
            preservarHistoricoPatrimonio={preservarHistoricoPatrimonio}
        />
        </>
        
    );
}
