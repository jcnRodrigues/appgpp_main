import CadastroEditForm from '@/features/alocacoes/components/CadastroEditForm/CadastroEditForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/components/Header/Header';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import { buscarAlocacaoById } from '@/features/alocacoes/server/cadastro.service';
import { normalizeStatusText } from '@/lib/status';

function getDevolucaoPrioritaria(alocacao: Awaited<ReturnType<typeof buscarAlocacaoById>>) {
    const devolucaoCadastro = alocacao?.tbDevolucao?.[0] || null;
    const devolucaoPatrimonio = alocacao?.tbPatrimonio?.tbDevolucao?.[0] || null;
    const statusNormalizado = normalizeStatusText(alocacao?.tbStatusPat?.descricaoStatPat);
    const devolucaoConcluida =
        statusNormalizado.includes('DEVOLUCAO') ||
        Boolean(alocacao?.dataDevPat);

    if (devolucaoConcluida) {
        return devolucaoPatrimonio || devolucaoCadastro;
    }

    return devolucaoCadastro;
}

function getFimDevolucaoPrioritario(alocacao: Awaited<ReturnType<typeof buscarAlocacaoById>>) {
    const devolucao = getDevolucaoPrioritaria(alocacao);
    return devolucao?.dataChegadaFornecedor || devolucao?.dataFimDevolucao || null;
}

export default async function EditarAlocacaoPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/')
    }
    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ALOCACOES') || !hasModuleActionPermission(formularios, 'ALOCACOES', 'UPDATE')) {
        redirect('/acesso-negado');
    }

    const { id } = await params;
    const alocacao = await buscarAlocacaoById(id);

    if (!alocacao) {
        redirect('/alocacoes');
    }

    const statusNormalizado = normalizeStatusText(alocacao.tbStatusPat?.descricaoStatPat);
    const devolucao = getDevolucaoPrioritaria(alocacao);
    const fimDevolucaoPrioritario = getFimDevolucaoPrioritario(alocacao);
    const edicaoBloqueada =
        (
            statusNormalizado.includes('DEVOLUCAO') &&
            Boolean(devolucao?.dataInicioDevolucao && fimDevolucaoPrioritario)
        ) ||
        (statusNormalizado.includes('TRANSFERIDO') && Boolean(alocacao.dataDevPat));

    if (edicaoBloqueada) {
        redirect('/alocacoes');
    }

    return (
        <>
            <Header />
            <CadastroEditForm cadastroId={id} />
        </>
    );
}
