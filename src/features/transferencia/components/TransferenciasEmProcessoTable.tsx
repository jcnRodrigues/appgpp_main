'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TableEmptyState } from './TableEmptyState';

type StatusFiltro = 'ABERTO' | 'FECHADO';

type ProcessoTransferencia = {
  codigoTransferencia: string;
  mesTransferencia: number | null;
  anoTransferencia: number | null;
  contadorTransferencia: number | null;
  statusTransferencia: StatusFiltro;
  totalItens: number;
  itensPendentes: number;
  itensConcluidos: number;
  centroAtual: string;
  dataInicioTransferencia: string | null;
  dataFechamento: string | null;
  updatedAt: string | null;
};

const ITENS_POR_PAGINA = 10;

function formatarData(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
}

function formatarDataHora(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(d);
}

function StatusBadge({ status }: { status: StatusFiltro }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${status === 'ABERTO' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
      {status}
    </span>
  );
}

function Paginacao({
  paginaAtual,
  totalPaginas,
  totalItens,
  onIrParaPagina
}: {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  onIrParaPagina: (pagina: number) => void;
}) {
  if (totalItens === 0) return null;
  const paginaInicial = Math.max(1, paginaAtual - 2);
  const paginaFinal = Math.min(totalPaginas, paginaAtual + 2);
  const paginas = Array.from({ length: paginaFinal - paginaInicial + 1 }, (_, i) => paginaInicial + i);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
      <p className="text-xs text-slate-500">
        Página {paginaAtual} de {totalPaginas} | {totalItens} processos
      </p>
      <div className="flex items-center gap-1">
        <button type="button" className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-40" onClick={() => onIrParaPagina(Math.max(1, paginaAtual - 1))} disabled={paginaAtual <= 1}>
          Anterior
        </button>
        {paginas.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={`rounded-md border px-3 py-1.5 text-xs ${pagina === paginaAtual ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
            onClick={() => onIrParaPagina(pagina)}
          >
            {pagina}
          </button>
        ))}
        <button type="button" className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-40" onClick={() => onIrParaPagina(Math.min(totalPaginas, paginaAtual + 1))} disabled={paginaAtual >= totalPaginas}>
          Próxima
        </button>
      </div>
    </div>
  );
}

export default function TransferenciasEmProcessoTable() {
  const router = useRouter();
  const [itens, setItens] = useState<ProcessoTransferencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('ABERTO');
  const [codigoBusca, setCodigoBusca] = useState('');
  const [paginaFiltrada, setPaginaFiltrada] = useState(1);
  const [paginaTodos, setPaginaTodos] = useState(1);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const [resAbertos, resFechados] = await Promise.all([
        fetch('/api/patrimonio/transferencia/processos?status=ABERTO'),
        fetch('/api/patrimonio/transferencia/processos?status=FECHADO')
      ]);
      const dadosAbertos = await resAbertos.json().catch(() => ({ data: [] }));
      const dadosFechados = await resFechados.json().catch(() => ({ data: [] }));
      setItens([...(Array.isArray(dadosAbertos.data) ? dadosAbertos.data : []), ...(Array.isArray(dadosFechados.data) ? dadosFechados.data : [])]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const termo = codigoBusca.trim().toLowerCase();
    return itens.filter((item) => {
      if (statusFiltro && item.statusTransferencia !== statusFiltro) return false;
      if (termo && !item.codigoTransferencia.toLowerCase().includes(termo)) return false;
      return true;
    });
  }, [codigoBusca, itens, statusFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA));
  const paginaAtual = statusFiltro === 'ABERTO' ? Math.min(paginaFiltrada, totalPaginas) : Math.min(paginaTodos, totalPaginas);
  const paginaSet = statusFiltro === 'ABERTO' ? setPaginaFiltrada : setPaginaTodos;
  const visiveis = filtrados.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-700/60 bg-slate-950/55 p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm text-slate-300">Filtro por status</p>
            <p className="text-xs text-slate-400">Escolha entre transferências abertas ou fechadas.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={`rounded-lg border px-3 py-2 text-sm ${statusFiltro === 'ABERTO' ? 'border-emerald-600 text-emerald-400' : 'border-slate-700 text-slate-300'}`} onClick={() => setStatusFiltro('ABERTO')}>
              Abertas
            </button>
            <button type="button" className={`rounded-lg border px-3 py-2 text-sm ${statusFiltro === 'FECHADO' ? 'border-emerald-600 text-emerald-400' : 'border-slate-700 text-slate-300'}`} onClick={() => setStatusFiltro('FECHADO')}>
              Fechadas
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            value={codigoBusca}
            onChange={(e) => setCodigoBusca(e.target.value)}
            placeholder="Buscar por código TRF..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
          />
          <button type="button" onClick={carregar} className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-sm">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="px-2 py-2 text-left text-[11px] font-semibold text-slate-300">Transferência</th>
                <th className="px-2 py-2 text-left text-[11px] font-semibold text-slate-300">Status</th>
                <th className="px-2 py-2 text-left text-[11px] font-semibold text-slate-300">Itens</th>
                <th className="px-2 py-2 text-left text-[11px] font-semibold text-slate-300">Período</th>
                <th className="px-2 py-2 text-left text-[11px] font-semibold text-slate-300">Atualização</th>
                <th className="px-2 py-2 text-left text-[11px] font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.length === 0 ? (
                <TableEmptyState colSpan={6} title="Nenhuma transferência encontrada" description="Ajuste os filtros ou inicie um novo processo." loading={loading} />
              ) : visiveis.map((processo) => (
                <tr key={processo.codigoTransferencia} className="border-b border-slate-800">
                  <td className="px-2 py-2 text-[11px] font-medium text-slate-200">{processo.codigoTransferencia}</td>
                  <td className="px-2 py-2 text-[11px]"><StatusBadge status={processo.statusTransferencia} /></td>
                  <td className="px-2 py-2 text-[11px] text-slate-300">{processo.totalItens} total<br />{processo.itensPendentes} pendentes | {processo.itensConcluidos} concluídos</td>
                  <td className="px-2 py-2 text-[11px] text-slate-300">{formatarData(processo.dataInicioTransferencia)} até {formatarData(processo.dataFechamento)}</td>
                  <td className="px-2 py-2 text-[11px] text-slate-300">{formatarDataHora(processo.updatedAt)}</td>
                  <td className="px-2 py-2">
                    <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] text-emerald-400" onClick={() => router.push(`/patrimoniolist/transferencia-custo?codigo=${encodeURIComponent(processo.codigoTransferencia)}`)}>
                      <FolderOpen className="h-3.5 w-3.5" />
                      Abrir lista
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} totalItens={filtrados.length} onIrParaPagina={paginaSet} />
      </div>
    </div>
  );
}
