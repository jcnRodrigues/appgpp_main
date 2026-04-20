import { NextRequest, NextResponse } from 'next/server';
import { getUnifiConfig } from '@/back-end/service/unifi.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeText(value: unknown) {
  return String(value || '').trim();
}

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.hosts)) return payload.hosts;
  if (Array.isArray(payload?.devices)) return payload.devices;
  if (Array.isArray(payload?.clients)) return payload.clients;
  return [];
}

function getNextToken(payload: any): string {
  if (typeof payload?.nextToken === 'string') return payload.nextToken;
  if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
  return '';
}

function detectConsoleFamily(device: Record<string, unknown>) {
  const haystack = [
    device.model,
    device.type,
    device.consoleType,
    device.name,
    device.displayName,
    device.hostName,
    device.hostname,
    device.description,
  ]
    .map((item) => normalizeText(item).toUpperCase())
    .join(' ');

  const patterns: Array<[RegExp, string]> = [
    [/\bUCG\b|CLOUD GATEWAY/, 'UCG'],
    [/\bUDM\b|DREAM MACHINE/, 'UDM'],
    [/\bUXG\b/, 'UXG'],
    [/\bUSG\b/, 'USG'],
    [/\bUDR\b/, 'UDR'],
    [/\bUDW\b/, 'UDW'],
    [/\bUCK\b|CLOUD KEY/, 'UCK'],
  ];

  for (const [regex, family] of patterns) {
    if (regex.test(haystack)) return family;
  }

  return normalizeText(device.type || device.consoleType || device.model || 'N/A').toUpperCase() || 'N/A';
}

type UiDeviceGroup = {
  hostId: string;
  hostName: string;
  devices: Record<string, unknown>[];
  updatedAt?: string;
};

async function fetchAllDeviceGroupsByApiKey(
  effectiveApiKey: string,
  pageSize = 100
): Promise<UiDeviceGroup[]> {
  const groupsByHostId = new Map<string, UiDeviceGroup>();
  let nextToken = '';
  let page = 0;
  const maxPages = 100;

  do {
    const params = new URLSearchParams({
      pageSize: String(pageSize),
    });
    params.append('hostIds[]', '');
    if (nextToken) {
      params.set('nextToken', nextToken);
    }

    const response = await fetch(`https://api.ui.com/v1/devices?${params.toString()}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Accept: 'application/json',
        'X-API-Key': effectiveApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Falha ao buscar devices: ${response.status}`);
    }

    const payload = await response.json();
    const list = normalizeList(payload);
    for (const item of list) {
      const hostId = String(item?.hostId || '');
      if (!hostId) continue;

      const existing = groupsByHostId.get(hostId) || {
        hostId,
        hostName: String(item?.hostName || 'Site sem nome'),
        devices: [],
        updatedAt: item?.updatedAt ? String(item.updatedAt) : undefined,
      };

      if (Array.isArray(item?.devices)) {
        existing.devices.push(...item.devices);
      } else if (item && typeof item === 'object') {
        existing.devices.push(item as Record<string, unknown>);
      }

      if (!existing.hostName || existing.hostName === 'Site sem nome') {
        existing.hostName = String(item?.hostName || existing.hostName || 'Site sem nome');
      }
      if (item?.updatedAt) {
        existing.updatedAt = String(item.updatedAt);
      }

      groupsByHostId.set(hostId, existing);
    }

    nextToken = getNextToken(payload);
    page += 1;
  } while (nextToken && page < maxPages);

  return Array.from(groupsByHostId.values());
}

async function fetchConnectorPath(apiKey: string, consoleId: string, path: string) {
  const response = await fetch(`https://api.ui.com/v1/connector/consoles/${consoleId}/${path}`, {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Accept: 'application/json',
      'X-API-Key': apiKey,
    },
  });

  if (!response.ok) return null;
  const payload = await response.json().catch(() => null);
  if (!payload) return null;
  const list = normalizeList(payload);
  return list.length > 0 ? list : null;
}

