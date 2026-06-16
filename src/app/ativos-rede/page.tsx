import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { hasModuleAccess, hasModuleActionPermission } from '@/lib/permissions';
import {
    contarAtivosRede,
    listarAtivosRede,
    listarCentrosAtivoRede,
    listarStatusAtivoRede
} from '@/features/ativos-rede/server/ativo-rede.service';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import AtivoRedeFilter from '@/features/ativos-rede/components/AtivoRedeFilter/AtivoRedeFilter';
import AtivoRedeTable from '@/features/ativos-rede/components/AtivoRedeTable/AtivoRedeTable';
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
                <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Ativos de Rede</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar esta página.</p>
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
    const canCreate = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'CREATE');
    const canTransfer = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'TRANSFER');
    const canReturn = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'RETURN');
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
            <div className="mx-auto max-w-[86.4rem] px-4 sm:px-6">
                <PageHeader
                    icon={Router}
                    title="Ativos de Rede"
                    backHref="/"
                    description="Cadastro, transferência e devolução de ativos de rede."
                    actions={
                        <>
                            {canPrint ? (
                                <Button asChild className="bg-amber-500 text-white hover:bg-amber-600">
                                    <Link href="/ativos-rede/relatorio-centro">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Relatório por Centro
                                    </Link>
                                </Button>
                            ) : null}
                            {canReturn ? (
                                <Button asChild className="bg-red-500 text-white hover:bg-red-600">
                                    <Link href="/ativos-rede/devolucao">
                                        <Undo2 className="mr-2 h-4 w-4" />
                                        Devolução Ativo
                                    </Link>
                                </Button>
                            ) : null}
                            {canTransfer ? (
                                <Button asChild className="bg-blue-500 text-white hover:bg-blue-600">
                                    <Link href="/ativos-rede/transferencia">
                                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                                        Transferir Ativo
                                    </Link>
                                </Button>
                            ) : null}
                            {canCreate ? (
                                <Button asChild className="bg-green-500 text-white hover:bg-green-600">
                                    <Link href="/ativos-rede/cadastro">Novo Ativo de Rede</Link>
                                </Button>
                            ) : null}
                        </>
                    }
                />

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
