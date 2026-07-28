param()

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$installerExe = Join-Path $scriptDir 'HostInventoryAgent-Installer.exe'
$launcherPath = Join-Path $scriptDir 'HostInventoryAgent-Launcher.cmd'
$iconPath = Join-Path $scriptDir 'AppGPP.ico'

if (Test-Path $installerExe) {
  $targetPath = $installerExe
} elseif (Test-Path $launcherPath) {
  $targetPath = $launcherPath
} else {
  throw "Lançador não encontrado: $launcherPath"
}

$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'AppGPP - Agente de Inventario.lnk'

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $scriptDir
$shortcut.WindowStyle = 1
$shortcut.Description = 'Abre o instalador do Agente de Inventario do AppGPP'
if (Test-Path $iconPath) {
  $shortcut.IconLocation = $iconPath
} elseif ($targetPath.EndsWith('.exe', [System.StringComparison]::OrdinalIgnoreCase)) {
  $shortcut.IconLocation = $targetPath
}
$shortcut.Save()

Write-Host "Atalho criado em: $shortcutPath"
