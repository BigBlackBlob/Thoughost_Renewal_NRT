param(
    [int]$Port = 3000,
    [string]$HostName = "127.0.0.1",
    [string]$PnpmVersion = "10.25.0",
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

function Invoke-Pnpm {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Arguments
    )

    if (Get-Command corepack -ErrorAction SilentlyContinue) {
        & corepack "pnpm@$PnpmVersion" @Arguments
        return $LASTEXITCODE
    }

    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        & pnpm @Arguments
        return $LASTEXITCODE
    }

    Write-Error "pnpm is required. Install it with 'corepack enable' or 'npm install -g pnpm', then rerun this script."
}

if (-not $SkipInstall -and -not (Test-Path (Join-Path $ProjectRoot "node_modules"))) {
    Write-Host "node_modules not found; installing dependencies..."
    $installExitCode = Invoke-Pnpm install
    if ($installExitCode -ne 0) {
        exit $installExitCode
    }
}

Write-Host "Starting Thoughost local dev server at http://$HostName`:$Port"
$devExitCode = Invoke-Pnpm dev --hostname $HostName --port $Port
exit $devExitCode
