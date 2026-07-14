'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, RefreshCw, Building2, Router, Settings, Activity, AlertTriangle, CheckCircle2, Users, Users2, Inbox } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import TableState from '@/components/TableState/TableState';

interface ConsoleData {
  id: string;
  hostId?: string;
  hostName?: string;
  name: string;
  type: string;
  status: string;
  organizationId?: string;
  organizationName?: string;
}

interface SiteData {
  id: string;
  name: string;
  description?: string;
  consoleId?: string;
  consoleName?: string;
  deviceCount?: number;
  clientCount?: number;
}

interface DeviceData {
  id: string;
  name: string;
  type: string;
  mac: string;
  ip?: string;
  shortname?: string;
  productLine?: string;
  status: string;
  siteId?: string;
  siteKey?: string;
  siteName?: string;
  model?: string;
  firmware?: string;
  firmwareStatus?: string;
  updateAvailable?: string;
  isConsole?: boolean;
  isManaged?: boolean;
  startupTime?: string;
  adoptionTime?: string;
  note?: string;
  lastUpdatedAt?: string;
}
interface ClientData {
  id: string;
  name: string;
  mac: string;
  ip?: string;
  status: string;
  siteId?: string;
  siteKey?: string;
  siteName?: string;
  radiusLocal?: string | null;
  radiusLocalOrigin?: string | null;
}

interface UnifiConfigItem {
  id: string;
  type: string;
  apiKey: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MonitorPatrimoniosForm() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [consoles, setConsoles] = useState<ConsoleData[]>([]);
  const [sites, setSites] = useState<SiteData[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [activeTab, setActiveTab] = useState<'sites' | 'devices' | 'clients'>('sites');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [consoleSelecionadoId, setConsoleSelecionadoId] = useState<string | null>(null);
  const [siteSelecionadoId, setSiteSelecionadoId] = useState<string | null>(null);
  const [siteSelecionadoNome, setSiteSelecionadoNome] = useState('');
  const [error, setError] = useState('');
  const [savedKeys, setSavedKeys] = useState<UnifiConfigItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [showSavedKeys, setShowSavedKeys] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const { data: session, status } = useSession();

  const loadAllSavedKeys = useCallback(async () => {
    setLoadingKeys(true);
    try {
      const response = await fetch('/api/unifi-config?all=true', { cache: 'no-store' });
      const data = await response.json();
      setSavedKeys(data.configs || []);
    } catch (error) {
      console.error('Erro ao carregar chaves salvas:', error);
    } finally {
      setLoadingKeys(false);
    }
  }, []);

  const loadSavedApiKey = useCallback(async () => {
    try {
      await fetch('/api/unifi-config', { cache: 'no-store' });
    } catch (error) {
      console.error('Erro ao carregar API Key:', error);
    }

    // Carregar tambem todas as chaves salvas
    await loadAllSavedKeys();
  }, [loadAllSavedKeys]);

  useEffect(() => {
    loadSavedApiKey();
  }, [loadSavedApiKey]);

  const handleUseKey = async (keyItem: UnifiConfigItem) => {
    try {
      const response = await fetch('/api/unifi-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: keyItem.id }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao ativar chave de API');
      }
      setApiKey('');
      setShowSavedKeys(false);
      setSuccessMessage('Chave ativa definida. A busca usará a configuração salva.');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadAllSavedKeys();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao ativar chave');
    }
  };

