import { NextRequest, NextResponse } from 'next/server';
import { hasModuleAccessForRequest } from '@/lib/access';
import { getUnifiConfig } from '@/features/unifi-config/server/unifi.service';
import { inferMonitorStatus } from '@/lib/monitor-status';
import {
  extractRadiusLocalInfo,
  fetchConnectedClientDetailsBySite,
  fetchIntegrationClientsBySite,
  fetchRadiusProfilesBySite,
  normalizeMonitorList,
  resolveRadiusProfileForClient,
} from '@/lib/monitor-unifi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeText(value: unknown) {
  return String(value || '').trim();
}

function getNextToken(payload: any): string {
  if (typeof payload?.nextToken === 'string') return payload.nextToken;
  if (typeof payload?.pagination?.nextToken === 'string') return payload.pagination.nextToken;
  return '';
}

type SiteRow = {
  id: string;
  name: string;
  consoleId: string;
};

async function fetchAllSitesByApiKey(effectiveApiKey: string): Promise<SiteRow[]> {
  const response = await fetch('https://api.ui.com/v1/sites?pageSize=200', {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Accept: 'application/json',
      'X-API-Key': effectiveApiKey,
    },
  });

  if (!response.ok) return [];
  const payload = await response.json().catch(() => null);
  if (!payload) return [];

  const list = normalizeMonitorList(payload);
  return list.map((site: Record<string, unknown>) => ({
    id: String(site.siteId || site.id || ''),
    name: String(
      (site.meta as Record<string, unknown> | undefined)?.name ||
        site.name ||
        site.displayName ||
        'default'
    ),
    consoleId: String(site.hostId || site.consoleId || ''),
  }));
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
  const list = normalizeMonitorList(payload);
  return list.length > 0 ? list : null;
}

function pickNestedValue(source: unknown, path: string[]): unknown {
  let current: any = source;
  for (const key of path) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
}

function normalizeSiteToken(value: unknown) {
  const text = normalizeText(value);
  return text && text.toLowerCase() !== 'default' ? text : '';
}

