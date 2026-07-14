import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasModuleAccessForRequest } from '@/lib/access';
import { getUnifiConfig } from '@/features/unifi-config/server/unifi.service';
import { listarPatrimonios } from '@/features/patrimonio/server/patrimonio.service';
import { inferMonitorStatus } from '@/lib/monitor-status';
import {
  extractRadiusLocalInfo,
  fetchConnectedClientDetailsBySite,
  fetchRadiusProfilesBySite,
  resolveRadiusProfileForClient,
} from '@/lib/monitor-unifi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ConsultaModo = 'HIBRIDO' | 'REDE' | 'INTERNET';
type AgentExecutionStatus = 'ATIVO' | 'DESATUALIZADO' | 'SEM_RETORNO';

function normalizeText(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function extractHostSearchKey(hostname: string) {
  const raw = String(hostname || '').trim();
  if (!raw) return '';

  const digitsOnly = raw.replace(/\D+/g, '');
  if (digitsOnly) {
    return digitsOnly;
  }

  const match = raw.match(/(\d{3,})/);
  return match?.[1] || raw;
}

function sanitizeDisplayText(value: unknown) {
  const texto = String(value || '').trim();
  if (!texto) return '';

  return texto
    .replace(/Padr\uFFFDo/g, 'Padrão')
    .replace(/compat\uFFFDvel/g, 'compatível')
    .replace(/padr\uFFFDes/g, 'padrões')
    .replace(/Usu\uFFFDrio/g, 'Usuário')
    .replace(/Dom\uFFFDnio/g, 'Domínio')
    .replace(/Vers\uFFFDo/g, 'Versão')
    .replace(/Conex\uFFFDo/g, 'Conexão')
    .replace(/Informa\uFFFD\uFFFDes/g, 'Informações')
    .replace(/Invent\uFFFDrio/g, 'Inventário')
    .replace(/A\uFFFD\uFFFDo/g, 'Ação')
    .replace(/\uFFFD/g, '');
}

function getAgentExecutionStatus(inventarioSistema: any): {
  codigo: AgentExecutionStatus;
  titulo: string;
  detalhe: string;
  collectedAt: string | null;
} {
  if (!inventarioSistema) {
    return {
      codigo: 'SEM_RETORNO',
      titulo: 'Agente sem retorno',
      detalhe: 'Este hostname ainda não enviou inventário. Verifique se o agente está instalado e em execução.',
      collectedAt: null,
    };
  }

  const collectedAt = inventarioSistema.collectedAt ? new Date(String(inventarioSistema.collectedAt)) : null;
  const collectedTime = collectedAt && !Number.isNaN(collectedAt.getTime()) ? collectedAt.getTime() : null;
  if (!collectedTime) {
    return {
      codigo: 'DESATUALIZADO',
      titulo: 'Inventário sem data válida',
      detalhe: 'O host respondeu, mas a data da última coleta não pôde ser validada.',
      collectedAt: String(inventarioSistema.collectedAt || ''),
    };
  }

  const ageMs = Date.now() - collectedTime;
  const fourHoursMs = 4 * 60 * 60 * 1000;

  if (ageMs <= fourHoursMs) {
    return {
      codigo: 'ATIVO',
      titulo: 'Agente ativo',
      detalhe: 'O inventário foi recebido recentemente e o agente está respondendo normalmente.',
      collectedAt: String(inventarioSistema.collectedAt || ''),
    };
  }

  return {
    codigo: 'DESATUALIZADO',
    titulo: 'Agente sem atualização recente',
    detalhe: 'Há inventário armazenado, mas a última coleta está fora da janela esperada.',
    collectedAt: String(inventarioSistema.collectedAt || ''),
  };
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

type UiDeviceGroup = {
  hostId: string;
  hostName: string;
  devices: Record<string, unknown>[];
  updatedAt?: string;
};

async function fetchAllDeviceGroupsByApiKey(effectiveApiKey: string, pageSize = 100): Promise<UiDeviceGroup[]> {
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

function pickBestMatch(items: any[], searchTerm: string) {
  const termo = normalizeText(searchTerm);
  if (!termo) return null;

  return (
    items.find((item) => {
      const haystack = [
        item.name,
        item.hostname,
        item.displayName,
        item.shortname,
        item.note,
        item.siteName,
        item.type,
        item.model,
        item.mac,
        item.ip,
        item.hostName,
      ]
        .map(normalizeText)
        .join(' ');

      return haystack.includes(termo);
    }) || null
  );
}

function classifyPeripheral(item: {
  nome?: string | null;
  modelo?: string | null;
  tipo?: string | null;
  hostname?: string | null;
  observacao?: string | null;
}) {
  const haystack = [
    item.nome,
    item.modelo,
    item.tipo,
    item.hostname,
    item.observacao,
  ]
    .map(normalizeText)
    .join(' ');

  if (/monitor|display|screen|lcd|led/.test(haystack)) return 'MONITOR';
  if (/teclado|keyboard|kbd/.test(haystack)) return 'TECLADO';
  if (/mouse|rato/.test(haystack)) return 'MOUSE';
  return null;
}

function extract8021xIdentity(candidates: Array<string | null | undefined>) {
  const raw = candidates.map((item) => String(item || '').trim()).find(Boolean) || '';
  if (!raw) {
    return null;
  }

  const rawLower = raw.toLowerCase();
  const matchUser = raw.match(/(?:usuario|user|login|identificador)\s*[:=]\s*([^\n;|]+)/i);
  const fromLabel = matchUser?.[1]?.trim() || raw;
  const slashParts = fromLabel.includes('\\') ? fromLabel.split('\\') : [fromLabel];
  const atParts = fromLabel.includes('@') ? fromLabel.split('@') : [fromLabel];
  const usuario = (slashParts[1] || atParts[0] || fromLabel).trim();
  const nome = (slashParts[0] || fromLabel).trim();

  return {
    raw,
    nome,
    usuario,
    origem: rawLower.includes('user') || rawLower.includes('usuario') ? 'campo identificado' : 'heuristica',
  };
}

function getInventoryDir() {
  return path.join(process.cwd(), 'data', 'host-inventory');
}

function getInventoryFileName(hostname: string) {
  const safeName = String(hostname || '')
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '_');
  return `${safeName || 'host'}.json`;
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

function extractSerialSearchKey(serial: string) {
  const raw = String(serial || '').trim();
  if (!raw) return '';

  return raw.replace(/[^A-Za-z0-9]+/g, '');
}

function normalizeSerialMatch(value: unknown) {
  return String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '')
    .toUpperCase();
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'AGENTE_INVENTARIO');
  if (!canAccess) {
    return NextResponse.json({ error: 'Sem permissão para acessar o agente' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const hostname = searchParams.get('hostname') || '';
    const serial = searchParams.get('serial') || '';
    const modoConsulta = String(searchParams.get('modo') || 'HIBRIDO').toUpperCase() as ConsultaModo;
    if (!hostname.trim()) {
      return NextResponse.json({ error: 'Informe um hostname para consultar' }, { status: 400 });
    }

    const savedConfig = await getUnifiConfig();
    const effectiveApiKey = savedConfig?.apiKey || process.env.UNIFI_API_KEY;
    const identitySource = String(savedConfig?.identitySource || 'UNIFI').toUpperCase();
    const identitySourceNotes = String(savedConfig?.identitySourceNotes || '').trim();
    const allowsNetworkLookup = modoConsulta !== 'INTERNET';

    let groups: UiDeviceGroup[] = [];
    let networkDevices: Array<{
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
    }> = [];
    const networkClients: Array<{
      id: string;
      name: string;
      hostname?: string;
      mac: string;
      ip?: string;
      status: string;
      siteId: string;
      siteName: string;
      identity?: string | null;
      clientIdentity?: string | null;
      identity8021x?: string | null;
      dot1xIdentity?: string | null;
    }> = [];

    if (allowsNetworkLookup) {
      if (!effectiveApiKey) {
        return NextResponse.json({ error: 'API Key não encontrada' }, { status: 400 });
      }

      groups = await fetchAllDeviceGroupsByApiKey(effectiveApiKey, 100);
      networkDevices = groups.flatMap((group) =>
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
            identity: String(
              client.identity ||
                client.identity8021x ||
                client.dot1xIdentity ||
                client.clientIdentity ||
                client.username ||
                client.userName ||
                ''
            ).trim() || null,
            clientIdentity: String(client.clientIdentity || '').trim() || null,
            identity8021x: String(client.identity8021x || '').trim() || null,
            dot1xIdentity: String(client.dot1xIdentity || '').trim() || null,
          });
        });
      }
    }

    const hostnameNorm = normalizeText(hostname);
    const deviceMatch = allowsNetworkLookup ? (pickBestMatch(networkDevices, hostnameNorm) as any | null) : null;
    const clientMatch = allowsNetworkLookup ? (pickBestMatch(networkClients, hostnameNorm) as any | null) : null;
    const conectado = Boolean(
      allowsNetworkLookup &&
      (normalizeText(deviceMatch?.status) === 'online' ||
        normalizeText(clientMatch?.status) === 'online')
    );
    const siteName = String(deviceMatch?.siteName || clientMatch?.siteName || hostname).trim();
    const hostName = String(
      deviceMatch?.name ||
      clientMatch?.hostname ||
      clientMatch?.name ||
      deviceMatch?.shortname ||
      siteName ||
      hostname
    ).trim();

    const userCandidates = networkClients.filter((client) => {
      const haystack = [client.name, client.hostname, client.mac, client.ip, client.siteName]
        .map(normalizeText)
        .join(' ');
      return haystack.includes(hostnameNorm) || (deviceMatch?.siteId && client.siteId === String(deviceMatch.siteId));
    });

    const connectedClientCandidate =
      userCandidates.find((client) => normalizeText(client.status) === 'online') ||
      (normalizeText(clientMatch?.status) === 'online' ? clientMatch : null) ||
      userCandidates[0] ||
      clientMatch ||
      null;

    const connectedSiteId = String(
      connectedClientCandidate?.siteId ||
      deviceMatch?.siteId ||
      clientMatch?.siteId ||
      ''
    ).trim();

    const hasRadiusLookup = Boolean(allowsNetworkLookup && effectiveApiKey && connectedSiteId);
    const radiusProfiles = hasRadiusLookup
      ? await fetchRadiusProfilesBySite(effectiveApiKey, connectedSiteId, connectedSiteId, { limit: 200, maxPages: 1 }).catch(() => null)
      : null;

    let connectedClientDetail: Record<string, unknown> | null = null;
    if (hasRadiusLookup && connectedClientCandidate?.id) {
      connectedClientDetail = await fetchConnectedClientDetailsBySite(
        effectiveApiKey,
        connectedSiteId,
        connectedSiteId,
        String(connectedClientCandidate.id)
      ).catch(() => null);
    }

    const radiusClientSource = connectedClientDetail || connectedClientCandidate;
    const radiusInfo = radiusClientSource ? extractRadiusLocalInfo(radiusClientSource) : null;
    const radiusProfile = radiusClientSource ? resolveRadiusProfileForClient(radiusClientSource, radiusProfiles) : null;
    const usuarioRadiusNome = String(
      radiusProfile?.name ||
      radiusInfo?.username ||
      connectedClientCandidate?.name ||
      connectedClientCandidate?.hostname ||
      ''
    ).trim();

    const userEstimado =
      usuarioRadiusNome
        ? {
            name: usuarioRadiusNome,
            hostname: String(connectedClientCandidate?.hostname || connectedClientCandidate?.name || '').trim(),
            siteName: String(connectedClientCandidate?.siteName || siteName || '').trim(),
          }
        : connectedClientCandidate;
    const userDerivado = String(
      userEstimado?.name ||
      userEstimado?.hostname ||
      String(deviceMatch?.note || '').match(/(?:usuario|user)\s*[:=]\s*([^\n;|]+)/i)?.[1] ||
      ''
    ).trim();

    const identificador8021xDireto = String(
      connectedClientDetail?.identity ||
        connectedClientDetail?.clientIdentity ||
        connectedClientDetail?.identity8021x ||
        connectedClientDetail?.dot1xIdentity ||
        connectedClientCandidate?.identity ||
        connectedClientCandidate?.clientIdentity ||
        connectedClientCandidate?.identity8021x ||
        connectedClientCandidate?.dot1xIdentity ||
        ''
    ).trim();

    const identificador8021x = identificador8021xDireto
      ? {
          raw: identificador8021xDireto,
          nome: identificador8021xDireto,
          usuario: identificador8021xDireto,
          origem: 'identidade UniFi',
        }
      : extract8021xIdentity([
          userEstimado?.name,
          userEstimado?.hostname,
          clientMatch?.name,
          clientMatch?.hostname,
          deviceMatch?.note,
          deviceMatch?.name,
          hostName,
        ]);

    const identificador8021xAviso =
      identificador8021xDireto
        ? null
        : !allowsNetworkLookup
          ? 'A consulta está em modo Internet e não consegue ler a identidade 802.1X da UniFi.'
          : !connectedClientCandidate
            ? 'Não foi possível localizar um cliente conectado correspondente ao host informado.'
            : !connectedClientDetail
              ? 'O cliente foi encontrado, mas a UniFi não retornou o campo de identidade 802.1X.'
              : 'A UniFi respondeu sem um identificador 802.1X claro para este cliente.';

    const usuarioRadius =
      usuarioRadiusNome || identificador8021x?.usuario || identitySource === 'WINDOWS_NPS' || identitySource === 'FREERADIUS'
        ? {
            nome: sanitizeDisplayText(
              usuarioRadiusNome ||
                identificador8021x?.usuario ||
                userDerivado ||
                userEstimado?.name ||
                userEstimado?.hostname
            ),
            origem:
              radiusProfile?.origin ||
              radiusInfo?.authType ||
              (identitySource === 'WINDOWS_NPS'
                ? 'retorno Windows NPS'
                : identitySource === 'FREERADIUS'
                  ? 'retorno FreeRADIUS'
                  : 'cliente UniFi conectado'),
            fonte:
              sanitizeDisplayText(identitySourceNotes) ||
              sanitizeDisplayText(identificador8021x?.raw) ||
              sanitizeDisplayText(radiusInfo?.raw) ||
              null,
          }
        : null;

    const hostSearchKey = extractHostSearchKey(hostname);
    const serialSearchKey = extractSerialSearchKey(serial);
    const patrimoniosRelacionadosBase: any[] = await listarPatrimonios(
      serialSearchKey
        ? {
            licenca: serialSearchKey,
            take: 50,
          }
        : {
            idPat: hostSearchKey || undefined,
            descricao: hostSearchKey || undefined,
            take: 50,
        }
    );
    const patrimoniosRelacionados = serialSearchKey
      ? patrimoniosRelacionadosBase
          .filter((item) => normalizeSerialMatch(item.licencaPat) === normalizeSerialMatch(serialSearchKey))
          .slice(0, 1)
      : patrimoniosRelacionadosBase;
    const perifericosAtivos = patrimoniosRelacionados
      .map((ativo) => {
        const categoria = classifyPeripheral({
          nome: ativo.descricaoPat,
          modelo: ativo.licencaPat,
          tipo: ativo.tbTipoPat?.descricaoTipPat || undefined,
          hostname: ativo.idPat,
          observacao: ativo.descricaoDetalhadaPat,
        }) || (serialSearchKey ? 'MONITOR' : null);
        if (!categoria) return null;

        return {
          categoria,
          codigo: sanitizeDisplayText(ativo.idPat),
          nome: sanitizeDisplayText(ativo.descricaoPat),
          hostname: sanitizeDisplayText(ativo.idPat) || null,
          serial: sanitizeDisplayText(ativo.licencaPat) || null,
          modelo: sanitizeDisplayText(ativo.tbTipoPat?.descricaoTipPat) || null,
          fabricante: null,
          local: sanitizeDisplayText(ativo.tbCCusto?.descricaoCCusto) || null,
          status: sanitizeDisplayText(ativo.tbStatusPat?.descricaoStatPat) || null,
          origem: 'TB_PATRIMONIO',
        };
      })
      .filter(Boolean) as Array<{
      categoria: 'MONITOR' | 'TECLADO' | 'MOUSE';
      codigo: string;
      nome: string;
      hostname: string | null;
      serial: string | null;
      modelo: string | null;
      fabricante: string | null;
      local: string | null;
      status: string | null;
      origem: string;
    }>;

    const perifericosPorCategoria = {
      MONITOR: perifericosAtivos.filter((item) => item.categoria === 'MONITOR'),
      TECLADO: perifericosAtivos.filter((item) => item.categoria === 'TECLADO'),
      MOUSE: perifericosAtivos.filter((item) => item.categoria === 'MOUSE'),
    };

    const resumo = {
      totalConsoles: groups.length,
      totalDevices: networkDevices.length,
      totalClients: networkClients.length,
      totalPerifericos: perifericosAtivos.length,
    };

    const inventarioSistema = await readStoredInventory(hostname);
    const statusAgente = getAgentExecutionStatus(inventarioSistema);

    return NextResponse.json({
      consulta: {
        hostname: hostname.trim(),
        hostnameNormalizado: hostnameNorm,
        modo: modoConsulta,
      },
      modoConsulta,
      conectado,
      dispositivoPrincipal: deviceMatch
        ? {
            id: deviceMatch.id,
            hostname: sanitizeDisplayText(hostName) || null,
            siteName: sanitizeDisplayText(siteName) || '',
            ip: sanitizeDisplayText(deviceMatch.ip) || null,
            mac: sanitizeDisplayText(deviceMatch.mac) || null,
            serial: sanitizeDisplayText(deviceMatch.serial) || null,
            modelo: sanitizeDisplayText(deviceMatch.model) || null,
            status: sanitizeDisplayText(deviceMatch.status) || null,
            note: sanitizeDisplayText(deviceMatch.note) || null,
          }
        : null,
      identificador8021x,
      identificador8021xAviso,
      fonte8021xConfigurada: {
        origem: sanitizeDisplayText(identitySource),
        notas: sanitizeDisplayText(identitySourceNotes) || null,
      },
      usuarioEstimado: userDerivado
        ? {
            nome: sanitizeDisplayText(userDerivado),
            origem: usuarioRadius ? 'RADIUS do cliente conectado' : (userEstimado?.hostname ? 'cliente UniFi' : 'derivado da rede'),
          }
        : null,
      usuarioRadius,
      inventarioSistema,
      statusAgente,
      perifericos: perifericosPorCategoria,
      ativosRelacionados: perifericosAtivos,
      resumo,
    });
  } catch (error) {
    console.error('Erro ao consultar agente de inventário:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao consultar agente de inventário' },
      { status: 500 }
    );
  }
}
