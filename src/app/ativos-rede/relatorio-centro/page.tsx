import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import AtivoRedeRelatorioCentroButton, {
    type AtivoRedeRelatorioItem
} from '@/features/ativos-rede/components/AtivoRedeReport/AtivoRedeRelatorioCentroButton';
import AtivoRedeRelatorioCentroSelector from '@/features/ativos-rede/components/AtivoRedeReport/AtivoRedeRelatorioCentroSelector';
import {
    listarAtivosRedeRelatorio,
    listarCentrosAtivoRede
} from '@/features/ativos-rede/server/ativo-rede.service';
import { hasModuleActionPermission, hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../../api/auth/[...nextauth]/route';
import { FileText } from 'lucide-react';

type SearchParams = {
    centroId?: string;
};

type CentroCusto = {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
};

export default async function RelatorioAtivosRedePorCentroPage({
    searchParams
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE') || !hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'PRINT')) {
        redirect('/acesso-negado');
    }

    const params = searchParams ? await searchParams : undefined;
    const centroId = params?.centroId?.trim() || '';

    const [centros, ativos] = await Promise.all([
        listarCentrosAtivoRede(),
        centroId
            ? listarAtivosRedeRelatorio({
                idCCustoAtivoRede: centroId
            })
            : Promise.resolve([])
    ]);

    const centroSelecionado = (centros as CentroCusto[]).find((centro) => centro.idCCusto === centroId) || null;
    const centroLabel = centroSelecionado
        ? [centroSelecionado.codigoCCusto, centroSelecionado.descricaoCCusto].filter(Boolean).join(' - ')
        : 'Nenhum centro selecionado';

    const itensRelatorio: AtivoRedeRelatorioItem[] = ativos.map((item: any) => ({
        codigoAtivoRede: item.codigoAtivoRede,
        nomeAtivoRede: item.nomeAtivoRede,
        tipoAtivoRede: item.tipoAtivoRede,
        statusAtivoRede: item.statusAtivoRede,
        localInstalacaoAtivoRede: item.localInstalacaoAtivoRede,
        dataEntradaAtivoRede: item.dataEntradaAtivoRede ? item.dataEntradaAtivoRede.toISOString() : null,
        fotoAtivoRede: item.fotoAtivoRede || null,
        tbTipoAtivoRede: item.tbTipoAtivoRede
            ? { descricaoTipoAtivoRede: item.tbTipoAtivoRede.descricaoTipoAtivoRede ?? null }
            : null,
        tbStatusAtivoRede: item.tbStatusAtivoRede
            ? { descricaoStatusAtivoRede: item.tbStatusAtivoRede.descricaoStatusAtivoRede ?? null }
            : null
    }));

    const getStatusPatBadgeClass = (status?: string | null) => {
        if (status === 'ATIVO') return 'bg-green-100 text-green-800';
        if (status === 'DESMOBILIZAÇÃO') return 'bg-red-100 text-red-800';
        if (status === 'RESERVA') return 'bg-purple-100 text-purple-800';
        if (status === 'EM ESTOQUE') return 'bg-orange-100 text-orange-800';
        if (status === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4 sm:px-6">
                <PageHeader
                    icon={FileText}
                    title="Relatório de Ativos por Centro de Custo"
                    description="Selecione um centro de custo e gere o PDF com os ativos vinculados."
                    backHref="/ativos-rede"
                    backLabel="Voltar para Ativos de Rede"
                />

                <div className="mb-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto]">
                    <AtivoRedeRelatorioCentroSelector centros={centros as CentroCusto[]} centroId={centroId} />
                    <div className="min-w-[280px] rounded-lg bg-white p-4 shadow-sm">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Resumo</div>
                        <div className="mt-2 text-sm text-gray-700">
                            <p>
                                Centro: <span className="font-medium">{centroLabel}</span>
                            </p>
                            <p className="mt-1">
                                Total de ativos: <span className="font-medium">{itensRelatorio.length}</span>
                            </p>
                        </div>
                        <div className="mt-4">
                            <AtivoRedeRelatorioCentroButton
                                centroLabel={centroLabel}
                                itens={itensRelatorio}
                                disabled={!centroId || itensRelatorio.length === 0}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Prévia dos ativos</h2>
                    {!centroId ? (
                        <p className="text-sm text-gray-500">Escolha um centro de custo para visualizar os ativos do relatório.</p>
                    ) : itensRelatorio.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum ativo encontrado para o centro selecionado.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold">Código</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold">Nome</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold">Local</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold">Entrada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensRelatorio.map((item) => (
                                        <tr key={item.codigoAtivoRede} className="border-b">
                                            <td className="px-4 py-3 text-sm">{item.codigoAtivoRede}</td>
                                            <td className="px-4 py-3 text-sm">{item.nomeAtivoRede}</td>
                                            <td className="px-4 py-3 text-sm">{item.tbTipoAtivoRede?.descricaoTipoAtivoRede || item.tipoAtivoRede || '-'}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusPatBadgeClass(
                                                        item.tbStatusAtivoRede?.descricaoStatusAtivoRede || item.statusAtivoRede
                                                    )}`}
                                                >
                                                    {item.tbStatusAtivoRede?.descricaoStatusAtivoRede || item.statusAtivoRede || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{item.localInstalacaoAtivoRede || '-'}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {item.dataEntradaAtivoRede ? new Date(item.dataEntradaAtivoRede).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
