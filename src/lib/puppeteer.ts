import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const WINDOWS_BROWSER_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

function fileExists(candidate: string): boolean {
  return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
}

function resolveWindowsBrowserPath(): string | undefined {
  for (const candidate of WINDOWS_BROWSER_CANDIDATES) {
    if (fileExists(candidate)) {
      return candidate;
    }
  }

  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    const chromeUserPaths = [
      path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    ];

    for (const candidate of chromeUserPaths) {
      if (fileExists(candidate)) {
        return candidate;
      }
    }
  }

  return undefined;
}

export function resolvePuppeteerExecutablePath(): string | undefined {
  const envExecutablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    process.env.GOOGLE_CHROME_BIN;

  if (envExecutablePath && fileExists(envExecutablePath)) {
    return envExecutablePath;
  }

  if (process.platform === 'win32') {
    const windowsPath = resolveWindowsBrowserPath();
    if (windowsPath) {
      return windowsPath;
    }
  }

  try {
    return puppeteer.executablePath();
  } catch {
    return undefined;
  }
}

