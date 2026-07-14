export type MonitorStatus = 'Online' | 'Offline';

function normalizeText(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function collectStatusHints(value: unknown): string[] {
  const hints: string[] = [];
  const visit = (input: unknown) => {
    if (!input) return;
    if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
      hints.push(normalizeText(input));
      return;
    }
    if (Array.isArray(input)) {
      input.forEach(visit);
      return;
    }
    if (typeof input === 'object') {
      const record = input as Record<string, unknown>;
      [
        'status',
        'state',
        'reportedState',
        'connectionState',
        'clientState',
        'controllerStatus',
        'connectedState',
        'lastConnectionState',
        'lastConnectionStateChange',
        'serviceState',
        'serviceStatus',
        'health',
      ].forEach((key) => {
        if (record[key] !== undefined) visit(record[key]);
      });
    }
  };

  visit(value);
  return hints.filter(Boolean);
}

function isTruthyOnline(value: unknown) {
  if (value === true) return true;
  if (value === 1 || value === '1') return true;
  return false;
}

function isTruthyOffline(value: unknown) {
  if (value === false) return true;
  if (value === 0 || value === '0') return true;
  return false;
}

export function inferMonitorStatus(item: Record<string, unknown>): MonitorStatus {
  const rawStatus = normalizeText(item.status || item.reportedState);
  const reportedHints = collectStatusHints(item.reportedState);
  if (rawStatus) {
    if (['online', 'connected', 'connected client', 'active', 'up', 'reachable', 'available', 'present', 'ready', 'ok', 'running'].some((word) => rawStatus.includes(word))) {
      return 'Online';
    }
    if (['offline', 'disconnected', 'inactive', 'down', 'unreachable', 'sleep', 'isolated', 'missing', 'absent', 'error', 'failed'].some((word) => rawStatus.includes(word))) {
      return 'Offline';
    }
  }

  if (reportedHints.some((hint) => ['online', 'connected', 'active', 'up', 'reachable', 'available', 'present', 'ready', 'ok', 'running'].some((word) => hint.includes(word)))) {
    return 'Online';
  }
  if (reportedHints.some((hint) => ['offline', 'disconnected', 'inactive', 'down', 'unreachable', 'sleep', 'isolated', 'missing', 'absent', 'error', 'failed'].some((word) => hint.includes(word)))) {
    return 'Offline';
  }

  const onlineFields = [
    item.online,
    item.isOnline,
    item.connected,
    item.isConnected,
    item.active,
    item.isActive,
    item.reachable,
  ];
  if (onlineFields.some(isTruthyOnline)) return 'Online';

  const offlineFields = [
    item.offline,
    item.isOffline,
    item.disconnected,
    item.isDisconnected,
    item.inactive,
    item.isInactive,
    item.reportedState ? normalizeText(item.reportedState).includes('offline') : false,
  ];
  if (offlineFields.some(isTruthyOffline)) return 'Offline';

  const state = Number(item.state);
  const connectionState = Number(item.connectionState);
  const clientState = Number(item.clientState);
  const reportedState = normalizeText(item.reportedState);
  if ([state, connectionState, clientState].some((value) => value === 1) || ['online', 'connected', 'active', 'up', 'ready', 'ok', 'running'].some((word) => reportedState.includes(word))) return 'Online';
  if ([state, connectionState, clientState].some((value) => value === 0)) return 'Offline';

  return 'Offline';
}
