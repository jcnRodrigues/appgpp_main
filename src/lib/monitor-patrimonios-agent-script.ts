import { promises as fs } from 'fs';
import path from 'path';

export function escapeSingleQuotes(value: string) {
  return value.replace(/'/g, "''");
}

export async function loadHostInventoryAgentScript() {
  const scriptPath = path.join(process.cwd(), 'scripts', 'HostInventoryAgent.ps1');
  return fs.readFile(scriptPath, 'utf8');
}

export function applyHostInventoryAgentOverrides(
  original: string,
  params: {
    serverUrl?: string | null;
    token?: string | null;
    serviceMode?: boolean;
  }
) {
  let content = original;
  const { serverUrl, token, serviceMode } = params;

  if (!serviceMode && serverUrl) {
    content = content.replace(
      /\[string\]\$ServerUrl = '([^']*)'/,
      `[string]$ServerUrl = '${escapeSingleQuotes(serverUrl)}'`
    );
  }

  if (!serviceMode && token) {
    content = content.replace(
      /\[string\]\$Token = '([^']*)'/,
      `[string]$Token = '${escapeSingleQuotes(token)}'`
    );
  }

  return content;
}
