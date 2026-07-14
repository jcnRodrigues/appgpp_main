'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ArrowUpRight, BookAlertIcon, Camera, Plus, QrCode, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { useFormDraft } from '@/hooks/useFormDraft';
import { notify as showNotify } from '@/lib/notify';
import { hasModuleActionPermission } from '@/lib/permissions';
import { normalizeStatusText } from '@/lib/status';
import { TableEmptyState } from '@/features/inventario/components/TableEmptyState';
import type {
  AlocacaoVinculada,
  CentroCustoOption,
  InventarioFormState,
  InventarioItem,
  InventarioProcessoApi,
  PatrimonioBusca
} from '@/features/inventario/types';
import { formatarMoeda, normalizarCodigoLido, primeiroNome } from '@/features/inventario/utils';
import { getRowClassName, getStatusConferenciaPorCusto, statusInventarioOptions } from '@/features/inventario/rules';

const criarItemVazio = (): InventarioItem => ({
  idPat: '',
  descricaoPat: '',
  valorPat: '',
  centroCusto: '',
  localInventario: '',
  responsavelInventario: '',
  statusConferencia: 'CONFERIDO',
  observacao: ''
});

type InventarioPatrimonioFormProps = {
  codigoInicial?: string | null;
};

export default function InventarioPatrimonioForm({ codigoInicial }: InventarioPatrimonioFormProps) {
  const handleEnterToNext = useEnterToNext();
  const { data: session } = useSession();
  const hoje = new Date().toISOString().split('T')[0];

  const initialState = useMemo<InventarioFormState>(
    () => ({
      codigoInventario: '',
      statusInventario: 'ABERTO',
      dataInventario: hoje,
      centroCusto: '',
      responsavel: '',
      criadorInventario: '',
      local: '',
      observacao: '',
      itens: []
    }),
    [hoje]
  );

  const { state: inventario, setState: setInventario } = useFormDraft('inventario-patrimonio-form', initialState, {
    clearOnMount: !codigoInicial
  });

  const [centros, setCentros] = useState<CentroCustoOption[]>([]);
  const [busca, setBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<PatrimonioBusca[]>([]);
  const [alocacaoVinculada, setAlocacaoVinculada] = useState<AlocacaoVinculada | null>(null);
  const [carregandoVinculo, setCarregandoVinculo] = useState(false);
  const [carregandoProcesso, setCarregandoProcesso] = useState(false);
  const [totalPatrimoniosCentro, setTotalPatrimoniosCentro] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [leitorAberto, setLeitorAberto] = useState(false);
  const [leitorCarregando, setLeitorCarregando] = useState(false);
  const [leitorErro, setLeitorErro] = useState('');
  const [dispositivosCamera, setDispositivosCamera] = useState<MediaDeviceInfo[]>([]);
  const [cameraSelecionada, setCameraSelecionada] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leitorRef = useRef<BrowserMultiFormatReader | null>(null);
  const leitorControlsRef = useRef<{ stop: () => void } | null>(null);
  const leitorIniciandoRef = useRef(false);
  const leitorSequenciaRef = useRef(0);
  const responsavelLogado = useMemo(() => {
    const nome = String((session?.user as any)?.name || session?.user?.email || '').trim();
    return nome ? nome.toUpperCase() : '';
  }, [session]);

  const responsavelLogadoPrimeiroNome = useMemo(() => {
    const base = responsavelLogado.trim();
    if (!base) return '';
    return base.split(/\s+/)[0] || base;
  }, [responsavelLogado]);
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canCreate = hasModuleActionPermission(formularios, 'INVENTARIO', 'CREATE');
  const canUpdate = hasModuleActionPermission(formularios, 'INVENTARIO', 'UPDATE');
  const canSaveInventario = canCreate || canUpdate;

  useEffect(() => {
    const carregarProcesso = async () => {
      const codigo = String(codigoInicial || '').trim().toUpperCase();
      if (!codigo) return;

      setCarregandoProcesso(true);
      try {
        const response = await fetch(`/api/inventario/processos/${encodeURIComponent(codigo)}`, {
          cache: 'no-store'
        });
        const data = (await response.json().catch(() => ({}))) as Partial<InventarioProcessoApi>;
        if (!response.ok) {
          if (response.status !== 404) {
            showNotify('erro', (data as any).message || 'Erro ao carregar inventário salvo.');
          }
          return;
        }

        const itensApi = Array.isArray(data.itensJson) ? data.itensJson : [];
        const itens = itensApi.map((item: any) => ({
          idPat: String(item?.idPat || ''),
          descricaoPat: String(item?.descricaoPat || ''),
          valorPat: Number(item?.valorPat || 0).toFixed(2),
          centroCusto: String(item?.centroCusto || data.idCCusto || ''),
          localInventario: String(item?.localInventario || data.localInventario || '').toUpperCase(),
          responsavelInventario: primeiroNome(
            item?.responsavelInventario || data.responsavelInventario || responsavelLogadoPrimeiroNome || ''
          ),
          statusConferencia: (['CONFERIDO', 'NAO_ENCONTRADO', 'DIVERGENTE', 'AVARIADO', 'NAO_INVENTARIADO'].includes(String(item?.statusConferencia || 'CONFERIDO').toUpperCase())
            ? String(item?.statusConferencia || 'CONFERIDO').toUpperCase()
            : 'CONFERIDO') as InventarioItem['statusConferencia'],
          observacao: String(item?.observacao || '')
        })) as InventarioItem[];

        setInventario((prev) => ({
          ...prev,
          codigoInventario: data.codigoInventario || codigo,
          statusInventario: data.statusInventario || 'ABERTO',
          dataInventario: data.dataInventario ? String(data.dataInventario).split('T')[0] : prev.dataInventario,
          centroCusto: data.idCCusto || prev.centroCusto,
          responsavel: data.responsavelInventario ? String(data.responsavelInventario).toUpperCase() : prev.responsavel,
          criadorInventario: primeiroNome(data.criadoPorInventario || data.responsavelInventario || prev.criadorInventario || responsavelLogado),
          local: data.localInventario ? String(data.localInventario).toUpperCase() : prev.local,
          observacao: data.observacaoInventario || prev.observacao,
          itens
        }));
      } catch (error) {
        console.error('Erro ao carregar inventário:', error);
        showNotify('erro', 'Erro ao carregar inventário salvo.');
      } finally {
        setCarregandoProcesso(false);
      }
    };

    void carregarProcesso();
  }, [codigoInicial, responsavelLogado, responsavelLogadoPrimeiroNome, setInventario]);

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

  useEffect(() => {
    if (!responsavelLogado) return;
    setInventario((prev) => ({
      ...prev,
      responsavel: prev.responsavel === responsavelLogado ? prev.responsavel : responsavelLogado,
      criadorInventario: prev.criadorInventario || primeiroNome((session?.user as any)?.name || session?.user?.email || responsavelLogado)
    }));
  }, [responsavelLogado, setInventario, session]);


  const mapearPatrimonioParaItem = useCallback((
    patrimonio: PatrimonioBusca,
    statusConferencia: InventarioItem['statusConferencia'],
    observacao = ''
  ): InventarioItem => ({
    idPat: patrimonio.idPat || '',
    descricaoPat: patrimonio.descricaoPat || '',
    valorPat: Number(patrimonio.valorPat || 0).toFixed(2),
    centroCusto: patrimonio.tbCCusto?.idCCusto || inventario.centroCusto,
    localInventario: inventario.local || '',
    responsavelInventario: responsavelLogadoPrimeiroNome || inventario.responsavel || '',
    statusConferencia,
    observacao
  }), [inventario.centroCusto, inventario.local, inventario.responsavel, responsavelLogadoPrimeiroNome]);

  const sincronizarItemInventario = useCallback((
    patrimonio: PatrimonioBusca,
    opcoes?: {
      autoAdicionar?: boolean;
      statusConferencia?: InventarioItem['statusConferencia'];
      observacao?: string;
    }
  ) => {
    const novoItem = mapearPatrimonioParaItem(
      patrimonio,
      opcoes?.statusConferencia ?? getStatusConferenciaPorCusto(patrimonio, inventario.centroCusto),
      opcoes?.observacao || ''
    );

    setInventario((prev) => {
      const itens = prev.itens.slice();
      const indexExistente = itens.findIndex((item) => item.idPat === novoItem.idPat);
      if (indexExistente >= 0) {
        itens[indexExistente] = {
          ...itens[indexExistente],
          ...novoItem,
          observacao: itens[indexExistente].observacao || novoItem.observacao
        };
      } else {
        itens.push(novoItem);
      }

      return {
        ...prev,
        itens
      };
    });

    if (opcoes?.autoAdicionar) {
      showNotify('sucesso', `Patrimônio ${novoItem.idPat} incluído automaticamente no inventário.`);
    }
  }, [inventario.centroCusto, mapearPatrimonioParaItem, setInventario]);

  const carregarFuncionarioVinculado = useCallback(async (idPatrimonio: string) => {
    if (!idPatrimonio) {
      setAlocacaoVinculada(null);
      return;
    }

    setCarregandoVinculo(true);
    try {
      const params = new URLSearchParams();
      params.set('patrimonio', idPatrimonio);

      const response = await fetch(`/api/cadastro?${params.toString()}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível consultar o vínculo do patrimônio.');
      }

      const alocacoes = Array.isArray(data.data) ? (data.data as AlocacaoVinculada[]) : [];
      const alocacaoAtiva = alocacoes.find((item) => !item.dataDevPat) ?? alocacoes[0] ?? null;
      setAlocacaoVinculada(alocacaoAtiva);
    } catch (error) {
      console.error('Erro ao buscar funcionário vinculado:', error);
      setAlocacaoVinculada(null);
    } finally {
      setCarregandoVinculo(false);
    }
  }, []);

  const carregarResumoDoCentro = useCallback(async (centroId: string) => {
    const centroSelecionado = centroId.trim();
    if (!centroSelecionado) {
      setTotalPatrimoniosCentro(0);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('centroId', centroSelecionado);
      params.set('take', '1');
      params.set('skip', '0');
      params.set('includeHistorico', 'false');

      const response = await fetch(`/api/patrimonio?${params.toString()}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível carregar o resumo do centro selecionado.');
      }

      setTotalPatrimoniosCentro(typeof data.total === 'number' ? data.total : 0);
    } catch (error) {
      console.error('Erro ao carregar resumo do centro:', error);
      setTotalPatrimoniosCentro(0);
    }
  }, []);

  useEffect(() => {
    if (!leitorAberto) {
      return;
    }

    const carregarDispositivos = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        setDispositivosCamera(devices);

        if (!cameraSelecionada) {
          const preferida = devices.find((device) => /back|rear|environment|traseira/i.test(device.label)) ?? devices[0];
          setCameraSelecionada(preferida?.deviceId ?? '');
        }
      } catch (error) {
        console.error('Erro ao listar câmeras:', error);
      }
    };

    void carregarDispositivos();
  }, [cameraSelecionada, leitorAberto]);

  const buscarPatrimonios = useCallback(async (termoBusca?: string, autoAdicionar = false) => {
    const termo = (termoBusca ?? busca).trim();
    if (!termo) {
      showNotify('aviso', 'Informe um ID do patrimônio para buscar.');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('take', '12');
      params.set('skip', '0');
      params.set('includeHistorico', 'false');
      params.set('idPat', termo.toUpperCase());

      const response = await fetch(`/api/patrimonio?${params.toString()}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível buscar patrimônios.');
      }

      const resultados = Array.isArray(data.data) ? (data.data as PatrimonioBusca[]) : [];
      setResultadosBusca(resultados);
      setAlocacaoVinculada(null);

      if (resultados.length > 0) {
        void carregarFuncionarioVinculado(resultados[0].idPat);
        if (autoAdicionar) {
          const statusConferencia = getStatusConferenciaPorCusto(resultados[0], inventario.centroCusto);
          sincronizarItemInventario(resultados[0], { autoAdicionar: true, statusConferencia });
        }
      }

      if (resultados.length === 0) {
        showNotify('aviso', 'Nenhum patrimônio encontrado com esse ID.');
      }
    } catch (error) {
      console.error('Erro ao buscar patrimônios:', error);
      showNotify('erro', error instanceof Error ? error.message : 'Erro ao buscar patrimônios.');
      setResultadosBusca([]);
    }
  }, [busca, carregarFuncionarioVinculado, inventario.centroCusto, sincronizarItemInventario]);

  const pararLeitor = useCallback(() => {
    leitorSequenciaRef.current += 1;
    leitorIniciandoRef.current = false;

    leitorControlsRef.current?.stop();
    leitorControlsRef.current = null;

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // ignore
      }
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute('src');
    }
    BrowserMultiFormatReader.releaseAllStreams();
  }, []);

  const iniciarLeitor = useCallback(async () => {
    if (leitorIniciandoRef.current || leitorControlsRef.current) {
      return;
    }

    leitorIniciandoRef.current = true;
    const sequencia = ++leitorSequenciaRef.current;
    setLeitorErro('');
    setLeitorCarregando(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Seu navegador n?o suporta acesso ? c?mera.');
      }

      if (!leitorRef.current) {
        leitorRef.current = new BrowserMultiFormatReader();
      }

      const video = videoRef.current;
      if (!video) {
        throw new Error('N?o foi poss?vel preparar o leitor.');
      }

      leitorControlsRef.current = await leitorRef.current.decodeFromVideoDevice(
        cameraSelecionada || undefined,
        video,
        (resultado, error, controls) => {
          leitorControlsRef.current = controls;

          if (error || !resultado) {
            return;
          }

          const codigoNormalizado = normalizarCodigoLido(resultado.getText());
          if (!codigoNormalizado) {
            return;
          }

          controls.stop();
          leitorControlsRef.current = null;
          setBusca(codigoNormalizado);
          setLeitorAberto(false);
          setResultadosBusca([]);
          setTimeout(() => {
            void buscarPatrimonios(codigoNormalizado, true);
          }, 0);
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'N?o foi poss?vel iniciar o leitor.';
      if (leitorAberto) {
        setLeitorErro(message);
        showNotify('erro', message);
      }
      pararLeitor();
    } finally {
      if (sequencia === leitorSequenciaRef.current) {
        leitorIniciandoRef.current = false;
      }
      setLeitorCarregando(false);
    }
  }, [buscarPatrimonios, cameraSelecionada, leitorAberto, pararLeitor]);

  useEffect(() => {
    if (!leitorAberto) {
      pararLeitor();
      return;
    }

    void iniciarLeitor();
    return () => {
      pararLeitor();
    };
  }, [iniciarLeitor, leitorAberto, pararLeitor]);

  const adicionarItem = (patrimonio?: PatrimonioBusca) => {
    const novoItem: InventarioItem = patrimonio
      ? mapearPatrimonioParaItem(patrimonio, getStatusConferenciaPorCusto(patrimonio, inventario.centroCusto))
      : criarItemVazio();

    setInventario((prev) => ({
      ...prev,
      itens: [...prev.itens, novoItem]
    }));
  };

  useEffect(() => {
    setResultadosBusca([]);
    setAlocacaoVinculada(null);
    setInventario((prev) => ({
      ...prev,
      itens: []
    }));
    void carregarResumoDoCentro(inventario.centroCusto);
  }, [carregarResumoDoCentro, inventario.centroCusto, setInventario]);

  const removerItem = (index: number) => {
    setInventario((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, idx) => idx !== index)
    }));
  };

  const itensResumo = useMemo(() => {
    const centroSelecionado = inventario.centroCusto.trim();
    const itensDoCentroProcessados = inventario.itens.filter((item) => {
      const centroItem = (item.centroCusto || '').trim();
      if (!centroSelecionado || centroItem !== centroSelecionado) return false;
      return ['CONFERIDO', 'NAO_ENCONTRADO', 'AVARIADO'].includes(item.statusConferencia);
    }).length;

    const conferidos = inventario.itens.filter((item) => item.statusConferencia === 'CONFERIDO').length;
    const divergentes = inventario.itens.filter((item) => item.statusConferencia === 'DIVERGENTE').length;
    const naoEncontrados = inventario.itens.filter((item) => item.statusConferencia === 'NAO_ENCONTRADO').length;
    const avariados = inventario.itens.filter((item) => item.statusConferencia === 'AVARIADO').length;
    const total = centroSelecionado
      ? totalPatrimoniosCentro + inventario.itens.filter((item) => item.statusConferencia === 'DIVERGENTE').length
      : inventario.itens.length;
    const naoInventariados = centroSelecionado
      ? Math.max(totalPatrimoniosCentro - itensDoCentroProcessados, 0)
      : inventario.itens.filter((item) => item.statusConferencia === 'NAO_INVENTARIADO').length;

    return {
      total,
      conferidos,
      divergentes,
      naoEncontrados,
      avariados,
      naoInventariados,
      itensDoCustoSelecionado: totalPatrimoniosCentro,
      naoInventariadosNoCustoSelecionado: naoInventariados
    };
  }, [inventario.centroCusto, inventario.itens, totalPatrimoniosCentro]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSaveInventario) {
      showNotify('aviso', 'Você não tem permissão para salvar inventário.');
      return;
    }
    setSalvando(true);

    try {
      if (carregandoProcesso) {
        showNotify('aviso', 'Aguarde o carregamento do inventário.');
        return;
      }

      if (!inventario.dataInventario) {
        showNotify('aviso', 'Informe a data do inventário.');
        return;
      }

      if (!inventario.centroCusto) {
        showNotify('aviso', 'Selecione um centro de custo.');
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

      const response = await fetch('/api/inventario/processos', {
        method: inventario.codigoInventario ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigoInventario: inventario.codigoInventario || undefined,
          dataInventario: inventario.dataInventario,
          idCCusto: inventario.centroCusto,
          codigoCCusto: centroSelecionado?.codigoCCusto || '',
          descricaoCCusto: centroSelecionado?.descricaoCCusto || '',
          responsavelInventario: inventario.responsavel,
          localInventario: inventario.local,
          observacaoInventario: inventario.observacao,
          resumoJson: itensResumo,
          itensJson: payload.itens,
          idUserInventario: (session?.user as any)?.id || null,
          statusInventario: inventario.statusInventario || 'ABERTO'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar inventário.');
      }

      if (data.codigo) {
        setInventario((prev) => ({
          ...prev,
          codigoInventario: data.codigo,
          statusInventario: 'ABERTO'
        }));
      }

      showNotify('sucesso', 'Inventário salvo na base com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar inventário:', error);
      showNotify('erro', error instanceof Error ? error.message : 'Erro ao salvar inventário.');
    } finally {
      setSalvando(false);
    }
  };

  const getStatusPatBadgeClass = (status?: string | null) => {
    const normalizado = normalizeStatusText(status);
    if (normalizado === 'ATIVO') return 'bg-green-100 text-green-800';
    if (normalizado === 'DEVOLUCAO') return 'bg-red-100 text-red-800';
    if (normalizado === 'INATIVO') return 'bg-orange-100 text-orange-800';
    if (normalizado === 'MANUTENCAO') return 'bg-purple-100 text-purple-800';
    if (normalizado === 'TRANSFERIDO') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const centroSelecionado = centros.find((centro) => centro.idCCusto === inventario.centroCusto);
  const criadorInventario = inventario.criadorInventario || primeiroNome((session?.user as any)?.name || session?.user?.email || inventario.responsavel);

  return (
    <div className="bg-background min-h-screen py-3">
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleEnterToNext}
        className="form-surface space-y-2.5">
        <section className="rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm">
          <div className="mb-1.5 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Dados do inventário</h2>
              {inventario.codigoInventario ? (
                <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                  <span className="inline-flex items-center gap-1">
                    <BookAlertIcon className="h-3 w-3" />
                    {inventario.codigoInventario}
                  </span>
                  {criadorInventario ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-900">
                      Criado por: {criadorInventario}
                    </span>
                  ) : null}
                </span>
              ) : carregandoProcesso ? (
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  Carregando processo...
                </span>
              ) : null}
            </div>
            <div className="w-full md:max-w-md">
              <label className="mb-1 block text-xs font-medium">Responsável</label>
              <input
                type="text"
                value={inventario.responsavel}
                readOnly
                aria-readonly="true"
                placeholder="Nome do responsável"
                className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm uppercase text-foreground focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Data do inventário</label>
              <input
                type="date"
                value={inventario.dataInventario}
                onChange={(e) => setInventario((prev) => ({ ...prev, dataInventario: e.target.value }))}
                className="w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Centro de custo</label>
              <select
                value={inventario.centroCusto}
                onChange={(e) => setInventario((prev) => ({ ...prev, centroCusto: e.target.value }))}
                className="w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label className="mb-1 block text-xs font-medium">Local</label>
              <input
                type="text"
                value={inventario.local}
                onChange={(e) => setInventario((prev) => ({ ...prev, local: e.target.value.toUpperCase() }))}
                placeholder="Ex: Almoxarifado Central"
              className="w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-2.5">
            <label className="mb-1 block text-xs font-medium">Observações</label>
            <textarea
              value={inventario.observacao}
              onChange={(e) => setInventario((prev) => ({ ...prev, observacao: e.target.value }))}
              rows={2}
              placeholder="Anote regras, ressalvas e pendências do inventário"
              className="w-full resize-none rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex w-full items-start justify-end gap-2 md:w-auto">
            {canSaveInventario ? (
              <Button
                type="submit"
                disabled={salvando || carregandoProcesso}
                className="h-9 bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
              >
                {salvando ? 'Salvando...' : 'Salvar inventário'}
              </Button>
            ) : null}
          </div>
        </section>
        <section className="rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm">
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-5">
            {statusInventarioOptions.map((status) => (
              <div key={status.value}
                className={`rounded-xl px-3 py-2 ${status.className}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide">
                  {status.label}
                </p>
                <p className="mt-1 text-lg font-bold">
                  {status.value === 'CONFERIDO'
                    ? itensResumo.conferidos
                    : status.value === 'DIVERGENTE'
                      ? itensResumo.divergentes
                      : status.value === 'NAO_ENCONTRADO'
                        ? itensResumo.naoEncontrados
                        : status.value === 'AVARIADO'
                          ? itensResumo.avariados
                          : itensResumo.naoInventariados}
                </p>
              </div>
            ))}
          </div>
          {centroSelecionado && (
            <p className="mt-2 text-xs text-slate-600">
              Centro selecionado:{' '}
              <strong>
                {(centroSelecionado.codigoCCusto ? `${centroSelecionado.codigoCCusto} - ` : '') +
                  (centroSelecionado.descricaoCCusto || 'Sem descrição')}
              </strong>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-sm font-semibold text-slate-900">Buscar patrimônio para incluir</h2>
              <p className="text-[11px] text-muted-foreground">
                Use o ID do patrimônio para localizar bens e adicioná-los rapidamente à lista.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void buscarPatrimonios(undefined, true);
                    }
                  }}
                  placeholder="Ex: PAT001"
                  className="w-full rounded-lg border px-10 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-8 gap-2 border border-border bg-background px-3 text-xs text-foreground hover:bg-secondary"
                onClick={() => setLeitorAberto(true)}
                disabled={!canSaveInventario}>
                <QrCode className="h-4 w-4" />
                Ler QR-Code / Barras
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-8 gap-2 border-emerald-200 bg-emerald-50 px-3 text-xs text-emerald-800 hover:bg-emerald-100"
                onClick={() => adicionarItem()}
                disabled={!canSaveInventario}
              >
                <Plus className="h-4 w-4" />
                Adicionar linha
              </Button>
            </div>
          </div>

          {resultadosBusca.length > 0 && (
            <div className="mt-2.5 grid gap-2.5 xl:grid-cols-2">
              {(() => {
                const patrimonio = resultadosBusca[0];
                return (
                  <>
                    <div className="rounded-xl border border-border bg-background p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Patrimônio localizado
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-900">
                            {patrimonio.idPat}
                          </p>
                          <p className="text-xs text-slate-600">
                            {patrimonio.descricaoPat}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 px-2 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-green-800"
                          onClick={() => adicionarItem(patrimonio)}
                          disabled={!canSaveInventario}
                        >
                          <Plus className="h-4 w-4" />
                          Incluir
                        </Button>
                      </div>
                      <div className="mt-2.5 grid grid-cols-1 gap-1.5 text-[11px] text-slate-500 sm:grid-cols-2">
                        <div>
                          Valor:
                          <span className="ml-1 font-semibold text-slate-700">
                            {formatarMoeda(patrimonio.valorPat || 0)}
                          </span>
                        </div>
                        <div>
                          Centro:
                          <span className="ml-1 font-semibold text-slate-700">
                            {patrimonio.tbCCusto?.descricaoCCusto || '-'}
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          Status:
                          <span className={`ml-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusPatBadgeClass(patrimonio.tbStatusPat?.descricaoStatPat)}`}>
                            {patrimonio.tbStatusPat?.descricaoStatPat || '-'}
                          </span>
                        </div>
                        {resultadosBusca.length > 1 && (
                          <div className="sm:col-span-2 text-[10px] text-slate-400">
                            {resultadosBusca.length - 1} resultado(s) adicional(is) encontrado(s) pela mesma busca.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Funcionário vinculado
                          </p>
                          <p className={`mt-0.5 text-sm font-semibold ${alocacaoVinculada?.tbFuncionario ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {carregandoVinculo
                              ? 'Consultando vínculo...'
                              : alocacaoVinculada?.tbFuncionario?.nomeFun || 'Nenhum funcionário vinculado'}
                          </p>
                          <p className="text-xs text-slate-600">
                            {carregandoVinculo
                              ? 'Aguarde enquanto verificamos a alocação do patrimônio.'
                              : alocacaoVinculada?.tbFuncionario?.idMatFun || 'O patrimônio não possui vínculo ativo localizado.'}
                          </p>
                        </div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${alocacaoVinculada?.tbFuncionario && !alocacaoVinculada?.dataDevPat ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {alocacaoVinculada?.tbFuncionario && !alocacaoVinculada?.dataDevPat ? 'Vínculo ativo' : 'Sem vínculo ativo'}
                        </span>
                      </div>

                      <div className="mt-2.5 grid gap-1.5 text-[11px] text-slate-500">
                        <div>
                          Função:
                          <span className="ml-1 font-semibold text-slate-700">
                            {alocacaoVinculada?.tbFuncionario?.tbFuncao?.nomeFuncao || '-'}
                          </span>
                        </div>
                        <div>
                          Centro do funcionário:
                          <span className="ml-1 font-semibold text-slate-700">
                            {alocacaoVinculada?.tbFuncionario?.tbCCusto?.descricaoCCusto || '-'}
                          </span>
                        </div>
                        <div>
                          Data da alocação:
                          <span className="ml-1 font-semibold text-slate-700">
                            {alocacaoVinculada?.dataCadPat
                              ? new Intl.DateTimeFormat('pt-BR').format(new Date(alocacaoVinculada.dataCadPat))
                              : '-'}
                          </span>
                        </div>
                        <div>
                          Situação:
                          <span className={`ml-1 inline-flex rounded-full px-2 py-1 font-semibold ${alocacaoVinculada?.dataDevPat ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {alocacaoVinculada?.dataDevPat ? 'Devolvido' : 'Ativo'}
                          </span>
                        </div>
                        {alocacaoVinculada?.dataDevPat && (
                          <div className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] text-red-700">
                            Este patrimônio já foi devolvido, então não há vínculo ativo para exibição.
                          </div>
                        )}
                        {alocacaoVinculada?.tbFuncionario?.idF && (
                          <div className="pt-1.5">
                            <Link
                              href={`/funcionarios/${alocacaoVinculada.tbFuncionario.idF}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                            >
                              Abrir cadastro do funcionário
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </section>

        {leitorAberto && (
          <section className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
            <div className="w-full max-w-[1180px] rounded-2xl border border-border/60 bg-card/95 p-3 shadow-2xl lg:max-w-[700px] xl:max-w-[760px]">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Leitor de QR-Code / Código de Barras</h2>
                  <p className="text-xs text-muted-foreground">
                    Posicione o código na câmera. Quando o código for lido, a busca será executada automaticamente.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 gap-2 border-red-200 bg-red-50 px-3 text-xs text-red-700 hover:bg-red-100"
                  onClick={() => setLeitorAberto(false)}
                >
                  <X className="h-4 w-4" />
                  Fechar leitor
                </Button>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_260px]">
                <div className="overflow-hidden rounded-2xl border border-border bg-background">
                  <video
                    ref={videoRef}
                    className="h-[30vh] min-h-[200px] w-full object-cover lg:h-[300px]"
                    muted
                    playsInline
                  />
                </div>
                <div className="rounded-2xl border border-border bg-background p-2.5">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Camera className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">Status do leitor</h3>
                  </div>
                  <div className="mt-2.5">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Câmera
                    </label>
                    <select
                      value={cameraSelecionada}
                      onChange={(e) => setCameraSelecionada(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Câmera automática</option>
                      {dispositivosCamera.map((device, index) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Câmera ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    {leitorCarregando
                      ? 'Iniciando câmera...'
                      : leitorErro
                        ? leitorErro
                        : 'Aguardando leitura do código.'}
                  </p>
                  <div className="mt-2.5 rounded-xl border border-dashed border-border bg-background p-2 text-[11px] text-muted-foreground">
                    Se a câmera não abrir, use o campo de busca acima e pressione Enter.
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Itens do inventário</h2>
              <p className="text-[11px] text-muted-foreground">
                Ajuste os itens manualmente se quiser registrar um bem não localizado na busca.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              <span>Total: {itensResumo.total}</span>
              <span>Conferidos: {itensResumo.conferidos}</span>
              <span>Divergentes: {itensResumo.divergentes}</span>
              <span>Não encontrados: {itensResumo.naoEncontrados}</span>
              <span>Não inventariados: {itensResumo.naoInventariados}</span>
            </div>
          </div>
          {inventario.centroCusto && (
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span>No custo selecionado: {itensResumo.itensDoCustoSelecionado}</span>
              <span>Não inventariados nesse custo: {itensResumo.naoInventariadosNoCustoSelecionado}</span>
            </div>
          )}

          <div className="mt-2 overflow-x-auto">
            <table className="min-w-[1080px] w-full border-collapse">
              <thead>
                <tr className="border-b bg-background text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Descrição</th>
                  <th className="px-2 py-2">Valor</th>
                  <th className="px-2 py-2">Centro</th>
                  <th className="px-2 py-2">Local</th>
                  <th className="px-2 py-2">Responsável</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventario.itens.length === 0 ? (
                  <TableEmptyState
                    colSpan={8}
                    Icon={BookAlertIcon}
                    title="Nenhum item adicionado"
                    description="Use a busca acima para carregar patrimônios neste inventário."
                  />
                ) : (
                  inventario.itens.map((item, index) => (
                    <tr
                      key={`${item.idPat || 'novo'}-${index}`}
                      className={`border-b align-top transition-colors ${getRowClassName(item.statusConferencia)}`}
                    >
                      <td className="px-2 py-2 text-xs font-medium text-slate-800">
                        {item.idPat || '-'}
                      </td>
                      <td className="px-2 py-2 text-xs text-slate-700">
                        {item.descricaoPat || '-'}
                      </td>
                      <td className="px-2 py-2 text-xs text-slate-700">
                        {item.valorPat ? formatarMoeda(item.valorPat) : '-'}
                      </td>
                      <td className="px-2 py-2 text-xs text-slate-700">
                        <span className="inline-flex max-w-full rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
                          {(() => {
                            const centroId = item.centroCusto || inventario.centroCusto;
                            const centro = centros.find((c) => c.idCCusto === centroId);
                            return centro
                              ? `${centro.codigoCCusto ? `${centro.codigoCCusto} - ` : ''}${centro.descricaoCCusto || 'Sem descrição'}`
                              : centroId || '-';
                        })()}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-xs text-slate-700">
                        {item.localInventario || '-'}
                      </td>
                      <td className="px-2 py-2 text-xs text-slate-700">
                        {primeiroNome(item.responsavelInventario || responsavelLogadoPrimeiroNome) || '-'}
                      </td>
                      <td className="px-2 py-2 text-xs text-slate-700">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusInventarioOptions.find((status) => status.value === item.statusConferencia)?.className || 'bg-slate-100 text-slate-700'}`}>
                          {statusInventarioOptions.find((status) => status.value === item.statusConferencia)?.label || item.statusConferencia}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1.5 px-2 text-[11px] text-red-700 hover:bg-red-50 hover:text-red-800"
                          onClick={() => removerItem(index)}
                          disabled={!canSaveInventario}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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



      </form>
    </div>
  );
}

