import { NextRequest, NextResponse } from 'next/server';
import { getUnifiConfig } from '@/back-end/service/unifi.service';

type ProxyBody = {
  apiKey?: string;
  consoleId?: string;
  path?: string;
  method?: string;
  data?: unknown;
  action?: string;
  pageSize?: number;
};

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.hosts)) return payload.hosts;
  if (Array.isArray(payload?.devices)) return payload.devices;
  return [];
}

function getNextToken(payload: any): string {
  if (typeof payload?.nextToken === 'string') return payload.nextToken;
  if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
  return '';
}

async function fetchUiApi(
  effectiveApiKey: string,
  path: string,
  options?: { method?: string; data?: unknown }
) {
  const method = String(options?.method || 'GET').toUpperCase();
  const response = await fetch(`https://api.ui.com/v1/${path}`, {
    method,
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': effectiveApiKey,
    },
    body: options?.data && ['POST', 'PUT', 'PATCH'].includes(method) ? JSON.stringify(options.data) : undefined,
  });

  const responseText = await response.text();
  let responseData: unknown = {};
  try {
    responseData = responseText ? JSON.parse(responseText) : {};
  } catch {
    responseData = { message: responseText };
  }

  if (!response.ok) {
    throw { status: response.status, data: responseData, path };
  }

  return responseData;
}

async function fetchAllHosts(effectiveApiKey: string, pageSize: number) {
  const hosts: any[] = [];
  let nextToken = '';
  let page = 0;
  const maxPages = 100;

  do {
    const query = new URLSearchParams({ pageSize: String(pageSize) });
    if (nextToken) query.set('nextToken', nextToken);
    const payload = await fetchUiApi(effectiveApiKey, `hosts?${query.toString()}`);
    hosts.push(...normalizeList(payload));
    nextToken = getNextToken(payload);
    page += 1;
  } while (nextToken && page < maxPages);

  return hosts;
}

async function fetchAllDevicesByHost(effectiveApiKey: string, hostId: string, pageSize: number) {
  const devices: any[] = [];
  let nextToken = '';
  let page = 0;
  const maxPages = 100;

  do {
    const query = new URLSearchParams({
      'hostIds[]': hostId,
      pageSize: String(pageSize),
    });
    if (nextToken) query.set('nextToken', nextToken);
    const payload = await fetchUiApi(effectiveApiKey, `devices?${query.toString()}`);
    const list = normalizeList(payload);
    const flattened = list.length > 0 && Array.isArray(list[0]?.devices)
      ? list.flatMap((item: Record<string, unknown>) => (item.devices as any[]) || [])
      : list;
    devices.push(...flattened);
    nextToken = getNextToken(payload);
    page += 1;
  } while (nextToken && page < maxPages);

  return devices;
}

function mapToSitesAndDevices(hosts: Array<{ hostId: string; hostName: string; devices: any[] }>) {
  const sites = hosts.map((host) => ({
    id: String(host.hostId || ''),
    name: String(host.hostName || 'Site sem nome'),
    description: '',
    consoleId: String(host.hostId || ''),
    consoleName: String(host.hostName || ''),
    deviceCount: Array.isArray(host.devices) ? host.devices.length : 0,
  }));

  const devices = hosts.flatMap((host) =>
    (Array.isArray(host.devices) ? host.devices : []).map((device: Record<string, unknown>, idx: number) => ({
      id: String(device.id || device.deviceId || device.mac || `${host.hostId}-${idx}`),
      name: String(device.name || device.displayName || 'Device sem nome'),
      type: String(device.type || device.deviceType || device.model || 'Unknown'),
      mac: String(device.mac || device.macAddress || ''),
      ip: String(device.ip || device.ipAddress || ''),
      status: String(device.status || 'Offline'),
      siteId: String(host.hostId || ''),
      siteName: String(host.hostName || ''),
      model: String(device.model || device.deviceModel || ''),
      firmware: String(device.version || device.firmwareVersion || ''),
      firmwareStatus: String(device.firmwareStatus || ''),
      updateAvailable: String(device.updateAvailable || ''),
      isConsole: Boolean(device.isConsole),
      isManaged: Boolean(device.isManaged),
      startupTime: String(device.startupTime || ''),
      adoptionTime: String(device.adoptionTime || ''),
      note: String(device.note || ''),
    }))
  );

  return { sites, devices };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProxyBody;
    const { apiKey, consoleId, path, method = 'GET', data = null, action } = body;

    const savedConfig = await getUnifiConfig();
    const effectiveApiKey = apiKey || savedConfig?.apiKey || process.env.UNIFI_API_KEY;

    if (!effectiveApiKey) {
      return NextResponse.json({ error: 'API Key e necessaria' }, { status: 400 });
    }

    if (action === 'hosts-and-devices' || action === 'sites-and-devices') {
      const pageSize = Number(body.pageSize || 100);
      const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 200) : 100;

      const hosts = await fetchAllHosts(effectiveApiKey, safePageSize);
      const results = await Promise.all(
        hosts.map(async (host: Record<string, unknown>) => {
          const hostId = String(host.id || host.hostId || '');
          if (!hostId) return null;
          const hostName = String(host.name || host.displayName || host.hostName || '');
          const devices = await fetchAllDevicesByHost(effectiveApiKey, hostId, safePageSize);
          return {
            hostId,
            hostName,
            totalDevices: devices.length,
            devices,
          };
        })
      );

      const byHost = results.filter(Boolean);
      const totalDevices = byHost.reduce((acc, item) => acc + Number(item?.totalDevices || 0), 0);

      if (action === 'sites-and-devices') {
        const { sites, devices } = mapToSitesAndDevices(
          byHost.map((item) => ({
            hostId: String(item?.hostId || ''),
            hostName: String(item?.hostName || ''),
            devices: Array.isArray(item?.devices) ? item.devices : [],
          }))
        );

        return NextResponse.json({
          totalSites: sites.length,
          totalDevices: devices.length,
          sites,
          devices,
        });
      }

      return NextResponse.json({
        totalHosts: byHost.length,
        totalDevices,
        hosts: byHost,
      });
    }

    if (!path) {
      return NextResponse.json({ error: 'path e necessario' }, { status: 400 });
    }

    const cleanPath = String(path).startsWith('/') ? String(path).slice(1) : String(path);
    const url = consoleId
      ? `https://api.ui.com/v1/connector/consoles/${consoleId}/${cleanPath}`
      : `https://api.ui.com/v1/${cleanPath}`;

    const fetchOptions: RequestInit = {
      method: String(method).toUpperCase(),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': effectiveApiKey,
      },
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method as string)) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, { ...fetchOptions, cache: 'no-store' });
    const responseText = await response.text();

    let responseData: unknown = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro na API UniFi', details: responseData, url }, { status: response.status });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    if (typeof error === 'object' && error && 'status' in error) {
      const e = error as { status: number; data: unknown; path: string };
      return NextResponse.json(
        { error: 'Erro na API UniFi', details: e.data, path: e.path },
        { status: e.status }
      );
    }
    console.error('Erro no proxy Unifi:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
