'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { hasModuleActionPermission } from '@/lib/permissions';

interface SystemConfigResponse {
  config: {
    publicUrl?: string;
    identitySource?: 'UNIFI' | 'WINDOWS_NPS' | 'FREERADIUS';
    identitySourceNotes?: string;
  } | null;
  effectivePublicUrl?: string;
  effectivePublicUrlSource?: 'explicit' | 'config' | 'env' | 'request' | 'unknown';
}

export default function SystemConfigForm() {
  const { data: session } = useSession();
  const [publicUrl, setPublicUrl] = useState('');
  const [identitySource, setIdentitySource] = useState<'UNIFI' | 'WINDOWS_NPS' | 'FREERADIUS'>('UNIFI');
  const [identitySourceNotes, setIdentitySourceNotes] = useState('');
  const [effectivePublicUrl, setEffectivePublicUrl] = useState('');
  const [effectivePublicUrlSource, setEffectivePublicUrlSource] = useState<SystemConfigResponse['effectivePublicUrlSource']>('unknown');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canUpdate = hasModuleActionPermission(formularios, 'SISTEMA', 'UPDATE');

  const identitySourceOptions = [
    { value: 'UNIFI', label: 'UniFi', help: 'Origem inicial do identificador 802.1x.' },
    { value: 'WINDOWS_NPS', label: 'Radius / NPS', help: 'Integração com eventos do Windows NPS.' },
    { value: 'FREERADIUS', label: 'Radius / FreeRADIUS', help: 'Integração com logs do FreeRADIUS.' },
  ] as const;

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/system-config');
      const data = (await response.json()) as SystemConfigResponse;
      setPublicUrl(data.config?.publicUrl || '');
      setIdentitySource(data.config?.identitySource || 'UNIFI');
      setIdentitySourceNotes(data.config?.identitySourceNotes || '');
      setEffectivePublicUrl(data.effectivePublicUrl || '');
      setEffectivePublicUrlSource(data.effectivePublicUrlSource || 'unknown');
    } catch (error) {
      console.error('Erro ao carregar configuracao do sistema:', error);
    }
  };

  const handleSave = async () => {
    if (!canUpdate) {
      window.systemAlert?.('aviso', 'Voce nao tem permissao para alterar a configuracao do sistema.');
      return;
    }

    setLoading(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/system-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicUrl,
          identitySource,
          identitySourceNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configuracao do sistema');
      }

      const data = (await response.json()) as SystemConfigResponse;
      setPublicUrl(data.config?.publicUrl || '');
      setIdentitySource(data.config?.identitySource || 'UNIFI');
      setIdentitySourceNotes(data.config?.identitySourceNotes || '');
      setEffectivePublicUrl(data.effectivePublicUrl || '');
      setEffectivePublicUrlSource(data.effectivePublicUrlSource || 'unknown');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError((error as Error).message || 'Erro ao salvar configuracao do sistema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Configuração do sistema</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Centralize aqui a URL pública e a origem Radius usada pelo agente.
        </p>
      </div>

      <div className="mb-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 shadow-sm dark:border-blue-400/30 dark:bg-blue-950/35">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          URL pública efetiva
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white dark:bg-slate-100 dark:text-slate-900">
            {effectivePublicUrlSource === 'config'
              ? 'Configuração'
              : effectivePublicUrlSource === 'env'
                ? '.env'
                : effectivePublicUrlSource === 'explicit'
                  ? 'Chamado explícito'
                  : effectivePublicUrlSource === 'request'
                    ? 'Requisição'
                    : 'Indefinido'}
          </span>
          <span className="break-all text-sm font-medium text-slate-950 dark:text-slate-100">
            {effectivePublicUrl || 'Nenhuma URL pública configurada ainda'}
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 p-3 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-950/30 dark:text-green-300">
          Configuração do sistema salva com sucesso.
        </div>
      )}

      {saveError && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-300">
          {saveError}
        </div>
      )}

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-foreground">Endereço externo</label>
        <input
          type="text"
          value={publicUrl}
          onChange={(e) => setPublicUrl(e.target.value)}
          className="w-full rounded border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground"
          placeholder="https://app.seudominio.com"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Essa URL deve ser acessível pelos computadores da rede e também pela internet, se for o seu caso.
        </p>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-foreground">Origem do Radius</label>
        <div className="grid gap-3 md:grid-cols-3">
          {identitySourceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setIdentitySource(option.value)}
              className={`rounded-xl border p-4 text-left transition ${
                identitySource === option.value
                  ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/40 dark:bg-blue-950/30'
                  : 'border-border bg-card hover:border-blue-400/50 hover:bg-muted/60'
              }`}
            >
              <div className="text-sm font-semibold text-foreground">{option.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{option.help}</div>
            </button>
          ))}
        </div>
      </div>

      {identitySource !== 'UNIFI' && (
        <div className="mb-6 rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 dark:border-amber-400/30 dark:bg-amber-950/25">
          <label className="mb-2 block text-sm font-medium text-foreground">Observações da origem Radius selecionada</label>
          <textarea
            value={identitySourceNotes}
            onChange={(e) => setIdentitySourceNotes(e.target.value)}
            className="min-h-[110px] w-full rounded border border-input bg-background p-2 text-foreground placeholder:text-muted-foreground"
            placeholder="Ex: nome do servidor NPS, caminho do log do FreeRADIUS ou observações de integração"
          />
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? 'Salvando...' : 'Salvar Sistema'}
        </button>
      </div>
    </div>
  );
}
