cd ~/projects/fibertools
cc-minimax
```

### Step 2: Paste Prompt #1 (Competitor Deep Dive)

Once Claude Code is loaded and you see the prompt, paste this entire block:
```
Spawn 5 research subagents in parallel:

1. Analyze yarncalculator.com - what tools they offer, page structure, schema markup, load speed, backlink profile

2. Analyze easycrochet.com/calculators - same analysis plus their content/blog strategy and internal linking

3. Analyze jimmybeanswool.com yarn calculator pages - how a retailer approaches calculator tools, what are their weaknesses

4. Search Reddit r/crochet and r/knitting for posts mentioning yarn calculators, gauge calculators, or hook size charts. What do people love? What do they complain about? Collect the top 20 most relevant threads.

5. Search Google for the top 10 results for "yarn yardage calculator" and "crochet hook size chart". For each result note: URL, page title, meta description, whether they have schema markup, estimated word count, and page speed.

Save all findings to research/competitor-analysis.md
```

Let it run. It'll take 2-5 minutes while the subagents work in parallel. When it finishes, you'll see the file created.

### Step 3: Paste Prompt #2 (Keyword Research)

After the first one completes, paste this:
```
Spawn 3 research subagents:

1. Find every variation of yarn, crochet, and knitting calculator keywords. Include: yarn yardage calculator, crochet hook size chart, yarn weight chart, gauge calculator, blanket size calculator, yarn substitution, c2c calculator, amigurumi yarn calculator, granny square calculator, knitting needle size chart. For each, find Google autocomplete variations and People Also Ask. Collect at least 50 keywords total with estimated search volume.

2. For each of the top 20 keywords, search Google and note which results have rich snippets, featured snippets, or knowledge panels. This tells us where schema markup opportunities exist.

3. Search Reddit, Pinterest, and craft forums to find what types of crochet/knitting reference content gets shared most. What charts, cheat sheets, or tools go viral? Collect 20 examples with URLs.

Save all findings to research/keyword-research.md
```

### Step 4: Paste Prompt #3 (Schema Templates)

After keyword research completes:
```
Research what JSON-LD schema markup types are most effective for calculator and tool pages. Specifically:

1. Search for examples of HowTo schema on calculator pages
2. Search for FAQPage schema implementation best practices
3. Find examples of WebApplication schema for online tools
4. Check if any yarn/crochet calculator sites currently use schema
5. Write reusable TypeScript template functions for: HowTo, FAQPage, BreadcrumbList, and WebApplication schema that we can import on every tool page

Save templates to src/lib/schema-templates.ts
```

### Step 5: Exit and commit

After all three are done, type:
```
/exit
