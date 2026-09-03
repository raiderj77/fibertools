[CmdletBinding()]
param([switch]$RunChecks)

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

$required = @(
    "AGENTS.md",
    ".codex/config.toml",
    ".codex/hooks.json",
    ".codex/hooks/resume.mjs",
    ".codex/agents/ft-reviewer.toml",
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
if ($agentsBytes -gt 3500) { throw "AGENTS.md exceeds the 3500-byte lean limit." }

if ($RunChecks) {
    & node --test tests/codex-operating-layer.test.mjs
    if ($LASTEXITCODE -ne 0) { throw "Codex operating-layer tests failed." }
}

Write-Host "Lean Codex doctor passed. No repository mutation was performed."
