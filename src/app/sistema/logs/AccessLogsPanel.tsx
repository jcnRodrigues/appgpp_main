"use client";

import { Button } from '@/components/ui/button';
import type { AccessLogEntry, AccessLogStatusFilter } from '@/features/system-logs/server/access-logs.service';
import { Download, Filter, FilterX, LogIn, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';

type AccessLogsPanelProps = {
  entries: AccessLogEntry[];
};

function buildExportHref(status: AccessLogStatusFilter) {
  const params = new URLSearchParams();
  if (status !== 'ALL') {
    params.set('status', status);
  }
  params.set('format', 'csv');
  const query = params.toString();
  return query ? `/api/sistema/logs/acesso/export?${query}` : '/api/sistema/logs/acesso/export?format=csv';
}

function filterAccessLogs(entries: AccessLogEntry[], status: AccessLogStatusFilter) {
  if (status === 'ALL') return entries;
  return entries.filter((entry) => entry.status === status);
}

export default function AccessLogsPanel({ entries }: AccessLogsPanelProps) {
  const [statusFilter, setStatusFilter] = useState<AccessLogStatusFilter>('ALL');

  const filteredEntries = useMemo(
    () => filterAccessLogs(entries, statusFilter),
    [entries, statusFilter]
  );

  const exportHref = buildExportHref(statusFilter);

  const entradas = entries.filter((entry) => entry.action === 'SIGN_IN').length;
  const saidas = entries.filter((entry) => entry.action === 'SIGN_OUT').length;
  const falhas = entries.filter((entry) => entry.status === 'FAILED').length;

  return (
    <section className="mb-6 rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Logs de acesso</h2>
            <p className="text-sm text-muted-foreground">
              Registros de entrada e saida dos usuarios autenticados no AppGPP.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={statusFilter === 'ALL' ? 'default' : 'outline'}
              className="shadow-sm"
              onClick={() => setStatusFilter('ALL')}
            >
              <Filter className="h-4 w-4" />
              Todos
            </Button>
            <Button
              type="button"
              variant={statusFilter === 'SUCCESS' ? 'default' : 'outline'}
              className="shadow-sm"
              onClick={() => setStatusFilter('SUCCESS')}
            >
              <LogIn className="h-4 w-4" />
              Sucesso
            </Button>
            <Button
              type="button"
              variant={statusFilter === 'FAILED' ? 'default' : 'outline'}
              className="shadow-sm"
              onClick={() => setStatusFilter('FAILED')}
            >
              <LogOut className="h-4 w-4" />
              Falhas
            </Button>
            <Button asChild variant="outline" className="shadow-sm">
              <a href={exportHref} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                Exportar CSV
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="shadow-sm"
              onClick={() => setStatusFilter('ALL')}
              title="Limpar filtro"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-b border-border/60 p-5 md:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Entradas</p>
          <p className="text-xl font-semibold">{entradas}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Saidas</p>
          <p className="text-xl font-semibold">{saidas}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Falhas</p>
          <p className="text-xl font-semibold">{falhas}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Exibindo</p>
          <p className="text-xl font-semibold">{filteredEntries.length}</p>
        </div>
      </div>

      <div className="grid gap-4 border-b border-border/60 px-5 pb-5 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Filtro atual</p>
          <p className="text-xl font-semibold">
            {statusFilter === 'ALL' ? 'Todos' : statusFilter === 'SUCCESS' ? 'Sucesso' : 'Falhas'}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Último registro</p>
          <p className="text-sm font-medium text-foreground">
            {filteredEntries[0]
              ? `${new Date(filteredEntries[0].timestamp).toLocaleString('pt-BR')} - ${filteredEntries[0].name || filteredEntries[0].email || 'Usuário'}`
              : 'Sem registros'}
          </p>
        </div>
      </div>

      <div className="max-h-[22rem] overflow-auto p-5">
        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <article
                key={`${entry.timestamp}-${entry.email || 'sem-email'}-${index}`}
                className="rounded-xl border border-border/60 bg-background/60 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {new Date(entry.timestamp).toLocaleString('pt-BR')}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      entry.action === 'SIGN_IN'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-slate-500/10 text-slate-600'
                    }`}
                  >
                    {entry.action === 'SIGN_IN' ? 'ENTRADA' : 'SAIDA'}
                  </span>
                  <span>{entry.provider}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      entry.status === 'SUCCESS'
                        ? 'bg-sky-500/10 text-sky-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {entry.name || entry.email || 'Usuario desconhecido'}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {entry.email ? <span>{entry.email}</span> : null}
                  {entry.machine ? <span>Máquina: {entry.machine}</span> : null}
                  {entry.ip ? <span>IP: {entry.ip}</span> : null}
                  {entry.browser ? <span>Browser: {entry.browser}</span> : null}
                  {entry.origin ? <span>Origem: {entry.origin}</span> : null}
                </div>
                {entry.details ? <p className="mt-1 text-xs text-muted-foreground">{entry.details}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground">
            Nenhum log de acesso encontrado para o filtro selecionado.
          </div>
        )}
      </div>
    </section>
  );
}
