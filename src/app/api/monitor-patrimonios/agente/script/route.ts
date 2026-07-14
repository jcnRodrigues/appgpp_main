import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasModuleAccessForRequest } from '@/lib/access';
import { resolveAppBaseUrl } from '@/lib/app-url';
import { getUnifiConfig } from '@/features/unifi-config/server/unifi.service';
import { applyHostInventoryAgentOverrides, loadHostInventoryAgentScript } from '@/lib/monitor-patrimonios-agent-script';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readInstallerFile(preferredPath: string, fallbackPath: string) {
  try {
    const content = await fs.readFile(preferredPath);
    return { content, filename: path.basename(preferredPath) };
  } catch {
    const content = await fs.readFile(fallbackPath, 'utf8');
    return { content: Buffer.from(content, 'utf8'), filename: path.basename(fallbackPath) };
  }
}

export async function GET(request: NextRequest) {
  const canAccess = await hasModuleAccessForRequest(request, 'AGENTE_INVENTARIO');
  if (!canAccess) {
    return NextResponse.json({ error: 'Sem permissao para acessar o script do agente' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const serverUrl = searchParams.get('serverUrl')?.trim();
  const token = searchParams.get('token')?.trim() || process.env.HOST_INVENTORY_AGENT_TOKEN || '';
  const serviceMode = searchParams.get('serviceMode') === 'true';
  const installerScript = searchParams.get('installerScript') === 'true';
  const installerExe = searchParams.get('installerExe') === 'true';

  if (installerScript) {
    const scriptPath = path.join(process.cwd(), 'scripts', 'HostInventoryAgent-Installer.ps1');
    const original = await fs.readFile(scriptPath, 'utf8');

    return new NextResponse(original, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="HostInventoryAgent-Installer.ps1"',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (installerExe) {
    const exePath = path.join(process.cwd(), 'dist', 'HostInventoryAgent-Installer.exe');
    const ps1Path = path.join(process.cwd(), 'scripts', 'HostInventoryAgent-Installer.ps1');
    const { content, filename } = await readInstallerFile(exePath, ps1Path);
    const isExe = filename.toLowerCase().endsWith('.exe');

    return new NextResponse(content, {
      headers: {
        'Content-Type': isExe ? 'application/octet-stream' : 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  const original = await loadHostInventoryAgentScript();
  const savedConfig = await getUnifiConfig();
  const appBaseUrl = resolveAppBaseUrl({
    explicitUrl: serverUrl,
    savedUrl: savedConfig?.publicUrl,
    requestOrigin: request.nextUrl.origin,
  });
  const content = applyHostInventoryAgentOverrides(original, { serverUrl: appBaseUrl, token, serviceMode });

  if (serviceMode) {
    const origin = appBaseUrl;
    const launcher = `@echo off
setlocal
set "APPGPP_BASE_URL=${origin}"
set "APPGPP_TEMP=%TEMP%\\HostInventoryAgent-Installer.ps1"
set "APPGPP_EXE=%TEMP%\\HostInventoryAgent-Installer.exe"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $baseUrl=$env:APPGPP_BASE_URL; $exeUrl=$baseUrl + '/api/monitor-patrimonios/agente/script?installerExe=true'; $fallbackUrl=$baseUrl + '/api/monitor-patrimonios/agente/script?installerScript=true'; $outFile=$env:APPGPP_EXE; try { Invoke-WebRequest -Uri $exeUrl -OutFile $outFile -UseBasicParsing } catch { $outFile=$env:APPGPP_TEMP; Invoke-WebRequest -Uri $fallbackUrl -OutFile $outFile -UseBasicParsing }; if ($outFile.ToLower().EndsWith('.exe')) { Start-Process -FilePath $outFile -Wait } else { Start-Process -FilePath powershell.exe -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',$outFile) -Wait }"
endlocal
`;

    return new NextResponse(launcher, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="HostInventoryAgent-Launcher.cmd"',
        'Cache-Control': 'no-store',
      },
    });
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="HostInventoryAgent.ps1"',
      'Cache-Control': 'no-store',
    },
  });
}
