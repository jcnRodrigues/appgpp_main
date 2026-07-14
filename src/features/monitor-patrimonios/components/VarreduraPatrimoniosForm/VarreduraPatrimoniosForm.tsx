'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Radar, RefreshCw, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TableState from '@/components/TableState/TableState';
import { notify as showNotify } from '@/lib/notify';
import { normalizeStatusText } from '@/lib/status';

type PatrimonioEncontrado = {
  idP: string;
  idPat: string;
  descricaoPat: string;
  licencaPat: string | null;
  statusPat: string | null;
  centroCusto: string | null;
  agenteInstalado: boolean;
  agenteColetadoEm: string | null;
  statusRede: 'ONLINE' | 'OFFLINE';
  encontrouNaRede: boolean;
  matchBy: 'SERIAL' | 'HOSTNAME' | 'NOME' | 'DESCRICAO';
  matchValue: string;
  origemEncontrada: string | null;
  sourceType: 'DEVICE' | 'CLIENT' | null;
  deviceName: string | null;
  deviceHostname: string | null;
  deviceSerial: string | null;
  deviceIp: string | null;
  siteName: string | null;
};

type ScanResponse = {
  modoConsulta?: string;
  resumo?: {
    totalPatrimoniosBase: number;
    totalPatrimoniosPermitidos?: number;
    totalEncontrados: number;
    totalOnline?: number;
    totalOffline?: number;
    totalComAgente?: number;
    totalSemAgente?: number;
    totalDevices: number;
    totalClients: number;
  };
  patrimonios?: PatrimonioEncontrado[];
};

