import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasModuleAccessForRequest } from '@/lib/access';
import { getUnifiConfig } from '@/features/unifi-config/server/unifi.service';
import { listarPatrimonios } from '@/features/patrimonio/server/patrimonio.service';
import { inferMonitorStatus } from '@/lib/monitor-status';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ConsultaModo = 'HIBRIDO' | 'REDE' | 'INTERNET';

function normalizeText(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function normalizeSerialMatch(value: unknown) {
  return String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '')
    .toUpperCase();
}

function extractSearchKey(value: unknown) {
  const raw = normalizeText(value);
  if (!raw) return '';

  const digits = raw.replace(/\D+/g, '');
  if (digits.length >= 3) return digits;

  const compact = raw.replace(/[^a-z0-9]+/g, '');
  return compact;
}

function normalizeTypeText(value: unknown) {
  return normalizeText(value)
    .replace(/0/g, 'o')
    .replace(/1/g, 'i');
}

function isTipoPatrimonioPermitido(descricao?: string | null) {
  const texto = normalizeTypeText(descricao);
  if (!texto) return false;

  return (
    texto.includes('desktop') ||
    texto.includes('descktop') ||
    texto.includes('notebook') ||
    texto.includes('servidor')
  );
}

function normalizeInventoryKey(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '_');
}

function getInventoryDir() {
  return path.join(process.cwd(), 'data', 'host-inventory');
}

function getInventoryFileName(hostname: string) {
  return `${normalizeInventoryKey(hostname)}.json`;
}

