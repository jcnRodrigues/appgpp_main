'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Check, Trash2, CalendarCheck2, PencilLine, Loader2, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { gerarListaPatrimoniosPdf, type ItemBusca } from './ListaPatrimoniosPdfReport';
import { TableEmptyState } from './TableEmptyState';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { extrairCodigoDevolucao } from '@/features/devolucao/devolucaoCodigo';
import { hasModuleActionPermission } from '@/lib/permissions';
import { notify as showNotify } from '@/lib/notify';

type CentroCusto = {
  idCCusto: string;
  descricaoCCusto?: string | null;
};

type FormularioDevolucaoLinha = {
  dataInicioDevolucao: string;
  dataSaidaFornecedor: string;
  dataChegadaFornecedor: string;
  motivoDevolucao: string;
  notaFiscalDevolucao: string;
};

function formatarMoeda(valor?: number | null) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function formatarData(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
}

function formatarDataInput(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

function getStatusBadgeClass(status?: string | null) {
  if (status === 'ATIVO') return 'bg-green-100 text-green-800';
  if (status === 'DEVOLUÇÃO') return 'bg-red-100 text-red-800';
  if (status === 'INATIVO') return 'bg-orange-100 text-orange-800';
  if (status === 'MANUTENÇÃO') return 'bg-purple-100 text-purple-800';
  if (status === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

function normalizarStatusExibicao(status?: string | null) {
  const texto = String(status || '').trim();
  if (!texto) return 'SEM STATUS';
  if (texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().includes('DEVOLU')) {
    return 'DEVOLUÇÃO';
  }
  return texto.toUpperCase();
}

type ListaPatrimoniosPdfFormProps = {
  codigoInicial?: string | null;
};

export default function ListaPatrimoniosPdfForm({ codigoInicial }: ListaPatrimoniosPdfFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleEnterToNext = useEnterToNext();
  const { data: session } = useSession();
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canCreate = hasModuleActionPermission(formularios, 'PATRIMONIO', 'CREATE');
  const canUpdate = hasModuleActionPermission(formularios, 'PATRIMONIO', 'UPDATE');
  const canDelete = hasModuleActionPermission(formularios, 'PATRIMONIO', 'DELETE');

  const showNoPermissionAlert = (acao: string) => {
    showNotify('aviso', `Você não tem permissão para ${acao}.`);
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
  const [saidasEditaveis, setSaidasEditaveis] = useState<Record<string, string>>({});
  const codigoInicialValido = useMemo(() => {
    const codigo = String(codigoInicial || '').trim().toUpperCase();
    return extrairCodigoDevolucao(codigo) ? codigo : '';
  }, [codigoInicial]);
  const [codigoDevolucao, setCodigoDevolucao] = useState(codigoInicialValido);
  const [idDevolucaoProcesso, setIdDevolucaoProcesso] = useState('');
  const [processoAtivo, setProcessoAtivo] = useState(Boolean(codigoInicialValido));
  const [carregandoCodigoDevolucao, setCarregandoCodigoDevolucao] = useState(false);
  const [carregandoProcessoInicial, setCarregandoProcessoInicial] = useState(false);
  const [modalDevolucaoAberto, setModalDevolucaoAberto] = useState(false);
  const [modalDevolucaoSalvando, setModalDevolucaoSalvando] = useState(false);
  const [modalDevolucaoCarregando, setModalDevolucaoCarregando] = useState(false);
  const [itemModalDevolucao, setItemModalDevolucao] = useState<ItemBusca | null>(null);
  const [formularioDevolucao, setFormularioDevolucao] = useState<FormularioDevolucaoLinha>({
    dataInicioDevolucao: '',
    dataSaidaFornecedor: '',
    dataChegadaFornecedor: '',
    motivoDevolucao: '',
    notaFiscalDevolucao: ''
  });
  const codigoDevolucaoSolicitadaRef = useRef(false);

  const idsSelecionados = useMemo(() => new Set(selecionados.map((x) => x.idP)), [selecionados]);

  const carregarCodigoDevolucao = useCallback(async (forcarNovo = false) => {
    if (!forcarNovo && codigoDevolucao) return codigoDevolucao;

    setCarregandoCodigoDevolucao(true);
    try {
      const res = await fetch('/api/patrimonio/devolucao/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao gerar código de devolução.');
      }

      const codigo = String(data.codigo || '').trim();
      if (!codigo) {
        throw new Error('Código de devolução inválido.');
      }

      setCodigoDevolucao(codigo);
      setIdDevolucaoProcesso(String(data.idDevolucaoProcesso || '').trim());
      setProcessoAtivo(true);
      router.replace(`/patrimoniolist/lista-devolucao?codigo=${encodeURIComponent(codigo)}`);
      return codigo;
    } catch (error) {
      showNotify('erro', error instanceof Error ? error.message : 'Falha ao gerar código de devolução.');
      throw error;
    } finally {
      setCarregandoCodigoDevolucao(false);
    }
  }, [codigoDevolucao, router]);

  useEffect(() => {
    if (codigoInicialValido) {
      setCodigoDevolucao(codigoInicialValido);
      setProcessoAtivo(true);
      codigoDevolucaoSolicitadaRef.current = true;
    }
  }, [codigoInicialValido]);

  useEffect(() => {
    const carregarProcessoInicial = async () => {
      if (!codigoInicialValido) return;
      if (selecionados.length > 0) return;

      setCarregandoProcessoInicial(true);
      try {
        const res = await fetch(`/api/patrimonio/devolucao/processos/${encodeURIComponent(codigoInicialValido)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || 'Falha ao carregar processo de devolução.');
        }

        const itens = (data.itens || []) as ItemBusca[];
        const processoFechado = data.processo?.statusDevolucao === 'FECHADO';
        setProcessoAtivo(!processoFechado);
        if (itens.length > 0) {
          setSelecionados(itens);
          setCodigoDevolucao(codigoInicialValido);
          setIdDevolucaoProcesso(String(data.idDevolucaoProcesso || '').trim());
          codigoDevolucaoSolicitadaRef.current = true;
        }
      } catch (error) {
        showNotify('erro', error instanceof Error ? error.message : 'Falha ao carregar processo de devolução.');
      } finally {
        setCarregandoProcessoInicial(false);
      }
    };

    void carregarProcessoInicial();
  }, [codigoInicialValido, selecionados.length]);

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

  useEffect(() => {
    if (processoAtivo && selecionados.length > 0 && !codigoDevolucao && !carregandoCodigoDevolucao && !codigoDevolucaoSolicitadaRef.current) {
      codigoDevolucaoSolicitadaRef.current = true;
      void carregarCodigoDevolucao();
    }
  }, [carregandoCodigoDevolucao, carregarCodigoDevolucao, codigoDevolucao, processoAtivo, selecionados.length]);

  const atualizarItemComDevolucao = (idP: string, dados: Partial<ItemBusca>) => {
    setSelecionados((prev) => prev.map((item) => (item.idP === idP ? { ...item, ...dados } : item)));
    setResultados((prev) => prev.map((item) => (item.idP === idP ? { ...item, ...dados } : item)));
  };

  const atualizarDataSaidaLinha = async (item: ItemBusca) => {
    const dataSaida = (saidasEditaveis[item.idP] || '').trim();
    if (!dataSaida) {
      showNotify('aviso', 'Informe a data de saída.');
      return;
    }
    if (!processoAtivo || !codigoDevolucao) {
      showNotify('aviso', 'Clique em "Nova devolução" para iniciar o processo.');
      return;
    }

    try {
      const res = await fetch(`/api/patrimonio/${item.idP}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataSaiPat: dataSaida,
          codigoDevolucao
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao atualizar data de saída.');
      }

      atualizarItemComDevolucao(item.idP, {
        dataSaiPat: data.dataSaiPat || dataSaida
      });

      setSaidasEditaveis((prev) => {
        const next = { ...prev };
        delete next[item.idP];
        return next;
      });

      showNotify('sucesso', 'Data de Saida inserida com sucesso.');
    } catch (error) {
      showNotify('erro', error instanceof Error ? error.message : 'Falha ao atualizar data de saída.');
    }
  };

  const abrirModalDevolucao = async (item: ItemBusca) => {
    if (!canUpdate && !canCreate) {
      showNoPermissionAlert('editar dados de devolução');
      return;
    }
    if (!processoAtivo || !codigoDevolucao) {
      showNotify('aviso', 'Clique em "Nova devolução" para iniciar o processo.');
      return;
    }

    setItemModalDevolucao(item);
    setModalDevolucaoAberto(true);
    setModalDevolucaoCarregando(true);

    try {
      const res = await fetch(`/api/patrimonio/devolucao/linhas?codigoDevolucao=${encodeURIComponent(codigoDevolucao)}&idPatrimonio=${encodeURIComponent(item.idP)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao carregar dados da devolução.');
      }

      setFormularioDevolucao({
        dataInicioDevolucao: formatarDataInput(data.dataInicioDevolucao || item.dataInicioDevolucao || null),
        dataSaidaFornecedor: formatarDataInput(data.dataSaidaFornecedor || item.dataSaidaFornecedor || item.dataSaiPat || null),
        dataChegadaFornecedor: formatarDataInput(data.dataChegadaFornecedor || item.dataChegadaFornecedor || null),
        motivoDevolucao: normalizarTextoMaiusculo(String(data.motivoDevolucao || item.motivoDevolucao || '')),
        notaFiscalDevolucao: normalizarTextoMaiusculo(String(data.notaFiscalDevolucao || item.notaFiscalDevolucao || ''))
      });

      if (data.idDevolucaoProcesso) {
        setIdDevolucaoProcesso(String(data.idDevolucaoProcesso).trim());
      }
    } catch (error) {
      showNotify('erro', error instanceof Error ? error.message : 'Falha ao carregar dados da devolução.');
      setModalDevolucaoAberto(false);
      setItemModalDevolucao(null);
    } finally {
      setModalDevolucaoCarregando(false);
    }
  };

  const fecharModalDevolucao = () => {
    if (modalDevolucaoSalvando) return;
    setModalDevolucaoAberto(false);
    setItemModalDevolucao(null);
  };

  const normalizarTextoMaiusculo = (valor: string) => valor.toUpperCase();

  const salvarModalDevolucao = async () => {
    if (!itemModalDevolucao) return;
    if (!processoAtivo || !codigoDevolucao) {
      showNotify('aviso', 'Clique em "Nova devolução" para iniciar o processo.');
      return;
    }

    setModalDevolucaoSalvando(true);
    try {
      const res = await fetch('/api/patrimonio/devolucao/linhas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPatrimonio: itemModalDevolucao.idP,
          codigoDevolucao,
          dataInicioDevolucao: formularioDevolucao.dataInicioDevolucao || null,
          dataSaidaFornecedor: formularioDevolucao.dataSaidaFornecedor || null,
          dataChegadaFornecedor: formularioDevolucao.dataChegadaFornecedor || null,
          motivoDevolucao: formularioDevolucao.motivoDevolucao,
          notaFiscalDevolucao: formularioDevolucao.notaFiscalDevolucao
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao salvar dados da devolução.');
      }

      atualizarItemComDevolucao(itemModalDevolucao.idP, {
        idDevolucao: data.idDevolucao || itemModalDevolucao.idDevolucao || null,
        idDevolucaoProcesso: data.idDevolucaoProcesso || itemModalDevolucao.idDevolucaoProcesso || null,
        dataInicioDevolucao: data.dataInicioDevolucao || formularioDevolucao.dataInicioDevolucao || null,
        dataSaidaFornecedor: data.dataSaidaFornecedor || formularioDevolucao.dataSaidaFornecedor || null,
        dataChegadaFornecedor: data.dataChegadaFornecedor || formularioDevolucao.dataChegadaFornecedor || null,
        motivoDevolucao: data.motivoDevolucao ?? formularioDevolucao.motivoDevolucao,
        notaFiscalDevolucao: data.notaFiscalDevolucao ?? formularioDevolucao.notaFiscalDevolucao,
        tbStatusPat: {
          descricaoStatPat: normalizarStatusExibicao(data.statusPatrimonio || data.statusPatrimonioDescricao || 'DEVOLUÇÃO')
        }
      });

      if (data.statusDevolucao === 'FECHADO') {
        setProcessoAtivo(false);
        showNotify('sucesso', 'Dados da devolução salvos com sucesso. Processo de devolução fechado.');
      } else {
        showNotify('sucesso', 'Dados da devolução salvos com sucesso.');
      }
      fecharModalDevolucao();
    } catch (error) {
      showNotify('erro', error instanceof Error ? error.message : 'Falha ao salvar dados da devolução.');
    } finally {
      setModalDevolucaoSalvando(false);
    }
  };

  const iniciarNovaDevolucao = useCallback(async () => {
    if (!canCreate) {
      showNoPermissionAlert('iniciar uma nova devolução');
      return;
    }

    setErro(null);
    setMostrarSaida(false);
    setSelecionados([]);
    setResultados([]);
    setCodigoDevolucao('');
    setIdDevolucaoProcesso('');
    setProcessoAtivo(true);
    codigoDevolucaoSolicitadaRef.current = false;

    try {
      await carregarCodigoDevolucao(true);
    } catch {
      // notifica já é tratado no helper
    }
  }, [carregarCodigoDevolucao, canCreate]);

  useEffect(() => {
    if (searchParams?.get('novo') !== '1') return;
    if (carregandoCodigoDevolucao || (processoAtivo && codigoDevolucao)) return;
    void iniciarNovaDevolucao();
  }, [carregandoCodigoDevolucao, codigoDevolucao, iniciarNovaDevolucao, processoAtivo, searchParams]);

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
      params.append('includeHistorico', 'true');
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

  const adicionar = async (item: ItemBusca) => {
    if (!canCreate) {
      showNoPermissionAlert('adicionar registros');
      return;
    }
    if (!processoAtivo) {
      showNotify('aviso', 'Clique em "Nova devolução" para iniciar o processo.');
      return;
    }
    if (idsSelecionados.has(item.idP)) return;

    try {
      const res = await fetch('/api/patrimonio/devolucao/linhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPatrimonio: item.idP,
          codigoDevolucao
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao inserir linha de devolução.');
      }
      setSelecionados((prev) => [...prev, item]);
    } catch (error) {
      showNotify('erro', error instanceof Error ? error.message : 'Falha ao inserir linha de devolução.');
    }
  };

  const remover = async (item: ItemBusca) => {
    if (!canDelete) {
      showNoPermissionAlert('excluir registros');
      return;
    }
    if (!processoAtivo) {
      showNotify('aviso', 'Clique em "Nova devolução" para iniciar o processo.');
      return;
    }

    try {
      const res = await fetch('/api/patrimonio/devolucao/linhas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPatrimonio: item.idP,
          codigoDevolucao
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao remover linha de devolução.');
      }
      setSelecionados((prev) => prev.filter((x) => x.idP !== item.idP));
    } catch (error) {
      showNotify('erro', error instanceof Error ? error.message : 'Falha ao remover linha de devolução.');
    }
  };

  const aplicarDataSaidaSelecionados = async () => {
    if (!dataSaidaLote) {
      showNotify('aviso', 'Informe a data de saída.');
      return;
    }
    if (selecionados.length === 0) {
      showNotify('aviso', 'Adicione ao menos um patrimônio na lista selecionada.');
      return;
    }
    if (!processoAtivo || !codigoDevolucao) {
      showNotify('aviso', 'Clique em "Nova devolução" para gerar a numeração do processo.');
      return;
    }

    const itensValidos = selecionados.filter((item) => !item.idP.startsWith('hist-'));
    if (itensValidos.length === 0) {
      showNotify('aviso', 'Nenhum patrimônio ativo para atualizar.');
      return;
    }

    setSalvandoSaida(true);
    try {
      const resultadosAtualizacao = await Promise.allSettled(
        itensValidos.map((item) =>
          fetch(`/api/patrimonio/${item.idP}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataSaiPat: dataSaidaLote, codigoDevolucao })
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
        showNotify('aviso', `Data de saída atualizada parcialmente. Falhas: ${falhas}.`);
      } else {
        showNotify('sucesso', 'Data de saída atualizada com sucesso na base.');
      }
    } catch {
      showNotify('erro', 'Erro ao atualizar data de saída.');
    } finally {
      setSalvandoSaida(false);
    }
  };

  const gerarPdf = useCallback(async () => {
    if (selecionados.length === 0) {
      showNotify('aviso', 'Lista vazia. Selecione ao menos um patrimônio para gerar o PDF.');
      return;
    }
    if (!processoAtivo || !codigoDevolucao) {
      showNotify('aviso', 'Clique em "Nova devolução" para gerar a numeração do processo.');
      return;
    }

    const codigo = await carregarCodigoDevolucao(false);
    gerarListaPatrimoniosPdf(selecionados, codigo);
  }, [carregarCodigoDevolucao, codigoDevolucao, processoAtivo, selecionados]);

  useEffect(() => {
    const handler = () => {
      void gerarPdf();
    };

    window.addEventListener('patrimonio-lista-devolucao:gerar-pdf', handler);
    return () => window.removeEventListener('patrimonio-lista-devolucao:gerar-pdf', handler);
  }, [gerarPdf]);

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="font-semibold">Pesquisar Patrimônios</h2>
          <div className="flex flex-wrap items-center gap-2 md:ml-auto md:justify-end">
            <span className="inline-flex min-h-8 items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 text-sm font-semibold tracking-wide text-cyan-100 shadow-sm">
              Processo:  {carregandoCodigoDevolucao ? 'Gerando...' : codigoDevolucao || 'DEV--'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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
            disabled={!processoAtivo}
            className="border rounded px-3 py-2 md:col-span-1 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <select
            value={centroId}
            onChange={(e) => setCentroId(e.target.value)}
            disabled={!processoAtivo}
            className="border rounded px-3 py-2 md:col-span-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Todos os centros de custo</option>
            {centros.map((centro) => (
              <option key={centro.idCCusto} value={centro.idCCusto}>
                {centro.descricaoCCusto || 'Sem descrição'}
              </option>
            ))}
          </select>
        </div>

        {erro ? <p className="text-sm text-red-600">{erro}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="border-b bg-gray-50">
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
              {resultados.length === 0 ? (
                <TableEmptyState
                  colSpan={6}
                  title="Nenhum patrimônio encontrado"
                  description="Refine a busca acima para localizar itens e adicioná-los à lista."
                  loading={loading}
                />
              ) : (
                resultados.map((item) => (
                  <tr key={item.idP} className="border-b">
                    <td className="px-2 py-2">{item.idPat}</td>
                    <td className="px-2 py-2">
                      <div>{item.descricaoPat}</div>
                      <div className="mt-1">
                        <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800">
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
                    <td className="px-2 py-2">
                      {idsSelecionados.has(item.idP) ? (
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 cursor-not-allowed border-green-100 bg-green-700 hover:bg-green-800" disabled title="Adicionado">
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 border-green-100 bg-green-700 hover:bg-green-800" onClick={() => void adicionar(item)} disabled={!processoAtivo} title="Adicionar à lista">
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Lista Selecionada ({selecionados.length})</h2>
            <p className="text-xs text-slate-500">
              {carregandoProcessoInicial
                ? 'Carregando processo selecionado...'
                : carregandoCodigoDevolucao
                  ? 'Gerando código de devolução...'
                  : codigoDevolucao
                    ? `Código de devolução: ${codigoDevolucao}${idDevolucaoProcesso ? ` | Processo: ${idDevolucaoProcesso}` : ''}`
                    : 'O código será gerado ao iniciar a lista.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-8 border-amber-400/30 bg-amber-500/20 px-3 text-amber-100 hover:bg-amber-500/30 hover:text-white"
              onClick={() => setMostrarSaida((prev) => !prev)}
              disabled={selecionados.length === 0 || !processoAtivo}
              title="Inserir data de saída na lista selecionada"
            >
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Inserir Data Saída
            </Button>
          </div>
        </div>

        {mostrarSaida ? (
          <div className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium">Data de saída</label>
              <input
                type="date"
                value={dataSaidaLote}
                onChange={(e) => setDataSaidaLote(e.target.value)}
                className="rounded border px-3 py-2"
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
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="border-b bg-gray-50">
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
              {selecionados.length === 0 ? (
                <TableEmptyState
                  colSpan={8}
                  title="Nenhum patrimônio selecionado"
                  description="Adicione itens acima para montar a lista de devolução."
                />
              ) : (
                selecionados.map((item) => (
                  <tr key={item.idP} className="border-b">
                    <td className="px-2 py-2">{item.idPat}</td>
                    <td className="px-2 py-2">
                      <div>{item.descricaoPat}</div>
                      <div className="mt-1">
                        <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800">
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
                    <td className="px-2 py-2">{formatarData(item.dataEntPat)}</td>
                    <td className="px-2 py-2">
                      {item.dataSaiPat ? (
                        formatarData(item.dataSaiPat)
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={saidasEditaveis[item.idP] || ''}
                            onChange={(e) => setSaidasEditaveis((prev) => ({ ...prev, [item.idP]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                void atualizarDataSaidaLinha(item);
                              }
                            }}
                            className="w-[135px] rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-cyan-700 hover:text-cyan-800"
                          onClick={() => void abrirModalDevolucao(item)}
                          disabled={!processoAtivo}
                          title="Editar dados da devolução"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-red-700 hover:text-red-800"
                          onClick={() => void remover(item)}
                          title="Remover da lista"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalDevolucaoAberto && itemModalDevolucao ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Dados da devolução</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-100">{itemModalDevolucao.descricaoPat}</h3>
                <p className="text-sm text-slate-400">
                  {itemModalDevolucao.idPat} • {codigoDevolucao}
                  {idDevolucaoProcesso ? ` • Processo ${idDevolucaoProcesso}` : ''}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800"
                onClick={fecharModalDevolucao}
                disabled={modalDevolucaoSalvando}
                title="Fechar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-5 py-4">
              {modalDevolucaoCarregando ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-5 text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando dados da devolução...
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onKeyDown={handleEnterToNext}
                  onSubmit={(e) => {
                    e.preventDefault();
                    void salvarModalDevolucao();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-200">Data de Emissão - NF</label>
                      <input
                        type="date"
                        value={formularioDevolucao.dataInicioDevolucao}
                        onChange={
                          (e) => setFormularioDevolucao(
                            (prev) => (
                              { ...prev, dataInicioDevolucao: e.target.value }
                            )
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-200">NF da devolução</label>
                      <input
                        type="text"
                        value={formularioDevolucao.notaFiscalDevolucao}
                        onChange={
                          (e) => setFormularioDevolucao(
                            (prev) => (
                              { ...prev, notaFiscalDevolucao: normalizarTextoMaiusculo(e.target.value) }
                            )
                          )
                        }
                        placeholder="Ex: NF-DEV-123"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 uppercase outline-none focus:border-cyan-500"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-200">Data Saida - Fornecedor</label>
                      <input
                        type="date"
                        value={formularioDevolucao.dataSaidaFornecedor}
                        onChange={
                          (e) => setFormularioDevolucao(
                            (prev) => (
                              { ...prev, dataSaidaFornecedor: e.target.value }
                            )
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-200">Data Chegada - Fornecedor</label>
                      <input
                        type="date"
                        value={formularioDevolucao.dataChegadaFornecedor}
                        onChange={
                          (e) => setFormularioDevolucao(
                            (prev) => (
                              { ...prev, dataChegadaFornecedor: e.target.value }
                            )
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-200">Motivo da devolução</label>
                    <textarea
                      value={formularioDevolucao.motivoDevolucao}
                      onChange={
                        (e) => setFormularioDevolucao(
                          (prev) => (
                            { ...prev, motivoDevolucao: normalizarTextoMaiusculo(e.target.value) }
                          )
                        )
                      }
                      placeholder="Descreva o motivo da devolução"
                      className="h-28 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 uppercase outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                      onClick={fecharModalDevolucao}
                      disabled={modalDevolucaoSalvando}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="bg-cyan-600 text-white hover:bg-cyan-500"
                      onClick={() => void salvarModalDevolucao()}
                      disabled={modalDevolucaoSalvando}
                    >
                      {modalDevolucaoSalvando ? 'Salvando...' : 'Salvar dados'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
