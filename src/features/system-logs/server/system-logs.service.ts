import fs from 'fs/promises';
import path from 'path';
import { execFileSync } from 'child_process';

export type SystemLogSource = {
  id: string;
  label: string;
  path?: string;
  type: 'file' | 'event';
  available: boolean;
  updatedAt: string | null;
  lines: string[];
  error?: string | null;
};

export type SystemEventLogEntry = {
  timestamp: string;
  level: string;
  source: string;
  eventId: number | null;
  message: string;
};

export type SystemLogsSnapshot = {
  generatedAt: string;
  sources: SystemLogSource[];
  eventLogs: SystemEventLogEntry[];
  totals: {
    filesAvailable: number;
    fileLines: number;
    eventEntries: number;
  };
};

type FileSourceConfig = {
  id: string;
  label: string;
  path: string;
  maxLines?: number;
};

const FILE_SOURCES: FileSourceConfig[] = [
  {
    id: 'server-stdout',
    label: 'Saída do servidor AppGPP',
    path: path.join(process.cwd(), 'dev.out.log'),
    maxLines: 200
  },
  {
    id: 'server-stderr',
    label: 'Erros do servidor AppGPP',
    path: path.join(process.cwd(), 'dev.err.log'),
    maxLines: 200
  },
  {
    id: 'agent-service',
    label: 'Serviço Host Inventory',
    path: path.join(process.env.ProgramData || 'C:\\ProgramData', 'AppGPP', 'HostInventory', 'service.log'),
    maxLines: 200
  },
  {
    id: 'agent-service-error',
    label: 'Erros do Serviço Host Inventory',
    path: path.join(process.env.ProgramData || 'C:\\ProgramData', 'AppGPP', 'HostInventory', 'service-error.log'),
    maxLines: 200
  },
  {
    id: 'installer-log',
    label: 'Log de instalação do AppGPP',
    path: path.join(process.env.ProgramData || 'C:\\ProgramData', 'AppGPP', 'appgpp-install.log'),
    maxLines: 200
  }
];

function normalizeLines(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}

function tailLines(lines: string[], limit: number) {
  if (lines.length <= limit) return lines;
  return lines.slice(lines.length - limit);
}

function extractTimestamp(line: string) {
  const patterns = [
    /^\[(\d{2}:\d{2}:\d{2})\]/,
    /^(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z)?)/
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

async function readFileSource(config: FileSourceConfig): Promise<SystemLogSource> {
  try {
    const stat = await fs.stat(config.path);
    const raw = await fs.readFile(config.path, 'utf8');
    const lines = tailLines(normalizeLines(raw), config.maxLines ?? 200);

    return {
      id: config.id,
      label: config.label,
      path: config.path,
      type: 'file',
      available: true,
      updatedAt: stat.mtime.toISOString(),
      lines
    };
  } catch (error: any) {
    return {
      id: config.id,
      label: config.label,
      path: config.path,
      type: 'file',
      available: false,
      updatedAt: null,
      lines: [],
      error: error?.code === 'ENOENT' ? 'Arquivo nao encontrado' : (error?.message || 'Nao foi possivel ler o arquivo')
    };
  }
}

function mapLevel(level: string | undefined) {
  const normalized = (level || '').toLowerCase();
  if (normalized.includes('error') || normalized.includes('critical')) return 'error';
  if (normalized.includes('warn')) return 'warn';
  return 'info';
}

function readWindowsEventLogs(logName: 'System' | 'Application', maxEvents = 20): SystemEventLogEntry[] {
  if (process.platform !== 'win32') {
    return [];
  }

  try {
    const script = [
      `$events = Get-WinEvent -LogName '${logName}' -MaxEvents ${maxEvents} | Select-Object TimeCreated, LevelDisplayName, ProviderName, Id, Message`,
      'if ($events) { $events | ConvertTo-Json -Depth 4 } else { "[]" }'
    ].join('; ');

    const stdout = execFileSync(
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
      { encoding: 'utf8', maxBuffer: 1024 * 1024 }
    ).trim();

    if (!stdout) return [];

    const parsed = JSON.parse(stdout);
    const items = Array.isArray(parsed) ? parsed : [parsed];

    return items
      .filter(Boolean)
      .map((item: any) => ({
        timestamp: item?.TimeCreated ? new Date(item.TimeCreated).toISOString() : new Date().toISOString(),
        level: mapLevel(item?.LevelDisplayName),
        source: `${logName}${item?.ProviderName ? ` / ${item.ProviderName}` : ''}`,
        eventId: typeof item?.Id === 'number' ? item.Id : null,
        message: String(item?.Message || '').trim()
      }));
  } catch {
    return [];
  }
}

export async function listarLogsSistema(): Promise<SystemLogsSnapshot> {
  const sources = await Promise.all(FILE_SOURCES.map((config) => readFileSource(config)));

  const eventLogs = [
    ...readWindowsEventLogs('System', 20),
    ...readWindowsEventLogs('Application', 20)
  ].sort((left, right) => right.timestamp.localeCompare(left.timestamp));

  const fileLines = sources.reduce((total, source) => total + source.lines.length, 0);

  return {
    generatedAt: new Date().toISOString(),
    sources,
    eventLogs,
    totals: {
      filesAvailable: sources.filter((source) => source.available).length,
      fileLines,
      eventEntries: eventLogs.length
    }
  };
}

export function formatSystemLogLine(line: string) {
  const timestamp = extractTimestamp(line);
  return {
    timestamp,
    message: line
  };
}
