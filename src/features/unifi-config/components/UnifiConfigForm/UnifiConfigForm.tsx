'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { hasModuleActionPermission } from '@/lib/permissions';

interface UnifiConfig {
  id?: string;
  type: 'local' | 'cloud';
  identitySource?: 'UNIFI' | 'WINDOWS_NPS' | 'FREERADIUS';
  identitySourceNotes?: string;
  apiKey?: string;
  host?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
}

interface ConsoleData {
  id: string;
  name: string;
  type: string;
  status: string;
}

export default function UnifiConfigForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [config, setConfig] = useState<UnifiConfig>({ type: 'cloud', identitySource: 'UNIFI' });
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [consoles, setConsoles] = useState<ConsoleData[]>([]);
  const [loadingConsoles, setLoadingConsoles] = useState(false);
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canCreate = hasModuleActionPermission(formularios, 'UNIFI_CONFIG', 'CREATE');
  const canUpdate = hasModuleActionPermission(formularios, 'UNIFI_CONFIG', 'UPDATE');
  const canDelete = hasModuleActionPermission(formularios, 'UNIFI_CONFIG', 'DELETE');

  const identitySourceOptions = [
    { value: 'UNIFI', label: 'UniFi', help: 'Usa a base UniFi como origem inicial do identificador 802.1x.' },
    { value: 'WINDOWS_NPS', label: 'Windows NPS', help: 'Prepara a configuração para leitura de eventos/integração com NPS.' },
    { value: 'FREERADIUS', label: 'FreeRADIUS', help: 'Prepara a configuração para leitura de logs/integração com FreeRADIUS.' },
  ] as const;

  const showNoPermissionAlert = (acao: string) => {
    window.systemAlert?.('aviso', `Você não tem permissão para ${acao}.`);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/unifi-config');
      const data = await response.json();
      if (data.config) {
        setConfig({
          type: 'cloud',
          identitySource: 'UNIFI',
          ...data.config,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const loadConsoles = async (apiKey: string) => {
    if (!apiKey) return;
    setLoadingConsoles(true);
    try {
      const response = await fetch('/api/monitor-patrimonios/consoles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json();
      setConsoles(data.consoles || []);
    } catch (error) {
      console.error('Erro ao carregar consoles:', error);
      setConsoles([]);
    } finally {
      setLoadingConsoles(false);
    }
  };

  const handleChange = (field: keyof UnifiConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!(canCreate || canUpdate)) {
      showNoPermissionAlert('adicionar ou alterar registros');
      return;
    }

    setLoading(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/unifi-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configuração');
      }

      await response.json();

      // Se for tipo cloud e tem API Key, carregar consoles
      if (config.type === 'cloud' && config.apiKey) {
        await loadConsoles(config.apiKey);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError((error as Error).message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmou = window.systemConfirm
      ? await window.systemConfirm('Tem certeza que deseja deletar esta configuração?', 'Confirmar exclusão', {
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      })
      : window.confirm('Tem certeza que deseja deletar esta configuração?');
    if (!confirmou) return;

    setLoading(true);
    try {
      const response = await fetch('/api/unifi-config', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar configuração');
      }

      setConfig({ type: 'cloud', identitySource: 'UNIFI' });
      setConsoles([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError((error as Error).message || 'Erro ao deletar');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchConsoles = () => {
    if (config.apiKey) {
      loadConsoles(config.apiKey);
    }
  };

  const handleOpenMonitor = () => {
    if (config.apiKey) {
      router.push('/monitor-patrimonios');
    } else {
      setSaveError('Salve a API Key primeiro antes de abrir o monitor');
    }
  };

  const handleDeleteClick = () => {
    if (!canDelete) {
      showNoPermissionAlert('excluir registros');
      return;
    }
    handleDelete();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Configuração do Ubiquiti Unifi</h2>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Configuração salva com sucesso!
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {saveError}
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-2 font-medium">Tipo de Conexão:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="cloud"
              checked={config.type === 'cloud'}
              onChange={(e) => handleChange('type', e.target.value as 'cloud' | 'local')}
              className="mr-2"
            />
            Ubiquiti Cloud API
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="local"
              checked={config.type === 'local'}
              onChange={(e) => handleChange('type', e.target.value as 'cloud' | 'local')}
              className="mr-2"
            />
            Unifi Controller Local
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Origem do 802.1x:</label>
        <div className="grid gap-3 md:grid-cols-3">
          {identitySourceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange('identitySource', option.value)}
              className={`rounded-xl border p-4 text-left transition ${
                config.identitySource === option.value
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">{option.label}</div>
              <div className="mt-1 text-xs text-gray-500">{option.help}</div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          UniFi continua como origem inicial. Windows NPS e FreeRADIUS ficam prontos para a próxima etapa de integração.
        </p>
      </div>

      {config.identitySource !== 'UNIFI' && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <label className="block mb-2 font-medium">Observações da origem selecionada:</label>
          <textarea
            value={config.identitySourceNotes || ''}
            onChange={(e) => handleChange('identitySourceNotes', e.target.value)}
            className="min-h-[110px] w-full rounded border border-amber-200 p-2"
            placeholder="Ex: nome do servidor NPS, caminho do log do FreeRADIUS ou observações de integração"
          />
        </div>
      )}

      {config.type === 'cloud' ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">X-API-Key:</label>
            <input
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Sua chave de API da Ubiquiti"
            />
            <p className="text-xs text-gray-500 mt-2">
              Gere a chave no{' '}
              <a
                href="https://unifi.ui.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Site Manager
                <ExternalLink className="h-3 w-3" />
              </a>
              .
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Host do Controller:</label>
            <input
              type="text"
              value={config.host || ''}
              onChange={(e) => handleChange('host', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="ex: https://unifi.example.com"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Usuário:</label>
            <input
              type="text"
              value={config.username || ''}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Usuário do controller"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Senha:</label>
            <input
              type="password"
              value={config.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Senha do controller"
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Salvando...' : 'Salvar Configuração'}
        </button>
        {config.id && (
          <button
            onClick={handleDeleteClick}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            title="Deletar configuração"
          >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Deletando...' : 'Deletar Configuração'}
          </button>
        )}
      </div>

      {/* Seção de Consoles - Apenas para tipo cloud */}
      {config.type === 'cloud' && config.apiKey && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Consoles Ubiquiti</h3>
            <div className="flex gap-2">
              <button
                onClick={handleSearchConsoles}
                disabled={loadingConsoles}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {loadingConsoles ? 'Carregando...' : 'Buscar Consoles'}
              </button>
              <button
                onClick={handleOpenMonitor}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir Monitor Completo
              </button>
            </div>
          </div>

          {loadingConsoles ? (
            <p className="text-gray-500">Carregando consoles...</p>
          ) : consoles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {consoles.map((console) => (
                    <tr key={console.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{console.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{console.type}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          console.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {console.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">{console.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum console encontrado. Clique em "Buscar Consoles" para carregar.</p>
          )}
        </div>
      )}
    </div>
  );
}








