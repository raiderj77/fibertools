import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

function loadGuides() {
  const source = readFileSync('src/lib/guides.ts', 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports });
  return exports.guides;
}

const questions = [
  'How many yards of yarn do I need for a throw blanket?',
  'How many yards is a throw blanket?',
  'How many yards for a throw blanket?',
];

function answerAfter(content, question) {
  const marker = `### ${question}\n\n`;
  const start = content.indexOf(marker);
  assert.notEqual(start, -1, `missing FAQ: ${question}`);
  const rest = content.slice(start + marker.length);
  return rest.split('\n\n### ')[0];
}

function wordCount(markdown) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

test('blanket guide owns the three throw-yardage answers without duplicating calculator FAQs', () => {
  const guide = loadGuides().find((item) => item.slug === 'blanket-yarn-guide');
  const common = guide.sections.find((section) => section.heading === 'Common questions').content;

  for (const question of questions) {
    const answer = answerAfter(common, question);
    assert.ok(wordCount(answer) <= 60, `${question} answer exceeds 60 words`);
    assert.match(answer, /hypothetical/i);
    assert.match(answer, /4×4-inch/);
    assert.match(answer, /20-yard/);
    assert.match(answer, /3,750/);
    assert.match(answer, /4,125/);
    assert.match(answer, /10%/);
    assert.match(answer, /19 illustrative 220-yard skeins/);
    assert.match(answer, /\[yarn calculator\]\(\/yarn-calculator\)\.$/);
  }

  const calculatorFaqs = readFileSync('src/lib/faqs.ts', 'utf8');
  for (const question of questions) {
    assert.doesNotMatch(calculatorFaqs, new RegExp(question.replace(/[?]/g, '\\?'), 'i'));
  }
});

test('blanket guide snippet and reciprocal contextual links stay focused', () => {
  const guide = loadGuides().find((item) => item.slug === 'blanket-yarn-guide');
  assert.equal(
    guide.description,
    'Estimate throw-blanket yarn from a measured swatch, keep allowance separate, and convert yards to whole skeins with a checked 50×60-inch example.',
  );
  assert.ok(guide.description.length <= 155);
  assert.equal(guide.modifiedDate, '2026-10-17');
  assert.match(guide.sections.map((section) => section.content).join('\n'), /\[blanket calculator\]\(\/blanket-calculator\)/);

  const blanketPage = readFileSync('src/app/blanket-calculator/page.tsx', 'utf8');
  assert.match(blanketPage, /href="\/guides\/blanket-yarn-guide"/);
  assert.match(blanketPage, />\s*blanket yarn guide\s*<\/Link>/);
});

test('the embeds surface receives one contextual formula-library in-link', () => {
  const formulaLibrary = readFileSync('src/app/formula-library/page.tsx', 'utf8');
  assert.equal((formulaLibrary.match(/href="\/embeds"/g) ?? []).length, 1);
  assert.match(formulaLibrary, /free branded calculator embeds for HTTPS websites/);
});
