'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Plus, Search, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormActions from '@/components/FormActions/FormActions';
import { Button } from '@/components/ui/button';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { useFormDraft } from '@/hooks/useFormDraft';
import { notify as showNotify } from '@/lib/notify';
import { normalizeStatusText } from '@/lib/status';

type CentroCustoOption = {
  idCCusto: string;
  codigoCCusto?: string | null;
  descricaoCCusto?: string | null;
};

type PatrimonioBusca = {
  idP: string;
  idPat: string;
  descricaoPat: string;
  valorPat?: number | null;
  tbCCusto?: {
    descricaoCCusto?: string | null;
  } | null;
  tbStatusPat?: {
    descricaoStatPat?: string | null;
  } | null;
};

type InventarioItem = {
  idPat: string;
  descricaoPat: string;
  valorPat: string;
  centroCusto: string;
  statusConferencia: 'CONFERIDO' | 'NAO_ENCONTRADO' | 'DIVERGENTE' | 'AVARIADO' | 'NAO_INVENTARIADO';
  observacao: string;
};

type InventarioFormState = {
  dataInventario: string;
  centroCusto: string;
  responsavel: string;
  local: string;
  observacao: string;
  itens: InventarioItem[];
};

const statusInventarioOptions: Array<{
  value: InventarioItem['statusConferencia'];
  label: string;
  className: string;
}> = [
    { value: 'CONFERIDO', label: 'Conferido', className: 'bg-emerald-100 text-emerald-800' },
    { value: 'NAO_ENCONTRADO', label: 'Não encontrado', className: 'bg-red-100 text-red-800' },
    { value: 'DIVERGENTE', label: 'Divergente', className: 'bg-amber-100 text-amber-800' },
    { value: 'AVARIADO', label: 'Avariado', className: 'bg-orange-100 text-orange-800' },
    { value: 'NAO_INVENTARIADO', label: 'Não inventariado', className: 'bg-slate-100 text-slate-800' }
  ];

const criarItemVazio = (): InventarioItem => ({
  idPat: '',
  descricaoPat: '',
  valorPat: '',
  centroCusto: '',
  statusConferencia: 'CONFERIDO',
  observacao: ''
});

