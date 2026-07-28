import fs from 'fs/promises';
import path from 'path';

export type AccessLogAction = 'SIGN_IN' | 'SIGN_OUT';

export type AccessLogEntry = {
  timestamp: string;
  action: AccessLogAction;
  provider: string;
  email: string | null;
  name: string | null;
  machine: string | null;
  ip: string | null;
  browser: string | null;
  origin: string | null;
  status: 'SUCCESS' | 'FAILED';
  details: string | null;
};

export type AccessLogStatusFilter = 'ALL' | AccessLogEntry['status'];

function getAccessLogPath() {
  const programData = process.env.ProgramData || 'C:\\ProgramData';
  return path.join(programData, 'AppGPP', 'logs', 'access.log');
}

function normalizeLines(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function tailLines(lines: string[], limit: number) {
  if (lines.length <= limit) return lines;
  return lines.slice(lines.length - limit);
}

export async function registrarLogAcesso(entry: Omit<AccessLogEntry, 'timestamp'> & { timestamp?: string }) {
  const payload: AccessLogEntry = {
    timestamp: entry.timestamp || new Date().toISOString(),
    action: entry.action,
    provider: entry.provider,
    email: entry.email ?? null,
    name: entry.name ?? null,
    machine: entry.machine ?? null,
    ip: entry.ip ?? null,
    browser: entry.browser ?? null,
    origin: entry.origin ?? null,
    status: entry.status,
    details: entry.details ?? null
  };

  const logPath = getAccessLogPath();
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.appendFile(logPath, `${JSON.stringify(payload)}\n`, 'utf8');
}

export async function listarLogsAcesso(limit = 120): Promise<AccessLogEntry[]> {
  const logPath = getAccessLogPath();

  try {
    const raw = await fs.readFile(logPath, 'utf8');
    const lines = tailLines(normalizeLines(raw), limit);

    return lines
      .map((line) => {
        try {
          return JSON.parse(line) as AccessLogEntry;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is AccessLogEntry => Boolean(entry))
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  } catch {
    return [];
  }
}

export function filtrarLogsAcesso(entries: AccessLogEntry[], status: AccessLogStatusFilter = 'ALL') {
  if (status === 'ALL') return entries;
  return entries.filter((entry) => entry.status === status);
}

function escapeCsvCell(value: string | null | undefined) {
  const text = String(value ?? '');
  if (/[",\n\r;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportarLogsAcessoCsv(entries: AccessLogEntry[]) {
  const headers = [
    'timestamp',
    'action',
    'status',
    'provider',
    'email',
    'name',
    'machine',
    'ip',
    'browser',
    'origin',
    'details'
  ];

  const rows = entries.map((entry) => [
    entry.timestamp,
    entry.action,
    entry.status,
    entry.provider,
    entry.email,
    entry.name,
    entry.machine,
    entry.ip,
    entry.browser,
    entry.origin,
    entry.details
  ].map(escapeCsvCell).join(';'));

  return [headers.join(';'), ...rows].join('\r\n');
}
