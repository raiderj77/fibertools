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

function Git([string[]]$Args) {
    $value = & git @Args 2>&1
    if ($LASTEXITCODE -ne 0) { throw "git $($Args -join ' ') failed: $value" }
    return ($value -join [Environment]::NewLine).Trim()
}

$root = Git @("rev-parse", "--show-toplevel")
Set-Location $root

$origin = (Git @("remote", "get-url", "origin")).TrimEnd("/")
$branch = Git @("branch", "--show-current")
$head = Git @("rev-parse", "HEAD")
$remote = Git @("ls-remote", "origin", "refs/heads/main")
$remoteMain = ($remote -split "\s+")[0]
$before = Git @("status", "--porcelain")
$status = & git status --short --branch

Write-Host "Root:        $root"
Write-Host "Origin:      $origin"
Write-Host "Branch:      $branch"
Write-Host "HEAD:        $head"
Write-Host "origin/main: $remoteMain"
$status | ForEach-Object { Write-Host $_ }

if ($origin -notin $allowedOrigins) { throw "Unexpected origin." }
if ([string]::IsNullOrWhiteSpace($branch)) { throw "Detached HEAD." }
if ($branch -eq "main") {
    Write-Error "Direct work on main is blocked. Create a branch or worktree."
    exit 2
}
if ($before -and -not $AllowDirty) {
    throw "Working tree is not clean. Preserve or isolate existing changes, or rerun with -AllowDirty after review."
}

& git cat-file -e "$remoteMain^{commit}" 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Current remote main is not available locally. Fetch origin before work."
}
$mergeBase = Git @("merge-base", "HEAD", $remoteMain)
if ($mergeBase -ne $remoteMain) {
    throw "The branch is not based on current remote main. Rebase or recreate the worktree before editing."
}

$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($null -ne $gh) {
    Write-Host ""
    Write-Host "Main protection and required checks:"
    & gh api repos/raiderj77/fibertools/branches/main --jq '.protected, .protection.required_status_checks.contexts'
    if ($LASTEXITCODE -ne 0) { Write-Warning "GitHub CLI could not inspect branch protection." }

    Write-Host ""
    Write-Host "Open pull requests:"
    & gh pr list --repo raiderj77/fibertools --state open --limit 20
    if ($LASTEXITCODE -ne 0) { Write-Warning "GitHub CLI could not list pull requests." }
}

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

    & git diff --check
    if ($LASTEXITCODE -ne 0) { throw "Working-tree whitespace check failed." }

    & git diff --cached --check
    if ($LASTEXITCODE -ne 0) { throw "Staged whitespace check failed." }
}

$after = Git @("status", "--porcelain")
if ($after -ne $before) {
    throw "Doctor checks changed tracked worktree state."
}

Write-Host "FiberTools Codex doctor passed. No repository mutation was performed."
