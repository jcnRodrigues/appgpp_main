'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import {
  Search,
  Monitor,
  Keyboard,
  Mouse,
  Server,
  User,
  RefreshCw,
  ClipboardCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notify as showNotify } from '@/lib/notify';

type Peripheral = {
  categoria: 'MONITOR' | 'TECLADO' | 'MOUSE';
  codigo: string;
  nome: string;
  hostname: string | null;
  serial: string | null;
  modelo: string | null;
  fabricante: string | null;
  local: string | null;
  status: string | null;
  origem: string;
};

type AgentResponse = {
  consulta: {
    hostname: string;
    hostnameNormalizado: string;
    modo?: string;
  };
  modoConsulta?: string;
  conectado: boolean;
  dispositivoPrincipal: {
    id: string;
    hostname: string | null;
    siteName: string;
    ip: string | null;
    mac: string | null;
    serial: string | null;
    modelo: string | null;
    status: string | null;
    note: string | null;
  } | null;
  identificador8021x: {
    raw: string;
    nome: string;
    usuario: string;
    origem: string;
  } | null;
  fonte8021xConfigurada?: {
    origem: string;
    notas: string | null;
  };
  usuarioEstimado: {
    nome: string;
    origem: string;
  } | null;
  usuarioRadius?: {
    nome: string;
    origem: string;
    fonte: string | null;
  } | null;
  inventarioSistema: {
    hostname?: string;
    computerName?: string;
    domain?: string | null;
    usuario?: string | null;
    fabricante?: string | null;
    modelo?: string | null;
    serial?: string | null;
    sistemaOperacional?: string | null;
    versaoOS?: string | null;
    buildNumber?: string | null;
    ultimoBoot?: string | null;
    ipPrincipal?: string | null;
    adaptadores?: unknown[];
    perifericos?: {
      monitor?: Array<{ Name?: string; Manufacturer?: string; Serial?: string; InstanceName?: string; Source?: string }>;
      teclado?: Array<{ Name?: string; Manufacturer?: string; InstanceId?: string; Status?: string; Source?: string }>;
      mouse?: Array<{ Name?: string; Manufacturer?: string; InstanceId?: string; Status?: string; Source?: string }>;
    };
    collectedAt?: string;
  } | null;
  statusAgente?: {
    codigo: 'ATIVO' | 'DESATUALIZADO' | 'SEM_RETORNO';
    titulo: string;
    detalhe: string;
    collectedAt: string | null;
  };
  perifericos: {
    MONITOR: Peripheral[];
    TECLADO: Peripheral[];
    MOUSE: Peripheral[];
  };
  ativosRelacionados: Peripheral[];
  resumo: {
    totalConsoles: number;
    totalDevices: number;
    totalClients: number;
    totalPerifericos: number;
  };
};

function formatarStatus(status?: string | null) {
  const texto = String(status || '').trim();
  if (!texto) return '-';
  return texto;
}

function limparTextoExibicao(value?: string | null) {
  const texto = String(value || '').trim();
  if (!texto) return '-';

  return texto
    .replace(/Padr\uFFFDo/g, 'Padrão')
    .replace(/compat\uFFFDvel/g, 'compatível')
    .replace(/padr\uFFFDes/g, 'padrões')
    .replace(/Usu\uFFFDrio/g, 'Usuário')
    .replace(/Dom\uFFFDnio/g, 'Domínio')
    .replace(/Vers\uFFFDo/g, 'Versão')
    .replace(/Conex\uFFFDo/g, 'Conexão')
    .replace(/Informa\uFFFD\uFFFDes/g, 'Informações')
    .replace(/Invent\uFFFDrio/g, 'Inventário')
    .replace(/A\uFFFD\uFFFDo/g, 'Ação')
    .replace(/\uFFFD/g, '');
}

function getModoConsultaLabel(modo: 'HIBRIDO' | 'REDE' | 'INTERNET') {
  if (modo === 'REDE') return 'Rede/VPN';
  if (modo === 'INTERNET') return 'Internet';
  return 'Híbrido';
}

