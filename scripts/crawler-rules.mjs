// Validate this repository's explicit directives; this is not a general robots
// URL matcher. Keep intentional crawler policy in public/robots.txt.
export function getCrawlerRuleViolations(source) {
  const groups = [];
  const sitemaps = [];
  let group;
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.split("#", 1)[0].trim();
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (key === "sitemap") {
      sitemaps.push(value);
    } else if (key === "user-agent") {
      if (!group || group.rules.length) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(value.toLowerCase());
    } else if (group) {
      group.rules.push([key, value]);
    }
  }
  const rulesFor = agent => groups.filter(g => g.agents.includes(agent.toLowerCase())).flatMap(g => g.rules);
  const has = (rules, key, value) => rules.some(rule => rule[0] === key && rule[1] === value);
  const violations = [];
  for (const agent of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Applebot", "Applebot-Extended", "Amazonbot", "DuckAssistBot", "GPTBot", "ClaudeBot", "Google-Extended", "*"]) {
    const rules = rulesFor(agent);
    if (!has(rules, "allow", "/") || has(rules, "disallow", "/")) violations.push(`${agent}: expected Allow: / without Disallow: /`);
  }
  for (const agent of ["CCBot", "Meta-ExternalAgent", "Bytespider"]) {
    const rules = rulesFor(agent);
    if (!has(rules, "disallow", "/") || has(rules, "allow", "/")) violations.push(`${agent}: expected Disallow: / without Allow: /`);
  }
  if (!has(rulesFor("Bingbot"), "crawl-delay", "10")) violations.push("Bingbot: expected Crawl-delay: 10 in its group");
  for (const path of ["/api/", "/admin/", "/private/"]) {
    if (!has(rulesFor("*"), "disallow", path)) violations.push(`Default group: missing Disallow: ${path}`);
  }
  if (!sitemaps.includes("https://fibertools.app/sitemap.xml")) violations.push("Sitemap: expected canonical https://fibertools.app/sitemap.xml directive");
  return violations;
}