function getStatusBadgeClass(status?: string | null) {
  const normalizado = normalizeStatusText(status);
  if (normalizado === 'ONLINE') return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30';
  if (normalizado === 'OFFLINE') return 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/25';
  if (normalizado === 'ATIVO') return 'bg-green-100 text-green-800';
  if (normalizado === 'DEVOLUCAO') return 'bg-red-100 text-red-800';
  if (normalizado === 'INATIVO') return 'bg-orange-100 text-orange-800';
  if (normalizado === 'MANUTENCAO') return 'bg-purple-100 text-purple-800';
  if (normalizado === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

function formatText(value?: string | null) {
  const texto = String(value || '').trim();
  return texto || '-';
}

export default function VarreduraPatrimoniosForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<ScanResponse | null>(null);
  const [filtroStatusRede, setFiltroStatusRede] = useState<'TODOS' | 'ONLINE' | 'OFFLINE'>('TODOS');
  const [filtroAgente, setFiltroAgente] = useState<'TODOS' | 'COM_AGENTE' | 'SEM_AGENTE'>('TODOS');

  const carregar = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/monitor-patrimonios/agente/varredura?modo=REDE', {
        cache: 'no-store'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || payload.message || 'Não foi possível executar a varredura.');
      }

      setData(payload as ScanResponse);
      showNotify('sucesso', 'Varredura concluída com sucesso.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível executar a varredura.';
      setError(message);
      setData(null);
      showNotify('erro', message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const patrimonios = data?.patrimonios || [];
  const resumo = data?.resumo;
  const patrimoniosFiltrados = patrimonios.filter((item) => {
    if (filtroStatusRede === 'ONLINE' && item.statusRede !== 'ONLINE') return false;
    if (filtroStatusRede === 'OFFLINE' && item.statusRede !== 'OFFLINE') return false;
    if (filtroAgente === 'COM_AGENTE') return item.agenteInstalado;
    if (filtroAgente === 'SEM_AGENTE') return !item.agenteInstalado;
    return true;
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Varredura em toda a rede</p>
            <h2 className="mt-2 text-2xl font-semibold">Patrimônios encontrados</h2>
            <p className="mt-2 text-sm text-slate-300">
              Esta lista mostra apenas os patrimônios localizados na UniFi durante a varredura. Use a ação ao lado para abrir a busca específica do item.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void carregar()}
              disabled={loading}
              variant="ghost"
              className="gap-2 border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              {loading ? 'Varredura...' : 'Nova varredura'}
            </Button>
            <Button asChild variant="ghost" className="gap-2 border border-cyan-300/30 bg-cyan-500/10 text-cyan-50 hover:bg-cyan-500/20">
              <Link href="/monitor-patrimonios/agente">
                <SearchCheck className="h-4 w-4" />
                Agente normal
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setFiltroStatusRede('TODOS')}
            className={`rounded-xl border p-4 text-left transition ${
              filtroStatusRede === 'TODOS'
                ? 'border-cyan-300/40 bg-cyan-500/15 text-cyan-50 shadow-sm'
                : 'border-cyan-900/40 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-950/45'
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-cyan-200/80">Todos</p>
            <p className="mt-1 text-2xl font-semibold">{patrimonios.length}</p>
          </button>

          <button
            type="button"
            onClick={() => setFiltroStatusRede('ONLINE')}
            className={`rounded-xl border p-4 text-left transition ${
              filtroStatusRede === 'ONLINE'
                ? 'border-emerald-300/40 bg-emerald-500/15 text-emerald-50 shadow-sm'
                : 'border-emerald-900/40 bg-emerald-950/30 text-emerald-100 hover:bg-emerald-950/45'
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-emerald-200/80">Online</p>
            <p className="mt-1 text-2xl font-semibold">{resumo?.totalOnline ?? 0}</p>
          </button>

          <button
            type="button"
            onClick={() => setFiltroStatusRede('OFFLINE')}
            className={`rounded-xl border p-4 text-left transition ${
              filtroStatusRede === 'OFFLINE'
                ? 'border-red-300/40 bg-red-500/15 text-red-50 shadow-sm'
                : 'border-red-900/40 bg-red-950/30 text-red-100 hover:bg-red-950/45'
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-red-200/80">Offline</p>
            <p className="mt-1 text-2xl font-semibold">{resumo?.totalOffline ?? 0}</p>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { key: 'COM_AGENTE', label: 'Com agente', count: resumo?.totalComAgente ?? patrimonios.filter((item) => item.agenteInstalado).length },
            { key: 'SEM_AGENTE', label: 'Sem agente', count: resumo?.totalSemAgente ?? patrimonios.filter((item) => !item.agenteInstalado).length }
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFiltroAgente(item.key as typeof filtroAgente)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filtroAgente === item.key
                  ? 'border-cyan-300/40 bg-cyan-500/15 text-cyan-100'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Erro na varredura
            </div>
            <p className="mt-1">{error}</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">Patrimônios da varredura</h3>
        </div>

        {loading && patrimonios.length === 0 ? (
          <div className="mt-4">
            <TableState
              icon={Radar}
              title="Executando varredura"
              description="Aguarde enquanto a rede é consultada e os patrimônios encontrados são carregados."
              compact
            />
          </div>
        ) : patrimoniosFiltrados.length === 0 ? (
          <div className="mt-4">
            <TableState
              icon={Radar}
              title="Nenhum patrimônio encontrado"
              description={
                filtroAgente === 'COM_AGENTE'
                  ? 'Nenhum patrimônio com agente instalado foi encontrado nesta varredura.'
                  : filtroAgente === 'SEM_AGENTE'
                    ? 'Nenhum patrimônio sem agente foi encontrado nesta varredura.'
                    : 'A varredura terminou, mas nenhum patrimônio foi associado à rede consultada.'
              }
              compact
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800/80 shadow-sm">
            <table className="min-w-[1100px] w-full border-collapse text-sm">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-left text-xs uppercase tracking-wide text-white">
                <tr>
                  <th className="px-3 py-2.5">Patrimônio</th>
                  <th className="px-3 py-2.5">Descrição</th>
                  <th className="px-3 py-2.5">Licença / Serial</th>
                  <th className="px-3 py-2.5">Origem</th>
                  <th className="px-3 py-2.5">Local</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Ação</th>
                </tr>
              </thead>
              <tbody>
                {patrimoniosFiltrados.map((item) => (
                  <tr
                    key={item.idP}
                    className={`border-b border-slate-800/70 text-slate-100 transition-colors hover:bg-slate-800/50 ${
                      item.agenteInstalado
                        ? 'bg-slate-950/30'
                        : 'bg-amber-950/20 ring-1 ring-inset ring-amber-400/15 hover:bg-amber-950/30'
                    }`}
                  >
                    <td className="px-3 py-3 font-semibold text-slate-50">{item.idPat}</td>
                    <td className="px-3 py-3 text-slate-200">{item.descricaoPat}</td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-slate-100">{formatText(item.licencaPat)}</div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        Encontrado por {item.matchBy.toLowerCase()} {item.matchValue ? `· ${item.matchValue}` : ''}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-100">{item.origemEncontrada}</div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            item.agenteInstalado
                              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30'
                              : 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/25'
                          }`}
                        >
                          {item.agenteInstalado ? 'Agente instalado' : 'Sem agente'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(item.statusRede)}`}
                        >
                          {item.statusRede}
                        </span>
                      </div>
                      {!item.agenteInstalado && (
                        <div className="mt-2 text-[11px] text-amber-200">
                          Este patrimônio ainda não tem inventário salvo do agente.
                        </div>
                      )}
                      <div className="mt-1 text-[11px] text-slate-400">
                        {item.sourceType}
                        {item.deviceName ? ` · ${item.deviceName}` : ''}
                      </div>
                      {item.agenteColetadoEm && (
                        <div className="mt-1 text-[11px] text-slate-400">
                          Coletado em {new Date(item.agenteColetadoEm).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-slate-100">{formatText(item.centroCusto)}</div>
                      <div className="mt-1 text-[11px] text-slate-400">{formatText(item.siteName)}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(item.statusPat)}`}>
                        {formatText(item.statusPat)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Button asChild size="sm" className="gap-2 bg-slate-950 text-white hover:bg-slate-800">
                        <Link href={`/monitor-patrimonios/agente?hostname=${encodeURIComponent(`PAT${item.idPat}`)}`}>
                          <SearchCheck className="h-4 w-4" />
                          Buscar específico
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
