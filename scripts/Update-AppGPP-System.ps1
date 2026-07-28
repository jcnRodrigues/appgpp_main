param(
  [string]$SourceDir,
  [string]$InstallDir = "C:\\AppGPP"
)

$wrapperPath = $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($wrapperPath)) { $wrapperPath = $PSCommandPath }
if ([string]::IsNullOrWhiteSpace($wrapperPath)) { $wrapperPath = [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName }
$wrapperDir = if ([string]::IsNullOrWhiteSpace($wrapperPath)) { [System.AppDomain]::CurrentDomain.BaseDirectory } else { Split-Path -Parent $wrapperPath }
$scriptPath = Join-Path $wrapperDir "Update-AppGPP.ps1"
& $scriptPath -Mode System -SourceDir $SourceDir -InstallDir $InstallDir -AutoRun