export default function InventarioPatrimonioForm() {
  const handleEnterToNext = useEnterToNext();
  const hoje = new Date().toISOString().split('T')[0];

  const initialState = useMemo<InventarioFormState>(
    () => ({
      dataInventario: hoje,
      centroCusto: '',
      responsavel: '',
      local: '',
      observacao: '',
      itens: []
    }),
    [hoje]
  );

  const { state: inventario, setState: setInventario } = useFormDraft('inventario-patrimonio-form', initialState);

  const [centros, setCentros] = useState<CentroCustoOption[]>([]);
  const [busca, setBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultadosBusca, setResultadosBusca] = useState<PatrimonioBusca[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const response = await fetch('/api/patrimonio/opcoes', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        setCentros(Array.isArray(data.centros) ? data.centros : []);
      } catch (error) {
        console.error('Erro ao carregar centros do inventário:', error);
      }
    };

    void carregarOpcoes();
  }, []);

  const formatarMoeda = (valor: number | string | null | undefined) => {
    const numero = Number(valor || 0);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
  };

  const buscarPatrimonios = async (termoBusca?: string) => {
    const termo = (termoBusca ?? busca).trim();
    if (!termo) {
      showNotify('aviso', 'Informe um ID ou descrição para buscar.');
      return;
    }

    setBuscando(true);
    try {
      const buscarPor = async (campo: 'idPat' | 'descricao') => {
        const params = new URLSearchParams();
        params.set('take', '12');
        params.set('skip', '0');
        params.set('includeHistorico', 'false');
        params.set(campo, termo);

        const response = await fetch(`/api/patrimonio?${params.toString()}`, { cache: 'no-store' });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || 'Não foi possível buscar patrimônios.');
        }
        return Array.isArray(data.data) ? (data.data as PatrimonioBusca[]) : [];
      };

      const [porId, porDescricao] = await Promise.all([buscarPor('idPat'), buscarPor('descricao')]);
      const unicos = new Map<string, PatrimonioBusca>();
      [...porId, ...porDescricao].forEach((item) => {
        if (item?.idP) unicos.set(item.idP, item);
      });

      const resultados = Array.from(unicos.values());
      setResultadosBusca(resultados);

      if (resultados.length === 0) {
        showNotify('aviso', 'Nenhum patrimônio encontrado com esse termo.');
      }
    } catch (error) {
      console.error('Erro ao buscar patrimônios:', error);
      showNotify('erro', error instanceof Error ? error.message : 'Erro ao buscar patrimônios.');
      setResultadosBusca([]);
    } finally {
      setBuscando(false);
    }
  };

  const adicionarItem = (patrimonio?: PatrimonioBusca) => {
    const novoItem: InventarioItem = patrimonio
      ? {
        idPat: patrimonio.idPat || '',
        descricaoPat: patrimonio.descricaoPat || '',
        valorPat: Number(patrimonio.valorPat || 0).toFixed(2),
        centroCusto: inventario.centroCusto,
        statusConferencia: 'CONFERIDO',
        observacao: ''
      }
      : criarItemVazio();

    setInventario((prev) => ({
      ...prev,
      itens: [...prev.itens, novoItem]
    }));
  };

  const atualizarItem = (index: number, field: keyof InventarioItem, value: string) => {
    setInventario((prev) => ({
      ...prev,
      itens: prev.itens.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          [field]: value
        };
      })
    }));
  };

  const removerItem = (index: number) => {
    setInventario((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, idx) => idx !== index)
    }));
  };

  const itensResumo = useMemo(() => {
    const total = inventario.itens.length;
    const conferidos = inventario.itens.filter((item) => item.statusConferencia === 'CONFERIDO').length;
    const divergentes = inventario.itens.filter((item) => item.statusConferencia === 'DIVERGENTE').length;
    const naoEncontrados = inventario.itens.filter((item) => item.statusConferencia === 'NAO_ENCONTRADO').length;
    const avariados = inventario.itens.filter((item) => item.statusConferencia === 'AVARIADO').length;

    return { total, conferidos, divergentes, naoEncontrados, avariados };
  }, [inventario.itens]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSalvando(true);

    try {
      if (!inventario.dataInventario) {
        showNotify('aviso', 'Informe a data do inventário.');
        return;
      }

      if (inventario.itens.length === 0) {
        showNotify('aviso', 'Adicione ao menos um patrimônio ao inventário.');
        return;
      }

      const payload = {
        ...inventario,
        itens: inventario.itens.map((item) => ({
          ...item,
          valorPat: Number(item.valorPat || 0)
        })),
        resumo: itensResumo,
        geradoEm: new Date().toISOString()
      };

      const arquivo = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json;charset=utf-8'
      });
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventario-patrimonio-${inventario.dataInventario}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showNotify('sucesso', 'Inventário exportado com sucesso.');
    } catch (error) {
      console.error('Erro ao exportar inventário:', error);
      showNotify('erro', 'Erro ao exportar inventário.');
    } finally {
      setSalvando(false);
    }
  };

  const getStatusPatBadgeClass = (status?: string) => {
    const normalizado = normalizeStatusText(status);
    if (normalizado === 'ATIVO') return 'bg-green-100 text-green-800';
    if (normalizado === 'DEVOLUCAO') return 'bg-red-100 text-red-800';
    if (normalizado === 'INATIVO') return 'bg-orange-100 text-orange-800';
    if (normalizado === 'MANUTENCAO') return 'bg-purple-100 text-purple-800';
    if (normalizado === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const centroSelecionado = centros.find((centro) => centro.idCCusto === inventario.centroCusto);

  return (
    <div className="bg-background min-h-screen py-6">
      <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="space-y-6">
        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Dados do inventário</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Data do inventário</label>
              <input
                type="date"
                value={inventario.dataInventario}
                onChange={(e) => setInventario((prev) => ({ ...prev, dataInventario: e.target.value }))}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Centro de custo</label>
              <select
                value={inventario.centroCusto}
                onChange={(e) => setInventario((prev) => ({ ...prev, centroCusto: e.target.value }))}
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione um centro</option>
                {centros.map((centro) => (
                  <option key={centro.idCCusto} value={centro.idCCusto}>
                    {(centro.codigoCCusto ? `${centro.codigoCCusto} - ` : '') + (centro.descricaoCCusto || 'Sem descrição')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Responsável</label>
              <input
                type="text"
                value={inventario.responsavel}
                onChange={(e) => setInventario((prev) => ({ ...prev, responsavel: e.target.value.toUpperCase() }))}
                placeholder="Nome do responsável"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Local</label>
              <input
                type="text"
                value={inventario.local}
                onChange={(e) => setInventario((prev) => ({ ...prev, local: e.target.value.toUpperCase() }))}
                placeholder="Ex: Almoxarifado Central"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Observações</label>
            <textarea
              value={inventario.observacao}
              onChange={(e) => setInventario((prev) => ({ ...prev, observacao: e.target.value }))}
              rows={3}
              placeholder="Anote regras, ressalvas e pendências do inventário"
              className="w-full resize-none rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>
        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {statusInventarioOptions.map((status) => (
              <div key={status.value}
                className={`rounded-xl px-4 py-3 ${status.className}`}>
                <p className="text-xs font-semibold uppercase tracking-wide">
                  {status.label}
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {inventario.itens.filter((item) => item.statusConferencia === status.value).length}
                </p>
              </div>
            ))}
          </div>
          {centroSelecionado && (
            <p className="mt-4 text-sm text-slate-600">
              Centro selecionado:{' '}
              <strong>
                {(centroSelecionado.codigoCCusto ? `${centroSelecionado.codigoCCusto} - ` : '') +
                  (centroSelecionado.descricaoCCusto || 'Sem descrição')}
              </strong>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-slate-900">Buscar patrimônio para incluir</h2>
              <p className="text-sm text-muted-foreground">
                Use o ID ou parte da descrição para localizar bens e adicioná-los rapidamente à lista.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative w-full sm:w-[360px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void buscarPatrimonios();
                    }
                  }}
                  placeholder="Ex: PAT001 ou computador"
                  className="w-full rounded-lg border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="gap-2 border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                onClick={() => void buscarPatrimonios()}
                disabled={buscando}>
                {buscando ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                onClick={() => adicionarItem()}
              >
                <Plus className="h-4 w-4" />
                Adicionar linha
              </Button>
            </div>
          </div>

          {resultadosBusca.length > 0 && (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {resultadosBusca.map((patrimonio) => (
                <div key={patrimonio.idP}
                  className="rounded-xl border border--200  p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {patrimonio.idPat}
                      </p>
                      <p className="text-sm text-slate-500">
                        {patrimonio.descricaoPat}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-emerald-700 hover:bg-emerald-50 hover:text-green-800"
                      onClick={() => adicionarItem(patrimonio)}
                    >
                      <Plus className="h-4 w-4" />
                      Incluir
                    </Button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    <div>
                      Valor: {formatarMoeda(patrimonio.valorPat || 0)}
                    </div>
                    <div>
                      Centro:
                      <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-semibold 
                        ${getStatusPatBadgeClass(patrimonio.tbStatusPat?.descricaoStatPat)}`}>
                        {patrimonio.tbCCusto?.descricaoCCusto || '-'}
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      Status:
                      <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-semibold 
                        ${getStatusPatBadgeClass(patrimonio.tbStatusPat?.descricaoStatPat)}`}>
                        {patrimonio.tbStatusPat?.descricaoStatPat || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Itens do inventário</h2>
              <p className="text-sm text-muted-foreground">
                Ajuste os itens manualmente se quiser registrar um bem não localizado na busca.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Total: {itensResumo.total}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Conferidos: {itensResumo.conferidos}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Divergentes: {itensResumo.divergentes}</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">Não encontrados: {itensResumo.naoEncontrados}</span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">ID</th>
                  <th className="px-3 py-3">Descrição</th>
                  <th className="px-3 py-3">Valor</th>
                  <th className="px-3 py-3">Centro</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Observação</th>
                  <th className="px-3 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventario.itens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">
                      Nenhum item adicionado ainda.
                    </td>
                  </tr>
                ) : (
                  inventario.itens.map((item, index) => (
                    <tr key={`${item.idPat || 'novo'}-${index}`} className="border-b align-top">
                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={item.idPat}
                          onChange={(e) => atualizarItem(index, 'idPat', e.target.value.toUpperCase())}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="ID do patrimônio"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={item.descricaoPat}
                          onChange={(e) => atualizarItem(index, 'descricaoPat', e.target.value.toUpperCase())}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Descrição"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={item.valorPat}
                          onChange={(e) => atualizarItem(index, 'valorPat', e.target.value)}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="0,00"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={item.centroCusto || inventario.centroCusto}
                          onChange={(e) => atualizarItem(index, 'centroCusto', e.target.value)}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Selecionar</option>
                          {centros.map((centro) => (
                            <option key={centro.idCCusto} value={centro.idCCusto}>
                              {(centro.codigoCCusto ? `${centro.codigoCCusto} - ` : '') + (centro.descricaoCCusto || 'Sem descrição')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={item.statusConferencia}
                          onChange={(e) => atualizarItem(index, 'statusConferencia', e.target.value as InventarioItem['statusConferencia'])}
                          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {statusInventarioOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          value={item.observacao}
                          onChange={(e) => atualizarItem(index, 'observacao', e.target.value)}
                          rows={2}
                          className="w-full resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Observações da conferência"
                        />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-red-700 hover:bg-red-50 hover:text-red-800"
                          onClick={() => removerItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>



        <FormActions
          cancelHref="/patrimoniolist"
          submitLabel="Exportar inventário"
          loadingLabel="Exportando..."
          loading={salvando}
          submitClassName="bg-slate-950 text-white shadow-sm hover:bg-slate-800"
        />
      </form>
    </div>
  );
}
