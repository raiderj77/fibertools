[CmdletBinding()]
param(
    [switch]$RunChecks,
    [switch]$SkipRemote
)

$ErrorActionPreference = "Stop"
$expectedOrigin = "https://github.com/raiderj77/fibertools.git"

function Invoke-Git {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $output = & git @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed: $output"
    }

    return ($output -join [Environment]::NewLine).Trim()
}

function Write-Section {
    param([Parameter(Mandatory = $true)][string]$Title)
    Write-Host ""
    Write-Host "== $Title =="
}

$root = Invoke-Git -Arguments @("rev-parse", "--show-toplevel")
Set-Location $root

Write-Section "Repository identity"
$origin = Invoke-Git -Arguments @("remote", "get-url", "origin")
$branch = Invoke-Git -Arguments @("branch", "--show-current")
$head = Invoke-Git -Arguments @("rev-parse", "HEAD")

Write-Host "Root:   $root"
Write-Host "Origin: $origin"
Write-Host "Branch: $branch"
Write-Host "HEAD:   $head"

if ($origin -ne $expectedOrigin) {
    throw "Unexpected origin. Expected $expectedOrigin"
}

if ([string]::IsNullOrWhiteSpace($branch)) {
    throw "Detached HEAD. Create or enter an isolated branch before work."
}

if ($branch -eq "main") {
    Write-Error "Direct work on main is blocked. Create an isolated branch or Codex worktree based on current origin/main."
    exit 2
}

Write-Section "Remote main"
if ($SkipRemote) {
    Write-Host "Remote lookup skipped by request."
} else {
    $remoteLine = Invoke-Git -Arguments @("ls-remote", "origin", "refs/heads/main")
    if ([string]::IsNullOrWhiteSpace($remoteLine)) {
        throw "Unable to resolve origin/main."
    }

    $remoteMain = ($remoteLine -split "\s+")[0]
    Write-Host "Current remote main: $remoteMain"

    try {
        $localOriginMain = Invoke-Git -Arguments @("rev-parse", "--verify", "origin/main")
        Write-Host "Local origin/main:   $localOriginMain"
        if ($localOriginMain -ne $remoteMain) {
            Write-Warning "The local origin/main ref is stale. Fetch before creating or rebasing work."
        }
    } catch {
        Write-Warning "No local origin/main ref was available."
    }
}

Write-Section "Working tree"
$status = & git status --short --branch
if ($LASTEXITCODE -ne 0) {
    throw "Unable to read Git status."
}
$status | ForEach-Object { Write-Host $_ }

$porcelain = & git status --porcelain=v1
if ($LASTEXITCODE -ne 0) {
    throw "Unable to inspect working-tree changes."
}
if ($porcelain) {
    Write-Warning "The working tree has changes. Confirm every changed path belongs to the approved scope and preserve unrelated owner work."
} else {
    Write-Host "Working tree is clean."
}

Write-Section "Recent commits"
& git log --oneline --decorate -5
if ($LASTEXITCODE -ne 0) {
    throw "Unable to read recent commits."
}

Write-Section "Open pull requests"
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($null -eq $gh) {
    Write-Host "GitHub CLI is not installed. Review open pull requests through the connected GitHub tool before editing."
} else {
    & gh pr list --repo raiderj77/fibertools --state open --limit 10
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "GitHub CLI could not list open pull requests."
    }
}

Write-Section "Codex operating files"
$requiredFiles = @(
    "AGENTS.md",
    "CLAUDE.md",
    ".codex/config.toml",
    ".codex/hooks.json",
    ".codex/hooks/session-start.mjs",
    "docs/CODEX_AGENT_OS.md",
    "tests/codex-operating-layer.test.mjs"
)

foreach ($relativePath in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $relativePath) -PathType Leaf)) {
        throw "Missing required file: $relativePath"
    }
    Write-Host "OK  $relativePath"
}

Write-Host ""
Write-Host "Protected StitchProof distribution and experiment records were not opened or inspected."

if ($RunChecks) {
    Write-Section "Operating-layer tests"
    & node --test tests/codex-operating-layer.test.mjs
    if ($LASTEXITCODE -ne 0) {
        throw "Codex operating-layer tests failed."
    }
}

Write-Host ""
Write-Host "Doctor completed without modifying repository files, branches, commits, remotes, pull requests, or deployments."
