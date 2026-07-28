import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const APPGPP_SERVICE_NAME = "AppGPP-Service";

export type WindowsServiceState = {
  exists: boolean;
  name: string;
  displayName: string;
  state: string;
  startMode: string;
  processId: number | null;
  pathName: string;
  description: string;
  startName: string;
  exitCode: number | null;
  serviceType: string;
};

export type WindowsServiceActionResult = {
  message: string;
  service: WindowsServiceState | null;
  output: string;
};

export type WindowsServiceSnapshot = WindowsServiceActionResult & {
  serviceName: string;
  recentLogs: string[];
};

function buildPowerShellCommand(script: string) {
  return [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    script,
  ];
}

async function runPowerShell(script: string) {
  const { stdout, stderr } = await execFileAsync("powershell.exe", buildPowerShellCommand(script), {
    windowsHide: true,
    maxBuffer: 1024 * 1024,
  });

  return {
    stdout: String(stdout || "").trim(),
    stderr: String(stderr || "").trim(),
  };
}

function parseJsonObject(text: string) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function normalizeNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getProgramDataLogPath() {
  const base = process.env.ProgramData || "C:\\ProgramData";
  return path.join(base, "AppGPP", "service-host.log");
}

function mapService(raw: any): WindowsServiceState | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  return {
    exists: true,
    name: normalizeString(raw.Name || raw.name || APPGPP_SERVICE_NAME),
    displayName: normalizeString(raw.DisplayName || raw.displayName || APPGPP_SERVICE_NAME),
    state: normalizeString(raw.State || raw.state || "Unknown"),
    startMode: normalizeString(raw.StartMode || raw.startMode || ""),
    processId: normalizeNumber(raw.ProcessId ?? raw.ProcessID ?? raw.processId),
    pathName: normalizeString(raw.PathName || raw.pathName || ""),
    description: normalizeString(raw.Description || raw.description || ""),
    startName: normalizeString(raw.StartName || raw.startName || ""),
    exitCode: normalizeNumber(raw.ExitCode ?? raw.exitCode),
    serviceType: normalizeString(raw.ServiceType || raw.serviceType || ""),
  };
}

export async function getWindowsServiceStatus(serviceName = APPGPP_SERVICE_NAME) {
  const script = `
$service = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" | Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName,Description,StartName,ExitCode,ServiceType;
if ($null -eq $service) {
  'null'
} else {
  $service | ConvertTo-Json -Compress -Depth 4
}
`.trim();

  const { stdout, stderr } = await runPowerShell(script);
  const parsed = stdout === "null" ? null : parseJsonObject(stdout);

  return {
    service: mapService(parsed),
    output: [stdout, stderr].filter(Boolean).join("\n"),
  };
}

export async function getRecentServiceLogs(limit = 30) {
  try {
    const logPath = getProgramDataLogPath();
    const content = await fs.readFile(logPath, "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    return lines.slice(Math.max(0, lines.length - limit));
  } catch {
    return [];
  }
}

export async function startWindowsService(serviceName = APPGPP_SERVICE_NAME): Promise<WindowsServiceActionResult> {
  const script = `
$service = Get-Service -Name '${serviceName}' -ErrorAction SilentlyContinue;
if ($null -eq $service) { throw 'Servico nao encontrado.' }
if ($service.Status -eq 'Running') {
  $service = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" | Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName,Description,StartName,ExitCode,ServiceType;
  $service | ConvertTo-Json -Compress -Depth 4
  return
}
Start-Service -Name '${serviceName}' -ErrorAction Stop
Start-Sleep -Seconds 1
$service = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" | Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName,Description,StartName,ExitCode,ServiceType;
$service | ConvertTo-Json -Compress -Depth 4
`.trim();

  try {
    const { stdout, stderr } = await runPowerShell(script);
    const parsed = parseJsonObject(stdout);
    return {
      message: "Servico iniciado com sucesso.",
      service: mapService(parsed),
      output: [stdout, stderr].filter(Boolean).join("\n"),
    };
  } catch (error: any) {
    return {
      message: normalizeString(error?.message || "Falha ao iniciar o servico."),
      service: null,
      output: normalizeString(error?.stdout || error?.stderr || ""),
    };
  }
}

export async function stopWindowsService(serviceName = APPGPP_SERVICE_NAME): Promise<WindowsServiceActionResult> {
  const script = `
$service = Get-Service -Name '${serviceName}' -ErrorAction SilentlyContinue;
if ($null -eq $service) { throw 'Servico nao encontrado.' }
if ($service.Status -eq 'Stopped') {
  $service = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" | Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName,Description,StartName,ExitCode,ServiceType;
  $service | ConvertTo-Json -Compress -Depth 4
  return
}
Stop-Service -Name '${serviceName}' -Force -ErrorAction Stop
Start-Sleep -Seconds 1
$service = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" | Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName,Description,StartName,ExitCode,ServiceType;
$service | ConvertTo-Json -Compress -Depth 4
`.trim();

  try {
    const { stdout, stderr } = await runPowerShell(script);
    const parsed = parseJsonObject(stdout);
    return {
      message: "Servico parado com sucesso.",
      service: mapService(parsed),
      output: [stdout, stderr].filter(Boolean).join("\n"),
    };
  } catch (error: any) {
    return {
      message: normalizeString(error?.message || "Falha ao parar o servico."),
      service: null,
      output: normalizeString(error?.stdout || error?.stderr || ""),
    };
  }
}

export async function restartWindowsService(serviceName = APPGPP_SERVICE_NAME): Promise<WindowsServiceActionResult> {
  const script = `
$service = Get-Service -Name '${serviceName}' -ErrorAction SilentlyContinue;
if ($null -eq $service) { throw 'Servico nao encontrado.' }
Restart-Service -Name '${serviceName}' -Force -ErrorAction Stop
Start-Sleep -Seconds 1
$service = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" | Select-Object Name,DisplayName,State,StartMode,ProcessId,PathName,Description,StartName,ExitCode,ServiceType;
$service | ConvertTo-Json -Compress -Depth 4
`.trim();

  try {
    const { stdout, stderr } = await runPowerShell(script);
    const parsed = parseJsonObject(stdout);
    return {
      message: "Servico reiniciado com sucesso.",
      service: mapService(parsed),
      output: [stdout, stderr].filter(Boolean).join("\n"),
    };
  } catch (error: any) {
    return {
      message: normalizeString(error?.message || "Falha ao reiniciar o servico."),
      service: null,
      output: normalizeString(error?.stdout || error?.stderr || ""),
    };
  }
}
