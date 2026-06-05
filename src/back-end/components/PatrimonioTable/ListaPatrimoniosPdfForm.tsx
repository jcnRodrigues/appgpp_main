'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Check, Trash2, CalendarCheck2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/back-end/components/ui/button';
import { gerarListaPatrimoniosPdf, type ItemBusca } from '@/back-end/components/PatrimonioTable/ListaPatrimoniosPdfReport';
import { hasActionPermission } from '@/lib/permissions';

type CentroCusto = {
  idCCusto: string;
  descricaoCCusto?: string | null;
};

function formatarMoeda(valor?: number | null) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

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

function getStatusBadgeClass(status?: string | null) {
  if (status === 'ATIVO') return 'bg-green-100 text-green-800';
  if (status === 'DEVOLUÇÃO') return 'bg-red-100 text-red-800';
  if (status === 'INATIVO') return 'bg-orange-100 text-orange-800';
  if (status === 'MANUTENÇÃO') return 'bg-purple-100 text-purple-800';
  if (status === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

export default function ListaPatrimoniosPdfForm() {
  const { data: session } = useSession();
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canCreate = hasActionPermission(formularios, 'CREATE');
  const canDelete = hasActionPermission(formularios, 'DELETE');
  const canPrint = hasActionPermission(formularios, 'PRINT');

  const showNoPermissionAlert = (acao: string) => {
    window.systemAlert?.('aviso', `Você não tem permissão para ${acao}.`);
  };

  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<ItemBusca[]>([]);
  const [selecionados, setSelecionados] = useState<ItemBusca[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [centros, setCentros] = useState<CentroCusto[]>([]);
  const [centroId, setCentroId] = useState('');
  const [mostrarSaida, setMostrarSaida] = useState(false);
  const [dataSaidaLote, setDataSaidaLote] = useState(new Date().toISOString().split('T')[0]);
  const [salvandoSaida, setSalvandoSaida] = useState(false);

  const idsSelecionados = useMemo(() => new Set(selecionados.map((x) => x.idP)), [selecionados]);

  useEffect(() => {
    const carregarCentros = async () => {
      try {
        const res = await fetch('/api/patrimonio/opcoes');
        const data = await res.json();
        if (res.ok) {
          setCentros((data.centros || []) as CentroCusto[]);
        }
      } catch {
        // filtro opcional
      }
    };

    void carregarCentros();
  }, []);

  const pesquisar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const params = new URLSearchParams();
      if (busca.trim()) {
        params.append('idPat', busca.trim());
      }
      if (centroId) {
        params.append('centroId', centroId);
      }
      params.append('includeHistorico', 'false');
      params.append('take', '50');
      params.append('skip', '0');
      const res = await fetch(`/api/patrimonio?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setErro(data.message || 'Falha ao pesquisar patrimônios.');
        return;
      }
      setResultados((data.data || []) as ItemBusca[]);
    } catch {
      setErro('Falha ao pesquisar patrimônios.');
    } finally {
      setLoading(false);
    }
  };

  const adicionar = (item: ItemBusca) => {
    if (!canCreate) {
      showNoPermissionAlert('adicionar registros');
      return;
    }
    if (idsSelecionados.has(item.idP)) return;
    setSelecionados((prev) => [...prev, item]);
  };

  const remover = (idP: string) => {
    if (!canDelete) {
      showNoPermissionAlert('excluir registros');
      return;
    }
    setSelecionados((prev) => prev.filter((x) => x.idP !== idP));
  };

  const aplicarDataSaidaSelecionados = async () => {
    if (!dataSaidaLote) {
      window.systemAlert?.('aviso', 'Informe a data de saída.');
      return;
    }
    if (selecionados.length === 0) {
      window.systemAlert?.('aviso', 'Adicione ao menos um patrimônio na lista selecionada.');
      return;
    }

    const itensValidos = selecionados.filter((item) => !item.idP.startsWith('hist-'));
    if (itensValidos.length === 0) {
      window.systemAlert?.('aviso', 'Nenhum patrimônio ativo para atualizar.');
      return;
    }

    setSalvandoSaida(true);
    try {
      const resultadosAtualizacao = await Promise.allSettled(
        itensValidos.map((item) =>
          fetch(`/api/patrimonio/${item.idP}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataSaiPat: dataSaidaLote })
          })
        )
      );

      const sucessoIds = new Set<string>();
      let falhas = 0;
      for (let i = 0; i < resultadosAtualizacao.length; i++) {
        const r = resultadosAtualizacao[i];
        if (r.status === 'fulfilled' && r.value.ok) {
          sucessoIds.add(itensValidos[i].idP);
        } else {
          falhas += 1;
        }
      }

      if (sucessoIds.size > 0) {
        setSelecionados((prev) =>
          prev.map((item) =>
            sucessoIds.has(item.idP)
              ? { ...item, dataSaiPat: dataSaidaLote }
              : item
          )
        );
        setResultados((prev) =>
          prev.map((item) =>
            sucessoIds.has(item.idP)
              ? { ...item, dataSaiPat: dataSaidaLote }
              : item
          )
        );
      }

      if (falhas > 0) {
        window.systemAlert?.('aviso', `Data de saída atualizada parcialmente. Falhas: ${falhas}.`);
      } else {
        window.systemAlert?.('sucesso', 'Data de saída atualizada com sucesso na base.');
      }
    } catch {
      window.systemAlert?.('erro', 'Erro ao atualizar data de saída.');
    } finally {
      setSalvandoSaida(false);
    }
  };

  const gerarPdf = () => {
    if (!canPrint) {
      showNoPermissionAlert('imprimir/gerar relatórios');
      return;
    }
    gerarListaPatrimoniosPdf(selecionados);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <h2 className="font-semibold">
          Pesquisar Patrimônios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void pesquisar();
              }
            }}
            placeholder="Buscar por ID de Patrimônio..."
            className="md:col-span-1 border rounded px-3 py-2"
          />
          <select
            value={centroId}
            onChange={(e) => setCentroId(e.target.value)}
            className="md:col-span-3 border rounded px-3 py-2"
          >
            <option value="">Todos os centros de custo</option>
            {centros.map((centro) => (
              <option key={centro.idCCusto} value={centro.idCCusto}>
                {centro.descricaoCCusto || 'Sem descrição'}
              </option>
            ))}
          </select>

        </div>
        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-2 text-left">ID</th>
                <th className="px-2 py-2 text-left">Descrição</th>
                <th className="px-2 py-2 text-left">Tipo</th>
                <th className="px-2 py-2 text-left">Valor</th>
                <th className="px-2 py-2 text-left">Status</th>
                <th className="px-2 py-2 text-left">Ação</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item) => (
                <tr key={item.idP} className="border-b">
                  <td className="px-2 py-2">{item.idPat}</td>
                  <td className="px-2 py-2">
                    <div>{item.descricaoPat}</div>
                    <div className="mt-1">
                      <span
                        className="inline-block rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-[10px] font-semibold">
                        {item.tbCCusto?.descricaoCCusto || 'Sem centro de custo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2">{item.tbTipoPat?.descricaoTipPat || '-'}</td>
                  <td className="px-2 py-2">{formatarMoeda(item.valorPat)}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold 
                      ${getStatusBadgeClass(item.tbStatusPat?.descricaoStatPat)}`}>
                      {item.tbStatusPat?.descricaoStatPat || 'SEM STATUS'}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    {idsSelecionados.has(item.idP) ? (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-green-700 border-green-100 cursor-not-allowed hover:bg-green-800"
                        disabled
                        title="Adicionado"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-green-700 border-green-100 hover:bg-green-800"
                        onClick={() => adicionar(item)}
                        title="Adicionar à lista"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {resultados.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-2 py-3 text-gray-500">Nenhum resultado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Lista Selecionada ({selecionados.length})</h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-8 border-yellow-300 bg-yellow-700 hover:bg-yellow-100"
              onClick={() => setMostrarSaida((prev) => !prev)}
              disabled={selecionados.length === 0}
              title="Inserir data de saída na lista selecionada"
            >
              <CalendarCheck2 className="h-4 w-4 mr-2" />
              Inserir Data Saída
            </Button>
            <button
              type="button"
              variant="ghost" 
              className="px-3 py-2 border rounded bg-green-700 text-green-100 hover:bg-green-100"
              onClick={gerarPdf} disabled={selecionados.length === 0}>
              Gerar PDF da Lista
            </button>
          </div>
        </div>

        {mostrarSaida && (
          <div className="border rounded-lg p-3 flex flex-col md:flex-row md:items-end gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Data de saída</label>
              <input
                type="date"
                value={dataSaidaLote}
                onChange={(e) => setDataSaidaLote(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <Button
              type="button"
              onClick={() => void aplicarDataSaidaSelecionados()}
              disabled={salvandoSaida || selecionados.length === 0}
            >
              {salvandoSaida ? 'Salvando...' : 'Salvar na Base'}
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-2 text-left">ID</th>
                <th className="px-2 py-2 text-left">Descrição</th>
                <th className="px-2 py-2 text-left">Tipo</th>
                <th className="px-2 py-2 text-left">Valor</th>
                <th className="px-2 py-2 text-left">Status</th>
                <th className="px-2 py-2 text-left">Entrada</th>
                <th className="px-2 py-2 text-left">Saída</th>
                <th className="px-2 py-2 text-left">Ação</th>
              </tr>
            </thead>
            <tbody>
              {selecionados.map((item) => (
                <tr key={item.idP} className="border-b">
                  <td className="px-2 py-2">{item.idPat}</td>
                  <td className="px-2 py-2">
                    <div>{item.descricaoPat}</div>
                    <div className="mt-1">
                      <span className="inline-block rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-[10px] font-semibold">
                        {item.tbCCusto?.descricaoCCusto || 'Sem centro de custo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2">{item.tbTipoPat?.descricaoTipPat || '-'}</td>
                  <td className="px-2 py-2">{formatarMoeda(item.valorPat)}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClass(item.tbStatusPat?.descricaoStatPat)}`}>
                      {item.tbStatusPat?.descricaoStatPat || 'SEM STATUS'}
                    </span>
                  </td>
                  <td className="px-2 py-2">{formatarData(item.dataEntPat)}</td>
                  <td className="px-2 py-2">{formatarData(item.dataSaiPat || null)}</td>
                  <td className="px-2 py-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 text-red-700 hover:text-red-800"
                      onClick={() => remover(item.idP)}
                      title="Remover da lista"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {selecionados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-2 py-3 text-gray-500">Nenhum patrimônio selecionado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