export async function POST(request: NextRequest) {
  const { apiKey } = await request.json();
  const savedConfig = await getUnifiConfig();
  const effectiveApiKey = apiKey || savedConfig?.apiKey || process.env.UNIFI_API_KEY;

  if (!effectiveApiKey) {
    return NextResponse.json({ error: 'API Key e necessaria' }, { status: 400 });
  }

  try {
    const groups = await fetchAllDeviceGroupsByApiKey(effectiveApiKey, 100);

    const devices = groups
      .flatMap((group) =>
        (Array.isArray(group.devices) ? group.devices : []).map((device: Record<string, unknown>, idx: number) => ({
          id: String(device.id || device.deviceId || device.mac || `${group.hostId}-${idx}`),
          name: String(device.name || device.displayName || 'Device sem nome'),
          type: String(device.type || device.deviceType || device.model || 'Unknown'),
          mac: String(device.mac || device.macAddress || ''),
          ip: String(device.ip || device.ipAddress || device.host || ''),
          shortname: String(device.shortname || device.shortName || ''),
          productLine: String(device.productLine || device.platform || ''),
          status:
            device.status
              ? String(device.status)
              : device.online === true || device.isOnline === true || Number(device.state) === 1
                ? 'Online'
                : 'Offline',
          siteId: String(group.hostId || ''),
          siteName: String(group.hostName || 'Site sem nome'),
          model: String(device.model || device.deviceModel || ''),
          firmware: String(device.version || device.firmwareVersion || ''),
          firmwareStatus: String(device.firmwareStatus || ''),
          updateAvailable: String(device.updateAvailable || ''),
          isConsole: Boolean(device.isConsole),
          isManaged: Boolean(device.isManaged),
          startupTime: String(device.startupTime || ''),
          adoptionTime: String(device.adoptionTime || ''),
          note: String(device.note || ''),
          lastUpdatedAt: String(group.updatedAt || ''),
        }))
      )
      .sort(
        (a, b) =>
          new Date(b.lastUpdatedAt || b.startupTime || 0).getTime() -
          new Date(a.lastUpdatedAt || a.startupTime || 0).getTime()
      );

    const sites = groups.map((group) => ({
      id: String(group.hostId || ''),
      name: String(group.hostName || 'Site sem nome'),
      description: 'Site Manager Host',
      consoleId: String(group.hostId || ''),
      consoleName: String(group.hostName || ''),
      deviceCount: Array.isArray(group.devices) ? group.devices.length : 0,
    }));

    const consoles = groups.map((group) => {
      const consoleDevice =
        group.devices.find((device) => device.isConsole === true) || group.devices[0] || {};
      const statusRaw = normalizeText((consoleDevice as Record<string, unknown>).status).toLowerCase();
      const onlineByField =
        (consoleDevice as Record<string, unknown>).online === true ||
        (consoleDevice as Record<string, unknown>).isOnline === true;
      const status = statusRaw || (onlineByField ? 'online' : 'offline');

      return {
        id: String(group.hostId || ''),
        hostId: String(group.hostId || ''),
        hostName: String(group.hostName || ''),
        name: String(
          (consoleDevice as Record<string, unknown>).name ||
            (consoleDevice as Record<string, unknown>).displayName ||
            group.hostName ||
            'Console sem nome'
        ),
        type: detectConsoleFamily(consoleDevice),
        status,
        organizationName: '',
      };
    });

    const clientsByKey = new Map<string, any>();
    for (const group of groups) {
      const siteId = String(group.hostId || '');
      if (!siteId) continue;

      const candidatePaths = ['network/default/client', 'network/default/clients'];
      let clientsRaw: any[] | null = null;
      for (const path of candidatePaths) {
        try {
          const list = await fetchConnectorPath(effectiveApiKey, siteId, path);
          if (list) {
            clientsRaw = list;
            break;
          }
        } catch {
          // ignora erro pontual do host
        }
      }
      if (!clientsRaw) continue;

      for (let idx = 0; idx < clientsRaw.length; idx += 1) {
        const client = clientsRaw[idx] as Record<string, unknown>;
        const normalized = {
          id: String(client.id || client.clientId || client._id || client.mac || `${siteId}-${idx}`),
          name: String(client.name || client.hostname || client.displayName || 'Cliente sem nome'),
          mac: String(client.mac || client.macAddress || ''),
          ip: String(client.ip || client.ipAddress || ''),
          status: client.status
            ? String(client.status)
            : client.online === true || Number(client.state) === 1
              ? 'Online'
              : 'Offline',
          siteId,
          siteName: String(group.hostName || 'Site sem nome'),
        };
        const key = `${normalized.id}::${normalized.mac}`;
        if (!clientsByKey.has(key)) clientsByKey.set(key, normalized);
      }
    }

    return NextResponse.json({
      consoles,
      sites,
      devices,
      clients: Array.from(clientsByKey.values()),
      loadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao consultar overview monitor-patrimonios:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao consultar overview' },
      { status: 500 }
    );
  }
}
