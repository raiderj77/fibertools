[CmdletBinding()]
param(
    [switch]$RunChecks,
    [switch]$AllowDirty
)

$ErrorActionPreference = "Stop"
$allowedOrigins = @(
    "https://github.com/raiderj77/fibertools.git",
    "https://github.com/raiderj77/fibertools",
    "git@github.com:raiderj77/fibertools.git",
    "git@github.com:raiderj77/fibertools",
    "ssh://git@github.com/raiderj77/fibertools.git",
    "ssh://git@github.com/raiderj77/fibertools"
)

$gitCommand = Get-Command git -CommandType Application -ErrorAction Stop | Select-Object -First 1
$gitExecutable = $gitCommand.Path

function Invoke-Git([string[]]$Arguments) {
    $value = & $gitExecutable @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) { throw "git $($Arguments -join ' ') failed: $value" }
    return ($value -join [Environment]::NewLine).Trim()
}

$root = Invoke-Git @("rev-parse", "--show-toplevel")
Set-Location $root

$origin = (Invoke-Git @("remote", "get-url", "origin")).TrimEnd("/")
if ($origin -notin $allowedOrigins) { throw "Unexpected origin." }

$branch = Invoke-Git @("branch", "--show-current")
if ([string]::IsNullOrWhiteSpace($branch)) { throw "Detached HEAD." }
if ($branch -eq "main") {
    Write-Error "Direct work on main is blocked. Create a branch or worktree."
    exit 2
}

$head = Invoke-Git @("rev-parse", "HEAD")
$before = Invoke-Git @("status", "--porcelain")
if ($before -and -not $AllowDirty) {
    throw "Working tree is not clean. Preserve or isolate existing changes, or rerun with -AllowDirty after review."
}

$remote = Invoke-Git @("ls-remote", "origin", "refs/heads/main")
$remoteMain = ($remote -split "\s+")[0]
$status = & $gitExecutable status --short --branch

Write-Host "Root:        $root"
Write-Host "Origin:      $origin"
Write-Host "Branch:      $branch"
Write-Host "HEAD:        $head"
Write-Host "origin/main: $remoteMain"
$status | ForEach-Object { Write-Host $_ }

& $gitExecutable cat-file -e "$remoteMain^{commit}" 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Current remote main is not available locally. Fetch origin before work."
}
$mergeBase = Invoke-Git @("merge-base", "HEAD", $remoteMain)
if ($mergeBase -ne $remoteMain) {
    throw "The branch is not based on current remote main. Rebase or recreate the worktree before editing."
}

$ghCommand = Get-Command gh -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -eq $ghCommand) {
    throw "GitHub CLI is required for the pre-edit gate; remote evidence is unknown."
}
$ghExecutable = $ghCommand.Path

Write-Host ""
Write-Host "Main protection and required checks:"
$protectionOutput = & $ghExecutable api repos/raiderj77/fibertools/branches/main 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI could not inspect branch protection; remote evidence is unknown: $protectionOutput"
}
$protection = ($protectionOutput -join [Environment]::NewLine) | ConvertFrom-Json
if (-not $protection.protected) { throw "GitHub reports that main is not protected." }
$requiredContexts = @($protection.protection.required_status_checks.contexts)
$missingContexts = @("Build and quality gates", "Public-file compliance") | Where-Object { $_ -notin $requiredContexts }
if ($missingContexts.Count -gt 0) {
    throw "GitHub required checks are incomplete: $($missingContexts -join ', ')"
}

Write-Host "Protected:   $($protection.protected)"
$requiredContexts | ForEach-Object { Write-Host "Required:    $_" }

Write-Host ""
Write-Host "Open pull requests:"
$pullRequests = & $ghExecutable pr list --repo raiderj77/fibertools --state open --limit 20 2>&1
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI could not list pull requests; overlap evidence is unknown: $pullRequests"
}
$pullRequests | ForEach-Object { Write-Host $_ }

$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } elseif ($HOME) { Join-Path $HOME ".codex" } else { $null }
if ($codexHome) {
    foreach ($name in @("AGENTS.override.md", "AGENTS.md")) {
        if (Test-Path -LiteralPath (Join-Path $codexHome $name) -PathType Leaf) {
            Write-Warning "Global Codex instructions also load from $codexHome. Review instruction sources with /status."
            break
        }
    }
}

$required = @(
    "AGENTS.md",
    ".codex/config.toml",
    ".codex/hooks.json",
    ".codex/hooks/resume.mjs",
    ".codex/agents/ft-reviewer.toml",
    ".codex/agents/ft-verifier.toml",
    ".agents/skills/ft-plan/SKILL.md",
    ".agents/skills/ft-run/SKILL.md",
    ".agents/skills/ft-debug/SKILL.md",
    ".agents/skills/ft-audit/SKILL.md",
    "docs/CODEX.md",
    "docs/codex/PRODUCT_PUBLICATION.md",
    "docs/codex/PRIVACY_SECURITY_ACCESSIBILITY.md",
    "docs/codex/COMMERCIAL_RELEASE.md",
    "scripts/codex/context-budget.mjs",
    "scripts/codex/task-check.mjs",
    "scripts/codex/validate-config.mjs",
    "tests/codex-operating-layer.test.mjs"
)
foreach ($file in $required) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $file) -PathType Leaf)) {
        throw "Missing required file: $file"
    }
}

& node scripts/codex/context-budget.mjs
if ($LASTEXITCODE -ne 0) { throw "Codex context-budget checks failed." }

if (Test-Path -LiteralPath (Join-Path $root ".codex/TASK.md") -PathType Leaf) {
    & node scripts/codex/task-check.mjs --required
    if ($LASTEXITCODE -ne 0) { throw "Active Codex task validation failed." }
}

if ($RunChecks) {
    & node --test tests/codex-operating-layer.test.mjs
    if ($LASTEXITCODE -ne 0) { throw "Codex operating-layer tests failed." }

    & $gitExecutable diff --check
    if ($LASTEXITCODE -ne 0) { throw "Working-tree whitespace check failed." }

    & $gitExecutable diff --cached --check
    if ($LASTEXITCODE -ne 0) { throw "Staged whitespace check failed." }
}

$after = Invoke-Git @("status", "--porcelain")
if ($after -ne $before) {
    throw "Doctor checks changed tracked worktree state."
}

Write-Host "FiberTools Codex doctor passed. No repository mutation was performed."
