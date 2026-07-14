export function normalizeMonitorList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.clients)) return payload.clients;
  if (Array.isArray(payload?.devices)) return payload.devices;
  if (Array.isArray(payload?.hosts)) return payload.hosts;
  return [];
}

async function fetchMonitorPath(apiKey: string, path: string) {
  const attemptFetch = async () => {
    const response = await fetch(`https://api.ui.com/v1/${path}`, {
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
    return payload;
  };

  try {
    return await attemptFetch();
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code || '').toUpperCase() : '';

    if (message.includes('aborted') || message.includes('fetch aborted') || code === 'ECONNRESET' || code === 'ETIMEDOUT') {
      await new Promise((resolve) => setTimeout(resolve, 250));
      try {
        return await attemptFetch();
      } catch {
        return null;
      }
    }

    return null;
  }
}

function pickNestedValue(source: unknown, path: string[]): unknown {
  let current: any = source;
  for (const key of path) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
}

function normalizeLower(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

export async function fetchIntegrationClientsBySite(
  apiKey: string,
  consoleId: string,
  siteId: string,
  options?: { filter?: string; limit?: number; maxPages?: number }
): Promise<any[] | null> {
  const limit = Math.max(1, Math.min(Number(options?.limit || 100), 500));
  const maxPages = Math.max(1, Number(options?.maxPages || 20));
  const filter = String(options?.filter || '').trim();

  const clients: any[] = [];
  for (let page = 0; page < maxPages; page += 1) {
    const offset = page * limit;
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
    });
    if (filter) params.set('filter', filter);

    const payload = await fetchMonitorPath(
      apiKey,
      `connector/consoles/${encodeURIComponent(consoleId)}/proxy/network/integration/v1/sites/${encodeURIComponent(siteId)}/clients?${params.toString()}`
    );
    if (!payload) break;

    const list = normalizeMonitorList(payload);
    if (list.length === 0) break;
    clients.push(...list);
    if (list.length < limit) break;
  }

  return clients.length > 0 ? clients : null;
}

export async function fetchConnectedClientDetailsBySite(
  apiKey: string,
  consoleId: string,
  siteId: string,
  clientId: string
): Promise<Record<string, unknown> | null> {
  const candidates = [
    `connector/consoles/${encodeURIComponent(consoleId)}/proxy/network/integration/v1/sites/${encodeURIComponent(siteId)}/clients/${encodeURIComponent(clientId)}`,
    `connector/consoles/${encodeURIComponent(consoleId)}/proxy/network/integration/v1/sites/${encodeURIComponent(siteId)}/clients/${encodeURIComponent(clientId)}/details`,
    `connector/consoles/${encodeURIComponent(consoleId)}/proxy/network/integration/v1/sites/${encodeURIComponent(siteId)}/clients/${encodeURIComponent(clientId)}/info`,
  ];

  for (const path of candidates) {
    const payload = await fetchMonitorPath(apiKey, path).catch(() => null);
    if (!payload) continue;
    const list = normalizeMonitorList(payload);
    if (list.length > 0) return list[0] as Record<string, unknown>;
    if (typeof payload === 'object') return payload as Record<string, unknown>;
  }

  return null;
}

export async function fetchRadiusProfilesBySite(
  apiKey: string,
  consoleId: string,
  siteId: string,
  options?: { offset?: number; limit?: number; filter?: string; maxPages?: number }
): Promise<Array<Record<string, unknown>> | null> {
  const limit = Math.max(1, Math.min(Number(options?.limit || 200), 500));
  const maxPages = Math.max(1, Number(options?.maxPages || 1));
  const filter = String(options?.filter || '').trim();
  const basePath = `connector/consoles/${encodeURIComponent(consoleId)}/proxy/network/integration/v1/sites/${encodeURIComponent(siteId)}/radius/profiles`;

  for (let page = 0; page < maxPages; page += 1) {
    const offset = Number(options?.offset || 0) + page * limit;
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
    });
    if (filter) params.set('filter', filter);

    const candidates = [
      `${basePath}?${params.toString()}`,
      `${basePath}?limit=${limit}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`,
    ];

    for (const path of candidates) {
      const payload = await fetchMonitorPath(apiKey, path).catch(() => null);
      if (!payload) continue;
      const list = normalizeMonitorList(payload);
      if (list.length > 0) return list as Array<Record<string, unknown>>;
    }
  }

  return null;
}

