'use client'

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderOpen, RefreshCw, LucideDoorClosedLocked, Ghost } from 'lucide-react';

type BmItem = {
  idBm: string;
  codigoBm: string;
  idCCusto: string;
  codigoCCusto?: string | null;
  descricaoCCusto?: string | null;
  statusBm: 'ABERTO' | 'FECHADO';
  dataInicioMedicao: string;
  dataFimMedicao: string;
  gerouRelatorioExcel: boolean;
  gerouRelatorioPdf: boolean;
  updatedAt?: string;
};

type StatusFiltro = 'ABERTO' | 'FECHADO';

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

function StatusBadge({ status }: { status: BmItem['statusBm'] }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold
         ${status === 'ABERTO'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-200 text-red-800'
        }`}
    >
      {status}
    </span>
  );
}

function BmTable({
  itens,
  loading,
  emptyMessage,
  onAbrir,
  onFechar
}: {
  itens: BmItem[];
  loading: boolean;
  emptyMessage: string;
  onAbrir?: (bm: BmItem) => void;
  onFechar?: (bm: BmItem) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">BM</th>
            <th className="px-3 py-2 text-left font-semibold">Centro de Custo</th>
            <th className="px-3 py-2 text-left font-semibold">Status</th>
            <th className="px-3 py-2 text-left font-semibold">Período</th>
            <th className="px-3 py-2 text-left font-semibold">Excel</th>
            <th className="px-3 py-2 text-left font-semibold">PDF</th>
            <th className="px-3 py-2 text-left font-semibold">Atualização</th>
            <th className="px-3 py-2 text-left font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-3 text-gray-500">
                {loading ? 'Carregando...' : emptyMessage}
              </td>
            </tr>
          ) : (
            itens.map((bm) => (
              <tr key={bm.idBm} className="border-b">
                <td className="px-3 py-2">
                  {bm.codigoBm}
                </td>
                <td className="px-3 py-2 text-[10px]">
                  {(bm.codigoCCusto ? `${bm.codigoCCusto} - ` : '') + (bm.descricaoCCusto || 'Sem descrição')}
                </td>
                <td className="px-3 py-2 text-[10px]">
                  <StatusBadge status={bm.statusBm} />
                </td>
                <td className="px-3 py-2 text-[10px]">
                  {formatarData(bm.dataInicioMedicao)} até {formatarData(bm.dataFimMedicao)}
                </td>
                <td className="px-3 py-2 text-[10px]">
                  {bm.gerouRelatorioExcel ? 'Sim' : 'Não'}
                </td>
                <td className="px-3 py-2 text-[10px]">
                  {bm.gerouRelatorioPdf ? 'Sim' : 'Não'}
                </td>
                <td className="px-3 py-2 text-[10px]">
                  {formatarDataHora(bm.updatedAt)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => onAbrir?.(bm)}
                      title="Abrir BM"
                      aria-label="Abrir BM"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => onFechar?.(bm)}
                      disabled={bm.statusBm !== 'ABERTO' || !onFechar}
                      title="Fechar BM"
                      aria-label="Fechar BM"
                    >
                      <LucideDoorClosedLocked className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function MedicoesEmProcessoTable() {
  const [itens, setItens] = useState<BmItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [bmSelecionadoId, setBmSelecionadoId] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('ABERTO');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [resAbertos, resFechados] = await Promise.all([
        fetch('/api/ccusto/medicao/bm?status=ABERTO'),
        fetch('/api/ccusto/medicao/bm?status=FECHADO')
      ]);

      const dataAbertos = await resAbertos.json();
      const dataFechados = await resFechados.json();

      if (!resAbertos.ok) {
        setErro(dataAbertos.message || 'Falha ao carregar BMs abertos.');
        return;
      }
      if (!resFechados.ok) {
        setErro(dataFechados.message || 'Falha ao carregar BMs fechados.');
        return;
      }

      const lista = [...(dataAbertos.data || []), ...(dataFechados.data || [])] as BmItem[];
      lista.sort((a, b) => {
        const dataA = new Date(b.updatedAt || b.dataFimMedicao || '').getTime();
        const dataB = new Date(a.updatedAt || a.dataFimMedicao || '').getTime();
        return dataA - dataB;
      });

      setItens(lista);
      setBmSelecionadoId((current) => {
        if (!current && lista.length > 0) return lista[0].idBm;
        if (current && !lista.some((x) => x.idBm === current)) {
          return lista[0]?.idBm || '';
        }
        return current;
      });
    } catch {
      setErro('Falha ao carregar medições em processo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const itensFiltrados = useMemo(
    () => itens.filter((bm) => bm.statusBm === statusFiltro),
    [itens, statusFiltro]
  );

  useEffect(() => {
    setBmSelecionadoId((current) => {
      if (current && itensFiltrados.some((bm) => bm.idBm === current)) {
        return current;
      }
      return itensFiltrados[0]?.idBm || '';
    });
  }, [itensFiltrados]);

  const bmSelecionado = useMemo(
    () => itens.find((x) => x.idBm === bmSelecionadoId) || null,
    [itens, bmSelecionadoId]
  );

  const abrirBm = (bm: BmItem) => {
    window.location.href = `/ccusto/medicao?bmId=${encodeURIComponent(bm.idBm)}`;
  };

  const fecharBm = async (bm: BmItem) => {
    if (bm.statusBm !== 'ABERTO') {
      setErro('Somente BM em aberto pode ser fechado.');
      return;
    }

    const mensagem = `Confirma o fechamento do BM ${bm.codigoBm} (${formatarData(bm.dataInicioMedicao)} até ${formatarData(bm.dataFimMedicao)})?`;
    const confirmou = window.systemConfirm
      ? await window.systemConfirm(mensagem, 'Confirmar fechamento', {
        confirmText: 'Fechar BM',
        cancelText: 'Cancelar'
      })
      : window.confirm(mensagem);
    if (!confirmou) return;

    const res = await fetch('/api/ccusto/medicao/bm', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idBm: bm.idBm, statusBm: 'FECHADO' })
    });
    const data = await res.json();
    if (!res.ok) {
      setErro(data.message || 'Falha ao fechar BM.');
      return;
    }
    await carregar();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Filtro por status</p>
            <p className="text-xs text-gray-500 mt-1">Escolha entre BMs abertos ou fechados.</p>
          </div>
          <div className="flex items-center gap-2">
            {(['ABERTO', 'FECHADO'] as StatusFiltro[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFiltro(status)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition
                  ${statusFiltro === status
                  ? 'items-center gap-2 border bg-white text-green-700 hover:bg-green-100'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
                  }`}
              >
                {status === 'ABERTO' ? 'Abertos' : 'Fechados'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            {itensFiltrados.length} BM{itensFiltrados.length === 1 ? '' : 's'} | {statusFiltro === 'ABERTO' ? 'aberto' : 'fechado'}{itensFiltrados.length === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => void carregar()}
            title="Atualizar"
            aria-label="Atualizar"
          >
            <RefreshCw className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-2 space-y-2">
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bmSelecionadoId}
            onChange={(e) => setBmSelecionadoId(e.target.value)}
          >
            <option value="">{loading ? 'Carregando BMs...' : 'Selecione um BM filtrado'}</option>
            {itensFiltrados.map((bm) => (
              <option key={bm.idBm} value={bm.idBm}>
                {bm.codigoBm} | {formatarData(bm.dataInicioMedicao)} até {formatarData(bm.dataFimMedicao)} | {bm.statusBm}
              </option>
            ))}
          </select>
        </div>

        {bmSelecionado && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-50 transition"
              onClick={() => abrirBm(bmSelecionado)}
            >
              <FolderOpen className="h-4 w-4" />
              Abrir BM
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50 transition disabled:opacity-50"
              onClick={() => void fecharBm(bmSelecionado)}
              disabled={bmSelecionado.statusBm !== 'ABERTO'}
            >
              <LucideDoorClosedLocked className="h-4 w-4" />
              Fechar BM
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">BMs filtrados</h2>
          <span className="text-xs text-gray-500">
            {statusFiltro === 'ABERTO' ? 'Somente abertos' : 'Somente fechados'}
          </span>
        </div>
        {erro && <div className="text-sm text-red-600 mb-3">{erro}</div>}
        <BmTable
          itens={itensFiltrados}
          loading={loading}
          emptyMessage={`Nenhum BM ${statusFiltro === 'ABERTO' ? 'aberto' : 'fechado'} encontrado.`}
          onAbrir={abrirBm}
          onFechar={fecharBm}
        />
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Todos os BMs</h2>
          <span className="text-xs text-gray-500">{itens.length} registros</span>
        </div>
        <BmTable
          itens={itens}
          loading={loading}
          emptyMessage="Nenhum BM encontrado."
          onAbrir={abrirBm}
          onFechar={fecharBm}
        />
      </div>
    </div>
  );
}
