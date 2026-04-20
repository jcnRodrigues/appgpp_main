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
  return [];
}

function getNextToken(payload: any): string {
  if (typeof payload?.nextToken === 'string') return payload.nextToken;
  if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
  return '';
}

function detectConsoleFamily(host: Record<string, unknown>) {
  const haystack = [
    host.model,
    host.type,
    host.consoleType,
    host.name,
    host.displayName,
    host.hostName,
    host.hostname,
    host.description,
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

  const rawType = normalizeText(host.type || host.consoleType || host.model || 'N/A').toUpperCase();
  return rawType || 'N/A';
}

type UiDeviceGroup = {
  hostId: string;
  hostName: string;
  devices: Record<string, unknown>[];
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
      throw new Error(`Falha ao buscar consoles em devices: ${response.status}`);
    }

    const payload = await response.json();
    const list = normalizeList(payload);
    for (const item of list) {
      const hostId = String(item?.hostId || '');
      if (!hostId) continue;

      const existing = groupsByHostId.get(hostId) || {
        hostId,
        hostName: String(item?.hostName || ''),
        devices: [],
      };

      if (Array.isArray(item?.devices)) {
        existing.devices.push(...item.devices);
      } else if (item && typeof item === 'object') {
        existing.devices.push(item as Record<string, unknown>);
      }

      if (!existing.hostName) {
        existing.hostName = String(item?.hostName || existing.hostName || '');
      }

      groupsByHostId.set(hostId, existing);
    }

    nextToken = getNextToken(payload);
    page += 1;
  } while (nextToken && page < maxPages);

  return Array.from(groupsByHostId.values());
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

    const formattedConsoles = groups.map((group) => {
      const consoleDevice =
        group.devices.find((device) => device.isConsole === true) || group.devices[0] || {};
      const family = detectConsoleFamily(consoleDevice);
      const hostId = String(group.hostId || '');
      const hostName = String(group.hostName || '');
      const statusRaw = normalizeText((consoleDevice as Record<string, unknown>).status).toLowerCase();
      const onlineByField =
        (consoleDevice as Record<string, unknown>).online === true ||
        (consoleDevice as Record<string, unknown>).isOnline === true;
      const status = statusRaw || (onlineByField ? 'online' : 'offline');

      return {
        id: hostId,
        hostId,
        hostName,
        name: String(
          (consoleDevice as Record<string, unknown>).name ||
            (consoleDevice as Record<string, unknown>).displayName ||
            hostName ||
            'Console sem nome'
        ),
        type: family,
        status,
        organizationName: '',
      };
    });

    return NextResponse.json({ consoles: formattedConsoles });
  } catch (error) {
    console.error('Erro ao consultar consoles:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao consultar consoles' },
      { status: 500 }
    );
  }
}
