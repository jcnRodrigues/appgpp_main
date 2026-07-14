import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Inbox } from 'lucide-react';
import { listarTermosFuncionario } from '@/features/alocacoes/server/cadastro.service';

type TermosFuncionarioPanelProps = {
    funcionarioId: string;
};

function formatarData(valor?: string | Date | null) {
    if (!valor) return '-';
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? '-' : data.toLocaleDateString('pt-BR');
}

function getStatusClass(status?: string | null) {
    const normalizado = (status || '').trim().toUpperCase();
    if (normalizado.includes('TRANSFER')) return 'bg-blue-100 text-blue-800';
    if (normalizado.includes('DEVOL')) return 'bg-rose-100 text-rose-800';
    if (normalizado.includes('ATIVO')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-slate-100 text-slate-700';
}

export default async function TermosFuncionarioPanel({ funcionarioId }: TermosFuncionarioPanelProps) {
    const termos = await listarTermosFuncionario(funcionarioId);

    return (
        <aside className="lg:sticky lg:top-[calc(var(--app-header-height)+20px)]">
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Termos do Funcionário</h2>
                        <p className="text-sm text-muted-foreground">
                            Lista lateral para localizar e abrir os termos vinculados à matrícula.
                        </p>
                    </div>
                </div>

                {termos.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-background px-4 py-8 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground" />
                        <p className="mt-3 text-sm font-medium">Nenhum termo encontrado</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Quando houver uma alocação para esta matrícula, ela aparecerá aqui.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {termos.map((termo) => {
                            const patrimonio = termo.tbPatrimonio;
                            const status = termo.tbStatusPat?.descricaoStatPat || patrimonio?.tbStatusPat?.descricaoStatPat || '-';
                            const tituloPatrimonio = patrimonio
                                ? `${patrimonio.idPat}${patrimonio.descricaoPat ? ` - ${patrimonio.descricaoPat}` : ''}`
                                : termo.idPatCad;

                            return (
                                <div key={termo.idCad} className="rounded-xl border border-border/60 bg-background p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">{tituloPatrimonio}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Termo gerado em {formatarData(termo.dataCadPat)}
                                            </p>
                                        </div>
                                        <Badge className={getStatusClass(status)}>{status}</Badge>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>
                                            <span className="block font-medium text-foreground">Centro</span>
                                            {patrimonio?.tbCCusto?.descricaoCCusto || '-'}
                                        </div>
                                        <div>
                                            <span className="block font-medium text-foreground">Tipo</span>
                                            {patrimonio?.tbTipoPat?.descricaoTipPat || '-'}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-end">
                                        <Button asChild size="sm" variant="outline" className="gap-2">
                                            <Link href={`/alocacoes/${termo.idCad}/termo`}>
                                                Abrir termo
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </aside>
    );
}
