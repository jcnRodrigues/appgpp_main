'use client';

import { useState } from 'react';

interface Device {
  name: string;
  ip: string;
  status: string;
  model?: string;
  version?: string;
  uptime?: string;
  mac?: string;
  cpu?: string;
  memory?: string;
}

interface Client {
  name: string;
  ip: string;
  mac: string;
  status: string;
  hostname?: string;
  signal?: string;
  speed?: string;
  uptime?: string;
  device?: string;
}

interface Console {
  id: string;
  name: string;
  type?: string;
  status?: string;
}

interface Site {
  id: string;
  name: string;
  description?: string;
}

export default function MonitorPatrimonios() {
  const [apiType, setApiType] = useState<'local' | 'cloud'>('local');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [selectedConsole, setSelectedConsole] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [siteToHostMapping, setSiteToHostMapping] = useState<Record<string, string>>({});
  const [devices, setDevices] = useState<Device[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConsoles, setLoadingConsoles] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [activeTab, setActiveTab] = useState<'devices' | 'clients'>('devices');

  const loadConsoles = async () => {
    setLoadingConsoles(true);
    try {
      const response = await fetch('/api/monitor-patrimonios/consoles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json();
      setConsoles(data.consoles || []);

      // Criar mapeamento de siteId para hostId
      const mapping: Record<string, string> = {};
      if (data.consoles) {
        // Buscar os hostIds da API de sites
        const sitesResponse = await fetch('https://api.ui.com/v1/sites', {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': apiKey,
          },
        });
        if (sitesResponse.ok) {
          const sitesData = await sitesResponse.json();
          if (sitesData.data) {
            sitesData.data.forEach((site: any) => {
              mapping[site.siteId] = site.hostId;
            });
          }
        }
      }
      setSiteToHostMapping(mapping);

      if (data.consoles && data.consoles.length > 0) {
        setSelectedConsole(data.consoles[0].id);
      } else {
        window.systemAlert?.('erro', data.error || 'Nenhum console encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar consoles:', error);
      window.systemAlert?.('erro', 'Erro ao carregar consoles');
    } finally {
      setLoadingConsoles(false);
    }
  };

  const loadSites = async () => {
    if (!selectedConsole) {
      window.systemAlert?.('erro', 'Selecione um console primeiro');
      return;
    }

    // Usar o hostId correspondente ao siteId selecionado
    const hostId = siteToHostMapping[selectedConsole];
    if (!hostId) {
      window.systemAlert?.('erro', 'Host ID não encontrado para o console selecionado');
      return;
    }

    setLoadingSites(true);
    try {
      const response = await fetch('/api/monitor-patrimonios/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, consoleId: hostId }),
      });
      const data = await response.json();
      setSites(data.sites || []);
      if (data.sites && data.sites.length > 0) {
        setSelectedSite(data.sites[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar sites:', error);
      window.systemAlert?.('erro', 'Erro ao carregar sites');
    } finally {
      setLoadingSites(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMonitor = async (type: 'devices' | 'clients') => {
    const siteId = apiType === 'cloud' ? selectedSite : 'default';
    if (apiType === 'cloud' && !siteId) {
      window.systemAlert?.('erro', 'Selecione um site primeiro');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/monitor-patrimonios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          consoleId: selectedConsole,
          siteId,
          type
        }),
      });
      const data = await response.json();
      if (type === 'devices') {
        setDevices(data.devices || []);
      } else {
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Erro ao monitorar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monitor de Rede Ubiquiti</h1>
      
      {/* Seleção do tipo de API */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Tipo de API:</label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setApiType('local')}
            className={`rounded-md px-4 py-2 border transition ${apiType === 'local' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
          >
            Unifi Controller Local
          </button>
          <button
            type="button"
            onClick={() => setApiType('cloud')}
            className={`rounded-md px-4 py-2 border transition ${apiType === 'cloud' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
          >
            Ubiquiti Cloud API
          </button>
        </div>
      </div>

      {apiType === 'local' ? (
        <>
          <div className="mb-4">
            <label className="block mb-2">Host do Unifi Controller:</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="border p-2 w-full"
              placeholder="ex: https://unifi.example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">X-API-Key (Ubiquiti Cloud):</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border p-2 w-full"
              placeholder="Digite sua chave API da Ubiquiti"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadConsoles}
              disabled={loadingConsoles}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              {loadingConsoles ? 'Carregando...' : 'Carregar Consoles'}
            </button>
          </div>
          {consoles.length > 0 && (
            <div>
              <label className="block mb-2">Console:</label>
              <select
                value={selectedConsole}
                onChange={(e) => setSelectedConsole(e.target.value)}
                className="border p-2 w-full"
              >
                {consoles.map((console) => (
                  <option key={console.id} value={console.id}>
                    {console.name} ({console.id}) {console.status ? `- ${console.status}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedConsole && (
            <div className="flex gap-2">
              <button
                onClick={loadSites}
                disabled={loadingSites}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loadingSites ? 'Carregando...' : 'Carregar Sites'}
              </button>
            </div>
          )}
          {sites.length > 0 && (
            <div>
              <label className="block mb-2">Site:</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="border p-2 w-full"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} {site.description ? `(${site.description})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 ${activeTab === 'devices' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Dispositivos (Patrimônios)
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 ${activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Clientes Conectados
        </button>
      </div>

      <button
        onClick={() => handleMonitor(activeTab)}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Monitorando...' : `Monitorar ${activeTab === 'devices' ? 'Dispositivos' : 'Clientes'}`}
      </button>

      {activeTab === 'devices' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Dispositivos Conectados (Patrimônios):</h2>
            {devices.length > 0 && (
              <button
                onClick={() => exportToCSV(devices, `dispositivos-${new Date().toISOString().split('T')[0]}.csv`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Exportar CSV
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">IP</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">MAC</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Modelo</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Versão</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Uptime</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">CPU</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Memória</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Nenhum dispositivo encontrado
                    </td>
                  </tr>
                ) : (
                  devices.map((device, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{device.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{device.ip}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 font-mono">{device.mac || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{device.model || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{device.version || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{device.uptime || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{device.cpu || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{device.memory || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          device.status === 'Conectado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Clientes Conectados:</h2>
            {clients.length > 0 && (
              <button
                onClick={() => exportToCSV(clients, `clientes-${new Date().toISOString().split('T')[0]}.csv`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Exportar CSV
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Hostname</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">IP</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">MAC</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Dispositivo</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Sinal</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Velocidade</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Uptime</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  clients.map((client, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{client.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{client.hostname || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{client.ip}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 font-mono">{client.mac}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{client.device || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{client.signal || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{client.speed || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{client.uptime || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          client.status === 'Conectado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}