async function readStoredInventory(hostname: string) {
  try {
    const filePath = path.join(getInventoryDir(), getInventoryFileName(hostname));
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readStoredInventoryForPatrimonio(idPat: string) {
  const raw = String(idPat || '').trim();
  const semPrefixo = raw.replace(/^pat[\s_-]*/i, '').trim();
  const candidatos = [
    raw,
    semPrefixo,
    semPrefixo ? `PAT${semPrefixo}` : '',
  ].filter(Boolean);

  for (const candidato of candidatos) {
    const inventory = await readStoredInventory(candidato);
    if (inventory) return inventory;
  }

  return null;
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

type NetworkDevice = {
  id: string;
  name: string;
  type: string;
  mac: string;
  ip: string;
  shortname: string;
  status: string;
  siteId: string;
  siteName: string;
  model: string;
  serial: string;
  note: string;
};

type NetworkClient = {
  id: string;
  name: string;
  hostname: string;
  mac: string;
  ip: string;
  status: string;
  siteId: string;
  siteName: string;
};

type FoundPatrimonio = {
  idP: string;
  idPat: string;
  descricaoPat: string;
  licencaPat: string | null;
  statusPat: string | null;
  centroCusto: string | null;
  agenteInstalado: boolean;
  agenteColetadoEm: string | null;
  statusRede: 'ONLINE' | 'OFFLINE';
  encontrouNaRede: boolean;
  matchBy: 'SERIAL' | 'HOSTNAME' | 'NOME' | 'DESCRICAO';
  matchValue: string;
  origemEncontrada: string | null;
  sourceType: 'DEVICE' | 'CLIENT' | null;
  deviceName: string | null;
  deviceHostname: string | null;
  deviceSerial: string | null;
  deviceIp: string | null;
  siteName: string | null;
};

async function fetchAllDeviceGroupsByApiKey(effectiveApiKey: string, pageSize = 100) {
  const groupsByHostId = new Map<string, { hostId: string; hostName: string; devices: Record<string, unknown>[] }>();
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

async function fetchConnectorPath(apiKey: string, consoleId: string, connectorPath: string) {
  const response = await fetch(`https://api.ui.com/v1/connector/consoles/${consoleId}/${connectorPath}`, {
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

function buildEntrySearchText(item: {
  name?: string;
  hostname?: string;
  shortname?: string;
  model?: string;
  note?: string;
  serial?: string;
  mac?: string;
  ip?: string;
  siteName?: string;
}) {
  return [
    item.name,
    item.hostname,
    item.shortname,
    item.model,
    item.note,
    item.serial,
    item.mac,
    item.ip,
    item.siteName,
  ]
    .map(normalizeText)
    .join(' ');
}

function scorePatrimonioMatch(
  patrimonio: {
    idPat: string;
    descricaoPat: string;
    licencaPat: string | null;
  },
  entry: {
    nameNorm: string;
    hostnameNorm: string;
    shortnameNorm: string;
    serialNorm: string;
    haystack: string;
  }
) {
  const idPatRaw = String(patrimonio.idPat || '').trim();
  const idPatBase = idPatRaw.replace(/^pat[\s_-]*/i, '').trim();
  const idPatNorm = normalizeText(idPatRaw);
  const idPatPatNorm = normalizeText(`PAT${idPatBase || idPatRaw}`);
  const idPatSearchKey = extractSearchKey(idPatRaw);
  const descricaoNorm = normalizeText(patrimonio.descricaoPat);
  const licencaNorm = normalizeSerialMatch(patrimonio.licencaPat);
  const descricaoSearchKey = extractSearchKey(patrimonio.descricaoPat);

  if (licencaNorm && entry.serialNorm && licencaNorm === entry.serialNorm) {
    return { score: 100, matchBy: 'SERIAL' as const, matchValue: patrimonio.licencaPat || '' };
  }

  if (
    idPatNorm &&
    (entry.nameNorm === idPatNorm ||
      entry.hostnameNorm === idPatNorm ||
      entry.shortnameNorm === idPatNorm ||
      entry.nameNorm === idPatPatNorm ||
      entry.hostnameNorm === idPatPatNorm ||
      entry.shortnameNorm === idPatPatNorm)
  ) {
    return { score: 90, matchBy: 'HOSTNAME' as const, matchValue: patrimonio.idPat };
  }

  if (licencaNorm && entry.haystack.includes(licencaNorm)) {
    return { score: 85, matchBy: 'SERIAL' as const, matchValue: patrimonio.licencaPat || '' };
  }

  if (idPatNorm && (entry.haystack.includes(idPatNorm) || entry.haystack.includes(idPatPatNorm))) {
    return { score: 75, matchBy: 'NOME' as const, matchValue: patrimonio.idPat };
  }

  if (idPatSearchKey && entry.haystack.includes(idPatSearchKey)) {
    return { score: 65, matchBy: 'NOME' as const, matchValue: patrimonio.idPat };
  }

  if (descricaoSearchKey && entry.haystack.includes(descricaoSearchKey)) {
    return { score: 55, matchBy: 'DESCRICAO' as const, matchValue: patrimonio.descricaoPat };
  }

  if (descricaoNorm && descricaoNorm.length >= 4 && entry.haystack.includes(descricaoNorm)) {
    return { score: 45, matchBy: 'DESCRICAO' as const, matchValue: patrimonio.descricaoPat };
  }

  return null;
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'VARREDURA_PATRIMONIOS');
  if (!canAccess) {
    return NextResponse.json({ error: 'Sem permissão para acessar a varredura do agente' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const modoConsulta = String(searchParams.get('modo') || 'REDE').toUpperCase() as ConsultaModo;
    if (modoConsulta === 'INTERNET') {
      return NextResponse.json({ error: 'A varredura em toda a rede exige acesso à rede/VPN.' }, { status: 400 });
    }

    const savedConfig = await getUnifiConfig();
    const effectiveApiKey = savedConfig?.apiKey || process.env.UNIFI_API_KEY;
    if (!effectiveApiKey) {
      return NextResponse.json({ error: 'API Key não encontrada' }, { status: 400 });
    }

    const groups = await fetchAllDeviceGroupsByApiKey(effectiveApiKey, 100);

    const networkDevices: NetworkDevice[] = groups.flatMap((group) =>
      (Array.isArray(group.devices) ? group.devices : []).map((device: Record<string, unknown>, idx: number) => ({
        id: String(device.id || device.deviceId || device.mac || `${group.hostId}-${idx}`),
        name: String(device.name || device.displayName || 'Device sem nome'),
        type: String(device.type || device.deviceType || device.model || 'Unknown'),
        mac: String(device.mac || device.macAddress || ''),
        ip: String(device.ip || device.ipAddress || device.host || ''),
        shortname: String(device.shortname || device.shortName || ''),
        status: inferMonitorStatus(device),
        siteId: String(group.hostId || ''),
        siteName: String(group.hostName || 'Site sem nome'),
        model: String(device.model || device.deviceModel || ''),
        serial: String(device.serial || device.serialNumber || device.sn || ''),
        note: String(device.note || ''),
      }))
    );

    const networkClients: NetworkClient[] = [];
    for (const group of groups) {
      const siteId = String(group.hostId || '');
      if (!siteId) continue;

      const candidatePaths = ['network/default/client', 'network/default/clients'];
      let clientsRaw: any[] | null = null;
      for (const connectorPath of candidatePaths) {
        try {
          const list = await fetchConnectorPath(effectiveApiKey, siteId, connectorPath);
          if (list) {
            clientsRaw = list;
            break;
          }
        } catch {
          // ignora tentativa individual
        }
      }

      if (!clientsRaw) continue;

      clientsRaw.forEach((client: Record<string, unknown>, idx: number) => {
        networkClients.push({
          id: String(client.id || client.clientId || client._id || client.mac || `${siteId}-${idx}`),
          name: String(client.name || client.hostname || client.displayName || 'Cliente sem nome'),
          hostname: String(client.hostname || client.displayName || client.name || ''),
          mac: String(client.mac || client.macAddress || ''),
          ip: String(client.ip || client.ipAddress || ''),
          status: inferMonitorStatus(client),
          siteId,
          siteName: String(group.hostName || 'Site sem nome'),
        });
      });
    }

    const patrimoniosBase = await listarPatrimonios({ take: 5000 });
    const patrimonios = patrimoniosBase.filter((patrimonio) =>
      isTipoPatrimonioPermitido(patrimonio.tbTipoPat?.descricaoTipPat || null)
    );
    const entries = [
      ...networkDevices.map((device) => ({
        sourceType: 'DEVICE' as const,
        nameNorm: normalizeText(device.name),
        hostnameNorm: normalizeText(device.name),
        shortnameNorm: normalizeText(device.shortname),
        serialNorm: normalizeSerialMatch(device.serial),
        haystack: buildEntrySearchText(device),
        name: device.name,
        hostname: device.name,
        serial: device.serial,
        ip: device.ip,
        siteName: device.siteName,
      })),
      ...networkClients.map((client) => ({
        sourceType: 'CLIENT' as const,
        nameNorm: normalizeText(client.name),
        hostnameNorm: normalizeText(client.hostname),
        shortnameNorm: normalizeText(client.name),
        serialNorm: normalizeSerialMatch(client.mac),
        haystack: buildEntrySearchText(client),
        name: client.name,
        hostname: client.hostname,
        serial: client.mac,
        ip: client.ip,
        siteName: client.siteName,
      })),
    ];

    const encontradosPorId = new Map<string, { item: FoundPatrimonio; score: number }>();

    for (const patrimonio of patrimonios) {
      let bestMatch:
        | {
            score: number;
            matchBy: FoundPatrimonio['matchBy'];
            matchValue: string;
            entry: (typeof entries)[number];
          }
        | null = null;

      for (const entry of entries) {
        const match = scorePatrimonioMatch(patrimonio, entry);
        if (!match) continue;
        if (!bestMatch || match.score > bestMatch.score) {
          bestMatch = {
            ...match,
            entry,
          };
        }
      }

      const statusPat = patrimonio.tbStatusPat?.descricaoStatPat || null;
      const centroCusto = patrimonio.tbCCusto?.descricaoCCusto || null;
      const inventarioAgente = await readStoredInventoryForPatrimonio(patrimonio.idPat);
      const encontrouNaRede = Boolean(bestMatch);
      const origemEncontrada = bestMatch
        ? `${bestMatch.entry.sourceType === 'DEVICE' ? 'Dispositivo' : 'Cliente'} UniFi${bestMatch.entry.siteName ? ` · ${bestMatch.entry.siteName}` : ''}`
        : null;
      const payloadItem: FoundPatrimonio = {
        idP: patrimonio.idP,
        idPat: patrimonio.idPat,
        descricaoPat: patrimonio.descricaoPat,
        licencaPat: patrimonio.licencaPat || null,
        statusPat,
        centroCusto,
        agenteInstalado: Boolean(inventarioAgente),
        agenteColetadoEm: inventarioAgente?.collectedAt ? String(inventarioAgente.collectedAt) : null,
        statusRede: encontrouNaRede ? 'ONLINE' : 'OFFLINE',
        encontrouNaRede,
        matchBy: bestMatch?.matchBy || 'DESCRICAO',
        matchValue: bestMatch?.matchValue || '',
        origemEncontrada,
        sourceType: bestMatch?.entry.sourceType || null,
        deviceName: bestMatch?.entry.name || null,
        deviceHostname: bestMatch?.entry.hostname || null,
        deviceSerial: bestMatch?.entry.serial || null,
        deviceIp: bestMatch?.entry.ip || null,
        siteName: bestMatch?.entry.siteName || null,
      };

      const existente = encontradosPorId.get(patrimonio.idP);
      const score = bestMatch?.score || 0;
      if (!existente || score > existente.score) {
        encontradosPorId.set(patrimonio.idP, { item: payloadItem, score });
      }
    }

    const patrimoniosEncontrados = Array.from(encontradosPorId.values())
      .map((item) => item.item)
      .sort((a, b) => a.idPat.localeCompare(b.idPat));
    const totalOnline = patrimoniosEncontrados.filter((item) => item.statusRede === 'ONLINE').length;
    const totalOffline = patrimoniosEncontrados.filter((item) => item.statusRede === 'OFFLINE').length;

    return NextResponse.json({
      modoConsulta,
      resumo: {
        totalPatrimoniosBase: patrimoniosBase.length,
        totalPatrimoniosPermitidos: patrimonios.length,
        totalEncontrados: totalOnline,
        totalOnline,
        totalOffline,
        totalComAgente: patrimoniosEncontrados.filter((item) => item.agenteInstalado).length,
        totalSemAgente: patrimoniosEncontrados.filter((item) => !item.agenteInstalado).length,
        totalDevices: networkDevices.length,
        totalClients: networkClients.length,
      },
      patrimonios: patrimoniosEncontrados,
    });
  } catch (error) {
    console.error('Erro ao executar varredura do agente de inventário:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao executar varredura do agente de inventário' },
      { status: 500 }
    );
  }
}
