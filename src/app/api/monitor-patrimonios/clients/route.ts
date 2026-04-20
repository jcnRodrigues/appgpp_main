import { NextRequest, NextResponse } from 'next/server';
import { getUnifiConfig } from '@/back-end/service/unifi.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.clients)) return payload.clients;
  if (Array.isArray(payload?.devices)) return payload.devices;
  if (Array.isArray(payload?.hosts)) return payload.hosts;
  return [];
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
    const sitesResponse = await fetch('https://api.ui.com/v1/sites?pageSize=200', {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Accept: 'application/json',
        'X-API-Key': effectiveApiKey,
      },
    });
    if (!sitesResponse.ok) {
      return NextResponse.json({ clients: [] });
    }
    const sitesPayload = await sitesResponse.json();
    const sites = normalizeList(sitesPayload).map((site: Record<string, unknown>) => ({
      id: String(site.siteId || site.id || ''),
      name: String(
        (site.meta as Record<string, unknown> | undefined)?.name ||
          site.name ||
          site.displayName ||
          'default'
      ),
      label: String(
        (site.meta as Record<string, unknown> | undefined)?.desc ||
          (site.meta as Record<string, unknown> | undefined)?.name ||
          site.name ||
          'Site sem nome'
      ),
      consoleId: String(site.hostId || site.consoleId || ''),
    }));

    const results = await Promise.all(
      sites.map(async (site: { id: string; name: string; label: string; consoleId: string }) => {
        if (!site.consoleId) return [];

        const candidatePaths = [
          `proxy/network/api/s/${encodeURIComponent(site.name || 'default')}/stat/sta`,
          `sites/${site.id}/network/default/client`,
          `sites/${site.id}/network/default/clients`,
          'network/default/client',
          'network/default/clients',
        ];

        let clients: any[] | null = null;
        for (const path of candidatePaths) {
          try {
            const list = await fetchConnectorPath(effectiveApiKey, site.consoleId, path);
            if (list) {
              clients = list;
              break;
            }
          } catch {
            // tenta proximo path
          }
        }

        if (!clients) return [];

        return clients.map((client: Record<string, unknown>, idx: number) => ({
          id: String(client.id || client.clientId || client._id || client.mac || `${site.id}-${idx}`),
          name: String(
            client.name ||
              client.hostname ||
              client.displayName ||
              client.essid ||
              client.ap_name ||
              'Cliente sem nome'
          ),
          mac: String(client.mac || client.macAddress || ''),
          ip: String(client.ip || client.ipAddress || ''),
          status: client.status
            ? String(client.status)
            : client.online === true || Number(client.state) === 1
              ? 'Online'
              : 'Offline',
          // Usa o hostId/consoleId para manter a mesma chave usada nas abas Sites/Devices.
          siteId: site.consoleId || site.id,
          siteName: site.label || site.name,
        }));
      })
    );

    const dedupe = new Map<string, any>();
    for (const client of results.flat()) {
      const key = `${client.id}::${client.mac}`;
      if (!dedupe.has(key)) dedupe.set(key, client);
    }

    return NextResponse.json({ clients: Array.from(dedupe.values()) });
  } catch (error) {
    console.error('Erro ao consultar clients:', error);
    return NextResponse.json({ clients: [] });
  }
}
