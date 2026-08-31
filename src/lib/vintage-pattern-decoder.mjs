export const MAX_VINTAGE_PATTERN_TEXT_LENGTH = 20_000;

export const VINTAGE_SOURCE_CONVENTIONS = Object.freeze([
  "unknown",
  "us",
  "uk",
]);

const UK_TO_US_TERMS = Object.freeze([
  Object.freeze({
    label: "Double treble crochet",
    terms: Object.freeze(["double treble crochet", "double treble", "dtr"]),
    replacement: "treble crochet (tr)",
    note: "UK double treble crochet is US treble crochet.",
  }),
  Object.freeze({
    label: "Half treble crochet",
    terms: Object.freeze(["half treble crochet", "half treble", "htr"]),
    replacement: "half double crochet (hdc)",
    note: "UK half treble crochet is US half double crochet.",
  }),
  Object.freeze({
    label: "Treble crochet",
    terms: Object.freeze(["treble crochet", "treble", "tr"]),
    replacement: "double crochet (dc)",
    note: "UK treble crochet is US double crochet.",
  }),
  Object.freeze({
    label: "Double crochet",
    terms: Object.freeze(["double crochet", "dc"]),
    replacement: "single crochet (sc)",
    note: "UK double crochet is US single crochet.",
  }),
  Object.freeze({
    label: "Tension",
    terms: Object.freeze(["tension"]),
    replacement: "gauge",
    note: "Tension is commonly called gauge in US instructions.",
  }),
]);

export const SUPPORTED_VINTAGE_UK_TERMS = Object.freeze(
  UK_TO_US_TERMS.map(({ label, terms, replacement, note }) => Object.freeze({
    label,
    terms,
    replacement,
    note,
  })),
);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ISOLATED_STITCH_TERMS = new Set([
  "double treble crochet",
  "double treble",
  "half treble crochet",
  "half treble",
  "treble crochet",
  "treble",
  "double crochet",
]);

