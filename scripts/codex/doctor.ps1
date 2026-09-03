[CmdletBinding()]
param(
    [switch]$RunChecks,
    [switch]$AllowDirty
)

$ErrorActionPreference = "Stop"
$expectedOrigin = "https://github.com/raiderj77/fibertools.git"

function Git([string[]]$Args) {
    $value = & git @Args 2>&1
    if ($LASTEXITCODE -ne 0) { throw "git $($Args -join ' ') failed: $value" }
    return ($value -join [Environment]::NewLine).Trim()
}

$root = Git @("rev-parse", "--show-toplevel")
Set-Location $root

$origin = Git @("remote", "get-url", "origin")
$branch = Git @("branch", "--show-current")
$head = Git @("rev-parse", "HEAD")
$remote = Git @("ls-remote", "origin", "refs/heads/main")
$remoteMain = ($remote -split "\s+")[0]
$porcelain = Git @("status", "--porcelain")
$status = & git status --short --branch

Write-Host "Root:        $root"
Write-Host "Origin:      $origin"
Write-Host "Branch:      $branch"
Write-Host "HEAD:        $head"
Write-Host "origin/main: $remoteMain"
$status | ForEach-Object { Write-Host $_ }

if ($origin -ne $expectedOrigin) { throw "Unexpected origin." }
if ([string]::IsNullOrWhiteSpace($branch)) { throw "Detached HEAD." }
if ($branch -eq "main") {
    Write-Error "Direct work on main is blocked. Create a branch or worktree."
    exit 2
}
if ($porcelain -and -not $AllowDirty) {
    throw "Working tree is not clean. Preserve or isolate existing changes, or rerun with -AllowDirty after review."
}

& git cat-file -e "$remoteMain^{commit}" 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Current remote main is not available locally. Fetch origin before work."
}
$mergeBase = Git @("merge-base", "HEAD", $remoteMain)
if ($mergeBase -ne $remoteMain) {
    throw "The current branch is not based on the current remote main. Rebase or recreate the worktree before editing."
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

$required = @(
    "AGENTS.md",
    "CLAUDE.md",
    ".codex/config.toml",
    ".codex/hooks.json",
    ".codex/hooks/resume.mjs",
    ".codex/agents/ft-reviewer.toml",
    ".codex/agents/ft-verifier.toml",
    ".agents/skills/ft-plan/SKILL.md",
    ".agents/skills/ft-run/SKILL.md",
    ".agents/skills/ft-debug/SKILL.md",
    ".agents/skills/ft-audit/SKILL.md",
    "tests/codex-operating-layer.test.mjs"
)

foreach ($file in $required) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $file) -PathType Leaf)) {
        throw "Missing required file: $file"
    }
}

$agentsBytes = [Text.Encoding]::UTF8.GetByteCount(
    [IO.File]::ReadAllText((Join-Path $root "AGENTS.md"))
)
if ($agentsBytes -gt 6000) {
    throw "AGENTS.md exceeds the 6000-byte focused-context ceiling. Remove duplication, not safeguards."
}

if ($RunChecks) {
    & node --test tests/codex-operating-layer.test.mjs
    if ($LASTEXITCODE -ne 0) { throw "Codex operating-layer tests failed." }
}

Write-Host "FiberTools Codex doctor passed. No repository mutation was performed."
