import Header from '@/components/Header/Header';
import AtivoRedeFilter from '@/features/ativos-rede/components/AtivoRedeFilter/AtivoRedeFilter';
import AtivoRedeTable from '@/features/ativos-rede/components/AtivoRedeTable/AtivoRedeTable';
import {
    contarAtivosRede,
    listarAtivosRede,
    listarCentrosAtivoRede,
    listarStatusAtivoRede
} from '@/features/ativos-rede/server/ativo-rede.service';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { hasModuleAccess, hasModuleActionPermission } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, FileText, Router, Undo2 } from 'lucide-react';

type SearchParams = {
    codigo?: string;
    centroId?: string;
    statusId?: string;
    page?: string;
    take?: string;
};

export default async function AtivosRedePage({
    searchParams
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Ativos de Rede</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faca login para visualizar esta pagina</p>
                        <Button asChild>
                            <Link href="/">Ir para Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'ATIVOS_REDE')) redirect('/acesso-negado');
    const canPrint = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'PRINT');

    const params = searchParams ? await searchParams : undefined;
    const codigo = params?.codigo?.trim() || '';
    const centroId = params?.centroId?.trim() || '';
    const statusId = params?.statusId?.trim() || '';
    const page = Math.max(1, Number.parseInt(params?.page || '1', 10) || 1);
    const take = Math.max(1, Number.parseInt(params?.take || '10', 10) || 10);
    const [totalAtivos, centros, statusOptions] = await Promise.all([
        contarAtivosRede({
            codigo: codigo || undefined,
            idCCustoAtivoRede: centroId || undefined,
            idStatusAtivoRede: statusId || undefined
        }),
        listarCentrosAtivoRede(),
        listarStatusAtivoRede()
    ]);

    const totalPaginas = Math.max(1, Math.ceil(totalAtivos / take));
    const paginaAtual = Math.min(page, totalPaginas);
    const ativos = await listarAtivosRede({
        codigo: codigo || undefined,
        idCCustoAtivoRede: centroId || undefined,
        idStatusAtivoRede: statusId || undefined,
        skip: (paginaAtual - 1) * take,
        take
    });

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="max-w-[86.4rem] mx-auto px-4 sm:px-6">
                <div className="form-title-sticky flex items-center justify-between gap-4 mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-700 text-white shadow-md">
                            <Router className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-h2 font-bold">Ativos de Rede</h1>
                            <p className="text-gray-600 text-sm mt-1">Cadastro, transferência e devolução de ativos de rede</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {canPrint && (
                            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                                <Link href="/ativos-rede/relatorio-centro">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Relatório por Centro
                                </Link>
                            </Button>
                        )}
                        <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
                            <Link href="/ativos-rede/devolucao">
                                <Undo2 className="h-4 w-4 mr-2" />
                                Devolução
                            </Link>
                        </Button>
                        <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Link href="/ativos-rede/transferencia">
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Transferir
                            </Link>
                        </Button>
                        <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                            <Link href="/ativos-rede/cadastro">Novo Ativo de Rede</Link>
                        </Button>
                    </div>
                </div>

                <AtivoRedeFilter
                    codigo={codigo}
                    centroId={centroId}
                    statusId={statusId}
                    centros={centros as any[]}
                    statusOptions={statusOptions as any[]}
                />
                <AtivoRedeTable
                    ativos={ativos as any[]}
                    totalItens={totalAtivos}
                    paginaAtual={paginaAtual}
                    itensPorPagina={take}
                />
            </div>
        </div>
    );
}