const SOURCE_TOKEN_MATCHER = /[^\s<>"'`“”‘’]+/gu;
const STRONG_SOURCE_LABEL_SOURCE = String.raw`(?:source|mirror|path|file(?:[\t\p{Zs}]*name)?|link|reference|citation|uri|url|web[\t\p{Zs}]*(?:site|address)|document|folder|directory)`;
const STRONG_SOURCE_PATH_CONTEXT = new RegExp(
  String.raw`(?:^|[\s:;])(?:[*_]{1,2})?${STRONG_SOURCE_LABEL_SOURCE}[\t\p{Zs}]*(?::|=|[-‐‑‒–—])?[\t\p{Zs}]*(?:[*_]{1,2})?[\t\p{Zs}]*[\[({<"'“‘]*$`,
  "iu",
);
const AMBIGUOUS_SOURCE_PATH_CONTEXT = /(?:^|[\s:;])(?:chart|see)[\t\p{Zs}]*(?::|=|[-‐‑‒–—])?[\t\p{Zs}]*[\[({]*$/iu;
const MARKDOWN_REFERENCE_DESTINATION_CONTEXT = /(?:^|\n)[\t\p{Zs}]*\[[^\]\r\n]+\]:[\t\p{Zs}]*$/u;
const INSTRUCTION_NUMBER_SEQUENCE_SOURCE = String.raw`\p{N}+(?:[\t\p{Zs}]*(?:[-‐‑‒–—]|,[\t\p{Zs}]*(?:&|and)?|&|and|to|through|or)[\t\p{Zs}]*\p{N}+)*`;
const INSTRUCTION_SIDE_MARKER_SOURCE = String.raw`(?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side)`;
const INSTRUCTION_SIDE_QUALIFIER_SOURCE = String.raw`(?:[\t\p{Zs}]*(?:\(${INSTRUCTION_SIDE_MARKER_SOURCE}\)|\[(?:rs|ws)\]|,[\t\p{Zs}]*${INSTRUCTION_SIDE_MARKER_SOURCE})|[\t\p{Zs}]+${INSTRUCTION_SIDE_MARKER_SOURCE})?`;
const INSTRUCTION_HEADING_SOURCE = String.raw`(?:${INSTRUCTION_SIDE_MARKER_SOURCE}[\t\p{Zs}]+)?(?:(?:(?:rows?|rounds?|rnds?|steps?)(?:[\t\p{Zs}]+${INSTRUCTION_NUMBER_SEQUENCE_SOURCE})?|(?:r|rnd)\.?[\t\p{Zs}]*\p{N}+|(?:(?:next|following|last)[\t\p{Zs}]+(?:\p{N}+[\t\p{Zs}]+)?|(?:final|first|second|third|fourth|fifth|foundation|setup|set[-‐‑‒–—]up|repeat|odd|even|alternate)[\t\p{Zs}]+|\p{N}+(?:st|nd|rd|th)[\t\p{Zs}]+)(?:rows?|rounds?|rnds?)|every[\t\p{Zs}]+other[\t\p{Zs}]+(?:row|round|rnd)|rs|ws|setup|set[-‐‑‒–—]up))${INSTRUCTION_SIDE_QUALIFIER_SOURCE}`;
const MARKDOWN_EMPHASIS_WRAPPER_SOURCE = String.raw`(?:\*{1,3}|_{1,3}|\x60)`;
const INSTRUCTION_HEADING_PREFIX_SOURCE = String.raw`[\t\p{Zs}]*(?:(?:>|[-+*]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`;
const INSTRUCTION_DELIMITER_SOURCE = String.raw`(?:[:=：＝→⇒➜]|[.)]|[-‐‑‒–—―−﹣－])`;
const EXPLICIT_INSTRUCTION_LINE_CONTEXT = new RegExp(
  String.raw`(?:^|\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}${INSTRUCTION_HEADING_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?[^\r\n]*$`,
  "iu",
);
const SOURCE_INSTRUCTION_SEGMENT = /^(?:ch|slst|sc|hdc|dc|tr|htr|dtr|st|sts|yo|sk|skip|sp|lp|rep|beg|inc|dec|rs|ws|in|work|next|each|\p{N}+)$/iu;
const SOURCE_LIKE_PATH_ROOT = /^(?:patterns?|assets?|docs?|files?|images?|charts?|references?|content|public|src)$/iu;
const NON_HIERARCHICAL_URI_SCHEMES = new Set([
  "data", "doi", "file", "magnet", "mailto", "news", "sms", "tel", "urn",
]);
const NON_INSTRUCTION_METADATA_LINE = /(?:^|\r?\n)[\t\p{Zs}]*(?:(?:publisher|source|author|designer|publication|book|magazine|title|copyright|address|location|pattern[\t\p{Zs}]+(?:name|number))[\t\p{Zs}]*(?::|[-‐‑‒–—])|pattern[\t\p{Zs}]*(?:#|no\.?)?[\t\p{Zs}]*\d+\b|(?:catalog|page|vol(?:ume)?\.?|no\.?)[\t\p{Zs}]*\d+\b|copyright\b|printed\b|©)[^\r\n]*/giu;

function sourceCandidateOffsets(token) {
  const offsets = new Set([0]);
  const markdownStart = token.lastIndexOf("](");
  if (markdownStart !== -1) offsets.add(markdownStart + 2);

  const schemeSeparator = token.indexOf("://");
  if (schemeSeparator !== -1) {
    let schemeStart = schemeSeparator;
    while (schemeStart > 0 && /[A-Za-z0-9+.-]/u.test(token[schemeStart - 1])) {
      schemeStart -= 1;
    }
    offsets.add(schemeStart);
  }

  const labelSeparator = token.indexOf(":");
  if (labelSeparator > 1 && labelSeparator + 1 < token.length) {
    offsets.add(labelSeparator + 1);
  }
  return [...offsets];
}

function trimSourceCandidate(token, offset) {
  let start = offset;
  while (start < token.length && /[\[({]/u.test(token[start])) start += 1;

  let end = token.length;
  while (end > start && /[\])},.;!]/u.test(token[end - 1])) end -= 1;
  return { start, end, value: token.slice(start, end) };
}

function isDomainName(hostname) {
  const labels = hostname.split(".");
  if (labels.length < 2 || labels.some((label) => label.length === 0 || label.length > 63)) {
    return false;
  }
  if (
    !/^[\p{L}\p{M}]{2,}$/u.test(labels[labels.length - 1])
    && !/^xn--[a-z0-9-]{2,59}$/iu.test(labels[labels.length - 1])
  ) return false;
  return labels.every((label) => (
    /^[\p{L}\p{M}\p{N}-]+$/u.test(label)
    && !label.startsWith("-")
    && !label.endsWith("-")
  ));
}

function isBracketedIpv6Host(hostname) {
  if (!/^\[[0-9A-Fa-f:.]+\]$/u.test(hostname)) return false;
  try {
    return new URL(`http://${hostname}`).hostname.length > 0;
  } catch {
    return false;
  }
}

function isLocalNetworkHost(hostname) {
  if (hostname.toLocaleLowerCase("en-US") === "localhost") return true;
  const octets = hostname.split(".");
  return octets.length === 4 && octets.every((octet) => (
    /^\d{1,3}$/u.test(octet) && Number(octet) <= 255
  ));
}

function sourceHost(candidate) {
  const suffixStart = candidate.search(/[/?#]/u);
  const hostWithPort = suffixStart === -1 ? candidate : candidate.slice(0, suffixStart);
  const portSeparator = hostWithPort.lastIndexOf(":");
  if (portSeparator === -1) return hostWithPort;
  const port = hostWithPort.slice(portSeparator + 1);
  return /^\d{1,5}$/u.test(port) ? hostWithPort.slice(0, portSeparator) : hostWithPort;
}

function isSourceReferenceCandidate(candidate, precedingText) {
  if (!candidate) return false;
  if (MARKDOWN_REFERENCE_DESTINATION_CONTEXT.test(precedingText)) return true;

  const schemeSeparator = candidate.indexOf("://");
  if (schemeSeparator > 0 && schemeSeparator <= 64) {
    const scheme = candidate.slice(0, schemeSeparator);
    return /^[A-Za-z][A-Za-z0-9+.-]*$/u.test(scheme)
      && candidate.length > schemeSeparator + 3;
  }

  const genericSchemeSeparator = candidate.indexOf(":");
  if (genericSchemeSeparator > 0 && genericSchemeSeparator <= 64) {
    const scheme = candidate.slice(0, genericSchemeSeparator).toLocaleLowerCase("en-US");
    if (
      NON_HIERARCHICAL_URI_SCHEMES.has(scheme)
      && candidate.length > genericSchemeSeparator + 1
    ) return true;
  }

  const at = candidate.indexOf("@");
  if (at > 0 && at === candidate.lastIndexOf("@")) {
    const local = candidate.slice(0, at);
    const hostname = sourceHost(candidate.slice(at + 1));
    if (/^[\p{L}\p{M}\p{N}._%+-]+$/u.test(local) && isDomainName(hostname)) {
      return true;
    }
  }

  const hostname = sourceHost(candidate);
  if (isDomainName(hostname) || isLocalNetworkHost(hostname) || isBracketedIpv6Host(hostname)) return true;

  if (candidate.startsWith("//")) {
    const protocolRelativeHost = sourceHost(candidate.slice(2));
    if (
      isDomainName(protocolRelativeHost)
      || isLocalNetworkHost(protocolRelativeHost)
      || isBracketedIpv6Host(protocolRelativeHost)
    ) return true;
  }
  if (/^[A-Za-z]:/u.test(candidate) || candidate.startsWith("\\\\")) return true;
  if (candidate.startsWith("../") || candidate.startsWith("..\\")) return true;
  if (candidate.startsWith("./") || candidate.startsWith(".\\")) return true;
  if (candidate.startsWith("~/") || candidate.startsWith("~\\")) return true;
  if (/^(?:\$(?:HOME|USERPROFILE)|\$\{(?:HOME|USERPROFILE)\}|%USERPROFILE%)[\\/]/iu.test(candidate)) return true;
  if (candidate.length > 1 && candidate.startsWith("/") && !candidate.startsWith("//")) return true;

  const pathWithoutSuffix = candidate.split(/[?#]/u, 1)[0];
  const segments = pathWithoutSuffix.split(/[\\/]/u);
  if (segments.length < 2 || segments.some((segment) => segment.length === 0)) return false;
  const strongPathContext = STRONG_SOURCE_PATH_CONTEXT.test(precedingText);
  if (segments.every((segment) => SOURCE_INSTRUCTION_SEGMENT.test(segment)) && !strongPathContext) {
    return false;
  }
  const lastSegment = segments[segments.length - 1];
  const hasFileExtension = /[^.][.][\p{L}\p{M}\p{N}]{1,16}$/u.test(lastSegment);
  if (hasFileExtension || strongPathContext) return true;
  if (SOURCE_LIKE_PATH_ROOT.test(segments[0])) return true;
  if (EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(precedingText)) return true;
  return segments.length >= 3 || AMBIGUOUS_SOURCE_PATH_CONTEXT.test(precedingText);
}

function findMarkdownCodeRanges(text) {
  const ranges = [];
  const stripBlockquotePrefix = (line) => line.replace(/^(?: {0,3}>[\t ]?)+/u, "");
  let indentedBlockStart = -1;
  let indentedBlockEnd = -1;
  for (const line of splitTextLines(text)) {
    const blockContent = stripBlockquotePrefix(line.content);
    const indented = /^(?: {4,}|\t)/u.test(blockContent);
    if (indented) {
      if (indentedBlockStart === -1) indentedBlockStart = line.start;
      indentedBlockEnd = line.end;
      continue;
    }
    if (indentedBlockStart !== -1 && blockContent.trim() === "") {
      indentedBlockEnd = line.end;
      continue;
    }
    if (indentedBlockStart !== -1) {
      ranges.push({ start: indentedBlockStart, end: indentedBlockEnd, kind: "markdown-code" });
      indentedBlockStart = -1;
      indentedBlockEnd = -1;
    }
  }
  if (indentedBlockStart !== -1) {
    ranges.push({ start: indentedBlockStart, end: indentedBlockEnd, kind: "markdown-code" });
  }
  const findClosingFenceEnd = (searchStart, fenceCharacter, minimumLength) => {
    let lineStart = searchStart;
    while (lineStart < text.length) {
      const newline = text.indexOf("\n", lineStart);
      const lineEnd = newline === -1 ? text.length : newline;
      const line = text.slice(lineStart, lineEnd).replace(/\r$/u, "");
      const blockContent = stripBlockquotePrefix(line);
      let cursor = line.length - blockContent.length;
      const indentationStart = cursor;
      while (cursor < line.length && cursor - indentationStart < 3 && /[\t ]/u.test(line[cursor])) cursor += 1;
      let fenceEnd = cursor;
      while (fenceEnd < line.length && line[fenceEnd] === fenceCharacter) fenceEnd += 1;
      if (
        fenceEnd - cursor >= minimumLength
        && /^[\t ]*$/u.test(line.slice(fenceEnd))
      ) return lineEnd;
      if (newline === -1) break;
      lineStart = newline + 1;
    }
    return text.length;
  };

  let index = 0;
  while (index < text.length) {
    const fenceCharacter = text[index];
    if ((fenceCharacter === "`" || fenceCharacter === "~") && text[index - 1] !== "\\") {
      let delimiterEnd = index + 1;
      while (delimiterEnd < text.length && text[delimiterEnd] === fenceCharacter) delimiterEnd += 1;
      const delimiterLength = delimiterEnd - index;
      const lineStart = text.lastIndexOf("\n", index - 1) + 1;
      const beforeFence = text.slice(lineStart, index);
      if (delimiterLength >= 3 && /^[\t ]{0,3}$/u.test(stripBlockquotePrefix(beforeFence))) {
        const openingNewline = text.indexOf("\n", delimiterEnd);
        const end = openingNewline === -1
          ? text.length
          : findClosingFenceEnd(openingNewline + 1, fenceCharacter, delimiterLength);
        ranges.push({ start: index, end, kind: "markdown-code" });
        if (end === text.length) break;
        index = end;
        continue;
      }
      if (fenceCharacter === "`") {
        const delimiter = text.slice(index, delimiterEnd);
        let close = text.indexOf(delimiter, delimiterEnd);
        while (
          close !== -1
          && (text[close - 1] === "`" || text[close + delimiter.length] === "`")
        ) close = text.indexOf(delimiter, close + 1);
        const end = close === -1 ? text.length : close + delimiter.length;
        ranges.push({ start: index, end, kind: "markdown-code" });
        if (close === -1) break;
        index = end;
        continue;
      }
    }
    if (text[index] !== "`" || text[index - 1] === "\\") {
      index += 1;
      continue;
    }
    index += 1;
  }
  return ranges;
}

function findHtmlMarkupRanges(text) {
  const ranges = [];
  const lowerText = text.toLocaleLowerCase("en-US");
  const findTagEnd = (start) => {
    let quote = "";
    for (let index = start + 1; index < text.length; index += 1) {
      const character = text[index];
      if (quote) {
        if (character === quote) quote = "";
      } else if (character === "\"" || character === "'") {
        quote = character;
      } else if (character === ">") {
        return index + 1;
      }
    }
    return text.length;
  };

  let index = 0;
  while (index < text.length) {
    const start = text.indexOf("<", index);
    if (start === -1) break;
    if (text.startsWith("<!--", start)) {
      const close = text.indexOf("-->", start + 4);
      const end = close === -1 ? text.length : close + 3;
      ranges.push({ start, end, kind: "html-code" });
      index = end;
      continue;
    }
    if (lowerText.startsWith("<![cdata[", start)) {
      const close = lowerText.indexOf("]]>", start + 9);
      const end = close === -1 ? text.length : close + 3;
      ranges.push({ start, end, kind: "html-code" });
      index = end;
      continue;
    }

    const openingTag = lowerText.slice(start).match(/^<(code|pre|script|style)\b/u);
    const tagLike = /^<(?:\/?[a-z][\w:-]*|!doctype\b|\?xml\b)/iu.test(text.slice(start));
    if (!openingTag && !tagLike) {
      index = start + 1;
      continue;
    }
    const openingEnd = findTagEnd(start);
    if (openingTag) {
      const closeStart = lowerText.indexOf(`</${openingTag[1]}`, openingEnd);
      const end = closeStart === -1 ? text.length : findTagEnd(closeStart);
      ranges.push({ start, end, kind: "html-code" });
      index = end;
      continue;
    }
    ranges.push({ start, end: openingEnd, kind: "html-markup" });
    index = openingEnd;
  }
  return ranges;
}

function findStrongLabeledQuotedRanges(text) {
  const ranges = [];
  const matcher = new RegExp(
    String.raw`(?:^|[\s:;])(?:[*_]{1,2})?${STRONG_SOURCE_LABEL_SOURCE}\b[\t\p{Zs}]*(?::|=|[-‐‑‒–—])?[\t\p{Zs}]*(?:[*_]{1,2})?[\t\p{Zs}]*(?<quote>["'“‘])`,
    "giu",
  );
  const closingQuote = new Map([["\"", "\""], ["'", "'"], ["“", "”"], ["‘", "’"]]);
  let match;
  while ((match = matcher.exec(text)) !== null) {
    const quote = match.groups.quote;
    const start = match.index + match[0].lastIndexOf(quote);
    const lineEnd = text.indexOf("\n", start + 1);
    const close = text.indexOf(closingQuote.get(quote), start + 1);
    if (close === -1 || (lineEnd !== -1 && close > lineEnd)) continue;
    ranges.push({ start, end: close + 1, kind: "quoted-source" });
    matcher.lastIndex = close + 1;
  }
  return ranges;
}

function findStrongLabeledSourceLineRanges(text) {
  const ranges = [];
  const matcher = new RegExp(
    String.raw`(?:^|\n)[\t\p{Zs}]*(?:[*_]{1,2})?${STRONG_SOURCE_LABEL_SOURCE}\b[\t\p{Zs}]*(?:[*_]{1,2})?[\t\p{Zs}]*(?::|=|[-‐‑‒–—])[\t\p{Zs}]*[^\r\n]+`,
    "giu",
  );
  let match;
  while ((match = matcher.exec(text)) !== null) {
    const start = match.index + (match[0].startsWith("\n") ? 1 : 0);
    ranges.push({ start, end: match.index + match[0].length, kind: "source-label" });
  }
  return ranges;
}

function findWholeLinePathRanges(text) {
  const ranges = [];
  const matcher = /(?:[a-z]:[\\/]|\\\\|(?<![\p{L}\p{M}\p{N}\p{Pc}.:/\\])\/(?!\/)|(?:\.\.?|~)[\\/])[^\r\n]{0,2048}?\.[\p{L}\p{M}\p{N}]{1,16}(?=$|[\r\n?#\t\p{Zs})\]}>.,;:!?])/giu;
  let match;
  while ((match = matcher.exec(text)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length, kind: "source-path" });
  }
  return ranges;
}

function findSourceReferenceRanges(text) {
  const ranges = [
    ...findMarkdownCodeRanges(text),
    ...findHtmlMarkupRanges(text),
    ...findStrongLabeledQuotedRanges(text),
    ...findStrongLabeledSourceLineRanges(text),
    ...findWholeLinePathRanges(text),
  ];
  const referenceLabels = new Set();
  const markdownReferenceDefinition = /(?:^|\n)[\t\p{Zs}]*\[(?<label>[^\]\r\n]+)\]:[^\r\n]*/gu;
  let syntaxMatch;
  while ((syntaxMatch = markdownReferenceDefinition.exec(text)) !== null) {
    referenceLabels.add(syntaxMatch.groups.label.trim().toLocaleLowerCase("en-US"));
    ranges.push({ start: syntaxMatch.index, end: syntaxMatch.index + syntaxMatch[0].length });
  }

  const markdownInlineDestination = /\]\([^\r\n)]*\)/gu;
  while ((syntaxMatch = markdownInlineDestination.exec(text)) !== null) {
    ranges.push({ start: syntaxMatch.index + 2, end: syntaxMatch.index + syntaxMatch[0].length - 1 });
  }

  const markdownReferenceUse = /\[[^\]\r\n]*\](\[[^\]\r\n]*\])/gu;
  while ((syntaxMatch = markdownReferenceUse.exec(text)) !== null) {
    const identifierOffset = syntaxMatch[0].lastIndexOf(syntaxMatch[1]);
    ranges.push({
      start: syntaxMatch.index + identifierOffset,
      end: syntaxMatch.index + identifierOffset + syntaxMatch[1].length,
    });
  }

  const markdownShortcutOrCollapsedUse = /\[(?<label>[^\]\r\n]+)\](?<collapsed>\[\])?/gu;
  while ((syntaxMatch = markdownShortcutOrCollapsedUse.exec(text)) !== null) {
    const normalizedLabel = syntaxMatch.groups.label.trim().toLocaleLowerCase("en-US");
    if (!referenceLabels.has(normalizedLabel)) continue;
    const nextCharacter = text[syntaxMatch.index + syntaxMatch[0].length] ?? "";
    if (!syntaxMatch.groups.collapsed && (nextCharacter === "(" || nextCharacter === "[")) continue;
    const firstLabelEnd = syntaxMatch.index + syntaxMatch[0].indexOf("]") + 1;
    ranges.push({ start: syntaxMatch.index, end: firstLabelEnd });
  }

  const matcher = new RegExp(SOURCE_TOKEN_MATCHER.source, SOURCE_TOKEN_MATCHER.flags);
  let match;
  while ((match = matcher.exec(text)) !== null) {
    const markdownStart = match[0].lastIndexOf("](");
    const markdownDestinationOffset = markdownStart === -1 ? -1 : markdownStart + 2;
    for (const offset of sourceCandidateOffsets(match[0])) {
      if (markdownDestinationOffset !== -1 && offset < markdownDestinationOffset) continue;
      const candidate = trimSourceCandidate(match[0], offset);
      const absoluteStart = match.index + candidate.start;
      const precedingText = text.slice(Math.max(0, absoluteStart - 80), absoluteStart);
      const isMarkdownDestination = markdownDestinationOffset !== -1
        && candidate.start >= markdownDestinationOffset;
      if (!isMarkdownDestination && !isSourceReferenceCandidate(candidate.value, precedingText)) {
        continue;
      }
      ranges.push({ start: absoluteStart, end: match.index + candidate.end });
      break;
    }
  }
  return ranges;
}

function findNonInstructionMetadataRanges(text) {
  const ranges = [];
  const matcher = new RegExp(NON_INSTRUCTION_METADATA_LINE.source, NON_INSTRUCTION_METADATA_LINE.flags);
  let match;
  while ((match = matcher.exec(text)) !== null) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }
  return ranges;
}

function maskRanges(text, ranges) {
  const orderedRanges = [...ranges].sort((left, right) => left.start - right.start || left.end - right.end);
  let cursor = 0;
  let masked = "";
  for (const range of orderedRanges) {
    const start = Math.max(cursor, range.start);
    const end = Math.max(start, range.end);
    if (end <= cursor) continue;
    masked += text.slice(cursor, start);
    masked += text.slice(start, end).replace(/[^\r\n]/gu, " ");
    cursor = end;
  }
  return masked + text.slice(cursor);
}

const TERM_GAP_SOURCE = String.raw`(?:[\t\p{Zs}]+|[\t\p{Zs}]*\r?\n[\t\p{Zs}]*)`;
const POSITIONAL_INSTRUCTION_TARGET_BEFORE_SOURCE = String.raw`(?:^|\n)[\t\p{Zs}]*(?:ch|chain|insert|join|make|repeat|skip|work)\b[^\r\n]{0,80}\b(?:adjacent|as|at|center|centre|corresponding|each|every|fifth|first|following|fourth|in|into|last|marked|next|on|opposite|over|previous|remaining|same|second|sixth|third|to|under|with|within)[\t\p{Zs}]+`;
const FOLLOWING_TARGET_QUALIFIER_SOURCE = String.raw`(?:[\t\p{Zs}]+(?:made|worked|formed)|[\t\p{Zs}]+of[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:current|fifth|first|following|fourth|last|next|preceding|previous|same|second|sixth|third|\p{N}+(?:st|nd|rd|th)?)[\t\p{Zs}]+(?:rounds?|rows?|spaces?|st(?:s|itch(?:es)?)?))(?=[\t\p{Zs}]*(?:[.!?](?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])|[)}\]]+[\t\p{Zs}]*(?:[.!?](?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])|\r?\n|$)|[,;][\t\p{Zs}]*(?:(?:and|then)[\t\p{Zs}]+)?(?:begin|continue|fasten|finish|join|make|repeat|skip|turn|work)\b|\r?\n|$))`;

function termMatcher(term) {
  const escaped = escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE);
  if (ISOLATED_STITCH_TERMS.has(term)) {
    // A spelled-out stitch phrase is changed only in bounded, recognizable
    // instruction contexts. This avoids rewriting a supported phrase nested
    // in an unknown compound stitch name or ordinary prose.
    return new RegExp(
      `(^\\s*|[\\n*,:;/(\\[{\"'\\-]\\s*|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])\\p{N}+[\\t\\p{Zs}]+|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:work|make|place|add|crochet)[\\t\\p{Zs}]+(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten)[\\t\\p{Zs}]+|(?:^|\\n)[\\t\\p{Zs}]*(?:(?:[-*•·▪◦‣]|\\p{N}+[.)]|\\(\\p{N}+\\))[\\t\\p{Zs}]+)?(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|join|make|miss|place|repeat|skip|start|turn|use|using|work)[\\t\\p{Zs}]+|${POSITIONAL_INSTRUCTION_TARGET_BEFORE_SOURCE}|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:then|now)[\\t\\p{Zs}]+|(?:^|\\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}${INSTRUCTION_HEADING_SOURCE}[\\t\\p{Zs}]*(?:(?:\\*\\*|__)[\\t\\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\\t\\p{Zs}]*(?:(?:\\*\\*|__)[\\t\\p{Zs}]*)?(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten)[\\t\\p{Zs}]+)(${escaped})(?=$|\\s*[\\n,./;:!?\\)\\]}\"'\\-]|[\\t\\p{Zs}]+(?:and|or|then|in|into|across|around|at|before|behind|below|between|from|on|over|through|to|under|until|with|within)\\b|${FOLLOWING_TARGET_QUALIFIER_SOURCE})`,
      "giu",
    );
  }
  return new RegExp(`(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${escaped})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`, "giu");
}

function countedSpelledOutTermMatchers(entry) {
  const countSource = String.raw`(?:once|twice|thrice|(?:\p{N}+|[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)?)[\t\p{Zs}]+times?)`;
  const commandPrefix = String.raw`(?:^|\n)[\t\p{Zs}]*(?:(?:[-+*•·▪◦‣]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|join|make|miss|place|repeat|skip|start|turn|use|using|work)[\t\p{Zs}]+(?:(?:a|an|the|\p{N}+)[\t\p{Zs}]+)?`;
  const headingPrefix = String.raw`(?:^|\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}${INSTRUCTION_HEADING_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`;
  const bareLinePrefix = String.raw`(?:^|\n)[\t\p{Zs}]*`;
  return entry.terms
    .filter((term) => ISOLATED_STITCH_TERMS.has(term))
    .map((term) => {
      const source = escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE);
      return new RegExp(
        `(${commandPrefix}|${headingPrefix}|${bareLinePrefix})(${source})(?=[\\t\\p{Zs}]+${countSource}\\b)`,
        "giu",
      );
    });
}

function boundedPatternMatcher(source) {
  return new RegExp(
    `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
    "giu",
  );
}

function parenthesizedPairMatchers(entry) {
  const abbreviation = entry.terms
    .filter((term) => /^[a-z]+$/iu.test(term))
    .sort((left, right) => left.length - right.length)[0];
  if (!abbreviation) return [];

  const escapedAbbreviation = escapeRegex(abbreviation);
  const optionalWrappedGap = String.raw`[\t\p{Zs}]*(?:\r?\n[\t\p{Zs}]*)?`;
  return entry.terms
    .filter((term) => term !== abbreviation && ISOLATED_STITCH_TERMS.has(term))
    .flatMap((term) => {
      const escapedTerm = escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE);
      return [
        boundedPatternMatcher(`${escapedTerm}${optionalWrappedGap}\\([\\t\\p{Zs}]*${escapedAbbreviation}[\\t\\p{Zs}]*\\)`),
        boundedPatternMatcher(`${escapedAbbreviation}[\\t\\p{Zs}]*\\([\\t\\p{Zs}]*${escapedTerm}[\\t\\p{Zs}]*\\)`),
      ];
  });
}

function underscoredTermMatchers(entry) {
  return entry.terms.flatMap((term) => {
    const source = escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE);
    return ["***", "___", "**", "__", "*", "_"].map((marker) => {
      const wrapper = escapeRegex(marker);
      return new RegExp(
        `((?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])${wrapper}[\\t\\p{Zs}]*)(${source})(?=[\\t\\p{Zs}]*${wrapper}(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}]))`,
        "giu",
      );
    });
  });
}

function findProtectedPairContinuationRanges(text, protectedRanges) {
  const ranges = [];
  for (const entry of UK_TO_US_TERMS) {
    const abbreviation = entry.terms
      .filter((term) => /^[a-z]+$/iu.test(term))
      .sort((left, right) => left.length - right.length)[0];
    if (!abbreviation) continue;
    for (const term of entry.terms.filter((candidate) => candidate.includes(" "))) {
      const termSource = escapeRegex(term).replace(/ /g, "[\\t\\p{Zs}]+");
      const matcher = new RegExp(
        `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${termSource})[\\t\\p{Zs}]*\\r?\\n[\\t\\p{Zs}]*\\([\\t\\p{Zs}]*${escapeRegex(abbreviation)}[\\t\\p{Zs}]*\\)`,
        "giu",
      );
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const start = match.index + match[1].length;
        const termEnd = start + match[2].length;
        if (protectedRanges.some((range) => range.start < termEnd && range.end > start)) {
          ranges.push({ start, end: match.index + match[0].length });
        }
      }
    }
  }
  return ranges;
}

const UNSUPPORTED_DEFINITION_LABEL_SOURCE = String.raw`(?:(?:pattern|stitch|abbreviation|crochet)\s+keys?|(?:pattern|stitch|crochet)\s+abbreviations?|(?:uk|british)\s+(?:abbreviations?|abbrev\.?|terms?)|abbrev\.?|glossar(?:y|ies)|abbreviation\s+lists?|lists?\s+of\s+abbreviations?|keys?\s+to\s+abbreviations?|stitch\s+guides?|legends?|explanations?|terms?\s+used|special\s+(?:abbreviations?|terms?)|clusters?|labels?|abbreviations?|keys?|definitions?|variants?|versions?|motifs?|shells?|bobbles?|puffs?|popcorns?|sequences?|names?|terms?|custom\s+stitch(?:es)?|named\s+stitch(?:es)?|special\s+stitch(?:es)?)`;

const UNSUPPORTED_PARENTHETICAL_LEAD = new RegExp(
  String.raw`(?:\b${UNSUPPORTED_DEFINITION_LABEL_SOURCE}\s*(?:[:;=.]|[-‐‑‒–—])?\s*$|\b(?:half\s+double\s+crochet|single\s+crochet|triple\s+treble(?:\s+crochet)?|(?:front|back)(?:\s+|[-‐‑‒–—])post(?:\s+|[-‐‑‒–—])(?:double\s+treble(?:\s+crochet)?|half\s+treble(?:\s+crochet)?|treble(?:\s+crochet)?|double\s+crochet|dtr|htr|tr|dc)|(?:extended|linked|foundation|standing|reverse|crossed|relief|raised)(?:\s+|[-‐‑‒–—])(?:double\s+treble(?:\s+crochet)?|half\s+treble(?:\s+crochet)?|treble(?:\s+crochet)?|double\s+crochet|dtr|htr|tr|dc))\s*$)`,
  "iu",
);

const DEFINITION_HEADER_PREFIX_SOURCE = String.raw`[\t\p{Zs}]*(?:(?:>|[-+*]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`;
const DEFINITION_HEADER_SUFFIX_SOURCE = String.raw`(?:[\t\p{Zs}]*\((?:continued|cont\.?|uk|british)\))?`;
const DEFINITION_HEADER_WRAPPER_SOURCE = String.raw`(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE})?`;
const DEFINITION_LIST_PREFIX_SOURCE = String.raw`(?:(?:[>+\-*•·▪◦‣]|[\p{L}\p{N}]+[.)]|\([\p{L}\p{N}]+\))[\t\p{Zs}]+)?`;
const UNSUPPORTED_DEFINITION_HEADER = new RegExp(
  String.raw`^${DEFINITION_HEADER_PREFIX_SOURCE}${UNSUPPORTED_DEFINITION_LABEL_SOURCE}${DEFINITION_HEADER_SUFFIX_SOURCE}[\t\p{Zs}]*${DEFINITION_HEADER_WRAPPER_SOURCE}[\t\p{Zs}]*(?:[:=：＝.;→⇒➜]|[-‐‑‒–—―−﹣－])?[\t\p{Zs}]*${DEFINITION_HEADER_WRAPPER_SOURCE}[\t\p{Zs}]*$`,
  "iu",
);
const UNSUPPORTED_DEFINITION_INLINE_HEADER = new RegExp(
  String.raw`^${DEFINITION_HEADER_PREFIX_SOURCE}${UNSUPPORTED_DEFINITION_LABEL_SOURCE}${DEFINITION_HEADER_SUFFIX_SOURCE}[\t\p{Zs}]*${DEFINITION_HEADER_WRAPPER_SOURCE}[\t\p{Zs}]*(?:[:=：＝→⇒➜]|[-‐‑‒–—―−﹣－])[\t\p{Zs}]*${DEFINITION_HEADER_WRAPPER_SOURCE}[\t\p{Zs}]*`,
  "iu",
);
const UNSUPPORTED_DEFINITION_ENTRY = new RegExp(
  String.raw`^[\t\p{Zs}]*${DEFINITION_LIST_PREFIX_SOURCE}(?<key>[^\r\n:=：＝→⇒➜‐‑‒–—―−﹣－]+?)[\t\p{Zs}]*(?:(?<delimiter>[:=：＝→⇒➜])[\t\p{Zs}]*|[\t\p{Zs}]+(?<dashDelimiter>[-‐‑‒–—―−﹣－])[\t\p{Zs}]+|(?<wordDelimiter>means|stands?[\t\p{Zs}]+for|is)[\t\p{Zs}]+)(?<value>\S[^\r\n]*)$`,
  "iu",
);
const COMPACT_DEFINITION_ENTRY = new RegExp(
  String.raw`^[\t\p{Zs}]*${DEFINITION_LIST_PREFIX_SOURCE}(?<key>[^:：→⇒➜\r\n]+)(?:[-‐‑‒–—―−﹣－]|[→⇒➜])[\t\p{Zs}]*(?<value>[^:：→⇒➜\r\n]+)$`,
  "iu",
);
const INSTRUCTION_SECTION_KEY = /(?:\b(?:rows?|rounds?|rnds?|steps?)\b|^(?:(?:divide|fasten|make(?:[\t\p{Zs}]+up)?|continue|decrease|increase|work|join|cast|commence|begin|beginning|start|finish|shape|sew|assemble|attach|complete|break|cut)\b|to[\t\p{Zs}]+(?:begin|start|finish|complete)\b|(?:next|following|final|first|second)(?:[\t\p{Zs}]+|[-‐‑‒–—])(?:section|part|row|round|side)\b|foundation[\t\p{Zs}]+(?:chain|row|round)\b|armholes?(?:[\t\p{Zs}]+shaping)?\b|raglan[\t\p{Zs}]+shaping\b|instructions?|pattern|repeat|gauge|tension|sizes?|notes?|materials?|measurements?|finished(?:\s+size)?|directions?|assembly|finishing|yarn|needles?|hooks?|body|bodice|front|back|sleeves?|cuffs?|collars?|neck(?:line|band)?|shoulders?|yoke|hem|border|edging|bands?|button[\t\p{Zs}]+band|ribb?ing|waist(?:band)?|skirt|crown|brim|hood|cape|pockets?|straps?|handles?|closures?|lining|thumbs?|fingers?|heel|toe|gusset|instep|sole|flaps?|legs?|feet|foot|arms?|hands?|head|ears?|tail|wings?|beak|muzzle|snout|mane|panels?|pieces?|sides?|top|bottom|left|right|main|chart|motif[\t\p{Zs}]+[\p{Lu}\p{N}]\b|stitch\s+pattern|skill\s+level|difficulty|supplies?|notions?|colou?rs?|sections?|parts?)\b)/iu;
const NAMED_STITCH_DEFINITION_KEY = /(?:stitch|cluster|motif|shell|bobble|puff|popcorn|fan|picot|sequence|variant)\s*$/iu;
const SPECIAL_STITCH_DEFINITION_HEADER = new RegExp(
  String.raw`^${DEFINITION_HEADER_PREFIX_SOURCE}(?:(?:special|custom|named)[\t\p{Zs}]+stitches?|stitch[\t\p{Zs}]+guides?|motifs?)[\t\p{Zs}]*${DEFINITION_HEADER_WRAPPER_SOURCE}[\t\p{Zs}]*(?:[:=：＝.;→⇒➜]|[-‐‑‒–—―−﹣－])?[\t\p{Zs}]*${DEFINITION_HEADER_WRAPPER_SOURCE}[\t\p{Zs}]*$`,
  "iu",
);
const NAMED_STITCH_LABEL_ONLY = new RegExp(
  String.raw`^[\t\p{Zs}]*${DEFINITION_LIST_PREFIX_SOURCE}(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?(?<key>[^\r\n:=：＝→⇒➜]+?)[\t\p{Zs}]*(?:[:：]|[-‐‑‒–—―−﹣－])?[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE})?[\t\p{Zs}]*$`,
  "iu",
);
const SUPPORTED_DEFINITION_KEY_ATOM_SOURCE = [...new Set(
  UK_TO_US_TERMS.flatMap(({ terms }) => terms),
)]
  .sort((left, right) => right.length - left.length)
  .map((term) => escapeRegex(term).replace(/ /g, String.raw`[\t\p{Zs}]+`))
  .join("|");
const SUPPORTED_DEFINITION_KEY_SOURCE = String.raw`(?:(?:\*\*[\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*\*\*|__[\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*__|\x60[\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*\x60|["'“‘][\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*["'”’]|\([\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*\)|\[[\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*\]|\{[\t\p{Zs}]*(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})[\t\p{Zs}]*\}|(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE}))(?:[\t\p{Zs}]*\((?:custom|local|pattern|source)\))?)`;
const HEADER_DELIMITERLESS_DEFINITION_ENTRY = new RegExp(
  String.raw`^[\t\p{Zs}]*${DEFINITION_LIST_PREFIX_SOURCE}(?<key>${SUPPORTED_DEFINITION_KEY_SOURCE})[\t\p{Zs}]+(?<value>\S[^\r\n]*)$`,
  "iu",
);
const EXPLICIT_SUPPORTED_DEFINITION_BODY_SOURCE = String.raw`${DEFINITION_LIST_PREFIX_SOURCE}(?<key>${SUPPORTED_DEFINITION_KEY_SOURCE})(?:[\t\p{Zs}]*(?<delimiter>[:=：＝→⇒➜])[\t\p{Zs}]*|(?:[\t\p{Zs}]+(?<dashDelimiter>[-‐‑‒–—―−﹣－])[\t\p{Zs}]*|[\t\p{Zs}]*(?<compactDashDelimiter>[-‐‑‒–—―−﹣－])[\t\p{Zs}]+)|[\t\p{Zs}]+(?<wordDelimiter>means|stands?[\t\p{Zs}]+for|is)[\t\p{Zs}]+)(?<valueStart>\S)`;
const EXPLICIT_SUPPORTED_DEFINITION_PREFIX = new RegExp(
  String.raw`^[\t\p{Zs}]*${EXPLICIT_SUPPORTED_DEFINITION_BODY_SOURCE}`,
  "iu",
);
const EXPLICIT_SUPPORTED_DEFINITION_FINDER = new RegExp(
  String.raw`(?<boundary>^|[;,|]|[\t\p{Zs}]+/[\t\p{Zs}]+)[\t\p{Zs}]*${EXPLICIT_SUPPORTED_DEFINITION_BODY_SOURCE}`,
  "giu",
);
const SUPPORTED_NORMALIZED_DEFINITION_KEYS = new Set(
  UK_TO_US_TERMS.flatMap(({ terms }) => terms.map((term) => term.toLocaleLowerCase("en-US"))),
);
const SUPPORTED_DEFINITION_KEY_TERM = new RegExp(
  String.raw`(?:^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:${SUPPORTED_DEFINITION_KEY_ATOM_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);

function isCompoundSupportedDefinitionKey(value) {
  const normalized = normalizeDefinitionKey(value);
  return !SUPPORTED_NORMALIZED_DEFINITION_KEYS.has(normalized)
    && SUPPORTED_DEFINITION_KEY_TERM.test(normalized);
}

const FORMATTED_DEFINITION_LEAD = new RegExp(
  String.raw`^(?<prefix>[\t\p{Zs}]*(?:(?:>|[-+*]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?)(?<wrapper>${MARKDOWN_EMPHASIS_WRAPPER_SOURCE})(?<inner>[^\r\n]*?)\k<wrapper>(?<rest>.*)$`,
  "u",
);

function maskFormattedDefinitionLead(value) {
  const match = value.match(FORMATTED_DEFINITION_LEAD);
  if (!match) return value;
  const { prefix, wrapper, inner, rest } = match.groups;
  return `${prefix}${" ".repeat(wrapper.length)}${inner}${" ".repeat(wrapper.length)}${rest}`;
}

function isDefinitionShapedEntry(match, preferNamedStitches = false) {
  const key = match.groups.key.trim();
  const classificationKey = key.replace(
    /[\t\p{Zs}]*(?:\((?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side)\)|\[(?:rs|ws)\]|,[\t\p{Zs}]*(?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side))[\t\p{Zs}]*$/iu,
    "",
  );
  if (NAMED_STITCH_DEFINITION_KEY.test(classificationKey)) return true;
  if (preferNamedStitches && /^motif[\t\p{Zs}]+[\p{L}\p{M}\p{N}]+$/iu.test(classificationKey)) return true;
  if (preferNamedStitches && /(?:rows?|rounds?)\s*$/iu.test(classificationKey)) return true;
  if (isCompoundSupportedDefinitionKey(classificationKey) && match.groups.value?.trim()) return true;
  if (INSTRUCTION_SECTION_KEY.test(classificationKey)) return false;
  if (match.groups.delimiter === "=" || match.groups.wordDelimiter) return true;
  return true;
}

function matchDefinitionEntry(text) {
  const normalized = maskFormattedDefinitionLead(text);
  return normalized.match(UNSUPPORTED_DEFINITION_ENTRY)
    ?? normalized.match(COMPACT_DEFINITION_ENTRY);
}

function matchHeaderDefinitionEntry(text) {
  const normalized = maskFormattedDefinitionLead(text);
  return matchDefinitionEntry(normalized)
    ?? normalized.match(HEADER_DELIMITERLESS_DEFINITION_ENTRY);
}

function normalizeDefinitionKey(value) {
  let normalized = value
    .trim()
    .replace(/[\t\p{Zs}]*\((?:custom|local|pattern|source)\)[\t\p{Zs}]*$/iu, "")
    .trim();
  const isMarkdownWrappedKey = (
    (normalized.startsWith("**") && normalized.endsWith("**"))
    || (normalized.startsWith("__") && normalized.endsWith("__"))
    || (normalized.startsWith("`") && normalized.endsWith("`"))
  );
  if (isMarkdownWrappedKey) {
    const wrapperLength = normalized.startsWith("`") ? 1 : 2;
    normalized = normalized.slice(wrapperLength, -wrapperLength).trim();
  }
  const isQuoteWrappedKey = (
    (normalized.startsWith("\"") && normalized.endsWith("\""))
    || (normalized.startsWith("'") && normalized.endsWith("'"))
    || (normalized.startsWith("“") && normalized.endsWith("”"))
    || (normalized.startsWith("‘") && normalized.endsWith("’"))
  );
  if (isQuoteWrappedKey) normalized = normalized.slice(1, -1).trim();
  const isWrappedKey = (
    (normalized.startsWith("(") && normalized.endsWith(")"))
    || (normalized.startsWith("[") && normalized.endsWith("]"))
    || (normalized.startsWith("{") && normalized.endsWith("}"))
  );
  if (isWrappedKey) normalized = normalized.slice(1, -1).trim();
  return normalized
    .replace(/[\t\p{Zs}]+/gu, " ")
    .toLocaleLowerCase("en-US");
}

function normalizeDefinitionValue(value) {
  return value
    .trim()
    .replace(/[.!?]+$/u, "")
    .replace(/[\t\p{Zs}]+/gu, " ")
    .toLocaleLowerCase("en-US");
}

const DEFINITION_KEY_SEPARATOR = /[\t\p{Zs}]*(?:[/／,&＆+＋|｜，、]|\bor\b|\band\b)[\t\p{Zs}]*/iu;

function splitDefinitionKeys(value) {
  let group = value.trim();
  for (const [opening, closing] of [
    ["**", "**"],
    ["__", "__"],
    ["`", "`"],
    ["\"", "\""],
    ["'", "'"],
    ["“", "”"],
    ["‘", "’"],
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ]) {
    if (!group.startsWith(opening) || !group.endsWith(closing)) continue;
    const inner = group.slice(opening.length, -closing.length);
    const hasInnerWrapper = inner.includes(opening)
      || (closing !== opening && inner.includes(closing));
    if (!hasInnerWrapper && DEFINITION_KEY_SEPARATOR.test(inner)) {
      group = inner.trim();
    }
    break;
  }
  return group
    .split(DEFINITION_KEY_SEPARATOR)
    .map((key) => key.trim())
    .filter(Boolean);
}

function addCustomDefinitionLabel(labels, rawKey, rawValue) {
  const normalizedKey = normalizeDefinitionKey(rawKey);
  const normalizedValue = normalizeDefinitionValue(rawValue);
  for (const entry of UK_TO_US_TERMS) {
    if (!entry.terms.some((term) => term.toLocaleLowerCase("en-US") === normalizedKey)) {
      continue;
    }
    const isStandardDefinition = entry.terms.some((candidate) => {
      const normalizedCandidate = candidate.toLocaleLowerCase("en-US");
      if (normalizedCandidate === normalizedValue) return true;
      const candidateSource = escapeRegex(normalizedCandidate);
      return new RegExp(
        `^(?:(?:uk|british)[\\t\\p{Zs}]+)?${candidateSource}(?:[\\t\\p{Zs}]+(?:stitch|term)|[\\t\\p{Zs}]*\\((?:uk|british)(?:[\\t\\p{Zs}]+term)?\\))$`,
        "iu",
      ).test(normalizedValue);
    });
    if (!isStandardDefinition) labels.add(entry.label);
  }
}

function isNumericTensionDefinitionValue(value) {
  return /^[\t\p{Zs}]*\p{N}+(?:[.,]\p{N}+)?[\t\p{Zs}]*(?:st(?:s|itch(?:es)?)?|rows?|double[\t\p{Zs}]+treble(?:[\t\p{Zs}]+crochet)?|dtr|half[\t\p{Zs}]+treble(?:[\t\p{Zs}]+crochet)?|htr|treble(?:[\t\p{Zs}]+crochet)?|tr|double[\t\p{Zs}]+crochet|dc|cm|mm|in(?:ch(?:es)?)?)\b/iu.test(value);
}

const PASSIVE_INSTRUCTION_VALUE_SOURCE = String.raw`(?:(?:(?:always|also|both|clearly|commonly|frequently|generally|merely|never|normally|not|often|rarely|simply|sometimes|then|typically|usually)[\t\p{Zs}]+|to[\t\p{Zs}]+be[\t\p{Zs}]+))*(?:worked|made|placed|inserted|crocheted|joined|skipped|missed|repeated|formed|completed|finished|turned)\b`;
const PASSIVE_INSTRUCTION_VALUE = new RegExp(`^${PASSIVE_INSTRUCTION_VALUE_SOURCE}`, "iu");
const SUPPORTED_TERM_SEQUENCE_ATOM_SOURCE = [...new Set(UK_TO_US_TERMS.flatMap(({ terms }) => terms))]
    .sort((left, right) => right.length - left.length)
    .map((term) => escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE))
    .join("|");
const SUPPORTED_TERM_SEQUENCE_PREFIX = new RegExp(
  `^(?<term>${SUPPORTED_TERM_SEQUENCE_ATOM_SOURCE})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
  "iu",
);
const AMBIGUOUS_PROSE_PREPOSITION_BEFORE = new RegExp(
  String.raw`\b(?:above|across|after|along|around|as|at|atop|before|behind|below|beneath|beside|between|from|in|inside|into|near|of|on|opposite|outside|over|through|to|toward|towards|under|until|upon|with|within)[\t\p{Zs}]+(?:(?:${SUPPORTED_TERM_SEQUENCE_ATOM_SOURCE})[\t\p{Zs}]*(?:(?:,[\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|(?:and|or)[\t\p{Zs}]+))?)*$`,
  "iu",
);
const AMBIGUOUS_PROSE_TERM_LIST_BEFORE = new RegExp(
  String.raw`(?<contextWord>\p{L}[\p{L}\p{M}'’-]*)[\t\p{Zs}]+(?<precedingTerms>(?:(?:${SUPPORTED_TERM_SEQUENCE_ATOM_SOURCE})[\t\p{Zs}]*(?:[,，、/／&＆+＋|｜][\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|(?:and|or)[\t\p{Zs}]+))*)$`,
  "iu",
);
const FOLLOWING_SUPPORTED_TERM_LIST_ITEM = new RegExp(
  String.raw`^[\t\p{Zs}]*(?:[,，、/／&＆+＋|｜][\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|(?:and|or)[\t\p{Zs}]+)(?:${SUPPORTED_TERM_SEQUENCE_ATOM_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);
const AMBIGUOUS_DESCRIPTIVE_LIST_BEFORE = new RegExp(
  String.raw`(?:^|\n)[\t\p{Zs}]*(?:for[\t\p{Zs}]+example|(?:the[\t\p{Zs}]+)?examples?(?:[\t\p{Zs}]+(?:are|include))?|list|(?:a|the)[\t\p{Zs}]+note)[\t\p{Zs}]*(?::|=|[-‐‑‒–—―−]|\(|\[)[\t\p{Zs}]*(?:(?:${SUPPORTED_TERM_SEQUENCE_ATOM_SOURCE})[\t\p{Zs}]*(?:[,，、/／&＆+＋|｜][\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|(?:and|or)[\t\p{Zs}]+))*$`,
  "iu",
);

function isAmbiguousTermProseContinuation(before, after, matchedText) {
  if (AMBIGUOUS_DESCRIPTIVE_LIST_BEFORE.test(before)) return true;
  const wrapperStart = before.match(/[([{][\t\p{Zs}]*$/u);
  const contextualBefore = wrapperStart
    ? before.slice(0, wrapperStart.index)
    : before;
  const wrapperContextWord = contextualBefore.match(/(?<word>\p{L}[\p{L}\p{M}'’-]*)[\t\p{Zs}]*$/u)?.groups.word;
  if (
    wrapperStart
    && wrapperContextWord
    && !ALLOWED_PRECEDING_INSTRUCTION_WORDS.has(wrapperContextWord.toLocaleLowerCase("en-US"))
  ) return true;
  const ambiguousPrepositionBefore = AMBIGUOUS_PROSE_PREPOSITION_BEFORE.test(contextualBefore);
  const listContext = contextualBefore.match(AMBIGUOUS_PROSE_TERM_LIST_BEFORE)?.groups;
  const listContextWord = listContext?.contextWord;
  const ambiguousProseListBefore = Boolean(
    listContextWord
    && !ALLOWED_PRECEDING_INSTRUCTION_WORDS.has(listContextWord.toLocaleLowerCase("en-US"))
    && (listContext.precedingTerms || FOLLOWING_SUPPORTED_TERM_LIST_ITEM.test(after)),
  );
  let remainder = after.slice(0, 240);
  while (true) {
    const connector = remainder.match(/^[\t\p{Zs}]*(?:[,，、/／&＆+＋|｜][\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|(?:and|or)[\t\p{Zs}]+)/iu);
    if (!connector) break;
    const afterConnector = remainder.slice(connector[0].length);
    const term = afterConnector.match(SUPPORTED_TERM_SEQUENCE_PREFIX);
    if (!term) break;
    remainder = afterConnector.slice(term[0].length);
  }

  const parentheticalAside = remainder.match(/^[\t\p{Zs}]*\([^()\r\n]{1,80}\)[\t\p{Zs}]*/u);
  const commaAside = remainder.match(/^[\t\p{Zs}]*,[\t\p{Zs}]*[^,\r\n]{1,80},[\t\p{Zs}]*/u);
  if (parentheticalAside) remainder = remainder.slice(parentheticalAside[0].length);
  else if (commaAside) remainder = remainder.slice(commaAside[0].length);

  const predicate = remainder.match(/^[\t\p{Zs}]*(?:(?:always|also|both|clearly|commonly|frequently|generally|merely|never|normally|often|rarely|simply|sometimes|typically|usually)[\t\p{Zs}]+)?(?<verb>appear|appears|are|can|come|comes|could|denote|denotes|describe|describes|had|has|have|is|look|looks|may|mean|means|meant|might|occur|occurs|refer|refers|remain|remains|should|was|were|will|would)\b[\t\p{Zs}]*/iu);
  if (!predicate) {
    if (ambiguousProseListBefore) return true;
    const countedContinuation = remainder.match(
      /^[\t\p{Zs}]*(?:once|twice|thrice|(?:\p{N}+|[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)?)[\t\p{Zs}]+times?)\b/iu,
    );
    if (countedContinuation) {
      return isAmbiguousTermProseContinuation(
        before,
        remainder.slice(countedContinuation[0].length),
        matchedText,
      );
    }
    if (
      FOLLOWING_INSTRUCTION_CONTEXT.test(remainder)
      || FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(remainder)
      || FOLLOWING_SUPPORTED_ABBREVIATION.test(remainder)
      || UPPERCASE_COMMAND_CONTINUATION.test(remainder)
    ) return false;
    if (ambiguousPrepositionBefore) return true;
    if (!/^[\t\p{Zs}]*\p{L}/u.test(remainder)) return false;
    return matchedText.toLocaleLowerCase("en-US") !== "tension";
  }
  const verb = predicate.groups.verb.toLocaleLowerCase("en-US");
  if ((verb === "remain" || verb === "remains") && /\buntil[\t\p{Zs}]+$/iu.test(before)) {
    return false;
  }
  const predicateValue = remainder.slice(predicate[0].length);
  if (["are", "is", "was", "were"].includes(verb) && PASSIVE_INSTRUCTION_VALUE.test(predicateValue)) {
    return false;
  }
  return true;
}

function findExplicitSupportedDefinitionRanges(text, multilineDefinitionRanges = []) {
  const ranges = [];
  const protectedRanges = [
    ...findSourceReferenceRanges(text),
    ...findNonInstructionMetadataRanges(text),
  ];
  for (const line of splitTextLines(text)) {
    const normalizedLine = maskFormattedDefinitionLead(line.content);
    const header = normalizedLine.match(UNSUPPORTED_DEFINITION_INLINE_HEADER);
    const hasInlineDefinitionHeader = Boolean(header);
    const entries = [];
    const seenStarts = new Set();
    const addMatch = (match, baseOffset, separator) => {
      if (!match) return;
      const entryStart = baseOffset + (match.groups.boundary ? match.groups.boundary.length : 0);
      if (seenStarts.has(entryStart)) return;
      seenStarts.add(entryStart);
      entries.push({
        entryStart,
        separator,
        key: match.groups.key,
        wordDelimiter: match.groups.wordDelimiter,
        hasInlineDefinitionHeader,
        valueStart: baseOffset + match[0].length - match.groups.valueStart.length,
      });
    };

    const finder = new RegExp(
      EXPLICIT_SUPPORTED_DEFINITION_FINDER.source,
      EXPLICIT_SUPPORTED_DEFINITION_FINDER.flags,
    );
    let match;
    while ((match = finder.exec(normalizedLine)) !== null) {
      const boundary = match.groups.boundary;
      addMatch(match, match.index, boundary ? match.index : -1);
    }

    if (header) {
      const remainderOffset = header[0].length;
      const headerEntry = normalizedLine.slice(remainderOffset).match(EXPLICIT_SUPPORTED_DEFINITION_PREFIX);
      addMatch(headerEntry, remainderOffset, -1);
    }

    entries.sort((left, right) => left.entryStart - right.entryStart);
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const semicolon = line.content.indexOf(";", entry.valueStart);
      const nextEntrySeparator = entries[index + 1]?.separator ?? -1;
      const boundaries = [line.content.length];
      if (semicolon !== -1) boundaries.push(semicolon);
      if (nextEntrySeparator >= entry.valueStart) boundaries.push(nextEntrySeparator);
      const end = Math.min(...boundaries);
      const value = line.content.slice(entry.valueStart, end).trim();
      if (!value) continue;
      if (
        entry.wordDelimiter?.toLocaleLowerCase("en-US") === "is"
        && PASSIVE_INSTRUCTION_VALUE.test(value)
      ) continue;
      if (normalizeDefinitionKey(entry.key) === "tension" && isNumericTensionDefinitionValue(value)) {
        continue;
      }
      const absoluteStart = line.start + entry.entryStart;
      const absoluteEnd = line.start + end;
      const absoluteValueStart = line.start + entry.valueStart;
      if (
        entry.wordDelimiter?.toLocaleLowerCase("en-US") === "is"
        && !entry.hasInlineDefinitionHeader
        && !multilineDefinitionRanges.some((range) => (
          range.start <= absoluteStart && range.end >= absoluteEnd
        ))
      ) continue;
      if (protectedRanges.some((range) => (
        range.start < absoluteEnd
        && range.end > absoluteStart
        && (range.kind !== "markdown-code" || range.end > absoluteValueStart)
      ))) {
        continue;
      }
      ranges.push({
        start: absoluteStart,
        end: absoluteEnd,
        definitionKey: entry.key,
        definitionValue: value,
      });
    }
  }
  return ranges;
}

function findGroupedSupportedDefinitionRanges(text, multilineDefinitionRanges = []) {
  const ranges = [];
  const protectedRanges = [
    ...findSourceReferenceRanges(text),
    ...findNonInstructionMetadataRanges(text),
  ];
  for (const line of splitTextLines(text)) {
    let segmentStart = 0;
    while (segmentStart <= line.content.length) {
      const separatorMatch = /;/u.exec(line.content.slice(segmentStart));
      const segmentEnd = separatorMatch
        ? segmentStart + separatorMatch.index
        : line.content.length;
      let entryStart = segmentStart;
      let entryText = maskFormattedDefinitionLead(line.content.slice(entryStart, segmentEnd));
      const header = entryText.match(UNSUPPORTED_DEFINITION_INLINE_HEADER);
      if (header) {
        entryStart += header[0].length;
        entryText = line.content.slice(entryStart, segmentEnd);
      }
      const listPrefix = entryText.match(new RegExp(
        String.raw`^[\t\p{Zs}]*${DEFINITION_LIST_PREFIX_SOURCE}`,
        "iu",
      ));
      if (listPrefix?.[0]) {
        entryStart += listPrefix[0].length;
        entryText = line.content.slice(entryStart, segmentEnd);
      }
      const delimiter = entryText.match(/(?:[\t\p{Zs}]*(?<delimiter>[:=：＝→⇒➜])[\t\p{Zs}]*|[\t\p{Zs}]*(?<dashDelimiter>[-‐‑‒–—―−﹣－])[\t\p{Zs}]*|[\t\p{Zs}]+(?<wordDelimiter>means|stands?[\t\p{Zs}]+for|is)[\t\p{Zs}]+)/iu);
      if (delimiter) {
        const rawKeys = entryText.slice(0, delimiter.index).trim();
        const definitionKeys = splitDefinitionKeys(rawKeys);
        const normalizedKeys = definitionKeys.map(normalizeDefinitionKey);
        const definitionValue = entryText.slice(delimiter.index + delimiter[0].length).trim();
        const absoluteStart = line.start + entryStart;
        const absoluteEnd = line.start + segmentEnd;
        const absoluteValueStart = line.start + entryStart + delimiter.index + delimiter[0].length;
        if (
          definitionKeys.length >= 2
          && normalizedKeys.every((key, keyIndex) => (
            SUPPORTED_NORMALIZED_DEFINITION_KEYS.has(key)
            || isCompoundSupportedDefinitionKey(definitionKeys[keyIndex])
          ))
          && definitionValue
          && !(
            delimiter.groups.wordDelimiter?.toLocaleLowerCase("en-US") === "is"
            && !header
            && !multilineDefinitionRanges.some((range) => (
              range.start <= absoluteStart && range.end >= absoluteEnd
            ))
          )
          && !(
            delimiter.groups.wordDelimiter?.toLocaleLowerCase("en-US") === "is"
            && PASSIVE_INSTRUCTION_VALUE.test(definitionValue)
          )
          && !protectedRanges.some((range) => (
            range.start < absoluteEnd
            && range.end > absoluteStart
            && (range.kind !== "markdown-code" || range.end > absoluteValueStart)
          ))
        ) {
          ranges.push({
            start: absoluteStart,
            end: absoluteEnd,
            definitionKeys,
            definitionValue,
          });
        }
      }
      if (!separatorMatch) break;
      segmentStart = segmentEnd + 1;
    }
  }
  return ranges;
}

function splitTextLines(text) {
  const lines = [];
  let start = 0;
  while (start <= text.length) {
    const newline = text.indexOf("\n", start);
    const next = newline === -1 ? text.length : newline + 1;
    const contentEnd = newline === -1
      ? text.length
      : (text[newline - 1] === "\r" ? newline - 1 : newline);
    lines.push({ start, end: contentEnd, next, content: text.slice(start, contentEnd) });
    if (newline === -1) break;
    start = next;
  }
  return lines;
}

function markdownTableCells(content) {
  if (!content.includes("|")) return [];
  const cells = content.split("|");
  if (cells[0].trim() === "") cells.shift();
  if (cells.at(-1)?.trim() === "") cells.pop();
  return cells.map((cell) => cell.trim());
}

function findMarkdownDefinitionTableRanges(text) {
  const ranges = [];
  const lines = splitTextLines(text);
  const protectedRanges = [
    ...findSourceReferenceRanges(text),
    ...findNonInstructionMetadataRanges(text),
  ].filter((range) => range.kind !== "markdown-code");
  const isHeaderCell = (value) => /^(?:(?:uk|british)[\t\p{Zs}]+)?(?:abbreviations?|abbrev\.?|terms?|keys?|symbols?)$/iu.test(
    value.replace(/^(?:\*\*|__|`)|(?:\*\*|__|`)$/gu, "").trim(),
  );
  const isSeparatorCell = (value) => /^:?-{3,}:?$/u.test(value);

  for (let index = 0; index + 1 < lines.length; index += 1) {
    const headerCells = markdownTableCells(lines[index].content);
    const separatorCells = markdownTableCells(lines[index + 1].content);
    const keyColumnIndex = headerCells.findIndex(isHeaderCell);
    if (
      headerCells.length < 2
      || keyColumnIndex === -1
      || separatorCells.length < 2
      || !separatorCells.every(isSeparatorCell)
    ) continue;
    const valueColumnIndex = keyColumnIndex === 0 ? 1 : 0;

    let rowIndex = index + 2;
    for (; rowIndex < lines.length; rowIndex += 1) {
      const row = lines[rowIndex];
      const cells = markdownTableCells(row.content);
      if (cells.length <= Math.max(keyColumnIndex, valueColumnIndex)) break;
      const definitionKey = cells[keyColumnIndex];
      const definitionValue = cells[valueColumnIndex];
      const definitionKeys = splitDefinitionKeys(definitionKey);
      if (
        definitionKeys.length === 0
        || !definitionKeys.every((key) => (
          SUPPORTED_NORMALIZED_DEFINITION_KEYS.has(normalizeDefinitionKey(key))
          || isCompoundSupportedDefinitionKey(key)
        ))
        || !definitionValue
        || cells.every(isSeparatorCell)
        || protectedRanges.some((range) => range.start < row.end && range.end > row.start)
      ) continue;
      ranges.push({
        start: row.start,
        end: row.end,
        definitionKeys,
        definitionValue,
      });
    }
    index = Math.max(index, rowIndex - 1);
  }
  return ranges;
}

function namedStitchLabelClassification(content) {
  const match = maskFormattedDefinitionLead(content).match(NAMED_STITCH_LABEL_ONLY);
  if (!match) return null;
  const key = normalizeStructuralHeadingText(match.groups.key);
  const classificationKey = key.replace(
    /[\t\p{Zs}]*(?:\((?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side)\)|\[(?:rs|ws)\]|,[\t\p{Zs}]*(?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side))[\t\p{Zs}]*$/iu,
    "",
  );
  return { key, classificationKey };
}

function isExplicitSpecialDefinitionLabel(content) {
  const label = namedStitchLabelClassification(content);
  return Boolean(label && (
    (
      NAMED_STITCH_DEFINITION_KEY.test(label.classificationKey)
      && !/(?:\b(?:dtr|htr|dc|tr)\b|,|\p{N})/iu.test(label.classificationKey)
    )
    || /^motif[\t\p{Zs}]+[\p{L}\p{M}\p{N}]+$/iu.test(label.classificationKey)
    || /^(?:foundation|setup|set[-‐‑‒–—]up)[\t\p{Zs}]+(?:row|round)$/iu.test(label.classificationKey)
  ));
}

function isNamedStitchLabelOnly(content) {
  const label = namedStitchLabelClassification(content);
  if (!label) return false;
  if (isExplicitSpecialDefinitionLabel(content)) return true;
  if (isStrongMainInstructionLine(content)) return false;
  return Boolean(label.key)
    && !INSTRUCTION_SECTION_KEY.test(label.key)
    && !isStructuralDefinitionBoundary(content);
}

function isStrongMainInstructionLine(content) {
  const instruction = content.replace(
    /^[\t\p{Zs}]*(?:(?:>|[-+*•·▪◦‣]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?(?:(?:\*\*|__)[\t\p{Zs}]*)?/u,
    "",
  );
  if (/^(?:add|begin|ch(?:ain)?|commence|complete|continue|crochet|decrease|finish|increase|join|make|miss|place|repeat|skip|start|turn|use|using|work)\b/iu.test(instruction)) {
    return true;
  }
  const abbreviation = instruction.match(/^(?:dtr|htr|dc|tr)\b/iu);
  if (!abbreviation) return false;
  const after = instruction.slice(abbreviation[0].length);
  return /^[\t\p{Zs}]*[.!?]?[\t\p{Zs}]*$/u.test(after)
    || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
    || FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(after)
    || FOLLOWING_SUPPORTED_ABBREVIATION.test(after);
}

function normalizeStructuralHeadingText(content) {
  let normalized = content.trim().replace(
    /^(?:(?:>|[-+*]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?/u,
    "",
  ).trim();
  for (let pass = 0; pass < 2; pass += 1) {
    normalized = normalized
      .replace(/(?:[:=：＝.;]|[-‐‑‒–—―−﹣－])[\t\p{Zs}]*$/u, "")
      .trim();
    if (
      (normalized.startsWith("**") && normalized.endsWith("**"))
      || (normalized.startsWith("__") && normalized.endsWith("__"))
    ) {
      normalized = normalized.slice(2, -2).trim();
    }
  }
  return normalized;
}

function isStructuralDefinitionBoundary(content) {
  const trimmed = normalizeStructuralHeadingText(content);
  if (!trimmed) return true;
  if (/^(?:body|main(?:[\t\p{Zs}]+pattern)?|pattern(?:[\t\p{Zs}]+instructions?)?|instructions?|directions?|notes?|gauge|tension|materials?|sizes?|measurements?|border|edging|begin[\t\p{Zs}]+here|start(?:ing[\t\p{Zs}]+row|[\t\p{Zs}]+here)?|to[\t\p{Zs}]+begin|beginning|front|back|sleeves?|cuffs?|collars?|neckband|button(?:hole)?[\t\p{Zs}]+band|front[\t\p{Zs}]+band|sleeve[\t\p{Zs}]+top|underarm|raglan(?:[\t\p{Zs}]+shaping)?|back[\t\p{Zs}]+neck|neck[\t\p{Zs}]+edging|shoulder[\t\p{Zs}]+shaping|pocket[\t\p{Zs}]+lining|make[\t\p{Zs}]+up|(?:left|right|upper|lower)[\t\p{Zs}]+(?:front|back|sleeves?|side|panel)|yoke|skirt|crown|brim|hood|cape|assembly|finishing|next[\t\p{Zs}]+section)$/iu.test(trimmed)) {
    return true;
  }
  if (EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(content)) return true;
  const match = matchDefinitionEntry(content);
  return Boolean(match && !isDefinitionShapedEntry(match, true));
}

function isNamedBodyMainSectionBoundary(content) {
  const normalized = normalizeStructuralHeadingText(content);
  return /^(?:begin[\t\p{Zs}]+here|start[\t\p{Zs}]+here|to[\t\p{Zs}]+begin|beginning|setup[\t\p{Zs}]+row|continue|(?:chart|pattern|section|part)(?:[\t\p{Zs}]+[\p{L}\p{M}\p{N}]+)?)(?:[\t\p{Zs}]*(?::|=|[-‐‑‒–—])[\t\p{Zs}]*.*)?$/iu.test(normalized);
}

const NAMED_DEFINITION_MULTIROW_VALUE = new RegExp(
  String.raw`(?:\b(?:over|across|through|for|during)\b[^\r\n]{0,48}\b(?:rows|rounds)\b|\brepeat\b[^\r\n]{0,64}\b(?:rows|rounds)\b|\brepeat\b[^\r\n]{0,48}\b(?:row|round)\b[^\r\n]{0,24}\b(?:twice|\p{N}+[\t\p{Zs}]+times?)\b|\b(?:\p{N}+|[\p{L}\p{M}]+)(?:[\t\p{Zs}]*[-‐‑‒–—][\t\p{Zs}]*|[\t\p{Zs}]+)(?:rows?|rounds?)(?:[\t\p{Zs}]*[-‐‑‒–—][\t\p{Zs}]*|[\t\p{Zs}]+)repeat\b)`,
  "iu",
);

function findMultilineDefinitionRanges(text) {
  const ranges = [];
  const lines = splitTextLines(text);
  for (let index = 0; index < lines.length; index += 1) {
    const header = lines[index];
    if (!UNSUPPORTED_DEFINITION_HEADER.test(header.content)) continue;
    const preferNamedStitches = SPECIAL_STITCH_DEFINITION_HEADER.test(header.content);

    let end = header.end;
    let entryCount = 0;
    let inNamedStitchBody = false;
    let preserveNamedInstructionRows = false;
    let namedStitchBodyHasContent = false;
    let lastIncludedIndex = index;
    for (let entryIndex = index + 1; entryIndex < lines.length; entryIndex += 1) {
      const entry = lines[entryIndex];
      if (
        entry.content.trim() === ""
        && (entryCount === 0 || (inNamedStitchBody && !namedStitchBodyHasContent))
      ) continue;
      if (
        preferNamedStitches
        && inNamedStitchBody
        && namedStitchBodyHasContent
        && isNamedBodyMainSectionBoundary(entry.content)
      ) break;
      const delimitedMatch = matchDefinitionEntry(entry.content);
      if (
        preferNamedStitches
        && inNamedStitchBody
        && preserveNamedInstructionRows
        && !delimitedMatch
        && isStrongMainInstructionLine(entry.content)
      ) {
        entryCount += 1;
        namedStitchBodyHasContent = true;
        end = entry.end;
        lastIncludedIndex = entryIndex;
        continue;
      }
      if (
        preferNamedStitches
        && inNamedStitchBody
        && !preserveNamedInstructionRows
        && !delimitedMatch
        && isStrongMainInstructionLine(entry.content)
        && !isExplicitSpecialDefinitionLabel(entry.content)
      ) break;
      const match = delimitedMatch ?? matchHeaderDefinitionEntry(entry.content);
      if (match && isDefinitionShapedEntry(match, preferNamedStitches)) {
        entryCount += 1;
        end = entry.end;
        lastIncludedIndex = entryIndex;
        if (!delimitedMatch) {
          ranges.push({
            start: entry.start,
            end: entry.end,
            definitionKey: match.groups.key,
            definitionValue: match.groups.value,
          });
        }
        inNamedStitchBody = preferNamedStitches
          && (
            NAMED_STITCH_DEFINITION_KEY.test(match.groups.key.trim())
            || /^motif[\t\p{Zs}]+[\p{L}\p{M}\p{N}]+$/iu.test(match.groups.key.trim())
          );
        preserveNamedInstructionRows = inNamedStitchBody
          && NAMED_DEFINITION_MULTIROW_VALUE.test(match.groups.value);
        namedStitchBodyHasContent = inNamedStitchBody;
        continue;
      }
      if (preferNamedStitches && isNamedStitchLabelOnly(entry.content)) {
        entryCount += 1;
        end = entry.end;
        lastIncludedIndex = entryIndex;
        inNamedStitchBody = true;
        preserveNamedInstructionRows = true;
        namedStitchBodyHasContent = false;
        continue;
      }
      if (preferNamedStitches && inNamedStitchBody) {
        const indentedNamedInstructionRow = /^[\t\p{Zs}]+/u.test(entry.content)
          && EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(entry.content);
        if (
          (preserveNamedInstructionRows || indentedNamedInstructionRow)
          && EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(entry.content)
        ) {
          entryCount += 1;
          namedStitchBodyHasContent = true;
          end = entry.end;
          lastIncludedIndex = entryIndex;
          continue;
        }
        if (isStructuralDefinitionBoundary(entry.content)) break;
        entryCount += 1;
        namedStitchBodyHasContent = true;
        end = entry.end;
        lastIncludedIndex = entryIndex;
        continue;
      }
      break;
    }
    if (entryCount > 0) {
      ranges.push({ start: header.start, end });
      index = lastIncludedIndex;
    }
  }
  return ranges;
}

function findInlineDefinitionRanges(text) {
  const ranges = [];
  for (const line of splitTextLines(text)) {
    let segmentStart = 0;
    let inDefinitionSequence = false;
    let preferNamedStitches = false;
    while (segmentStart <= line.content.length) {
      const separator = line.content.indexOf(";", segmentStart);
      const segmentEnd = separator === -1 ? line.content.length : separator;
      const segment = line.content.slice(segmentStart, segmentEnd);
      const absoluteStart = line.start + segmentStart;
      const absoluteEnd = line.start + segmentEnd;

      if (UNSUPPORTED_DEFINITION_INLINE_HEADER.test(segment)) {
        ranges.push({ start: absoluteStart, end: absoluteEnd });
        inDefinitionSequence = true;
        preferNamedStitches = SPECIAL_STITCH_DEFINITION_HEADER.test(segment);
      } else if (inDefinitionSequence) {
        const match = matchDefinitionEntry(segment);
        if (match && isDefinitionShapedEntry(match, preferNamedStitches)) {
          ranges.push({ start: absoluteStart, end: absoluteEnd });
        } else {
          inDefinitionSequence = false;
        }
      }

      if (separator === -1) break;
      segmentStart = separator + 1;
    }
  }
  return ranges;
}

function findUnsupportedDefinitionRanges(text) {
  const multilineDefinitionRanges = findMultilineDefinitionRanges(text);
  return [
    ...multilineDefinitionRanges,
    ...findInlineDefinitionRanges(text),
    ...findMarkdownDefinitionTableRanges(text),
    ...findGroupedSupportedDefinitionRanges(text, multilineDefinitionRanges),
    ...findExplicitSupportedDefinitionRanges(text, multilineDefinitionRanges),
  ];
}

function findCustomDefinitionEntryLabels(text, ranges) {
  const labels = new Set();
  for (const range of ranges) {
    if (range.definitionKeys && range.definitionValue) {
      for (const definitionKey of range.definitionKeys) {
        addCustomDefinitionLabel(labels, definitionKey, range.definitionValue);
      }
      continue;
    }
    if (range.definitionKey && range.definitionValue) {
      addCustomDefinitionLabel(labels, range.definitionKey, range.definitionValue);
      continue;
    }
    const definitionText = text.slice(range.start, range.end);
    const segments = splitTextLines(definitionText)
      .flatMap((line) => line.content.split(";"));
    for (const segment of segments) {
      const header = segment.match(UNSUPPORTED_DEFINITION_INLINE_HEADER);
      const entryText = header ? segment.slice(header[0].length) : segment;
      const match = matchDefinitionEntry(entryText);
      if (!match) continue;
      addCustomDefinitionLabel(labels, match.groups.key, match.groups.value);
    }
  }
  return labels;
}

function findCompoundCustomDefinitionKeys(text, ranges) {
  const keys = new Set();
  const addKey = (rawKey) => {
    if (!isCompoundSupportedDefinitionKey(rawKey)) return;
    keys.add(normalizeDefinitionKey(rawKey));
  };

  for (const range of ranges) {
    if (range.definitionKeys && range.definitionValue) {
      for (const definitionKey of range.definitionKeys) addKey(definitionKey);
      continue;
    }
    if (range.definitionKey && range.definitionValue) {
      addKey(range.definitionKey);
      continue;
    }
    const definitionText = text.slice(range.start, range.end);
    const segments = splitTextLines(definitionText)
      .flatMap((line) => line.content.split(";"));
    for (const segment of segments) {
      const header = segment.match(UNSUPPORTED_DEFINITION_INLINE_HEADER);
      const entryText = header ? segment.slice(header[0].length) : segment;
      const match = matchDefinitionEntry(entryText);
      if (match?.groups.value) {
        for (const definitionKey of splitDefinitionKeys(match.groups.key)) addKey(definitionKey);
      }
    }
  }
  return keys;
}

function findCompoundCustomDefinitionKeyRanges(text, keys) {
  const ranges = [];
  for (const key of keys) {
    const source = escapeRegex(key).replace(/ /g, TERM_GAP_SOURCE);
    const matcher = new RegExp(
      `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
      "giu",
    );
    let match;
    while ((match = matcher.exec(text)) !== null) {
      const start = match.index + match[1].length;
      ranges.push({ start, end: start + match[2].length });
    }
  }
  return ranges;
}

function findCustomDefinitionTermRanges(text, labels) {
  const ranges = [];
  for (const entry of UK_TO_US_TERMS) {
    if (!labels.has(entry.label)) continue;
    for (const term of entry.terms) {
      const source = escapeRegex(term).replace(/ /g, "[\\t\\p{Zs}]+");
      const matcher = new RegExp(
        `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
        "giu",
      );
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const start = match.index + match[1].length;
        ranges.push({ start, end: start + match[2].length });
      }
    }
  }
  return ranges;
}

function findUnsupportedParentheticalRanges(text) {
  const ranges = [];
  const stack = [];

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "(") {
      const lead = text.slice(Math.max(0, index - 100), index);
      const parentUnsupported = stack.length > 0 && stack[stack.length - 1].unsupported;
      stack.push({
        start: index,
        unsupported: parentUnsupported || UNSUPPORTED_PARENTHETICAL_LEAD.test(lead),
      });
    } else if (text[index] === ")" && stack.length > 0) {
      const item = stack.pop();
      if (item.unsupported) ranges.push({ start: item.start, end: index + 1 });
    }
  }

  for (const item of stack) {
    if (item.unsupported) ranges.push({ start: item.start, end: text.length });
  }
  return ranges;
}

const COMPOUND_DASH = "[-‐‑‒–—―−﹣－]";
const COMPOUND_DASH_CHARACTER = /[-‐‑‒–—―−﹣－]/u;
const UNSUPPORTED_PREFIX_MODIFIERS = new RegExp(
  `(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:double|half|single|triple|front(?:\\s+|${COMPOUND_DASH})post|back(?:\\s+|${COMPOUND_DASH})post|extended|linked|foundation|standing|reverse|crossed|relief|raised)(?:\\s+|${COMPOUND_DASH}\\s*)$`,
  "iu",
);

const ALLOWED_PRECEDING_INSTRUCTION_WORDS = new Set([
  "a", "above", "across", "add", "adjacent", "after", "along", "an", "and", "around", "as", "at", "atop", "before", "begin", "behind", "below", "beneath", "beside", "between", "ch", "chain", "commence", "complete", "continue", "crochet",
  "center", "centre", "corresponding", "dc", "dtr", "each", "every", "fifth", "first", "followed", "following", "four", "fourth", "from",
  "beg", "cont", "decrease", "finish", "htr", "in", "increase", "into", "join", "last", "make", "miss", "next", "now", "of", "rep",
  "inside", "marked", "near", "on", "one", "opposite", "or", "outside", "over", "place", "previous", "remaining", "repeat", "rnd", "round", "row", "same", "second", "see", "sixth", "skip", "space",
  "spaces", "st", "stitch", "stitches", "then", "third", "three", "through", "times", "to", "toward", "towards", "tr",
  "the", "turn", "twice", "two", "under", "until", "upon", "use", "using", "with", "within", "work", "start",
]);
const STRONG_PRECEDING_INSTRUCTION_WORDS = new Set([
  "add", "chain", "continue", "crochet", "decrease", "increase", "join", "knit", "make", "miss", "place", "purl", "repeat", "skip", "turn", "work",
]);
const SUPPORTED_ABBREVIATION_TERMS = new Set(
  UK_TO_US_TERMS.flatMap((entry) => entry.terms.filter((term) => /^[a-z]{1,3}$/iu.test(term))),
);
const SUPPORTED_ABBREVIATION_SOURCE = [...SUPPORTED_ABBREVIATION_TERMS].map(escapeRegex).join("|");
const FOLLOWING_SUPPORTED_ABBREVIATION = new RegExp(
  `^[\\t\\p{Zs}]*(?:(?:[,;/]|\\))[\\t\\p{Zs}]*)?(?:(?:and|or|then)[\\t\\p{Zs}]+)?(?:${SUPPORTED_ABBREVIATION_SOURCE})\\b`,
  "iu",
);
const PRECEDING_SUPPORTED_ABBREVIATION = new RegExp(
  `(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:${SUPPORTED_ABBREVIATION_SOURCE})[\\t\\p{Zs}]*(?:[,;/][\\t\\p{Zs}]*)?$`,
  "iu",
);
const FOLLOWING_INSTRUCTION_CONTEXT = /^[\t\p{Zs}]*(?:[,;:/)\]}][\t\p{Zs}]*)?(?:above\b|alone|below\b|across|around|turn\b|times?\b|st(?:s|itch(?:es)?)?\b|(?:in|into|at|before|behind|below|between|from|on|over|through|to|under|until|with|within)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:adjacent|center|centre|corresponding|dtr|each|end|every|fifth|first|following|fourth|hook|htr|last|loop|marked|marker|next|opposite|previous|remaining|round|row|same|second|sixth|space|st(?:s|itch(?:es)?)?|third|tr|dc|yarn|\d+(?:st|nd|rd|th)|\d+[\t\p{Zs}]+(?:chains?|spaces?|st(?:s|itch(?:es)?)?)))\b/iu;
const FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT = new RegExp(
  String.raw`^[\t\p{Zs}]+is[\t\p{Zs}]+${PASSIVE_INSTRUCTION_VALUE_SOURCE}`,
  "iu",
);
const FOLLOWING_CROCHET_NOUN_CONTEXT = /^[^\r\n,;:.!?]{0,80}\b(?:chains?|hooks?|loops?|markers?|rounds?|rows?|spaces?|st(?:s|itch(?:es)?)?|yarn)\b/iu;
const PAIRED_LONG_TERM_BEFORE = new Map(
  UK_TO_US_TERMS.map((entry) => [
    entry.label,
    entry.terms
      .filter((term) => term.includes(" "))
      .map((term) => new RegExp(`${escapeRegex(term).replace(/ /g, "[\\t\\p{Zs}]+")}[\\t\\p{Zs}]*[,;/][\\t\\p{Zs}]*$`, "iu")),
  ]),
);
const SAME_LINE_ACTION_LIST_CONTEXT = /(?:^|\n)[\t\p{Zs}]*(?:(?:ch(?:ain)?|work|skip|miss|make|join|repeat|turn|sk|yo|beg|rep|cont|sc)\b|sl[\t\p{Zs}]+st\b|insert[\t\p{Zs}]+hook\b|pull[\t\p{Zs}]+through\b|\p{N}+[\t\p{Zs}]+ch\b)[^\r\n]{0,120}(?:[,;][\t\p{Zs}]*(?:then[\t\p{Zs}]+)?)$/iu;
const NUMBERED_INSTRUCTION_PREFIX = /(?:^|\n)[\t\p{Zs}]*(?:(?:\p{N}+[.)]|\(\p{N}+\))|step[\t\p{Zs}]+\p{N}+[.)])[\t\p{Zs}]*$/iu;
const BOUNDED_UPPERCASE_COMMAND_BEFORE = /(?:^|\n)[\t\p{Zs}]*(?:(?:(?:at[\t\p{Zs}]+marker|with[\t\p{Zs}]+colou?r)\b[^,\r\n]{0,40},[\t\p{Zs}]*)|(?:(?:add|begin|ch(?:ain)?|commence|complete|continue|crochet|decrease|finish|increase|join|make|miss|place|repeat|skip|start|turn|use|using|work)\b[^\r\n]{0,120}))$/iu;
const BOUNDED_UPPERCASE_SHORTHAND_BEFORE = /(?:^|\n)[\t\p{Zs}]*(?:(?:sk|yo|beg|rep|cont)\b|sl[\t\p{Zs}]+st\b|insert[\t\p{Zs}]+hook\b|pull[\t\p{Zs}]+through\b|\p{N}+[\t\p{Zs}]+ch\b)[^\r\n]{0,120}$/iu;
const POSITIONAL_INSTRUCTION_TARGET_BEFORE = new RegExp(
  `${POSITIONAL_INSTRUCTION_TARGET_BEFORE_SOURCE}$`,
  "iu",
);
const FOLLOWING_TARGET_QUALIFIER = new RegExp(`^${FOLLOWING_TARGET_QUALIFIER_SOURCE}`, "iu");
const BOUNDED_UPPERCASE_BARE_INSTRUCTION_PREFIX = /(?:^|\n)[\t\p{Zs}]*(?:(?:[-*•·▪◦‣]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]*)?$/u;
const COUNTED_LIST_INSTRUCTION_PREFIX = /(?:^|\n)[\t\p{Zs}]*(?:(?:[-*•·▪◦‣]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)\p{N}+(?:st|nd|rd|th)?[\t\p{Zs}]+$/iu;
const UPPERCASE_COMMAND_CONTINUATION = new RegExp(
  `^[\\t\\p{Zs}]*(?:(?:[,;][\\t\\p{Zs}]*(?:(?:then[\\t\\p{Zs}]+)?(?:turn|join|fasten|continue|repeat|work|make|skip|miss)\\b|(?:and[\\t\\p{Zs}]+)?(?:${SUPPORTED_ABBREVIATION_SOURCE})\\b))|(?:and|then)[\\t\\p{Zs}]+(?:(?:${SUPPORTED_ABBREVIATION_SOURCE})\\b|(?:turn|join|fasten|continue|repeat|work|make|skip|miss)\\b))`,
  "iu",
);

function isRecognizableAbbreviationInstruction(text, start, end, matchedText, entry) {
  const normalized = matchedText.toLocaleLowerCase("en-US");
  const rawBefore = text.slice(Math.max(0, start - 160), start);
  const rawAfter = text.slice(end, Math.min(text.length, end + 160));
  const before = rawBefore.replace(/(?:\*{1,3}|_{1,3}|[([{])[\t\p{Zs}]*$/u, "");
  const after = rawAfter
    .replace(/^[\t\p{Zs}]*(?:\*{1,3}|_{1,3})/u, "")
    .replace(/^[\t\p{Zs}]*\](?:\([^()\r\n]{0,2048}\))?/u, "")
    .replace(/^[\t\p{Zs}]*[)}]/u, "");
  const terminalAfter = /^[\t\p{Zs}]*[.!?]?[\t\p{Zs}]*(?:\r?\n|$)/u.test(after);
  const boundedCommandBefore = BOUNDED_UPPERCASE_COMMAND_BEFORE.test(before)
    || BOUNDED_UPPERCASE_SHORTHAND_BEFORE.test(before);
  const positionalTargetBefore = POSITIONAL_INSTRUCTION_TARGET_BEFORE.test(before);
  if (
    (
      isAmbiguousTermProseContinuation(rawBefore, rawAfter, matchedText)
      || isAmbiguousTermProseContinuation(before, after, matchedText)
    )
    && !EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(before)
    && !(
      boundedCommandBefore
      && (
        terminalAfter
        || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
        || FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(after)
        || FOLLOWING_SUPPORTED_ABBREVIATION.test(after)
        || UPPERCASE_COMMAND_CONTINUATION.test(after)
      )
    )
    && !(positionalTargetBefore && FOLLOWING_TARGET_QUALIFIER.test(after))
  ) return false;
  if (!SUPPORTED_ABBREVIATION_TERMS.has(normalized)) {
    if (/(?:^|[^\p{L}\p{M}\p{N}])now[\t\p{Zs}]+$/iu.test(before)) {
      return terminalAfter || FOLLOWING_INSTRUCTION_CONTEXT.test(after);
    }
    return true;
  }
  if (
    /(?:^|\n)[\t\p{Zs}]*$/u.test(before)
    && terminalAfter
  ) return true;
  const explicitInstructionHeading = EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(before);
  if (explicitInstructionHeading) return true;
  const uppercaseAbbreviation = matchedText === matchedText.toLocaleUpperCase("en-US")
    && matchedText !== matchedText.toLocaleLowerCase("en-US");
  const commaSeparatedName = before.match(/([\p{Lu}][\p{L}\p{M}'’-]*),[\t\p{Zs}]*$/u)?.[1];
  if (
    uppercaseAbbreviation
    && commaSeparatedName
    && !BOUNDED_UPPERCASE_COMMAND_BEFORE.test(before)
    && !BOUNDED_UPPERCASE_SHORTHAND_BEFORE.test(before)
    && !SUPPORTED_ABBREVIATION_TERMS.has(commaSeparatedName.toLocaleLowerCase("en-US"))
  ) return false;
  if (
    uppercaseAbbreviation
    && /^[\t\p{Zs}]+in[\t\p{Zs}]+\d{3,4}\b/iu.test(after)
  ) return false;
  if (
    uppercaseAbbreviation
    && (
      BOUNDED_UPPERCASE_COMMAND_BEFORE.test(before)
      || BOUNDED_UPPERCASE_SHORTHAND_BEFORE.test(before)
    )
    && (
      terminalAfter
      || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
      || FOLLOWING_SUPPORTED_ABBREVIATION.test(after)
      || UPPERCASE_COMMAND_CONTINUATION.test(after)
    )
  ) return true;
  if (
    positionalTargetBefore
    && (
      !uppercaseAbbreviation
      || terminalAfter
      || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
      || FOLLOWING_TARGET_QUALIFIER.test(after)
    )
  ) return true;
  if (
    SAME_LINE_ACTION_LIST_CONTEXT.test(before)
    && (!uppercaseAbbreviation || terminalAfter || FOLLOWING_INSTRUCTION_CONTEXT.test(after))
  ) return true;
  const precedingToken = before.match(/([\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]+)[\t\p{Zs}]+$/u)?.[1];
  if (
    precedingToken
    && (
      /^\p{N}+(?:st|nd|rd|th)?$/iu.test(precedingToken)
      || STRONG_PRECEDING_INSTRUCTION_WORDS.has(precedingToken.toLocaleLowerCase("en-US"))
    )
  ) {
    if (!uppercaseAbbreviation) return true;
    if (
      /^\p{N}+(?:st|nd|rd|th)?$/iu.test(precedingToken)
      && COUNTED_LIST_INSTRUCTION_PREFIX.test(before)
      && (terminalAfter || FOLLOWING_INSTRUCTION_CONTEXT.test(after))
    ) return true;
  }

  if (
    (/(?:^|\n)[\t\p{Zs}]*[-*•·▪◦‣][\t\p{Zs}]*$/u.test(before)
      || NUMBERED_INSTRUCTION_PREFIX.test(before))
    && (!uppercaseAbbreviation || terminalAfter)
  ) return true;
  if (
    FOLLOWING_INSTRUCTION_CONTEXT.test(after)
    && (
      !uppercaseAbbreviation
      || (
        BOUNDED_UPPERCASE_BARE_INSTRUCTION_PREFIX.test(before)
        && FOLLOWING_CROCHET_NOUN_CONTEXT.test(after)
      )
    )
  ) return true;
  if (
    FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(after)
    && (
      !uppercaseAbbreviation
      || (
        BOUNDED_UPPERCASE_BARE_INSTRUCTION_PREFIX.test(before)
        && FOLLOWING_CROCHET_NOUN_CONTEXT.test(after)
      )
    )
  ) return true;

  if (
    (FOLLOWING_SUPPORTED_ABBREVIATION.test(after) || PRECEDING_SUPPORTED_ABBREVIATION.test(before))
    && !uppercaseAbbreviation
  ) return true;
  if (
    /[([{/,;*][\t\p{Zs}]*$/u.test(before)
    && /^[\t\p{Zs}]*(?:[\])},;/]|\b(?:alone|and|or|then|in|into|across|around|times?)\b)/iu.test(after)
    && (
      !uppercaseAbbreviation
      || /(?:^|\n)[^\r\n]{0,100}\b(?:ch|chain|insert|join|make|repeat|skip|work)\b[^\r\n]{0,80}[([{][\t\p{Zs}]*$/iu.test(before)
    )
  ) return true;
  if (PAIRED_LONG_TERM_BEFORE.get(entry.label)?.some((matcher) => matcher.test(before))) return true;
  if (uppercaseAbbreviation) return false;
  return Boolean(
    precedingToken
    && ALLOWED_PRECEDING_INSTRUCTION_WORDS.has(precedingToken.toLocaleLowerCase("en-US")),
  );
}

function hasUnsupportedWhitespacePrefix(text, start) {
  const precedingToken = text.slice(Math.max(0, start - 80), start).match(/([\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]+)[\t\p{Zs}]+$/u)?.[1];
  if (
    !precedingToken
    || /^_+$/u.test(precedingToken)
    || /^\p{N}+$/u.test(precedingToken)
    || /^\p{N}+(?:st|nd|rd|th)$/iu.test(precedingToken)
  ) return false;
  return !ALLOWED_PRECEDING_INSTRUCTION_WORDS.has(precedingToken.toLocaleLowerCase("en-US"));
}
const UNSUPPORTED_SUFFIX_MODIFIERS = new RegExp(
  `^(?:\\s+|${COMPOUND_DASH}\\s*)(?:crochet(?:\\s+|${COMPOUND_DASH}\\s*))?(?:(?:two|three|four|\\d+)(?:\\s+|${COMPOUND_DASH}\\s*)(?:together|tog)|cluster|shell|bobble|puff|popcorn|decrease|increase|inc|dec|cl|sh|bo|tog|(?:front|back)(?:\\s+|${COMPOUND_DASH}\\s*)loop|[bf]lo|t[bf]l|through(?:\\s+|${COMPOUND_DASH}\\s*)(?:the(?:\\s+|${COMPOUND_DASH}\\s*))?(?:front|back)(?:\\s+|${COMPOUND_DASH}\\s*)loop)\\b`,
  "iu",
);

function isUnsupportedCompoundContext(text, start, end) {
  const before = text.slice(Math.max(0, start - 120), start);
  const after = text.slice(end, Math.min(text.length, end + 120));
  const leadingDash = COMPOUND_DASH_CHARACTER.test(text[start - 1] ?? "");
  const leadingDashIsHeadingDelimiter = leadingDash
    && EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(before);
  const trailingDash = COMPOUND_DASH_CHARACTER.test(text[end] ?? "");
  const trailingDashIsInstructionDelimiter = trailingDash
    && /^[-‐‑‒–—―−﹣－](?:[\t\p{Zs}]*(?:and|then)[\t\p{Zs}]+)?(?:begin|continue|fasten|finish|join|make|miss|repeat|skip|turn|work)\b/iu.test(after);
  return (
    (leadingDash && !leadingDashIsHeadingDelimiter)
    || (trailingDash && !trailingDashIsInstructionDelimiter)
    || hasUnsupportedWhitespacePrefix(text, start)
    || UNSUPPORTED_PREFIX_MODIFIERS.test(before)
    || UNSUPPORTED_SUFFIX_MODIFIERS.test(after)
  );
}

function isTensionGaugeContext(text, start, end) {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const horizontalSpace = "[\\t\\p{Zs}]";
  const measurementUnit = "(?:st(?:s|itch(?:es)?)?|rows?|double[\\t\\p{Zs}]+treble(?:[\\t\\p{Zs}]+crochet)?|dtr|half[\\t\\p{Zs}]+treble(?:[\\t\\p{Zs}]+crochet)?|htr|treble(?:[\\t\\p{Zs}]+crochet)?|tr|double[\\t\\p{Zs}]+crochet|dc)";
  const squareMatch = new RegExp(`^${horizontalSpace}+square\\b`, "iu").exec(after);
  const squareAfter = squareMatch ? after.slice(squareMatch[0].length) : "";
  const squareBefore = before.slice(Math.max(0, before.length - 160));
  const squareIsMetaProse = squareMatch && (
    isAmbiguousTermProseContinuation(squareBefore, squareAfter, "tension")
    || /^[\t\p{Zs}]+as[\t\p{Zs}]+(?:a[\t\p{Zs}]+|the[\t\p{Zs}]+)?(?:example|label|phrase|term|wording)\b/iu.test(squareAfter)
  );
  const isGaugeSquare = Boolean(squareMatch && !squareIsMetaProse);
  const isMeasurement = new RegExp(
    `^${horizontalSpace}*(?:(?:is|of)${horizontalSpace}+|(?:[:=：＝→⇒➜]|[-‐‑‒–—―−﹣－])${horizontalSpace}*)?\\p{N}+(?:[.,]\\p{N}+)?${horizontalSpace}*${measurementUnit}\\b`,
    "iu",
  ).test(after);
  const isFollowingMeasurementLine = new RegExp(
    `^\\r?\\n${horizontalSpace}*\\p{N}+(?:[.,]\\p{N}+)?${horizontalSpace}*${measurementUnit}\\b`,
    "iu",
  ).test(after);
  const isStandaloneHeadingTerm = /(?:^|\n)[\t\p{Zs}]*(?:(?:>|[-+*])[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?(?:(?:\*\*|__)[\t\p{Zs}]*)?$/u.test(before);
  const isHeading = new RegExp(`(?:^|\\n)${horizontalSpace}*$`, "u").test(before)
    && new RegExp(`^${horizontalSpace}*[:：]`, "u").test(after);
  return isGaugeSquare || isMeasurement || (isFollowingMeasurementLine && isStandaloneHeadingTerm) || isHeading;
}

function collectMatches(text) {
  const matches = [];
  const blockedMatches = [];
  const unsupportedDefinitionRanges = findUnsupportedDefinitionRanges(text);
  const customDefinitionEntryLabels = findCustomDefinitionEntryLabels(text, unsupportedDefinitionRanges);
  const compoundCustomDefinitionKeys = findCompoundCustomDefinitionKeys(text, unsupportedDefinitionRanges);
  const compoundCustomDefinitionKeyRanges = findCompoundCustomDefinitionKeyRanges(
    text,
    compoundCustomDefinitionKeys,
  );
  const unsupportedParentheticalRanges = [
    ...findUnsupportedParentheticalRanges(text),
    ...unsupportedDefinitionRanges,
  ];
  const baseSourceReferenceRanges = [
    ...findSourceReferenceRanges(text),
    ...findNonInstructionMetadataRanges(text),
    ...compoundCustomDefinitionKeyRanges,
  ];
  const sourceReferenceRanges = [
    ...baseSourceReferenceRanges,
    ...findProtectedPairContinuationRanges(text, [
      ...baseSourceReferenceRanges,
      ...unsupportedParentheticalRanges,
    ]),
  ];

  for (const entry of UK_TO_US_TERMS) {
    if (customDefinitionEntryLabels.has(entry.label)) continue;
    const variants = [
      ...parenthesizedPairMatchers(entry),
      ...underscoredTermMatchers(entry),
      ...countedSpelledOutTermMatchers(entry),
      ...entry.terms.map((term) => termMatcher(term)),
    ];

    for (const matcher of variants) {
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const prefixLength = match[1].length;
        const matchedText = match[2];
        const start = match.index + prefixLength;
        const end = start + matchedText.length;
        if (sourceReferenceRanges.some((range) => range.start < end && range.end > start)) continue;
        if (unsupportedParentheticalRanges.some((range) => range.start < end && range.end > start)) continue;
        if (!isRecognizableAbbreviationInstruction(text, start, end, matchedText, entry)) continue;
        const isTensionMeasurement = entry.label === "Tension" && isTensionGaugeContext(text, start, end);
        if (entry.label === "Tension" && !isTensionMeasurement) continue;
        if (!isTensionMeasurement && isUnsupportedCompoundContext(text, start, end)) {
          blockedMatches.push({ start, end });
          continue;
        }
        matches.push({
          start,
          end,
          matchedText,
          entry,
        });
      }
    }
  }

  const eligibleMatches = matches.filter((match) => !blockedMatches.some((blocked) => (
    blocked.start <= match.start && blocked.end >= match.end
  )));

  eligibleMatches.sort((left, right) => (
    left.start - right.start
      || (right.end - right.start) - (left.end - left.start)
      || left.entry.label.localeCompare(right.entry.label)
  ));

  const chosen = [];
  let cursor = 0;
  for (const match of eligibleMatches) {
    if (match.start >= cursor) {
      chosen.push(match);
      cursor = match.end;
    }
  }
  return chosen;
}

function hasUnicodeBoundedMatch(text, source) {
  return new RegExp(
    `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
    "iu",
  ).test(text);
}

function buildSignals(text, convention) {
  const signals = [];
  const unsupportedDefinitionRanges = findUnsupportedDefinitionRanges(text);
  const customDefinitionEntryLabels = findCustomDefinitionEntryLabels(text, unsupportedDefinitionRanges);
  const compoundCustomDefinitionKeys = findCompoundCustomDefinitionKeys(text, unsupportedDefinitionRanges);
  const excludedRanges = [
    ...findSourceReferenceRanges(text),
    ...findNonInstructionMetadataRanges(text),
    ...unsupportedDefinitionRanges,
    ...findUnsupportedParentheticalRanges(text),
    ...findCustomDefinitionTermRanges(text, customDefinitionEntryLabels),
    ...findCompoundCustomDefinitionKeyRanges(text, compoundCustomDefinitionKeys),
  ];
  const reviewText = maskRanges(text, excludedRanges);

  if (
    convention === "unknown"
    && collectMatches(text).some((match) => match.entry.label !== "Tension")
  ) {
    signals.push({
      title: "Crochet convention not established",
      note: "These stitch names can mean different stitches in UK and US instructions. The text was preserved; confirm the pattern key or publisher before choosing a conversion.",
    });
  }

  if (hasUnicodeBoundedMatch(reviewText, "tension|miss|cast\\s+off|work\\s+straight")) {
    signals.push({
      title: "Wording that may follow UK conventions",
      note: "These terms can appear in UK sources, but wording alone does not establish a pattern's country or publication date.",
    });
  }

  if (hasUnicodeBoundedMatch(reviewText, "wool\\s+(?:over|forward|back|round\\s+needle)|wl\\.?\\s*(?:fwd|bk)\\.?|wf\\.?|wb\\.?")) {
    signals.push({
      title: "Older yarn-position wording",
      note: "This language may describe yarn placement or a yarn over. Confirm the source abbreviation key and the next stitch before changing the technique.",
    });
  }

  if (
    hasUnicodeBoundedMatch(
      reviewText,
      "(?:(?:needles?|hooks?)\\s+(?:(?:no\\.?|size)\\s*)\\d+|(?<!\\bpattern\\s)(?<!\\bcatalog\\s)(?<!\\bmotif\\s)(?<!\\bdesign\\s)(?<!\\bstyle\\s)(?<!\\bitem\\s)(?:no\\.?|size)\\s*\\d+(?:\\s+(?:alumin(?:um|ium)|bamboo|bone|circular|crochet|double[-‐‑‒–—]?pointed|knitting|metal|plastic|single[-‐‑‒–—]?pointed|steel|straight|tunisian|wood(?:en)?)){0,3}\\s+(?:needles?|hooks?))",
    )
  ) {
    signals.push({
      title: "Numbered needle or hook size",
      note: "A bare size number does not identify the sizing system or diameter. Verify the source system and millimeter size before selecting a tool.",
    });
  }

  if (hasUnicodeBoundedMatch(reviewText, "\\d+(?:\\.\\d+)?\\s*oz(?:s|\\.)?")) {
    signals.push({
      title: "Yarn amount stated by weight",
      note: "Weight alone does not establish modern yardage. Match the original yarn construction and verify length per unit weight before substituting.",
    });
  }

  return signals;
}

function unchangedResult(text, convention) {
  return {
    status: "ready",
    convention,
    output: text,
    segments: [{ type: "text", content: text }],
    substitutions: [],
    substitutionCount: 0,
    signals: buildSignals(text, convention),
  };
}

/**
 * Review bounded pattern text under an explicit source convention. Unknown and
 * US modes never rewrite the input. Only explicit UK mode applies the finite
 * UK-to-US term map; everything else is preserved byte-for-byte.
 *
 * @param {string} text
 * @param {"unknown" | "us" | "uk"} convention
 * @returns {
 *   | {
 *       status: "ready",
 *       convention: "unknown" | "us" | "uk",
 *       output: string,
 *       segments: Array<{type: "text" | "sub", content: string, original?: string}>,
 *       substitutions: Array<{label: string, replacement: string, note: string, count: number, examples: string[]}>,
 *       substitutionCount: number,
 *       signals: Array<{title: string, note: string}>
 *     }
 *   | { status: "invalid", message: string }
 * }
 */
export function decodeVintagePattern(text, convention) {
  if (typeof text !== "string") {
    return { status: "invalid", message: "Pattern text must be a string." };
  }
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH) {
    return {
      status: "invalid",
      message: `Pattern text must be ${MAX_VINTAGE_PATTERN_TEXT_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }
  if (!text.trim()) {
    return { status: "invalid", message: "Enter some pattern text to review." };
  }
  if (!VINTAGE_SOURCE_CONVENTIONS.includes(convention)) {
    return {
      status: "invalid",
      message: "Choose Unknown, US terms, or UK terms as the source convention.",
    };
  }

  if (convention !== "uk") {
    return unchangedResult(text, convention);
  }

  const matches = collectMatches(text);
  const segments = [];
  const substitutionMap = new Map();
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ type: "text", content: text.slice(cursor, match.start) });
    }
    segments.push({
      type: "sub",
      content: match.entry.replacement,
      original: match.matchedText,
    });
    cursor = match.end;

    const existing = substitutionMap.get(match.entry.label);
    if (existing) {
      existing.count += 1;
      const example = match.matchedText.toLowerCase();
      if (!existing.examples.includes(example)) existing.examples.push(example);
    } else {
      substitutionMap.set(match.entry.label, {
        label: match.entry.label,
        replacement: match.entry.replacement,
        note: match.entry.note,
        count: 1,
        examples: [match.matchedText.toLowerCase()],
      });
    }
  }

  if (cursor < text.length) {
    segments.push({ type: "text", content: text.slice(cursor) });
  }

  if (segments.length === 0) {
    segments.push({ type: "text", content: text });
  }

  return {
    status: "ready",
    convention,
    output: segments.map((segment) => segment.content).join(""),
    segments,
    substitutions: [...substitutionMap.values()],
    substitutionCount: matches.length,
    signals: buildSignals(text, convention),
  };
}