export function extractRadiusLocalInfo(client: Record<string, unknown>) {
  const accessPayload = [
    client.accessInformation,
    client.accessInfo,
    client.access,
    client.authentication,
    client.auth,
    client.connection,
    client.connectionType,
    client.authType,
    client.authenticationType,
    client.radius,
    client.radiusInfo,
    client.radiusLocal,
    pickNestedValue(client, ['accessInformation']),
    pickNestedValue(client, ['accessInfo']),
    pickNestedValue(client, ['access']),
    pickNestedValue(client, ['authentication']),
    pickNestedValue(client, ['radius']),
    pickNestedValue(client, ['radiusInfo']),
  ]
    .filter(Boolean)
    .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
    .join(' ')
    .trim();

  const normalized = accessPayload.toLowerCase();
  if (!normalized) return null;

  const radiusLike = ['radius', '802.1x', '8021x', 'dot1x', 'eap', 'local auth', 'local radius', 'local'];
  if (!radiusLike.some((term) => normalized.includes(term))) return null;

  const username =
    String(
      client.userName ||
        client.username ||
        client.identity ||
        client.clientIdentity ||
        pickNestedValue(client, ['user', 'name']) ||
        pickNestedValue(client, ['accessInformation', 'username']) ||
        pickNestedValue(client, ['accessInfo', 'username']) ||
        pickNestedValue(client, ['radius', 'username']) ||
        pickNestedValue(client, ['radiusInfo', 'username']) ||
        ''
    ).trim() || null;

  const authType = String(
    client.authType ||
      client.authenticationType ||
      client.connectionType ||
      pickNestedValue(client, ['accessInformation', 'type']) ||
      pickNestedValue(client, ['accessInfo', 'type']) ||
      pickNestedValue(client, ['radius', 'type']) ||
      ''
  ).trim() || null;

  return {
    username,
    authType,
    raw: accessPayload,
  };
}

export function resolveRadiusProfileForClient(
  client: Record<string, unknown>,
  profiles: Array<Record<string, unknown>> | null | undefined
) {
  const profileCandidates = [
    client.radiusProfileName,
    client.radiusProfile,
    client.profileName,
    client.profile,
    pickNestedValue(client, ['accessInformation', 'profileName']),
    pickNestedValue(client, ['accessInfo', 'profileName']),
    pickNestedValue(client, ['radius', 'profileName']),
    pickNestedValue(client, ['radiusInfo', 'profileName']),
    pickNestedValue(client, ['radius', 'name']),
    pickNestedValue(client, ['accessInformation', 'name']),
  ]
    .filter(Boolean)
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  const profileIdCandidates = [
    client.radiusProfileId,
    client.profileId,
    pickNestedValue(client, ['accessInformation', 'profileId']),
    pickNestedValue(client, ['accessInfo', 'profileId']),
    pickNestedValue(client, ['radius', 'profileId']),
    pickNestedValue(client, ['radiusInfo', 'profileId']),
  ]
    .filter(Boolean)
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  const normalizedProfiles = Array.isArray(profiles) ? profiles : [];
  if (normalizedProfiles.length === 0) {
    return null;
  }

  const directMatch =
    normalizedProfiles.find((profile) => profileIdCandidates.some((candidate) => normalizeLower(profile.id) === normalizeLower(candidate))) ||
    normalizedProfiles.find((profile) => profileCandidates.some((candidate) => normalizeLower(profile.name) === normalizeLower(candidate)));

  if (directMatch) {
    return {
      id: String(directMatch.id || ''),
      name: String(directMatch.name || ''),
      origin: String((directMatch.metadata as Record<string, unknown> | undefined)?.origin || ''),
    };
  }

  const radiusLike = extractRadiusLocalInfo(client);
  if (!radiusLike) return null;

  const firstProfile = normalizedProfiles[0];
  if (!firstProfile) return null;

  return {
    id: String(firstProfile.id || ''),
    name: String(firstProfile.name || ''),
    origin: String((firstProfile.metadata as Record<string, unknown> | undefined)?.origin || ''),
  };
}
