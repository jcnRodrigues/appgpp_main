import { NextRequest, NextResponse } from 'next/server';
import { getUnifiConfig } from '@/back-end/service/unifi.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.devices)) return payload.devices;
  return [];
}

function getNextToken(payload: any): string {
  if (typeof payload?.nextToken === 'string') return payload.nextToken;
  if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
  return '';
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

    const devicesResponse = await fetch(`https://api.ui.com/v1/devices?${params.toString()}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Accept: 'application/json',
        'X-API-Key': effectiveApiKey,
      },
    });

    if (!devicesResponse.ok) {
      throw new Error(`Falha ao buscar devices: ${devicesResponse.status}`);
    }

    const devicesPayload = await devicesResponse.json();
    const list = normalizeList(devicesPayload);
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

    nextToken = getNextToken(devicesPayload);
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

    const devicesOrdenados = groups
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

    return NextResponse.json({ devices: devicesOrdenados });
  } catch (error) {
    console.error('Erro ao consultar devices:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao consultar devices' },
      { status: 500 }
    );
  }
}
