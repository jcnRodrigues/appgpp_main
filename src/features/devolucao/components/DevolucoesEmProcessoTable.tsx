'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderOpen, RefreshCw, ScanSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TableEmptyState } from './TableEmptyState';

type StatusFiltro = 'ABERTO' | 'FECHADO';

type ProcessoDevolucao = {
  codigoDevolucao: string;
  mesDevolucao: number | null;
  anoDevolucao: number | null;
  contadorDevolucao: number | null;
  statusDevolucao: StatusFiltro;
  totalItens: number;
  itensAbertos: number;
  itensFechados: number;
  centroCustoCodigo: string;
  centroCustoDescricao: string;
  dataInicioDevolucao: string | null;
  dataFimDevolucao: string | null;
  updatedAt: string | null;
};

const ITENS_POR_PAGINA_PADRAO = 10;

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
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${status === 'ABERTO'
          ? 'border border-emerald-200 bg-emerald-100 text-emerald-800 shadow-sm'
          : 'border border-rose-200 bg-rose-100 text-rose-800 shadow-sm'
        }`}
    >
      {status}
    </span>
  );
}

function montarPaginasVisiveis(paginaAtual: number, totalPaginas: number) {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, index) => index + 1);
  }

  const paginas = new Set<number>([1, totalPaginas, paginaAtual]);

  if (paginaAtual <= 4) {
    [2, 3, 4, 5].forEach((p) => paginas.add(p));
  } else if (paginaAtual >= totalPaginas - 3) {
    [totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1].forEach((p) => paginas.add(p));
  } else {
    [paginaAtual - 1, paginaAtual + 1].forEach((p) => paginas.add(p));
  }

  return Array.from(paginas)
    .filter((p) => p >= 1 && p <= totalPaginas)
    .sort((a, b) => a - b);
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

  const paginasVisiveis = montarPaginasVisiveis(paginaAtual, totalPaginas);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
      <p className="text-xs text-gray-500">
        Página {paginaAtual} de {totalPaginas} | {totalItens} processo{totalItens === 1 ? '' : 's'}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => onIrParaPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          Anterior
        </button>
        {paginasVisiveis.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={`rounded-lg border px-3 py-2 text-sm transition ${paginaAtual === pagina
                ? 'border-green-600 bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            onClick={() => onIrParaPagina(pagina)}
          >
            {pagina}
          </button>
        ))}
        <button
          type="button"
          className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => onIrParaPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