function getConexaoVisual(conectado: boolean) {
  return conectado
    ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
    : 'border-rose-400/30 bg-rose-500/10 text-rose-100';
}

function getStatusAgenteVisual(codigo?: 'ATIVO' | 'DESATUALIZADO' | 'SEM_RETORNO') {
  if (codigo === 'ATIVO') {
    return {
      className: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
      icon: CheckCircle2,
    };
  }

  if (codigo === 'DESATUALIZADO') {
    return {
      className: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
      icon: Clock3,
    };
  }

  return {
    className: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
    icon: AlertTriangle,
  };
}

function getRadiusVisual(origem?: string | null) {
  const origemNormalizada = String(origem || '').toLowerCase();
  if (origemNormalizada.includes('free')) {
    return {
      borderClass: 'border-l-4 border-l-cyan-400',
      badgeClass: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    };
  }

  return {
    borderClass: 'border-l-4 border-l-indigo-400',
    badgeClass: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  };
}

function PeripheralCard({ title, icon: Icon, itens }: { title: string; icon: ElementType; itens: Peripheral[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h3>
      </div>
      <div className="mt-3 space-y-3">
        {itens.length === 0 ? (
          <p className="text-sm leading-6 text-slate-500">Nenhum periférico correspondente foi detectado automaticamente.</p>
        ) : (
          itens.map((item, index) => (
            <div key={`${item.codigo || item.nome}-${index}`} className="rounded-xl bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{limparTextoExibicao(item.nome)}</p>
                  <p className="text-xs leading-5 text-slate-500">
                    {limparTextoExibicao(item.fabricante)} {item.modelo ? `| ${limparTextoExibicao(item.modelo)}` : ''}
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white">
                  {item.categoria}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-600 sm:grid-cols-2">
                <div>Código: {limparTextoExibicao(item.codigo)}</div>
                <div>N/S: {limparTextoExibicao(item.serial)}</div>
                <div>Hostname: {limparTextoExibicao(item.hostname)}</div>
                <div>Local: {limparTextoExibicao(item.local)}</div>
                <div>Status: {formatarStatus(item.status)}</div>
                <div>Origem: {limparTextoExibicao(item.origem)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AgenteInventarioForm() {
  const [hostname, setHostname] = useState('');
  const [modoConsulta, setModoConsulta] = useState<'HIBRIDO' | 'REDE' | 'INTERNET'>('HIBRIDO');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<AgentResponse | null>(null);
  const modoAnteriorRef = useRef(modoConsulta);

  useEffect(() => {
    if (modoAnteriorRef.current === modoConsulta) return;
    modoAnteriorRef.current = modoConsulta;
    showNotify('aviso', `Modo alterado para ${getModoConsultaLabel(modoConsulta)}.`);
  }, [modoConsulta]);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const termo = hostname.trim();
    if (!termo) {
      showNotify('aviso', 'Informe um hostname para iniciar a consulta.');
      return;
    }

    setLoading(true);
    setErro('');
    try {
      const response = await fetch(
        `/api/monitor-patrimonios/agente?hostname=${encodeURIComponent(termo)}&modo=${modoConsulta}`,
        { cache: 'no-store' }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao consultar o host.');
      }

      setResultado(data as AgentResponse);
      if (!data.dispositivoPrincipal && !data.usuarioEstimado && (data.resumo?.totalPerifericos || 0) === 0) {
        showNotify('aviso', 'Nenhum registro foi identificado automaticamente para este hostname.');
      } else {
        showNotify('sucesso', 'Consulta concluída com sucesso.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao consultar o host.';
      setErro(message);
      showNotify('erro', message);
    } finally {
      setLoading(false);
    }
  };

  const baixarScript = async () => {
    try {
      const serverUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(
        `/api/monitor-patrimonios/agente/script?serverUrl=${encodeURIComponent(serverUrl)}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível gerar o script.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'HostInventoryAgent.ps1';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showNotify('sucesso', 'Instalador do agente gerado com sucesso.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível gerar o script.';
      showNotify('erro', message);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={buscar}
        className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[1.05fr_1.95fr] xl:items-start">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-slate-900">Agente de Inventário</h2>
            <p className="mt-1 text-sm text-slate-600">
              Informe o hostname para consultar o ativo principal, o usuário estimado e os periféricos vinculados.
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative w-full grid gap-2 md:grid-cols-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                placeholder="Ex: PAT0000"
                className="w-full rounded-lg border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" />
                  : <ClipboardCheck className="h-4 w-4" />}
                {loading ? 'Consultando...' : 'Consultar host'}
              </Button>
              <Button type="button"
                variant="outline"
                className="gap-2" onClick={baixarScript}>
                <Download className="h-4 w-4" />
                Baixar instalador
              </Button>
            </div>
            <div className="grid w-full gap-2 md:grid-cols-3">
              {[
                { value: 'HIBRIDO', label: 'Híbrido', help: 'Rede + agente' },
                { value: 'REDE', label: 'Rede/VPN', help: 'Apenas infraestrutura' },
                { value: 'INTERNET', label: 'Internet', help: 'Apenas agente' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setModoConsulta(option.value as 'HIBRIDO' | 'REDE' | 'INTERNET')}
                  className={`rounded-lg border px-3 py-2 text-left transition ${modoConsulta === option.value
                    ? 'border-green-900 bg-green-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wide">{option.label}</div>
                  <div className={`text-[11px] ${modoConsulta === option.value ? 'text-slate-200' : 'text-slate-500'}`}>
                    {option.help}
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
      </form>

      {resultado && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Hostname pesquisado</p>
                <h3 className="mt-2 text-2xl font-semibold">{resultado.consulta.hostname || '-'}</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  Resumo da consulta ao hostname selecionado, com status de conexão, modo de consulta e dados do host.
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2 text-xs">
                <span className={`rounded-full border px-3 py-1 ${getConexaoVisual(resultado.conectado)}`}>
                  {resultado.conectado ? 'Online' : 'Offline'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-100">
                  {resultado.modoConsulta
                    ? getModoConsultaLabel(resultado.modoConsulta as 'HIBRIDO' | 'REDE' | 'INTERNET')
                    : getModoConsultaLabel(modoConsulta)}
                </span>
                {resultado.statusAgente && (() => {
                  const visual = getStatusAgenteVisual(resultado.statusAgente.codigo);
                  const StatusIcon = visual.icon;
                  return (
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 ${visual.className}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {resultado.statusAgente.titulo}
                      </span>
                      {resultado.statusAgente.collectedAt && (
                        <span className="whitespace-nowrap text-[11px] text-slate-300">
                          Última coleta: {new Date(resultado.statusAgente.collectedAt).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {resultado.statusAgente && resultado.statusAgente.codigo !== 'ATIVO' && (
              <div
                className={`mt-5 rounded-xl border p-4 text-sm ${resultado.statusAgente.codigo === 'DESATUALIZADO'
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-100'
                  : 'border-red-500/30 bg-red-500/10 text-red-100'
                  }`}
              >
                <p className="font-semibold">{resultado.statusAgente.titulo}</p>
                <p
                  className={`mt-1 ${resultado.statusAgente.codigo === 'DESATUALIZADO' ? 'text-yellow-50/90' : 'text-red-50/90'
                    }`}
                >
                  {resultado.statusAgente.detalhe}
                </p>
              </div>
            )}

          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-slate-700" />
                <h3 className="font-semibold text-slate-900">Equipamento principal</h3>
              </div>
              {resultado.dispositivoPrincipal ? (
                <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                  <p><span className="font-medium">Hostname:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.hostname)}</p>
                  <p><span className="font-medium">Site:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.siteName)}</p>
                  <p><span className="font-medium">IP:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.ip)}</p>
                  <p><span className="font-medium">MAC:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.mac)}</p>
                  <p><span className="font-medium">N/S:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.serial)}</p>
                  <p><span className="font-medium">Modelo:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.modelo)}</p>
                  <p><span className="font-medium">Status:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.status)}</p>
                  {resultado.dispositivoPrincipal.note && (
                    <p><span className="font-medium">Nota:</span> {limparTextoExibicao(resultado.dispositivoPrincipal.note)}</p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Nenhum equipamento principal foi identificado para este hostname.</p>
              )}
              {resultado.fonte8021xConfigurada && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Origem configurada</p>
                  <p>Fonte: {limparTextoExibicao(resultado.fonte8021xConfigurada.origem)}</p>
                  {resultado.fonte8021xConfigurada.notas && (
                    <p className="mt-1 whitespace-pre-line text-xs text-slate-500">
                      {limparTextoExibicao(resultado.fonte8021xConfigurada.notas)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-700" />
                <h3 className="font-semibold text-slate-900">
                  {resultado.usuarioRadius ? 'Usuário estimado via RADIUS' : 'Usuário estimado'}
                </h3>
                {resultado.usuarioRadius && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    {resultado.usuarioRadius.origem.toLowerCase().includes('free') ? 'FreeRADIUS' : 'Windows NPS'}
                  </span>
                )}
              </div>
              {resultado.usuarioRadius ? (
                <div
                  className={`mt-4 space-y-2 rounded-xl border bg-emerald-50 p-4 text-sm text-emerald-950 ${getRadiusVisual(resultado.usuarioRadius.origem).borderClass}`}
                >
                  <p className="font-semibold">Retorno RADIUS</p>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getRadiusVisual(resultado.usuarioRadius.origem).badgeClass}`}
                  >
                    {resultado.usuarioRadius.origem.toLowerCase().includes('free') ? 'FreeRADIUS' : 'Windows NPS'}
                  </span>
                  <p>Usuário: {limparTextoExibicao(resultado.usuarioRadius.nome)}</p>
                  <p>Origem: {limparTextoExibicao(resultado.usuarioRadius.origem)}</p>
                  {resultado.usuarioRadius.fonte && (
                    <p className="text-xs text-emerald-900/70">Fonte: {limparTextoExibicao(resultado.usuarioRadius.fonte)}</p>
                  )}
                </div>
              ) : resultado.usuarioEstimado ? (
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p><span className="font-medium">Nome:</span> {limparTextoExibicao(resultado.usuarioEstimado.nome)}</p>
                  <p><span className="font-medium">Origem:</span> {limparTextoExibicao(resultado.usuarioEstimado.origem)}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Nenhum usuário pôde ser identificado com segurança.</p>
              )}
              {resultado.identificador8021x && !resultado.usuarioRadius && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-900">
                  <p className="font-semibold">Identificador 802.1x</p>
                  <p>Nome: {limparTextoExibicao(resultado.identificador8021x.nome)}</p>
                  <p>Usuário: {limparTextoExibicao(resultado.identificador8021x.usuario)}</p>
                  <p>Origem: {limparTextoExibicao(resultado.identificador8021x.origem)}</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-slate-700" />
              <h3 className="font-semibold text-slate-900">Informações do sistema</h3>
            </div>
            {resultado.inventarioSistema ? (
              <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-3">
                <p><span className="font-medium">Hostname:</span> {limparTextoExibicao(resultado.inventarioSistema.hostname)}</p>
                <p><span className="font-medium">Computador:</span> {limparTextoExibicao(resultado.inventarioSistema.computerName)}</p>
                <p><span className="font-medium">Usuário:</span> {limparTextoExibicao(resultado.inventarioSistema.usuario)}</p>
                <p><span className="font-medium">Domínio:</span> {limparTextoExibicao(resultado.inventarioSistema.domain)}</p>
                <p><span className="font-medium">Fabricante:</span> {limparTextoExibicao(resultado.inventarioSistema.fabricante)}</p>
                <p><span className="font-medium">Modelo:</span> {limparTextoExibicao(resultado.inventarioSistema.modelo)}</p>
                <p><span className="font-medium">Serial:</span> {limparTextoExibicao(resultado.inventarioSistema.serial)}</p>
                <p><span className="font-medium">SO:</span> {limparTextoExibicao(resultado.inventarioSistema.sistemaOperacional)}</p>
                <p><span className="font-medium">Versão:</span> {limparTextoExibicao(resultado.inventarioSistema.versaoOS)}</p>
                <p><span className="font-medium">Build:</span> {limparTextoExibicao(resultado.inventarioSistema.buildNumber)}</p>
                <p><span className="font-medium">IP principal:</span> {limparTextoExibicao(resultado.inventarioSistema.ipPrincipal)}</p>
                <p><span className="font-medium">Coletado em:</span> {limparTextoExibicao(resultado.inventarioSistema.collectedAt)}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Nenhum inventário do host foi recebido ainda. Instale o agente para coletar os dados do sistema.
              </p>
            )}
          </section>

          {resultado.inventarioSistema?.perifericos && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-slate-700" />
                <h3 className="font-semibold text-slate-900">Periféricos do host</h3>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Monitores detectados</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {resultado.inventarioSistema.perifericos.monitor?.length || 0} encontrado(s)
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {(resultado.inventarioSistema.perifericos.monitor || []).slice(0, 5).map((item, index) => (
                      <li key={`${item.InstanceName || item.Serial || index}`} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                        <p className="font-medium">{item.Name || 'Monitor'}</p>
                        <p className="text-xs text-slate-500">
                          {item.Manufacturer || '-'} {item.Serial ? `| N/S ${item.Serial}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Teclados detectados</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {resultado.inventarioSistema.perifericos.teclado?.length || 0} encontrado(s)
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {(resultado.inventarioSistema.perifericos.teclado || []).slice(0, 5).map((item, index) => (
                      <li key={`${item.InstanceId || index}`} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                        <p className="font-medium">{item.Name || 'Teclado'}</p>
                        <p className="text-xs text-slate-500">
                          {item.Manufacturer || '-'} {item.Status ? `| ${item.Status}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Mouses detectados</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {resultado.inventarioSistema.perifericos.mouse?.length || 0} encontrado(s)
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {(resultado.inventarioSistema.perifericos.mouse || []).slice(0, 5).map((item, index) => (
                      <li key={`${item.InstanceId || index}`} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                        <p className="font-medium">{item.Name || 'Mouse'}</p>
                        <p className="text-xs text-slate-500">
                          {item.Manufacturer || '-'} {item.Status ? `| ${item.Status}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <PeripheralCard title="Monitor" icon={Monitor} itens={resultado.perifericos.MONITOR} />
            <PeripheralCard title="Teclado" icon={Keyboard} itens={resultado.perifericos.TECLADO} />
            <PeripheralCard title="Mouse" icon={Mouse} itens={resultado.perifericos.MOUSE} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Ativos vinculados ao hostname consultado</h3>
            {resultado.ativosRelacionados.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Nenhum ativo de rede compatível foi encontrado para esta consulta.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Categoria</th>
                      <th className="px-3 py-2">Código</th>
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">Hostname</th>
                      <th className="px-3 py-2">N/S</th>
                      <th className="px-3 py-2">Local</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.ativosRelacionados.map((item, index) => (
                      <tr key={`${item.codigo}-${index}`} className="border-b">
                        <td className="px-3 py-2">{item.categoria}</td>
                        <td className="px-3 py-2">{item.codigo || '-'}</td>
                        <td className="px-3 py-2">{item.nome || '-'}</td>
                        <td className="px-3 py-2">{item.hostname || '-'}</td>
                        <td className="px-3 py-2">{item.serial || '-'}</td>
                        <td className="px-3 py-2">{item.local || '-'}</td>
                        <td className="px-3 py-2">{formatarStatus(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
