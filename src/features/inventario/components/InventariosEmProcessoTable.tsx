'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderOpen, RefreshCw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TableEmptyState } from '@/features/inventario/components/TableEmptyState';
import type { InventarioProcesso } from '@/features/inventario/types';
import { formatarData, formatarDataHora } from '@/features/inventario/utils';
import { hasModuleActionPermission } from '@/lib/permissions';

type StatusFiltro = 'ABERTO' | 'FECHADO';

const ITENS_POR_PAGINA = 10;

function StatusBadge({ status }: { status: InventarioProcesso['statusInventario'] }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
        status === 'ABERTO' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
      }`}
    >
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

  const paginasVisiveis: number[] = [];
  const inicio = Math.max(1, paginaAtual - 2);
  const fim = Math.min(totalPaginas, paginaAtual + 2);
  for (let i = inicio; i <= fim; i += 1) paginasVisiveis.push(i);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-slate-500">
        Página {paginaAtual} de {totalPaginas} | {totalItens} inventários
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-40"
          onClick={() => onIrParaPagina(Math.max(1, paginaAtual - 1))}
          disabled={paginaAtual <= 1}
        >
          Anterior
        </button>
        {inicio > 1 && <span className="px-1 text-slate-400">...</span>}
        {paginasVisiveis.map((pagina) => (
          <button
            key={pagina}
            type="button"
            className={`rounded-md border px-3 py-1.5 text-xs ${
              pagina === paginaAtual ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
            }`}
            onClick={() => onIrParaPagina(pagina)}
          >
            {pagina}
          </button>
        ))}
        {fim < totalPaginas && <span className="px-1 text-slate-400">...</span>}
        <button
          type="button"
          className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-40"
          onClick={() => onIrParaPagina(Math.min(totalPaginas, paginaAtual + 1))}
          disabled={paginaAtual >= totalPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

function TabelaInventarios({
  itens,
  loading,
  emptyMessage,
  paginaAtual,
  totalPaginas,
  totalItens,
  onIrParaPagina,
  onAbrir,
  canPrint
}: {
  itens: InventarioProcesso[];
  loading: boolean;
  emptyMessage: string;
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  onIrParaPagina: (pagina: number) => void;
  onAbrir?: (item: InventarioProcesso) => void;
  canPrint: boolean;
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Inventário</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Centro de Custo</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Responsável</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Status</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Itens</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Data</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Atualização</th>
              <th className="px-2 py-2 text-left text-[11px] font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 ? (
              <TableEmptyState
                colSpan={8}
                title="Nenhum inventário encontrado"
                description={emptyMessage}
                loading={loading}
              />
            ) : (
              itens.map((inventario) => (
                <tr key={inventario.codigoInventario} className="border-b">
                  <td className="px-2 py-2 text-xs font-medium">{inventario.codigoInventario}</td>
                  <td className="px-2 py-2 text-xs">
                    {(inventario.codigoCCusto ? `${inventario.codigoCCusto} - ` : '') + (inventario.descricaoCCusto || 'Sem descrição')}
                  </td>
                  <td className="px-2 py-2 text-xs">
                    {inventario.responsavelInventario || '-'}
                    {inventario.localInventario ? <div className="mt-1 text-[10px] text-slate-500">{inventario.localInventario}</div> : null}
                  </td>
                  <td className="px-2 py-2 text-xs">
                    <StatusBadge status={inventario.statusInventario} />
                  </td>
                  <td className="px-2 py-2 text-xs">
                    <div>{inventario.totalItens} total</div>
                    <div className="text-[10px] text-slate-500">
                      {inventario.conferidos} conferidos | {inventario.divergentes} divergentes | {inventario.naoEncontrados} não encontrados | {inventario.avariados} avariados
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs">
                    {formatarData(inventario.dataInventario)}
                    {inventario.dataFechamento ? <div className="mt-1 text-[10px] text-slate-500">até {formatarData(inventario.dataFechamento)}</div> : null}
                  </td>
                  <td className="px-2 py-2 text-xs">{formatarDataHora(inventario.updatedAt)}</td>
                  <td className="px-2 py-2">
                    {canPrint ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 text-xs text-emerald-700 transition hover:bg-emerald-50"
                        onClick={() => onAbrir?.(inventario)}
                      >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Abrir inventário
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} totalItens={totalItens} onIrParaPagina={onIrParaPagina} />
    </div>
  );
}

export default function InventariosEmProcessoTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const [itens, setItens] = useState<InventarioProcesso[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('ABERTO');
  const [codigoBusca, setCodigoBusca] = useState('');
  const [inventarioSelecionadoCodigo, setInventarioSelecionadoCodigo] = useState('');
  const [paginaFiltrada, setPaginaFiltrada] = useState(1);
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canPrint = hasModuleActionPermission(formularios, 'INVENTARIO', 'PRINT');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [resAbertos, resFechados] = await Promise.all([
        fetch('/api/inventario/processos?status=ABERTO'),
        fetch('/api/inventario/processos?status=FECHADO')
      ]);

      const dataAbertos = await resAbertos.json();
      const dataFechados = await resFechados.json();

      if (!resAbertos.ok) {
        throw new Error(dataAbertos.message || 'Falha ao carregar inventários abertos.');
      }
      if (!resFechados.ok) {
        throw new Error(dataFechados.message || 'Falha ao carregar inventários fechados.');
      }

      const lista = [...(dataAbertos.data || []), ...(dataFechados.data || [])] as InventarioProcesso[];
      lista.sort((a, b) => {
        const dataA = new Date(b.updatedAt || b.dataFechamento || b.dataInventario || '').getTime();
        const dataB = new Date(a.updatedAt || a.dataFechamento || a.dataInventario || '').getTime();
        return dataA - dataB;
      });
      setItens(lista);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Falha ao carregar inventários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const itensFiltrados = useMemo(
    () => itens.filter((inventario) => inventario.statusInventario === statusFiltro),
    [itens, statusFiltro]
  );

  const codigoBuscaNormalizado = codigoBusca.trim().toUpperCase();
  const itensFiltradosPorCodigo = useMemo(() => {
    if (!codigoBuscaNormalizado) return itensFiltrados;
    return itensFiltrados.filter((inventario) => inventario.codigoInventario.toUpperCase().includes(codigoBuscaNormalizado));
  }, [codigoBuscaNormalizado, itensFiltrados]);

  const totalItens = itensFiltradosPorCodigo.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItens / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(Math.max(paginaFiltrada, 1), totalPaginas);
  const itensPaginados = useMemo(() => {
    const inicio = totalItens === 0 ? 0 : (paginaAtual - 1) * ITENS_POR_PAGINA;
    return itensFiltradosPorCodigo.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [itensFiltradosPorCodigo, paginaAtual, totalItens]);

  useEffect(() => {
    setPaginaFiltrada(1);
  }, [statusFiltro, codigoBuscaNormalizado]);

  useEffect(() => {
    if (paginaFiltrada > totalPaginas) {
      setPaginaFiltrada(totalPaginas);
    }
  }, [paginaFiltrada, totalPaginas]);

  useEffect(() => {
    setInventarioSelecionadoCodigo((current) => {
      if (current && itensFiltradosPorCodigo.some((inventario) => inventario.codigoInventario === current)) {
        return current;
      }
      return itensFiltradosPorCodigo[0]?.codigoInventario || '';
    });
  }, [itensFiltradosPorCodigo]);

  const abrirInventario = (inventario: InventarioProcesso) => {
    router.push(`/inventario?codigo=${encodeURIComponent(inventario.codigoInventario)}`);
  };

  const totalAbertos = useMemo(() => itens.filter((inventario) => inventario.statusInventario === 'ABERTO').length, [itens]);
  const totalFechados = useMemo(() => itens.filter((inventario) => inventario.statusInventario === 'FECHADO').length, [itens]);

  return (
    <div className="table-surface space-y-4">
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Filtro por status</p>
            <p className="mt-1 text-xs text-muted-foreground">Escolha entre inventários abertos ou fechados.</p>
          </div>
          <div className="flex items-center gap-2">
            {(['ABERTO', 'FECHADO'] as StatusFiltro[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFiltro(status)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  statusFiltro === status ? 'border bg-white text-emerald-700 hover:bg-emerald-50' : 'border bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {status === 'ABERTO' ? 'Abertos' : 'Fechados'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {statusFiltro === 'ABERTO' ? totalAbertos : totalFechados} inventário{(statusFiltro === 'ABERTO' ? totalAbertos : totalFechados) === 1 ? '' : 's'} |{' '}
            {statusFiltro === 'ABERTO' ? 'aberto' : 'fechado'}{(statusFiltro === 'ABERTO' ? totalAbertos : totalFechados) === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            className="rounded-lg p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:pointer-events-none disabled:opacity-50"
            onClick={() => void carregar()}
            title="Atualizar"
            aria-label="Atualizar"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 space-y-2">
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 pl-9 text-sm"
                placeholder="Buscar por código INV..."
                value={codigoBusca}
                onChange={(e) => setCodigoBusca(e.target.value.toUpperCase())}
              />
            </div>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={inventarioSelecionadoCodigo}
              onChange={(e) => {
                setInventarioSelecionadoCodigo(e.target.value);
                const item = itensFiltradosPorCodigo.find((inventario) => inventario.codigoInventario === e.target.value);
                if (item) abrirInventario(item);
              }}
            >
              <option value="">{loading ? 'Carregando inventários...' : 'Selecione um inventário filtrado'}</option>
              {itensFiltradosPorCodigo.map((inventario) => (
                <option key={inventario.codigoInventario} value={inventario.codigoInventario}>
                  {inventario.codigoInventario} | {formatarData(inventario.dataInventario)} | {inventario.statusInventario}
                </option>
              ))}
            </select>
          </div>
          {codigoBusca ? (
            <button
              type="button"
              className="rounded-lg border px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-50"
              onClick={() => setCodigoBusca('')}
            >
              Limpar busca
            </button>
          ) : null}
        </div>

        {erro && <div className="mt-3 text-sm text-red-600">{erro}</div>}
      </div>

        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Inventários filtrados</h2>
          <span className="text-xs text-muted-foreground">
            {statusFiltro === 'ABERTO' ? 'Somente abertos' : 'Somente fechados'} | {totalItens} itens
          </span>
        </div>
        <TabelaInventarios
          itens={itensPaginados}
          loading={loading}
          emptyMessage={`Nenhum inventário ${statusFiltro === 'ABERTO' ? 'aberto' : 'fechado'} encontrado.`}
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          totalItens={totalItens}
          onIrParaPagina={setPaginaFiltrada}
          onAbrir={abrirInventario}
          canPrint={canPrint}
        />
      </div>
    </div>
  );
}