export async function POST(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'MONITOR_PATRIMONIOS');
  if (!canAccess) {
    return NextResponse.json({ error: 'Sem permissao para acessar monitoramento' }, { status: 403 });
  }

  const { apiKey } = await request.json();
  const savedConfig = await getUnifiConfig();
  const effectiveApiKey = apiKey || savedConfig?.apiKey || process.env.UNIFI_API_KEY;

  if (!effectiveApiKey) {
    return NextResponse.json({ error: 'API Key e necessaria' }, { status: 400 });
  }

  try {
    const [sites, groupsResponse] = await Promise.all([
      fetchAllSitesByApiKey(effectiveApiKey),
      fetch('https://api.ui.com/v1/devices?pageSize=100&hostIds[]=', {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          Accept: 'application/json',
          'X-API-Key': effectiveApiKey,
        },
      }),
    ]);

    const groupsPayload = groupsResponse.ok ? await groupsResponse.json().catch(() => null) : null;
    const groups = normalizeMonitorList(groupsPayload);

    const siteNameByKey = new Map<string, string>();
    const consoleHostNameById = new Map<string, string>();
    for (const site of sites) {
      const id = String(site.id || '').trim();
      const name = String(site.name || '').trim();
      const consoleId = String(site.consoleId || '').trim();
      if (id && name && !siteNameByKey.has(id)) siteNameByKey.set(id, name);
      if (consoleId && name && !siteNameByKey.has(consoleId)) siteNameByKey.set(consoleId, name);
      if (name && !siteNameByKey.has(name.toLowerCase())) siteNameByKey.set(name.toLowerCase(), name);
    }

    const consoleBySiteId = new Map<string, string>();
    for (const item of groups) {
      const hostId = String(item?.hostId || '');
      const hostName = String(item?.hostName || '');
      const siteId = String(item?.siteId || item?.site?.id || item?.id || hostId || '');
      if (siteId && hostId && !consoleBySiteId.has(siteId)) {
        consoleBySiteId.set(siteId, hostId);
      }
      if (hostName && siteId && !consoleBySiteId.has(hostName)) {
        consoleBySiteId.set(hostName, hostId);
      }
      if (hostId && hostName && !consoleHostNameById.has(hostId)) {
        consoleHostNameById.set(hostId, hostName);
      }
    }

    const clientsByKey = new Map<string, any>();
    const isUcgConsole = (consoleName: string) => /UCG|CLOUD GATEWAY/i.test(consoleName);

    for (const site of sites) {
      const siteId = String(site.id || '').trim();
      const consoleId = String(site.consoleId || consoleBySiteId.get(siteId) || '').trim();
      const consoleName = String(site.name || '').trim();
      const useRadiusLookup = isUcgConsole(consoleName) || isUcgConsole(String(consoleHostNameById.get(consoleId) || ''));
      const radiusProfiles = useRadiusLookup
        ? await fetchRadiusProfilesBySite(effectiveApiKey, consoleId || siteId, siteId).catch(() => null)
        : null;
      const siteCandidates = Array.from(
        new Set([siteId, 'default'].map((value) => String(value || '').trim()).filter(Boolean))
      );

      let clientsRaw: any[] = [];
      if (consoleId) {
        for (const candidateSiteId of siteCandidates) {
          const integrationClients = await fetchIntegrationClientsBySite(
            effectiveApiKey,
            consoleId,
            candidateSiteId,
            { limit: 100, maxPages: 10 }
          ).catch(() => null);

          if (integrationClients && integrationClients.length > 0) {
            clientsRaw = integrationClients;
            break;
          }
        }
      }

      if (clientsRaw.length === 0 && consoleId) {
        const candidatePaths = [
          `proxy/network/api/s/${encodeURIComponent(siteId || 'default')}/stat/sta`,
          `proxy/network/api/s/${encodeURIComponent(site.name || 'default')}/stat/sta`,
          'network/default/client',
          'network/default/clients',
        ];

        for (const path of candidatePaths) {
          try {
            const list = await fetchConnectorPath(effectiveApiKey, consoleId, path);
            if (list && list.length > 0) {
              clientsRaw = list;
              break;
            }
          } catch {
            // segue para o próximo caminho
          }
        }
      }

      for (let idx = 0; idx < clientsRaw.length; idx += 1) {
        const client = clientsRaw[idx] as Record<string, unknown>;
        const clientSiteIdRaw = String(
          client.siteId ||
            pickNestedValue(client, ['site', 'id']) ||
            pickNestedValue(client, ['site', 'siteId']) ||
            pickNestedValue(client, ['site', 'site_id']) ||
            client.siteKey ||
            client.networkSiteId ||
            client.networkSite ||
            siteId ||
            ''
        ).trim();
        const clientSiteId = normalizeSiteToken(clientSiteIdRaw);
        const clientSiteNameRaw = String(
          client.siteName ||
            pickNestedValue(client, ['site', 'name']) ||
            pickNestedValue(client, ['site', 'displayName']) ||
            client.hostName ||
            client.ap_name ||
            client.apName ||
            ''
        ).trim();
        const clientSiteName = normalizeSiteToken(clientSiteNameRaw);
        const hostNameResolved = consoleHostNameById.get(consoleId) || consoleHostNameById.get(siteId) || '';
        const siteNameResolved =
          (clientSiteId ? siteNameByKey.get(clientSiteId) || '' : '') ||
          (clientSiteName ? siteNameByKey.get(clientSiteName.toLowerCase()) || clientSiteName : '') ||
          (hostNameResolved && hostNameResolved !== 'default' ? hostNameResolved : '') ||
          (siteId.toLowerCase() !== 'default' ? siteNameByKey.get(siteId) || '' : '') ||
          (site.name && site.name !== 'default' ? site.name : '') ||
          'Site sem nome';
        const siteIdResolved = clientSiteId || (siteId.toLowerCase() !== 'default' ? siteId : '') || consoleId;

        const normalized = {
          id: String(client.id || client.clientId || client._id || client.mac || `${siteId || consoleId}-${idx}`),
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
          status: inferMonitorStatus(client),
          siteId: siteIdResolved,
          siteKey: siteIdResolved,
          siteName: siteNameResolved,
          radiusLocal: null as string | null,
          radiusLocalOrigin: null as string | null,
        };

        const maybeRadius = extractRadiusLocalInfo(client);
        const useUcgRadiusLookup = useRadiusLookup || isUcgConsole(siteNameResolved);
        let radiusInfo = maybeRadius;
        const radiusProfile = useUcgRadiusLookup ? resolveRadiusProfileForClient(client, radiusProfiles) : null;
        if (radiusProfile) {
          normalized.radiusLocal = radiusProfile.name || normalized.radiusLocal;
          normalized.radiusLocalOrigin = radiusProfile.origin || normalized.radiusLocalOrigin;
        }
        if (!radiusInfo && useUcgRadiusLookup && normalized.id) {
          const detail = await fetchConnectedClientDetailsBySite(
            effectiveApiKey,
            consoleId || siteId,
            clientSiteId || siteId,
            normalized.id
          ).catch(() => null);
          if (detail) {
            radiusInfo = extractRadiusLocalInfo(detail);
            if (!radiusProfile) {
              normalized.radiusLocal = radiusInfo?.username || null;
              normalized.radiusLocalOrigin = radiusInfo?.authType || null;
            }
          }
        }

        if (!radiusProfile && radiusInfo) {
          normalized.radiusLocal = radiusInfo.username;
          normalized.radiusLocalOrigin = radiusInfo.authType;
        }

        const key = `${normalized.id}::${normalized.mac}`;
        if (!clientsByKey.has(key)) clientsByKey.set(key, normalized);
      }
    }

    return NextResponse.json({ clients: Array.from(clientsByKey.values()) });
  } catch (error) {
    console.error('Erro ao consultar clients:', error);
    return NextResponse.json({ clients: [] });
  }
}
