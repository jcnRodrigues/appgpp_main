param(
  [string]$ShortcutName = "AppGPP"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Join-Path $projectRoot "Abrir-AppGPP.cmd"
$desktop = [Environment]::GetFolderPath("Desktop")
$linkPath = Join-Path $desktop ("{0}.lnk" -f $ShortcutName)

if (-not (Test-Path $target)) {
  Write-Error "Arquivo nao encontrado: $target"
  exit 1
}

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($linkPath)
$shortcut.TargetPath = $target
$shortcut.WorkingDirectory = $projectRoot
$shortcut.IconLocation = "$env:SystemRoot\System32\SHELL32.dll,220"
$shortcut.Save()

Write-Host "Atalho criado em: $linkPath"