function TabelaProcessos({
  itens,
  loading,
  emptyMessage,
  onAbrir,
  paginaAtual,
  totalPaginas,
  totalItens,
  onIrParaPagina
}: {
  itens: ProcessoDevolucao[];
  loading: boolean;
  emptyMessage: string;
  onAbrir?: (processo: ProcessoDevolucao) => void;
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  onIrParaPagina: (pagina: number) => void;
}) {
  return (
    <div className="table-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Devolução</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Centro de Custo</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Status</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Itens</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Período</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Atualização</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <TableEmptyState
                colSpan={7}
                title="Nenhuma devolução encontrada"
                description={emptyMessage}
                loading={loading}
              />
            ) : (
              itens.map((processo) => (
                <tr key={processo.codigoDevolucao} className="border-b transition">
                  <td className="px-2 py-2 text-[11px] font-medium">{processo.codigoDevolucao}</td>
                  <td className="px-2 py-2 text-[11px]">
                    <div>
                      {processo.centroCustoCodigo ? `${processo.centroCustoCodigo} - ` : ''}
                      {processo.centroCustoDescricao}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-[11px]">
                    <StatusBadge status={processo.statusDevolucao} />
                    {processo.statusDevolucao === 'FECHADO' ? (
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                        Processo fechado
                      </div>
                    ) : null}
                  </td>
                  <td className="px-2 py-2 text-[11px]">
                    <div>{processo.totalItens} total</div>
                    <div className="text-muted-foreground">
                      {processo.itensAbertos} abertos | {processo.itensFechados} fechados
                    </div>
                  </td>
                  <td className="px-2 py-2 text-[11px]">
                    {formatarData(processo.dataInicioDevolucao)} até {formatarData(processo.dataFimDevolucao)}
                  </td>
                  <td className="px-2 py-2 text-[11px]">{formatarDataHora(processo.updatedAt)}</td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] text-foreground transition hover:bg-secondary"
                      onClick={() => onAbrir?.(processo)}
                      title="Abrir processo"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      Abrir lista
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        totalItens={totalItens}
        onIrParaPagina={onIrParaPagina}
      />
    </div>
  );
}

export default function DevolucoesEmProcessoTable() {
  const router = useRouter();
  const [itens, setItens] = useState<ProcessoDevolucao[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [processoSelecionadoId, setProcessoSelecionadoId] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('ABERTO');
  const [codigoBusca, setCodigoBusca] = useState('');
  const [paginaFiltrada, setPaginaFiltrada] = useState(1);
  const [paginaTodos, setPaginaTodos] = useState(1);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [resAbertos, resFechados] = await Promise.all([
        fetch('/api/patrimonio/devolucao/processos?status=ABERTO'),
        fetch('/api/patrimonio/devolucao/processos?status=FECHADO')
      ]);

      const dataAbertos = await resAbertos.json();
      const dataFechados = await resFechados.json();

      if (!resAbertos.ok) {
        throw new Error(dataAbertos.message || 'Falha ao carregar devoluções abertas.');
      }
      if (!resFechados.ok) {
        throw new Error(dataFechados.message || 'Falha ao carregar devoluções fechadas.');
      }

      const lista = [...(dataAbertos.data || []), ...(dataFechados.data || [])] as ProcessoDevolucao[];
      lista.sort((a, b) => {
        const dataA = new Date(b.updatedAt || b.dataInicioDevolucao || '').getTime();
        const dataB = new Date(a.updatedAt || a.dataInicioDevolucao || '').getTime();
        return dataA - dataB;
      });
      setItens(lista);
      setProcessoSelecionadoId((current) => {
        if (!current && lista.length > 0) return lista[0].codigoDevolucao;
        if (current && !lista.some((x) => x.codigoDevolucao === current)) {
          return lista[0]?.codigoDevolucao || '';
        }
        return current;
      });
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao carregar devoluções.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'ABERTO' || status === 'FECHADO') {
      setStatusFiltro(status);
    }
  }, []);

  const itensFiltrados = useMemo(
    () => itens.filter((processo) => processo.statusDevolucao === statusFiltro),
    [itens, statusFiltro]
  );

  const codigoBuscaNormalizado = codigoBusca.trim().toUpperCase();

  const itensFiltradosPorCodigo = useMemo(() => {
    if (!codigoBuscaNormalizado) return itensFiltrados;

    return itensFiltrados.filter((processo) => processo.codigoDevolucao.toUpperCase().includes(codigoBuscaNormalizado));
  }, [codigoBuscaNormalizado, itensFiltrados]);

  const totalDevolucoes = useMemo(
    () => itens.reduce((acc, processo) => acc + (processo.totalItens || 0), 0),
    [itens]
  );

  const totalFiltradoDevolucoes = useMemo(
    () => itensFiltradosPorCodigo.reduce((acc, processo) => acc + (processo.totalItens || 0), 0),
    [itensFiltradosPorCodigo]
  );

  const totalPaginasFiltrados = Math.max(1, Math.ceil(itensFiltradosPorCodigo.length / ITENS_POR_PAGINA_PADRAO));
  const paginaFiltradaValida = Math.min(Math.max(paginaFiltrada, 1), totalPaginasFiltrados);
  const itensFiltradosPaginados = useMemo(() => {
    const inicio = itensFiltradosPorCodigo.length === 0 ? 0 : (paginaFiltradaValida - 1) * ITENS_POR_PAGINA_PADRAO;
    return itensFiltradosPorCodigo.slice(inicio, inicio + ITENS_POR_PAGINA_PADRAO);
  }, [itensFiltradosPorCodigo, paginaFiltradaValida]);

  const totalPaginasTodos = Math.max(1, Math.ceil(itens.length / ITENS_POR_PAGINA_PADRAO));
  const paginaTodosValida = Math.min(Math.max(paginaTodos, 1), totalPaginasTodos);
  const itensTodosPaginados = useMemo(() => {
    const inicio = itens.length === 0 ? 0 : (paginaTodosValida - 1) * ITENS_POR_PAGINA_PADRAO;
    return itens.slice(inicio, inicio + ITENS_POR_PAGINA_PADRAO);
  }, [itens, paginaTodosValida]);

  useEffect(() => {
    setProcessoSelecionadoId((current) => {
      if (current && itensFiltradosPorCodigo.some((processo) => processo.codigoDevolucao === current)) {
        return current;
      }
      return itensFiltradosPorCodigo[0]?.codigoDevolucao || '';
    });
  }, [itensFiltradosPorCodigo]);

  useEffect(() => {
    setPaginaFiltrada(1);
  }, [statusFiltro, codigoBuscaNormalizado]);

  useEffect(() => {
    if (paginaFiltrada > totalPaginasFiltrados) {
      setPaginaFiltrada(totalPaginasFiltrados);
    }
  }, [paginaFiltrada, totalPaginasFiltrados]);

  useEffect(() => {
    if (paginaTodos > totalPaginasTodos) {
      setPaginaTodos(totalPaginasTodos);
    }
  }, [paginaTodos, totalPaginasTodos]);

  const processoSelecionado = useMemo(
    () => itens.find((x) => x.codigoDevolucao === processoSelecionadoId) || null,
    [itens, processoSelecionadoId]
  );

  const abrirLista = (processo: ProcessoDevolucao) => {
    router.push(`/patrimoniolist/lista-devolucao?codigo=${encodeURIComponent(processo.codigoDevolucao)}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Filtro por status</p>
            <p className="mt-1 text-xs text-gray-500">Escolha entre devoluções abertas ou fechadas.</p>
          </div>
          <div className="flex items-center gap-2">
            {(['ABERTO', 'FECHADO'] as StatusFiltro[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFiltro(status)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${statusFiltro === status
                    ? 'border bg-white text-green-700 hover:bg-green-100'
                    : 'bg-white text-gray-700 border hover:bg-gray-100'
                  }`}
              >
                {status === 'ABERTO' ? 'Abertas' : 'Fechadas'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            {itensFiltradosPorCodigo.length} processo{itensFiltradosPorCodigo.length === 1 ? '' : 's'} | {totalFiltradoDevolucoes} devolução{totalFiltradoDevolucoes === 1 ? '' : 'ões'} vinculada{totalFiltradoDevolucoes === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            className="rounded-lg p-2 text-green-700 transition hover:bg-green-100 disabled:pointer-events-none disabled:opacity-50"
            onClick={() => void carregar()}
            title="Atualizar"
            aria-label="Atualizar"
          >
            <RefreshCw className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-2 space-y-2">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <input
              type="text"
              className="min-w-0 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Buscar por código DEV..."
              value={codigoBusca}
              onChange={(e) => setCodigoBusca(e.target.value.toUpperCase())}
            />
            <div className="flex gap-2">
              <select
                className="min-w-0 w-full rounded-lg border px-3 py-2 text-sm"
                value={processoSelecionadoId}
                onChange={(e) => setProcessoSelecionadoId(e.target.value)}
              >
                <option value="">{loading ? 'Carregando devoluções...' : 'Selecione um processo filtrado'}</option>
                {itensFiltradosPorCodigo.map((processo) => (
                  <option key={processo.codigoDevolucao} value={processo.codigoDevolucao}>
                    {processo.codigoDevolucao} | {formatarData(processo.dataInicioDevolucao)} até {formatarData(processo.dataFimDevolucao)} | {processo.statusDevolucao}
                  </option>
                ))}
              </select>
              {codigoBusca ? (
                <button
                  type="button"
                  className="shrink-0 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setCodigoBusca('')}
                >
                  Limpar
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {processoSelecionado ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-green-700 transition hover:bg-green-50"
              onClick={() => abrirLista(processoSelecionado)}
            >
              <ScanSearch className="h-4 w-4" />
              Abrir lista
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Devoluções filtradas</h2>
          <span className="text-xs text-gray-500">
            {statusFiltro === 'ABERTO' ? 'Somente abertas' : 'Somente fechadas'} | {totalFiltradoDevolucoes} itens
          </span>
        </div>
        {erro && <div className="mb-3 text-sm text-red-600">{erro}</div>}
        <TabelaProcessos
          itens={itensFiltradosPaginados}
          loading={loading}
          emptyMessage={`Nenhuma devolução ${statusFiltro === 'ABERTO' ? 'aberta' : 'fechada'} encontrada.`}
          onAbrir={abrirLista}
          paginaAtual={paginaFiltradaValida}
          totalPaginas={totalPaginasFiltrados}
          totalItens={itensFiltradosPorCodigo.length}
          onIrParaPagina={setPaginaFiltrada}
        />
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Todas as devoluções</h2>
          <span className="text-xs text-gray-500">{itens.length} processos | {totalDevolucoes} devoluções vinculadas</span>
        </div>
        <TabelaProcessos
          itens={itensTodosPaginados}
          loading={loading}
          emptyMessage="Nenhuma devolução encontrada."
          onAbrir={abrirLista}
          paginaAtual={paginaTodosValida}
          totalPaginas={totalPaginasTodos}
          totalItens={itens.length}
          onIrParaPagina={setPaginaTodos}
        />
      </div>
    </div>
  );
}


