param(
  [string]$ShortcutName = "AppGPP - Console",
  [switch]$Dev
)

$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptsDir
$target = Join-Path $projectRoot "scripts\Abrir-AppGPP-Console.cmd"
$iconPath = Join-Path $projectRoot "public\Imagens\AppGPP.ico"
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
$shortcut.Arguments = if ($Dev) { "dev" } else { "" }
if (Test-Path -LiteralPath $iconPath) {
  $shortcut.IconLocation = $iconPath
} else {
  $shortcut.IconLocation = "$env:SystemRoot\System32\SHELL32.dll,220"
}
$shortcut.Save()

Write-Host "Atalho criado em: $linkPath"
