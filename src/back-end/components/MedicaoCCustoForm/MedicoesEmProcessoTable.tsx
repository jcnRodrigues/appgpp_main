'use client'

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FolderOpen, RefreshCw, LucideDoorClosedLocked } from 'lucide-react';

type BmItem = {
  idBm: string;
  codigoBm: string;
  idCCusto: string;
  codigoCCusto?: string | null;
  descricaoCCusto?: string | null;
  dataInicioMedicao: string;
  dataFimMedicao: string;
  gerouRelatorioExcel: boolean;
  gerouRelatorioPdf: boolean;
  updatedAt?: string;
};

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

export default function MedicoesEmProcessoTable() {
  const [itens, setItens] = useState<BmItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [bmSelecionadoId, setBmSelecionadoId] = useState('');

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('/api/ccusto/medicao/bm?status=ABERTO');
      const data = await res.json();
      if (!res.ok) {
        setErro(data.message || 'Falha ao carregar medições em processo.');
        return;
      }
      const lista = (data.data || []) as BmItem[];
      setItens(lista);
      if (!bmSelecionadoId && lista.length > 0) {
        setBmSelecionadoId(lista[0].idBm);
      }
      if (bmSelecionadoId && !lista.some((x) => x.idBm === bmSelecionadoId)) {
        setBmSelecionadoId(lista[0]?.idBm || '');
      }
    } catch {
      setErro('Falha ao carregar medições em processo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void carregar();
  }, []);

  const bmSelecionado = useMemo(
    () => itens.find((x) => x.idBm === bmSelecionadoId) || null,
    [itens, bmSelecionadoId]
  );

  const fecharBm = async (bm: BmItem) => {
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
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">BM em aberto</p>
          <div className="flex items-center gap-2">
            {bmSelecionado && (
              <Link
                href={`/ccusto/medicao?bmId=${encodeURIComponent(bmSelecionado.idBm)}`}
                className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                title="Abrir BM"
                aria-label="Abrir BM"
              >
                <FolderOpen className="h-4 w-4" />
              </Link>
            )}
            {bmSelecionado && (
              <button
                type="button"
                className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => void fecharBm(bmSelecionado)}
                title="Fechar BM Atual"
                aria-label="Fechar BM Atual"
              >
                <LucideDoorClosedLocked className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={bmSelecionadoId}
            onChange={(e) => setBmSelecionadoId(e.target.value)}
          >
            <option value="">{loading ? 'Carregando BMs...' : 'Selecione um BM em aberto'}</option>
            {itens.map((bm) => (
              <option key={bm.idBm} value={bm.idBm}>
                {bm.codigoBm} | {formatarData(bm.dataInicioMedicao)} até {formatarData(bm.dataFimMedicao)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Medições em processo (todos os centros de custo)</h2>
          <button
            type="button"
            className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => void carregar()}
            title="Atualizar"
            aria-label="Atualizar"
          >
            <RefreshCw className="h-4 w-4"   />
          </button>
        </div>

        {erro && <div className="text-sm text-red-600 mb-3">{erro}</div>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">BM</th>
                <th className="px-3 py-2 text-left font-semibold">Centro de Custo</th>
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
                  <td colSpan={7} className="px-3 py-3 text-gray-500">
                    {loading ? 'Carregando...' : 'Nenhuma medição em processo.'}
                  </td>
                </tr>
              ) : (
                itens.map((bm) => (
                  <tr key={bm.idBm} className="border-b">
                    <td className="px-3 py-2">{bm.codigoBm}</td>
                    <td className="px-3 py-2">{(bm.codigoCCusto ? `${bm.codigoCCusto} - ` : '') + (bm.descricaoCCusto || 'Sem descrição')}</td>
                    <td className="px-3 py-2">{formatarData(bm.dataInicioMedicao)} até {formatarData(bm.dataFimMedicao)}</td>
                    <td className="px-3 py-2">{bm.gerouRelatorioExcel ? 'Sim' : 'Não'}</td>
                    <td className="px-3 py-2">{bm.gerouRelatorioPdf ? 'Sim' : 'Não'}</td>
                    <td className="px-3 py-2">{formatarDataHora(bm.updatedAt)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ccusto/medicao?bmId=${encodeURIComponent(bm.idBm)}`}
                          className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                          title="Abrir BM"
                          aria-label="Abrir BM"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none"
                          onClick={() => void fecharBm(bm)}
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
      </div>
    </div>
  );
}
