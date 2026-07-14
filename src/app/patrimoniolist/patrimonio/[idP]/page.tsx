/* eslint-disable @next/next/no-img-element */
import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { getPatrimonioCardById } from '@/features/patrimonio/server/patrimonio.service';
import { hasModuleAccess } from '@/lib/permissions';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { CircleDollarSign, HardDriveIcon, Laptop, LibraryBig, NotebookIcon, ScrollText } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface PatrimonioProps {
    params: {
        idP: string;
    };
}

export default async function PatrimonioProfilePage({ params }: PatrimonioProps) {
    const session = await getServerSession(AuthOptions);
    if (!session?.user) {
        redirect('/');
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleAccess(formularios, 'PATRIMONIO')) {
        redirect('/acesso-negado');
    }

    const { idP } = await params;
    const patrimonio = await getPatrimonioCardById(idP);

    if (!patrimonio?.idPat) {
        return (
            <div>
                <Header />
                <div className="mx-auto max-w-[86.4rem] px-4">
                    <PageHeader
                        icon={Laptop}
                        title="Patrimônio não encontrado"
                        backHref="/"
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={Laptop}
                    title="Detalhes do Patrimônio"
                    backHref="/patrimoniolist"
                    description={patrimonio.descricaoPat || undefined}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="md:col-span-1">
                        <div className="mb-6 flex items-center space-x-4 rounded-lg bg-white p-4 shadow sm:flex-col sm:space-x-0 sm:space-y-4">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full md:h-32 md:w-32">
                                <img
                                    src={`https://placehold.co/600x400?text=00${patrimonio?.idPat}`}
                                    alt={patrimonio?.descricaoPat}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="md:text-center">
                                <h3 className="text-lg font-semibold">{patrimonio.idPat}</h3>
                                <h4 className="text-base text-gray-700">{patrimonio.descricaoPat}</h4>
                                <div className="mt-1 flex items-center md:justify-center">
                                    <Laptop className="mr-2 h-4 w-4 text-accent" />
                                    <span className="font-medium">{patrimonio?.tbTipoPat?.descricaoTipPat}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 space-y-3 rounded-lg bg-white p-4 shadow md:mb-0">
                            <h3 className="mb-2 font-semibold">Descrição Detalhada</h3>
                            <div className="flex items-center">
                                <NotebookIcon className="mr-2 h-4 w-4 text-accent" />
                                <span>{patrimonio.descricaoPat}</span>
                            </div>
                            <div className="flex items-center">
                                <HardDriveIcon className="mr-2 h-4 w-4 text-accent" />
                                <span>{patrimonio?.descricaoDetalhadaPat}</span>
                            </div>
                            <div className="flex items-center">
                                <LibraryBig className="mr-2 h-4 w-4 text-accent" />
                                <span>{patrimonio.licencaPat}</span>
                            </div>
                            <div className="flex items-center">
                                <ScrollText className="mr-2 h-4 w-4 text-accent" />
                                <span>{patrimonio.notaFiscalPat}</span>
                            </div>
                            <div className="flex items-center">
                                <CircleDollarSign className="mr-2 h-4 w-4 text-accent" />
                                <span>{patrimonio.valorPat}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="mb-6 rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-2 font-semibold">Detalhes do Patrimônio</h3>
                            <p>{patrimonio.tbCCusto?.descricaoCCusto}</p>
                            <p>{patrimonio.tbStatusPat?.descricaoStatPat}</p>
                        </div>

                        <div className="flex justify-center">
                            <Link href={`/patrimoniolist/patrimonio/${patrimonio?.idP}/schedule`}>
                                <button className="w-50 rounded-full bg-accent p-2 text-white">
                                    Atribuir Patrimônio
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
