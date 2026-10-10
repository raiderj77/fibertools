import { load, DEFAULT_SCHEMA } from 'js-yaml';

/**
 * Parse the YAML metadata and unchanged body used by repository content.
 * No language engines, executable tags, file access or stringification.
 * @param {string} input
 * @returns {{data: Record<string, unknown>, content: string}}
 */
export function parseFrontMatter(input) {
  const source = input.replace(/^\uFEFF/, '');
  const opening = /^---[ \t]*(?:\r?\n|$)/.exec(source);
  if (!opening) {
    if (/^---[a-z]/i.test(source)) throw new SyntaxError('Only YAML front matter is supported.');
    return { data: {}, content: source };
  }

  const remainder = source.slice(opening[0].length);
  const closing = /^---[ \t]*(?:\r?\n|$)/m.exec(remainder);
  if (!closing) throw new SyntaxError('Front matter requires a closing delimiter.');
  const parsed = load(remainder.slice(0, closing.index), { schema: DEFAULT_SCHEMA });
  const data = parsed == null ? {} : parsed;
  if (typeof data !== 'object' || Array.isArray(data)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(data))) {
    throw new SyntaxError('Front matter must be a YAML mapping.');
  }
  return {
    data,
    content: remainder.slice(closing.index + closing[0].length),
  };
}
