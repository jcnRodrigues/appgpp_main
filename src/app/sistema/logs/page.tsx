import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/ui/button';
import { AuthOptions } from '@/lib/auth-options';
import { hasModuleAccess } from '@/lib/permissions';
import { formatSystemLogLine, listarLogsSistema } from '@/features/system-logs/server/system-logs.service';
import { listarLogsAcesso } from '@/features/system-logs/server/access-logs.service';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, History, ServerCog, ShieldAlert } from 'lucide-react';
import RefreshButton from './RefreshButton';
import AccessLogsPanel from './AccessLogsPanel';

export default async function LogsSistemaPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Logs do Sistema</h1>
          <div className="rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
            <p className="mb-6 text-lg">Faça login para visualizar os logs do sistema.</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'SISTEMA')) redirect('/acesso-negado');

  const snapshot = await listarLogsSistema();
  const accessLogs = await listarLogsAcesso(120);
  const recentFileEntries = snapshot.sources
    .flatMap((source) =>
      source.lines.map((line, index) => ({
        sourceLabel: source.label,
        sourceId: source.id,
        line,
        timestamp: formatSystemLogLine(line).timestamp,
        index,
      }))
    )
    .slice(-180)
    .reverse();

  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="mx-auto w-full max-w-[86.4rem] px-4 xl:px-6">
        <PageHeader
          icon={FileText}
          title="Logs do Sistema"
          description="Central de leitura para os registros locais do AppGPP, do serviço Host Inventory e do Event Log do Windows."
          backHref="/sistema"
          actions={(
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" className="border-border/70 bg-card">
                <Link href="/sistema">
                  <History className="h-4 w-4" />
                  Voltar ao Sistema
                </Link>
              </Button>
              <RefreshButton />
            </div>
          )}
        />

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
                <ServerCog className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fontes disponíveis</p>
                <p className="text-2xl font-semibold">{snapshot.totals.filesAvailable}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-3 text-sky-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Linhas lidas</p>
                <p className="text-2xl font-semibold">{snapshot.totals.fileLines}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos do Windows</p>
                <p className="text-2xl font-semibold">{snapshot.totals.eventEntries}</p>
              </div>
            </div>
          </div>
        </div>

        <AccessLogsPanel entries={accessLogs} />

        <div className="space-y-6">
          <section className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="text-lg font-semibold">Fontes de log locais</h2>
              <p className="text-sm text-muted-foreground">
                Arquivos monitorados pelo AppGPP e pelos serviços associados.
              </p>
            </div>
            <div className="space-y-4 p-5">
              {snapshot.sources.map((source) => (
                <div key={source.id} className="rounded-xl border border-border/60 bg-background/60">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
                    <div>
                      <h3 className="font-medium">{source.label}</h3>
                      <p className="text-xs text-muted-foreground">{source.path}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ${
                          source.available
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {source.available ? 'Disponível' : 'Indisponível'}
                      </span>
                      {source.updatedAt ? (
                        <span>{new Date(source.updatedAt).toLocaleString('pt-BR')}</span>
                      ) : null}
                    </div>
                  </div>

                  {source.available ? (
                    <pre className="max-h-[26rem] overflow-auto px-4 py-3 text-xs leading-6 text-foreground/90">
                      {source.lines.length > 0 ? source.lines.join('\n') : 'Sem registros recentes.'}
                    </pre>
                  ) : (
                    <div className="px-4 py-4 text-sm text-muted-foreground">
                      {source.error || 'Arquivo nao encontrado.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="text-lg font-semibold">Eventos do Windows</h2>
              <p className="text-sm text-muted-foreground">
                Últimos registros capturados de `System` e `Application`.
              </p>
            </div>
            <div className="space-y-3 p-5">
              {snapshot.eventLogs.length > 0 ? (
                snapshot.eventLogs.map((entry, index) => (
                  <article key={`${entry.timestamp}-${entry.source}-${index}`} className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {new Date(entry.timestamp).toLocaleString('pt-BR')}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          entry.level === 'error'
                            ? 'bg-red-500/10 text-red-600'
                            : entry.level === 'warn'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-sky-500/10 text-sky-600'
                        }`}
                      >
                        {entry.level.toUpperCase()}
                      </span>
                      <span>{entry.source}</span>
                      {entry.eventId !== null ? <span>#{entry.eventId}</span> : null}
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                      {entry.message || 'Sem mensagem disponível.'}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground">
                  Nenhum evento do Windows foi retornado neste ambiente.
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-lg font-semibold">Linha consolidada</h2>
            <p className="text-sm text-muted-foreground">
              Visualização rápida das últimas linhas capturadas em todas as fontes locais.
            </p>
          </div>
          <div className="max-h-[32rem] overflow-auto p-5">
            {recentFileEntries.length > 0 ? (
              <div className="space-y-2">
                {recentFileEntries.map((entry, index) => (
                  <div key={`${entry.sourceId}-${entry.index}-${index}`} className="rounded-lg border border-border/60 bg-background/60 px-4 py-2">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{entry.sourceLabel}</span>
                      {entry.timestamp ? <span>{entry.timestamp}</span> : null}
                    </div>
                    <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground/90">
                      {entry.line}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Nenhuma linha de log encontrada.</div>
            )}
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-950 dark:text-amber-100">
          Esta tela mostra os arquivos de log locais do AppGPP e os eventos do Windows disponíveis na máquina.
        </div>
      </div>
    </div>
  );
}
