import { NextRequest, NextResponse } from 'next/server';
import { getUnifiConfig } from '@/back-end/service/unifi.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.sites)) return payload.sites;
  if (Array.isArray(payload?.hosts)) return payload.hosts;
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
      throw new Error(`Falha ao buscar devices para sites: ${response.status}`);
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
      };

      if (Array.isArray(item?.devices)) {
        existing.devices.push(...item.devices);
      } else if (item && typeof item === 'object') {
        existing.devices.push(item as Record<string, unknown>);
      }

      if (!existing.hostName || existing.hostName === 'Site sem nome') {
        existing.hostName = String(item?.hostName || existing.hostName || 'Site sem nome');
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

    const sites = groups.map((group) => ({
      id: String(group.hostId || ''),
      name: String(group.hostName || 'Site sem nome'),
      description: 'Site Manager Host',
      consoleId: String(group.hostId || ''),
      consoleName: String(group.hostName || ''),
      deviceCount: Array.isArray(group.devices) ? group.devices.length : 0,
    }));

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Erro ao consultar sites:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao consultar sites' },
      { status: 500 }
    );
  }
}
