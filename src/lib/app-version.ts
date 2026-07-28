import fs from 'node:fs/promises';
import path from 'node:path';

type UpdateHistoryRecord = {
  success?: boolean;
  updateVersion?: string;
  versionTag?: string;
  createdAt?: string;
};

export type InstalledAppVersion = {
  version: string;
  updatedAt?: string | null;
  source: 'update-history' | 'package-json' | 'unknown';
};

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    if (!raw.trim()) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getInstalledAppVersion(): Promise<InstalledAppVersion> {
  const appRoot = process.cwd();
  const historyPath = path.join(appRoot, 'update-history.json');
  const packagePath = path.join(appRoot, 'package.json');

  const history = await readJsonFile<UpdateHistoryRecord | UpdateHistoryRecord[]>(historyPath);
  const historyList = Array.isArray(history) ? history : history ? [history] : [];
  const lastSuccess = [...historyList].reverse().find((item) => item?.success !== false);

  if (lastSuccess) {
    return {
      version: lastSuccess.updateVersion || lastSuccess.versionTag || 'desconhecida',
      updatedAt: lastSuccess.createdAt || null,
      source: 'update-history'
    };
  }

  const pkg = await readJsonFile<{ version?: string }>(packagePath);
  if (pkg?.version) {
    return {
      version: pkg.version,
      updatedAt: null,
      source: 'package-json'
    };
  }

  return {
    version: 'desconhecida',
    updatedAt: null,
    source: 'unknown'
  };
}
