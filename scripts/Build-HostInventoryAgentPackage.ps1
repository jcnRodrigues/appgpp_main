param()

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $root 'dist'
$packagePath = Join-Path $distDir 'HostInventoryAgent-Package.zip'
$readmePath = Join-Path $distDir 'HostInventoryAgent-README.txt'
$installerExePath = Join-Path $distDir 'HostInventoryAgent-Installer.exe'
$iconPath = Join-Path $root 'public\Imagens\AppGPP.ico'

New-Item -ItemType Directory -Path $distDir -Force | Out-Null
if (Test-Path $packagePath) {
  Remove-Item -LiteralPath $packagePath -Force
}

@"
AppGPP - Instalação do Agente de Inventario

Arquivos:
- AppGPP.ico
- HostInventoryAgent-Launcher.cmd
- HostInventoryAgent-Installer.exe
- HostInventoryAgent-Installer.ps1
- Create-HostInventoryAgentShortcut.ps1

Como usar:
1. Extraia todos os arquivos do ZIP para uma pasta local.
2. Execute o arquivo HostInventoryAgent-Launcher.cmd ou HostInventoryAgent-Installer.exe.
3. O instalador abrira uma janela para informar o host/IP e a porta do servidor.
4. Use "Testar conexao" e, depois, "Instalar".
5. Por padrao, o instalador baixa o agente pelo endpoint público.
6. Para testar o modo com token, defina `APPGPP_AGENT_DOWNLOAD_TOKEN` ou `HOST_INVENTORY_AGENT_DOWNLOAD_TOKEN` antes de executar o instalador.
7. O agente sera instalado como servico quando o NSSM existir, ou como tarefa agendada como fallback.
8. Se quiser um atalho na area de trabalho, execute Create-HostInventoryAgentShortcut.ps1.
"@ | Set-Content -LiteralPath $readmePath -Encoding UTF8

$items = @(
  $iconPath,
  (Join-Path $PSScriptRoot 'HostInventoryAgent-Launcher.cmd'),
  $installerExePath,
  (Join-Path $PSScriptRoot 'HostInventoryAgent-Installer.ps1'),
  (Join-Path $PSScriptRoot 'Create-HostInventoryAgentShortcut.ps1'),
  $readmePath
)

foreach ($item in $items) {
  if (-not (Test-Path $item)) {
    throw "Arquivo não encontrado: $item"
  }
}

Compress-Archive -Path $items -DestinationPath $packagePath -Force
Write-Host "Pacote gerado em: $packagePath"