  const handleDeactivateKey = async (id: string) => {
    const confirmou = window.systemConfirm
      ? await window.systemConfirm('Deseja desativar esta chave de API?', 'Confirmar exclusão', {
        confirmText: 'Desativar',
        cancelText: 'Cancelar'
      })
      : window.confirm('Deseja desativar esta chave de API?');
    if (!confirmou) return;

    try {
      const response = await fetch(`/api/unifi-config?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadAllSavedKeys();
        setSuccessMessage('Chave desativada com sucesso');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch {
      setError('Erro ao desativar chave');
    }
  };

  const postMonitorData = useCallback(async (endpoint: string) => {
    const payload = apiKey ? { apiKey } : {};
    const response = await fetch(`${endpoint}?_ts=${Date.now()}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Erro ao consultar ${endpoint}`);
    }

    return data;
  }, [apiKey]);

  const loadDataViaProxyFallback = useCallback(async () => {
    const payload = apiKey ? { apiKey } : {};
    const response = await fetch('/api/unifi-proxy', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        path: 'devices?hostIds[]=&pageSize=200',
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao consultar fallback unifi-proxy');
    }

    const groupsRaw = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];
    const grouped = groupsRaw.filter((item: any) => Array.isArray(item?.devices));
    let sitesRaw = grouped.map((group: any) => ({
      id: String(group.hostId || ''),
      name: String(group.hostName || 'Site sem nome'),
      consoleId: String(group.hostId || ''),
      consoleName: String(group.hostName || ''),
      deviceCount: Array.isArray(group.devices) ? group.devices.length : 0,
      description: '',
    }));
    let devicesRaw = grouped.flatMap((group: any) =>
      (Array.isArray(group.devices) ? group.devices : []).map((device: any) => ({
        ...device,
        siteId: String(group.hostId || ''),
        siteName: String(group.hostName || 'Site sem nome'),
      }))
    );

    if (devicesRaw.length === 0) {
      const backupResponse = await fetch('/api/unifi-proxy', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, action: 'sites-and-devices', pageSize: 200 }),
      });

      const backupData = await backupResponse.json().catch(() => ({}));
      if (backupResponse.ok) {
        const backupSites = Array.isArray(backupData.sites) ? backupData.sites : [];
        const backupDevices = Array.isArray(backupData.devices) ? backupData.devices : [];
        if (backupDevices.length > 0 || backupSites.length > 0) {
          sitesRaw = backupSites;
          devicesRaw = backupDevices;
        }
      }
    }

    if (sitesRaw.length === 0 && devicesRaw.length === 0) {
      throw new Error('Fallback retornou vazio');
    }
    const hostsById = new Map<string, { hostName: string }>();
    for (const site of sitesRaw) {
      const id = String(site.id || site.consoleId || '');
      const name = String(site.name || site.consoleName || '');
      if (id) hostsById.set(id, { hostName: name });
    }

    const consolesFallback: ConsoleData[] = Array.from(hostsById.entries()).map(([id, info]) => ({
      id,
      hostId: id,
      hostName: info.hostName,
      name: info.hostName || id || 'Console sem nome',
      type: 'CONSOLE',
      status: 'Online',
      organizationName: '',
    }));

    const sitesFallback: SiteData[] = sitesRaw.map((site: any) => ({
      id: String(site.id || site.consoleId || ''),
      name: String(site.name || 'Site sem nome'),
      description: String(site.description || ''),
      consoleId: String(site.consoleId || site.id || ''),
      consoleName: String(site.consoleName || site.name || ''),
      deviceCount: Number(site.deviceCount || 0),
    }));

    const devicesFallback: DeviceData[] = devicesRaw.map((device: any, idx: number) => ({
      id: String(device.id || device.deviceId || device.mac || `device-${idx}`),
      name: String(device.name || device.displayName || 'Device sem nome'),
      type: String(device.type || device.model || 'Unknown'),
      mac: String(device.mac || ''),
      ip: String(device.ip || ''),
      status: String(device.status || 'Offline'),
      siteId: String(device.siteId || ''),
      siteName: String(device.siteName || ''),
      model: String(device.model || ''),
    }));

    return { consolesFallback, sitesFallback, devicesFallback };
  }, [apiKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      try {
        const overview = await postMonitorData('/api/monitor-patrimonios/overview');
        const overviewConsoles = Array.isArray(overview.consoles) ? overview.consoles : [];
        const overviewSites = Array.isArray(overview.sites) ? overview.sites : [];
        const overviewDevices = Array.isArray(overview.devices) ? overview.devices : [];
        let overviewClients = Array.isArray(overview.clients) ? overview.clients : [];

        if (overviewConsoles.length === 0 && overviewSites.length === 0 && overviewDevices.length === 0) {
          throw new Error('Overview retornou vazio');
        }
        if (overviewDevices.length === 0 && (overviewSites.length > 0 || overviewConsoles.length > 0)) {
          throw new Error('Overview sem devices, usando fallback');
        }

        if (overviewClients.length === 0) {
          try {
            const clientsOnly = await postMonitorData('/api/monitor-patrimonios/clients');
            overviewClients = Array.isArray(clientsOnly.clients) ? clientsOnly.clients : [];
          } catch {
            // Mant?m vazio quando clients não estiver dispon?vel
          }
        }

        setConsoles(overviewConsoles);
        setSites(overviewSites);
        setDevices(overviewDevices);
        setClients(overviewClients);
        setLastUpdatedAt(new Date());
        setPaginaAtual(1);
        setConsoleSelecionadoId(null);
        setSiteSelecionadoId(null);
        setSiteSelecionadoNome('');
        setActiveTab('sites');
        return;
      } catch (overviewError) {
        console.warn('Falha no endpoint agregado, usando rotas individuais:', overviewError);
      }

      const [consolesResult, sitesResult, devicesResult, clientsResult] = await Promise.allSettled([
        postMonitorData('/api/monitor-patrimonios/consoles'),
        postMonitorData('/api/monitor-patrimonios/sites'),
        postMonitorData('/api/monitor-patrimonios/devices'),
        postMonitorData('/api/monitor-patrimonios/clients'),
      ]);

      const hasFailure = [consolesResult, sitesResult, devicesResult].some((r) => r.status === 'rejected');
      const consolesIndividual =
        consolesResult.status === 'fulfilled' ? (consolesResult.value.consoles || []) : [];
      const sitesIndividual =
        sitesResult.status === 'fulfilled' ? (sitesResult.value.sites || []) : [];
      const devicesIndividual =
        devicesResult.status === 'fulfilled' ? (devicesResult.value.devices || []) : [];
      const clientsIndividual =
        clientsResult.status === 'fulfilled' ? (clientsResult.value.clients || []) : [];
      const allEmpty = consolesIndividual.length === 0 && sitesIndividual.length === 0 && devicesIndividual.length === 0;
      const semDevicesComDadosBase = devicesIndividual.length === 0 && (sitesIndividual.length > 0 || consolesIndividual.length > 0);

      if (hasFailure || allEmpty || semDevicesComDadosBase) {
        const { consolesFallback, sitesFallback, devicesFallback } = await loadDataViaProxyFallback();
        setConsoles(consolesFallback.length > 0 ? consolesFallback : consolesIndividual);
        setSites(sitesFallback.length > 0 ? sitesFallback : sitesIndividual);
        setDevices(devicesFallback);
        setClients(clientsIndividual);
      } else {
        setConsoles(consolesIndividual);
        setSites(sitesIndividual);
        setDevices(devicesIndividual);
        setClients(clientsIndividual);
      }
      setLastUpdatedAt(new Date());
      setPaginaAtual(1);
      setConsoleSelecionadoId(null);
      setSiteSelecionadoId(null);
      setSiteSelecionadoNome('');
      setActiveTab('sites');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar dados da API Ubiquiti');
    } finally {
      setLoading(false);
    }
  }, [loadDataViaProxyFallback, postMonitorData]);

  const carregarDadosDoConsole = useCallback((consoleId: string, manterAbaAtual = false) => {
    setConsoleSelecionadoId(consoleId);
    setSiteSelecionadoId(null);
    setSiteSelecionadoNome('');
    setPaginaAtual(1);
    if (!manterAbaAtual) {
      setActiveTab('sites');
    }
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      void loadData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [autoRefresh, loadData]);



  if (status === 'loading') {
    return (
      <div className="bg-background min-h-screen py-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-background min-h-screen py-6">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Monitor de Rede Ubiquiti</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg mb-6">Faça login para visualizar esta página</p>
            <Button asChild>
              <Link href="/">Ir para Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const normalizeText = (value?: string) => (value || '').trim().toLowerCase();
  const normalizeEntityKey = (value?: string) => {
    const raw = normalizeText(value);
    if (!raw) return '';
    const withoutSuffix = raw.split(':')[0] || raw;
    return withoutSuffix;
  };

  const isSiteFallbackName = (value?: string) => {
    const name = normalizeText(value);
    return !name || name === 'site sem nome';
  };

  const isUsefulSiteName = (value?: string) => {
    const name = normalizeText(value);
    return Boolean(name) && name !== '-' && name !== 'site sem nome';
  };

  const devicesPorSiteId = new Map<string, DeviceData[]>();
  const nomeSitePorSiteId = new Map<string, string>();
  for (const device of devices) {
    const siteId = normalizeText(device.siteId);
    if (!siteId) continue;

    const lista = devicesPorSiteId.get(siteId) || [];
    lista.push(device);
    devicesPorSiteId.set(siteId, lista);

    const siteName = (device.siteName || '').trim();
    if (!nomeSitePorSiteId.has(siteId) && isUsefulSiteName(siteName)) {
      nomeSitePorSiteId.set(siteId, siteName);
    }
  }

  const quantidadeSitesPorConsoleId = new Map<string, number>();
  for (const site of sites) {
    const consoleId = normalizeText(site.consoleId);
    if (!consoleId) continue;
    quantidadeSitesPorConsoleId.set(consoleId, (quantidadeSitesPorConsoleId.get(consoleId) || 0) + 1);
  }

  const devicesDoSite = (site: SiteData) => {
    const siteIdNorm = normalizeText(site.id);
    const consoleIdNorm = normalizeText(site.consoleId);

    const porSiteId = siteIdNorm ? (devicesPorSiteId.get(siteIdNorm) || []) : [];
    if (porSiteId.length > 0) return porSiteId;

    const consoleEhUnico = consoleIdNorm && (quantidadeSitesPorConsoleId.get(consoleIdNorm) || 0) === 1;
    if (consoleEhUnico) {
      return devicesPorSiteId.get(consoleIdNorm) || [];
    }

    return [];
  };

  const sitesCorrigidosRaw = sites.map((site) => {
    const siteDevices = devicesDoSite(site);
    const siteIdNorm = normalizeText(site.id);
    const consoleIdNorm = normalizeText(site.consoleId);
    const consoleEhUnico = consoleIdNorm && (quantidadeSitesPorConsoleId.get(consoleIdNorm) || 0) === 1;

    const nomePorId = nomeSitePorSiteId.get(siteIdNorm);
    const nomePorConsoleUnico = consoleEhUnico ? nomeSitePorSiteId.get(consoleIdNorm) : undefined;
    const nomeDerivado = siteDevices.find((device) => isUsefulSiteName(device.siteName))?.siteName;
    const uniqueDeviceIds = new Set(siteDevices.map((device) => device.id));
    const deviceCountDaApi = Number(site.deviceCount || 0);
    const deviceCountCalculado = uniqueDeviceIds.size;

    return {
      ...site,
      name: isSiteFallbackName(site.name)
        ? (nomePorId || nomePorConsoleUnico || nomeDerivado || site.name)
        : site.name,
      // Prioriza a contagem oficial por site da API; fallback local quando indisponivel.
      deviceCount: deviceCountDaApi > 0 ? deviceCountDaApi : deviceCountCalculado,
    };
  });

  const sitesCorrigidosMap = new Map<string, SiteData>();
  for (const site of sitesCorrigidosRaw) {
    const key = normalizeText(site.id) || `name:${normalizeText(site.name)}`;
    const existente = sitesCorrigidosMap.get(key);
    if (!existente) {
      sitesCorrigidosMap.set(key, site);
      continue;
    }

    const candidatoEhMelhorNome = isSiteFallbackName(existente.name) && !isSiteFallbackName(site.name);
    const candidatoEhMelhorContagem = (site.deviceCount || 0) > (existente.deviceCount || 0);

    if (candidatoEhMelhorNome || candidatoEhMelhorContagem) {
      sitesCorrigidosMap.set(key, site);
    }
  }
  const sitesCorrigidos = Array.from(sitesCorrigidosMap.values());

  const getSitesResumoDoConsole = (consoleItem: ConsoleData) => {
    const consoleIdNorm = normalizeText(consoleItem.id);
    const consoleHostIdNorm = normalizeText(consoleItem.hostId);
    const consoleKeys = new Set(
      [
        consoleIdNorm,
        consoleHostIdNorm,
        normalizeEntityKey(consoleItem.id),
        normalizeEntityKey(consoleItem.hostId),
      ].filter(Boolean)
    );
    const sitesDoConsoleBase = sitesCorrigidos.filter(
      (site) =>
        consoleKeys.has(normalizeText(site.consoleId)) ||
        consoleKeys.has(normalizeEntityKey(site.consoleId))
    );
    const sitesByNameKey = new Map<string, string>();
    for (const site of sitesDoConsoleBase) {
      const siteKey = normalizeText(site.id) || `name:${normalizeText(site.name)}`;
      const nameKey = normalizeText(site.name);
      if (siteKey && nameKey) {
        sitesByNameKey.set(nameKey, siteKey);
      }
    }

    const siteIdsDoConsole = new Set(
      sitesDoConsoleBase
        .flatMap((site) => [normalizeText(site.id), normalizeEntityKey(site.id)])
        .filter(Boolean)
    );
    const siteNamesDoConsole = new Set(
      sitesDoConsoleBase.map((site) => normalizeText(site.name)).filter(Boolean)
    );
    const hostNamesDoConsole = new Set(
      [normalizeText(consoleItem.hostName), normalizeText(consoleItem.name)].filter(Boolean)
    );

    const devicesDoConsole = devices.filter((device) => {
      const siteIdNorm = normalizeText(device.siteId);
      const siteIdKey = normalizeEntityKey(device.siteId);
      const siteNameNorm = normalizeText(device.siteName);
      return (
        consoleKeys.has(siteIdNorm) ||
        consoleKeys.has(siteIdKey) ||
        siteIdsDoConsole.has(siteIdNorm) ||
        siteIdsDoConsole.has(siteIdKey) ||
        (siteNameNorm && (siteNamesDoConsole.has(siteNameNorm) || hostNamesDoConsole.has(siteNameNorm)))
      );
    });

    const resumoMap = new Map<string, SiteData>();

    for (const site of sitesDoConsoleBase) {
      const key = normalizeText(site.id) || `name:${normalizeText(site.name)}`;
      if (!key) continue;

      const nomePorDevice = nomeSitePorSiteId.get(normalizeText(site.id));
      const nomeFinal = isSiteFallbackName(site.name) ? nomePorDevice || site.name : site.name;

      resumoMap.set(key, {
        ...site,
        name: nomeFinal,
        deviceCount: Number(site.deviceCount || 0),
      });
    }

    const devicesPorChaveSite = new Map<string, Set<string>>();
    const clientsPorChaveSite = new Map<string, Set<string>>();
    for (const device of devicesDoConsole) {
      const siteIdNorm = normalizeText(device.siteId);
      const siteIdKey = normalizeEntityKey(device.siteId);
      const siteNameNorm = normalizeText(device.siteName);
      const chavePorNome = siteNameNorm ? sitesByNameKey.get(siteNameNorm) : '';
      const chave = siteIdsDoConsole.has(siteIdNorm)
        ? siteIdNorm
        : siteIdsDoConsole.has(siteIdKey)
          ? siteIdKey
          : (chavePorNome || siteIdNorm || siteIdKey || `name:${siteNameNorm}`);
      if (!chave) continue;

      if (!devicesPorChaveSite.has(chave)) {
        devicesPorChaveSite.set(chave, new Set<string>());
      }
      devicesPorChaveSite.get(chave)?.add(device.id);

      if (!resumoMap.has(chave)) {
        const nome = isUsefulSiteName(device.siteName)
          ? String(device.siteName)
          : `Site ${String(device.siteId || '').slice(0, 8) || 'sem nome'}`;

        resumoMap.set(chave, {
          id: String(device.siteId || chave),
          name: nome,
          consoleId: consoleItem.id,
          consoleName: '',
          description: '',
          deviceCount: 0,
        });
      }
    }

    const registrarClienteNaChave = (chave: string, clientId: string) => {
      if (!chave) return;
      if (!clientsPorChaveSite.has(chave)) {
        clientsPorChaveSite.set(chave, new Set<string>());
      }
      clientsPorChaveSite.get(chave)?.add(clientId);
    };

    const registrarClienteEmAliases = (aliases: Array<string | undefined | null>, clientId: string) => {
      for (const alias of aliases) {
        const key = normalizeText(alias || '');
        if (!key) continue;
        registrarClienteNaChave(key, clientId);
      }
    };

    for (const client of clients) {
      const clientSiteId = normalizeText(client.siteId);
      const clientSiteKey = normalizeText(client.siteKey || client.siteId);
      const clientSiteKeyNorm = normalizeEntityKey(client.siteKey || client.siteId);
      const clientSiteName = normalizeText(client.siteName);

      if (
        !(
          siteIdsDoConsole.has(clientSiteId) ||
          siteIdsDoConsole.has(clientSiteKeyNorm) ||
          siteNamesDoConsole.has(clientSiteName) ||
          hostNamesDoConsole.has(clientSiteName)
        )
      ) {
        continue;
      }

      const chavePorNome = clientSiteName ? sitesByNameKey.get(clientSiteName) : '';
      const chave = siteIdsDoConsole.has(clientSiteId)
        ? clientSiteId
        : siteIdsDoConsole.has(clientSiteKeyNorm)
          ? clientSiteKeyNorm
          : siteIdsDoConsole.has(normalizeEntityKey(client.siteKey || ''))
            ? normalizeEntityKey(client.siteKey || '')
            : (chavePorNome || clientSiteId || clientSiteKey || `name:${clientSiteName}`);
      if (!chave) continue;

      const clientKey = client.id || client.mac;
      registrarClienteNaChave(chave, clientKey);

      const chaveDoNome = clientSiteName ? sitesByNameKey.get(clientSiteName) : '';
      if (chaveDoNome && chaveDoNome !== chave) {
        registrarClienteNaChave(chaveDoNome, clientKey);
      }

      const chaveDoSite = clientSiteId ? sitesByNameKey.get(clientSiteId) : '';
      if (chaveDoSite && chaveDoSite !== chave) {
        registrarClienteNaChave(chaveDoSite, clientKey);
      }

      registrarClienteEmAliases(
        [
          clientSiteId,
          clientSiteKey,
          normalizeText(client.siteKey),
          clientSiteKeyNorm,
          clientSiteName,
          chavePorNome,
        ],
        clientKey
      );
    }

    for (const [chave, deviceIds] of devicesPorChaveSite.entries()) {
      const site = resumoMap.get(chave);
      if (!site) continue;
      const qtdCalculada = deviceIds.size;
      site.deviceCount = Math.max(Number(site.deviceCount || 0), qtdCalculada);
      resumoMap.set(chave, site);
    }

    const resumoFinal = Array.from(resumoMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    return resumoFinal.map((site) => {
      const key = normalizeText(site.id) || `name:${normalizeText(site.name)}`;
      const aliases = [
        key,
        normalizeText(site.consoleId),
        normalizeEntityKey(site.consoleId),
        normalizeText(site.id),
        normalizeEntityKey(site.id),
        normalizeText(site.name),
        normalizeEntityKey(site.name),
        normalizeText(site.consoleName),
        normalizeEntityKey(site.consoleName),
      ].filter(Boolean);
      const clientIds = new Set<string>();
      for (const alias of aliases) {
        const set = clientsPorChaveSite.get(String(alias));
        if (!set) continue;
        for (const clientId of set) {
          if (clientId) clientIds.add(clientId);
        }
      }
      const clientCount = clientIds.size;
      return { ...site, clientCount };
    });
  };

  const nomesHostAtivoPorConsoleId = new Map<string, string>();
  for (const site of sitesCorrigidos) {
    const consoleId = normalizeText(site.consoleId);
    const siteName = (site.name || '').trim();
    const count = site.deviceCount || 0;
    if (!consoleId || !isUsefulSiteName(siteName) || count <= 0) continue;

    // Primeiro host ativo encontrado do console vira referência de nome
    if (!nomesHostAtivoPorConsoleId.has(consoleId)) {
      nomesHostAtivoPorConsoleId.set(consoleId, siteName);
    }
  }

  const consolesCorrigidos = consoles.map((consoleItem) => {
    const nomeOriginal = normalizeText(consoleItem.name);
    const hostIdNorm = normalizeText(consoleItem.hostId);
    const nomeEhFallback =
      !nomeOriginal ||
      nomeOriginal === 'console sem nome' ||
      nomeOriginal === normalizeText(consoleItem.id) ||
      (hostIdNorm && nomeOriginal === hostIdNorm);

    const tipoConsole = (consoleItem.type || '').toUpperCase();
    const tipoValido = ['UCG', 'UDM', 'UXG', 'USG', 'UDR', 'UDW', 'UCK'].includes(tipoConsole)
      ? tipoConsole
      : '';

    const nomePorHostAtivo = nomesHostAtivoPorConsoleId.get(normalizeText(consoleItem.id));
    const nomeHostDireto = (consoleItem.hostName || '').trim();

    const nomePorSite = sitesCorrigidos.find(
      (site) =>
        site.consoleId === consoleItem.id &&
        normalizeText(site.consoleName) &&
        normalizeText(site.consoleName) !== '-'
    )?.consoleName;

    const nomePorDevice = devices.find(
      (device) => device.siteId === consoleItem.id && normalizeText(device.siteName)
    )?.siteName;

    const nomeFallbackId = `Console ${consoleItem.id.slice(0, 10)}...`;
    const nomeFinal = nomeEhFallback
      ? (nomeHostDireto || nomePorHostAtivo || nomePorSite || nomePorDevice || (tipoValido ? `${tipoValido} ${nomeFallbackId}` : nomeFallbackId))
      : consoleItem.name;

    return {
      ...consoleItem,
      name: nomeFinal,
      type: tipoValido || consoleItem.type,
    };
  });

  const consoleSelecionado = consolesCorrigidos.find(
    (consoleItem) =>
      normalizeText(consoleItem.id) === normalizeText(consoleSelecionadoId || '') ||
      normalizeEntityKey(consoleItem.id) === normalizeEntityKey(consoleSelecionadoId || '')
  );

  const sitesDoConsoleSelecionado = consoleSelecionado ? getSitesResumoDoConsole(consoleSelecionado) : [];

  const siteSelecionado =
    sitesCorrigidos.find((site) => normalizeText(site.id) === normalizeText(siteSelecionadoId || '')) ||
    sitesCorrigidos.find((site) => normalizeEntityKey(site.id) === normalizeEntityKey(siteSelecionadoId || ''));

  const chavesSiteSelecionado = new Set(
    [
      normalizeText(siteSelecionadoId || ''),
      normalizeEntityKey(siteSelecionadoId || ''),
      normalizeText(siteSelecionado?.id),
      normalizeEntityKey(siteSelecionado?.id),
      normalizeText(siteSelecionado?.consoleId),
      normalizeEntityKey(siteSelecionado?.consoleId),
    ].filter(Boolean)
  );

  const nomesSiteSelecionado = new Set(
    [
      normalizeText(siteSelecionadoNome),
      normalizeText(siteSelecionado?.name),
      normalizeText(siteSelecionado?.consoleName),
    ].filter(Boolean)
  );

  const chavesConsoleSelecionado = new Set(
    sitesDoConsoleSelecionado.flatMap((site) => [
      normalizeText(site.id),
      normalizeEntityKey(site.id),
      normalizeText(site.consoleId),
      normalizeEntityKey(site.consoleId),
      normalizeText(site.name),
      normalizeEntityKey(site.name),
    ]).filter(Boolean)
  );

  const devicesFiltradosPorSite = siteSelecionadoId
    ? devices.filter((device) => {
      const deviceSiteIdNorm = normalizeText(device.siteId);
      const deviceSiteKeyNorm = normalizeText(device.siteKey);
      const deviceSiteKey = normalizeEntityKey(device.siteId);
      const deviceSiteNameNorm = normalizeText(device.siteName);
      return (
        chavesSiteSelecionado.has(deviceSiteIdNorm) ||
        chavesSiteSelecionado.has(deviceSiteKey) ||
        chavesSiteSelecionado.has(deviceSiteKeyNorm) ||
        (deviceSiteNameNorm && nomesSiteSelecionado.has(deviceSiteNameNorm))
      );
    })
    : [];
  const clientsFiltradosPorSite = siteSelecionadoId
    ? clients.filter((client) => {
      const siteIdMatch =
        normalizeText(client.siteId) === normalizeText(siteSelecionadoId) ||
        normalizeText(client.siteKey) === normalizeText(siteSelecionadoId) ||
        normalizeEntityKey(client.siteId) === normalizeEntityKey(siteSelecionadoId);
      const siteNameMatch =
        Boolean(siteSelecionadoNome) &&
        normalizeText(client.siteName) === normalizeText(siteSelecionadoNome);
      return siteIdMatch || siteNameMatch;
    })
    : consoleSelecionadoId
      ? clients.filter((client) => {
        const clientSiteId = normalizeText(client.siteId);
        const clientSiteKey = normalizeText(client.siteKey);
        const clientSiteKeyNorm = normalizeEntityKey(client.siteKey || client.siteId);
        const clientSiteName = normalizeText(client.siteName);
        return (
          chavesConsoleSelecionado.has(clientSiteId) ||
          chavesConsoleSelecionado.has(clientSiteKey) ||
          chavesConsoleSelecionado.has(clientSiteKeyNorm) ||
          chavesConsoleSelecionado.has(clientSiteName)
        );
      })
      : [];
  const devicesFiltradosPorConsole = !siteSelecionadoId && consoleSelecionadoId
    ? devices.filter((device) => {
      const deviceSiteIdNorm = normalizeText(device.siteId);
      const deviceSiteKeyNorm = normalizeText(device.siteKey);
      const deviceSiteKey = normalizeEntityKey(device.siteId);
      const deviceSiteNameNorm = normalizeText(device.siteName);
      return (
        chavesConsoleSelecionado.has(deviceSiteIdNorm) ||
        chavesConsoleSelecionado.has(deviceSiteKey) ||
        chavesConsoleSelecionado.has(deviceSiteKeyNorm) ||
        chavesConsoleSelecionado.has(deviceSiteNameNorm)
      );
    })
    : [];
  const devicesExibidos = siteSelecionadoId
    ? devicesFiltradosPorSite
    : consoleSelecionadoId
      ? devicesFiltradosPorConsole
      : devices;
  const clientsExibidos = siteSelecionadoId
    ? clientsFiltradosPorSite
    : consoleSelecionadoId
      ? clientsFiltradosPorSite
      : clients;
  const clientsOnlineCount = clientsExibidos.filter(
    (client) => normalizeText(client.status) === 'online'
  ).length;
  const clientsOfflineCount = clientsExibidos.length - clientsOnlineCount;
  const devicesOnlineCount = devicesExibidos.filter(
    (device) => normalizeText(device.status) === 'online'
  ).length;
  const devicesOfflineCount = devicesExibidos.length - devicesOnlineCount;

  const dadosAtivos =
    activeTab === 'sites'
      ? consolesCorrigidos
      : activeTab === 'devices'
        ? devicesExibidos
        : clientsExibidos;
  const totalItens = dadosAtivos.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));

  const paginaAtualValida = Math.min(Math.max(paginaAtual, 1), totalPaginas);
  const inicio = (paginaAtualValida - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPaginados = dadosAtivos.slice(inicio, fim);

  const getPaginasVisiveis = () => {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, index) => index + 1);
    }

    const paginas = new Set<number>([1, totalPaginas, paginaAtualValida]);

    if (paginaAtualValida <= 4) {
      [2, 3, 4, 5].forEach((p) => paginas.add(p));
    } else if (paginaAtualValida >= totalPaginas - 3) {
      [totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1].forEach((p) => paginas.add(p));
    } else {
      [paginaAtualValida - 1, paginaAtualValida, paginaAtualValida + 1].forEach((p) => paginas.add(p));
    }

    return Array.from(paginas)
      .filter((p) => p >= 1 && p <= totalPaginas)
      .sort((a, b) => a - b);
  };

  const paginasVisiveis = getPaginasVisiveis();

  const irParaPagina = (pagina: number) => {
    const paginaValida = Math.min(Math.max(pagina, 1), totalPaginas);
    setPaginaAtual(paginaValida);
  };

  const carregarSitesDoConsole = (consoleId: string) => {
    carregarDadosDoConsole(consoleId);
  };

  const carregarDevicesDoSite = (siteId: string, siteName?: string) => {
    setSiteSelecionadoId(siteId);
    setSiteSelecionadoNome(siteName || '');
    setActiveTab('devices');
    setPaginaAtual(1);
  };

  const carregarClientsDoSite = (siteId: string, siteName?: string) => {
    setSiteSelecionadoId(siteId);
    setSiteSelecionadoNome(siteName || '');
    setActiveTab('clients');
    setPaginaAtual(1);
  };

  const selecionarSiteNoCard = (
    consoleId: string,
    siteId: string,
    siteName?: string,
    tabDestino: 'devices' | 'clients' = 'devices'
  ) => {
    if (normalizeText(consoleSelecionadoId || '') !== normalizeText(consoleId)) {
      carregarDadosDoConsole(consoleId, true);
    }
    if (tabDestino === 'clients') {
      carregarClientsDoSite(siteId, siteName);
      return;
    }
    carregarDevicesDoSite(siteId, siteName);
  };


  return (
    <div className="bg-background min-h-screen py-6">
      <Header />
      <div className="max-w-[86.4rem] mx-auto px-4">
        <PageHeader
          icon={Router}
          title="Monitor de Rede Ubiquiti"
          description="Configuração e monitoramento da rede Ubiquiti"
          backHref="/"
          actions={
            <>
              <a href="https://unifi.ui.com" target="_blank" rel="noreferrer">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Login Ubiquiti
                </Button>
              </a>
              <Link href="/unifi-config">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurar UniFi
                </Button>
              </Link>
            </>
          }
        />

        <div className="form-surface space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Card de API Key */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Opcional: informe uma chave para esta consulta"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Sem API Key? Acesse{' '}
                  <a
                    href="https://unifi.ui.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    unifi.ui.com
                  </a>{' '}
                  para gerar e depois use aqui.
                </p>
              </div>
              <Button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Carregando...' : 'Buscar Dados'}
              </Button>
              <Button
                type="button"
                variant={autoRefresh ? 'default' : 'outline'}
                onClick={() => setAutoRefresh((prev) => !prev)}
                className="whitespace-nowrap"
              >
                Auto-refresh: {autoRefresh ? 'Sim' : 'Não'}
              </Button>
            </div>
            {lastUpdatedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Ãšltima atualização: {lastUpdatedAt.toLocaleTimeString('pt-BR')}
              </p>
            )}

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
                {successMessage}
              </div>
            )}

            {/* BotÃ£o para ver chaves salvas */}
            <div className="mt-4">
              <button
                onClick={() => setShowSavedKeys(true)}
                className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver chaves de API cadastradas
              </button>
            </div>

            {/* Lista de chaves salvas */}
            {showSavedKeys && (
              <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Chaves de API Cadastradas</h3>
                  <button
                    onClick={() => setShowSavedKeys(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {loadingKeys ? (
                  <TableState icon={Inbox} title="Carregando consoles" compact />
                ) : savedKeys.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-2 text-left font-medium text-gray-700">API Key</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Criada em</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedKeys.map((key) => (
                          <tr key={key.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 font-mono text-sm">{key.apiKey || 'N/A'}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-sm ${key.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {key.isActive ? 'Ativa' : 'Inativa'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUseKey(key)}
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                >
                                  Usar API-Key
                                </button>
                                {key.isActive && (
                                  <button
                                    onClick={() => handleDeactivateKey(key.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                  >
                                    Desativar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <TableState icon={Inbox} title="Nenhuma chave de API cadastrada" compact />
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b">
              <button
                onClick={() => {
                  setActiveTab('sites');
                  setPaginaAtual(1);
                }}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'sites'
                  ? 'border-b-2 border-primary text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Building2 className="h-5 w-5" />
                Sites ({sitesCorrigidos.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('devices');
                  setPaginaAtual(1);
                }}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'devices'
                  ? 'border-b-2 border-primary text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Router className="h-5 w-5" />
                Devices ({devicesExibidos.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('clients');
                  setPaginaAtual(1);
                }}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'clients'
                  ? 'border-b-2 border-primary text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Users className="h-5 w-5" />
                Clients ({clientsExibidos.length})
              </button>
            </div>

            {/* ConteÃºdo das Tabs */}
            <div className="p-6">
              {activeTab === 'sites' && (
                <div>
                  {consoles.length === 0 ? (
                    <TableState icon={Inbox} title="Nenhum console encontrado" description="Clique em Buscar Dados para carregar." compact />
                  ) : (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {(dadosPaginados as ConsoleData[]).map((console) => {
                        const isOnline = normalizeText(console.status) === 'online';
                        const sitesDoConsole = getSitesResumoDoConsole(console);
                        const totalSitesConsole = sitesDoConsole.length;
                        const totalDevicesConsole = sitesDoConsole.reduce(
                          (total, site) => total + Number(site.deviceCount || 0),
                          0
                        );
                        const clientIdsConsole = new Set<string>();
                        let clientsOnlineConsole = 0;
                        let clientsOfflineConsole = 0;
                        for (const site of sitesDoConsole) {
                          const siteIdNorm = normalizeText(site.id);
                          const siteIdKey = normalizeEntityKey(site.id);
                          const siteNameNorm = normalizeText(site.name);
                          const siteConsoleIdNorm = normalizeText(site.consoleId);
                          const siteConsoleIdKey = normalizeEntityKey(site.consoleId);
                          const siteConsoleNameNorm = normalizeText(site.consoleName);
                          const siteClients = clients.filter((client) => (
                            normalizeText(client.siteId) === siteIdNorm ||
                            normalizeEntityKey(client.siteId) === siteIdKey ||
                            normalizeText(client.siteKey || '') === siteIdNorm ||
                            normalizeEntityKey(client.siteKey || '') === siteIdKey ||
                            normalizeText(client.siteName) === siteNameNorm
                            || (siteConsoleIdNorm && normalizeText(client.siteId) === siteConsoleIdNorm)
                            || (siteConsoleIdKey && normalizeEntityKey(client.siteId) === siteConsoleIdKey)
                            || (siteConsoleNameNorm && normalizeText(client.siteName) === siteConsoleNameNorm)
                          ));
                          for (const client of siteClients) {
                            const clientKey = client.id || client.mac;
                            if (clientKey) clientIdsConsole.add(String(clientKey));
                            if (normalizeText(client.status) === 'online') {
                              clientsOnlineConsole += 1;
                            } else {
                              clientsOfflineConsole += 1;
                            }
                          }
                        }
                        const totalClientsConsole = clientIdsConsole.size;
                        const hostNameCard = (console.hostName || console.name || '').trim();
                        const hostIdCard = (console.hostId || console.id || '').trim();

                        return (
                          <div
                            key={console.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => carregarSitesDoConsole(console.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                carregarSitesDoConsole(console.id);
                              }
                            }}
                            className={`rounded-xl border p-4 text-left transition-colors ${consoleSelecionadoId === console.id
                              ? 'border-accent bg-accent/10'
                              : 'border-slate-700 bg-slate-950 hover:bg-slate-900'
                              }`}
                            title="Clique para carregar os sites deste console"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base font-bold text-slate-100 break-words">{console.type}</h3>
                              {isOnline ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                              <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />

                              <span>{isOnline ? 'online' : 'offline'}</span>
                            </div>
                            {sitesDoConsole.length > 0 && (
                              <div className="mt-3 rounded-md border border-slate-700/80 bg-slate-900/70 p-2">
                                <p className="text-[11px] font-semibold text-slate-300 mb-1">Sites do console</p>
                                <div className="space-y-1">
                                  {sitesDoConsole.slice(0, 4).map((site) => (
                                    (() => {
                                      const siteIdNorm = normalizeText(site.id);
                                      const siteIdKey = normalizeEntityKey(site.id);
                                      const siteNameNorm = normalizeText(site.name);
                                      const siteConsoleIdNorm = normalizeText(site.consoleId);
                                      const siteConsoleIdKey = normalizeEntityKey(site.consoleId);
                                      const siteConsoleNameNorm = normalizeText(site.consoleName);

                                      const siteDevices = devices.filter((device) => (
                                        normalizeText(device.siteId) === siteIdNorm ||
                                        normalizeEntityKey(device.siteId) === siteIdKey ||
                                        normalizeText(device.siteKey) === siteIdNorm ||
                                        normalizeEntityKey(device.siteKey) === siteIdKey ||
                                        normalizeText(device.siteName) === siteNameNorm
                                      ));
                                      const siteClients = clients.filter((client) => (
                                        normalizeText(client.siteId) === siteIdNorm ||
                                        normalizeEntityKey(client.siteId) === siteIdKey ||
                                        normalizeText(client.siteKey || '') === siteIdNorm ||
                                        normalizeEntityKey(client.siteKey || '') === siteIdKey ||
                                        normalizeText(client.siteName) === siteNameNorm
                                        || (siteConsoleIdNorm && normalizeText(client.siteId) === siteConsoleIdNorm)
                                        || (siteConsoleIdKey && normalizeEntityKey(client.siteId) === siteConsoleIdKey)
                                        || (siteConsoleNameNorm && normalizeText(client.siteName) === siteConsoleNameNorm)
                                      ));
                                      const siteDevicesOnline = siteDevices.filter((d) => normalizeText(d.status) === 'online').length;
                                      const siteDevicesOffline = siteDevices.length - siteDevicesOnline;
                                      const siteClientsOnline = siteClients.filter((c) => normalizeText(c.status) === 'online').length;
                                      const siteClientsOffline = siteClients.length - siteClientsOnline;
                                      const hasOnline =
                                        siteDevicesOnline > 0 ||
                                        siteClientsOnline > 0;

                                      return (
                                        <div
                                          key={site.id}
                                          className="w-full flex items-center justify-between text-xs text-slate-300 gap-2"
                                        >
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              selecionarSiteNoCard(console.id, site.id, site.name, 'clients');
                                            }}
                                            className="min-w-0 flex-1 text-left inline-flex items-center gap-2 text-slate-200 hover:text-white"
                                            title="Abrir clients deste site"
                                          >
                                            <span className={`h-1.5 w-1.5 rounded-full ${hasOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                            <span className="truncate">{site.name}</span>
                                          </button>
                                          <div className="shrink-0 inline-flex items-center gap-2 text-slate-200">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                selecionarSiteNoCard(console.id, site.id, site.name, 'devices');
                                              }}
                                              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] hover:border-emerald-500/60 hover:text-emerald-300 transition-colors"
                                              title="Abrir devices deste site"
                                            >
                                              <Router className="h-3 w-3" />
                                              <span className="font-semibold">{site.deviceCount || 0}</span>
                                              <span className="text-slate-400">dev</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                selecionarSiteNoCard(console.id, site.id, site.name, 'clients');
                                              }}
                                              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] hover:border-cyan-500/60 hover:text-cyan-300 transition-colors"
                                              title="Abrir clients deste site"
                                            >
                                              <Users2 className="h-3 w-3" />
                                              <span className="font-semibold">{siteClients.length}</span>
                                              <span className="text-slate-400">clientes</span>
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })()
                                  ))}
                                  {sitesDoConsole.length > 4 && (
                                    <p className="text-[11px] text-slate-400">+ {sitesDoConsole.length - 4} sites</p>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div className={`h-full ${isOnline ? 'w-full bg-emerald-400' : 'w-2/5 bg-amber-400'}`} />
                            </div>
                            <div className="mt-2 text-xs text-slate-400">
                              Host: {hostNameCard || '-'}
                            </div>

                            <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {totalSitesConsole} sites
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5" />
                                {totalDevicesConsole} devices
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Users2 className="h-3.5 w-3.5" />
                                {totalClientsConsole} clients
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span>Online: {clientsOnlineConsole}</span>
                              <span>Offline: {clientsOfflineConsole}</span>
                            </div>
                            <div className="mt-3 text-[11px] text-slate-400 font-mono break-all">
                              Host ID: {hostIdCard || '-'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    Sites ja estao embutidos nos cards. Clique em um site no card para abrir os devices.
                  </p>
                </div>
              )}

              {activeTab === 'devices' && (
                <div>
                  <div className="mb-3 text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>
                      {siteSelecionadoId
                        ? `Clientes conectados no site: ${clientsFiltradosPorSite.length}`
                        : consoleSelecionadoId
                          ? `Clientes conectados no console: ${clientsExibidos.length}`
                          : `Clientes conectados (todos os sites): ${clientsExibidos.length}`}
                    </span>
                    <span>Online: {clientsOnlineCount}</span>
                    <span>Offline: {clientsOfflineCount}</span>
                    <span className="text-slate-400">
                      Devices: {devicesExibidos.length} | Online: {devicesOnlineCount} | Offline: {devicesOfflineCount}
                    </span>
                  </div>
                  {devicesExibidos.length === 0 ? (
                    <TableState
                      icon={Inbox}
                      title="Nenhum device encontrado"
                      description={consoleSelecionadoId ? 'Nenhum device para o site selecionado.' : 'Tente buscar novamente ou selecionar outro site.'}
                      compact
                    />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-full">
                        <thead>
                          <tr className="bg-gray-100 border-b">
                            <th className="px-4 py-3 text-left font-medium text-gray-700">ID</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Nome</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Modelo</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">IP</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(dadosPaginados as DeviceData[]).map((device) => (
                            <tr key={device.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-xs text-gray-500 font-mono">{device.id}</td>
                              <td className="px-4 py-3 font-medium">{device.name}</td>
                              <td className="px-4 py-3 text-gray-600">{device.model || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{device.ip || '-'}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${normalizeText(device.status) === 'online'
                                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                                  : 'border-rose-500/25 bg-rose-500/10 text-rose-300'
                                  }`}>
                                  {device.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'clients' && (
                <div>
                  <div className="mb-3 text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>
                      {siteSelecionadoId
                        ? `Clientes conectados no site: ${clientsFiltradosPorSite.length}`
                        : `Clientes conectados (todos os sites): ${clientsExibidos.length}`}
                    </span>
                    <span>Online: {clientsOnlineCount}</span>
                    <span>Offline: {clientsOfflineCount}</span>
                  </div>
                  {clientsExibidos.length === 0 ? (
                    <TableState icon={Inbox} title="Nenhum client encontrado" compact />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-full">
                        <thead>
                          <tr className="bg-gray-100 border-b">
                            <th className="px-4 py-3 text-left font-medium text-gray-700">ID</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Nome</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">MAC</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">IP</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">RADIUS Local</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Site</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(dadosPaginados as ClientData[]).map((client) => (
                            <tr key={client.id || client.mac} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-xs text-gray-500 font-mono">{client.id || '-'}</td>
                              <td className="px-4 py-3 font-medium">{client.name || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 font-mono">{client.mac || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{client.ip || '-'}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${normalizeText(client.status) === 'online'
                                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                                  : 'border-rose-500/25 bg-rose-500/10 text-rose-300'
                                  }`}>
                                  {client.status || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {client.radiusLocal ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="inline-flex w-fit items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                      {client.radiusLocal}
                                    </span>
                                    {client.radiusLocalOrigin ? (
                                      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                        Origem: {client.radiusLocalOrigin}
                                      </span>
                                    ) : null}
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {client.siteName ? (
                                  <span className="inline-flex max-w-full items-center rounded-full border border-slate-600/60 bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-slate-200">
                                    <span className="truncate">{client.siteName}</span>
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {totalItens > 0 && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <label htmlFor="itensPorPaginaMonitor" className="text-xs text-gray-600">
                      Itens por página:
                    </label>
                    <select
                      id="itensPorPaginaMonitor"
                      value={itensPorPagina}
                      onChange={(e) => {
                        setItensPorPagina(Number(e.target.value));
                        setPaginaAtual(1);
                      }}
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => irParaPagina(paginaAtualValida - 1)}
                      disabled={paginaAtualValida === 1}
                    >
                      Anterior
                    </Button>
                    {paginasVisiveis.map((pagina, index) => {
                      const ativa = pagina === paginaAtualValida;
                      const paginaAnterior = paginasVisiveis[index - 1];
                      const mostrarReticencias = Boolean(paginaAnterior) && pagina - paginaAnterior > 1;

                      return (
                        <div key={pagina} className="flex items-center gap-2">
                          {mostrarReticencias && <span className="px-1 text-sm text-muted-foreground">...</span>}
                          <button
                            type="button"
                            onClick={() => irParaPagina(pagina)}
                            className={`h-9 w-9 rounded-lg text-sm font-medium transition ${ativa
                              ? 'bg-accent/20 text-accent border border-accent/35'
                              : 'bg-card text-foreground border border-border hover:bg-secondary'
                              }`}
                          >
                            {pagina}
                          </button>
                        </div>
                      );
                    })}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => irParaPagina(paginaAtualValida + 1)}
                      disabled={paginaAtualValida === totalPaginas}
                    >
                      Próxima
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + dadosPaginados.length, totalItens)} de {totalItens}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







