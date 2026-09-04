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

const SOURCE_TERM_CANDIDATE_SOURCE = String.raw`(?:double(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)treble(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)crochet|half(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)treble(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)crochet|double(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)treble|treble(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)crochet|half(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)treble|double(?:[\t\p{Zs}]+|\r?\n[\t\p{Zs}]*)crochet|dtr|htr|treble|tr|dc|tension)`;
const SOURCE_TERM_CANDIDATE = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])${SOURCE_TERM_CANDIDATE_SOURCE}(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);
const MARKDOWN_UNDERSCORED_SOURCE_TERM_CANDIDATE = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(_{1,3})(?:(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten|\p{N}+)[\t\p{Zs}]+)?${SOURCE_TERM_CANDIDATE_SOURCE}\2(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);
const FAST_SOURCE_ABBREVIATION_CANDIDATE = /(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:dtr|htr|tr|dc)(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])/iu;

function hasSourceTermCandidate(text) {
  return FAST_SOURCE_ABBREVIATION_CANDIDATE.test(text)
    || SOURCE_TERM_CANDIDATE.test(text)
    || MARKDOWN_UNDERSCORED_SOURCE_TERM_CANDIDATE.test(text);
}

const MAX_UNMATCHED_MARKDOWN_BRACKET_DEPTH = 64;

function hasExcessiveUnmatchedMarkdownBrackets(text) {
  let depth = 0;
  let unmatchedClosers = 0;
  let escaped = false;
  for (const character of text) {
    if (character === "\r" || character === "\n") {
      depth = 0;
      unmatchedClosers = 0;
      escaped = false;
      continue;
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === "[") {
      depth += 1;
      if (depth > MAX_UNMATCHED_MARKDOWN_BRACKET_DEPTH) return true;
    } else if (character === "]") {
      if (depth > 0) depth -= 1;
      else {
        unmatchedClosers += 1;
        if (unmatchedClosers > MAX_UNMATCHED_MARKDOWN_BRACKET_DEPTH) return true;
      }
    }
  }
  return false;
}

function hasExcessiveMalformedSimpleInlineLinks(text) {
  if (!text.includes("](")) return false;
  for (const line of splitTextLines(text)) {
    const inlineLink = /(?<image>!)?\[(?<label>(?:\\[^\r\n]|[^\[\]\\\r\n])*)\]\(/gu;
    const candidates = [];
    let candidate;
    while ((candidate = inlineLink.exec(line.content)) !== null) {
      candidates.push(candidate.index + candidate[0].length - 1);
    }
    if (candidates.length <= MAX_UNMATCHED_MARKDOWN_BRACKET_DEPTH) continue;

    const validRanges = collectBoundedInlineDestinationRanges(line.content);
    let validRangeIndex = 0;
    let malformedCandidateCount = 0;
    for (const opener of candidates) {
      while (
        validRangeIndex < validRanges.length
        && validRanges[validRangeIndex].end <= opener
      ) validRangeIndex += 1;
      const validRange = validRanges[validRangeIndex];
      if (
        validRange
        && (
          validRange.start - 1 === opener
          || (validRange.start <= opener && opener < validRange.end)
        )
      ) continue;
      malformedCandidateCount += 1;
      if (malformedCandidateCount > MAX_UNMATCHED_MARKDOWN_BRACKET_DEPTH) return true;
    }
  }
  return false;
}

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
const STRONG_SOURCE_LABEL_SOURCE = String.raw`(?:source|mirror|(?:(?:root|relative|windows|unc)[\t\p{Zs}]+)?path|file(?:[\t\p{Zs}]*name)?|link|reference|citation|uri|url|web[\t\p{Zs}]*(?:site|address)|document|folder|directory)`;
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
const CONSTRUCTION_INSTRUCTION_HEADING_SOURCE = String.raw`(?:body|sleeves?|chart|motif[\t\p{Zs}]+[\p{L}\p{M}\p{N}]{1,24}|crown|ribb?ing|shape[\t\p{Zs}]+armholes?)`;
const MARKDOWN_EMPHASIS_WRAPPER_SOURCE = String.raw`(?:\*{1,3}|_{1,3}|\x60)`;
const INSTRUCTION_HEADING_PREFIX_SOURCE = String.raw`[\t\p{Zs}]*(?:>+[\t\p{Zs}]+)*(?:(?:[-+*]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`;
const SOURCE_RECORD_STRUCTURAL_PREFIX_SOURCE = String.raw`[\t\p{Zs}]*(?:>+[\t\p{Zs}]+)*(?:(?:[-+*•·▪◦‣]|\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?`;
const STRONG_SOURCE_RECORD_LABEL_SOURCE = String.raw`(?:[*_]{1,3})?(?:${STRONG_SOURCE_LABEL_SOURCE})(?:[*_]{1,3})?`;
const SOURCE_RECORD_DELIMITER_SOURCE = String.raw`(?::|=|[-‐‑‒–—])`;
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
    if (
      (fenceCharacter === "`" || fenceCharacter === "~")
      && !isSimpleEscapedCharacter(text, index)
    ) {
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
        ranges.push({
          start: index,
          end,
          kind: "markdown-code",
          unclosedInline: close === -1,
        });
        if (close === -1) break;
        index = end;
        continue;
      }
    }
    if (text[index] !== "`" || isSimpleEscapedCharacter(text, index)) {
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
    String.raw`(?:^|\n)${SOURCE_RECORD_STRUCTURAL_PREFIX_SOURCE}${STRONG_SOURCE_RECORD_LABEL_SOURCE}[\t\p{Zs}]*${SOURCE_RECORD_DELIMITER_SOURCE}[\t\p{Zs}]*[^\r\n]+`,
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

const MAX_MARKDOWN_LINK_DESTINATION_LENGTH = 2_048;
const MAX_MARKDOWN_REFERENCE_LABEL_LENGTH = 999;

function markdownReferenceLabelCodePointLength(value) {
  return Array.from(value).length;
}

function normalizeMarkdownReferenceLabel(value) {
  return value
    .trim()
    .replace(/[\t\p{Zs}]+/gu, " ")
    .toLocaleLowerCase("en-US");
}

function scanMarkdownReferenceLabel(text, openIndex) {
  if (text[openIndex] !== "[") return null;
  let nested = false;
  for (let cursor = openIndex + 1; cursor < text.length;) {
    const character = text[cursor];
    if (character === "\r" || character === "\n") return null;
    if (character === "\\") {
      const escapedCodePoint = text.codePointAt(cursor + 1);
      if (escapedCodePoint === undefined) return null;
      cursor += 1 + (escapedCodePoint > 0xFFFF ? 2 : 1);
      continue;
    }
    if (character === "[") nested = true;
    if (character === "]") {
      const value = text.slice(openIndex + 1, cursor);
      return {
        start: openIndex,
        end: cursor + 1,
        contentStart: openIndex + 1,
        contentEnd: cursor,
        value,
        valid: !nested
          && markdownReferenceLabelCodePointLength(value)
            <= MAX_MARKDOWN_REFERENCE_LABEL_LENGTH,
      };
    }
    const codePoint = text.codePointAt(cursor);
    cursor += codePoint > 0xFFFF ? 2 : 1;
  }
  return null;
}

function collectValidMarkdownReferenceLabels(text) {
  const labels = new Set();
  for (const line of splitTextLines(text)) {
    const prefix = line.content.match(/^[\t\p{Zs}]*\[/u);
    if (!prefix) continue;
    const label = scanMarkdownReferenceLabel(line.content, prefix[0].length - 1);
    if (!label?.valid || line.content[label.end] !== ":") continue;
    const normalized = normalizeMarkdownReferenceLabel(label.value);
    if (normalized) labels.add(normalized);
  }
  return labels;
}

function isValidMarkdownLinkDestinationPayload(payload) {
  const value = payload.trim();
  if (!value) return true;

  const isValidTitle = (title) => {
    if (title.length < 2) return false;
    const opener = title[0];
    const closer = opener === "(" ? ")" : opener;
    if ((opener !== "\"" && opener !== "'" && opener !== "(") || title.at(-1) !== closer) {
      return false;
    }

    if (opener === "(") {
      let depth = 1;
      for (let index = 1; index < title.length - 1; index += 1) {
        if (title[index] === "\\") {
          index += 1;
          continue;
        }
        if (title[index] === "(") depth += 1;
        else if (title[index] === ")") {
          depth -= 1;
          if (depth === 0) return false;
        }
      }
      return depth === 1;
    }

    for (let index = 1; index < title.length - 1; index += 1) {
      if (title[index] === "\\") {
        index += 1;
        continue;
      }
      if (title[index] === closer) return false;
    }
    return true;
  };

  if (/^\s/u.test(payload) && /^(?:"|'|\()/u.test(value)) {
    return isValidTitle(value);
  }

  let destinationEnd = 0;
  if (value[0] === "<") {
    let close = -1;
    for (let index = 1; index < value.length; index += 1) {
      if (value[index] === "\\") {
        index += 1;
        continue;
      }
      if (value[index] === ">") {
        close = index;
        break;
      }
      if (value[index] === "<" || /\s/u.test(value[index])) return false;
    }
    if (close < 1) return false;
    destinationEnd = close + 1;
  } else {
    let depth = 0;
    for (let index = 0; index < value.length; index += 1) {
      const character = value[index];
      if (character === "\\") {
        index += 1;
        destinationEnd = index + 1;
        continue;
      }
      if (/\s/u.test(character)) break;
      if (character === "<" || character === ">" || character === "\"" || character === "'") {
        return false;
      }
      if (character === "(") depth += 1;
      else if (character === ")") {
        depth -= 1;
        if (depth < 0) return false;
      }
      destinationEnd = index + 1;
    }
    if (destinationEnd === 0 || depth !== 0) return false;
  }

  const remainder = value.slice(destinationEnd);
  if (!remainder) return true;
  if (!/^\s/u.test(remainder)) return false;
  return isValidTitle(remainder.trim());
}

function markdownMalformedSegmentRange(line, localIndex, segments = null) {
  const segment = (segments ?? splitSharedPolicySegments(line.content)).find((candidate) => (
    candidate.start <= localIndex && candidate.end >= localIndex
  ));
  return {
    start: line.start + (segment?.start ?? 0),
    end: line.start + (segment?.end ?? line.content.length),
    kind: "markdown-malformed-link",
  };
}

function scanMarkdownLinkSyntax(text) {
  const destinations = [];
  const inlineLinks = [];
  const imageRanges = [];
  const malformedLineRanges = [];
  if (!text.includes("[") && !text.includes("]")) {
    return { destinations, inlineLinks, imageRanges, malformedLineRanges };
  }

  for (const line of splitTextLines(text)) {
    const localDestinations = [];
    const malformedIndices = new Set();
    const inlineLink = /(?<image>!)?\[(?<label>(?:\\[^\r\n]|[^\[\]\\\r\n])*)\]\(/gu;
    let syntaxMatch;
    while ((syntaxMatch = inlineLink.exec(line.content)) !== null) {
      const opener = syntaxMatch.index + syntaxMatch[0].length - 1;
      let angleDestination = false;
      let destinationStarted = false;
      let parenthesisDepth = 0;
      let quotedTitle = "";
      let close = -1;
      let cursor = opener + 1;
      while (
        cursor < line.content.length
        && cursor - opener <= MAX_MARKDOWN_LINK_DESTINATION_LENGTH + 1
      ) {
        const character = line.content[cursor];
        if (character === "\\") {
          cursor += 2;
          continue;
        }
        if (angleDestination) {
          if (character === ">") angleDestination = false;
          cursor += 1;
          continue;
        }
        if (quotedTitle) {
          if (character === quotedTitle) quotedTitle = "";
          cursor += 1;
          continue;
        }
        if (!destinationStarted && /[\t\p{Zs}]/u.test(character)) {
          cursor += 1;
          continue;
        }
        if (!destinationStarted && character === "<") {
          destinationStarted = true;
          angleDestination = true;
          cursor += 1;
          continue;
        }
        destinationStarted = true;
        if (
          (character === "\"" || character === "'")
          && /[\t\p{Zs}]/u.test(line.content[cursor - 1] ?? "")
        ) {
          quotedTitle = character;
          cursor += 1;
          continue;
        }
        if (character === "(") parenthesisDepth += 1;
        else if (character === ")") {
          if (parenthesisDepth > 0) parenthesisDepth -= 1;
          else {
            close = cursor;
            break;
          }
        }
        cursor += 1;
      }

      if (close === -1) {
        malformedIndices.add(syntaxMatch.index);
        break;
      }

      const payload = line.content.slice(opener + 1, close);
      if (!isValidMarkdownLinkDestinationPayload(payload)) {
        malformedIndices.add(syntaxMatch.index);
        inlineLink.lastIndex = close + 1;
        continue;
      }

      const trimmedLabel = syntaxMatch.groups.label.trim();
      const openingWrapper = trimmedLabel.match(/^(\*{1,3}|_{1,3})/u)?.[1];
      const closingWrapper = trimmedLabel.match(/(\*{1,3}|_{1,3})$/u)?.[1];
      if (
        !SHARED_STITCH_LIST_VISIBLE_ITEM.test(trimmedLabel)
        && !SHARED_STITCH_LIST_COMPLETE_LABEL.test(trimmedLabel)
        &&
        (openingWrapper || closingWrapper)
        && (
          !openingWrapper
          || openingWrapper !== closingWrapper
          || trimmedLabel.length <= openingWrapper.length * 2
        )
      ) malformedIndices.add(syntaxMatch.index);

      const destination = {
        start: line.start + opener + 1,
        end: line.start + close,
      };
      destinations.push(destination);
      localDestinations.push({ start: opener + 1, end: close });
      inlineLinks.push({
        start: line.start + syntaxMatch.index,
        end: line.start + close + 1,
        labelStart: line.start + syntaxMatch.index + (syntaxMatch.groups.image ? 2 : 1),
        labelEnd: line.start + opener - 1,
        image: Boolean(syntaxMatch.groups.image),
      });
      if (syntaxMatch.groups.image) {
        imageRanges.push({
          start: line.start + syntaxMatch.index,
          end: line.start + close + 1,
          kind: "markdown-image",
        });
      }
      inlineLink.lastIndex = close + 1;
    }

    const unclosedReference = /!?\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\]\[(?:\\[^\r\n]|[^\[\]\\\r\n])*$/gu;
    while ((syntaxMatch = unclosedReference.exec(line.content)) !== null) {
      malformedIndices.add(syntaxMatch.index);
    }

    let destinationIndex = 0;
    const squareStack = [];
    for (let index = 0; index < line.content.length; index += 1) {
      const destination = localDestinations[destinationIndex];
      if (destination && index === destination.start) {
        index = destination.end - 1;
        destinationIndex += 1;
        continue;
      }
      if (line.content[index] === "\\") {
        index += 1;
        continue;
      }
      if (line.content[index] === "[") squareStack.push(index);
      else if (line.content[index] === "]") {
        if (squareStack.length === 0) malformedIndices.add(index);
        else squareStack.pop();
      }
    }
    for (const index of squareStack) malformedIndices.add(index);
    if (malformedIndices.size === 0) continue;
    const seenRanges = new Set();
    const policySegments = splitSharedPolicySegments(line.content);
    for (const index of malformedIndices) {
      const range = markdownMalformedSegmentRange(line, index, policySegments);
      const key = `${range.start}:${range.end}`;
      if (seenRanges.has(key)) continue;
      seenRanges.add(key);
      malformedLineRanges.push(range);
    }
  }

  return { destinations, inlineLinks, imageRanges, malformedLineRanges };
}

function findSourceReferenceRanges(text) {
  const markdownSyntax = scanMarkdownLinkSyntax(text);
  const referenceLabels = collectValidMarkdownReferenceLabels(text);
  const ranges = [
    ...findMarkdownCodeRanges(text),
    ...findHtmlMarkupRanges(text),
    ...findSimplePhysicalIndentedCodeRanges(text),
    ...findStrongLabeledQuotedRanges(text),
    ...findStrongLabeledSourceLineRanges(text),
    ...findWholeLinePathRanges(text),
    ...markdownSyntax.destinations,
    ...markdownSyntax.imageRanges,
    ...markdownSyntax.malformedLineRanges,
    ...findUnsafeMarkupBoundaryRanges(text, markdownSyntax.inlineLinks, referenceLabels),
  ];
  const markdownReferenceDefinition = /(?:^|\n)[\t\p{Zs}]*\[(?<label>[^\]\r\n]+)\]:[^\r\n]*/gu;
  let syntaxMatch;
  while ((syntaxMatch = markdownReferenceDefinition.exec(text)) !== null) {
    ranges.push({ start: syntaxMatch.index, end: syntaxMatch.index + syntaxMatch[0].length });
  }

  const markdownImage = /!\[[^\]\r\n]*\](?:\([^\r\n)]*\)|\[[^\]\r\n]*\]|\[\])?/gu;
  while ((syntaxMatch = markdownImage.exec(text)) !== null) {
    ranges.push({
      start: syntaxMatch.index,
      end: syntaxMatch.index + syntaxMatch[0].length,
      kind: "markdown-image",
    });
  }

  const markdownReferenceVisibleLabels = [];
  const markdownReferenceUse = /\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\](\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\])/gu;
  while ((syntaxMatch = markdownReferenceUse.exec(text)) !== null) {
    const identifierOffset = syntaxMatch[0].lastIndexOf(syntaxMatch[1]);
    markdownReferenceVisibleLabels.push({
      start: syntaxMatch.index + 1,
      end: syntaxMatch.index + identifierOffset - 1,
    });
    ranges.push({
      start: syntaxMatch.index + identifierOffset,
      end: syntaxMatch.index + identifierOffset + syntaxMatch[1].length,
    });
  }

  const markdownShortcutOrCollapsedUse = /\[(?<label>(?:\\[^\r\n]|[^\[\]\\\r\n])+)\](?<collapsed>\[\])?/gu;
  while ((syntaxMatch = markdownShortcutOrCollapsedUse.exec(text)) !== null) {
    const normalizedLabel = normalizeMarkdownReferenceLabel(syntaxMatch.groups.label);
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
      const absoluteEnd = match.index + candidate.end;
      if (markdownReferenceVisibleLabels.some((range) => (
        range.start < absoluteEnd && range.end > absoluteStart
      ))) continue;
      const precedingText = text.slice(Math.max(0, absoluteStart - 80), absoluteStart);
      const isMarkdownDestination = markdownDestinationOffset !== -1
        && candidate.start >= markdownDestinationOffset;
      if (!isMarkdownDestination && !isSourceReferenceCandidate(candidate.value, precedingText)) {
        continue;
      }
      ranges.push({ start: absoluteStart, end: absoluteEnd });
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
    masked += text.slice(start, end).replace(
      /[^\r\n]/gu,
      (character) => character.length === 2 ? "🟥" : " ",
    );
    cursor = end;
  }
  return masked + text.slice(cursor);
}

function maskOneLineRangesWithSpaces(text, ranges) {
  const orderedRanges = [...ranges].sort((left, right) => left.start - right.start || left.end - right.end);
  let cursor = 0;
  let masked = "";
  for (const range of orderedRanges) {
    const start = Math.max(cursor, range.start);
    const end = Math.max(start, range.end);
    if (end <= cursor) continue;
    masked += text.slice(cursor, start);
    masked += " ".repeat(end - start);
    cursor = end;
  }
  return masked + text.slice(cursor);
}

const TERM_GAP_SOURCE = String.raw`(?:[\t\p{Zs}]+|[\t\p{Zs}]*\r?\n[\t\p{Zs}]*)`;
const SOURCE_STITCH_TERM_ENTRIES = UK_TO_US_TERMS
  .filter(({ label }) => label !== "Tension")
  .flatMap((entry) => entry.terms.map((term) => ({ entry, term })))
  .sort((left, right) => right.term.length - left.term.length);
const SOURCE_STITCH_TERM_ENTRY_BY_TERM = new Map(
  SOURCE_STITCH_TERM_ENTRIES.map(({ entry, term }) => [term, entry]),
);
const TENSION_TERM_ENTRY = UK_TO_US_TERMS.find(({ label }) => label === "Tension");
const SOURCE_STITCH_TERM_SOURCE = SOURCE_STITCH_TERM_ENTRIES
  .map(({ term }) => escapeRegex(term).replace(/ /g, "[\\t\\p{Zs}]+"))
  .join("|");
const MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE = 128;
const MAX_RAW_SOURCE_TERM_FRAGMENTS_PER_PHYSICAL_LINE = 128;
// Keep the specialized path aligned with the decoder's 64-command atomic ceiling.
// Input length and per-line source-term limits provide the remaining hard bounds.
const MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS = 63;
const MAX_SIMPLE_FAST_STRUCTURAL_PREFIXES = 3;
const SOURCE_TERM_DENSITY_FINDER = new RegExp(
  `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:${SOURCE_STITCH_TERM_SOURCE}|tension)(?![\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
  "giu",
);
const RAW_SOURCE_TERM_FRAGMENT_FINDER = /(?:dtr|htr|dc|tr|double|treble|tension)/giu;

function hasExcessiveSourceTermDensity(text) {
  const minimumExcessiveLineLength = (MAX_RAW_SOURCE_TERM_FRAGMENTS_PER_PHYSICAL_LINE + 1) * 2;
  if (text.length < minimumExcessiveLineLength) return false;
  for (const line of text.split(/\r?\n/u)) {
    if (line.length < minimumExcessiveLineLength) continue;
    SOURCE_TERM_DENSITY_FINDER.lastIndex = 0;
    const exactRanges = [];
    let exactMatch;
    while ((exactMatch = SOURCE_TERM_DENSITY_FINDER.exec(line)) !== null) {
      const start = exactMatch.index + exactMatch[1].length;
      exactRanges.push({ start, end: exactMatch.index + exactMatch[0].length });
      if (exactRanges.length > MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE) return true;
    }
    RAW_SOURCE_TERM_FRAGMENT_FINDER.lastIndex = 0;
    let unmatchedRawFragmentCount = 0;
    let rawMatch;
    while ((rawMatch = RAW_SOURCE_TERM_FRAGMENT_FINDER.exec(line)) !== null) {
      const rawStart = rawMatch.index;
      const rawEnd = rawStart + rawMatch[0].length;
      if (exactRanges.some((range) => range.start <= rawStart && range.end >= rawEnd)) continue;
      unmatchedRawFragmentCount += 1;
      if (
        exactRanges.length + unmatchedRawFragmentCount
        > MAX_RAW_SOURCE_TERM_FRAGMENTS_PER_PHYSICAL_LINE
      ) return true;
    }
  }
  return false;
}

function hasExcessiveReviewComplexity(text) {
  const minimumDensityLength = (MAX_RAW_SOURCE_TERM_FRAGMENTS_PER_PHYSICAL_LINE + 1) * 2;
  let densityText = text;
  if (text.length >= minimumDensityLength) {
    const markdownSyntax = text.includes("](") || text.includes("][")
      ? scanMarkdownLinkSyntax(text)
      : null;
    const densityProtectionRanges = [
      ...(/[\x60~]/u.test(text)
        ? findMarkdownCodeRanges(text).filter((range) => !range.unclosedInline)
        : []),
      ...(text.includes("<")
        ? findHtmlMarkupRanges(text).filter((range) => range.kind === "html-code")
        : []),
      ...findSimplePhysicalIndentedCodeRanges(text),
      ...(markdownSyntax?.destinations ?? []),
      ...(markdownSyntax?.imageRanges ?? []),
    ];
    if (densityProtectionRanges.length > 0) {
      densityText = maskRanges(text, densityProtectionRanges);
    }
  }
  return hasExcessiveUnmatchedMarkdownBrackets(text)
    || hasExcessiveMalformedSimpleInlineLinks(text)
    || hasExcessiveSourceTermDensity(densityText);
}
const TARGET_STITCH_TERM_SOURCE = [
  ...new Set([
    ...SOURCE_STITCH_TERM_ENTRIES.map(({ term }) => term),
    "half double crochet",
    "sc",
    "single crochet",
  ]),
]
  .sort((left, right) => right.length - left.length)
  .map((term) => escapeRegex(term).replace(/ /g, "[\\t\\p{Zs}]+"))
  .join("|");
const TARGET_POSITION_SOURCE = String.raw`(?:adjacent|both|center|centre|corresponding|each|end|every|fifth|first|following|fourth|last|marked|marker|next|opposite|previous|remaining|same|second|sixth|third|\p{N}+(?:st|nd|rd|th)?)`;
const TARGET_LOCATION_NOUN_SOURCE = String.raw`(?:${TARGET_STITCH_TERM_SOURCE}|chains?|hooks?|loops?|markers?|rounds?|rows?|spaces?|st(?:s|itch(?:es)?)?)`;
const TARGET_SIMPLE_LOCATION_SOURCE = String.raw`(?:the[\t\p{Zs}]+)?${TARGET_POSITION_SOURCE}[\t\p{Zs}]+${TARGET_LOCATION_NOUN_SOURCE}`;
const TARGET_POSITIONAL_LOCATION_SOURCE = String.raw`(?:in|into|at|before|behind|below|between|from|on|over|through|to|under|until|with|within)[\t\p{Zs}]+${TARGET_SIMPLE_LOCATION_SOURCE}`;
const TARGET_CHAIN_LOCATION_SOURCE = String.raw`(?:in|into)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:ch|chain)(?:(?:(?:[\t\p{Zs}]*[-‐‑‒–—―−﹣－][\t\p{Zs}]*|[\t\p{Zs}]+)\p{N}+[\t\p{Zs}]+(?:spaces?|sps?)\b)|[\t\p{Zs}]+(?:spaces?|sps?)\b)?`;
const TARGET_STITCH_LOCATION_SOURCE = String.raw`(?:across|around|${TARGET_CHAIN_LOCATION_SOURCE}|${TARGET_POSITIONAL_LOCATION_SOURCE})`;
const TARGET_CLAUSE_CONNECTOR_SOURCE = String.raw`(?:(?:and|or)(?:[\t\p{Zs}]+then)?|then)`;
const TARGET_CLAUSE_SEPARATOR_SOURCE = String.raw`[\t\p{Zs}]*(?:[,;][\t\p{Zs}]*(?:${TARGET_CLAUSE_CONNECTOR_SOURCE}[\t\p{Zs}]+)?|${TARGET_CLAUSE_CONNECTOR_SOURCE}[\t\p{Zs}]+)`;
const TARGET_COUNTED_STITCH_TERM_SOURCE = String.raw`(?:\p{N}+[\t\p{Zs}]+)?(?:${TARGET_STITCH_TERM_SOURCE})`;
const TARGET_STITCH_TERM_LIST_SOURCE = String.raw`${TARGET_COUNTED_STITCH_TERM_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_COUNTED_STITCH_TERM_SOURCE}){0,7}`;
const TARGET_STITCH_CLAUSE_SOURCE = String.raw`${TARGET_STITCH_TERM_LIST_SOURCE}[\t\p{Zs}]+${TARGET_STITCH_LOCATION_SOURCE}`;
const TARGET_CHAIN_COUNT_CLAUSE_SOURCE = String.raw`(?:(?:ch|chain)[\t\p{Zs}]+\p{N}+|\p{N}+[\t\p{Zs}]+(?:ch|chains?))`;
const TARGET_COMMAND_CLAUSE_SOURCE = String.raw`(?:
  (?:work|make)[\t\p{Zs}]+${TARGET_STITCH_CLAUSE_SOURCE}
  |(?:join|sl[\t\p{Zs}]+st)[\t\p{Zs}]+${TARGET_POSITIONAL_LOCATION_SOURCE}
  |(?:skip|sk|miss)[\t\p{Zs}]+${TARGET_SIMPLE_LOCATION_SOURCE}
  |(?:add|place)[\t\p{Zs}]+(?:(?:a|the)[\t\p{Zs}]+)?marker
  |(?:begin|beg|start)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:new|next|following)[\t\p{Zs}]+(?:round|row)
  |(?:use|using)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:new|next|same)[\t\p{Zs}]+(?:colou?r|yarn)
  |crochet[\t\p{Zs}]+(?:across|around)
  |(?:increase|decrease)[\t\p{Zs}]+${TARGET_POSITIONAL_LOCATION_SOURCE}
  |insert[\t\p{Zs}]+hook[\t\p{Zs}]+${TARGET_POSITIONAL_LOCATION_SOURCE}
  |pull[\t\p{Zs}]+${TARGET_POSITIONAL_LOCATION_SOURCE}
  |yo[\t\p{Zs}]+and[\t\p{Zs}]+pull[\t\p{Zs}]+through
  |yo
  |repeat[\t\p{Zs}]+from[\t\p{Zs}]+\*
  |use[\t\p{Zs}]+(?:${TARGET_STITCH_TERM_SOURCE})[\t\p{Zs}]+(?:cluster|motif|stitch)
  |keep[\t\p{Zs}]+(?:${TARGET_STITCH_TERM_SOURCE})
  |fasten[\t\p{Zs}]+off
  |continue|cont|finish|repeat|rep|turn
)`.replace(/[\r\n\t ]+/g, "");
const TARGET_CONTINUATION_CLAUSE_SOURCE = String.raw`(?:${TARGET_STITCH_CLAUSE_SOURCE}|${TARGET_CHAIN_COUNT_CLAUSE_SOURCE}|${TARGET_COMMAND_CLAUSE_SOURCE})`;
const TARGET_FINAL_TERMINATOR_SOURCE = String.raw`[\t\p{Zs}]*(?:[.!?](?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])|[)}\]]+[\t\p{Zs}]*(?:[.!?](?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])|\r?\n|$)|\r?\n|$)`;
const TARGET_BOUNDED_CLAUSE_CONTINUATION_SOURCE = String.raw`${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}){0,11}${TARGET_FINAL_TERMINATOR_SOURCE}`;
const TARGET_CLAUSE_TERMINATOR_SOURCE = String.raw`(?:${TARGET_FINAL_TERMINATOR_SOURCE}|${TARGET_BOUNDED_CLAUSE_CONTINUATION_SOURCE})`;
const MARKDOWN_INSTRUCTION_LIST_MARKER_SOURCE = String.raw`(?:[-+*•·▪◦‣]|\p{N}+[.)]|\(\p{N}+\))`;
const OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE = String.raw`(?:>+[\t\p{Zs}]+)*(?:${MARKDOWN_INSTRUCTION_LIST_MARKER_SOURCE}[\t\p{Zs}]+)?`;
const REQUIRED_MARKDOWN_INSTRUCTION_MARKERS_SOURCE = String.raw`(?:(?:>+[\t\p{Zs}]+)+(?:${MARKDOWN_INSTRUCTION_LIST_MARKER_SOURCE}[\t\p{Zs}]+)?|${MARKDOWN_INSTRUCTION_LIST_MARKER_SOURCE}[\t\p{Zs}]+)`;
const STRONG_INSTRUCTION_LINE_PREFIX_SOURCE = String.raw`(?:^|\n)(?:${INSTRUCTION_HEADING_PREFIX_SOURCE}(?:${INSTRUCTION_HEADING_SOURCE}|${CONSTRUCTION_INSTRUCTION_HEADING_SOURCE})[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?|[\t\p{Zs}]*${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE})`;
const EXPLICIT_INSTRUCTION_HEADING_PREFIX = new RegExp(
  String.raw`(?:^|\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}(?:${INSTRUCTION_HEADING_SOURCE}|${CONSTRUCTION_INSTRUCTION_HEADING_SOURCE})[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`,
  "iu",
);
const CONSTRUCTION_INSTRUCTION_LINE_PREFIX_SOURCE = String.raw`(?:^|\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}${CONSTRUCTION_INSTRUCTION_HEADING_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`;
const CONSTRUCTION_INSTRUCTION_COMMAND_START_SOURCE = String.raw`(?:add|beg|begin|ch(?:ain)?|commence|complete|cont|continue|crochet|decrease|finish|increase|insert(?:[\t\p{Zs}]+hook)?|join|keep|make|miss|place|pull(?:[\t\p{Zs}]+through)?|rep|repeat|skip|sk|sl[\t\p{Zs}]+st|start|turn|use|using|work|yo|\p{N}+[\t\p{Zs}]+ch)`;
const EXPLICIT_CONSTRUCTION_INSTRUCTION_LINE_CONTEXT = new RegExp(
  String.raw`${CONSTRUCTION_INSTRUCTION_LINE_PREFIX_SOURCE}(?:${CONSTRUCTION_INSTRUCTION_COMMAND_START_SOURCE}\b|\p{N}+[\t\p{Zs}]+(?=(?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])))[^\r\n]*$`,
  "iu",
);
function isExplicitBoundedInstructionLineContext(value) {
  return EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(value)
    || EXPLICIT_CONSTRUCTION_INSTRUCTION_LINE_CONTEXT.test(value);
}
const POSITIONAL_INSTRUCTION_LEAD_SOURCE = String.raw`(?:(?:\p{N}+[\t\p{Zs}]+)?(?:${TARGET_STITCH_TERM_SOURCE})|hooks?|st(?:s|itch(?:es)?)?)`;
const POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE = String.raw`(?:in|into|at|before|behind|below|between|from|on|over|through|to|under|until|with|within)`;
const POSITIONAL_INSTRUCTION_TARGET_BEFORE_SOURCE = String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:(?:ch|chain)(?:[\t\p{Zs}]*[-‐‑‒–—―−﹣－][\t\p{Zs}]*|[\t\p{Zs}]+)\p{N}+[\t\p{Zs}]+counts[\t\p{Zs}]+as[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE}[\t\p{Zs}]+)?|(?:insert(?:[\t\p{Zs}]+hook)?|pull[\t\p{Zs}]+through|sl[\t\p{Zs}]+st|join|make|repeat|skip|sk|miss|increase|decrease|work)[\t\p{Zs}]+(?:(?:${POSITIONAL_INSTRUCTION_LEAD_SOURCE})[\t\p{Zs}]+)?(?:(?:${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE})[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE}[\t\p{Zs}]+)?|(?:the[\t\p{Zs}]+)?${TARGET_POSITION_SOURCE}[\t\p{Zs}]+))`;
const EXPLICIT_HEADING_BARE_POSITIONAL_SOURCE_BEFORE = new RegExp(
  String.raw`${EXPLICIT_INSTRUCTION_HEADING_PREFIX.source}(?:\p{N}+[\t\p{Zs}]+)?(?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])[\t\p{Zs}]+(?:${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE})[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+$`,
  "iu",
);
const COMMAND_SUPPORTED_TERM_LEAD_SOURCE = String.raw`(?:(?:(?:\p{N}+|a|an|the|one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth|sixth|next|remaining)[\t\p{Zs}]+)|(?:colou?r[\t\p{Zs}]+[A-Z]\p{N}?[\t\p{Zs}]+)|(?:yarn[\t\p{Zs}]+over[\t\p{Zs}]*,[\t\p{Zs}]*))?`;
const BOUNDED_COMMAND_SUPPORTED_TERM_FIRST_BEFORE_SOURCE = String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:work|make)[\t\p{Zs}]+${COMMAND_SUPPORTED_TERM_LEAD_SOURCE}`;
const BOUNDED_COMMAND_SUPPORTED_TERM_LIST_BEFORE_SOURCE = String.raw`${BOUNDED_COMMAND_SUPPORTED_TERM_FIRST_BEFORE_SOURCE}(?:${TARGET_STITCH_TERM_SOURCE})(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}(?:${TARGET_STITCH_TERM_SOURCE})){0,7}${TARGET_CLAUSE_SEPARATOR_SOURCE}`;
const BOUNDED_PARENTHESIZED_SUPPORTED_TERM_LIST_BEFORE_SOURCE = String.raw`\((?:${TARGET_STITCH_TERM_SOURCE})(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}(?:${TARGET_STITCH_TERM_SOURCE})){0,7}${TARGET_CLAUSE_SEPARATOR_SOURCE}`;
const SHARED_STITCH_LIST_QUANTIFIER_SOURCE = String.raw`(?:(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten|\p{N}+)[\t\p{Zs}]+)?`;
const SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE = String.raw`${SHARED_STITCH_LIST_QUANTIFIER_SOURCE}(?:${SOURCE_STITCH_TERM_SOURCE})`;
const SHARED_STITCH_LIST_EMPHASIZED_ITEM_SOURCE = String.raw`(?:\*\*\*${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}\*\*\*|___${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}___|\*\*${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}\*\*|__${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}__|\*${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}\*|_${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}_)`;
const SHARED_STITCH_LIST_TERM_EMPHASIZED_ITEM_SOURCE = String.raw`${SHARED_STITCH_LIST_QUANTIFIER_SOURCE}(?:\*\*\*(?:${SOURCE_STITCH_TERM_SOURCE})\*\*\*|___(?:${SOURCE_STITCH_TERM_SOURCE})___|\*\*(?:${SOURCE_STITCH_TERM_SOURCE})\*\*|__(?:${SOURCE_STITCH_TERM_SOURCE})__|\*(?:${SOURCE_STITCH_TERM_SOURCE})\*|_(?:${SOURCE_STITCH_TERM_SOURCE})_)`;
const SHARED_STITCH_LIST_VISIBLE_ITEM_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_EMPHASIZED_ITEM_SOURCE}|${SHARED_STITCH_LIST_TERM_EMPHASIZED_ITEM_SOURCE}|${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE})`;
const MARKDOWN_REFERENCE_LABEL_CHARACTER_SOURCE = String.raw`(?:\\[^\r\n]|[^\[\]\\\r\n])`;
const SHARED_STITCH_LIST_LINK_SUFFIX_SOURCE = String.raw`(?:\([^\r\n)]{0,2048}\)|\[(?:${MARKDOWN_REFERENCE_LABEL_CHARACTER_SOURCE}){0,999}\])`;
const SHARED_STITCH_LIST_LINKED_ITEM_SOURCE = String.raw`\[[\t\p{Zs}]*${SHARED_STITCH_LIST_VISIBLE_ITEM_SOURCE}[\t\p{Zs}]*\]${SHARED_STITCH_LIST_LINK_SUFFIX_SOURCE}`;
const SHARED_STITCH_LIST_EMPHASIS_TOKEN_SOURCE = String.raw`(?:\*{1,3}|_{1,3})`;
const SHARED_STITCH_LIST_OUTER_LINK_EMPHASIZED_SOURCE = String.raw`${SHARED_STITCH_LIST_EMPHASIS_TOKEN_SOURCE}${SHARED_STITCH_LIST_LINKED_ITEM_SOURCE}${SHARED_STITCH_LIST_EMPHASIS_TOKEN_SOURCE}`;
const SHARED_STITCH_LIST_NESTED_OUTER_LINK_EMPHASIZED_SOURCE = String.raw`${SHARED_STITCH_LIST_EMPHASIS_TOKEN_SOURCE}{2}${SHARED_STITCH_LIST_LINKED_ITEM_SOURCE}${SHARED_STITCH_LIST_EMPHASIS_TOKEN_SOURCE}{2}`;
const SHARED_STITCH_LIST_LINK_ITEM_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_NESTED_OUTER_LINK_EMPHASIZED_SOURCE}|${SHARED_STITCH_LIST_OUTER_LINK_EMPHASIZED_SOURCE}|${SHARED_STITCH_LIST_LINKED_ITEM_SOURCE})`;
const SHARED_STITCH_LIST_STRUCTURAL_LINK_ITEM_SOURCE = String.raw`(?:\([\t\p{Zs}]*${SHARED_STITCH_LIST_LINK_ITEM_SOURCE}[\t\p{Zs}]*\)|\{[\t\p{Zs}]*${SHARED_STITCH_LIST_LINK_ITEM_SOURCE}[\t\p{Zs}]*\})`;
const SHARED_STITCH_LIST_ITEM_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_STRUCTURAL_LINK_ITEM_SOURCE}|${SHARED_STITCH_LIST_LINK_ITEM_SOURCE}|${SHARED_STITCH_LIST_VISIBLE_ITEM_SOURCE})`;
const SHARED_STITCH_LIST_SEPARATOR_SOURCE = String.raw`(?:[\t\p{Zs}]*[,/／][\t\p{Zs}]*(?:(?:and|or|then)[\t\p{Zs}]+)?|[\t\p{Zs}]*;[\t\p{Zs}]*(?:then[\t\p{Zs}]+)?|[\t\p{Zs}]*(?:(?:and|or)(?:[\t\p{Zs}]+then)?|then)[\t\p{Zs}]+)`;
const SHARED_STITCH_LIST_SOURCE = String.raw`${SHARED_STITCH_LIST_ITEM_SOURCE}(?:${SHARED_STITCH_LIST_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_ITEM_SOURCE}){1,7}`;
const SHARED_STITCH_LIST_VISIBLE_ITEM = new RegExp(
  String.raw`^[\t\p{Zs}]*${SHARED_STITCH_LIST_VISIBLE_ITEM_SOURCE}[\t\p{Zs}]*$`,
  "iu",
);
const SHARED_STITCH_LIST_COMPLETE_LABEL = new RegExp(
  String.raw`^[\t\p{Zs}]*${SHARED_STITCH_LIST_SOURCE}[\t\p{Zs}]*$`,
  "iu",
);
const STRONG_UNQUALIFIED_ROW_TARGET_BEFORE_SOURCE = String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:(?:ch|chain)(?:[\t\p{Zs}]*[-‐‑‒–—―−﹣－][\t\p{Zs}]*|[\t\p{Zs}]+)\p{N}+[\t\p{Zs}]+counts[\t\p{Zs}]+as[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?|(?:insert|join|make|repeat|skip|work)[\t\p{Zs}]+(?:(?:in|into|on|to|under|with|within)[\t\p{Zs}]+)?(?:the[\t\p{Zs}]+)?)(?:adjacent|center|centre|corresponding|each|every|fifth|first|following|fourth|last|marked|next|opposite|previous|remaining|same|second|sixth|third|\p{N}+(?:st|nd|rd|th)?)[\t\p{Zs}]+`;
const FOLLOWING_TARGET_QUALIFIER_SOURCE = String.raw`(?:[\t\p{Zs}]+(?:made|worked|formed)|[\t\p{Zs}]+of[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:current|fifth|first|following|fourth|last|next|preceding|previous|same|second|sixth|third|\p{N}+(?:st|nd|rd|th)?)[\t\p{Zs}]+(?:rounds?|rows?|spaces?|st(?:s|itch(?:es)?)?))(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`;
const FOLLOWING_UNQUALIFIED_ROW_TARGET_SOURCE = String.raw`[\t\p{Zs}]+of[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:round|row)(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`;
const FOLLOWING_CHAIN_TARGET_CORE_SOURCE = String.raw`[\t\p{Zs}]+(?:in|into)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:ch|chain)(?:(?:(?:[\t\p{Zs}]*[-‐‑‒–—―−﹣－][\t\p{Zs}]*|[\t\p{Zs}]+)\p{N}+[\t\p{Zs}]+(?:spaces?|sps?)\b)|[\t\p{Zs}]+(?:spaces?|sps?)\b)?`;
const FOLLOWING_CHAIN_TARGET_SOURCE = String.raw`${FOLLOWING_CHAIN_TARGET_CORE_SOURCE}(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`;
const FOLLOWING_GENERIC_TARGET_CORE_SOURCE = String.raw`(?:[\t\p{Zs}]+(?:across|around)|[\t\p{Zs}]+(?:in|into|at|before|behind|below|between|from|on|over|through|to|under|until|with|within)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:adjacent|center|centre|corresponding|each|end|every|fifth|first|following|fourth|last|marked|marker|next|opposite|previous|remaining|same|second|sixth|third|\p{N}+(?:st|nd|rd|th)?)[\t\p{Zs}]+(?:chains?|hooks?|loops?|markers?|rounds?|rows?|spaces?|st(?:s|itch(?:es)?)?))`;
const FOLLOWING_BARE_COUNT_TARGET_SOURCE = String.raw`${FOLLOWING_GENERIC_TARGET_CORE_SOURCE}(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`;

function termMatcher(term) {
  const escaped = escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE);
  if (ISOLATED_STITCH_TERMS.has(term)) {
    // A spelled-out stitch phrase is changed only in bounded, recognizable
    // instruction contexts. This avoids rewriting a supported phrase nested
    // in an unknown compound stitch name or ordinary prose.
    return new RegExp(
      `(^\\s*|[\\n*,:;/(\\[{\"'\\-]\\s*|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])\\p{N}+[\\t\\p{Zs}]+|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:${TARGET_POSITION_SOURCE})[\\t\\p{Zs}]+|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:work|make|place|add|crochet)[\\t\\p{Zs}]+(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten)[\\t\\p{Zs}]+|(?:^|\\n)[\\t\\p{Zs}]*${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|join|keep|make|miss|place|repeat|skip|start|turn|use|using|work)[\\t\\p{Zs}]+|${BOUNDED_COMMAND_SUPPORTED_TERM_FIRST_BEFORE_SOURCE}|${BOUNDED_COMMAND_SUPPORTED_TERM_LIST_BEFORE_SOURCE}|${BOUNDED_PARENTHESIZED_SUPPORTED_TERM_LIST_BEFORE_SOURCE}|${POSITIONAL_INSTRUCTION_TARGET_BEFORE_SOURCE}|${STRONG_UNQUALIFIED_ROW_TARGET_BEFORE_SOURCE}|(?:^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:keep|then|now)[\\t\\p{Zs}]+|(?:^|\\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}${INSTRUCTION_HEADING_SOURCE}[\\t\\p{Zs}]*(?:(?:\\*\\*|__)[\\t\\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\\t\\p{Zs}]*(?:(?:\\*\\*|__)[\\t\\p{Zs}]*)?(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten)[\\t\\p{Zs}]+)(${escaped})(?=$|\\s*[\\n,./;:!?\\)\\]}\"'\\-]|[\\t\\p{Zs}]+(?:and|or|then|in|into|across|around|at|before|behind|below|between|from|on|over|through|to|under|until|with|within)\\b|${FOLLOWING_TARGET_QUALIFIER_SOURCE}|${FOLLOWING_UNQUALIFIED_ROW_TARGET_SOURCE}|${FOLLOWING_CHAIN_TARGET_SOURCE})`,
      "giu",
    );
  }
  return new RegExp(`(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(${escaped})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`, "giu");
}

function countedSpelledOutTermMatchers(entry) {
  const countSource = String.raw`(?:once|twice|thrice|(?:\p{N}+|[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)?)[\t\p{Zs}]+times?)`;
  const commandPrefix = String.raw`(?:^|\n)[\t\p{Zs}]*${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|join|make|miss|place|repeat|skip|start|turn|use|using|work)[\t\p{Zs}]+(?:(?:a|an|the|\p{N}+)[\t\p{Zs}]+)?`;
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

const SOURCE_TERM_MATCHER_PREFILTERS = new WeakMap();
const SOURCE_TERM_MATCHERS_BY_ENTRY = new Map(UK_TO_US_TERMS.map((entry) => {
  const parenthesized = parenthesizedPairMatchers(entry);
  const termMatchers = entry.terms.map((term) => {
    const matcher = termMatcher(term);
    if (ISOLATED_STITCH_TERMS.has(term)) {
      const source = escapeRegex(term).replace(/ /g, TERM_GAP_SOURCE);
      SOURCE_TERM_MATCHER_PREFILTERS.set(
        matcher,
        new RegExp(
          `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])${source}(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
          "iu",
        ),
      );
    }
    return matcher;
  });
  const variants = [
    ...parenthesized,
    ...underscoredTermMatchers(entry),
    ...countedSpelledOutTermMatchers(entry),
    ...termMatchers,
  ];
  return [entry, { parenthesized, variants }];
}));

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

const DEFINITION_BLOCKQUOTE_PREFIX_SOURCE = String.raw`(?:(?:>[\t\p{Zs}]*)+)?`;
const DEFINITION_LIST_MARKER_SOURCE = String.raw`(?:(?:[+\-*•·▪◦‣]|[\p{L}\p{N}]+[.)]|\([\p{L}\p{N}]+\))[\t\p{Zs}]+)?`;
const DEFINITION_HEADING_PREFIX_SOURCE = String.raw`(?:#{1,6}[\t\p{Zs}]+)?`;
const DEFINITION_STRUCTURAL_PREFIX_SOURCE = String.raw`[\t\p{Zs}]*${DEFINITION_BLOCKQUOTE_PREFIX_SOURCE}${DEFINITION_LIST_MARKER_SOURCE}${DEFINITION_HEADING_PREFIX_SOURCE}`;
const DEFINITION_HEADER_PREFIX_SOURCE = String.raw`${DEFINITION_STRUCTURAL_PREFIX_SOURCE}(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`;
const DEFINITION_HEADER_SUFFIX_SOURCE = String.raw`(?:[\t\p{Zs}]*\((?:continued|cont\.?|uk|british)\))?`;
const DEFINITION_HEADER_WRAPPER_SOURCE = String.raw`(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE})?`;
const DEFINITION_LIST_PREFIX_SOURCE = String.raw`${DEFINITION_BLOCKQUOTE_PREFIX_SOURCE}${DEFINITION_LIST_MARKER_SOURCE}${DEFINITION_HEADING_PREFIX_SOURCE}`;
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
const QUOTE_WRAPPED_DEFINITION_KEY = /^(?:"[^"\r\n]+"|'[^'\r\n]+'|“[^”\r\n]+”|‘[^’\r\n]+’)$/u;
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
  String.raw`^(?<prefix>${DEFINITION_STRUCTURAL_PREFIX_SOURCE})(?<wrapper>${MARKDOWN_EMPHASIS_WRAPPER_SOURCE})(?<inner>[^\r\n]*?)\k<wrapper>(?<rest>.*)$`,
  "u",
);
const DEFINITION_SIDE_QUALIFIER_SUFFIX = /[\t\p{Zs}]*(?:\((?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side)\)|\[(?:rs|ws)\]|,[\t\p{Zs}]*(?:rs|ws|right[\t\p{Zs}]+side|wrong[\t\p{Zs}]+side))[\t\p{Zs}]*$/iu;
const MAX_DEFINITION_CLASSIFICATION_NORMALIZATION_STEPS = 64;
const MAX_SIMPLE_QUOTED_ASCII_COLON_KEY_LENGTH = 512;
const SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW = Symbol(
  "simple-quoted-definition-boundary-overflow",
);

function maskFormattedDefinitionLead(value) {
  const match = value.match(FORMATTED_DEFINITION_LEAD);
  if (!match) return value;
  const { prefix, wrapper, inner, rest } = match.groups;
  return `${prefix}${" ".repeat(wrapper.length)}${inner}${" ".repeat(wrapper.length)}${rest}`;
}

function isDefinitionShapedEntry(
  match,
  preferNamedStitches = false,
  rawKey = match.groups.key,
) {
  const key = rawKey.trim();
  const classificationKey = normalizeDefinitionClassificationKey(key);
  if (classificationKey === null) return true;
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
  for (const wrapper of ["***", "___", "**", "__", "*", "_", "`"]) {
    if (
      normalized.startsWith(wrapper)
      && normalized.endsWith(wrapper)
      && normalized.length > wrapper.length * 2
    ) {
      normalized = normalized.slice(wrapper.length, -wrapper.length).trim();
      break;
    }
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

function normalizeDefinitionClassificationKey(value) {
  let normalized = value;
  for (let step = 0; step < MAX_DEFINITION_CLASSIFICATION_NORMALIZATION_STEPS; step += 1) {
    const next = normalizeDefinitionKey(
      normalized.replace(DEFINITION_SIDE_QUALIFIER_SUFFIX, "").trim(),
    )
      .replace(DEFINITION_SIDE_QUALIFIER_SUFFIX, "")
      .trim();
    if (next === normalized) return next;
    normalized = next;
  }
  const next = normalizeDefinitionKey(
    normalized.replace(DEFINITION_SIDE_QUALIFIER_SUFFIX, "").trim(),
  )
    .replace(DEFINITION_SIDE_QUALIFIER_SUFFIX, "")
    .trim();
  return next === normalized ? normalized : null;
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
  if (hasSupportedTermProseContinuation(remainder)) return true;
  while (true) {
    const connector = remainder.match(/^[\t\p{Zs}]*(?:[,，、/／&＆+＋|｜][\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|(?:and|or)[\t\p{Zs}]+)/iu);
    if (!connector) break;
    const afterConnector = remainder.slice(connector[0].length);
    const term = afterConnector.match(SUPPORTED_TERM_SEQUENCE_PREFIX);
    if (!term) break;
    const afterTerm = afterConnector.slice(term[0].length);
    if (/^[-‐‑‒–—―−﹣－\p{Pc}\p{Cf}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]/u.test(afterTerm)) return true;
    remainder = afterTerm;
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
      || hasBoundedSupportedTermContinuation(remainder)
      || BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION.test(remainder)
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
        && !QUOTE_WRAPPED_DEFINITION_KEY.test(entry.key.trim())
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
  const sourceReferenceRanges = findSourceReferenceRanges(text);
  const nonInstructionMetadataRanges = findNonInstructionMetadataRanges(text);
  const quotedInstructionRanges = findSimpleQuotedInstructionProtectionRanges(text);
  const protectedRanges = [
    ...sourceReferenceRanges,
    ...nonInstructionMetadataRanges,
    ...quotedInstructionRanges,
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
      const absoluteDelimiterStart = delimiter
        ? line.start + entryStart + delimiter.index
        : -1;
      const delimiterIsProtected = delimiter && protectedRanges.some((range) => (
        range.start <= absoluteDelimiterStart && range.end > absoluteDelimiterStart
      ));
      if (delimiter && !delimiterIsProtected) {
        const rawKeys = entryText.slice(0, delimiter.index).trim();
        const definitionKeys = splitDefinitionKeys(rawKeys);
        const normalizedKeys = definitionKeys.map(normalizeDefinitionKey);
        const definitionValue = entryText.slice(delimiter.index + delimiter[0].length).trim();
        const dashIsBoundedChainTarget = Boolean(
          delimiter.groups.dashDelimiter
          && isStrongMainInstructionLine(entryText)
          && /\b(?:in|into)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:ch|chain)$/iu.test(rawKeys)
          && /^\p{N}+[\t\p{Zs}]+(?:sps?|spaces?)(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])/iu.test(definitionValue)
        );
        const dashIsHyphenatedRepetitionCount = Boolean(
          delimiter.groups.dashDelimiter
          && isStrongMainInstructionLine(entryText)
          && /[\p{L}\p{M}]+$/u.test(rawKeys)
          && /^[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)*[\t\p{Zs}]+times?\b/iu.test(definitionValue)
        );
        const absoluteStart = line.start + entryStart;
        const absoluteEnd = line.start + segmentEnd;
        const absoluteValueStart = line.start + entryStart + delimiter.index + delimiter[0].length;
        if (
          definitionKeys.length >= 2
          && !dashIsBoundedChainTarget
          && !dashIsHyphenatedRepetitionCount
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
  if (!text.includes("|")) return [];
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
    /^(?:>+[\t\p{Zs}]+)*(?:(?:[-+*]|\p{N}+[.)]|\(\p{N}+\))[\t\p{Zs}]+)?(?:#{1,6}[\t\p{Zs}]+)?/u,
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
  if (/^(?:body|main(?:[\t\p{Zs}]+pattern)?|pattern(?:[\t\p{Zs}]+instructions?)?|instructions?|directions?|notes?|gauge|tension|materials?|sizes?|measurements?|border|edging|begin[\t\p{Zs}]+here|start(?:ing[\t\p{Zs}]+row|[\t\p{Zs}]+here)?|to[\t\p{Zs}]+begin|beginning|front|back|sleeves?|cuffs?|collars?|neckband|button(?:hole)?[\t\p{Zs}]+band|front[\t\p{Zs}]+band|sleeve[\t\p{Zs}]+top|underarm|raglan(?:[\t\p{Zs}]+shaping)?|back[\t\p{Zs}]+neck|neck[\t\p{Zs}]+edging|shoulder[\t\p{Zs}]+shaping|pocket[\t\p{Zs}]+lining|make[\t\p{Zs}]+up|(?:left|right|upper|lower)[\t\p{Zs}]+(?:front|back|sleeves?|side|panel)|yoke|skirt|crown|ribb?ing|shape[\t\p{Zs}]+armholes?|brim|hood|cape|assembly|finishing|next[\t\p{Zs}]+section)$/iu.test(trimmed)) {
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
    ...findSimplePhysicalLineQuotedDefinitionRecordRanges(text),
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
  "beg", "cont", "decrease", "finish", "htr", "in", "increase", "into", "join", "keep", "last", "make", "miss", "next", "now", "of", "rep",
  "inside", "marked", "near", "on", "one", "opposite", "or", "outside", "over", "place", "previous", "remaining", "repeat", "rnd", "round", "row", "same", "second", "see", "sixth", "skip", "space",
  "spaces", "st", "stitch", "stitches", "then", "third", "three", "through", "times", "to", "toward", "towards", "tr",
  "the", "turn", "twice", "two", "under", "until", "upon", "use", "using", "with", "within", "work", "start",
]);
const STRONG_PRECEDING_INSTRUCTION_WORDS = new Set([
  "add", "chain", "continue", "crochet", "decrease", "increase", "join", "keep", "knit", "make", "miss", "place", "purl", "repeat", "skip", "turn", "work",
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
const SAME_LINE_ACTION_LIST_CONTEXT = /(?:^|\n)[\t\p{Zs}]*(?:(?:ch(?:ain)?|work|skip|miss|make|join|repeat|turn|sk|yo|beg|rep|cont|sc)\b|sl[\t\p{Zs}]+st\b|insert[\t\p{Zs}]+hook\b|pull[\t\p{Zs}]+through\b|\p{N}+[\t\p{Zs}]+(?:ch|dc|dtr|htr|tr)\b)[^\r\n]{0,120}(?:[,;][\t\p{Zs}]*(?:then[\t\p{Zs}]+)?)$/iu;
const SAME_LINE_CURRENT_TERM_PREFIX_SOURCE = String.raw`(?:(?:(?:work|make)[\t\p{Zs}]+)?(?:\p{N}+[\t\p{Zs}]+)?|(?:join|sl[\t\p{Zs}]+st|increase|decrease)[\t\p{Zs}]+${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE}[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?${TARGET_POSITION_SOURCE}[\t\p{Zs}]+|insert[\t\p{Zs}]+hook[\t\p{Zs}]+${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE}[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?${TARGET_POSITION_SOURCE}[\t\p{Zs}]+|pull[\t\p{Zs}]+${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE}[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?${TARGET_POSITION_SOURCE}[\t\p{Zs}]+|(?:skip|sk|miss)[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?${TARGET_POSITION_SOURCE}[\t\p{Zs}]+)`;
const BOUNDED_SAME_LINE_CLAUSE_CONTEXT = new RegExp(
  `${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}){0,2}${TARGET_CLAUSE_SEPARATOR_SOURCE}${SAME_LINE_CURRENT_TERM_PREFIX_SOURCE}$`,
  "iu",
);
const NUMBERED_INSTRUCTION_PREFIX = /(?:^|\n)[\t\p{Zs}]*(?:(?:\p{N}+[.)]|\(\p{N}+\))|step[\t\p{Zs}]+\p{N}+[.)])[\t\p{Zs}]*$/iu;
const BOUNDED_UPPERCASE_COMMAND_BEFORE = new RegExp(
  String.raw`(?:^|\n)[\t\p{Zs}]*${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}(?:(?:(?:at[\t\p{Zs}]+marker|with[\t\p{Zs}]+colou?r)\b[^,\r\n]{0,40},[\t\p{Zs}]*)|(?:in[\t\p{Zs}]+space[\t\p{Zs}]+[A-Z]\p{N}?[\t\p{Zs}]*,[\t\p{Zs}]*)|(?:(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|join|make|miss|place|repeat|skip|start|turn|use|using|work)\b[^\r\n]{0,120}))$`,
  "iu",
);
const BOUNDED_UPPERCASE_SHORTHAND_BEFORE = new RegExp(
  String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:(?:sk|yo|beg|rep|cont)[\t\p{Zs}]+|\p{N}+[\t\p{Zs}]+ch(?:${TARGET_CLAUSE_SEPARATOR_SOURCE})?)$`,
  "iu",
);
const BOUNDED_INLINE_COMMAND_BEFORE = new RegExp(
  String.raw`(?:^|[,;.!?])[\t\p{Zs}]*(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|insert|join|keep|make|miss|place|pull|repeat|skip|start|turn|use|using|work|yo)\b[^\r\n,;.!?]{0,120}$`,
  "iu",
);
const POSITIONAL_INSTRUCTION_TARGET_BEFORE = new RegExp(
  `${POSITIONAL_INSTRUCTION_TARGET_BEFORE_SOURCE}$`,
  "iu",
);
const POSITIONAL_STITCH_ACTION_SOURCE = String.raw`(?:\p{N}+[\t\p{Zs}]+)?(?:${TARGET_STITCH_TERM_SOURCE})`;
const POSITIONAL_STITCH_TARGET_LEAD_SOURCE = String.raw`(?:${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE})[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+`;
const POSITIONAL_STITCH_CLAUSE_SOURCE = String.raw`(?:(?:make|work)[\t\p{Zs}]+)?${POSITIONAL_STITCH_ACTION_SOURCE}[\t\p{Zs}]+${POSITIONAL_STITCH_TARGET_LEAD_SOURCE}(?:${TARGET_STITCH_TERM_SOURCE})`;
const BOUNDED_POSITIONAL_CHAIN_TARGET_BEFORE = new RegExp(
  String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:make|work)[\t\p{Zs}]+${POSITIONAL_STITCH_ACTION_SOURCE}[\t\p{Zs}]+${POSITIONAL_STITCH_TARGET_LEAD_SOURCE}(?:${TARGET_STITCH_TERM_SOURCE})(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}(?:${POSITIONAL_STITCH_CLAUSE_SOURCE}|${TARGET_COMMAND_CLAUSE_SOURCE})){0,6}${TARGET_CLAUSE_SEPARATOR_SOURCE}(?:(?:make|work)[\t\p{Zs}]+)?${POSITIONAL_STITCH_ACTION_SOURCE}[\t\p{Zs}]+${POSITIONAL_STITCH_TARGET_LEAD_SOURCE}$`,
  "iu",
);
const NON_POSITIONAL_COMMAND_TARGET_BEFORE = new RegExp(
  String.raw`(?:^|\n)[\t\p{Zs}]*${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}(?:insert|join|make|repeat|skip|work)\b[^,;\r\n]{0,120}\b(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+$`,
  "iu",
);
const IMMEDIATE_POSITIONAL_TARGET_BEFORE = new RegExp(
  String.raw`\b(?:${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE})[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+$`,
  "iu",
);
const PRECEDING_POSITION_TOKEN_BEFORE = new RegExp(
  String.raw`(?:^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:adjacent|both|center|centre|corresponding|each|end|every|fifth|first|following|fourth|last|marked|marker|next|opposite|previous|remaining|same|second|sixth|third|\p{N}+(?:st|nd|rd|th))[\t\p{Zs}]+$`,
  "iu",
);
const COMMAND_TARGET_CONTEXT_BEFORE = new RegExp(
  String.raw`(?:\b(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+|(?:${TARGET_STITCH_TERM_SOURCE})[\t\p{Zs}]*(?:[,;/][\t\p{Zs}]*|(?:and|or|then)[\t\p{Zs}]+))$`,
  "iu",
);
const PRECEDING_SUPPORTED_TERM_CONNECTOR_BEFORE = new RegExp(
  String.raw`(?:${TARGET_STITCH_TERM_SOURCE})[\t\p{Zs}]*(?:[,;/][\t\p{Zs}]*|(?:and|or|then)[\t\p{Zs}]+)$`,
  "iu",
);
const COMMAND_ARGUMENT_BEFORE = new RegExp(
  String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:add|beg|begin|commence|complete|cont|continue|crochet|decrease|finish|increase|insert[\t\p{Zs}]+hook|insert|join|make|miss|place|pull[\t\p{Zs}]+through|pull|rep|repeat|skip|sk|sl[\t\p{Zs}]+st|start|turn|use|using|work|yo)\b(?<argument>[^\r\n]{0,120})$`,
  "iu",
);
const POSITIONAL_COMMAND_CANDIDATE_BEFORE = new RegExp(
  String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:add|beg|begin|commence|complete|cont|continue|crochet|decrease|finish|increase|insert(?:[\t\p{Zs}]+hook)?|join|make|miss|place|pull(?:[\t\p{Zs}]+through)?|rep|repeat|skip|sk|sl[\t\p{Zs}]+st|start|turn|use|using|work|yo|\p{N}+[\t\p{Zs}]+ch|ch(?:ain)?[\t\p{Zs}]+\p{N}+)\b[^\r\n]{0,120}(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+$`,
  "iu",
);
const SAFE_COMMAND_LEAD_WORDS = new Set([
  "back", "both", "color", "colour", "front", "hook", "loop", "loops",
  "marker", "markers", "st", "sts", "stitch", "stitches", "yarn",
]);
const INLINE_CHAIN_COUNTS_AS_TARGET_BEFORE = new RegExp(
  String.raw`(?:^|[;.!?])[\t\p{Zs}]*(?:ch|chain)(?:[\t\p{Zs}]*[-‐‑‒–—―−﹣－][\t\p{Zs}]*|[\t\p{Zs}]+)\p{N}+[\t\p{Zs}]+counts[\t\p{Zs}]+as[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE}[\t\p{Zs}]+)?$`,
  "iu",
);
const FOLLOWING_INLINE_INSTRUCTION_CLAUSE = /^[\t\p{Zs}]*;[\t\p{Zs}]*(?:add|begin|ch(?:ain)?|commence|complete|continue|crochet|decrease|finish|increase|insert|join|make|miss|place|pull|repeat|skip|start|turn|use|using|work|yo)\b(?![\t\p{Zs}]+(?:appear|appears|are|is|means?|was|were)\b)/iu;
const STRONG_UNQUALIFIED_ROW_TARGET_BEFORE = new RegExp(
  `${STRONG_UNQUALIFIED_ROW_TARGET_BEFORE_SOURCE}$`,
  "iu",
);
const FOLLOWING_TARGET_QUALIFIER = new RegExp(`^${FOLLOWING_TARGET_QUALIFIER_SOURCE}`, "iu");
const FOLLOWING_UNQUALIFIED_ROW_TARGET = new RegExp(
  `^${FOLLOWING_UNQUALIFIED_ROW_TARGET_SOURCE}`,
  "iu",
);
const FOLLOWING_CHAIN_TARGET = new RegExp(`^${FOLLOWING_CHAIN_TARGET_SOURCE}`, "iu");
const FOLLOWING_CHAIN_TARGET_CORE = new RegExp(`^${FOLLOWING_CHAIN_TARGET_CORE_SOURCE}`, "iu");
const FOLLOWING_BARE_COUNT_TARGET = new RegExp(
  `^${FOLLOWING_BARE_COUNT_TARGET_SOURCE}`,
  "iu",
);
const FOLLOWING_GENERIC_TARGET_CORE = new RegExp(
  `^${FOLLOWING_GENERIC_TARGET_CORE_SOURCE}`,
  "iu",
);
const FOLLOWING_POSITIONAL_STITCH_TARGET_CORE_SOURCE = String.raw`[\t\p{Zs}]+(?:${POSITIONAL_INSTRUCTION_PREPOSITION_SOURCE})[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:${TARGET_POSITION_SOURCE})[\t\p{Zs}]+(?:${TARGET_STITCH_TERM_SOURCE})`;
const FOLLOWING_POSITIONAL_STITCH_TARGET_CORE = new RegExp(
  `^${FOLLOWING_POSITIONAL_STITCH_TARGET_CORE_SOURCE}`,
  "iu",
);
const FOLLOWING_POSITIONAL_STITCH_TARGET = new RegExp(
  `^${FOLLOWING_POSITIONAL_STITCH_TARGET_CORE_SOURCE}(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`,
  "iu",
);
const FOLLOWING_SUPPORTED_TARGET_CONTINUATION = new RegExp(
  String.raw`^${TARGET_CLAUSE_SEPARATOR_SOURCE}(?:\p{N}+[\t\p{Zs}]+)?(?:${TARGET_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);
const FOLLOWING_ROW_OR_ROUND_TARGET_SUFFIX = new RegExp(
  String.raw`^[\t\p{Zs}]+(?:row|round)${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const FOLLOWING_SIMPLE_INSTRUCTION_TARGET = new RegExp(
  `^[\\t\\p{Zs}]*(?:above|alone|below|turn|times?|st(?:s|itch(?:es)?)?)(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`,
  "iu",
);
const BOUNDED_UPPERCASE_BARE_INSTRUCTION_PREFIX = new RegExp(
  String.raw`(?:^|\n)[\t\p{Zs}]*${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}$`,
  "u",
);
const COUNTED_LIST_INSTRUCTION_PREFIX = new RegExp(
  String.raw`(?:^|\n)[\t\p{Zs}]*${REQUIRED_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}\p{N}+(?:st|nd|rd|th)?[\t\p{Zs}]+$`,
  "iu",
);
const BARE_COUNT_INSTRUCTION_PREFIX = /(?:^|\n)[\t\p{Zs}]*\p{N}+[\t\p{Zs}]+$/u;
const CONSTRUCTION_BARE_COUNT_INSTRUCTION_PREFIX = new RegExp(
  String.raw`${CONSTRUCTION_INSTRUCTION_LINE_PREFIX_SOURCE}\p{N}+[\t\p{Zs}]+$`,
  "iu",
);
const INLINE_EXACT_NUMERIC_COMMAND_COUNT_PREFIX = new RegExp(
  String.raw`(?:^|[;.!?])[\t\p{Zs}]*(?:add|beg|begin|commence|complete|cont|continue|crochet|decrease|finish|increase|insert(?:[\t\p{Zs}]+hook)?|join|make|miss|place|pull(?:[\t\p{Zs}]+through)?|rep|repeat|skip|sk|sl[\t\p{Zs}]+st|start|turn|use|using|work|yo)[\t\p{Zs}]+\p{N}+[\t\p{Zs}]*$`,
  "iu",
);
const FOLLOWING_NON_STITCH_SLASH_TOKEN = new RegExp(
  `^[\\t\\p{Zs}]*[\\\\/](?![\\t\\p{Zs}]*(?:${TARGET_STITCH_TERM_SOURCE})(?![\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}\\-‐‑‒–—―−﹣－]))[\\t\\p{Zs}]*[\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}]`,
  "iu",
);
const BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION = new RegExp(
  `^${TARGET_BOUNDED_CLAUSE_CONTINUATION_SOURCE}`,
  "iu",
);
const TARGET_FINAL_TERMINATOR = new RegExp(`^${TARGET_FINAL_TERMINATOR_SOURCE}`, "iu");
const FOLLOWING_SUPPORTED_TERM_CONNECTOR = /^(?:[\t\p{Zs}]*[,;/][\t\p{Zs}]*(?:(?:and|or|then)[\t\p{Zs}]+)?|[\t\p{Zs}]*(?:and|or|then)[\t\p{Zs}]+|[\t\p{Zs}]+)/iu;
const TRAILING_SUPPORTED_TERM_PROSE_PREDICATE = /^[\t\p{Zs}]*(?:(?:abbreviations?|examples?|labels?|terms?)[\t\p{Zs}]+)?(?:appear|appears|are|can|come|comes|could|denote|denotes|describe|describes|had|has|have|is|look|looks|may|mean|means|meant|might|occur|occurs|refer|refers|remain|remains|should|was|were|will|would)\b/iu;
const TRAILING_GENERIC_TARGET_PROSE = /^(?:[\t\p{Zs}]*[\])}]?[\t\p{Zs}]+as[\t\p{Zs}]+(?:(?:a|an|the)[\t\p{Zs}]+)?(?:abbreviation|example|glossary|label|metadata|phrase|prose|term|topic|word|wording)\b|[\t\p{Zs}]+(?:appear|appears|are|can|come|comes|could|denote|denotes|describe|describes|had|has|have|is|look|looks|may|mean|means|meant|might|occur|occurs|refer|refers|remain|remains|should|was|were|will|would)\b|[\t\p{Zs}]+in[\t\p{Zs}]+(?:(?:a|the)[\t\p{Zs}]+)?(?:example|glossary|journal|metadata|notes?|prose|record|text)\b|[\t\p{Zs}]+(?:example|glossary|history|journal|metadata|notes?|prose|record|text)\b|[\t\p{Zs}]*\.(?=\p{L}))/iu;
const GENERIC_TARGET_CLAUSE_SEPARATOR_SOURCE = String.raw`[\t\p{Zs}]*(?:[,;][\t\p{Zs}]*(?:(?:and|or|then)[\t\p{Zs}]+)?|(?:and|or|then)[\t\p{Zs}]+)`;
const TRAILING_GENERIC_TARGET_ACTION_PROSE = new RegExp(
  String.raw`^${GENERIC_TARGET_CLAUSE_SEPARATOR_SOURCE}(?:add|begin|beg|ch|chain|commence|complete|continue|cont|crochet|decrease|finish|increase|insert|join|make|miss|place|pull|repeat|rep|skip|sk|start|turn|use|using|work|yo)\b[^\r\n,;.!?]{0,80}\b(?:appear|appears|are|can|come|comes|could|denote|denotes|describe|describes|had|has|have|is|look|looks|may|mean|means|meant|might|occur|occurs|refer|refers|remain|remains|should|was|were|will|would)\b`,
  "iu",
);
const TRAILING_GENERIC_TARGET_UNBOUNDED_ACTION = new RegExp(
  String.raw`^${GENERIC_TARGET_CLAUSE_SEPARATOR_SOURCE}(?:add|begin|beg|ch|chain|commence|complete|continue|cont|crochet|decrease|finish|increase|insert|join|make|miss|place|pull|repeat|rep|skip|sk|start|turn|use|using|work|yo)\b`,
  "iu",
);
const TRAILING_GENERIC_TARGET_IDENTIFIER = new RegExp(
  String.raw`^${GENERIC_TARGET_CLAUSE_SEPARATOR_SOURCE}(?:(?:${TARGET_STITCH_TERM_SOURCE})[\t\p{Zs}]*(?:[\\.][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]|/(?![\t\p{Zs}]*(?:${TARGET_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]))[\t\p{Zs}]*[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])|(?:ch|chain)[\t\p{Zs}]*[-‐‑‒–—―−﹣－\p{Pc}\p{Cf}][\p{L}\p{M}\p{Pc}\p{Cf}])`,
  "iu",
);
const SHARED_LIST_SECTION_HEADING_SOURCE = CONSTRUCTION_INSTRUCTION_HEADING_SOURCE;
const SHARED_LIST_LINE_PREFIX_SOURCE = String.raw`(?:${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}|(?:^|\n)${INSTRUCTION_HEADING_PREFIX_SOURCE}${SHARED_LIST_SECTION_HEADING_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?)`;
const SHARED_LIST_COMMAND_AUTHORITY_BEFORE = new RegExp(
  String.raw`${SHARED_LIST_LINE_PREFIX_SOURCE}(?:make|repeat|see|work)[\t\p{Zs}]+${COMMAND_SUPPORTED_TERM_LEAD_SOURCE}$`,
  "iu",
);
const SHARED_LIST_INLINE_COMMAND_AUTHORITY_BEFORE = new RegExp(
  String.raw`(?:^|[;.!?])[\t\p{Zs}]*(?:make|repeat|see|work)[\t\p{Zs}]+${COMMAND_SUPPORTED_TERM_LEAD_SOURCE}$`,
  "iu",
);
const SHARED_LIST_COLOR_A_AUTHORITY_BEFORE = new RegExp(
  String.raw`${SHARED_LIST_LINE_PREFIX_SOURCE}(?:make|work)[\t\p{Zs}]+colou?r[\t\p{Zs}]+$`,
  "iu",
);
const SHARED_LIST_SAFE_USE_OBJECT_SOURCE = String.raw`(?:(?:(?:a|an|the|another|chosen|contrast|contrasting|current|different|first|main|matching|new|next|same|second|special|specified|waste|working|your)[\t\p{Zs}]+){0,4}(?:(?:colou?r|yarn)(?:[\t\p{Zs}]+[A-Z]\p{N}?)?|hook|needle|strand|thread))`;
const SHARED_LIST_NESTED_COMMAND_AUTHORITY_BEFORE = new RegExp(
  String.raw`${SHARED_LIST_LINE_PREFIX_SOURCE}(?:use|using)[\t\p{Zs}]+${SHARED_LIST_SAFE_USE_OBJECT_SOURCE}[\t\p{Zs}]+(?:and(?:[\t\p{Zs}]+then)?|then)[\t\p{Zs}]+(?:make|work)[\t\p{Zs}]+${COMMAND_SUPPORTED_TERM_LEAD_SOURCE}$`,
  "iu",
);
const SHARED_LIST_BARE_AUTHORITY_BEFORE = new RegExp(
  String.raw`${SHARED_LIST_LINE_PREFIX_SOURCE}$`,
  "iu",
);
const SHARED_LIST_INLINE_BARE_AUTHORITY_BEFORE = /(?:^|[;.!?])[\t\p{Zs}]*$/u;
const SHARED_LIST_PASSIVE_REMAINDER = new RegExp(
  String.raw`^[\t\p{Zs}]+(?:is|are)[\t\p{Zs}]+${PASSIVE_INSTRUCTION_VALUE_SOURCE}(?:[\t\p{Zs}]+${TARGET_STITCH_LOCATION_SOURCE})?${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const SHARED_LIST_REPETITION_REMAINDER = new RegExp(
  String.raw`^[\t\p{Zs}]+(?:once|twice|thrice|(?:\p{N}+|[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)?)[\t\p{Zs}]+times?)${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const FOLLOWING_BOUNDED_REPETITION_TARGET = new RegExp(
  String.raw`^[\t\p{Zs}]+(?:once|twice|thrice|(?:\p{N}+|[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)?)[\t\p{Zs}]+times?)[\t\p{Zs}]+${TARGET_STITCH_LOCATION_SOURCE}${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const SHARED_STRUCTURAL_WRAPPED_LIST_SOURCE = String.raw`(?:\([\t\p{Zs}]*${SHARED_STITCH_LIST_SOURCE}[\t\p{Zs}]*\)|\[[\t\p{Zs}]*${SHARED_STITCH_LIST_SOURCE}[\t\p{Zs}]*\]|\{[\t\p{Zs}]*${SHARED_STITCH_LIST_SOURCE}[\t\p{Zs}]*\})`;
const SHARED_TRAILING_WRAPPED_LIST_CLAUSE_SOURCE = String.raw`(?:(?:make|repeat|work)[\t\p{Zs}]+)?${SHARED_STRUCTURAL_WRAPPED_LIST_SOURCE}`;
const SHARED_LIST_TRAILING_WRAPPED_CLAUSES = new RegExp(
  String.raw`^${TARGET_CLAUSE_SEPARATOR_SOURCE}${SHARED_TRAILING_WRAPPED_LIST_CLAUSE_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${SHARED_TRAILING_WRAPPED_LIST_CLAUSE_SOURCE}){0,7}${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const SHARED_STITCH_LIST_FINDER = new RegExp(
  String.raw`(^|(?:\*{1,3}|_{1,3}|\x60)|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_LIST_SOURCE})(?=$|(?:\*{1,3}|_{1,3}|\x60)|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE = String.raw`(?:(?:[.\\]|[-‐‑‒–—―−﹣－\p{Pc}\p{Cf}]|/(?![\t\p{Zs}]*(?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])))[\p{Pc}\p{Cf}]*[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]*|[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]*|\p{Cf}+)`;
const SHARED_STITCH_LIST_CANDIDATE_ITEM_SOURCE = String.raw`${SHARED_STITCH_LIST_QUANTIFIER_SOURCE}(?:${SOURCE_STITCH_TERM_SOURCE})(?:${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE})?`;
const SHARED_STITCH_LIST_MALFORMED_SEPARATOR_SOURCE = String.raw`(?:[\t\p{Zs}]*,[\t\p{Zs}]*(?:(?:and|or)[\t\p{Zs}]+)?|[\t\p{Zs}]*(?:and|or)[\t\p{Zs}]+)`;
const SHARED_STITCH_LIST_MALFORMED_SOURCE = String.raw`${SHARED_STITCH_LIST_CANDIDATE_ITEM_SOURCE}(?:${SHARED_STITCH_LIST_MALFORMED_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_CANDIDATE_ITEM_SOURCE}){1,7}`;
const SHARED_STITCH_LIST_MALFORMED_FINDER = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_LIST_MALFORMED_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_LIST_MALFORMED_TERM = new RegExp(
  String.raw`(?:${SOURCE_STITCH_TERM_SOURCE})${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE}`,
  "iu",
);
const SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM_SOURCE = String.raw`[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]{0,39}[\p{Pc}\p{Cf}](?:${SOURCE_STITCH_TERM_SOURCE})(?:${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE})?`;
const SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM = new RegExp(
  SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM_SOURCE,
  "iu",
);
const SHARED_STITCH_LIST_DIRECT_PREFIXED_IDENTIFIER_ITEM = new RegExp(
  String.raw`[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}](?:${SOURCE_STITCH_TERM_SOURCE})(?:${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE})?`,
  "iu",
);
const SHARED_STITCH_LIST_MALFORMED_IDENTIFIER_ITEM_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_QUANTIFIER_SOURCE}(?:${SOURCE_STITCH_TERM_SOURCE})${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE}|${SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM_SOURCE})`;
const SHARED_STITCH_LIST_WRAPPED_MALFORMED_IDENTIFIER_FINDER = new RegExp(
  String.raw`(?<wrapper>\*{1,3}|_{1,3})[\t\p{Zs}]*${SHARED_STITCH_LIST_MALFORMED_IDENTIFIER_ITEM_SOURCE}[\t\p{Zs}]*\k<wrapper>`,
  "giu",
);
const SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM_SOURCE}${SHARED_STITCH_LIST_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_ITEM_SOURCE}|${SHARED_STITCH_LIST_ITEM_SOURCE}${SHARED_STITCH_LIST_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM_SOURCE})`;
const SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_FINDER = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_LIST_EXACT = new RegExp(`^${SHARED_STITCH_LIST_SOURCE}$`, "iu");
const SHARED_STITCH_LIST_UNKNOWN_MIDDLE_SOURCE = String.raw`(?:(?!(?:and|or)\b)[\p{L}\p{M}][\p{L}\p{M}\p{N}'’\-‐‑‒–—]{0,39})(?:[\t\p{Zs}]+(?!(?:and|or)\b)[\p{L}\p{M}][\p{L}\p{M}\p{N}'’\-‐‑‒–—]{0,39}){0,5}`;
const SHARED_STITCH_LIST_CONTAMINATED_SEPARATOR_SOURCE = String.raw`(?:[\t\p{Zs}]*[,;][\t\p{Zs}]*(?:(?:and|or|then)[\t\p{Zs}]+)?|[\t\p{Zs}]*[/／][\t\p{Zs}]*|[\t\p{Zs}]*(?:(?:and|or)(?:[\t\p{Zs}]+then)?|then)[\t\p{Zs}]+)`;
const SHARED_STITCH_LIST_CONTAMINATED_SOURCE = String.raw`${SHARED_STITCH_LIST_ITEM_SOURCE}${SHARED_STITCH_LIST_CONTAMINATED_SEPARATOR_SOURCE}(?<middle>${SHARED_STITCH_LIST_UNKNOWN_MIDDLE_SOURCE})${SHARED_STITCH_LIST_CONTAMINATED_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_ITEM_SOURCE}`;
const SHARED_STITCH_LIST_CONTAMINATED_FINDER = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_LIST_CONTAMINATED_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_LIST_UNSUPPORTED_PREFIX_SOURCE = String.raw`(?:front[\t\p{Zs}]+post|back[\t\p{Zs}]+post|long|spike|waistcoat|back[\t\p{Zs}]+loop)`;
const SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE = String.raw`${SHARED_STITCH_LIST_UNSUPPORTED_PREFIX_SOURCE}[\t\p{Zs}]+${SHARED_STITCH_LIST_PLAIN_ITEM_SOURCE}`;
const SHARED_STITCH_LIST_UNSUPPORTED_EMPHASIZED_SOURCE = String.raw`(?:\*\*\*${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE}\*\*\*|___${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE}___|\*\*${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE}\*\*|__${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE}__|\*${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE}\*|_${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE}_)`;
const SHARED_STITCH_LIST_UNSUPPORTED_VISIBLE_ITEM_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_UNSUPPORTED_EMPHASIZED_SOURCE}|${SHARED_STITCH_LIST_UNSUPPORTED_CORE_SOURCE})`;
const SHARED_STITCH_LIST_UNSUPPORTED_ITEM_SOURCE = String.raw`(?:\[[\t\p{Zs}]*${SHARED_STITCH_LIST_UNSUPPORTED_VISIBLE_ITEM_SOURCE}[\t\p{Zs}]*\]${SHARED_STITCH_LIST_LINK_SUFFIX_SOURCE}|${SHARED_STITCH_LIST_UNSUPPORTED_VISIBLE_ITEM_SOURCE})`;
const SHARED_STITCH_LIST_UNSUPPORTED_PAIR_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_UNSUPPORTED_ITEM_SOURCE}${SHARED_STITCH_LIST_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_ITEM_SOURCE}|${SHARED_STITCH_LIST_ITEM_SOURCE}${SHARED_STITCH_LIST_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_UNSUPPORTED_ITEM_SOURCE})`;
const SHARED_STITCH_LIST_UNSUPPORTED_PAIR_FINDER = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_LIST_UNSUPPORTED_PAIR_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_CLAUSE_ITEM_SOURCE = String.raw`${SHARED_STITCH_LIST_ITEM_SOURCE}[\t\p{Zs}]+${TARGET_STITCH_LOCATION_SOURCE}`;
const SHARED_STITCH_CLAUSE_CONTAMINATED_SOURCE = String.raw`${SHARED_STITCH_CLAUSE_ITEM_SOURCE}${SHARED_STITCH_LIST_CONTAMINATED_SEPARATOR_SOURCE}(?<middle>${SHARED_STITCH_LIST_UNKNOWN_MIDDLE_SOURCE})${SHARED_STITCH_LIST_CONTAMINATED_SEPARATOR_SOURCE}(?:(?:make|work)[\t\p{Zs}]+)?${SHARED_STITCH_CLAUSE_ITEM_SOURCE}`;
const SHARED_STITCH_CLAUSE_CONTAMINATED_FINDER = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_CLAUSE_CONTAMINATED_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_LIST_EXACT_ITEM = new RegExp(
  String.raw`^${SHARED_STITCH_LIST_ITEM_SOURCE}$`,
  "iu",
);
const SHARED_STITCH_LIST_BOUNDED_MIDDLE_CLAUSE = new RegExp(
  `^(?:${TARGET_CHAIN_COUNT_CLAUSE_SOURCE}|${TARGET_COMMAND_CLAUSE_SOURCE})$`,
  "iu",
);
const SHARED_STITCH_LIST_COMPLETE_BOUNDED_LINE = new RegExp(
  `${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}){0,11}${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const SHARED_STITCH_LIST_ACTION_BRIDGE_LINE = new RegExp(
  String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:make|work)[\t\p{Zs}]+${SHARED_STITCH_LIST_ITEM_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_COMMAND_CLAUSE_SOURCE}){1,4}${TARGET_CLAUSE_SEPARATOR_SOURCE}(?:(?:make|work)[\t\p{Zs}]+)?${TARGET_STITCH_CLAUSE_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}){0,7}${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const SHARED_STITCH_REPEAT_MARKER_LINE = new RegExp(
  String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:(?:make|work)[\t\p{Zs}]+)?\*${TARGET_STITCH_CLAUSE_SOURCE}(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}${TARGET_CONTINUATION_CLAUSE_SOURCE}){0,10}${TARGET_CLAUSE_SEPARATOR_SOURCE}repeat[\t\p{Zs}]+from[\t\p{Zs}]+\*${TARGET_FINAL_TERMINATOR_SOURCE}`,
  "iu",
);
const SHARED_STITCH_LIST_EXACT_ACTION_PREFIX_SOURCE = String.raw`(?:
  (?:join|sl[\t\p{Zs}]+st)[\t\p{Zs}]+${TARGET_POSITIONAL_LOCATION_SOURCE}
  |keep[\t\p{Zs}]+(?:${TARGET_STITCH_TERM_SOURCE})
  |repeat[\t\p{Zs}]+from[\t\p{Zs}]+\*
  |${TARGET_CHAIN_COUNT_CLAUSE_SOURCE}
  |yo[\t\p{Zs}]+and[\t\p{Zs}]+pull[\t\p{Zs}]+through
)`.replace(/[\r\n\t ]+/g, "");
const SHARED_STITCH_LIST_POLICY_SEPARATOR_SOURCE = String.raw`(?:${TARGET_CLAUSE_SEPARATOR_SOURCE}|[\t\p{Zs}]*[/／][\t\p{Zs}]*)`;
const SHARED_STITCH_LIST_INVALID_ACTION_MIDDLE = new RegExp(
  String.raw`${SHARED_STITCH_LIST_POLICY_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_EXACT_ACTION_PREFIX_SOURCE}[\t\p{Zs}]+[\p{L}\p{M}][\p{L}\p{M}\p{N}'’\-‐‑‒–—]{0,39}(?:[\t\p{Zs}]+[\p{L}\p{M}][\p{L}\p{M}\p{N}'’\-‐‑‒–—]{0,39}){0,2}${SHARED_STITCH_LIST_POLICY_SEPARATOR_SOURCE}`,
  "iu",
);
const SHARED_POLICY_CONSTRUCTION_HEADING_SOURCE = CONSTRUCTION_INSTRUCTION_HEADING_SOURCE;
const SHARED_POLICY_HEADING_START_SOURCE = String.raw`${INSTRUCTION_HEADING_PREFIX_SOURCE}(?:${INSTRUCTION_HEADING_SOURCE}|${SHARED_POLICY_CONSTRUCTION_HEADING_SOURCE})[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}`;
const SHARED_POLICY_SHORTHAND_COMMAND_START_SOURCE = String.raw`(?:
  sl[\t\p{Zs}]+st[\t\p{Zs}]+${TARGET_POSITIONAL_LOCATION_SOURCE}
  |sk[\t\p{Zs}]+${TARGET_SIMPLE_LOCATION_SOURCE}
  |beg[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:new|next|following)[\t\p{Zs}]+(?:row|round)
  |cont|rep
)(?=${TARGET_CLAUSE_TERMINATOR_SOURCE})`.replace(/[\r\n\t ]+/g, "");
const SHARED_POLICY_COMMAND_START_SOURCE = String.raw`${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}(?:add|begin|ch(?:ain)?|commence|complete|continue|crochet|decrease|finish|increase|insert|join|keep|make|miss|place|pull|repeat|skip|start|turn|use|using|work|yo)\b`;
const SHARED_POLICY_TERM_COMMAND_START_SOURCE = String.raw`${SHARED_POLICY_COMMAND_START_SOURCE}(?=(?:[^;\r\n.!?]|!(?=\[)){0,120}[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}](?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]))`;
const SHARED_POLICY_MALFORMED_TERM_COMMAND_START_SOURCE = String.raw`${SHARED_POLICY_COMMAND_START_SOURCE}(?=(?:[^;\r\n.!?]|!(?=\[)){0,120}[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]${SHARED_STITCH_LIST_MALFORMED_IDENTIFIER_ITEM_SOURCE}(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]))`;
const SHARED_POLICY_BOUNDED_SHORTHAND_START_SOURCE = String.raw`${OPTIONAL_MARKDOWN_INSTRUCTION_MARKERS_SOURCE}${SHARED_POLICY_SHORTHAND_COMMAND_START_SOURCE}`;
const SHARED_POLICY_BARE_COUNT_START_SOURCE = String.raw`\p{N}+[\t\p{Zs}]+(?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`;
const SHARED_POLICY_BARE_SHARED_LIST_START_SOURCE = SHARED_STITCH_LIST_SOURCE;
const SHARED_POLICY_BARE_SINGLE_TERM_START_SOURCE = String.raw`(?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?=[\t\p{Zs}]+alone\b)`;
const SHARED_POLICY_BARE_CONNECTED_IDENTIFIER_START_SOURCE = String.raw`(?:${SHARED_STITCH_LIST_QUANTIFIER_SOURCE}(?:${SOURCE_STITCH_TERM_SOURCE})[\p{Pc}\p{Cf}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]*|${SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`;
const SHARED_POLICY_NEW_COMMAND_START_SOURCE = String.raw`(?:${SHARED_POLICY_HEADING_START_SOURCE}|${SHARED_POLICY_TERM_COMMAND_START_SOURCE}|${SHARED_POLICY_MALFORMED_TERM_COMMAND_START_SOURCE}|${SHARED_POLICY_BOUNDED_SHORTHAND_START_SOURCE}|${SHARED_POLICY_BARE_COUNT_START_SOURCE}|${SHARED_POLICY_BARE_SHARED_LIST_START_SOURCE}|${SHARED_POLICY_BARE_CONNECTED_IDENTIFIER_START_SOURCE})`;
const SHARED_POLICY_INSTRUCTION_START_SOURCE = SHARED_POLICY_NEW_COMMAND_START_SOURCE;
const SHARED_POLICY_SEGMENT_BOUNDARY = new RegExp(
  String.raw`(?:[.!?][\t\p{Zs}]+(?=${SHARED_POLICY_INSTRUCTION_START_SOURCE})|;[\t\p{Zs}]+(?=(?:${SHARED_POLICY_NEW_COMMAND_START_SOURCE}|${SHARED_POLICY_BARE_SINGLE_TERM_START_SOURCE}))|,[\t\p{Zs}]+then[\t\p{Zs}]+(?=(?:${SHARED_POLICY_HEADING_START_SOURCE}|${SHARED_POLICY_TERM_COMMAND_START_SOURCE}|${SHARED_POLICY_BOUNDED_SHORTHAND_START_SOURCE})))`,
  "giu",
);
const SHARED_POLICY_SEGMENT_BOUNDARY_CANDIDATE = /(?:[.!?;][\t\p{Zs}]+|,[\t\p{Zs}]+then[\t\p{Zs}]+)/iu;
const SHARED_POLICY_LEADING_NUMBERED_MARKER = /^[\t\p{Zs}]*(?:>+[\t\p{Zs}]+)*\p{N}{1,9}\.$/u;
const SHARED_POLICY_LEADING_PAREN_NUMBERED_MARKER = /^(?:[\t\p{Zs}]*(?:>+[\t\p{Zs}]+)*)(?:\p{N}{1,9}\)|\(\p{N}{1,9}\))[\t\p{Zs}]+/u;
const SHARED_POLICY_EXPLICIT_HEADING_AT_START = new RegExp(
  String.raw`^${SHARED_POLICY_HEADING_START_SOURCE}`,
  "iu",
);
const SHARED_POLICY_CONSTRUCTION_HEADING_PREFIX = new RegExp(
  String.raw`^${INSTRUCTION_HEADING_PREFIX_SOURCE}${SHARED_POLICY_CONSTRUCTION_HEADING_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*`,
  "iu",
);
const MAX_SHARED_POLICY_SEGMENTS_PER_LINE = 64;
const SHARED_STITCH_LIST_OVERFLOW_SOURCE = String.raw`${SHARED_STITCH_LIST_ITEM_SOURCE}(?:${SHARED_STITCH_LIST_SEPARATOR_SOURCE}${SHARED_STITCH_LIST_ITEM_SOURCE}){8,}`;
const SHARED_STITCH_LIST_OVERFLOW_FINDER = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<list>${SHARED_STITCH_LIST_OVERFLOW_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SHARED_STITCH_LIST_CONNECTOR_PREFILTER = /[,;/／]|\b(?:and|or|then)\b/iu;
const SHARED_STITCH_LIST_TERM_PREFILTER = /(?:dc|dtr|htr|tr|double|half|treble)/giu;
const SHARED_STITCH_LIST_TERM_MATCHER = new RegExp(
  String.raw`(^|(?:\*{1,3}|_{1,3})|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(${SOURCE_STITCH_TERM_SOURCE})(?=$|(?:\*{1,3}|_{1,3})|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);

function unwrapSharedStitchList(beforeLine, afterList) {
  let authorityBefore = beforeLine;
  let remainder = afterList;
  let hadWrapper = false;

  for (let index = 0; index < 6; index += 1) {
    const trimmedBefore = authorityBefore.replace(/[\t\p{Zs}]+$/u, "");
    const structuralOpener = trimmedBefore.at(-1);
    const structuralCloser = structuralOpener === "(" ? ")"
      : structuralOpener === "[" ? "]"
        : structuralOpener === "{" ? "}" : null;
    if (structuralCloser) {
      const markdownDestination = structuralCloser === "]"
        ? String.raw`(?:(?:\([^()\r\n]{0,2048}\)|\[(?:${MARKDOWN_REFERENCE_LABEL_CHARACTER_SOURCE}){0,999}\]))?`
        : "";
      const closer = new RegExp(
        `^[\\t\\p{Zs}]*${escapeRegex(structuralCloser)}${markdownDestination}`,
        "u",
      ).exec(remainder);
      if (!closer) {
        return { authorityBefore, balanced: false, hadWrapper: true, remainder };
      }
      hadWrapper = true;
      authorityBefore = trimmedBefore.slice(0, -1);
      remainder = remainder.slice(closer[0].length);
      continue;
    }

    const hasGapBeforeList = /[\t\p{Zs}]$/u.test(authorityBefore);
    if (!hasGapBeforeList) {
      const markupWrapper = ["**", "__", "`", "*", "_"]
        .find((wrapper) => trimmedBefore.endsWith(wrapper));
      if (markupWrapper) {
        const closer = new RegExp(`^[\\t\\p{Zs}]*${escapeRegex(markupWrapper)}`, "u").exec(remainder);
        if (closer) {
          hadWrapper = true;
          authorityBefore = trimmedBefore.slice(0, -markupWrapper.length);
          remainder = remainder.slice(closer[0].length);
          continue;
        }
      }
    }
    break;
  }

  return {
    authorityBefore,
    balanced: !/^[\t\p{Zs}]*[\])}]/u.test(remainder),
    hadWrapper,
    remainder,
  };
}

function maskSharedStitchListLinkDestinations(value) {
  const { destinations } = scanMarkdownLinkSyntax(value);
  const referenceDestinations = [];
  for (let cursor = 0; cursor < value.length - 1; cursor += 1) {
    if (value[cursor] !== "]" || value[cursor + 1] !== "[") continue;
    const reference = scanMarkdownReferenceLabel(value, cursor + 1);
    if (!reference) continue;
    referenceDestinations.push({
      start: reference.contentStart,
      end: reference.contentEnd,
    });
    cursor = reference.end - 1;
  }
  return maskRanges(value, [...destinations, ...referenceDestinations]);
}

function maskSimpleReferenceLabelContents(value) {
  const ranges = [];
  for (let cursor = 0; cursor < value.length - 1; cursor += 1) {
    if (value[cursor] !== "]" || value[cursor + 1] !== "[") continue;
    const reference = scanMarkdownReferenceLabel(value, cursor + 1);
    if (!reference?.valid) continue;
    ranges.push({ start: reference.contentStart, end: reference.contentEnd });
    cursor = reference.end - 1;
  }
  return ranges.length > 0 ? maskRanges(value, ranges) : value;
}

function maskAllSimpleReferenceLabelContents(value) {
  const ranges = [];
  for (let cursor = value.indexOf("]["); cursor !== -1; cursor = value.indexOf("][", cursor + 2)) {
    if (isSimpleEscapedCharacter(value, cursor)) return null;
    const reference = scanMarkdownReferenceLabel(value, cursor + 1);
    if (!reference?.valid) return null;
    ranges.push({ start: reference.contentStart, end: reference.contentEnd });
    cursor = reference.end - 2;
  }
  return ranges.length > 0 ? maskRanges(value, ranges) : null;
}

function collectSimpleInlineDestinationRanges(value) {
  const openerIndices = [];
  for (let cursor = value.indexOf("]("); cursor !== -1; cursor = value.indexOf("](", cursor + 2)) {
    if (!isSimpleEscapedCharacter(value, cursor)) openerIndices.push(cursor);
  }
  const ranges = [];
  const destinationPattern = /\]\((?<payload>[^()\r\n]{0,256})\)/gu;
  let destination;
  while ((destination = destinationPattern.exec(value)) !== null) {
    if (isSimpleEscapedCharacter(value, destination.index)) continue;
    const start = destination.index + 2;
    ranges.push({ start, end: start + destination.groups.payload.length });
  }
  return ranges.length === openerIndices.length ? ranges : null;
}

function collectBoundedInlineDestinationRanges(value) {
  const ranges = [];
  for (let opener = value.indexOf("]("); opener !== -1; opener = value.indexOf("](", opener + 2)) {
    if (isSimpleEscapedCharacter(value, opener)) continue;
    let hasValidLabel = false;
    const minimumLabelStart = Math.max(0, opener - 1_001);
    for (let labelStart = opener - 1; labelStart >= minimumLabelStart; labelStart -= 1) {
      if (value[labelStart] !== "[" || isSimpleEscapedCharacter(value, labelStart)) continue;
      const label = scanMarkdownReferenceLabel(value, labelStart);
      if (label?.valid && label.end === opener + 1) hasValidLabel = true;
      break;
    }
    if (!hasValidLabel) continue;

    let angleDestination = false;
    let destinationStarted = false;
    let parenthesisDepth = 0;
    let quotedTitle = "";
    let close = -1;
    let cursor = opener + 2;
    while (
      cursor < value.length
      && !/[\r\n]/u.test(value[cursor])
      && cursor - opener <= MAX_MARKDOWN_LINK_DESTINATION_LENGTH + 1
    ) {
      const character = value[cursor];
      if (character === "\\") {
        cursor += 2;
        continue;
      }
      if (angleDestination) {
        if (character === ">") angleDestination = false;
        cursor += 1;
        continue;
      }
      if (quotedTitle) {
        if (character === quotedTitle) quotedTitle = "";
        cursor += 1;
        continue;
      }
      if (!destinationStarted && /[\t\p{Zs}]/u.test(character)) {
        cursor += 1;
        continue;
      }
      if (!destinationStarted && character === "<") {
        destinationStarted = true;
        angleDestination = true;
        cursor += 1;
        continue;
      }
      destinationStarted = true;
      if (
        (character === "\"" || character === "'")
        && /[\t\p{Zs}]/u.test(value[cursor - 1] ?? "")
      ) {
        quotedTitle = character;
        cursor += 1;
        continue;
      }
      if (character === "(") parenthesisDepth += 1;
      else if (character === ")") {
        if (parenthesisDepth > 0) parenthesisDepth -= 1;
        else {
          close = cursor;
          break;
        }
      }
      cursor += 1;
    }
    if (close === -1) continue;
    const payload = value.slice(opener + 2, close);
    if (!isValidMarkdownLinkDestinationPayload(payload)) continue;
    ranges.push({ start: opener + 2, end: close });
    opener = close;
  }
  return ranges;
}

function maskAllBoundedInlineDestinations(value) {
  const ranges = collectBoundedInlineDestinationRanges(value);
  if (ranges.length === 0) return null;
  const openerStarts = new Set(ranges.map((range) => range.start - 2));
  for (let opener = value.indexOf("]("); opener !== -1; opener = value.indexOf("](", opener + 2)) {
    if (isSimpleEscapedCharacter(value, opener)) return null;
    if (ranges.some((range) => range.start <= opener && opener < range.end)) continue;
    if (!openerStarts.has(opener)) return null;
  }
  return maskRanges(value, ranges);
}

function collectSharedStitchListTerms(listText, listStart) {
  const terms = [];
  const scanText = maskSharedStitchListLinkDestinations(listText);
  SHARED_STITCH_LIST_TERM_MATCHER.lastIndex = 0;
  let match;
  while ((match = SHARED_STITCH_LIST_TERM_MATCHER.exec(scanText)) !== null) {
    const prefixLength = match[1].length;
    const matchedText = match[2];
    const entry = SOURCE_STITCH_TERM_ENTRY_BY_TERM.get(
      matchedText.toLocaleLowerCase("en-US").replace(/[\t\p{Zs}]+/gu, " "),
    );
    if (!entry) continue;
    const start = listStart + match.index + prefixLength;
    terms.push({ start, end: start + matchedText.length, matchedText, entry });
  }
  return terms;
}

function analyzeMarkdownEmphasis(text, terms) {
  const stack = [];
  const pairs = [];
  const quantifiedOpening = new RegExp(
    String.raw`(?<token>\*{1,3}|_{1,3})${SHARED_STITCH_LIST_QUANTIFIER_SOURCE}$`,
    "u",
  );
  for (const term of terms) {
    const openingContext = text.slice(Math.max(0, term.start - 48), term.start);
    const openingMatch = openingContext.match(quantifiedOpening);
    const opening = openingMatch?.groups?.token ?? "";
    const closing = text.slice(term.end, Math.min(text.length, term.end + 8))
      .match(/^([*_]+)/u)?.[1] ?? "";
    if (opening) {
      const openingStart = term.start - (openingContext.length - openingMatch.index);
      if (!/^(?:\*{1,3}|_{1,3})$/u.test(opening) || text[openingStart - 1] === "\\") {
        return { malformed: true, pairs };
      }
      stack.push({ token: opening, start: openingStart });
    }
    if (closing) {
      const opener = stack.pop();
      if (!/^(?:\*{1,3}|_{1,3})$/u.test(closing) || opener?.token !== closing) {
        return { malformed: true, pairs };
      }
      pairs.push({ start: opener.start, end: term.end + closing.length });
    }
  }
  return { malformed: stack.length > 0, pairs };
}

const MARKUP_TRANSPARENT_WORD_CHARACTER = /[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]/u;
const MARKUP_TRANSPARENT_CONNECTOR_CHARACTER = /[.\\/\-‐‑‒–—―−﹣－]/u;

function hasUnsafeMarkupPrefix(text, start) {
  const immediate = text[start - 1] ?? "";
  if (MARKUP_TRANSPARENT_WORD_CHARACTER.test(immediate)) return true;
  return MARKUP_TRANSPARENT_CONNECTOR_CHARACTER.test(immediate)
    && MARKUP_TRANSPARENT_WORD_CHARACTER.test(text[start - 2] ?? "");
}

function hasUnsafeMarkupSuffix(text, end) {
  const immediate = text[end] ?? "";
  if (MARKUP_TRANSPARENT_WORD_CHARACTER.test(immediate)) return true;
  return MARKUP_TRANSPARENT_CONNECTOR_CHARACTER.test(immediate)
    && MARKUP_TRANSPARENT_WORD_CHARACTER.test(text[end + 1] ?? "");
}

const MARKDOWN_EMPHASIS_TOKENS = ["***", "___", "**", "__", "*", "_"];

function expandMatchedEmphasisRange(text, start, end) {
  let rangeStart = start;
  let rangeEnd = end;
  let depth = 0;
  while (depth < 2) {
    const token = MARKDOWN_EMPHASIS_TOKENS.find((candidate) => (
      text.slice(rangeStart - candidate.length, rangeStart) === candidate
      && text.slice(rangeEnd, rangeEnd + candidate.length) === candidate
    ));
    if (!token) break;
    rangeStart -= token.length;
    rangeEnd += token.length;
    depth += 1;
  }
  return { start: rangeStart, end: rangeEnd, depth };
}

function expandSingleStructuralRange(text, start, end) {
  let contentStart = start;
  let contentEnd = end;
  while (contentStart > 0 && /[\t\p{Zs}]/u.test(text[contentStart - 1])) contentStart -= 1;
  while (contentEnd < text.length && /[\t\p{Zs}]/u.test(text[contentEnd])) contentEnd += 1;
  const opener = text[contentStart - 1] ?? "";
  const closer = opener === "(" ? ")" : opener === "{" ? "}" : "";
  if (!closer || text[contentEnd] !== closer) return { start, end, wrapped: false };
  return { start: contentStart - 1, end: contentEnd + 1, wrapped: true };
}

function expandMatchedCompositeRange(text, start, end) {
  const emphasis = expandMatchedEmphasisRange(text, start, end);
  return expandSingleStructuralRange(text, emphasis.start, emphasis.end);
}

function hasUnsafeCompositePrefix(text, start) {
  if (hasUnsafeMarkupPrefix(text, start)) return true;
  return MARKDOWN_EMPHASIS_TOKENS.some((token) => (
    text.slice(start - token.length, start) === token
    && MARKUP_TRANSPARENT_WORD_CHARACTER.test(text[start - token.length - 1] ?? "")
  ));
}

function hasUnsafeCompositeSuffix(text, end) {
  if (hasUnsafeMarkupSuffix(text, end)) return true;
  return MARKDOWN_EMPHASIS_TOKENS.some((token) => (
    text.slice(end, end + token.length) === token
    && MARKUP_TRANSPARENT_WORD_CHARACTER.test(text[end + token.length] ?? "")
  ));
}

function hasAdjacentMarkupWrapper(text, start, end, structuralWrapped = false) {
  const before = text[start - 1] ?? "";
  const after = text[end] ?? "";
  if (/[\[\])}]/u.test(before) || /[\[\]({]/u.test(after)) return true;
  return structuralWrapped
    && (/[({]/u.test(before) || /[)}]/u.test(after));
}

function hasAdjacentEmphasisWrapper(text, start, end) {
  return MARKDOWN_EMPHASIS_TOKENS.some((token) => (
    text.slice(start - token.length, start) === token
    || text.slice(end, end + token.length) === token
  ));
}

function hasBalancedStructuralDelimiters(text, start, end, ignoredRanges) {
  const stack = [];
  let rangeIndex = 0;
  while (ignoredRanges[rangeIndex]?.end <= start) rangeIndex += 1;
  for (let cursor = start; cursor < end; cursor += 1) {
    const ignored = ignoredRanges[rangeIndex];
    if (ignored && cursor >= ignored.start && cursor < ignored.end) {
      cursor = ignored.end - 1;
      rangeIndex += 1;
      continue;
    }
    const character = text[cursor];
    if (character === "\\") {
      cursor += 1;
      continue;
    }
    if (character === "(" || character === "{") {
      stack.push(character);
      continue;
    }
    if (character !== ")" && character !== "}") continue;
    const expectedOpener = character === ")" ? "(" : "{";
    if (stack.at(-1) !== expectedOpener) return false;
    stack.pop();
  }
  return stack.length === 0;
}

function mapEnclosingSquareLabels(text, terms) {
  const labelsByTerm = new Map();
  const labels = [];
  const orderedTerms = [...terms].sort((left, right) => left.start - right.start);
  const stack = [];
  let termIndex = 0;
  let escaped = false;
  for (let cursor = 0; cursor < text.length; cursor += 1) {
    while (orderedTerms[termIndex]?.start === cursor) {
      const term = orderedTerms[termIndex];
      if (stack.length > 0) labelsByTerm.set(`${term.start}:${term.end}`, stack[0]);
      termIndex += 1;
    }
    const character = text[cursor];
    if (character === "\r" || character === "\n") {
      stack.length = 0;
      escaped = false;
      continue;
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === "[") {
      if (stack.length > 0) stack.at(-1).nested = true;
      const label = { start: cursor, end: null, nested: false };
      labels.push(label);
      stack.push(label);
    } else if (character === "]" && stack.length > 0) {
      stack.pop().end = cursor + 1;
    }
  }
  for (const [key, label] of labelsByTerm) {
    if (label.end === null) labelsByTerm.delete(key);
  }
  return {
    labelsByTerm,
    labels: labels.filter((label) => label.end !== null),
  };
}

function referenceLinkWrapperRange(text, label) {
  if (!label || text[label.end] !== "[") return null;
  const reference = scanMarkdownReferenceLabel(text, label.end);
  if (!reference) return null;
  return {
    start: label.start,
    end: reference.end,
    valid: reference.valid,
    collapsed: reference.value.length === 0,
  };
}

function findUnsafeMarkupBoundaryRanges(text, inlineLinks, referenceLabels = new Set()) {
  if (!/[\[\]*_\\\p{Cf}]/u.test(text)) return [];
  const unsafeTerms = [];
  const seen = new Set();
  const addTerm = (term) => {
    const key = `${term.start}:${term.end}`;
    if (seen.has(key)) return;
    seen.add(key);
    unsafeTerms.push({ start: term.start, end: term.end, kind: "markup-identifier" });
  };

  const allTerms = collectSharedStitchListTerms(text, 0);
  SHARED_STITCH_LIST_WRAPPED_MALFORMED_IDENTIFIER_FINDER.lastIndex = 0;
  let malformedWrappedIdentifier;
  while ((malformedWrappedIdentifier = SHARED_STITCH_LIST_WRAPPED_MALFORMED_IDENTIFIER_FINDER.exec(text)) !== null) {
    unsafeTerms.push({
      start: malformedWrappedIdentifier.index,
      end: malformedWrappedIdentifier.index + malformedWrappedIdentifier[0].length,
      kind: "markup-identifier",
      forceSegment: true,
    });
  }
  const {
    labelsByTerm: squareLabels,
    labels: allSquareLabels,
  } = mapEnclosingSquareLabels(text, allTerms);
  const inlineDestinationRanges = inlineLinks
    .map((link) => ({ start: link.labelEnd + 1, end: link.end }))
    .sort((left, right) => left.start - right.start);
  for (const link of inlineLinks) {
    const composite = expandMatchedCompositeRange(text, link.start, link.end);
    if (
      link.image
      || (
        !hasUnsafeCompositePrefix(text, composite.start)
        && !hasUnsafeCompositeSuffix(text, composite.end)
        && !hasAdjacentMarkupWrapper(
          text,
          composite.start,
          composite.end,
          composite.wrapped,
        )
        && !hasAdjacentEmphasisWrapper(text, composite.start, composite.end)
      )
    ) {
      continue;
    }
    for (const term of allTerms) {
      if (term.start >= link.labelStart && term.end <= link.labelEnd) addTerm(term);
    }
  }

  const wholeTextEmphasis = analyzeMarkdownEmphasis(text, allTerms);
  const hasMalformedSquareLabel = allSquareLabels.some((label) => {
    const labelContent = text.slice(label.start + 1, label.end - 1);
    return SHARED_STITCH_LIST_MALFORMED_TERM.test(labelContent)
      || SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM.test(labelContent)
      || SHARED_STITCH_LIST_DIRECT_PREFIXED_IDENTIFIER_ITEM.test(labelContent);
  });
  if (
    unsafeTerms.length === 0
    && squareLabels.size === 0
    && !hasMalformedSquareLabel
    && !wholeTextEmphasis.malformed
    && wholeTextEmphasis.pairs.length === 0
  ) return [];

  const segments = splitSharedPolicySegments(text);
  for (const segment of segments) {
    const terms = allTerms.filter((term) => term.start >= segment.start && term.end <= segment.end);
    if (terms.length === 0) continue;
    const hasLinkedTerm = terms.some((term) => {
      const label = squareLabels.get(`${term.start}:${term.end}`);
      if (!label) return false;
      return inlineLinks.some((link) => (
        link.labelStart === label.start + 1
        && link.labelStart <= term.start
        && link.labelEnd >= term.end
      )) || Boolean(referenceLinkWrapperRange(text, label));
    });
    if (
      hasLinkedTerm
      && !hasBalancedStructuralDelimiters(
        text,
        segment.start,
        segment.end,
        inlineDestinationRanges,
      )
    ) {
      const key = `structural:${segment.start}:${segment.end}`;
      if (!seen.has(key)) {
        seen.add(key);
        unsafeTerms.push({
          start: segment.start,
          end: segment.end,
          kind: "markup-structural-balance",
          forceSegment: true,
        });
      }
    }
    for (const label of allSquareLabels) {
      if (
        label.start < segment.start
        || label.end > segment.end
        || text[label.start - 1] === "]"
      ) continue;
      const labelContent = text.slice(label.start + 1, label.end - 1);
      if (
        SHARED_STITCH_LIST_VISIBLE_ITEM.test(labelContent)
        || SHARED_STITCH_LIST_COMPLETE_LABEL.test(labelContent)
      ) continue;
      if (
        SHARED_STITCH_LIST_MALFORMED_TERM.test(labelContent)
        || SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM.test(labelContent)
        || SHARED_STITCH_LIST_DIRECT_PREFIXED_IDENTIFIER_ITEM.test(labelContent)
      ) {
        const key = `label:${label.start}:${label.end}`;
        if (!seen.has(key)) {
          seen.add(key);
          unsafeTerms.push({
            start: label.start,
            end: label.end,
            kind: "markup-identifier",
            forceSegment: true,
          });
        }
      }
    }
    const { pairs } = analyzeMarkdownEmphasis(text, terms);
    for (const term of terms) {
      const emphasis = pairs
        .filter((pair) => pair.start <= term.start && pair.end >= term.end)
        .sort((left, right) => (right.end - right.start) - (left.end - left.start))[0];
      if (
        emphasis
        && (hasUnsafeMarkupPrefix(text, emphasis.start) || hasUnsafeMarkupSuffix(text, emphasis.end))
      ) addTerm(term);

      const squareLabel = squareLabels.get(`${term.start}:${term.end}`);
      if (!squareLabel) continue;
      const labelContent = text.slice(squareLabel.start + 1, squareLabel.end - 1);
      const boundedVisibleItem = SHARED_STITCH_LIST_VISIBLE_ITEM.test(labelContent);
      const termsInsideLabel = terms.filter((candidate) => (
        candidate.start >= squareLabel.start + 1 && candidate.end <= squareLabel.end - 1
      ));
      const completeListInsideLabel = terms.length >= 2
        && termsInsideLabel.length === terms.length
        && SHARED_STITCH_LIST_COMPLETE_LABEL.test(labelContent);
      const resolvedVisibleLabel = referenceLabels.has(
        normalizeMarkdownReferenceLabel(labelContent),
      );
      const inlineLink = inlineLinks.find((link) => (
        link.labelStart === squareLabel.start + 1
        && link.labelStart <= term.start
        && link.labelEnd >= term.end
      ));
      if (inlineLink) {
        const composite = expandMatchedCompositeRange(text, inlineLink.start, inlineLink.end);
        if (
          inlineLink.image
          || squareLabel.nested
          || (!boundedVisibleItem && !completeListInsideLabel)
          || hasUnsafeCompositePrefix(text, composite.start)
          || hasUnsafeCompositeSuffix(text, composite.end)
          || hasAdjacentMarkupWrapper(
            text,
            composite.start,
            composite.end,
            composite.wrapped,
          )
          || hasAdjacentEmphasisWrapper(text, composite.start, composite.end)
        ) addTerm(term);
        continue;
      }

      const reference = referenceLinkWrapperRange(text, squareLabel);
      if (reference) {
        const composite = expandMatchedCompositeRange(text, reference.start, reference.end);
        if (
          !reference.valid
          || squareLabel.nested
          || (!boundedVisibleItem && !completeListInsideLabel)
          || (reference.collapsed && resolvedVisibleLabel)
          || hasUnsafeCompositePrefix(text, composite.start)
          || hasUnsafeCompositeSuffix(text, composite.end)
          || hasAdjacentMarkupWrapper(
            text,
            composite.start,
            composite.end,
            composite.wrapped,
          )
          || hasAdjacentEmphasisWrapper(text, composite.start, composite.end)
        ) addTerm(term);
        continue;
      }

      if (
        squareLabel.nested
        || resolvedVisibleLabel
        || (!boundedVisibleItem && !completeListInsideLabel)
        || hasUnsafeMarkupPrefix(text, squareLabel.start)
        || hasUnsafeMarkupSuffix(text, squareLabel.end)
        || (terms.length >= 2 && !completeListInsideLabel)
      ) addTerm(term);
    }
  }
  const atomicRanges = [];
  const atomicSeen = new Set();
  for (const unsafeTerm of unsafeTerms) {
    const segment = segments.find((candidate) => (
      candidate.start <= unsafeTerm.start && candidate.end >= unsafeTerm.end
    ));
    if (!segment) {
      atomicRanges.push(unsafeTerm);
      continue;
    }
    const segmentTerms = allTerms.filter((term) => (
      term.start >= segment.start && term.end <= segment.end
    ));
    const range = (unsafeTerm.forceSegment || segmentTerms.length >= 2)
      && SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(segment.content)
      ? { start: segment.start, end: segment.end, kind: "markup-identifier-list" }
      : unsafeTerm;
    const key = `${range.start}:${range.end}`;
    if (atomicSeen.has(key)) continue;
    atomicSeen.add(key);
    atomicRanges.push(range);
  }
  return atomicRanges;
}

function collectLocalParenthesizedPairTerms(text, absoluteStart) {
  const terms = [];
  const seen = new Set();
  for (const entry of UK_TO_US_TERMS) {
    for (const matcher of SOURCE_TERM_MATCHERS_BY_ENTRY.get(entry).parenthesized) {
      matcher.lastIndex = 0;
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const prefixLength = match[1].length;
        const matchedText = match[2];
        const localStart = match.index + prefixLength;
        const localEnd = localStart + matchedText.length;
        if (!isRecognizableAbbreviationInstruction(
          text,
          localStart,
          localEnd,
          matchedText,
          entry,
        )) continue;
        const start = absoluteStart + localStart;
        const end = absoluteStart + localEnd;
        const key = `${start}:${end}:${entry.label}`;
        if (seen.has(key)) continue;
        seen.add(key);
        terms.push({ start, end, matchedText, entry });
      }
    }
  }
  return terms;
}

function splitSharedPolicySegments(text) {
  const segments = [];
  for (const line of splitTextLines(text)) {
    const boundaries = [];
    let retainedLeadingNumberedHeadingMarker = false;
    const leadingParenNumberedMarker = line.content.match(
      SHARED_POLICY_LEADING_PAREN_NUMBERED_MARKER,
    );
    if (leadingParenNumberedMarker) {
      const remainder = line.content.slice(leadingParenNumberedMarker[0].length);
      if (SHARED_POLICY_EXPLICIT_HEADING_AT_START.test(remainder)) {
        retainedLeadingNumberedHeadingMarker = true;
      } else {
        boundaries.push({
          index: leadingParenNumberedMarker[0].length - 1,
          text: leadingParenNumberedMarker[0].slice(-1),
        });
      }
    }
    if (SHARED_POLICY_SEGMENT_BOUNDARY_CANDIDATE.test(line.content)) {
      SHARED_POLICY_SEGMENT_BOUNDARY.lastIndex = 0;
      let boundary;
      while ((boundary = SHARED_POLICY_SEGMENT_BOUNDARY.exec(line.content)) !== null) {
        const leadingNumberedMarker = boundary[0][0] === "."
          && SHARED_POLICY_LEADING_NUMBERED_MARKER.test(
            line.content.slice(0, boundary.index + 1),
          );
        const remainder = line.content.slice(boundary.index + boundary[0].length);
        if (
          leadingNumberedMarker
          && SHARED_POLICY_EXPLICIT_HEADING_AT_START.test(remainder)
        ) {
          retainedLeadingNumberedHeadingMarker = true;
          continue;
        }
        boundaries.push({ index: boundary.index, text: boundary[0] });
        if (boundaries.length >= MAX_SHARED_POLICY_SEGMENTS_PER_LINE) break;
      }
    }
    if (boundaries.length >= MAX_SHARED_POLICY_SEGMENTS_PER_LINE) {
      segments.push({ ...line, content: line.content, segmentOverflow: true });
      continue;
    }

    const firstLineSegment = segments.length;
    let localStart = 0;
    let followsCommaThenBoundary = false;
    for (const item of boundaries) {
      const localEnd = item.index + (item.text[0] === ";" || item.text[0] === "," ? 0 : 1);
      segments.push({
        start: line.start + localStart,
        end: line.start + localEnd,
        content: line.content.slice(localStart, localEnd),
        commaThenIsolated: followsCommaThenBoundary || item.text[0] === ",",
      });
      localStart = item.index + item.text.length;
      followsCommaThenBoundary = item.text[0] === ",";
    }
    segments.push({
      start: line.start + localStart,
      end: line.end,
      content: line.content.slice(localStart),
      commaThenIsolated: followsCommaThenBoundary,
    });
    if (retainedLeadingNumberedHeadingMarker) {
      segments[firstLineSegment].retainedLeadingNumberedHeadingMarker = true;
    }
    if (boundaries.length > 0) {
      for (let index = firstLineSegment; index < segments.length; index += 1) {
        segments[index].isolated = true;
      }
    }
  }
  return segments;
}

function findSharedStitchListPolicies(text) {
  const policies = [];
  for (const line of splitSharedPolicySegments(text)) {
    const recognitionContent = maskSharedStitchListLinkDestinations(line.content);
    if (line.segmentOverflow) {
      policies.push({
        start: line.start,
        end: line.end,
        decision: "deny",
        hardDeny: true,
        terms: collectSharedStitchListTerms(line.content, line.start),
      });
      continue;
    }
    if (line.retainedLeadingNumberedHeadingMarker) {
      const candidateTerms = collectSharedStitchListTerms(line.content, line.start);
      const recognizedTerms = candidateTerms.filter((term) => {
        const localStart = term.start - line.start;
        const localEnd = term.end - line.start;
        return !isUnsupportedCompoundContext(text, term.start, term.end)
          && isRecognizableAbbreviationInstruction(
            recognitionContent,
            localStart,
            localEnd,
            term.matchedText,
            term.entry,
          );
      });
      if (
        candidateTerms.length >= 2
        && recognizedTerms.length > 0
        && recognizedTerms.length < candidateTerms.length
      ) policies.push({
        start: line.start,
        end: line.end,
        decision: "deny",
        terms: candidateTerms,
      });
    }
    const completeBoundedSegment = line.isolated
      && SHARED_STITCH_LIST_COMPLETE_BOUNDED_LINE.test(recognitionContent);
    if (line.isolated && !completeBoundedSegment) {
      const localRecognitionText = recognitionContent.replace(
        SHARED_POLICY_CONSTRUCTION_HEADING_PREFIX,
        (prefix) => " ".repeat(prefix.length),
      );
      const localCandidateTerms = collectSharedStitchListTerms(line.content, line.start);
      const hasUnrecognizedCommandProse = localCandidateTerms.some((term) => {
        const localStart = term.start - line.start;
        return hasUnrecognizedCommandLead(localRecognitionText.slice(0, localStart));
      });
      const locallyRecognizedTerms = localCandidateTerms
        .filter((term) => {
          const localStart = term.start - line.start;
          const localEnd = term.end - line.start;
          return !isUnsupportedCompoundContext(text, term.start, term.end)
            && !hasUnrecognizedCommandLead(localRecognitionText.slice(0, localStart))
            && isRecognizableAbbreviationInstruction(
              localRecognitionText,
              localStart,
              localEnd,
              term.matchedText,
              term.entry,
            )
            && (
              !line.commaThenIsolated
              || isRecognizableAbbreviationInstruction(
                recognitionContent,
                localStart,
                localEnd,
                term.matchedText,
                term.entry,
              )
            );
        });
      const locallyRecognizedPairs = collectLocalParenthesizedPairTerms(
        localRecognitionText,
        line.start,
      ).filter((term) => !isUnsupportedCompoundContext(text, term.start, term.end));
      const localPolicyTerms = locallyRecognizedPairs.length === 1
        ? [
            locallyRecognizedPairs[0],
            ...locallyRecognizedTerms.filter((term) => (
              term.end <= locallyRecognizedPairs[0].start
              || term.start >= locallyRecognizedPairs[0].end
            )),
          ]
        : (locallyRecognizedTerms.length === 1 ? locallyRecognizedTerms : []);
      const incompleteCommaThenClause = line.commaThenIsolated
        && locallyRecognizedTerms.length !== localCandidateTerms.length;
      const locallyRecognizedRanges = [
        ...locallyRecognizedTerms,
        ...locallyRecognizedPairs,
      ];
      const incompleteIsolatedClause = !line.commaThenIsolated
        && localCandidateTerms.length >= 2
        && locallyRecognizedRanges.length > 0
        && localCandidateTerms.some((candidate) => !locallyRecognizedRanges.some((range) => (
          range.start <= candidate.start && range.end >= candidate.end
        )));
      if (
        !incompleteCommaThenClause
        && !incompleteIsolatedClause
        && localPolicyTerms.length > 0
      ) policies.push({
        start: line.start,
        end: line.end,
        decision: "allow",
        isolatedContext: true,
        terms: localPolicyTerms,
      });
      else if (
        (line.commaThenIsolated || incompleteIsolatedClause)
        && localCandidateTerms.length > 0
      ) policies.push({
        start: line.start,
        end: line.end,
        decision: "deny",
        hardDeny: true,
        provisionalIsolatedDeny: true,
        terms: localCandidateTerms,
      });
      if (hasUnrecognizedCommandProse && localCandidateTerms.length > 0) {
        policies.push({
          start: line.start,
          end: line.end,
          decision: "deny",
          hardDeny: true,
          terms: localCandidateTerms,
        });
      }
    }
    if (completeBoundedSegment) {
      policies.push({
        start: line.start,
        end: line.end,
        decision: "allow",
        isolatedContext: true,
        terms: collectSharedStitchListTerms(line.content, line.start).filter((term) => (
          !isUnsupportedCompoundContext(text, term.start, term.end)
        )),
      });
    }
    if (!SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(recognitionContent)) continue;
    SHARED_STITCH_LIST_TERM_PREFILTER.lastIndex = 0;
    let prefilterCount = 0;
    while (SHARED_STITCH_LIST_TERM_PREFILTER.exec(recognitionContent) !== null) {
      prefilterCount += 1;
      if (prefilterCount >= 2) break;
    }
    if (prefilterCount < 2) continue;

    const segmentPolicyTerms = collectSharedStitchListTerms(line.content, line.start);
    if (SHARED_STITCH_REPEAT_MARKER_LINE.test(recognitionContent)) {
      policies.push({
        start: line.start,
        end: line.end,
        decision: "allow",
        terms: segmentPolicyTerms,
      });
      continue;
    }
    if (analyzeMarkdownEmphasis(text, segmentPolicyTerms).malformed) {
      policies.push({
        start: line.start,
        end: line.end,
        decision: "deny",
        hardDeny: true,
        terms: segmentPolicyTerms,
      });
      continue;
    }

    if (SHARED_STITCH_LIST_ACTION_BRIDGE_LINE.test(recognitionContent)) {
      policies.push({
        start: line.start,
        end: line.end,
        decision: "allow",
        terms: collectSharedStitchListTerms(line.content, line.start),
      });
    }

    if (
      SHARED_STITCH_LIST_INVALID_ACTION_MIDDLE.test(recognitionContent)
      && !SHARED_STITCH_LIST_COMPLETE_BOUNDED_LINE.test(recognitionContent)
    ) {
      policies.push({
        start: line.start,
        end: line.end,
        decision: "deny",
        hardDeny: true,
        terms: collectSharedStitchListTerms(line.content, line.start),
      });
    }

    for (const denyFinder of [
      SHARED_STITCH_LIST_MALFORMED_FINDER,
      SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_FINDER,
      SHARED_STITCH_LIST_CONTAMINATED_FINDER,
      SHARED_STITCH_LIST_UNSUPPORTED_PAIR_FINDER,
      SHARED_STITCH_CLAUSE_CONTAMINATED_FINDER,
      SHARED_STITCH_LIST_OVERFLOW_FINDER,
    ]) {
      denyFinder.lastIndex = 0;
      let denyMatch;
      while ((denyMatch = denyFinder.exec(recognitionContent)) !== null) {
        const recognitionListText = denyMatch.groups.list;
        const localStart = denyMatch.index + denyMatch[1].length;
        const listText = line.content.slice(localStart, localStart + recognitionListText.length);
        if (
          denyFinder === SHARED_STITCH_LIST_MALFORMED_FINDER
          && (
            SHARED_STITCH_LIST_EXACT.test(recognitionListText)
            || !SHARED_STITCH_LIST_MALFORMED_TERM.test(recognitionListText)
          )
        ) continue;
        if (
          (
            denyFinder === SHARED_STITCH_LIST_CONTAMINATED_FINDER
            || denyFinder === SHARED_STITCH_CLAUSE_CONTAMINATED_FINDER
          )
          && (
            SHARED_STITCH_LIST_EXACT_ITEM.test(denyMatch.groups.middle)
            || SHARED_STITCH_LIST_BOUNDED_MIDDLE_CLAUSE.test(denyMatch.groups.middle)
            || SHARED_STITCH_LIST_COMPLETE_BOUNDED_LINE.test(recognitionContent)
          )
        ) continue;
        const start = line.start + localStart;
        const denyWholeSegment = denyFinder === SHARED_STITCH_LIST_CONTAMINATED_FINDER
          || denyFinder === SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_FINDER
          || denyFinder === SHARED_STITCH_LIST_UNSUPPORTED_PAIR_FINDER
          || denyFinder === SHARED_STITCH_CLAUSE_CONTAMINATED_FINDER;
        const policyStart = denyWholeSegment ? line.start : start;
        const policyEnd = denyWholeSegment ? line.end : start + listText.length;
        const policyText = denyWholeSegment ? line.content : listText;
        policies.push({
          start: policyStart,
          end: policyEnd,
          decision: "deny",
          hardDeny: true,
          terms: collectSharedStitchListTerms(policyText, policyStart),
        });
      }
    }

    SHARED_STITCH_LIST_FINDER.lastIndex = 0;
    let match;
    while ((match = SHARED_STITCH_LIST_FINDER.exec(recognitionContent)) !== null) {
      const recognitionListText = match.groups.list;
      const localStart = match.index + match[1].length;
      const localEnd = localStart + recognitionListText.length;
      const listText = line.content.slice(localStart, localEnd);
      const start = line.start + localStart;
      const end = line.start + localEnd;
      const context = unwrapSharedStitchList(
        line.content.slice(0, localStart),
        line.content.slice(localEnd),
      );
      const targetCoreMatch = context.remainder.match(FOLLOWING_GENERIC_TARGET_CORE)
        ?? context.remainder.match(FOLLOWING_CHAIN_TARGET_CORE)
        ?? context.remainder.match(FOLLOWING_POSITIONAL_STITCH_TARGET_CORE);
      const targetCore = Boolean(targetCoreMatch);
      const boundedTarget = FOLLOWING_BARE_COUNT_TARGET.test(context.remainder)
        || FOLLOWING_CHAIN_TARGET.test(context.remainder)
        || FOLLOWING_POSITIONAL_STITCH_TARGET.test(context.remainder)
        || Boolean(
          targetCoreMatch
          && SHARED_LIST_TRAILING_WRAPPED_CLAUSES.test(
            context.remainder.slice(targetCoreMatch[0].length),
          )
        );
      const commandAuthority = SHARED_LIST_COMMAND_AUTHORITY_BEFORE.test(context.authorityBefore)
        || SHARED_LIST_INLINE_COMMAND_AUTHORITY_BEFORE.test(context.authorityBefore)
        || SHARED_LIST_NESTED_COMMAND_AUTHORITY_BEFORE.test(context.authorityBefore)
        || (
          SHARED_LIST_COLOR_A_AUTHORITY_BEFORE.test(context.authorityBefore)
          && /^A\p{N}?[\t\p{Zs}]+/u.test(listText)
        );
      const positionalBridgeAuthority = POSITIONAL_INSTRUCTION_TARGET_BEFORE.test(
        context.authorityBefore,
      ) && IMMEDIATE_POSITIONAL_TARGET_BEFORE.test(context.authorityBefore) && boundedTarget;
      const priorAllowedInstructionList = policies.some((candidate) => (
        candidate.decision === "allow"
        && candidate.start >= line.start
        && candidate.end <= start
      ));
      const priorLineCommandAuthority = new RegExp(
        String.raw`${STRONG_INSTRUCTION_LINE_PREFIX_SOURCE}(?:make|repeat|work)\b`,
        "iu",
      ).test(context.authorityBefore);
      const bareAuthority = SHARED_LIST_BARE_AUTHORITY_BEFORE.test(context.authorityBefore)
        || (
          SHARED_LIST_INLINE_BARE_AUTHORITY_BEFORE.test(context.authorityBefore)
          && (
            EXPLICIT_INSTRUCTION_LINE_CONTEXT.test(context.authorityBefore)
            || priorAllowedInstructionList
            || priorLineCommandAuthority
          )
        );
      const hasAuthority = commandAuthority || positionalBridgeAuthority || bareAuthority;
      const proseTail = TRAILING_SUPPORTED_TERM_PROSE_PREDICATE.test(context.remainder)
        || TRAILING_GENERIC_TARGET_PROSE.test(context.remainder)
        || TRAILING_GENERIC_TARGET_ACTION_PROSE.test(context.remainder)
        || TRAILING_GENERIC_TARGET_IDENTIFIER.test(context.remainder);
      const validNonTargetRemainder = TARGET_FINAL_TERMINATOR.test(context.remainder)
        || BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION.test(context.remainder)
        || FOLLOWING_SIMPLE_INSTRUCTION_TARGET.test(context.remainder)
        || SHARED_LIST_PASSIVE_REMAINDER.test(context.remainder)
        || SHARED_LIST_REPETITION_REMAINDER.test(context.remainder)
        || SHARED_LIST_TRAILING_WRAPPED_CLAUSES.test(context.remainder);
      const recoverBoundedInstructionSuffix = bareAuthority
        && validNonTargetRemainder
        && policies.some((candidate) => (
          candidate.decision === "deny"
          && !candidate.hardDeny
          && candidate.start < start
          && candidate.end >= end
        ));
      const shouldClassify = targetCore
        || context.hadWrapper
        || !context.balanced
        || (commandAuthority && validNonTargetRemainder)
        || recoverBoundedInstructionSuffix
        || proseTail
        || !hasAuthority;
      if (!shouldClassify) continue;

      let decision = "deny";
      if (context.balanced && hasAuthority) {
        if (targetCore) decision = boundedTarget ? "allow" : "deny";
        else decision = validNonTargetRemainder ? "allow" : "deny";
      }

      if (
        decision === "deny"
        && SHARED_STITCH_LIST_COMPLETE_BOUNDED_LINE.test(recognitionContent)
      ) continue;

      const policyTerms = collectSharedStitchListTerms(listText, start);
      policies.push({
        start,
        end,
        decision,
        terms: policyTerms,
      });
      if (decision === "deny") SHARED_STITCH_LIST_FINDER.lastIndex = localStart + 1;
    }
  }
  return policies;
}

function hasSupportedTermProseContinuation(value) {
  let remainder = value.slice(0, 240);
  let foundTerm = false;
  for (let index = 0; index < 8; index += 1) {
    const connector = remainder.match(FOLLOWING_SUPPORTED_TERM_CONNECTOR);
    if (!connector) break;
    let afterConnector = remainder.slice(connector[0].length);
    afterConnector = afterConnector.replace(/^\p{N}+[\t\p{Zs}]+/u, "");
    const term = afterConnector.match(SUPPORTED_TERM_SEQUENCE_PREFIX);
    if (!term) break;
    const afterTerm = afterConnector.slice(term[0].length);
    if (/^[-‐‑‒–—―−﹣－\p{Pc}\p{Cf}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]/u.test(afterTerm)) return true;
    foundTerm = true;
    remainder = afterTerm;
  }
  return foundTerm && TRAILING_SUPPORTED_TERM_PROSE_PREDICATE.test(remainder);
}

function getSupportedTermListRemainder(value) {
  let remainder = value.slice(0, 240);
  let foundTerm = false;
  for (let index = 0; index < 8; index += 1) {
    const connector = remainder.match(FOLLOWING_SUPPORTED_TERM_CONNECTOR);
    if (!connector) break;
    let afterConnector = remainder.slice(connector[0].length);
    afterConnector = afterConnector.replace(/^\p{N}+[\t\p{Zs}]+/u, "");
    const term = afterConnector.match(SUPPORTED_TERM_SEQUENCE_PREFIX);
    if (!term) break;
    const afterTerm = afterConnector.slice(term[0].length);
    if (/^[-‐‑‒–—―−﹣－\p{Pc}\p{Cf}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]/u.test(afterTerm)) {
      return null;
    }
    foundTerm = true;
    remainder = afterTerm;
  }
  return foundTerm ? remainder : null;
}

function hasInvalidSharedTargetListContinuation(value) {
  let remainder = getSupportedTermListRemainder(value);
  if (remainder === null) return false;
  remainder = remainder.replace(/^[\t\p{Zs}]*[)}\]]+/u, "");
  if (
    TRAILING_SUPPORTED_TERM_PROSE_PREDICATE.test(remainder)
    || TRAILING_GENERIC_TARGET_PROSE.test(remainder)
  ) return true;
  if (FOLLOWING_GENERIC_TARGET_CORE.test(remainder)) {
    return !FOLLOWING_BARE_COUNT_TARGET.test(remainder);
  }
  if (FOLLOWING_CHAIN_TARGET_CORE.test(remainder)) {
    return !FOLLOWING_CHAIN_TARGET.test(remainder);
  }
  return false;
}

function hasGenericTargetProseContinuation(value) {
  const target = value.match(FOLLOWING_GENERIC_TARGET_CORE);
  if (!target) return false;
  const remainder = value.slice(target[0].length);
  return hasSupportedTermProseContinuation(remainder)
    || TRAILING_GENERIC_TARGET_PROSE.test(remainder)
    || TRAILING_GENERIC_TARGET_ACTION_PROSE.test(remainder)
    || TRAILING_GENERIC_TARGET_IDENTIFIER.test(remainder)
    || (
      !FOLLOWING_BARE_COUNT_TARGET.test(value)
      && TRAILING_GENERIC_TARGET_UNBOUNDED_ACTION.test(remainder)
    );
}

function hasChainTargetProseContinuation(value) {
  const target = value.match(FOLLOWING_CHAIN_TARGET_CORE);
  if (!target) return false;
  const remainder = value.slice(target[0].length);
  return hasSupportedTermProseContinuation(remainder)
    || TRAILING_GENERIC_TARGET_PROSE.test(remainder)
    || TRAILING_GENERIC_TARGET_ACTION_PROSE.test(remainder)
    || TRAILING_GENERIC_TARGET_IDENTIFIER.test(remainder)
    || (
      !FOLLOWING_CHAIN_TARGET.test(value)
      && TRAILING_GENERIC_TARGET_UNBOUNDED_ACTION.test(remainder)
    );
}

function getCommandArgument(value) {
  return value.match(COMMAND_ARGUMENT_BEFORE)?.groups?.argument
    ?.replace(/^[\t\p{Zs}]*[([{*_"']*[\t\p{Zs}]*/u, "");
}

function hasUnsupportedCommandListLead(value) {
  if (!PRECEDING_SUPPORTED_TERM_CONNECTOR_BEFORE.test(value)) return false;
  const argument = getCommandArgument(value);
  if (!argument) return false;
  return !new RegExp(
    String.raw`^${COMMAND_SUPPORTED_TERM_LEAD_SOURCE}(?:${TARGET_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
    "iu",
  ).test(argument);
}

function hasUnrecognizedCommandLead(value) {
  const argument = getCommandArgument(value);
  if (!argument) return false;
  if (/^\p{N}+(?:st|nd|rd|th)?\b/iu.test(argument)) return false;
  if (SUPPORTED_TERM_SEQUENCE_PREFIX.test(argument)) return false;
  const lead = argument.match(/^(?<word>\p{L}[\p{L}\p{M}'’-]*)\b/u)
    ?.groups?.word?.toLocaleLowerCase("en-US");
  if (!lead) return false;
  return !ALLOWED_PRECEDING_INSTRUCTION_WORDS.has(lead)
    && !SAFE_COMMAND_LEAD_WORDS.has(lead)
    && !/ly$/iu.test(lead);
}

function hasBoundedSupportedTermContinuation(value) {
  let remainder = value.slice(0, 240);
  let foundTerm = false;
  for (let index = 0; index < 8; index += 1) {
    const connector = remainder.match(FOLLOWING_SUPPORTED_TERM_CONNECTOR);
    if (!connector) break;
    const afterConnector = remainder.slice(connector[0].length);
    const term = afterConnector.match(SUPPORTED_TERM_SEQUENCE_PREFIX);
    if (!term) break;
    const afterTerm = afterConnector.slice(term[0].length);
    if (/^[-‐‑‒–—―−﹣－\p{Pc}\p{Cf}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]/u.test(afterTerm)) return false;
    foundTerm = true;
    remainder = afterTerm;
  }
  if (!foundTerm) return false;
  remainder = remainder.replace(/^[\t\p{Zs}]*[)}\]]+/u, "");
  return TARGET_FINAL_TERMINATOR.test(remainder)
    || BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION.test(remainder)
    || hasBoundedFollowingInstructionContext(remainder)
    || FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(remainder)
    || FOLLOWING_TARGET_QUALIFIER.test(remainder)
    || FOLLOWING_UNQUALIFIED_ROW_TARGET.test(remainder)
    || FOLLOWING_CHAIN_TARGET.test(remainder)
    || FOLLOWING_BARE_COUNT_TARGET.test(remainder);
}

function hasBoundedFollowingInstructionContext(value) {
  return FOLLOWING_SIMPLE_INSTRUCTION_TARGET.test(value)
    || FOLLOWING_TARGET_QUALIFIER.test(value)
    || FOLLOWING_UNQUALIFIED_ROW_TARGET.test(value)
    || FOLLOWING_CHAIN_TARGET.test(value)
    || FOLLOWING_BARE_COUNT_TARGET.test(value);
}

function maskExplicitInstructionHeading(value) {
  return value.replace(
    EXPLICIT_INSTRUCTION_HEADING_PREFIX,
    (prefix) => prefix.replace(/[^\r\n]/gu, " "),
  );
}

function isRecognizableAbbreviationInstruction(text, start, end, matchedText, entry) {
  const normalized = matchedText.toLocaleLowerCase("en-US");
  const uppercaseAbbreviation = matchedText === matchedText.toLocaleUpperCase("en-US")
    && matchedText !== matchedText.toLocaleLowerCase("en-US");
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
  const positionalTargetBefore = POSITIONAL_INSTRUCTION_TARGET_BEFORE.test(before)
    || EXPLICIT_HEADING_BARE_POSITIONAL_SOURCE_BEFORE.test(before);
  const boundedPositionalChainTargetBefore = BOUNDED_POSITIONAL_CHAIN_TARGET_BEFORE.test(before);
  const inlineChainCountsAsTargetBefore = INLINE_CHAIN_COUNTS_AS_TARGET_BEFORE.test(before);
  const strongUnqualifiedRowTargetBefore = STRONG_UNQUALIFIED_ROW_TARGET_BEFORE.test(before);
  const followingUnqualifiedRowTarget = FOLLOWING_UNQUALIFIED_ROW_TARGET.test(after);
  const followingChainTarget = FOLLOWING_CHAIN_TARGET.test(after);
  const followingBareCountTarget = FOLLOWING_BARE_COUNT_TARGET.test(after);
  const followingPositionalStitchTarget = FOLLOWING_POSITIONAL_STITCH_TARGET.test(after);
  const bareCountBefore = BARE_COUNT_INSTRUCTION_PREFIX.test(before)
    || CONSTRUCTION_BARE_COUNT_INSTRUCTION_PREFIX.test(before);
  const countedListBefore = COUNTED_LIST_INSTRUCTION_PREFIX.test(before);
  const boundedSameLineClauseBefore = BOUNDED_SAME_LINE_CLAUSE_CONTEXT.test(before);
  const immediateNumericTermBefore = /(?:^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])\p{N}+[\t\p{Zs}]+$/u.test(before);
  const boundedSupportedTermContinuation = hasBoundedSupportedTermContinuation(after);
  const followingTargetQualifier = FOLLOWING_TARGET_QUALIFIER.test(after);
  const boundedSameLineTarget = terminalAfter
    || followingTargetQualifier
    || followingUnqualifiedRowTarget
    || followingBareCountTarget
    || followingChainTarget
    || followingPositionalStitchTarget;
  const exactNumericCommandCount = /^\p{N}+[\t\p{Zs}]*$/u.test(
    getCommandArgument(before) ?? "",
  ) || INLINE_EXACT_NUMERIC_COMMAND_COUNT_PREFIX.test(before);
  const explicitInstructionHeading = isExplicitBoundedInstructionLineContext(before)
    || (uppercaseAbbreviation && EXPLICIT_INSTRUCTION_HEADING_PREFIX.test(before));
  if (
    entry.label !== "Tension"
    && POSITIONAL_COMMAND_CANDIDATE_BEFORE.test(before)
    && !positionalTargetBefore
    && !boundedPositionalChainTargetBefore
    && !inlineChainCountsAsTargetBefore
    && !strongUnqualifiedRowTargetBefore
    && !IMMEDIATE_POSITIONAL_TARGET_BEFORE.test(before)
    && !boundedSameLineClauseBefore
    && !exactNumericCommandCount
  ) return false;
  if (FOLLOWING_NON_STITCH_SLASH_TOKEN.test(after)) return false;
  if (hasInvalidSharedTargetListContinuation(after)) return false;
  if (hasChainTargetProseContinuation(after)) return false;
  if (hasGenericTargetProseContinuation(after)) return false;
  const unboundedTargetCore = after.match(FOLLOWING_GENERIC_TARGET_CORE)
    ?? after.match(FOLLOWING_POSITIONAL_STITCH_TARGET_CORE);
  if (
    unboundedTargetCore
    && !followingBareCountTarget
    && !followingPositionalStitchTarget
  ) {
    const targetRemainder = after.slice(unboundedTargetCore[0].length);
    const boundedTargetSuffix = FOLLOWING_TARGET_QUALIFIER.test(targetRemainder)
      || FOLLOWING_UNQUALIFIED_ROW_TARGET.test(targetRemainder)
      || FOLLOWING_SUPPORTED_TARGET_CONTINUATION.test(targetRemainder)
      || FOLLOWING_ROW_OR_ROUND_TARGET_SUFFIX.test(targetRemainder)
      || /^[\t\p{Zs}]*[)}\]]*[\t\p{Zs}]*;/u.test(targetRemainder)
      || /^[\t\p{Zs}]+from[\t\p{Zs}]+hook(?=[\t\p{Zs}]*(?:[.!?]|[;,][\t\p{Zs}]+|$))/iu.test(targetRemainder);
    if (!boundedTargetSuffix) return false;
  }
  const arbitraryWordTailBeforePunctuation = /^[\t\p{Zs}]+[\p{L}\p{M}][\p{L}\p{M}'’\-‐‑‒–—]{0,39}(?:[\t\p{Zs}]+[\p{L}\p{M}][\p{L}\p{M}'’\-‐‑‒–—]{0,39}){0,5}(?=[\t\p{Zs}]*[.!?](?:[\t\p{Zs}]|\r?\n|$))/u.test(after);
  const arbitraryWordTailAtHeadingBoundary = isExplicitBoundedInstructionLineContext(before)
    && /^[\t\p{Zs}]+[\p{L}\p{M}][\p{L}\p{M}'’\-‐‑‒–—]{0,39}(?:[\t\p{Zs}]+[\p{L}\p{M}][\p{L}\p{M}'’\-‐‑‒–—]{0,39}){0,5}(?=[\t\p{Zs}]*(?:;|\r?\n|$))/u.test(after);
  if (
    entry.label !== "Tension"
    && (arbitraryWordTailBeforePunctuation || arbitraryWordTailAtHeadingBoundary)
    && !FOLLOWING_INSTRUCTION_CONTEXT.test(after)
    && !FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(after)
    && !SHARED_LIST_REPETITION_REMAINDER.test(after)
    && !FOLLOWING_BOUNDED_REPETITION_TARGET.test(after)
    && !/^[\t\p{Zs}]+(?:once|twice|thrice|(?:\p{N}+|[\p{L}\p{M}]+(?:[-‐‑‒–—][\p{L}\p{M}]+)?)[\t\p{Zs}]+times?)(?=[\t\p{Zs}]*;)/iu.test(after)
    && !followingChainTarget
    && !FOLLOWING_TARGET_QUALIFIER.test(after)
    && !FOLLOWING_UNQUALIFIED_ROW_TARGET.test(after)
    && !/^[\t\p{Zs}]+remains(?=[\t\p{Zs}]*(?:[.!?]|;|\r?\n|$))/iu.test(after)
  ) return false;
  if (
    PRECEDING_POSITION_TOKEN_BEFORE.test(before)
    && !positionalTargetBefore
    && !boundedPositionalChainTargetBefore
    && !boundedCommandBefore
    && !BOUNDED_INLINE_COMMAND_BEFORE.test(before)
    && !boundedSameLineClauseBefore
    && !isExplicitBoundedInstructionLineContext(before)
  ) return false;
  if (
    entry.label !== "Tension"
    && !SUPPORTED_ABBREVIATION_TERMS.has(normalized)
    && immediateNumericTermBefore
    && !bareCountBefore
    && !countedListBefore
    && !boundedCommandBefore
    && !boundedSameLineClauseBefore
    && !isExplicitBoundedInstructionLineContext(before)
  ) return false;
  if (
    entry.label !== "Tension"
    && hasUnsupportedCommandListLead(before)
  ) return false;
  if (
    entry.label !== "Tension"
    && COMMAND_TARGET_CONTEXT_BEFORE.test(before)
    && hasUnrecognizedCommandLead(before)
  ) return false;
  if (
    SUPPORTED_ABBREVIATION_TERMS.has(normalized)
    && NON_POSITIONAL_COMMAND_TARGET_BEFORE.test(before)
    && !IMMEDIATE_POSITIONAL_TARGET_BEFORE.test(before)
    && !positionalTargetBefore
    && !strongUnqualifiedRowTargetBefore
    && !boundedSameLineClauseBefore
  ) return false;
  if (
    (
      isAmbiguousTermProseContinuation(rawBefore, rawAfter, matchedText)
      || isAmbiguousTermProseContinuation(before, after, matchedText)
    )
    && !explicitInstructionHeading
    && !(
      boundedCommandBefore
      && (
        terminalAfter
        || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
        || FOLLOWING_PASSIVE_INSTRUCTION_CONTEXT.test(after)
        || boundedSupportedTermContinuation
        || BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION.test(after)
        || followingChainTarget
      )
    )
    && !((positionalTargetBefore || strongUnqualifiedRowTargetBefore) && FOLLOWING_TARGET_QUALIFIER.test(after))
    && !(strongUnqualifiedRowTargetBefore && followingUnqualifiedRowTarget)
    && !(inlineChainCountsAsTargetBefore && (terminalAfter || FOLLOWING_INLINE_INSTRUCTION_CLAUSE.test(after)))
    && !((bareCountBefore || countedListBefore) && (followingBareCountTarget || followingChainTarget))
    && !((boundedSameLineClauseBefore || boundedPositionalChainTargetBefore) && boundedSameLineTarget)
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
  if (explicitInstructionHeading) {
    if (!uppercaseAbbreviation) return true;
    const localBefore = maskExplicitInstructionHeading(before);
    if (localBefore === before) return false;
    const localText = `${localBefore}${matchedText}${after}`;
    const locallyRecognized = isRecognizableAbbreviationInstruction(
      localText,
      localBefore.length,
      localBefore.length + matchedText.length,
      matchedText,
      entry,
    );
    if (locallyRecognized) return true;
    return BOUNDED_UPPERCASE_BARE_INSTRUCTION_PREFIX.test(localBefore)
      && (
        terminalAfter
        || followingChainTarget
        || followingBareCountTarget
        || followingPositionalStitchTarget
        || boundedSupportedTermContinuation
        || (
          FOLLOWING_INSTRUCTION_CONTEXT.test(after)
          && FOLLOWING_CROCHET_NOUN_CONTEXT.test(after)
        )
      );
  }
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
      || boundedSupportedTermContinuation
      || BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION.test(after)
      || followingChainTarget
    )
  ) return true;
  if (strongUnqualifiedRowTargetBefore && followingUnqualifiedRowTarget) return true;
  if (inlineChainCountsAsTargetBefore && (terminalAfter || FOLLOWING_INLINE_INSTRUCTION_CLAUSE.test(after))) return true;
  if ((boundedSameLineClauseBefore || boundedPositionalChainTargetBefore) && boundedSameLineTarget) {
    return true;
  }
  if (
    (positionalTargetBefore || strongUnqualifiedRowTargetBefore)
    && (
      !uppercaseAbbreviation
      || terminalAfter
      || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
      || FOLLOWING_TARGET_QUALIFIER.test(after)
    )
  ) return true;
  if (
    SAME_LINE_ACTION_LIST_CONTEXT.test(before)
    && (
      terminalAfter
      || FOLLOWING_INSTRUCTION_CONTEXT.test(after)
      || boundedSupportedTermContinuation
      || BOUNDED_INSTRUCTION_CLAUSE_CONTINUATION.test(after)
    )
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
      && (
        (
          COUNTED_LIST_INSTRUCTION_PREFIX.test(before)
          && (terminalAfter || followingBareCountTarget || followingChainTarget)
        )
        || (
          /^\p{N}+$/u.test(precedingToken)
          && bareCountBefore
          && (followingBareCountTarget || followingChainTarget)
        )
      )
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

const PLAIN_WORK_CANDIDATE = /^ {0,3}work[\t ]+[^;\r\n.!?]{1,480}[.!?]?[\t ]*$/iu;
const PLAIN_ATOMIC_WRAPPED_IDENTIFIER_CANDIDATE = PLAIN_WORK_CANDIDATE;
const PLAIN_ATOMIC_FOLLOWING_COMMAND = /,[\t ]+then[\t ]+(?:add|begin|ch(?:ain)?|commence|complete|continue|crochet|decrease|finish|increase|insert|join|keep|make|miss|place|pull|repeat|skip|start|turn|use|using|work|yo)\b/iu;
const PLAIN_ATOMIC_IDENTIFIER_TOKEN = /[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]+/gu;
const PLAIN_ATOMIC_MALFORMED_ABBREVIATION = /^(?:(?:dtr|htr|dc|tr)[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]+|[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]*[\p{Pc}\p{Cf}](?:dtr|htr|dc|tr)[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]*)$/iu;
const SIMPLE_FAST_WORK_TERM_SOURCE = String.raw`(?:double[\t\x20]+treble[\t\x20]+crochet|half[\t\x20]+treble[\t\x20]+crochet|double[\t\x20]+treble|treble[\t\x20]+crochet|half[\t\x20]+treble|double[\t\x20]+crochet|dtr|htr|treble|tr|dc)`;
const SIMPLE_FAST_WORK_QUANTIFIER_SOURCE = String.raw`(?:(?:a|an|the|one|two|three|four|five|six|seven|eight|nine|ten|\p{N}+)[\t\x20]+)?`;
const SIMPLE_FAST_MALFORMED_WORK_ITEM_SIGNAL = new RegExp(
  String.raw`(?:^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:${SIMPLE_FAST_WORK_QUANTIFIER_SOURCE}${SIMPLE_FAST_WORK_TERM_SOURCE}${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE}|[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]{0,39}[\p{Pc}\p{Cf}]${SIMPLE_FAST_WORK_TERM_SOURCE}(?:${SHARED_STITCH_LIST_IDENTIFIER_SUFFIX_SOURCE})?)(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);
const SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE = String.raw`${SIMPLE_FAST_WORK_QUANTIFIER_SOURCE}${SIMPLE_FAST_WORK_TERM_SOURCE}`;
const SIMPLE_FAST_WORK_ITEM_SOURCE = String.raw`(?:
  ${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}
  |\*\*\*${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}\*\*\*
  |___${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}___
  |\*\*${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}\*\*
  |__${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}__
  |\*${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}\*
  |_${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}_
  |${SIMPLE_FAST_WORK_QUANTIFIER_SOURCE}(?:
    \*\*\*${SIMPLE_FAST_WORK_TERM_SOURCE}\*\*\*
    |___${SIMPLE_FAST_WORK_TERM_SOURCE}___
    |\*\*${SIMPLE_FAST_WORK_TERM_SOURCE}\*\*
    |__${SIMPLE_FAST_WORK_TERM_SOURCE}__
    |\*${SIMPLE_FAST_WORK_TERM_SOURCE}\*
    |_${SIMPLE_FAST_WORK_TERM_SOURCE}_
  )
)`.replace(/[\r\n ]+/gu, "");
const SIMPLE_FAST_WORK_SEPARATOR_SOURCE = String.raw`(?:[\t\x20]*,[\t\x20]*(?:(?:and|or)[\t\x20]+)?|[\t\x20]+(?:and|or)[\t\x20]+)`;
const SIMPLE_FAST_WORK_LIST_SOURCE = String.raw`${SIMPLE_FAST_WORK_ITEM_SOURCE}(?:${SIMPLE_FAST_WORK_SEPARATOR_SOURCE}${SIMPLE_FAST_WORK_ITEM_SOURCE}){0,3}`;
const SIMPLE_FAST_PARENTHESIZED_WORK_GROUP_SOURCE = String.raw`${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}(?:${SIMPLE_FAST_WORK_SEPARATOR_SOURCE}${SIMPLE_FAST_WORK_PLAIN_ITEM_SOURCE}){1,3}`;
const SIMPLE_FAST_BOUNDED_SHARED_LIST_SOURCE = String.raw`${SIMPLE_FAST_WORK_ITEM_SOURCE}(?:${SIMPLE_FAST_WORK_SEPARATOR_SOURCE}${SIMPLE_FAST_WORK_ITEM_SOURCE}){1,3}`;
const SIMPLE_FAST_NORMALIZED_SHARED_LIST = new RegExp(
  String.raw`^[\t ]*${SIMPLE_FAST_BOUNDED_SHARED_LIST_SOURCE}[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_WORK_LINKED_LIST_SOURCE = String.raw`\[[\t\x20]*${SIMPLE_FAST_WORK_LIST_SOURCE}[\t\x20]*\]\([^\\\s()"'<>]{0,128}\)`;
const SIMPLE_FAST_WORK_REFERENCE_LINKED_LIST_SOURCE = String.raw`\[[\t\x20]*${SIMPLE_FAST_WORK_LIST_SOURCE}[\t\x20]*\]\[(?:${MARKDOWN_REFERENCE_LABEL_CHARACTER_SOURCE}){0,999}\]`;
const SIMPLE_FAST_WORK_TARGET_STITCH_SOURCE = String.raw`(?:${SIMPLE_FAST_WORK_TERM_SOURCE}|half[\t\x20]+double[\t\x20]+crochet|single[\t\x20]+crochet|hdc|sc)`;
const SIMPLE_FAST_WORK_CHAIN_TARGET_SOURCE = String.raw`(?:in|into)[\t\x20]+(?:the[\t\x20]+)?(?:ch|chain)(?:(?:(?:[\t\x20]*[-‐‑‒–—―−﹣－][\t\x20]*|[\t\x20]+)\p{N}+[\t\x20]+(?:spaces?|sps?))|[\t\x20]+(?:spaces?|sps?))?`;
const SIMPLE_FAST_WORK_TARGET_SOURCE = String.raw`(?:
  ${SIMPLE_FAST_WORK_CHAIN_TARGET_SOURCE}
  |(?:in|into|at|on|over|through|under)[\t\x20]+(?:the[\t\x20]+)?(?:adjacent|both|corresponding|each|every|first|following|last|marked|next|previous|remaining|same|second|third|\p{N}+(?:st|nd|rd|th)?)[\t\x20]+(?:${SIMPLE_FAST_WORK_TARGET_STITCH_SOURCE}|chains?|hooks?|loops?|markers?|rounds?|rows?|spaces?|st(?:s|itch(?:es)?)?)
  |across|alone|around
)`.replace(/[\r\n ]+/gu, "");
const SIMPLE_FAST_WORK_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+(?:${SIMPLE_FAST_WORK_LINKED_LIST_SOURCE}|${SIMPLE_FAST_WORK_REFERENCE_LINKED_LIST_SOURCE}|${SIMPLE_FAST_WORK_LIST_SOURCE})(?:[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE})?[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_PARENTHESIZED_WORK_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+\([\t ]*${SIMPLE_FAST_PARENTHESIZED_WORK_GROUP_SOURCE}[\t ]*\)[\t ]+in[\t ]+(?:the[\t ]+)?next[\t ]+stitch[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_DECLARATIVE_GLOSSARY_LINE = new RegExp(
  String.raw`^ {0,3}(?:this|that)[\t ]+says[\t ]+${SIMPLE_FAST_WORK_LIST_SOURCE}[\t ]+in[\t ]+(?:a|the)[\t ]+glossary(?:[.!?];?|;)?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_GLOSSARY_PLAIN_TERM_SOURCE = String.raw`(?:${SIMPLE_FAST_WORK_TERM_SOURCE}|tension[\t\x20]+square)`;
const SIMPLE_FAST_GLOSSARY_TERM_SOURCE = String.raw`(?:${SIMPLE_FAST_GLOSSARY_PLAIN_TERM_SOURCE}|\x60[\t\x20]*${SIMPLE_FAST_GLOSSARY_PLAIN_TERM_SOURCE}[\t\x20]*\x60|\[[\t\x20]*${SIMPLE_FAST_GLOSSARY_PLAIN_TERM_SOURCE}[\t\x20]*\]\([^\\\s()"'<>]{0,128}\))`;
const SIMPLE_FAST_GLOSSARY_SEPARATOR_SOURCE = String.raw`(?:[\t\x20]*,[\t\x20]*(?:(?:and|or)[\t\x20]+)?|[\t\x20]*;[\t\x20]*|[\t\x20]+(?:and|or)[\t\x20]+)`;
const SIMPLE_FAST_GLOSSARY_TERM_LIST_LINE = new RegExp(
  String.raw`^ {0,3}(?:the[\t ]+)?glossary[\t ]+(?:lists|discusses)[\t ]+${SIMPLE_FAST_GLOSSARY_TERM_SOURCE}(?:${SIMPLE_FAST_GLOSSARY_SEPARATOR_SOURCE}${SIMPLE_FAST_GLOSSARY_TERM_SOURCE}){1,15}(?:[.!?];?|;)?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_GLOSSARY_TERM_LIST_PREFIX = new RegExp(
  String.raw`^ {0,3}(?:the[\t ]+)?glossary[\t ]+(?:lists|discusses)[\t ]+${SIMPLE_FAST_GLOSSARY_TERM_SOURCE}(?:${SIMPLE_FAST_GLOSSARY_SEPARATOR_SOURCE}${SIMPLE_FAST_GLOSSARY_TERM_SOURCE}){0,14}[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_FLAT_TERM_PREFIX = new RegExp(
  String.raw`^${SIMPLE_FAST_GLOSSARY_TERM_SOURCE}(?=$|[\t ,;.!?])`,
  "iu",
);
const SIMPLE_FAST_NUMBERED_ROUND_PREFIX = /^ {0,3}round[\t ]+\p{N}{1,9}[\t ]*:[\t ]*/iu;
const SIMPLE_FAST_NUMBERED_ITEM_PREFIX = /^ {0,3}(?:>+[\t ]+)*(?:(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t ]+)$/u;
const SIMPLE_FAST_NUMBERED_ITEM_START = /^ {0,3}(?:>+[\t ]+)*(?:(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t ]+)/u;
const SIMPLE_FAST_MARKED_ITEM_START = /^ {0,3}(?:(?:>+[\t\p{Zs}]+)+(?:[-+*•·▪◦‣][\t\p{Zs}]+|(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t\p{Zs}]+)?|(?:[-+*•·▪◦‣]|\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t\p{Zs}]+)/u;
const SIMPLE_FAST_ATTACHED_NUMBERED_PERIOD_WORK_START = /^ {0,3}(?:(?:>+[\t\p{Zs}]+)*|>+)\p{N}{1,9}\.[\t\p{Zs}]*/u;
const SIMPLE_FAST_OVERLONG_NUMBERED_ITEM_START = /^ {0,3}(?:>+[\t ]+)*(?:(?:\p{N}{10,}[.)]|\(\p{N}{10,}\))[\t ]+)/u;
const SIMPLE_FAST_OVERLONG_ATTACHED_NUMBERED_WORK_START = /^ {0,3}(?:(?:>+[\t\p{Zs}]+)*|>+)(?:(?:\p{N}{10,}[.)])|(?:\(\p{N}{10,}\)))(?=work[\t\p{Zs}]+)/iu;
const SIMPLE_FAST_MALFORMED_MARKED_WORK_START = /^ {0,3}(?:>+[-+*•·▪◦‣][\t\p{Zs}]*|>+|[-+*•·▪◦‣]|(?:>+[\t\p{Zs}]+)+(?:>+[-+*•·▪◦‣]*|[-+*•·▪◦‣]|\p{N}{1,9}\)|\(\p{N}{1,9}\))|(?:>+)?(?:\p{N}{1,9}\)|\(\p{N}{1,9}\)))work[\t\p{Zs}]+/iu;
const SIMPLE_FAST_DENIED_MARKDOWN_HEADING_WORK_START = /^ {0,3}(?:>+[\t\p{Zs}]*)*#{1,6}[\t\p{Zs}]*work[\t\p{Zs}]+/iu;
const SIMPLE_FAST_BARE_SHARED_LIST_WITH_TARGET = new RegExp(
  String.raw`^ {0,3}${SIMPLE_FAST_BOUNDED_SHARED_LIST_SOURCE}[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE}[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_NUMBERED_BARE_ITEM_BODY = new RegExp(
  String.raw`^ {0,3}(?<list>${SIMPLE_FAST_WORK_LIST_SOURCE})(?<target>[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE})?[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_NUMBERED_SHARED_LIST_ALONE = new RegExp(
  String.raw`^ {0,3}(?:>+[\t ]+)*(?:(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t ]+)${SIMPLE_FAST_BOUNDED_SHARED_LIST_SOURCE}[\t ]+alone[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_NUMBERED_BARE_SHARED_LIST = new RegExp(
  String.raw`^ {0,3}(?:>+[\t ]+)*(?:(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t ]+)${SIMPLE_FAST_BOUNDED_SHARED_LIST_SOURCE}[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_ADVERTISED_VERTICAL_TERM_BY_NORMALIZED = new Map([
  ...SOURCE_STITCH_TERM_ENTRIES.map(({ entry, term }) => [term, { entry, tension: false }]),
  ["tension square", { entry: TENSION_TERM_ENTRY, tension: true }],
]);
const SIMPLE_FAST_WORK_LINK_CANDIDATE_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+\[[\t\x20]*${SIMPLE_FAST_WORK_LIST_SOURCE}[\t\x20]*\]\((?<destination>[^\r\n]{0,256})\)(?:[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE})?[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_WORK_LINKED_THEN_PLAIN_LIST_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+\[[\t\x20]*${SIMPLE_FAST_WORK_LIST_SOURCE}[\t\x20]*\]\((?<destination>[^\r\n]{0,256})\)${SIMPLE_FAST_WORK_SEPARATOR_SOURCE}${SIMPLE_FAST_WORK_LIST_SOURCE}(?:[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE})?[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_WORK_BARE_LABEL_THEN_PLAIN_LIST_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+\[[^\]\r\n]{1,256}\]${SIMPLE_FAST_WORK_SEPARATOR_SOURCE}${SIMPLE_FAST_WORK_LIST_SOURCE}[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE}[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_EXACT_WORK_LIST = new RegExp(
  String.raw`^[\t ]*${SIMPLE_FAST_WORK_LIST_SOURCE}[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_UNSUPPORTED_COMPOUND_ITEM = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:front[\t ]+post|back[\t ]+post|long|spike|waistcoat|back[\t ]+loop)[\t ]+(?<term>${SIMPLE_FAST_WORK_TERM_SOURCE})(?=$|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SIMPLE_FAST_HEADING_BARE_LABEL_THEN_PLAIN_LIST_LINE = new RegExp(
  String.raw`^ {0,3}(?:(?:>+[\t ]+)?(?:(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t ]+)?(?:body|row[\t ]+\p{N}{1,9})[\t ]*:[\t ]*)work[\t ]+\[[^\]\r\n]{1,256}\][\t ]+(?:and|or)[\t ]+(?:dtr|htr|tr|dc)[\t ]+in[\t ]+next[\t ]+stitch[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_WORK_CANDIDATE = /^ {0,3}work[\t ][^\r\n]{1,510}$/iu;
const SIMPLE_FAST_ALONE_TARGET = /[\t ]+alone[.!?]?[\t ]*$/iu;
const SINGLE_CODE_INDENTED_LINE = /^(?:(?: {4}|\t)| {0,3}>[\t ]{5})[^\r\n]*$/u;
const SIMPLE_FAST_UNMAPPED_CONTINUATION_SOURCE = String.raw`(?:(?:ch|chain)[\t ]+\p{N}{1,9}|\p{N}{1,9}[\t ]+(?:ch|chains?)|turn)`;
const SIMPLE_FAST_SEGMENT_SEPARATOR = new RegExp(
  String.raw`(?:[.!?]|;|,[\t ]+then)[\t ]+|,[\t ]+(?=${SIMPLE_FAST_UNMAPPED_CONTINUATION_SOURCE}\b)|[\t ]+and(?:[\t ]+then)?[\t ]+(?=${SIMPLE_FAST_UNMAPPED_CONTINUATION_SOURCE}\b)`,
  "giu",
);
function hasSimpleFastSegmentSeparator(text) {
  SIMPLE_FAST_SEGMENT_SEPARATOR.lastIndex = 0;
  const result = SIMPLE_FAST_SEGMENT_SEPARATOR.test(text);
  SIMPLE_FAST_SEGMENT_SEPARATOR.lastIndex = 0;
  return result;
}
const SIMPLE_FAST_LEADING_NUMBERED_PERIOD = /^[\t ]*(?:>+[\t ]+)*\p{N}{1,9}\.$/u;
const SIMPLE_FAST_LEADING_OVERLONG_NUMBERED_PERIOD = /^[\t ]*(?:>+[\t ]+)*\p{N}{10,}\.$/u;
const SIMPLE_FAST_LEADING_HEADING_ABBREVIATION_PERIOD = new RegExp(
  String.raw`^${INSTRUCTION_HEADING_PREFIX_SOURCE}(?:rnd|r)\.$`,
  "iu",
);
const SIMPLE_FAST_SEGMENT_PREFIX = /^ {0,3}(?:(?:>+[\t\p{Zs}]+)+(?:[-+*•·▪◦‣][\t\p{Zs}]+|(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t\p{Zs}]+)?|(?:[-+*•·▪◦‣]|\p{N}{1,9}[.)]|\(\p{N}{1,9}\))[\t\p{Zs}]+)?/u;
const SIMPLE_FAST_ABBREVIATED_NUMBERED_HEADING_SOURCE = String.raw`(?:rnd|r)\.?[\t\p{Zs}]*\p{N}+${INSTRUCTION_SIDE_QUALIFIER_SOURCE}`;
const SIMPLE_FAST_WORK_HEADING_PREFIX = new RegExp(
  String.raw`^${INSTRUCTION_HEADING_PREFIX_SOURCE}(?:(?:${SIMPLE_FAST_ABBREVIATED_NUMBERED_HEADING_SOURCE})|(?:${INSTRUCTION_HEADING_SOURCE})|(?:${CONSTRUCTION_INSTRUCTION_HEADING_SOURCE})|skirt|begin[\t\p{Zs}]+here)[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`,
  "iu",
);
const SIMPLE_FAST_CONSTRUCTION_HEADING_PREFIX = new RegExp(
  String.raw`^${INSTRUCTION_HEADING_PREFIX_SOURCE}(?:${CONSTRUCTION_INSTRUCTION_HEADING_SOURCE}|skirt|begin[\t\p{Zs}]+here)[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?${INSTRUCTION_DELIMITER_SOURCE}[\t\p{Zs}]*(?:${MARKDOWN_EMPHASIS_WRAPPER_SOURCE}[\t\p{Zs}]*)?`,
  "iu",
);
const SIMPLE_BOUNDED_BARE_STITCH_LINE = new RegExp(
  String.raw`^ {0,3}${SIMPLE_FAST_WORK_LIST_SOURCE}(?:[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE})?[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_BOUNDED_SINGLE_TERM_COMMAND_START = /^ {0,3}(?:add|begin|commence|complete|continue|crochet|decrease|finish|increase|insert|join|keep|make|miss|place|pull|repeat|skip|start|turn|use|using|work|yo)\b/iu;
const SIMPLE_BOUNDED_LINE_GLOBAL_ANALYSIS_SYNTAX = /[\r\n|`<>\[\]{}*_\\\p{Cf}]/u;
const SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT = /(?:[.!?;][\t\p{Zs}]+|,[\t\p{Zs}]+then[\t\p{Zs}]+)/iu;
const SIMPLE_BOUNDED_LINE_DEFINITION_CONTEXT = /\b(?:abbreviations?|abbrev|definitions?|glossar(?:y|ies)|keys?|means?|stands?[\t\p{Zs}]+for|terms?[\t\p{Zs}]+used)\b/iu;
const SIMPLE_BOUNDED_COMMAND_PROSE_TAIL = /[\t ]+as[\t ]+(?:(?:a|an|the)[\t ]+)?(?:glossary[\t ]+)?(?:example|label|metadata|prose|term)[.!?]?[\t ]*$/iu;
const MAX_SIMPLE_FAST_SEGMENTS = 64;
const MAX_SIMPLE_INLINE_CODE_DELIMITER_LENGTH = 16;
const MAX_SIMPLE_INLINE_CODE_BACKSLASH_PREFIX = 32;
const SIMPLE_FAST_STRONG_SOURCE_LABEL_SOURCE = STRONG_SOURCE_LABEL_SOURCE;
const SIMPLE_FAST_STRONG_SOURCE_RECORD_LABEL_SOURCE = String.raw`(?:[*_]{1,3})?(?:${SIMPLE_FAST_STRONG_SOURCE_LABEL_SOURCE})(?:[*_]{1,3})?`;
const SIMPLE_FAST_STRONG_SOURCE_LINE = new RegExp(
  String.raw`^${SOURCE_RECORD_STRUCTURAL_PREFIX_SOURCE}${SIMPLE_FAST_STRONG_SOURCE_RECORD_LABEL_SOURCE}[\t\p{Zs}]*${SOURCE_RECORD_DELIMITER_SOURCE}`,
  "iu",
);
const SIMPLE_FAST_SOURCE_VALUE_CHARACTER_SOURCE = String.raw`(?:(?!;[\t\p{Zs}])(?:[\t\p{Zs}]|[^\s"'\x60“‘]))`;
const SIMPLE_FAST_SOURCE_VALUE_NON_WHITESPACE_CHARACTER_SOURCE = String.raw`[^\s"'\x60“‘]`;
const SIMPLE_FAST_SOURCE_RECORD_VALUE_SOURCE = String.raw`(?=[\t\p{Zs}]*${SIMPLE_FAST_SOURCE_VALUE_NON_WHITESPACE_CHARACTER_SOURCE})${SIMPLE_FAST_SOURCE_VALUE_CHARACTER_SOURCE}+?`;
const SIMPLE_FAST_INLINE_STRONG_SOURCE_PATH_RECORD = new RegExp(
  String.raw`(?:^[\t\p{Zs}]*|;[\t\p{Zs}]+)(?<record>${SIMPLE_FAST_STRONG_SOURCE_RECORD_LABEL_SOURCE}[\t\p{Zs}]*${SOURCE_RECORD_DELIMITER_SOURCE}[\t\p{Zs}]*(?<value>${SIMPLE_FAST_SOURCE_RECORD_VALUE_SOURCE}))(?=;[\t\p{Zs}]+|$)`,
  "giu",
);
const SIMPLE_FAST_INLINE_STRONG_SOURCE_RECORD_START = new RegExp(
  String.raw`(?:^[\t\p{Zs}]*|;[\t\p{Zs}]+)(?<recordPrefix>${SIMPLE_FAST_STRONG_SOURCE_RECORD_LABEL_SOURCE}[\t\p{Zs}]*${SOURCE_RECORD_DELIMITER_SOURCE}[\t\p{Zs}]*)`,
  "giu",
);
const SIMPLE_FAST_STRONG_SOURCE_DOCUMENT_SIGNAL = new RegExp(
  String.raw`(?:^|\r?\n)${SOURCE_RECORD_STRUCTURAL_PREFIX_SOURCE}${SIMPLE_FAST_STRONG_SOURCE_RECORD_LABEL_SOURCE}[\t\p{Zs}]*${SOURCE_RECORD_DELIMITER_SOURCE}`,
  "iu",
);
const SIMPLE_FAST_STRONG_SOURCE_LABEL_SIGNAL = new RegExp(
  String.raw`\b(?:${SIMPLE_FAST_STRONG_SOURCE_LABEL_SOURCE})\b`,
  "iu",
);
const SIMPLE_FAST_WHOLE_RAW_TEXT_LINE = /^ {0,3}<(?<tag>code|pre|script|style)>[^<\r\n]{0,2048}<\/\k<tag>>[\t ]*$/iu;
const SIMPLE_FAST_RAW_TEXT_DOCUMENT_SIGNAL = /(?:^|\r?\n) {0,3}<(?:code|pre|script|style)>/iu;
const SIMPLE_FAST_UNSAFE_INLINE_LINK_SUFFIX = /\]\((?:\\[^\r\n]|[^()\\\r\n]){0,256}\)[\p{L}\p{M}\p{N}\p{Cf}]/u;
const SIMPLE_FAST_UNSAFE_REFERENCE_LINK_SUFFIX = /\]\[(?:\\[^\r\n]|[^\[\]\\\r\n]){0,999}\][\p{L}\p{M}\p{N}\p{Cf}]/u;
const SIMPLE_FAST_WORK_TARGET_TAIL = new RegExp(
  String.raw`[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE}[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_UNMAPPED_CONTINUATION_COMMAND = new RegExp(
  String.raw`^ {0,3}${SIMPLE_FAST_UNMAPPED_CONTINUATION_SOURCE}[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_MARKED_UNMAPPED_CONTINUATION_TAIL = /(?:,[\t ]+(?:then[\t ]+)?turn|[\t ]+and(?:[\t ]+then)?[\t ]+turn|,[\t ]+(?:(?:ch|chain)[\t ]+\p{N}{1,9}|\p{N}{1,9}[\t ]+(?:ch|chains?))(?:,[\t ]+turn)?)[.!?]?[\t ]*$/iu;
const SIMPLE_FAST_MALFORMED_IDENTIFIER_SOURCE = String.raw`[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}]+`;
const SIMPLE_FAST_MALFORMED_PLAIN_WORK_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+(?<identifier>${SIMPLE_FAST_MALFORMED_IDENTIFIER_SOURCE})[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE}[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_MALFORMED_WRAPPED_WORK_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+(?<wrapper>\*{1,3}|_{1,3})(?<identifier>${SIMPLE_FAST_MALFORMED_IDENTIFIER_SOURCE})\k<wrapper>[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE}[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_MALFORMED_LINKED_WORK_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+\[(?<identifier>${SIMPLE_FAST_MALFORMED_IDENTIFIER_SOURCE})\]\((?<destination>[^()\r\n]{0,256})\)[\t ]+${SIMPLE_FAST_WORK_TARGET_SOURCE}[\t ]*[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_CONTAMINATION_TAIL_SOURCE = String.raw`(?:widget|metadata|notes?|journal|records?|theory|labels?|examples?)`;
const SIMPLE_FAST_CONTAMINATION_TAIL = new RegExp(
  String.raw`^${SIMPLE_FAST_CONTAMINATION_TAIL_SOURCE}$`,
  "iu",
);
const SIMPLE_FAST_EMBEDDED_CONTAMINATION_ITEM = new RegExp(
  String.raw`(?:^|[\t ])(?:and|or)[\t ]+${SIMPLE_FAST_CONTAMINATION_TAIL_SOURCE}[\t ]+(?:and|or)(?=[\t ]|$)`,
  "iu",
);
const SIMPLE_FAST_ATTACHED_INSTRUCTION_DELIMITER = /[-‐‑‒–—―−﹣－](?=(?:(?:and|then)[\t ]+)?(?:begin|continue|fasten|finish|join|make|miss|repeat|skip|turn|work)\b)/giu;
const SIMPLE_FAST_ARBITRARY_TAIL_WORK_LINE = new RegExp(
  String.raw`^ {0,3}work[\t ]+${SIMPLE_FAST_WORK_LIST_SOURCE}[\t ]+${SIMPLE_FAST_CONTAMINATION_TAIL_SOURCE}[.!?]?[\t ]*$`,
  "iu",
);
const SIMPLE_FAST_EMBEDDED_CONTAMINATION_CLAUSE = new RegExp(
  String.raw`^ {0,3}work[\t ]+[^\r\n]{0,384},[\t ]*${SIMPLE_FAST_CONTAMINATION_TAIL_SOURCE}[\t ]*,[\t ]*then[\t ]+`,
  "iu",
);
const SIMPLE_FAST_WORK_TERM_MATCHER = new RegExp(
  String.raw`(^|(?:\*{1,3}|_{1,3})|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(${SIMPLE_FAST_WORK_TERM_SOURCE})(?=$|(?:\*{1,3}|_{1,3})|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "giu",
);
const SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN = new Map([
  ["\"", "\""],
  ["'", "'"],
  ["“", "”"],
  ["‘", "’"],
]);
const SIMPLE_FAST_QUOTE_CLOSERS = new Set(SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.values());
const SIMPLE_FAST_QUOTE_SIGNAL = /["'“”‘’]/u;
const SIMPLE_FAST_DEFINITION_KEY_QUOTE = /["'“”‘’]/u;
const SIMPLE_PLAIN_NAMED_QUOTED_DEFINITION = /(?:^|[.!?;](?:[*_]{1,3})?[\t ]+)(?<key>[A-Za-z]+(?:[\t ]+[A-Za-z]+){0,7})[\t ]*:[\t ]*(?<open>["'“‘])/gu;
const SIMPLE_FAST_NAMED_QUOTED_DEFINITION_PREFIX = /(?:^|[.!?;](?:[*_]{1,3})?[\t\p{Zs}]+)(?<key>[A-Za-z]+(?:[\t\p{Zs}]+[A-Za-z]+){0,7})[\t\p{Zs}]*:[\t\p{Zs}]*$/u;
const SIMPLE_PLAIN_RELEASED_WORK_SENTENCE = /^work[\t ]+(?:dtr|htr|tr|dc)[\t ]+in[\t ]+next[\t ]+stitch[.!?;]$/iu;
const SIMPLE_PLAIN_RELEASED_REVIEW_SENTENCE = /^(?:work[\t ]+straight|(?:needles?|hooks?)[\t ]+(?:no\.?|size)[\t ]*\p{N}+)[.!?;]$/iu;
const SIMPLE_PLAIN_RELEASED_DEFINITION_PREFIX = /^[A-Za-z0-9\t .,!?;]*$/u;
const SIMPLE_FAST_NESTED_DEFINITION_KEY_QUOTE_SIGNAL = /["'“‘][\t\p{Zs}*_`(\[{]{0,16}["'“‘]/u;
const SIMPLE_FAST_QUOTED_CONTEXT_UNSAFE_SYNTAX = /[`<\[\]{}*_\\\p{Cf}]/u;
const SIMPLE_FAST_QUOTED_CONTEXT_DEFINITION_SYNTAX = /(?:[=＝→⇒➜：]|\b(?:abbreviations?|abbrev|definitions?|glossar(?:y|ies)|keys?|means?|stands?[\t\p{Zs}]+for)\b|["'”’][\t ]*[-‐‑‒–—][\t ]*\p{L})/iu;
const SIMPLE_FAST_QUOTED_DEFINITION_PREFIX = new RegExp(
  String.raw`^${DEFINITION_STRUCTURAL_PREFIX_SOURCE}$`,
  "iu",
);

function isWholeDocumentIndentedCode(text) {
  let sawIndented = false;
  for (const line of splitTextLines(text)) {
    const blockContent = line.content.replace(/^(?: {0,3}>[\t ]?)+/u, "");
    if (/^(?: {4,}|\t)/u.test(blockContent)) {
      sawIndented = true;
      continue;
    }
    if (sawIndented && blockContent.trim() === "") continue;
    return false;
  }
  return sawIndented;
}

function isSimpleFastOverlongNumberedItemDeny(text) {
  if (/[\r\n]/u.test(text)) return false;
  let numberRun = 0;
  let hasOverlongNumber = false;
  for (const character of text) {
    if (/^\p{N}$/u.test(character)) {
      numberRun += 1;
      if (numberRun >= 10) {
        hasOverlongNumber = true;
        break;
      }
    } else {
      numberRun = 0;
    }
  }
  if (!hasOverlongNumber) return false;
  const prefix = text.match(SIMPLE_FAST_OVERLONG_NUMBERED_ITEM_START)?.[0]
    ?? text.match(SIMPLE_FAST_OVERLONG_ATTACHED_NUMBERED_WORK_START)?.[0];
  if (!prefix) return false;
  return !SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text.slice(prefix.length));
}

function collectSimpleFastWorkTerms(text) {
  let scanText = text;
  const destinationStart = text.indexOf("](");
  const referenceDestinationStart = text.indexOf("][");
  if (destinationStart !== -1 || referenceDestinationStart !== -1) {
    const maskedLinks = maskSharedStitchListLinkDestinations(text);
    if (maskedLinks !== text) {
      scanText = maskedLinks;
    } else if (destinationStart !== -1) {
      const destinationEnd = text.indexOf(")", destinationStart + 2);
      if (destinationEnd === -1) return [];
      scanText = `${text.slice(0, destinationStart + 2)}${" ".repeat(
        destinationEnd - destinationStart - 2,
      )}${text.slice(destinationEnd)}`;
    }
  }

  const terms = [];
  SIMPLE_FAST_WORK_TERM_MATCHER.lastIndex = 0;
  let match;
  while ((match = SIMPLE_FAST_WORK_TERM_MATCHER.exec(scanText)) !== null) {
    const matchedText = match[2];
    const entry = SOURCE_STITCH_TERM_ENTRY_BY_TERM.get(
      matchedText.toLocaleLowerCase("en-US").replace(/[\t ]+/gu, " "),
    );
    if (!entry) continue;
    const start = match.index + match[1].length;
    terms.push({ start, end: start + matchedText.length, matchedText, entry });
  }
  return terms;
}

function hasAtLeastTwoSimpleFastWorkTerms(text) {
  SIMPLE_FAST_WORK_TERM_MATCHER.lastIndex = 0;
  let count = 0;
  while (SIMPLE_FAST_WORK_TERM_MATCHER.exec(text) !== null) {
    count += 1;
    if (count >= 2) return true;
  }
  return false;
}

function hasSimpleFastWorkTerm(text) {
  SIMPLE_FAST_WORK_TERM_MATCHER.lastIndex = 0;
  const found = SIMPLE_FAST_WORK_TERM_MATCHER.test(text);
  SIMPLE_FAST_WORK_TERM_MATCHER.lastIndex = 0;
  return found;
}

function hasSimpleQuotedRelevantTerm(text) {
  return collectSimpleFastWorkTerms(text).length > 0
    || /\btension[\t ]+square\b/iu.test(text);
}

function isSimpleEscapedCharacter(text, index) {
  let slashes = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) {
    slashes += 1;
  }
  return slashes % 2 === 1;
}

function unwrapSimpleDefinitionKeyQuoteLayer(value) {
  const trimmed = value.trim();
  for (const [opener, closer] of SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN) {
    if (
      trimmed.startsWith(opener)
      && trimmed.endsWith(closer)
      && trimmed.length > opener.length + closer.length
    ) return trimmed.slice(opener.length, -closer.length).trim();
  }
  return null;
}

function hasNestedSimpleDefinitionKeyQuoteWrapper(value) {
  let candidate = value.trim();
  let quoteLayers = 0;
  for (let step = 0; step < MAX_DEFINITION_CLASSIFICATION_NORMALIZATION_STEPS; step += 1) {
    const quoted = unwrapSimpleDefinitionKeyQuoteLayer(candidate);
    if (quoted !== null) {
      quoteLayers += 1;
      if (quoteLayers >= 2) return true;
      candidate = quoted;
      continue;
    }

    let next = candidate
      .replace(DEFINITION_SIDE_QUALIFIER_SUFFIX, "")
      .replace(/[\t\p{Zs}]*\((?:custom|local|pattern|source)\)[\t\p{Zs}]*$/iu, "")
      .trim();
    if (next !== candidate) {
      candidate = next;
      continue;
    }

    for (const wrapper of ["***", "___", "**", "__", "*", "_", "`"]) {
      if (
        candidate.startsWith(wrapper)
        && candidate.endsWith(wrapper)
        && candidate.length > wrapper.length * 2
      ) {
        next = candidate.slice(wrapper.length, -wrapper.length).trim();
        break;
      }
    }
    if (next !== candidate) {
      candidate = next;
      continue;
    }

    if (
      (candidate.startsWith("(") && candidate.endsWith(")"))
      || (candidate.startsWith("[") && candidate.endsWith("]"))
      || (candidate.startsWith("{") && candidate.endsWith("}"))
    ) {
      candidate = candidate.slice(1, -1).trim();
      continue;
    }
    return false;
  }
  return quoteLayers > 0 && SIMPLE_FAST_DEFINITION_KEY_QUOTE.test(candidate);
}

function maskNestedSimpleDefinitionKeyQuotes(text, quoteScanText) {
  const masked = quoteScanText.split("");
  for (const line of splitTextLines(text)) {
    const candidateStarts = [0];
    for (const boundary of line.content.matchAll(/[.!?](?:[*_]{1,3})?(?=[\t\p{Zs}]+|$)/gu)) {
      if (isSimpleQuotedDefinitionInternalAbbreviationBoundary(line.content, boundary)) continue;
      if (candidateStarts.length > MAX_SIMPLE_FAST_SEGMENTS) return quoteScanText;
      candidateStarts.push(boundary.index + boundary[0].length);
    }

    for (const candidateStart of candidateStarts) {
      const candidate = line.content.slice(candidateStart);
      const definitionMatch = matchDefinitionEntry(candidate);
      const definitionValue = definitionMatch?.groups.value ?? "";
      const valueLead = definitionValue.match(
        /^[\t\p{Zs}]*(?:(?:\*+|_+|[*_]{1,3})[\t\p{Zs}]*)?["'“‘]/u,
      );
      if (!definitionMatch || !valueLead) continue;
      const valueStart = definitionMatch.index
        + definitionMatch[0].length
        - definitionValue.length;
      const valueQuoteStart = valueStart + valueLead[0].length - 1;
      const definitionKey = getSimpleQuotedDefinitionRawKey(
        candidate,
        { start: valueQuoteStart },
        definitionMatch,
      );
      if (!definitionKey || !hasNestedSimpleDefinitionKeyQuoteWrapper(definitionKey)) continue;
      const keyStart = candidate.lastIndexOf(definitionKey, valueQuoteStart);
      if (keyStart < 0) continue;
      const absoluteKeyStart = line.start + candidateStart + keyStart;
      for (let index = 0; index < definitionKey.length; index += 1) {
        if (`"'“”‘’`.includes(text[absoluteKeyStart + index])) {
          masked[absoluteKeyStart + index] = " ";
        }
      }
      break;
    }
  }
  return masked.join("");
}

function hasPossibleNestedSimpleDefinitionKeyQuotes(text) {
  return SIMPLE_FAST_NESTED_DEFINITION_KEY_QUOTE_SIGNAL.test(text);
}

function findSimpleQuotedInstructionRanges(text) {
  const ranges = [];
  let quoteScanText = text.includes("][")
    ? maskSimpleReferenceLabelContents(text)
    : text;
  if (hasPossibleNestedSimpleDefinitionKeyQuotes(text)) {
    quoteScanText = maskNestedSimpleDefinitionKeyQuotes(text, quoteScanText);
  }
  if (!SIMPLE_FAST_QUOTE_SIGNAL.test(quoteScanText)) return ranges;
  const markdownDestinations = text.includes("](")
    ? collectBoundedInlineDestinationRanges(text)
    : [];
  let markdownDestinationIndex = 0;
  for (let index = 0; index < text.length; index += 1) {
    while (
      markdownDestinationIndex < markdownDestinations.length
      && markdownDestinations[markdownDestinationIndex].end <= index
    ) markdownDestinationIndex += 1;
    const markdownDestination = markdownDestinations[markdownDestinationIndex];
    if (
      markdownDestination
      && markdownDestination.start <= index
      && index < markdownDestination.end
    ) {
      index = markdownDestination.end - 1;
      continue;
    }
    const opener = quoteScanText[index];
    const closer = SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.get(opener);
    if (!closer) {
      if (SIMPLE_FAST_QUOTE_CLOSERS.has(opener)) {
        const lineStart = text.lastIndexOf("\n", index - 1) + 1;
        const lineEndIndex = text.indexOf("\n", index + 1);
        const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
        if (hasSimpleQuotedRelevantTerm(quoteScanText.slice(lineStart, lineEnd))) {
          ranges.push({
            start: lineStart,
            end: lineEnd,
            kind: "unmatched-quoted-instruction",
          });
          index = lineEnd - 1;
        }
      }
      continue;
    }

    const escapedDelimiter = isSimpleEscapedCharacter(quoteScanText, index);
    let close = index + 1;
    while (
      close < quoteScanText.length
      && quoteScanText[close] !== "\r"
      && quoteScanText[close] !== "\n"
    ) {
      if (
        quoteScanText[close] === closer
        && isSimpleEscapedCharacter(quoteScanText, close) === escapedDelimiter
      ) break;
      close += 1;
    }
    if (close >= quoteScanText.length || quoteScanText[close] !== closer) {
      const lineStart = text.lastIndexOf("\n", index - 1) + 1;
      const lineEndIndex = text.indexOf("\n", index + 1);
      const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
      if (hasSimpleQuotedRelevantTerm(quoteScanText.slice(lineStart, lineEnd))) {
        ranges.push({
          start: lineStart,
          end: lineEnd,
          kind: "unmatched-quoted-instruction",
        });
        index = lineEnd - 1;
      }
      continue;
    }
    if (hasSimpleQuotedRelevantTerm(quoteScanText.slice(index + 1, close))) {
      ranges.push({
        start: index,
        end: close + 1,
        kind: "quoted-instruction",
        escapedDelimiter,
      });
    }
    index = close;
  }
  return ranges;
}

function getSimpleNamedQuotedDefinitionSignalText(text) {
  if (!SIMPLE_FAST_QUOTE_SIGNAL.test(text)) return text;
  const namedDefinitionRanges = findSimplePhysicalLineQuotedDefinitionRecordRanges(text);
  const signalProtectionRanges = [
    ...findMarkdownCodeRanges(text).filter((range) => !range.unclosedInline),
    ...findHtmlMarkupRanges(text),
    ...findSimplePhysicalIndentedCodeRanges(text),
  ];
  for (const range of findSimpleQuotedInstructionRanges(text)) {
    if (range.kind !== "quoted-instruction") continue;
    if (signalProtectionRanges.some((protection) => (
      protection.start < range.end && protection.end > range.start
    ))) continue;
    const start = getSimpleNamedQuotedDefinitionPrefixStart(text, range);
    if (start >= range.start) continue;
    const protectedEnd = getSimpleQuotedOuterEmphasis(text, range)?.end ?? range.end;
    namedDefinitionRanges.push({ start, end: protectedEnd });
  }
  if (namedDefinitionRanges.length === 0) return text;
  const mergedRanges = [];
  for (const range of namedDefinitionRanges.sort((left, right) => (
    left.start - right.start || right.end - left.end
  ))) {
    const previous = mergedRanges.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      mergedRanges.push({ ...range });
    }
  }
  let cursor = 0;
  let signalText = "";
  for (const range of mergedRanges) {
    signalText += `${text.slice(cursor, range.start)} `;
    cursor = range.end;
  }
  return `${signalText}${text.slice(cursor)}`;
}

function getSimpleQuotedOuterEmphasis(text, range) {
  if (range.kind !== "quoted-instruction") return null;
  let start = range.start;
  let end = range.end;
  while (start > 0 && /[*_\\]/u.test(text[start - 1])) start -= 1;
  while (end < text.length && /[*_\\]/u.test(text[end])) end += 1;
  const openingFragment = text.slice(start, range.start);
  const closingFragment = text.slice(range.end, end);
  if (
    !/[*_\\]/u.test(openingFragment)
    && !/[*_]/u.test(closingFragment)
  ) return null;
  return {
    start,
    end,
    openingFragment,
    closingFragment,
  };
}

function getSimpleQuotedStructuralPrefixStart(text, range) {
  const outerEmphasis = getSimpleQuotedOuterEmphasis(text, range);
  const protectedStart = outerEmphasis?.start ?? range.start;
  const lineStart = text.lastIndexOf("\n", protectedStart - 1) + 1;
  const before = text.slice(lineStart, protectedStart);
  const structuralPrefix = before.match(
    / {0,3}(?:(?:>[\t ]*)+)(?:(?:(?:\p{N}{1,9}[.)]|\(\p{N}{1,9}\)|[-+*]|#{1,6})[\t ]+)*)$/u,
  );
  return structuralPrefix ? lineStart + structuralPrefix.index : protectedStart;
}

function isSimpleStandaloneQuotedRange(text, range) {
  const outerEmphasis = getSimpleQuotedOuterEmphasis(text, range);
  const protectedStart = outerEmphasis?.start ?? range.start;
  const protectedEnd = outerEmphasis?.end ?? range.end;
  const lineStart = text.lastIndexOf("\n", protectedStart - 1) + 1;
  const lineEndIndex = text.indexOf("\n", protectedEnd);
  const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
  const before = text.slice(lineStart, protectedStart).trimEnd();
  const blockquoteOnly = /^ {0,3}(?:(?:>[\t ]*)+)?$/u.test(before);
  const beforeBoundary = blockquoteOnly
    || /[.!?;:]$/u.test(before)
    || getSimpleQuotedStructuralPrefixStart(text, range) < protectedStart;
  const after = text.slice(protectedEnd, lineEnd);
  const quotedContent = text.slice(range.start + 1, range.end - 1).trimEnd();
  const afterBoundary = after.trim() === ""
    || /^[\t\p{Zs}]+/u.test(after)
    || /^[\t\p{Zs}]*[.!?;:]+(?:[\t\p{Zs}]|$)/u.test(after)
    || /[.!?]$/u.test(quotedContent);
  return beforeBoundary && afterBoundary;
}

function getSimpleNamedQuotedDefinitionPrefixStart(text, range) {
  if (range.kind !== "quoted-instruction") return range.start;
  const lineStart = text.lastIndexOf("\n", range.start - 1) + 1;
  const beforeQuote = text.slice(lineStart, range.start);
  const definitionPrefix = beforeQuote.match(SIMPLE_FAST_NAMED_QUOTED_DEFINITION_PREFIX);
  const key = definitionPrefix?.groups.key;
  if (!key || !NAMED_STITCH_DEFINITION_KEY.test(key)) return range.start;
  return lineStart + definitionPrefix.index + definitionPrefix[0].lastIndexOf(key);
}

function findSimpleQuotedInstructionProtectionRanges(text) {
  const ranges = findSimpleQuotedInstructionRanges(text).map((range) => {
    const outerEmphasis = getSimpleQuotedOuterEmphasis(text, range);
    const protectedStart = outerEmphasis?.start ?? range.start;
    const protectedEnd = outerEmphasis?.end ?? range.end;
    const namedDefinitionStart = getSimpleNamedQuotedDefinitionPrefixStart(text, range);
    if (
      range.kind !== "quoted-instruction"
      || isSimpleStandaloneQuotedRange(text, range)
    ) return {
      ...range,
      start: Math.min(
        getSimpleQuotedStructuralPrefixStart(text, range),
        namedDefinitionStart,
      ),
      end: protectedEnd,
    };

    const lineStart = text.lastIndexOf("\n", protectedStart - 1) + 1;
    const lineEndIndex = text.indexOf("\n", protectedEnd);
    const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
    let start = lineStart;
    const before = text.slice(lineStart, protectedStart);
    const precedingBoundaries = [...before.matchAll(/[.!?;][\t\p{Zs}]+/gu)];
    if (precedingBoundaries.length > 0) {
      const boundary = precedingBoundaries.at(-1);
      start = lineStart + boundary.index + boundary[0].length;
    }
    let end = lineEnd;
    const followingBoundary = text.slice(protectedEnd, lineEnd).match(
      /[.!?;](?=[\t\p{Zs}]|$)/u,
    );
    if (followingBoundary) end = protectedEnd + followingBoundary.index + 1;
    return { start, end, kind: "quoted-instruction-clause" };
  });

  const merged = [];
  for (const range of ranges.sort((left, right) => left.start - right.start || left.end - right.end)) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
      previous.kind = "quoted-instruction-clause";
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

function isSimpleQuotedDefinitionContext(text, rawQuotedRanges) {
  const masked = text.split("");
  for (const range of rawQuotedRanges) masked.fill(" ", range.start, range.end);
  const definitionSyntaxText = masked.join("").replace(
    /\/[\t\p{Zs}]*[:=：＝→⇒➜]/gu,
    (fragment) => " ".repeat(fragment.length),
  );
  if (SIMPLE_FAST_QUOTED_CONTEXT_DEFINITION_SYNTAX.test(definitionSyntaxText)) return true;

  return rawQuotedRanges.some((range) => {
    if (range.kind !== "quoted-instruction") return false;
    const content = text.slice(range.start + 1, range.end - 1).trim();
    const terms = collectSimpleFastWorkTerms(content);
    if (
      terms.length !== 1
      || terms[0].start !== 0
      || terms[0].end !== content.length
    ) return false;
    const lineStart = text.lastIndexOf("\n", range.start - 1) + 1;
    const before = text.slice(lineStart, range.start);
    if (!SIMPLE_FAST_QUOTED_DEFINITION_PREFIX.test(before)) {
      return false;
    }
    const lineEndIndex = text.indexOf("\n", range.end);
    const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
    return /^(?:[\t\p{Zs}]*(?:[:=：＝→⇒➜]|[-‐‑‒–—―−﹣－])[\t\p{Zs}]*\S|[\t\p{Zs}]+(?:means|stands?[\t\p{Zs}]+for|is)[\t\p{Zs}]+\S|[\t\p{Zs}]+\p{L})/iu.test(
      text.slice(range.end, lineEnd),
    );
  });
}

function unwrapSimpleReleasedInstructionEmphasis(text) {
  const trimmed = text.trim();
  for (const wrapper of ["***", "___", "**", "__", "*", "_"]) {
    if (
      trimmed.startsWith(wrapper)
      && trimmed.endsWith(wrapper)
      && trimmed.length > wrapper.length * 2
    ) {
      return trimmed.slice(wrapper.length, -wrapper.length).trim();
    }
  }
  return trimmed;
}

function hasCompleteReleasedInstructionChunk(chunkText, includeReviewOnly = true) {
  const closedMatches = collectSimpleClosedWorkChunkMatches(chunkText);
  if (closedMatches?.length) return true;
  if (closedMatches !== null) return false;

  const candidate = chunkText
    .replace(SIMPLE_FAST_DEFINITION_STRUCTURAL_PREFIX, "")
    .trim();
  const instructionCandidate = unwrapSimpleReleasedInstructionEmphasis(candidate);
  const commandAuthority = instructionCandidate.replace(
    /^(?:[*_]{1,3})[\t\p{Zs}]*/u,
    "",
  );
  if (
    SIMPLE_BOUNDED_SINGLE_TERM_COMMAND_START.test(commandAuthority)
    && collectSimpleBoundedAuthoritativeMatches(instructionCandidate)?.length
  ) return true;

  const heading = instructionCandidate.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0] ?? "";
  const reviewBody = unwrapSimpleReleasedInstructionEmphasis(
    instructionCandidate.slice(heading.length),
  );
  return includeReviewOnly && isSimpleFastReviewOnlySegment(reviewBody);
}

function isSimpleQuotedDefinitionInternalAbbreviationBoundary(text, boundary) {
  if (!boundary[0].startsWith(".")) return false;
  const before = text.slice(0, boundary.index + 1);
  const after = text.slice(boundary.index + boundary[0].length);
  return /(?:^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:no|r|rnd)\.$/iu.test(before)
    && /^[\t\p{Zs}]*\p{N}/u.test(after);
}

function hasReleasedInstructionInDefinitionKey(definitionKey) {
  let start = 0;
  let boundaryCount = 0;
  const normalizedDefinitionKey = normalizeDefinitionClassificationKey(definitionKey);
  const includeReviewOnly = normalizedDefinitionKey !== null
    && !NAMED_STITCH_DEFINITION_KEY.test(normalizedDefinitionKey);
  for (const boundary of definitionKey.matchAll(/[.!?](?:[*_]{1,3})?(?=[\t\p{Zs}]+|$)/gu)) {
    if (isSimpleQuotedDefinitionInternalAbbreviationBoundary(definitionKey, boundary)) continue;
    boundaryCount += 1;
    if (boundaryCount > MAX_SIMPLE_FAST_SEGMENTS) return true;
    const chunk = getSimpleQuotedNeighborChunk(
      definitionKey,
      start,
      boundary.index + boundary[0].length,
    );
    if (chunk.text) {
      if (hasCompleteReleasedInstructionChunk(chunk.text, includeReviewOnly)) return true;
      const remainingKey = normalizeDefinitionClassificationKey(
        definitionKey.slice(boundary.index + boundary[0].length),
      );
      if (
        !includeReviewOnly
        && remainingKey
        && /[\t\p{Zs}]/u.test(remainingKey)
        && NAMED_STITCH_DEFINITION_KEY.test(remainingKey)
        && SIMPLE_PLAIN_RELEASED_REVIEW_SENTENCE.test(chunk.text)
      ) return true;
    }
    start = boundary.index + boundary[0].length;
  }
  return false;
}

function hasCanonicalQuotedDashDefinitionDelimiter(text, range) {
  const beforeQuote = text.slice(0, range.start).replace(
    /(?:\*+|_+|[*_]{1,3})[\t\p{Zs}]*$/u,
    "",
  );
  const delimiter = beforeQuote.match(/[-‐‑‒–—―−﹣－][\t\p{Zs}]*$/u);
  if (!delimiter) return false;
  const key = beforeQuote.slice(0, delimiter.index).trimEnd();
  return key !== "" && !/[\/／]$/u.test(key);
}

function hasCanonicalQuotedWordDefinitionDelimiter(definitionMatch, rawKey) {
  const key = rawKey.trim();
  return Boolean(
    definitionMatch.groups.wordDelimiter
    && key
    && !/[\/／]$/u.test(key),
  );
}

function hasCanonicalQuotedAsciiColonDefinitionDelimiter(definitionMatch, rawKey) {
  if (definitionMatch.groups.delimiter !== ":") return false;
  const trimmedRawKey = rawKey.trim();
  const key = normalizeDefinitionClassificationKey(trimmedRawKey);
  if (!trimmedRawKey || /[\/／]$/u.test(trimmedRawKey)) return false;
  if (key === null) return true;
  if (!key || /[\/／]$/u.test(key)) return false;
  return NAMED_STITCH_DEFINITION_KEY.test(key)
    || SUPPORTED_NORMALIZED_DEFINITION_KEYS.has(normalizeDefinitionKey(key))
    || isCompoundSupportedDefinitionKey(key);
}

function getSimpleQuotedDefinitionRawKey(text, range, definitionMatch) {
  let beforeQuote = text.slice(0, range.start).replace(
    /(?:\*+|_+|[*_]{1,3})[\t\p{Zs}]*$/u,
    "",
  ).trimEnd();
  let delimiterStart = -1;
  const symbolDelimiter = definitionMatch.groups.delimiter
    ?? definitionMatch.groups.dashDelimiter;
  if (symbolDelimiter && beforeQuote.endsWith(symbolDelimiter)) {
    delimiterStart = beforeQuote.length - symbolDelimiter.length;
  } else if (definitionMatch.groups.wordDelimiter) {
    const wordDelimiter = beforeQuote.match(
      /(?:means|stands?[\t\p{Zs}]+for|is)$/iu,
    );
    if (wordDelimiter) delimiterStart = wordDelimiter.index;
  } else {
    const compactDelimiter = beforeQuote.match(/[-‐‑‒–—―−﹣－→⇒➜]$/u);
    if (compactDelimiter) delimiterStart = compactDelimiter.index;
  }
  if (delimiterStart < 0) return definitionMatch.groups.key;
  beforeQuote = beforeQuote.slice(0, delimiterStart);
  return beforeQuote
    .replace(SIMPLE_FAST_DEFINITION_STRUCTURAL_PREFIX, "")
    .trim();
}

function getSimpleLongQuotedAsciiColonProjection(text) {
  if (
    text.length <= MAX_SIMPLE_QUOTED_ASCII_COLON_KEY_LENGTH
    || /[\r\n]/u.test(text)
    || !SIMPLE_FAST_QUOTE_SIGNAL.test(text)
  ) return null;
  const definitionMatch = matchDefinitionEntry(text);
  const definitionValue = definitionMatch?.groups.value ?? "";
  if (
    definitionMatch?.groups.delimiter !== ":"
    || !/^["'“‘]/u.test(definitionValue)
  ) return null;
  const valueRanges = findSimpleQuotedInstructionRanges(definitionValue);
  if (
    valueRanges.length !== 1
    || valueRanges[0].kind !== "quoted-instruction"
    || valueRanges[0].start !== 0
  ) return null;
  const [valueRange] = valueRanges;
  const valueStart = definitionMatch.index
    + definitionMatch[0].length
    - definitionValue.length;
  const localRange = {
    ...valueRange,
    start: valueStart + valueRange.start,
    end: valueStart + valueRange.end,
  };
  const definitionKey = getSimpleQuotedDefinitionRawKey(
    text,
    localRange,
    definitionMatch,
  );
  if (
    definitionKey.length <= MAX_SIMPLE_QUOTED_ASCII_COLON_KEY_LENGTH
    || hasCanonicalQuotedAsciiColonDefinitionDelimiter(definitionMatch, definitionKey)
    || !/^[A-Za-z][A-Za-z0-9_]*(?:[\/／])?$/u.test(definitionKey)
  ) return null;
  const keyStart = text.lastIndexOf(definitionKey, localRange.start);
  if (keyStart < 0) return null;
  const projectedKey = `${definitionKey[0]}0${definitionKey.slice(
    -(MAX_SIMPLE_QUOTED_ASCII_COLON_KEY_LENGTH - 2),
  )}`;
  return {
    keyStart,
    keyEnd: keyStart + definitionKey.length,
    originalKey: definitionKey,
    projectedKey,
  };
}

function getSimpleAlignedQuotedDefinitionValueRange(definitionValue, valueLead) {
  const start = valueLead[0].length - 1;
  const opener = definitionValue[start];
  const closer = SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.get(opener);
  if (!closer) return null;
  const escapedDelimiter = isSimpleEscapedCharacter(definitionValue, start);
  for (let end = start + 1; end < definitionValue.length; end += 1) {
    if (definitionValue[end] === "\r" || definitionValue[end] === "\n") return null;
    if (
      definitionValue[end] === closer
      && isSimpleEscapedCharacter(definitionValue, end) === escapedDelimiter
    ) {
      return {
        start,
        end: end + 1,
        kind: "quoted-instruction",
        escapedDelimiter,
      };
    }
  }
  return null;
}

function getSimpleFirstSemicolonOutsideRanges(text, ranges, start = 0) {
  const sortedRanges = [...ranges].sort((left, right) => left.start - right.start);
  let rangeIndex = 0;
  for (
    let semicolon = text.indexOf(";", start);
    semicolon >= 0;
    semicolon = text.indexOf(";", semicolon + 1)
  ) {
    if (isSimpleEscapedCharacter(text, semicolon)) continue;
    while (
      rangeIndex < sortedRanges.length
      && sortedRanges[rangeIndex].end <= semicolon
    ) rangeIndex += 1;
    const range = sortedRanges[rangeIndex];
    if (!range || semicolon < range.start) return semicolon;
  }
  return -1;
}

function getSimplePlainQuotedDefinitionRecordEnd(text, quoteStart) {
  let hasQuotedSourceTerm = false;
  let quote = quoteStart;
  while (quote < text.length) {
    const opener = text[quote];
    if (
      !SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.has(opener)
      || isSimpleEscapedCharacter(text, quote)
    ) return null;
    const closer = SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.get(opener);
    let close = quote + 1;
    while (close < text.length) {
      if (
        text[close] === closer
        && !isSimpleEscapedCharacter(text, close)
      ) break;
      close += 1;
    }
    if (close >= text.length) return null;
    const quoteBody = text.slice(quote + 1, close);
    if (SIMPLE_FAST_QUOTE_SIGNAL.test(quoteBody)) return null;
    if (hasSourceTermCandidate(quoteBody)) hasQuotedSourceTerm = true;

    let cursor = close + 1;
    while (cursor < text.length) {
      if (text[cursor] === ";" && !isSimpleEscapedCharacter(text, cursor)) {
        return { end: cursor + 1, hasQuotedSourceTerm };
      }
      if (SIMPLE_FAST_QUOTE_SIGNAL.test(text[cursor])) {
        if (!SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.has(text[cursor])) return null;
        quote = cursor;
        break;
      }
      cursor += 1;
    }
    if (cursor >= text.length) return { end: text.length, hasQuotedSourceTerm };
  }
  return null;
}

function getSimplePlainNamedQuotedDefinitionRecordStart(text) {
  if (
    /[\r\n]/u.test(text)
    || !SIMPLE_FAST_QUOTE_SIGNAL.test(text)
  ) return null;

  SIMPLE_PLAIN_NAMED_QUOTED_DEFINITION.lastIndex = 0;
  for (const match of text.matchAll(SIMPLE_PLAIN_NAMED_QUOTED_DEFINITION)) {
    const key = match.groups.key;
    if (!NAMED_STITCH_DEFINITION_KEY.test(key)) continue;
    const keyOffset = match[0].lastIndexOf(key);
    const keyStart = match.index + keyOffset;
    const quoteStart = match.index + match[0].length - match.groups.open.length;
    const record = getSimplePlainQuotedDefinitionRecordEnd(text, quoteStart);
    if (!record?.hasQuotedSourceTerm) continue;
    const beforeQuote = text.slice(0, quoteStart);
    if (SIMPLE_FAST_QUOTE_SIGNAL.test(beforeQuote)) continue;
    if (keyStart === 0) return { start: 0, end: record.end };

    const prefix = text.slice(0, keyStart);
    if (!SIMPLE_PLAIN_RELEASED_DEFINITION_PREFIX.test(prefix)) continue;
    const boundaries = [];
    for (const boundary of prefix.matchAll(
      /[.!?;](?:[*_]{1,3})?(?=[\t\p{Zs}]+|$)/gu,
    )) {
      if (isSimpleEscapedCharacter(prefix, boundary.index)) continue;
      if (isSimpleQuotedDefinitionInternalAbbreviationBoundary(text, boundary)) continue;
      boundaries.push({
        start: boundary.index,
        end: boundary.index + boundary[0].length,
      });
    }
    const finalBoundary = boundaries.at(-1);
    if (!finalBoundary) continue;
    const previousBoundaryEnd = boundaries.at(-2)?.end ?? 0;
    const previousSentence = text.slice(previousBoundaryEnd, finalBoundary.end).trim();
    const isReleasedWork = SIMPLE_PLAIN_RELEASED_WORK_SENTENCE.test(previousSentence);
    const isReleasedReview = /[\t ]/u.test(key)
      && SIMPLE_PLAIN_RELEASED_REVIEW_SENTENCE.test(previousSentence);
    if (!isReleasedWork && !isReleasedReview) continue;
    if (boundaries.length > MAX_SIMPLE_FAST_SEGMENTS) {
      return SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW;
    }
    return { start: keyStart, end: record.end };
  }
  return null;
}

function getSimpleQuotedDefinitionRecordStart(text) {
  if (
    /[\r\n]/u.test(text)
    || !SIMPLE_FAST_QUOTE_SIGNAL.test(text)
  ) return null;

  const boundaries = text.matchAll(/[.!?;](?:[*_]{1,3})?(?=[\t\p{Zs}]+|$)/gu);
  let candidateBoundaryCount = 0;
  let candidateLimit = text.length;
  let sawOwnedAlignedDefinition = false;
  let skippedAlignedQuoteCount = 0;
  let start = 0;
  while (start !== null) {
    const candidate = text.slice(start);
    let releasedAlignedQuoteEnd = null;
    const definitionMatch = matchDefinitionEntry(candidate);
    const definitionValue = definitionMatch?.groups.value ?? "";
    const valueLead = definitionValue.match(
      /^[\t\p{Zs}]*(?:(?:\*+|_+|[*_]{1,3})[\t\p{Zs}]*)?["'“‘]/u,
    );
    if (definitionMatch && valueLead) {
      const alignedValueRange = getSimpleAlignedQuotedDefinitionValueRange(
        definitionValue,
        valueLead,
      );
      const hasSimpleImmediateRecordSeparator = Boolean(
        alignedValueRange
        && !SIMPLE_FAST_QUOTE_SIGNAL.test(definitionValue.slice(
          alignedValueRange.start + 1,
          alignedValueRange.end - 1,
        ))
        && /^[\t\p{Zs}]*;/u.test(definitionValue.slice(alignedValueRange.end)),
      );
      const valueRanges = hasSimpleImmediateRecordSeparator
        ? [alignedValueRange]
        : findSimpleQuotedInstructionRanges(definitionValue);
      if (
        alignedValueRange
        && valueRanges.length > 0
        && valueRanges.every((range) => range.kind === "quoted-instruction")
      ) {
        const valueStart = definitionMatch.index
          + definitionMatch[0].length
          - definitionValue.length;
        const localRange = {
          ...alignedValueRange,
          start: valueStart + alignedValueRange.start,
          end: valueStart + alignedValueRange.end,
        };
        const absoluteRanges = [alignedValueRange, ...valueRanges].map((range) => ({
          start: start + valueStart + range.start,
          end: start + valueStart + range.end,
        }));
        const [absoluteRange] = absoluteRanges;
        candidateLimit = Math.min(candidateLimit, absoluteRange.start);
        const outsideSemicolon = getSimpleFirstSemicolonOutsideRanges(
          text,
          absoluteRanges,
          start,
        );
        const hasLeadingOutsideSemicolon = outsideSemicolon >= 0
          && outsideSemicolon < absoluteRange.start;
        if (hasLeadingOutsideSemicolon) {
          if (candidateBoundaryCount >= MAX_SIMPLE_FAST_SEGMENTS) {
            return SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW;
          }
          candidateBoundaryCount += 1;
          candidateLimit = text.length;
          start = outsideSemicolon + 1;
          continue;
        }
        const definitionKey = getSimpleQuotedDefinitionRawKey(
          candidate,
          localRange,
          definitionMatch,
        );
        const ownsAlignedDefinition = isDefinitionShapedEntry(
          definitionMatch,
          false,
          definitionKey,
        ) && (
          hasCanonicalQuotedDashDefinitionDelimiter(candidate, localRange)
          || hasCanonicalQuotedWordDefinitionDelimiter(definitionMatch, definitionKey)
          || hasCanonicalQuotedAsciiColonDefinitionDelimiter(definitionMatch, definitionKey)
          || isSimpleQuotedDefinitionContext(candidate, [localRange])
        );
        if (ownsAlignedDefinition) {
          sawOwnedAlignedDefinition = true;
          if (!hasReleasedInstructionInDefinitionKey(definitionKey)) {
            return {
              start,
              end: outsideSemicolon >= 0 ? outsideSemicolon + 1 : text.length,
            };
          }
        } else {
          releasedAlignedQuoteEnd = absoluteRange.end;
        }
      }
    }

    if (releasedAlignedQuoteEnd !== null) {
      if (skippedAlignedQuoteCount >= MAX_SIMPLE_FAST_SEGMENTS) {
        return SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW;
      }
      skippedAlignedQuoteCount += 1;
      candidateLimit = text.length;
      const followingRecordSeparator = text.slice(releasedAlignedQuoteEnd).match(
        /^[\t\p{Zs}]*;[\t\p{Zs}]*/u,
      )?.[0] ?? "";
      start = releasedAlignedQuoteEnd + followingRecordSeparator.length;
      continue;
    }

    let nextStart = null;
    while (true) {
      const nextBoundary = boundaries.next();
      if (nextBoundary.done) break;
      const boundary = nextBoundary.value;
      if (boundary.index < start) continue;
      if (boundary.index >= candidateLimit) break;
      if (isSimpleEscapedCharacter(text, boundary.index)) continue;
      if (isSimpleQuotedDefinitionInternalAbbreviationBoundary(text, boundary)) continue;
      if (candidateBoundaryCount >= MAX_SIMPLE_FAST_SEGMENTS) {
        return sawOwnedAlignedDefinition
          ? SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW
          : null;
      }
      candidateBoundaryCount += 1;
      nextStart = boundary.index + boundary[0].length;
      break;
    }
    start = nextStart;
  }
  return null;
}

function collectSimpleQuotedDefinitionRecords(text) {
  const records = [];
  let cursor = 0;
  while (cursor < text.length) {
    const remaining = text.slice(cursor);
    let record = getSimplePlainNamedQuotedDefinitionRecordStart(remaining);
    if (record === null) record = getSimpleQuotedDefinitionRecordStart(remaining);
    if (record === SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW) return record;
    if (record === null) break;
    if (records.length >= MAX_SIMPLE_FAST_SEGMENTS) {
      return SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW;
    }
    const normalizedRecord = typeof record === "number"
      ? { start: record, end: remaining.length }
      : record;
    if (
      normalizedRecord.start < 0
      || normalizedRecord.end <= normalizedRecord.start
      || normalizedRecord.end > remaining.length
    ) return null;
    records.push({
      start: cursor + normalizedRecord.start,
      end: cursor + normalizedRecord.end,
    });
    cursor += normalizedRecord.end;
  }
  return records.length > 0 ? records : null;
}

function findSimplePhysicalIndentedCodeRanges(text) {
  const ranges = [];
  for (const line of splitTextLines(text)) {
    if (SINGLE_CODE_INDENTED_LINE.test(line.content)) {
      ranges.push({
        start: line.start,
        end: line.start + line.content.length,
        kind: "indented-code",
      });
    }
  }
  return ranges;
}

function findSimpleUnbalancedSquareBracketLineRanges(text, protectedRanges) {
  const ranges = [];
  for (const line of splitTextLines(text)) {
    let depth = 0;
    let unbalanced = false;
    for (let index = line.start; index < line.end; index += 1) {
      if (text[index] !== "[" && text[index] !== "]") continue;
      if (
        isSimpleEscapedCharacter(text, index)
        || protectedRanges.some((range) => range.start <= index && index < range.end)
      ) continue;
      if (text[index] === "[") {
        depth += 1;
      } else if (depth > 0) {
        depth -= 1;
      } else {
        unbalanced = true;
      }
    }
    if (depth > 0 || unbalanced) {
      ranges.push({
        start: line.start,
        end: line.end,
        kind: "malformed-markdown-line",
      });
    }
  }
  return ranges;
}

function hasSimpleMalformedMarkdownLine(text) {
  const protectedRanges = [
    ...(/[\x60~]/u.test(text) ? findMarkdownCodeRanges(text) : []),
    ...(text.includes("<") ? findHtmlMarkupRanges(text) : []),
    ...findSimplePhysicalIndentedCodeRanges(text),
    ...(text.includes("](") ? collectBoundedInlineDestinationRanges(text) : []),
  ];
  return findSimpleUnbalancedSquareBracketLineRanges(
    text,
    protectedRanges,
  ).length > 0
    || scanMarkdownLinkSyntax(text).malformedLineRanges.length > 0;
}

function findSimpleQuotedDefinitionDetectionProtectionRanges(text) {
  const ranges = [
    ...findSimplePhysicalIndentedCodeRanges(text),
    ...(/[\x60~]/u.test(text) ? findMarkdownCodeRanges(text) : []),
    ...(text.includes("<") ? findHtmlMarkupRanges(text) : []),
  ];
  if (text.includes("[") || text.includes("]")) {
    const boundedInlineDestinationRanges = text.includes("](")
      ? collectBoundedInlineDestinationRanges(text)
      : [];
    const unbalancedLineRanges = findSimpleUnbalancedSquareBracketLineRanges(
      text,
      [...ranges, ...boundedInlineDestinationRanges],
    );
    if (unbalancedLineRanges.length > 0) {
      ranges.push(...unbalancedLineRanges);
    } else {
      const markdownSyntax = scanMarkdownLinkSyntax(text);
      ranges.push(
        ...markdownSyntax.destinations,
        ...markdownSyntax.imageRanges,
        ...markdownSyntax.malformedLineRanges,
      );
    }
  }
  if (/\b(?:source|path|file|document|url|uri|link|reference|citation)\b/iu.test(text)) {
    ranges.push(
      ...findStrongLabeledQuotedRanges(text),
      ...findStrongLabeledSourceLineRanges(text),
      ...findWholeLinePathRanges(text),
    );
  }
  return ranges;
}

function findSimplePhysicalLineQuotedDefinitionRecordRanges(text) {
  if (!/[\r\n]/u.test(text) || !SIMPLE_FAST_QUOTE_SIGNAL.test(text)) return [];
  const ranges = [];
  const definitionDetectionProtectionRanges =
    findSimpleQuotedDefinitionDetectionProtectionRanges(text);
  for (const line of splitTextLines(text)) {
    if (!SIMPLE_FAST_QUOTE_SIGNAL.test(line.content)) continue;
    const localProtectionRanges = definitionDetectionProtectionRanges
      .filter((range) => range.start < line.end && range.end > line.start)
      .map((range) => ({
        start: Math.max(0, range.start - line.start),
        end: Math.min(line.content.length, range.end - line.start),
      }));
    const definitionScanContent = localProtectionRanges.length > 0
      ? maskOneLineRangesWithSpaces(line.content, localProtectionRanges)
      : line.content;
    if (!SIMPLE_FAST_QUOTE_SIGNAL.test(definitionScanContent)) continue;
    const records = collectSimpleQuotedDefinitionRecords(definitionScanContent);
    if (records === SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW) {
      ranges.push({
        start: line.start,
        end: line.start + line.content.length,
        kind: "quoted-definition-boundary-overflow",
      });
      continue;
    }
    if (!Array.isArray(records) || records.length === 0) continue;
    ranges.push(...records.map((record) => ({
      start: line.start + record.start,
      end: line.start + record.end,
      kind: "quoted-definition",
    })));
  }
  return ranges;
}

function findSimpleQuotedDefinitionCustomLabels(text, records) {
  const labels = findCustomDefinitionEntryLabels(
    text,
    records.filter((record) => record.kind !== "indented-code"),
  );
  for (const record of records) {
    if (record.kind === "indented-code") continue;
    const definition = matchDefinitionEntry(text.slice(record.start, record.end));
    const key = normalizeDefinitionKey(definition?.groups.key ?? "");
    const namedSupportedTerm = key.match(/^(?<term>.+?)[\t ]+stitch$/iu)?.groups.term;
    if (!namedSupportedTerm || !SUPPORTED_NORMALIZED_DEFINITION_KEYS.has(namedSupportedTerm)) {
      continue;
    }
    addCustomDefinitionLabel(labels, namedSupportedTerm, definition.groups.value);
  }
  return labels;
}

function getSimpleQuotedNeighborChunk(text, start, end) {
  while (start < end && /\s/u.test(text[start])) start += 1;
  while (end > start && /\s/u.test(text[end - 1])) end -= 1;
  const leadingBoundary = text.slice(start, end).match(/^(?:[.!?;:]+[\t ]*)+/u)?.[0];
  if (leadingBoundary) start += leadingBoundary.length;
  while (start < end && /\s/u.test(text[start])) start += 1;
  const repeatedTerminal = text.slice(start, end).match(/([.!?])([.!?;:]+)$/u);
  if (repeatedTerminal) end -= repeatedTerminal[2].length;
  return { start, end, text: text.slice(start, end) };
}

function isSimpleProvenNonInstructionClause(text) {
  const definitionRecords = collectSimpleQuotedDefinitionRecords(text);
  if (
    Array.isArray(definitionRecords)
    && definitionRecords.length === 1
    && definitionRecords[0].start === 0
    && definitionRecords[0].end === text.length
  ) return true;

  if (!hasSourceTermCandidate(text)) {
    return !SIMPLE_FAST_QUOTE_SIGNAL.test(text)
      && !SIMPLE_FAST_QUOTED_CONTEXT_UNSAFE_SYNTAX.test(text);
  }
  const quotedRanges = findSimpleQuotedInstructionRanges(text);
  if (
    quotedRanges.length === 0
    || quotedRanges.some((range) => range.kind !== "quoted-instruction")
  ) return false;
  const quoteProjection = maskOneLineRangesWithSpaces(text, quotedRanges);
  return !hasSourceTermCandidate(quoteProjection)
    && !SIMPLE_FAST_QUOTE_SIGNAL.test(quoteProjection)
    && !SIMPLE_FAST_QUOTED_CONTEXT_UNSAFE_SYNTAX.test(quoteProjection);
}

function hasSimpleValidQuotedProtectedMetadata(text) {
  if (
    /[\r\n]/u.test(text)
    || !SIMPLE_FAST_QUOTE_SIGNAL.test(text)
    || (!text.includes("](") && !text.includes("]["))
  ) return false;
  return scanMarkdownLinkSyntax(text).malformedLineRanges.length === 0;
}

function collectSimpleProtectedMetadataWrappedSourceMatches(
  text,
  sourceRecordRanges,
  nonInstructionProtectionRanges,
  projectedClauseRanges,
  nonInstructionProjection,
  customDefinitionLabels,
) {
  if (sourceRecordRanges.length !== 1) return null;
  const [sourceRecord] = sourceRecordRanges;
  const hasProtectedPrefix = nonInstructionProtectionRanges.some(
    (range) => range.end <= sourceRecord.start,
  );
  if (!hasProtectedPrefix) return null;
  if (!/^[\s.!?;:]*$/u.test(
    nonInstructionProjection.slice(0, sourceRecord.start),
  )) return null;

  let clauseCount = 0;
  let matchedInstructionEnd = -1;
  const matches = [];
  for (const clause of projectedClauseRanges) {
    const clauseStart = Math.max(sourceRecord.end, clause.start);
    if (clauseStart >= clause.end) continue;
    const chunk = getSimpleQuotedNeighborChunk(
      nonInstructionProjection,
      clauseStart,
      clause.end,
    );
    if (!chunk.text) continue;
    clauseCount += 1;
    if (clauseCount > MAX_SIMPLE_FAST_SEGMENTS) return [];
    const chunkMatches = collectSimpleClosedWorkChunkMatches(
      chunk.text.replace(/\p{Zs}/gu, " "),
    );
    if (!chunkMatches || chunkMatches.length === 0) return null;
    matchedInstructionEnd = chunk.end;
    if (chunkMatches.some((match) => customDefinitionLabels?.has(match.entry.label))) {
      continue;
    }
    matches.push(...chunkMatches.map((match) => {
      const start = chunk.start + match.start;
      const end = chunk.start + match.end;
      return {
        ...match,
        start,
        end,
        matchedText: text.slice(start, end),
      };
    }));
  }
  if (
    matchedInstructionEnd === -1
    || !nonInstructionProtectionRanges.some(
      (range) => range.start >= matchedInstructionEnd,
    )
  ) return null;
  return matches.length > MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE ? [] : matches;
}

function collectSimpleReleasedQuotedDefinitionTailMatches(text) {
  const matches = [];
  let boundaryCount = 0;
  let cursor = 0;
  let sawRecognizedSegment = false;
  const collectChunk = (end) => {
    const chunk = getSimpleQuotedNeighborChunk(text, cursor, end);
    cursor = end;
    if (!chunk.text) return true;
    const physicalLineStart = text.lastIndexOf("\n", chunk.start - 1) + 1;
    const physicalLineEndIndex = text.indexOf("\n", chunk.start);
    const physicalLineEnd = physicalLineEndIndex === -1
      ? text.length
      : physicalLineEndIndex;
    const physicalLine = text.slice(physicalLineStart, physicalLineEnd).replace(/\r$/u, "");
    if (SINGLE_CODE_INDENTED_LINE.test(physicalLine)) return true;
    if (!hasSourceTermCandidate(chunk.text)) return true;
    let localMatches = collectSimpleClosedWorkChunkMatches(chunk.text);
    if (localMatches === null) {
      localMatches = collectSimpleBoundedAuthoritativeMatches(chunk.text);
    }
    if (localMatches === null) {
      if (
        isSimpleFastReviewOnlySegment(chunk.text)
        || isSimpleFastTensionMetaReviewSegment(chunk.text)
      ) {
        sawRecognizedSegment = true;
        return true;
      }
      return false;
    }
    sawRecognizedSegment = true;
    matches.push(...localMatches.map((match) => ({
      ...match,
      start: chunk.start + match.start,
      end: chunk.start + match.end,
    })));
    return true;
  };

  for (const boundary of text.matchAll(/[.!?](?=[\t\p{Zs}]+|$)/gu)) {
    if (isSimpleQuotedDefinitionInternalAbbreviationBoundary(text, boundary)) continue;
    boundaryCount += 1;
    if (boundaryCount > MAX_SIMPLE_FAST_SEGMENTS) return null;
    if (!collectChunk(boundary.index + boundary[0].length)) return null;
  }
  if (cursor < text.length && !collectChunk(text.length)) return null;
  return sawRecognizedSegment ? matches : null;
}

function collectSimpleBalancedClauseQuoteRanges(text) {
  if (!SIMPLE_FAST_QUOTE_SIGNAL.test(text)) return [];
  const ranges = [];
  for (let index = 0; index < text.length; index += 1) {
    const opener = text[index];
    const closer = SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.get(opener);
    if (!closer || isSimpleEscapedCharacter(text, index)) continue;
    if (
      (opener === "\"" || opener === "'")
      && /[\p{L}\p{M}\p{N}]/u.test(text[index - 1] ?? "")
    ) continue;
    let close = index + 1;
    while (
      close < text.length
      && text[close] !== "\r"
      && text[close] !== "\n"
    ) {
      if (text[close] === closer && !isSimpleEscapedCharacter(text, close)) break;
      close += 1;
    }
    if (close >= text.length || text[close] !== closer) continue;
    ranges.push({ start: index, end: close + 1 });
    index = close;
  }
  return ranges;
}

function collectSimpleBalancedParenthesisRanges(text) {
  const ranges = [];
  const stack = [];
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === "\r" || character === "\n") {
      stack.length = 0;
      continue;
    }
    if (isSimpleEscapedCharacter(text, index)) continue;
    if (character === "(") {
      stack.push(index);
    } else if (character === ")" && stack.length > 0) {
      ranges.push({ start: stack.pop(), end: index + 1 });
    }
  }
  return ranges;
}

function collectSimpleCustomClauseMarkdownRanges(text) {
  const referenceUses = [];
  const imageRanges = [];
  if (!text.includes("[")) return { referenceUses, imageRanges };

  const referenceUse = /!?\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\]\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\]/gu;
  let match;
  while ((match = referenceUse.exec(text)) !== null) {
    const range = { start: match.index, end: match.index + match[0].length };
    referenceUses.push(range);
    if (match[0][0] === "!") imageRanges.push(range);
  }

  const markdownImage = /!\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\](?:\((?:\\[^\r\n]|[^()\\\r\n])*\))?/gu;
  while ((match = markdownImage.exec(text)) !== null) {
    imageRanges.push({ start: match.index, end: match.index + match[0].length });
  }

  const validReferenceLabels = collectValidMarkdownReferenceLabels(text);
  if (validReferenceLabels.size > 0) {
    const shortcutUse = /\[(?<label>(?:\\[^\r\n]|[^\[\]\\\r\n])+)\]/gu;
    while ((match = shortcutUse.exec(text)) !== null) {
      if (!validReferenceLabels.has(normalizeMarkdownReferenceLabel(match.groups.label))) {
        continue;
      }
      const nextCharacter = text[match.index + match[0].length] ?? "";
      if (nextCharacter === "(" || nextCharacter === "[") continue;
      referenceUses.push({ start: match.index, end: match.index + match[0].length });
    }
  }
  return { referenceUses, imageRanges };
}

function getSimpleCustomDefinitionClauseSegments(text) {
  const clauseProtectionRanges = [
    ...collectSimpleBalancedClauseQuoteRanges(text),
    ...collectSimpleBalancedParenthesisRanges(text),
  ];
  if (text.includes("](")) {
    clauseProtectionRanges.push(...scanMarkdownLinkSyntax(text).inlineLinks);
  }
  if (text.includes("<")) {
    clauseProtectionRanges.push(...findHtmlMarkupRanges(text));
  }
  const markdownRanges = collectSimpleCustomClauseMarkdownRanges(text);
  clauseProtectionRanges.push(
    ...markdownRanges.referenceUses,
    ...markdownRanges.imageRanges,
  );
  const normalizedSeparatorText = text.replace(/\p{Zs}/gu, " ");
  const separatorScanText = clauseProtectionRanges.length > 0
    ? maskRanges(normalizedSeparatorText, clauseProtectionRanges)
    : normalizedSeparatorText;
  const segments = [];
  for (const line of splitTextLines(separatorScanText)) {
    const separatorScan = scanSimpleNeighboringWorkSeparators(line.content);
    const separators = separatorScan.separators.filter((separator) => (
      !/^[.!?;,]/u.test(separator[0])
      || !isSimpleEscapedCharacter(line.content, separator.index)
    ));
    if (
      separatorScan.overflow
      || separators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS
    ) {
      segments.push({
        start: line.start,
        end: line.end,
        overflow: true,
      });
      continue;
    }
    let segmentStart = 0;
    for (const separator of separators) {
      const segmentEnd = separator.index
        + (/^[;,]/u.test(separator[0]) ? 0 : 1);
      segments.push({
        start: line.start + segmentStart,
        end: line.start + segmentEnd,
      });
      segmentStart = separator.index + separator[0].length;
    }
    segments.push({
      start: line.start + segmentStart,
      end: line.end,
    });
  }
  return segments;
}

function findSimpleCustomDefinitionWorkClauseRanges(text, customDefinitionLabels) {
  if (!customDefinitionLabels?.size) return [];
  const segments = getSimpleCustomDefinitionClauseSegments(text);
  const ranges = [];
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex];
    const segmentText = text.slice(segment.start, segment.end);
    const markdownSyntax = segmentText.includes("[")
      ? scanMarkdownLinkSyntax(segmentText)
      : null;
    const customClauseMarkdownRanges = collectSimpleCustomClauseMarkdownRanges(
      segmentText,
    );
    const scanProtectionRanges = [
      ...(segmentText.includes("`")
        ? findMarkdownCodeRanges(segmentText).filter((range) => !range.unclosedInline)
        : []),
      ...(segmentText.includes("<") ? findHtmlMarkupRanges(segmentText) : []),
      ...findSimplePhysicalIndentedCodeRanges(segmentText),
      ...(markdownSyntax?.destinations ?? []),
      ...(markdownSyntax?.imageRanges ?? []),
      ...customClauseMarkdownRanges.imageRanges,
    ];
    const scanText = scanProtectionRanges.length > 0
      ? maskRanges(segmentText, scanProtectionRanges)
      : segmentText;
    const customTerm = collectSimpleFastWorkTerms(scanText).find((match) => (
      customDefinitionLabels.has(match.entry.label)
      && /\bwork\b/iu.test(scanText.slice(0, match.start))
    ));
    if (!customTerm) continue;
    const deniedRange = {
      start: segment.start,
      end: segments[segmentIndex + 1]?.start ?? segment.end,
    };
    if (!ranges.some((range) => (
      range.start === deniedRange.start && range.end === deniedRange.end
    ))) {
      ranges.push(deniedRange);
    }
  }
  return ranges;
}

function collectSimpleReleasedMatchesOutsideRanges(text, deniedRanges) {
  if (deniedRanges.length === 0) return null;
  const matches = [];
  let cursor = 0;
  for (const range of [
    ...deniedRanges.sort((left, right) => left.start - right.start),
    { start: text.length, end: text.length },
  ]) {
    if (cursor < range.start) {
      const chunk = text.slice(cursor, range.start);
      for (const segment of getSimpleCustomDefinitionClauseSegments(chunk)) {
        if (segment.overflow) continue;
        const segmentText = chunk.slice(segment.start, segment.end);
        if (!hasSourceTermCandidate(segmentText)) continue;
        let localMatches = collectSimpleQuotedSourcePathNeighborMatches(segmentText);
        if (localMatches === null) {
          localMatches = collectSimpleReleasedQuotedDefinitionTailMatches(segmentText);
        }
        if (localMatches === null) return null;
        matches.push(...localMatches.map((match) => ({
          ...match,
          start: cursor + segment.start + match.start,
          end: cursor + segment.start + match.end,
        })));
      }
    }
    cursor = Math.max(cursor, range.end);
  }
  return matches;
}

function applySimpleCustomDefinitionClausePolicy(text, matches, customDefinitionLabels) {
  if (!customDefinitionLabels?.size || matches.length === 0) {
    return { matches, deniedRanges: [] };
  }
  const segments = getSimpleCustomDefinitionClauseSegments(text);
  const deniedRanges = segments.filter((segment) => matches.some((match) => (
    segment.start <= match.start
    && match.end <= segment.end
    && customDefinitionLabels.has(match.entry.label)
  )));
  if (deniedRanges.length === 0) return { matches, deniedRanges };
  return {
    matches: matches.filter((match) => !deniedRanges.some((range) => (
      range.start <= match.start && match.end <= range.end
    ))),
    deniedRanges,
  };
}

function collectSimpleQuotedMultilineNeighborMatches(text) {
  if (!/[\r\n]/u.test(text)) return null;
  const matches = [];
  for (const line of splitTextLines(text)) {
    if (!line.content || !hasSimpleQuotedRelevantTerm(line.content)) continue;
    let localMatches;
    if (
      SIMPLE_FAST_DECLARATIVE_GLOSSARY_LINE.test(line.content)
      || SIMPLE_FAST_GLOSSARY_TERM_LIST_LINE.test(line.content)
    ) {
      localMatches = [];
    } else {
      localMatches = collectPlainWorkMatches(line.content);
      if (localMatches === null) localMatches = collectSimpleHeadingWorkMatches(line.content);
      if (localMatches === null) localMatches = collectSimpleSegmentedWorkMatches(line.content);
      if (localMatches === null) localMatches = collectSimpleBoundedAuthoritativeMatches(line.content);
    }
    if (localMatches === null) return null;
    matches.push(...localMatches.map((match) => ({
      ...match,
      start: line.start + match.start,
      end: line.start + match.end,
    })));
  }
  return matches;
}

function collectSimpleDelimitedSourceRecordRanges(text) {
  if (!/[\x60"'“‘]|\\;/u.test(text)) return [];
  const ranges = [];
  SIMPLE_FAST_INLINE_STRONG_SOURCE_RECORD_START.lastIndex = 0;
  let recordStartMatch;
  while (
    (recordStartMatch = SIMPLE_FAST_INLINE_STRONG_SOURCE_RECORD_START.exec(text)) !== null
  ) {
    const recordPrefix = recordStartMatch.groups.recordPrefix;
    const start = recordStartMatch.index + recordStartMatch[0].length - recordPrefix.length;
    const valueStart = recordStartMatch.index + recordStartMatch[0].length;
    let cursor = valueStart;
    let activeBacktickLength = 0;
    let activeQuoteClose = null;
    let pendingUnclosedBoundary = -1;
    let recordEnd = text.length;
    let sawDelimitedSyntax = false;
    while (cursor < text.length) {
      if (activeBacktickLength !== 0) {
        if (text[cursor] === "`") {
          let delimiterEnd = cursor + 1;
          while (delimiterEnd < text.length && text[delimiterEnd] === "`") delimiterEnd += 1;
          if (delimiterEnd - cursor === activeBacktickLength) {
            activeBacktickLength = 0;
            pendingUnclosedBoundary = -1;
          }
          cursor = delimiterEnd;
          continue;
        }
      } else if (activeQuoteClose !== null) {
        if (
          text[cursor] === activeQuoteClose
          && !isSimpleEscapedCharacter(text, cursor)
        ) {
          activeQuoteClose = null;
          pendingUnclosedBoundary = -1;
          cursor += 1;
          continue;
        }
      } else if (
        (text[cursor] === "`" || SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.has(text[cursor]))
        && isSimpleEscapedCharacter(text, cursor)
      ) {
        sawDelimitedSyntax = true;
        cursor += 1;
        continue;
      } else if (text[cursor] === "`") {
        let delimiterEnd = cursor + 1;
        while (delimiterEnd < text.length && text[delimiterEnd] === "`") delimiterEnd += 1;
        activeBacktickLength = delimiterEnd - cursor;
        sawDelimitedSyntax = true;
        pendingUnclosedBoundary = -1;
        cursor = delimiterEnd;
        continue;
      } else if (
        SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.has(text[cursor])
      ) {
        activeQuoteClose = SIMPLE_FAST_QUOTE_CLOSE_BY_OPEN.get(text[cursor]);
        sawDelimitedSyntax = true;
        pendingUnclosedBoundary = -1;
        cursor += 1;
        continue;
      }
      if (
        text[cursor] === ";"
        && /[\t\p{Zs}]/u.test(text[cursor + 1] ?? "")
      ) {
        if (isSimpleEscapedCharacter(text, cursor)) {
          sawDelimitedSyntax = true;
          cursor += 1;
          continue;
        }
        if (activeBacktickLength === 0 && activeQuoteClose === null) {
          recordEnd = cursor;
          break;
        }
        if (pendingUnclosedBoundary === -1) pendingUnclosedBoundary = cursor;
      }
      cursor += 1;
    }
    if (
      cursor === text.length
      && (activeBacktickLength !== 0 || activeQuoteClose !== null)
      && pendingUnclosedBoundary !== -1
    ) {
      recordEnd = pendingUnclosedBoundary;
    }
    const value = text.slice(valueStart, recordEnd);
    if (sawDelimitedSyntax && /\S/u.test(value)) ranges.push({ start, end: recordEnd });
    SIMPLE_FAST_INLINE_STRONG_SOURCE_RECORD_START.lastIndex = Math.max(
      SIMPLE_FAST_INLINE_STRONG_SOURCE_RECORD_START.lastIndex,
      recordEnd,
    );
  }
  SIMPLE_FAST_INLINE_STRONG_SOURCE_RECORD_START.lastIndex = 0;
  return ranges;
}

function collectSimpleQuotedSourcePathNeighborMatches(
  text,
  allowProvenMetadataClauses = false,
  customDefinitionLabels = null,
) {
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH || /[\r\n]/u.test(text)) return null;
  if (!SIMPLE_FAST_STRONG_SOURCE_LABEL_SIGNAL.test(text)) return null;
  const rawSourceRecordRanges = [];
  SIMPLE_FAST_INLINE_STRONG_SOURCE_PATH_RECORD.lastIndex = 0;
  let recordMatch;
  while ((recordMatch = SIMPLE_FAST_INLINE_STRONG_SOURCE_PATH_RECORD.exec(text)) !== null) {
    const record = recordMatch.groups.record;
    const start = recordMatch.index + recordMatch[0].length - record.length;
    rawSourceRecordRanges.push({ start, end: start + record.length });
  }
  SIMPLE_FAST_INLINE_STRONG_SOURCE_PATH_RECORD.lastIndex = 0;
  rawSourceRecordRanges.push(...collectSimpleDelimitedSourceRecordRanges(text));
  const sourceStartProtectionRangesRaw = [
    ...(text.includes("`")
      ? findMarkdownCodeRanges(text).filter((range) => !range.unclosedInline)
      : []),
    ...(text.includes("<") ? findHtmlMarkupRanges(text) : []),
    ...(text.includes("](")
      ? scanMarkdownLinkSyntax(text).inlineLinks.map(({ start, end }) => ({ start, end }))
      : []),
    ...(text.includes("(") && text.includes(")")
      ? collectSimpleBalancedParenthesisRanges(text)
      : []),
  ];
  if (text.includes("][")) {
    const markdownReferenceUse = /\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\]\[(?:\\[^\r\n]|[^\[\]\\\r\n])*\]/gu;
    let referenceUse;
    while ((referenceUse = markdownReferenceUse.exec(text)) !== null) {
      sourceStartProtectionRangesRaw.push({
        start: referenceUse.index,
        end: referenceUse.index + referenceUse[0].length,
      });
    }
  }
  if (text.includes("[") && text.includes("]:")) {
    const validReferenceLabels = collectValidMarkdownReferenceLabels(text);
    const markdownShortcutOrCollapsedUse = /\[(?<label>(?:\\[^\r\n]|[^\[\]\\\r\n])+)\](?<collapsed>\[\])?/gu;
    let shortcutUse;
    while ((shortcutUse = markdownShortcutOrCollapsedUse.exec(text)) !== null) {
      if (!validReferenceLabels.has(normalizeMarkdownReferenceLabel(shortcutUse.groups.label))) {
        continue;
      }
      const nextCharacter = text[shortcutUse.index + shortcutUse[0].length] ?? "";
      if (!shortcutUse.groups.collapsed && (nextCharacter === "(" || nextCharacter === "[")) {
        continue;
      }
      sourceStartProtectionRangesRaw.push({
        start: shortcutUse.index,
        end: shortcutUse.index + shortcutUse[0].length,
      });
    }
  }
  const sourceStartProtectionRanges = [];
  for (const range of sourceStartProtectionRangesRaw.sort((left, right) => (
    left.start - right.start || right.end - left.end
  ))) {
    const previous = sourceStartProtectionRanges.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      sourceStartProtectionRanges.push({ start: range.start, end: range.end });
    }
  }
  const protectedSyntaxProjection = maskOneLineRangesWithSpaces(
    text,
    sourceStartProtectionRanges,
  );
  const projectedClauseRanges = [];
  const projectedClauseSeparator = /;[\t\p{Zs}]+/gu;
  let projectedClauseStart = 0;
  let projectedClauseSeparatorMatch;
  while (
    (projectedClauseSeparatorMatch = projectedClauseSeparator.exec(
      protectedSyntaxProjection,
    )) !== null
  ) {
    projectedClauseRanges.push({
      start: projectedClauseStart,
      end: projectedClauseSeparatorMatch.index + 1,
    });
    projectedClauseStart = projectedClauseSeparator.lastIndex;
  }
  projectedClauseRanges.push({ start: projectedClauseStart, end: text.length });
  const nonInstructionProtectionRanges = [];
  let projectedClauseIndex = 0;
  for (const range of sourceStartProtectionRanges) {
    while (
      projectedClauseIndex + 1 < projectedClauseRanges.length
      && projectedClauseRanges[projectedClauseIndex].end <= range.start
    ) projectedClauseIndex += 1;
    const clause = projectedClauseRanges[projectedClauseIndex];
    if (
      clause
      && !/\bwork\b/iu.test(protectedSyntaxProjection.slice(clause.start, clause.end))
      && !hasSourceTermCandidate(text.slice(range.start, range.end))
    ) nonInstructionProtectionRanges.push(range);
  }
  const nonInstructionProjection = nonInstructionProtectionRanges.length > 0
    ? maskOneLineRangesWithSpaces(text, nonInstructionProtectionRanges)
    : text;
  const sourceRecordRanges = [];
  let sourceStartProtectionRangeIndex = 0;
  for (const rawRange of rawSourceRecordRanges.sort((left, right) => (
    left.start - right.start || right.end - left.end
  ))) {
    const range = { ...rawRange };
    let extendedThroughProtectedSyntax = false;
    while (
      sourceStartProtectionRangeIndex < sourceStartProtectionRanges.length
      && sourceStartProtectionRanges[sourceStartProtectionRangeIndex].end <= range.start
    ) sourceStartProtectionRangeIndex += 1;
    for (
      let overlapIndex = sourceStartProtectionRangeIndex;
      overlapIndex < sourceStartProtectionRanges.length;
      overlapIndex += 1
    ) {
      const protectedRange = sourceStartProtectionRanges[overlapIndex];
      if (protectedRange.start >= range.end) break;
      if (
        protectedRange.start > range.start
        && range.end < protectedRange.end
      ) {
        range.end = protectedRange.end;
        extendedThroughProtectedSyntax = true;
      }
    }
    if (extendedThroughProtectedSyntax) {
      const containingClause = projectedClauseRanges.find((clause) => (
        clause.start <= range.start && range.start < clause.end
      ));
      if (containingClause) {
        const clauseEndsWithSeparator = containingClause.end <= text.length
          && protectedSyntaxProjection[containingClause.end - 1] === ";";
        range.end = Math.max(
          range.end,
          containingClause.end - (clauseEndsWithSeparator ? 1 : 0),
        );
      }
    }
    const sourceStartProtectionRange = sourceStartProtectionRanges[
      sourceStartProtectionRangeIndex
    ];
    if (
      sourceStartProtectionRange
      && sourceStartProtectionRange.start <= range.start
      && range.start < sourceStartProtectionRange.end
    ) continue;
    const previous = sourceRecordRanges.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      sourceRecordRanges.push({ ...range });
    }
  }
  if (sourceRecordRanges.length === 0) return null;
  const maskedText = maskOneLineRangesWithSpaces(text, sourceRecordRanges);
  const leadingWhitespaceLength = text.match(/^[\t\p{Zs}]*/u)?.[0].length ?? 0;
  const projectionStart = sourceRecordRanges[0].start === leadingWhitespaceLength
    ? sourceRecordRanges[0].end
    : 0;
  const protectedMetadataWrappedSourceMatches = projectionStart === 0
    ? collectSimpleProtectedMetadataWrappedSourceMatches(
      text,
      sourceRecordRanges,
      nonInstructionProtectionRanges,
      projectedClauseRanges,
      nonInstructionProjection,
      customDefinitionLabels,
    )
    : null;
  if (protectedMetadataWrappedSourceMatches !== null) {
    return protectedMetadataWrappedSourceMatches;
  }
  if (
    SIMPLE_FAST_QUOTE_SIGNAL.test(maskedText)
    || SIMPLE_FAST_QUOTED_CONTEXT_UNSAFE_SYNTAX.test(maskedText)
  ) {
    if (sourceRecordRanges.length >= MAX_SIMPLE_FAST_SEGMENTS) return [];
    const matches = [];
    const collectRegionMatches = (start, end) => {
      const normalizedRegion = nonInstructionProjection
        .slice(start, end)
        .replace(/\p{Zs}/gu, " ");
      if (!normalizedRegion) return [];
      let localMatches = null;
      const denseProtectionCount = nonInstructionProtectionRanges.filter((range) => (
        range.start < end && range.end > start
      )).length;
      if (
        denseProtectionCount > MAX_SIMPLE_FAST_SEGMENTS
        || allowProvenMetadataClauses
      ) {
        const denseClauseMatches = [];
        let denseClauseCount = 0;
        let denseClausesProven = true;
        for (const clause of projectedClauseRanges) {
          const clauseStart = Math.max(start, clause.start);
          const clauseEnd = Math.min(end, clause.end);
          if (clauseStart >= clauseEnd) continue;
          const chunk = getSimpleQuotedNeighborChunk(
            nonInstructionProjection,
            clauseStart,
            clauseEnd,
          );
          if (!chunk.text) continue;
          denseClauseCount += 1;
          if (denseClauseCount > MAX_SIMPLE_FAST_SEGMENTS) {
            denseClausesProven = false;
            break;
          }
          const chunkMatches = collectSimpleClosedWorkChunkMatches(
            chunk.text.replace(/\p{Zs}/gu, " "),
          );
          if (!chunkMatches || chunkMatches.length === 0) {
            if (
              allowProvenMetadataClauses
              && isSimpleProvenNonInstructionClause(chunk.text)
            ) continue;
            denseClausesProven = false;
            break;
          }
          denseClauseMatches.push(...chunkMatches.map((match) => ({
            ...match,
            start: chunk.start - start + match.start,
            end: chunk.start - start + match.end,
          })));
        }
        if (denseClausesProven && denseClauseCount > 0) {
          localMatches = denseClauseMatches;
        }
      }
      if (localMatches === null) {
        localMatches = collectSimpleSegmentedWorkMatches(normalizedRegion, true);
      }
      if (localMatches === null) {
        localMatches = collectPlainWorkMatchesWithTerminalSemicolon(normalizedRegion);
      }
      if (localMatches === null) {
        localMatches = collectSimpleHeadingWorkMatches(normalizedRegion);
      }
      if (localMatches === null) {
        localMatches = collectSimpleBoundedAuthoritativeMatches(normalizedRegion);
      }
      if (localMatches === null) localMatches = collectMatches(normalizedRegion);
      return localMatches.map((match) => {
        const matchStart = start + match.start;
        const matchEnd = start + match.end;
        return {
          ...match,
          start: matchStart,
          end: matchEnd,
          matchedText: text.slice(matchStart, matchEnd),
        };
      });
    };
    let cursor = projectionStart;
    for (const range of sourceRecordRanges) {
      if (range.end <= cursor) continue;
      if (cursor < range.start) {
        matches.push(...collectRegionMatches(cursor, range.start));
      }
      cursor = range.end;
    }
    if (cursor < text.length) {
      matches.push(...collectRegionMatches(cursor, text.length));
    }
    return matches.length > MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE ? [] : matches;
  }
  const normalizedProjection = maskedText.slice(projectionStart).replace(/\p{Zs}/gu, " ");
  const localMatches = collectSimpleSegmentedWorkMatches(normalizedProjection, true);
  return localMatches?.map((match) => {
    const start = projectionStart + match.start;
    const end = projectionStart + match.end;
    return {
      ...match,
      start,
      end,
      matchedText: text.slice(start, end),
    };
  }) ?? null;
}

function collectSimpleReleasedMultilineSourceMatches(text, customDefinitionLabels) {
  if (
    !/[\r\n]/u.test(text)
    || !SIMPLE_FAST_STRONG_SOURCE_LABEL_SIGNAL.test(text)
  ) return null;
  const lines = splitTextLines(text);
  if (lines.length > MAX_SIMPLE_FAST_SEGMENTS + 2) return null;
  const matches = [];
  let sawSourceLine = false;
  for (const line of lines) {
    if (!/\S/u.test(line.content)) continue;
    const definitionPrefix = line.content.match(/^ {0,3}\[/u)?.[0];
    const definitionLabel = definitionPrefix
      ? scanMarkdownReferenceLabel(line.content, definitionPrefix.length - 1)
      : null;
    if (
      definitionLabel?.valid
      && line.content[definitionLabel.end] === ":"
      && /\S/u.test(line.content.slice(definitionLabel.end + 1))
    ) continue;
    if (!hasSourceTermCandidate(line.content)) continue;
    const hasSourceLabel = SIMPLE_FAST_STRONG_SOURCE_LABEL_SIGNAL.test(line.content);
    let localMatches = hasSourceLabel
      ? collectSimpleQuotedSourcePathNeighborMatches(
        line.content,
        false,
        customDefinitionLabels,
      )
      : null;
    if (hasSourceLabel && localMatches !== null) sawSourceLine = true;
    if (localMatches === null) {
      localMatches = collectSimpleReleasedQuotedDefinitionTailMatches(line.content);
    }
    if (localMatches === null) localMatches = collectMatches(line.content);
    if (localMatches === null) continue;
    matches.push(...localMatches.map((match) => ({
      ...match,
      start: line.start + match.start,
      end: line.start + match.end,
    })));
  }
  return sawSourceLine || matches.length > 0 ? matches : null;
}

function collectSimpleQuotedInstructionContextMatches(
  text,
  requireQuotedMarkupInstruction = false,
) {
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH) return null;
  const quotedDetectionProtectionRanges = [
    ...findMarkdownCodeRanges(text),
    ...findHtmlMarkupRanges(text).filter((range) => range.kind === "html-code"),
    ...findSimplePhysicalIndentedCodeRanges(text),
  ];
  const rawQuotedRanges = findSimpleQuotedInstructionRanges(text).filter(
    (quotedRange) => !quotedDetectionProtectionRanges.some(
      (protectedRange) => (
        protectedRange.start < quotedRange.end
        && protectedRange.end > quotedRange.start
      ),
    ),
  );
  if (rawQuotedRanges.length === 0 || isSimpleQuotedDefinitionContext(text, rawQuotedRanges)) {
    return null;
  }
  const quotedMarkupRanges = new Set();
  for (const rawRange of rawQuotedRanges) {
    if (rawRange.kind !== "quoted-instruction") continue;
    const quotedContent = text.slice(rawRange.start + 1, rawRange.end - 1);
    let quotedMarkupMatches = collectSimpleInlineLinkWorkMatches(quotedContent);
    if (quotedMarkupMatches === null) {
      quotedMarkupMatches = collectSimpleExplicitReferenceWorkMatches(quotedContent);
    }
    if (quotedMarkupMatches !== null) quotedMarkupRanges.add(rawRange);
  }
  if (requireQuotedMarkupInstruction && quotedMarkupRanges.size === 0) return null;
  const quotedRanges = findSimpleQuotedInstructionProtectionRanges(text);
  if (quotedRanges.some((range) => {
    const protectedCharacters = text.slice(range.start, range.end).split("");
    for (const rawRange of rawQuotedRanges) {
      if (rawRange.start < range.start || rawRange.start >= range.end) continue;
      if (rawRange.kind === "unmatched-quoted-instruction") {
        protectedCharacters.fill(
          " ",
          Math.max(0, rawRange.start - range.start),
          Math.min(protectedCharacters.length, rawRange.end - range.start),
        );
        continue;
      }
      if (quotedMarkupRanges.has(rawRange)) {
        protectedCharacters.fill(
          " ",
          Math.max(0, rawRange.start - range.start),
          Math.min(protectedCharacters.length, rawRange.end - range.start),
        );
      }
      const outerEmphasis = getSimpleQuotedOuterEmphasis(text, rawRange);
      const structuralStart = getSimpleQuotedStructuralPrefixStart(text, rawRange);
      if (structuralStart < rawRange.start) {
        protectedCharacters.fill(
          " ",
          Math.max(0, structuralStart - range.start),
          Math.min(protectedCharacters.length, rawRange.start - range.start),
        );
      }
      if (outerEmphasis && outerEmphasis.end > rawRange.end) {
        protectedCharacters.fill(
          " ",
          Math.max(0, rawRange.end - range.start),
          Math.min(protectedCharacters.length, outerEmphasis.end - range.start),
        );
      }
      const closingQuote = rawRange.end - 1;
      let closingEscapeStart = closingQuote;
      while (
        closingEscapeStart > rawRange.start
        && text[closingEscapeStart - 1] === "\\"
      ) closingEscapeStart -= 1;
      if (closingEscapeStart < closingQuote) {
        protectedCharacters.fill(
          " ",
          Math.max(0, closingEscapeStart - range.start),
          Math.min(protectedCharacters.length, closingQuote - range.start),
        );
      }
    }
    return SIMPLE_FAST_QUOTED_CONTEXT_UNSAFE_SYNTAX.test(protectedCharacters.join(""));
  })) return null;

  const matches = [];
  let cursor = 0;
  for (const range of [...quotedRanges, { start: text.length, end: text.length }]) {
    const chunk = getSimpleQuotedNeighborChunk(text, cursor, range.start);
    if (chunk.text && hasSimpleQuotedRelevantTerm(chunk.text)) {
      let localMatches = collectPlainWorkMatches(chunk.text);
      if (localMatches === null) localMatches = collectSimpleHeadingWorkMatches(chunk.text);
      if (localMatches === null) {
        localMatches = collectSimpleQuotedMultilineNeighborMatches(chunk.text);
      }
      if (localMatches === null && !requireQuotedMarkupInstruction) {
        localMatches = collectSimpleQuotedSourcePathNeighborMatches(chunk.text);
      }
      if (localMatches === null) localMatches = collectMatches(chunk.text);
      matches.push(...localMatches.map((match) => ({
        ...match,
        start: chunk.start + match.start,
        end: chunk.start + match.end,
      })));
    }
    cursor = range.end;
  }
  return matches;
}

function collectSimpleAdvertisedVerticalTermMatches(text) {
  if (
    text.length > 512
    || !text.includes("\n")
    || /[|`<>\[\]{}*_\\\p{Cf}]/u.test(text)
  ) return null;

  const lines = splitTextLines(text);
  if (lines.length !== SIMPLE_ADVERTISED_VERTICAL_TERM_BY_NORMALIZED.size) return null;

  const seen = new Set();
  const matches = [];
  for (const line of lines) {
    if (SINGLE_CODE_INDENTED_LINE.test(line.content)) return null;
    const leading = line.content.match(/^[\t ]*/u)?.[0].length ?? 0;
    const trailing = line.content.match(/[\t ]*$/u)?.[0].length ?? 0;
    const itemStart = line.start + leading;
    const itemEnd = line.end - trailing;
    const item = text.slice(itemStart, itemEnd);
    const normalized = item.toLocaleLowerCase("en-US").replace(/[\t ]+/gu, " ");
    const advertised = SIMPLE_ADVERTISED_VERTICAL_TERM_BY_NORMALIZED.get(normalized);
    if (!advertised || seen.has(normalized)) return null;
    seen.add(normalized);

    const matchedText = advertised.tension
      ? item.match(/^[^\t ]+/u)?.[0] ?? ""
      : item;
    if (!matchedText) return null;
    matches.push({
      start: itemStart,
      end: itemStart + matchedText.length,
      matchedText,
      entry: advertised.entry,
    });
  }

  return seen.size === SIMPLE_ADVERTISED_VERTICAL_TERM_BY_NORMALIZED.size
    ? matches
    : null;
}

function collectSimpleFlatTermListMatches(text) {
  if (
    text.length > 512
    || /[\r\n|`<>\[\]{}*_\\\p{Cf}]/u.test(text)
    || !/[,;]/u.test(text)
  ) return null;

  const matches = [];
  const boundaries = [...text.matchAll(/[,;]/gu)];
  let start = 0;
  for (let index = 0; index <= boundaries.length; index += 1) {
    const end = index < boundaries.length ? boundaries[index].index : text.length;
    const raw = text.slice(start, end);
    const leading = raw.match(/^[\t ]*/u)?.[0].length ?? 0;
    const trailing = raw.match(
      index === boundaries.length ? /[\t ]*[.!?]?[\t ]*$/u : /[\t ]*$/u,
    )?.[0].length ?? 0;
    const itemStart = start + leading;
    const itemEnd = end - trailing;
    const item = text.slice(itemStart, itemEnd);
    const tensionSquare = item.match(/^(?<term>tension)[\t ]+square$/iu);
    const termText = tensionSquare?.groups.term ?? item;
    const entry = SOURCE_STITCH_TERM_ENTRY_BY_TERM.get(
      termText.toLocaleLowerCase("en-US").replace(/[\t ]+/gu, " "),
    ) ?? (tensionSquare ? TENSION_TERM_ENTRY : undefined);
    if (!entry) return null;
    const termEnd = itemStart + termText.length;
    if (
      entry.label === "Tension"
      && !tensionSquare
      && !isTensionGaugeContext(text, itemStart, termEnd)
    ) {
      return null;
    }
    matches.push({
      start: itemStart,
      end: termEnd,
      matchedText: termText,
      entry,
    });
    start = end + 1;
  }
  return matches.length >= 2 && matches.length <= 16 ? matches : null;
}

function isSimpleFastPunctuatedFlatTermListDeny(text) {
  if (
    text.length > 512
    || /[\r\n|`<>\[\]{}*_\\\p{Cf}]/u.test(text)
    || !/[,;]/u.test(text)
  ) return false;

  const boundaries = [...text.matchAll(/[,;]/gu)];
  if (boundaries.length < 1 || boundaries.length > 15) return false;
  let start = 0;
  let supportedCount = 0;
  let sawMalformedListSyntax = false;
  for (let index = 0; index <= boundaries.length; index += 1) {
    const end = index < boundaries.length ? boundaries[index].index : text.length;
    let item = text.slice(start, end).trim();
    if (!item) {
      sawMalformedListSyntax = true;
      start = end + 1;
      continue;
    }
    const punctuation = item.match(/[.!?]+$/u)?.[0] ?? "";
    if (punctuation) {
      if (index < boundaries.length || punctuation.length > 1) {
        sawMalformedListSyntax = true;
      }
      item = item.slice(0, -punctuation.length).trimEnd();
    }
    const normalized = item.toLocaleLowerCase("en-US").replace(/[\t ]+/gu, " ");
    if (
      !SOURCE_STITCH_TERM_ENTRY_BY_TERM.has(normalized)
      && normalized !== "tension square"
    ) return false;
    supportedCount += 1;
    start = end + 1;
  }
  return supportedCount >= 2 && sawMalformedListSyntax;
}

function collectSimpleNumberedRoundFlatMatches(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return null;
  const prefix = text.match(SIMPLE_FAST_NUMBERED_ROUND_PREFIX)?.[0];
  if (!prefix) return null;
  const localMatches = collectSimpleFlatTermListMatches(text.slice(prefix.length));
  if (!localMatches || localMatches.length > 8) return null;
  return localMatches.map((match) => ({
    ...match,
    start: prefix.length + match.start,
    end: prefix.length + match.end,
  }));
}

function collectSimpleNumberedBareItemMatches(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return null;
  const prefix = text.match(SIMPLE_FAST_NUMBERED_ITEM_START)?.[0];
  if (!prefix) return null;
  const body = text.slice(prefix.length);
  const bodyMatch = body.match(SIMPLE_FAST_NUMBERED_BARE_ITEM_BODY);
  if (!bodyMatch) return null;
  const list = bodyMatch.groups.list;
  const listStart = bodyMatch[0].indexOf(list);
  const localMatches = collectSimpleFastWorkTerms(list);
  if (localMatches.length < 1 || localMatches.length > 8) return null;
  const hasTarget = Boolean(bodyMatch.groups.target);
  if (localMatches.length > 1 && (!hasTarget || SIMPLE_FAST_ALONE_TARGET.test(body))) {
    return [];
  }
  if (
    localMatches.length === 1
    && SIMPLE_FAST_ALONE_TARGET.test(body)
    && /[\t ]/u.test(localMatches[0].matchedText)
  ) return [];
  return localMatches.map((match) => ({
    ...match,
    start: prefix.length + listStart + match.start,
    end: prefix.length + listStart + match.end,
  }));
}

function getSimpleTerminalPunctuationRecognitionText(text) {
  const punctuationRun = text.match(
    /(?<first>[.!?])(?<rest>[.!?;]+)(?<spacing>[\t ]*)$/u,
  );
  if (punctuationRun) {
    return `${text.slice(0, punctuationRun.index)}${punctuationRun.groups.first}${" ".repeat(
      punctuationRun.groups.rest.length,
    )}${punctuationRun.groups.spacing}`;
  }
  const terminalSemicolon = text.match(/;(?<spacing>[\t ]*)$/u);
  if (!terminalSemicolon) return text;
  return `${text.slice(0, terminalSemicolon.index)} ${terminalSemicolon.groups.spacing}`;
}

function collectSimpleWholeInlineCodeWorkMatches(text) {
  if (text.length > 512 || /[\r\n]/u.test(text) || !text.includes("`")) return null;
  const workText = getSimpleFastWorkBody(text);
  const terminalRecognitionWorkText = getSimpleTerminalPunctuationRecognitionText(workText);
  const workPrefix = terminalRecognitionWorkText.match(/^ {0,3}work[\t ]+/iu)?.[0];
  if (!workPrefix) return null;
  const target = terminalRecognitionWorkText.match(SIMPLE_FAST_WORK_TARGET_TAIL);
  const terminal = target ? null : terminalRecognitionWorkText.match(/[.!?]?[\t ]*$/u);
  const localListEnd = target?.index ?? terminal?.index;
  if (localListEnd === undefined || localListEnd <= workPrefix.length) return null;

  const rawList = terminalRecognitionWorkText.slice(workPrefix.length, localListEnd);
  const leading = rawList.match(/^[\t ]*/u)?.[0].length ?? 0;
  const trailing = rawList.match(/[\t ]*$/u)?.[0].length ?? 0;
  const bodyOffset = text.length - workText.length;
  const listStart = bodyOffset + workPrefix.length + leading;
  const listEnd = bodyOffset + localListEnd - trailing;
  if (listEnd <= listStart) return null;

  const inlineDestinationRanges = text.includes("](")
    ? collectBoundedInlineDestinationRanges(text)
    : [];
  let codeScanText = inlineDestinationRanges.length > 0
    ? maskRanges(text, inlineDestinationRanges)
    : text;
  if (codeScanText.includes("][")) {
    codeScanText = maskSimpleReferenceLabelContents(codeScanText);
  }
  const codeRanges = findMarkdownCodeRanges(codeScanText);
  const separatorScanWorkText = getSimpleTerminalPunctuationRecognitionText(
    maskRanges(codeScanText, codeRanges).slice(bodyOffset),
  );
  const internalSeparatorScanWorkText = separatorScanWorkText.replace(
    /[.!?][\t\p{Zs}]*$/u,
    "",
  );
  if (
    /[.!?;][\t\p{Zs}]+/u.test(internalSeparatorScanWorkText)
    || /,[\t\p{Zs}]+then[\t\p{Zs}]+work\b/iu.test(internalSeparatorScanWorkText)
  ) return null;

  let leadingBackslashCount = 0;
  while (codeScanText[listStart + leadingBackslashCount] === "\\") {
    leadingBackslashCount += 1;
  }
  if (
    leadingBackslashCount % 2 === 1
    && codeScanText[listStart + leadingBackslashCount] === "`"
  ) return [];

  if (codeRanges.some((range) => range.start < listEnd && range.end > listEnd)) return [];

  const wrapperRange = codeRanges.find((range) => {
    if (range.start < listStart || range.start >= listEnd) return false;
    const prefix = text.slice(listStart, range.start);
    if (prefix.length % 2 !== 0) return false;
    for (const character of prefix) {
      if (character !== "\\") return false;
    }
    return true;
  });
  if (wrapperRange) {
    const prefixLength = wrapperRange.start - listStart;
    let delimiterLength = 0;
    while (codeScanText[wrapperRange.start + delimiterLength] === "`") {
      delimiterLength += 1;
    }
    if (
      prefixLength > MAX_SIMPLE_INLINE_CODE_BACKSLASH_PREFIX
      || delimiterLength > MAX_SIMPLE_INLINE_CODE_DELIMITER_LENGTH
    ) return [];
    if (wrapperRange.end === listEnd) {
      const protectedList = codeScanText.slice(listStart, listEnd).replace(/`/gu, " ");
      if (!target || !hasSimpleFastWorkTerm(protectedList)) return [];

      return collectSimpleFastWorkTerms(
        terminalRecognitionWorkText.slice(target.index),
      ).map((match) => {
        const start = bodyOffset + target.index + match.start;
        const end = bodyOffset + target.index + match.end;
        return {
          ...match,
          start,
          end,
          matchedText: text.slice(start, end),
        };
      });
    }
  }

  const hasOverlappingCode = codeRanges.some((range) => (
    range.start < listEnd && range.end > listStart
  ));
  if (!hasOverlappingCode) return null;

  const visibleListScan = maskRanges(codeScanText, codeRanges).slice(listStart, listEnd);
  if (!hasSimpleFastWorkTerm(visibleListScan)) return [];

  const listCodeRanges = codeRanges.filter((range) => (
    range.start >= listStart && range.end <= listEnd
  ));
  if (listCodeRanges.length === 0) return [];
  let recognitionWorkText = terminalRecognitionWorkText;
  for (const range of [...listCodeRanges].sort((left, right) => right.start - left.start)) {
    const localStart = range.start - bodyOffset;
    const localEnd = range.end - bodyOffset;
    const replacementLength = localEnd - localStart;
    if (replacementLength < 2) return [];
    recognitionWorkText = `${recognitionWorkText.slice(0, localStart)}dc${" ".repeat(
      replacementLength - 2,
    )}${recognitionWorkText.slice(localEnd)}`;
  }
  const recognitionMatches = collectPlainWorkMatches(recognitionWorkText);
  if (!recognitionMatches) return [];

  const localTargetStart = target?.index ?? workText.length;
  const localLastCodeEnd = Math.max(...listCodeRanges.map((range) => range.end)) - bodyOffset;
  const visibleListMatches = recognitionMatches.filter((match) => (
    match.start >= localLastCodeEnd && match.start < localTargetStart
  ));
  const selectedMatches = [
    ...(visibleListMatches.length === 1 ? visibleListMatches : []),
    ...recognitionMatches.filter((match) => match.start >= localTargetStart),
  ];
  return selectedMatches.map((match) => {
    const start = bodyOffset + match.start;
    const end = bodyOffset + match.end;
    return {
      ...match,
      start,
      end,
      matchedText: text.slice(start, end),
    };
  });
}

function collectPlainWorkMatches(text) {
  const normalizedSpacing = text.replace(/\p{Zs}/gu, " ");
  if (normalizedSpacing !== text) {
    const normalizedMatches = collectPlainWorkMatches(normalizedSpacing);
    if (normalizedMatches === null) return null;
    return normalizedMatches.map((match) => ({
      ...match,
      matchedText: text.slice(match.start, match.end),
    }));
  }
  const simpleMarkupMatches = collectSimpleMarkupWorkMatches(text);
  if (simpleMarkupMatches !== null) return simpleMarkupMatches;
  if (SIMPLE_FAST_PARENTHESIZED_WORK_LINE.test(text)) {
    const simpleTerms = collectSimpleFastWorkTerms(text);
    return simpleTerms.length >= 2 && simpleTerms.length <= 4 ? simpleTerms : null;
  }
  if (
    SIMPLE_FAST_WORK_CANDIDATE.test(text)
    && !SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text)
  ) {
    const linkedThenPlainCandidate = text.match(SIMPLE_FAST_WORK_LINKED_THEN_PLAIN_LIST_LINE);
    if (linkedThenPlainCandidate) {
      if (!isValidMarkdownLinkDestinationPayload(linkedThenPlainCandidate.groups.destination)) return [];
      const simpleTerms = collectSimpleFastWorkTerms(text);
      if (
        SIMPLE_FAST_ALONE_TARGET.test(text)
        && simpleTerms.some(({ matchedText }) => /[\t ]/u.test(matchedText))
      ) return [];
      return simpleTerms.length >= 2 && simpleTerms.length <= 8 ? simpleTerms : null;
    }
    const linkCandidate = text.match(SIMPLE_FAST_WORK_LINK_CANDIDATE_LINE);
    if (linkCandidate) {
      if (!isValidMarkdownLinkDestinationPayload(linkCandidate.groups.destination)) return [];
      const simpleTerms = collectSimpleFastWorkTerms(text);
      if (
        SIMPLE_FAST_ALONE_TARGET.test(text)
        && simpleTerms.some(({ matchedText }) => /[\t ]/u.test(matchedText))
      ) return [];
      return simpleTerms.length >= 1 && simpleTerms.length <= 8 ? simpleTerms : null;
    }
    if (SIMPLE_FAST_WORK_LINE.test(text)) {
      const simpleTerms = collectSimpleFastWorkTerms(text);
      if (
        SIMPLE_FAST_ALONE_TARGET.test(text)
        && simpleTerms.some(({ matchedText }) => /[\t ]/u.test(matchedText))
      ) return [];
      return simpleTerms.length >= 1 && simpleTerms.length <= 8 ? simpleTerms : null;
    }
  }
  if (!PLAIN_WORK_CANDIDATE.test(text)) return null;
  if (!SHARED_STITCH_LIST_COMPLETE_BOUNDED_LINE.test(text)) return null;
  const terms = collectSharedStitchListTerms(text, 0);
  if (
    terms.length < 1
    || terms.length > 4
    || terms.some((term) => isUnsupportedCompoundContext(text, term.start, term.end))
  ) return null;
  return terms;
}

function collectPlainWorkMatchesWithTerminalSemicolon(text) {
  const localMatches = collectPlainWorkMatches(text);
  if (localMatches !== null) return localMatches;
  const terminalPunctuationRun = text.match(/(?<first>[.!?])[.!?;]+(?<spacing>[\t\p{Zs}]*)$/u);
  if (terminalPunctuationRun) {
    const normalizedMatches = collectPlainWorkMatches(
      `${text.slice(0, terminalPunctuationRun.index)}${terminalPunctuationRun.groups.first}${terminalPunctuationRun.groups.spacing}`,
    );
    if (normalizedMatches !== null) return normalizedMatches;
  }
  const terminalSemicolon = text.match(/;[\t\p{Zs}]*$/u);
  if (!terminalSemicolon) return null;
  return collectPlainWorkMatches(
    `${text.slice(0, terminalSemicolon.index)}${text.slice(terminalSemicolon.index + 1)}`,
  );
}

function collectSimpleExplicitReferenceWorkMatches(text) {
  if (text.length > 2_048 || /[\r\n]/u.test(text) || !text.includes("][")) return null;
  const workPrefix = text.match(/^ {0,3}work[\t\p{Zs}]+/iu)?.[0];
  if (!workPrefix || text[workPrefix.length] !== "[") return null;
  const visibleLabel = scanMarkdownReferenceLabel(text, workPrefix.length);
  if (
    !visibleLabel?.valid
    || text[visibleLabel.end] !== "["
    || visibleLabel.contentEnd <= visibleLabel.contentStart
  ) return null;
  const referenceLabel = scanMarkdownReferenceLabel(text, visibleLabel.end);
  if (
    !referenceLabel?.valid
    || referenceLabel.contentEnd <= referenceLabel.contentStart
  ) return null;

  const visibleText = text.slice(visibleLabel.contentStart, visibleLabel.contentEnd);
  const normalizedVisibleText = visibleText.replace(/\p{Zs}/gu, " ");
  if (!SIMPLE_FAST_EXACT_WORK_LIST.test(normalizedVisibleText)) return null;

  const remainder = text.slice(referenceLabel.end);
  if (remainder && !/^[\t\p{Zs}.!?;]/u.test(remainder)) return null;
  const candidate = `${workPrefix}${visibleText}${remainder}`;
  if (
    isSimpleFastUnsupportedCompoundWorkDeny(candidate)
    || isSimpleFastMalformedSharedListWorkDeny(candidate)
  ) return [];
  const candidateMatches = collectPlainWorkMatchesWithTerminalSemicolon(candidate);
  if (candidateMatches === null) return null;
  if (candidateMatches.length === 0) return [];

  const candidateVisibleStart = workPrefix.length;
  const candidateVisibleEnd = candidateVisibleStart + visibleText.length;
  if (!candidateMatches.some((match) => (
    candidateVisibleStart <= match.start && match.end <= candidateVisibleEnd
  ))) return null;

  const restoredMatches = [];
  for (const match of candidateMatches) {
    let start;
    if (candidateVisibleStart <= match.start && match.end <= candidateVisibleEnd) {
      start = visibleLabel.contentStart + match.start - candidateVisibleStart;
    } else if (match.start >= candidateVisibleEnd) {
      start = referenceLabel.end + match.start - candidateVisibleEnd;
    } else {
      return null;
    }
    const end = start + (match.end - match.start);
    restoredMatches.push({
      ...match,
      start,
      end,
      matchedText: text.slice(start, end),
    });
  }
  return restoredMatches;
}

function collectSimpleInlineLinkWorkMatches(text) {
  if (text.length > 1_024 || /[\r\n]/u.test(text) || !text.includes("](")) return null;
  const workPrefix = text.match(/^ {0,3}work[\t\p{Zs}]+/iu)?.[0];
  if (!workPrefix || text[workPrefix.length] !== "[") return null;
  const visibleLabel = scanMarkdownReferenceLabel(text, workPrefix.length);
  if (
    !visibleLabel?.valid
    || text.slice(visibleLabel.end, visibleLabel.end + 1) !== "("
    || visibleLabel.contentEnd <= visibleLabel.contentStart
  ) return null;
  const destination = text.slice(visibleLabel.end).match(/^\((?<payload>[^()\r\n]{0,256})\)/u);
  const simpleDestinationClose = destination
    ? visibleLabel.end + destination[0].length - 1
    : -1;
  let destinationEnd;
  if (
    destination
    && !isSimpleEscapedCharacter(text, simpleDestinationClose)
    && isValidMarkdownLinkDestinationPayload(destination.groups.payload)
  ) {
    destinationEnd = visibleLabel.end + destination[0].length;
  } else {
    const destinationRange = collectBoundedInlineDestinationRanges(text).find(
      (range) => range.start === visibleLabel.end + 1,
    );
    if (!destinationRange) return destination ? [] : null;
    destinationEnd = destinationRange.end + 1;
  }

  const visibleText = text.slice(visibleLabel.contentStart, visibleLabel.contentEnd);
  const normalizedVisibleText = visibleText.replace(/\p{Zs}/gu, " ");
  if (!SIMPLE_FAST_EXACT_WORK_LIST.test(normalizedVisibleText)) return null;

  const remainder = text.slice(destinationEnd);
  if (remainder && !/^[\t\p{Zs}.!?;]/u.test(remainder)) return null;
  const candidate = `${workPrefix}${visibleText}${remainder}`;
  if (
    isSimpleFastUnsupportedCompoundWorkDeny(candidate)
    || isSimpleFastMalformedSharedListWorkDeny(candidate)
  ) return [];
  const candidateMatches = collectPlainWorkMatchesWithTerminalSemicolon(candidate);
  if (candidateMatches === null) return null;
  if (candidateMatches.length === 0) return [];

  const candidateVisibleStart = workPrefix.length;
  const candidateVisibleEnd = candidateVisibleStart + visibleText.length;
  if (!candidateMatches.some((match) => (
    candidateVisibleStart <= match.start && match.end <= candidateVisibleEnd
  ))) return null;

  const restoredMatches = [];
  for (const match of candidateMatches) {
    let start;
    if (candidateVisibleStart <= match.start && match.end <= candidateVisibleEnd) {
      start = visibleLabel.contentStart + match.start - candidateVisibleStart;
    } else if (match.start >= candidateVisibleEnd) {
      start = destinationEnd + match.start - candidateVisibleEnd;
    } else {
      return null;
    }
    const end = start + (match.end - match.start);
    restoredMatches.push({
      ...match,
      start,
      end,
      matchedText: text.slice(start, end),
    });
  }
  return restoredMatches;
}

function collectSimpleMarkupWorkMatches(text) {
  if (
    text.length > 512
    || !SIMPLE_FAST_WORK_CANDIDATE.test(text)
    || !/[\[\](){}]/u.test(text)
    || !SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(text)
  ) return null;
  const workPrefix = text.match(/^ {0,3}work[\t ]+/iu)?.[0];
  const target = text.match(SIMPLE_FAST_WORK_TARGET_TAIL);
  const terminal = target ? null : text.match(/[.!?]?[\t ]*$/u);
  const listEnd = target?.index ?? terminal?.index;
  if (!workPrefix || listEnd === undefined || listEnd <= workPrefix.length) return null;
  if (isSimpleFastUnsafeMarkupWorkDeny(text)) return [];
  if (isSimpleFastMalformedEmphasisWorkDeny(text)) return [];

  const listText = text.slice(workPrefix.length, listEnd).trim();
  const maskedList = maskSharedStitchListLinkDestinations(listText);
  const normalizedList = maskedList
    .replace(/\](?:\([\t ]*\)|\[[\t ]*\])/gu, "]")
    .replace(/[\[\](){}*_]/gu, "")
    .replace(/[\t ]+/gu, " ")
    .trim();
  if (!SIMPLE_FAST_NORMALIZED_SHARED_LIST.test(normalizedList)) return null;

  const normalizedTerms = collectSimpleFastWorkTerms(normalizedList);
  const listTerms = collectSimpleFastWorkTerms(listText);
  const terms = collectSimpleFastWorkTerms(text);
  if (
    normalizedTerms.length < 2
    || normalizedTerms.length > 8
    || listTerms.length !== normalizedTerms.length
  ) return null;
  if (
    SIMPLE_FAST_ALONE_TARGET.test(text)
    && terms.some(({ matchedText }) => /[\t ]/u.test(matchedText))
  ) return [];
  if (terms.some((term) => isUnsupportedCompoundContext(text, term.start, term.end))) return [];
  return terms;
}

function collectSimpleHeadingWorkMatches(text) {
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH || /[\r\n]/u.test(text)) return null;
  const prefix = text.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
  if (!prefix) return null;
  if (hasSimpleFastWorkPrefixOverflow(text)) {
    const overflowRange = findSimpleFastWorkPrefixOverflowRanges(text)
      .find((range) => range.start === 0);
    return overflowRange && text.slice(overflowRange.end).trim() !== "" ? null : [];
  }
  const candidate = text.slice(prefix.length);
  if (
    SIMPLE_FAST_WORK_BARE_LABEL_THEN_PLAIN_LIST_LINE.test(candidate)
    || isSimpleFastUnsafeLinkedListWorkDeny(candidate)
  ) return [];
  const neighboringMatches = collectSimpleNeighboringWorkMatches(candidate);
  if (neighboringMatches !== null) {
    return neighboringMatches.map((match) => ({
      ...match,
      start: prefix.length + match.start,
      end: prefix.length + match.end,
    }));
  }
  const localMatches = collectPlainWorkMatchesWithTerminalSemicolon(candidate);
  if (localMatches !== null) {
    return localMatches.map((match) => ({
      ...match,
      start: prefix.length + match.start,
      end: prefix.length + match.end,
    }));
  }
  if (
    isPlainAtomicMalformedIdentifierCommand(candidate)
    || isSimpleFastMalformedLinkedWorkDeny(candidate)
    || isSimpleFastUnsafeMarkupWorkDeny(candidate)
    || isSimpleFastMalformedEmphasisWorkDeny(candidate)
    || isSimpleFastContaminatedWorkDeny(candidate)
    || isSimpleFastMalformedWorkDeny(candidate)
  ) return [];
  return null;
}

function collectSimpleWorkWithUnmappedContinuationMatches(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return null;
  const continuationTail = text.match(SIMPLE_FAST_MARKED_UNMAPPED_CONTINUATION_TAIL);
  if (!continuationTail) return null;
  const command = text.slice(0, continuationTail.index).trimEnd();
  const commandMatches = collectPlainWorkMatches(command);
  return commandMatches?.length ? commandMatches : null;
}

function hasSimpleMalformedLinkPrefixCandidate(text) {
  for (let cursor = text.indexOf("]("); cursor !== -1; cursor = text.indexOf("](", cursor + 2)) {
    const destination = text.slice(cursor + 1).match(/^\((?<payload>[^()\r\n]{0,256})\)/u);
    if (destination) {
      if (!isValidMarkdownLinkDestinationPayload(destination.groups.payload)) return true;
      continue;
    }
    const closer = text.indexOf(")", cursor + 2);
    const nextOpener = text.indexOf("](", cursor + 2);
    if (closer === -1 || (nextOpener !== -1 && nextOpener < closer)) return true;
  }
  for (let cursor = text.indexOf("]["); cursor !== -1; cursor = text.indexOf("][", cursor + 2)) {
    const referenceLabel = scanMarkdownReferenceLabel(text, cursor + 1);
    if (!referenceLabel?.valid) return true;
  }
  return false;
}

function collectSimpleUnsafeMarkupPrefixNeighborMatches(text) {
  if (
    text.length > 1_024
    || /[\r\n]/u.test(text)
    || (!text.includes("](") && !text.includes("]["))
    || !hasSimpleMalformedLinkPrefixCandidate(text)
  ) return null;
  const boundaries = [...text.matchAll(/[.!?;][\t\p{Zs}]+(?=work[\t\p{Zs}]+)/giu)];
  if (boundaries.length < 1 || boundaries.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS) {
    return null;
  }
  for (const boundary of boundaries) {
    const deniedEnd = boundary.index + (boundary[0][0] === ";" ? 0 : 1);
    const validStart = boundary.index + boundary[0].length;
    const denied = text.slice(0, deniedEnd);
    if (!isSimpleFastUnsafeMarkupWorkDeny(denied)) continue;
    const valid = text.slice(validStart);
    let localMatches = collectSimpleInlineLinkWorkMatches(valid);
    if (localMatches === null) {
      localMatches = collectSimpleExplicitReferenceWorkMatches(valid);
    }
    if (localMatches === null) {
      localMatches = collectPlainWorkMatchesWithTerminalSemicolon(valid);
    }
    if (localMatches === null) {
      localMatches = collectSimpleNeighboringWorkMatches(valid);
    }
    if (!localMatches?.length) continue;
    return localMatches.map((match) => ({
      ...match,
      start: validStart + match.start,
      end: validStart + match.end,
    }));
  }
  return null;
}

function collectSimpleFastMalformedCommaThenWorkMatches(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return null;
  const separators = [...text.matchAll(/,[\t ]+then[\t ]+(?=work[\t ]+)/giu)];
  if (
    separators.length < 1
    || separators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS
  ) return null;
  const segments = [];
  let segmentStart = 0;
  for (const separator of separators) {
    segments.push({
      start: segmentStart,
      content: text.slice(segmentStart, separator.index),
    });
    segmentStart = separator.index + separator[0].length;
  }
  segments.push({ start: segmentStart, content: text.slice(segmentStart) });

  const matches = [];
  let sawMalformedSegment = false;
  for (const segment of segments) {
    const atomicIdentifierDeny = isPlainAtomicMalformedIdentifierCommand(segment.content);
    const malformedLinkedDeny = isSimpleFastMalformedLinkedWorkDeny(segment.content);
    const singleMalformedDeny = isSimpleFastMalformedWorkDeny(segment.content);
    if (atomicIdentifierDeny || malformedLinkedDeny || singleMalformedDeny) {
      if (
        matches.length > 0
        && (
          malformedLinkedDeny
          || singleMalformedDeny
        )
      ) return [];
      sawMalformedSegment = true;
      continue;
    }
    const localMatches = collectPlainWorkMatchesWithTerminalSemicolon(segment.content);
    if (!localMatches?.length) return null;
    matches.push(...localMatches.map((match) => ({
      ...match,
      start: segment.start + match.start,
      end: segment.start + match.end,
    })));
  }
  return sawMalformedSegment ? matches : null;
}

const SIMPLE_FAST_REVIEW_ONLY_SEGMENT = /^(?:miss[\t\p{Zs}]+(?:the[\t\p{Zs}]+)?(?:next|following|\p{N}+)[\t\p{Zs}]+st(?:s|itch(?:es)?)?|cast[\t\p{Zs}]+off(?:[\t\p{Zs}]+\p{N}+[\t\p{Zs}]+st(?:s|itch(?:es)?)?)?|work[\t\p{Zs}]+straight(?:[\t\p{Zs}]+for[\t\p{Zs}]+\p{N}+[\t\p{Zs}]+rows?)?|wool[\t\p{Zs}]+(?:over|forward|back|round[\t\p{Zs}]+needle)|wl\.?[\t\p{Zs}]*(?:fwd|bk)\.?|wf\.?|wb\.?|(?:needles?|hooks?)[\t\p{Zs}]+(?:(?:no\.?|size)[\t\p{Zs}]*)?\p{N}+|(?:no\.?|size)[\t\p{Zs}]*\p{N}+(?:[\t\p{Zs}]+(?:alumin(?:um|ium)|bamboo|bone|circular|crochet|double[-‐‑‒–—]?pointed|knitting|metal|plastic|single[-‐‑‒–—]?pointed|steel|straight|tunisian|wood(?:en)?)){0,3}[\t\p{Zs}]+(?:needles?|hooks?)|\p{N}+(?:\.\p{N}+)?[\t\p{Zs}]*oz(?:s|\.)?)[.!?;]*[\t\p{Zs}]*$/iu;
const SIMPLE_FAST_EXTENDED_REVIEW_ONLY_SEGMENT = /^(?:use[\t\p{Zs}]+)?(?:(?:crochet[\t\p{Zs}]+)?(?:needles?|hooks?)[\t\p{Zs}]+(?:(?:no\.?|size)[\t\p{Zs}]*)?\p{N}+|(?:no\.?|size)[\t\p{Zs}]*\p{N}+(?:[\t\p{Zs}]+(?:alumin(?:um|ium)|bamboo|bone|circular|crochet|double[-‐‑‒–—]?pointed|knitting|metal|plastic|single[-‐‑‒–—]?pointed|steel|straight|tunisian|wood(?:en)?)){0,3}[\t\p{Zs}]+(?:needles?|hooks?)|\p{N}+(?:\.\p{N}+)?[\t\p{Zs}]*oz(?:s|\.)?(?:[\t\p{Zs}]+(?:of[\t\p{Zs}]+)?(?:wool|yarn))?)[.!?;]*[\t\p{Zs}]*$/iu;

function isSimpleFastReviewOnlySegment(text) {
  return text.length <= 256
    && !/[\r\n`<>\[\]{}*_\\\p{Cf}]/u.test(text)
    && !hasSourceTermCandidate(text)
    && (
      SIMPLE_FAST_REVIEW_ONLY_SEGMENT.test(text.trim())
      || SIMPLE_FAST_EXTENDED_REVIEW_ONLY_SEGMENT.test(text.trim())
    );
}

const SIMPLE_FAST_TENSION_MEASUREMENT_UNIT_SOURCE = String.raw`(?:st(?:s|itch(?:es)?)?|rows?|double[\t\p{Zs}]+treble(?:[\t\p{Zs}]+crochet)?|dtr|half[\t\p{Zs}]+treble(?:[\t\p{Zs}]+crochet)?|htr|treble(?:[\t\p{Zs}]+crochet)?|tr|double[\t\p{Zs}]+crochet|dc)`;
const SIMPLE_FAST_TENSION_GAUGE_SEGMENT = new RegExp(
  String.raw`^(?:the[\t\p{Zs}]+)?tension(?:[\t\p{Zs}]+square(?:[\t\p{Zs}]+widget)?|[\t\p{Zs}]*(?:(?:is|of)[\t\p{Zs}]+|(?:[:=：＝→⇒➜]|[-‐‑‒–—―−﹣－])[\t\p{Zs}]*)?\p{N}+(?:[.,]\p{N}+)?[\t\p{Zs}]*(?<unit>${SIMPLE_FAST_TENSION_MEASUREMENT_UNIT_SOURCE}))[.!?;]*[\t\p{Zs}]*$`,
  "iu",
);
const SIMPLE_FAST_TENSION_META_REVIEW_SEGMENT = /^tension[\t\p{Zs}]+square[\t\p{Zs}]+as[\t\p{Zs}]+(?:a[\t\p{Zs}]+|the[\t\p{Zs}]+)?(?:example|label|phrase|term|wording)[.!?;]*[\t\p{Zs}]*$/iu;

function isSimpleFastTensionMetaReviewSegment(text) {
  return text.length <= 256
    && !/[\r\n`<>\[\]{}*_\\\p{Cf}]/u.test(text)
    && SIMPLE_FAST_TENSION_META_REVIEW_SEGMENT.test(text.trim());
}

function collectSimpleTensionGaugeSegmentMatches(text) {
  if (
    text.length > 256
    || /[\r\n`<>\[\]{}*_\\\p{Cf}]/u.test(text)
  ) return null;
  const gaugeMatch = text.match(SIMPLE_FAST_TENSION_GAUGE_SEGMENT);
  if (!gaugeMatch) return null;
  const prefix = text.match(/^[\t\p{Zs}]*(?:the[\t\p{Zs}]+)?/iu)?.[0] ?? "";
  const start = prefix.length;
  const end = start + "tension".length;
  if (!isTensionGaugeContext(text, start, end)) return null;
  const matches = [{
    start,
    end,
    matchedText: text.slice(start, end),
    entry: TENSION_TERM_ENTRY,
  }];
  const unit = gaugeMatch.groups.unit;
  if (unit) {
    const normalizedUnit = unit
      .toLocaleLowerCase("en-US")
      .replace(/[\t\p{Zs}]+/gu, " ");
    const entry = SOURCE_STITCH_TERM_ENTRY_BY_TERM.get(normalizedUnit);
    if (entry) {
      const unitStart = text.lastIndexOf(unit);
      matches.push({
        start: unitStart,
        end: unitStart + unit.length,
        matchedText: unit,
        entry,
      });
    }
  }
  return matches;
}

function scanSimpleNeighboringWorkSeparators(text) {
  const inlineDestinationRanges = text.includes("](")
    ? collectBoundedInlineDestinationRanges(text)
    : [];
  let separatorScanText = inlineDestinationRanges.length > 0
    ? maskRanges(text, inlineDestinationRanges)
    : text;
  if (separatorScanText.includes("][")) {
    separatorScanText = maskSimpleReferenceLabelContents(separatorScanText);
  }
  let codeRanges = [];
  if (separatorScanText.includes("`")) {
    codeRanges = findMarkdownCodeRanges(separatorScanText);
    separatorScanText = maskRanges(separatorScanText, codeRanges);
  }
  const rawClauseSeparators = [...separatorScanText.matchAll(/[.!?;][\t ]+/gu)];
  const clauseSeparators = rawClauseSeparators.filter((candidate, index) => {
    if (
      candidate[0][0] !== "."
      || !/\bno$/iu.test(separatorScanText.slice(Math.max(0, candidate.index - 2), candidate.index))
    ) return true;
    const preceding = rawClauseSeparators[index - 1];
    const following = rawClauseSeparators[index + 1];
    const clauseStart = preceding ? preceding.index + preceding[0].length : 0;
    const clauseEnd = following ? following.index + 1 : separatorScanText.length;
    return !isSimpleFastReviewOnlySegment(separatorScanText.slice(clauseStart, clauseEnd));
  });
  const commaThenSeparators = codeRanges.length > 0
    ? [...separatorScanText.matchAll(/,[\t ]+then[\t ]+(?=work[\t ]+)/giu)]
    : [];
  if (commaThenSeparators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS) {
    return {
      clauseSeparators,
      codeRanges,
      hasBareTerminalSemicolon: /;$/u.test(text),
      overflow: true,
      removedTerminalSeparator: false,
      separators: [],
    };
  }
  const potentialSeparators = [...clauseSeparators, ...commaThenSeparators]
    .sort((left, right) => left.index - right.index);
  const localCommaThenSeparators = commaThenSeparators.filter((candidate) => {
    const candidateIndex = potentialSeparators.indexOf(candidate);
    const preceding = potentialSeparators[candidateIndex - 1];
    const following = potentialSeparators[candidateIndex + 1];
    const leftStart = preceding ? preceding.index + preceding[0].length : 0;
    const rightEnd = following ? following.index : text.length;
    const rightStart = candidate.index + candidate[0].length;
    return codeRanges.some((range) => (
      (range.start < candidate.index && range.end > leftStart)
      || (range.start < rightEnd && range.end > rightStart)
    ));
  });
  const separators = [...clauseSeparators, ...localCommaThenSeparators]
    .sort((left, right) => left.index - right.index);
  const terminalSeparator = separators.at(-1);
  let removedTerminalSeparator = false;
  if (
    terminalSeparator
    && /^[.!?;]/u.test(terminalSeparator[0])
    && terminalSeparator.index + terminalSeparator[0].length === text.length
  ) {
    separators.pop();
    removedTerminalSeparator = true;
  }
  return {
    clauseSeparators,
    codeRanges,
    hasBareTerminalSemicolon: /;$/u.test(text),
    overflow: separators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS
      && codeRanges.length > 0,
    removedTerminalSeparator,
    separators,
  };
}

function collectSimpleNeighboringWorkMatches(text) {
  const normalizedSpacing = text.replace(/\p{Zs}/gu, " ");
  if (normalizedSpacing !== text) {
    const normalizedMatches = collectSimpleNeighboringWorkMatches(normalizedSpacing);
    if (normalizedMatches === null) return null;
    return normalizedMatches.map((match) => ({
      ...match,
      matchedText: text.slice(match.start, match.end),
    }));
  }
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH || /[\r\n]/u.test(text)) return null;
  const headingPrefix = text.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
  if (headingPrefix && !hasSimpleFastWorkPrefixOverflow(text)) {
    const headingBodyMatches = collectSimpleNeighboringWorkMatches(
      text.slice(headingPrefix.length),
    );
    if (headingBodyMatches !== null) {
      return headingBodyMatches.map((match) => ({
        ...match,
        start: headingPrefix.length + match.start,
        end: headingPrefix.length + match.end,
      }));
    }
  }
  const unsafeMarkupPrefixNeighborMatches = collectSimpleUnsafeMarkupPrefixNeighborMatches(text);
  if (unsafeMarkupPrefixNeighborMatches !== null) return unsafeMarkupPrefixNeighborMatches;
  const separatorScan = scanSimpleNeighboringWorkSeparators(text);
  if (separatorScan.overflow) return [];
  const {
    clauseSeparators,
    codeRanges,
    hasBareTerminalSemicolon,
    removedTerminalSeparator,
    separators,
  } = separatorScan;
  if (
    codeRanges.length === 0
    && clauseSeparators.length === 0
  ) {
    const malformedCommaThenMatches = collectSimpleFastMalformedCommaThenWorkMatches(text);
    if (malformedCommaThenMatches !== null) return malformedCommaThenMatches;
  }
  if (
    (separators.length < 1 && !removedTerminalSeparator && !hasBareTerminalSemicolon)
    || separators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS
  ) return null;
  const matches = [];
  let sawRecognizedDeniedSegment = false;
  let segmentStart = 0;
  for (let index = 0; index <= separators.length; index += 1) {
    const separator = separators[index];
    const segmentEnd = separator
      ? separator.index + (/^[;,]/u.test(separator[0]) ? 0 : 1)
      : text.length;
    const segment = text.slice(segmentStart, segmentEnd);
    let localMatches = collectSimpleWholeInlineCodeWorkMatches(segment);
    if (localMatches === null) {
      localMatches = collectSimpleUnsafeMarkupPrefixNeighborMatches(segment);
    }
    if (localMatches === null) {
      localMatches = collectSimpleInlineLinkWorkMatches(segment);
    }
    if (localMatches === null) {
      localMatches = collectSimpleExplicitReferenceWorkMatches(segment);
    }
    if (localMatches === null) {
      localMatches = collectSimpleHeadingWorkMatches(segment);
    }
    if (localMatches === null) {
      localMatches = collectSimpleTensionGaugeSegmentMatches(segment);
    }
    if (localMatches === null && isSimpleFastUnsafeMarkupWorkDeny(segment)) {
      localMatches = [];
    }
    if (localMatches === null && isSimpleFastUnsupportedCompoundWorkDeny(segment)) {
      localMatches = [];
    }
    const segmentHasOpaqueMarkdownCode = codeRanges.some((range) => (
      range.start < segmentEnd && range.end > segmentStart
    ));
    if (
      localMatches === null
      && !segmentHasOpaqueMarkdownCode
    ) {
      localMatches = collectSimpleFastMalformedCommaThenWorkMatches(segment);
    }
    if (
      localMatches === null
      && !segmentHasOpaqueMarkdownCode
      && /,[\t ]+then[\t ]+work\b/iu.test(segment)
    ) {
      localMatches = collectSimpleSegmentedWorkMatches(segment);
    }
    if (localMatches === null) {
      localMatches = collectPlainWorkMatchesWithTerminalSemicolon(segment);
    }
    if (
      localMatches === null
      && SIMPLE_FAST_EMBEDDED_CONTAMINATION_CLAUSE.test(segment)
    ) {
      localMatches = [];
    }
    if (localMatches?.length) {
      matches.push(...localMatches.map((match) => ({
        ...match,
        start: segmentStart + match.start,
        end: segmentStart + match.end,
      })));
    } else if (localMatches !== null) {
      sawRecognizedDeniedSegment = true;
    } else if (
      isSimpleFastReviewOnlySegment(segment)
      || isSimpleFastTensionMetaReviewSegment(segment)
    ) {
      sawRecognizedDeniedSegment = true;
    } else if (
      isSimpleFastOverlongNumberedItemDeny(segment)
      || SIMPLE_FAST_ARBITRARY_TAIL_WORK_LINE.test(segment)
      || isPlainAtomicMalformedIdentifierCommand(segment)
      || isSimpleFastMalformedLinkedWorkDeny(segment)
      || isSimpleFastUnsafeMarkupWorkDeny(segment)
      || isSimpleFastUnsafeLinkedListWorkDeny(segment)
      || isSimpleFastMalformedEmphasisWorkDeny(segment)
      || isSimpleFastContaminatedWorkDeny(segment)
      || isSimpleFastMalformedWorkDeny(segment)
    ) {
      sawRecognizedDeniedSegment = true;
    } else {
      return null;
    }
    if (separator) segmentStart = separator.index + separator[0].length;
  }
  if (matches.length > MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE) return null;
  return matches.length > 0 || sawRecognizedDeniedSegment ? matches : null;
}

function isSimpleFastDefinitionHeadingWorkDeny(text) {
  if (/\r?\n/u.test(text)) return false;
  const normalizedSpacing = text.replace(/\p{Zs}/gu, " ");
  const header = normalizedSpacing.match(UNSUPPORTED_DEFINITION_INLINE_HEADER)?.[0];
  return Boolean(
    header
    && /^work[\t ]+/iu.test(normalizedSpacing.slice(header.length)),
  );
}

function collectSimpleMarkedWorkMatches(text) {
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH || /[\r\n]/u.test(text)) return null;
  const structuralPrefix = text.match(SIMPLE_FAST_MARKED_ITEM_START)?.[0];
  const attachedNumberedPrefix = text.match(
    SIMPLE_FAST_ATTACHED_NUMBERED_PERIOD_WORK_START,
  )?.[0];
  const prefix = (attachedNumberedPrefix?.length ?? 0) > (structuralPrefix?.length ?? 0)
    ? attachedNumberedPrefix
    : structuralPrefix;
  if (!prefix) return null;
  if (hasSimpleFastWorkPrefixOverflow(text)) return null;
  const body = text.slice(prefix.length);
  if (isSimpleFastContaminatedWorkDeny(body)) return [];
  if (isSimpleFastUnsupportedCompoundWorkDeny(body)) return [];
  const continuationMatches = collectSimpleWorkWithUnmappedContinuationMatches(body);
  if (continuationMatches) {
    return continuationMatches.map((match) => ({
      ...match,
      start: prefix.length + match.start,
      end: prefix.length + match.end,
    }));
  }
  const neighboringMatches = collectSimpleNeighboringWorkMatches(body);
  if (neighboringMatches !== null) {
    return neighboringMatches.map((match) => ({
      ...match,
      start: prefix.length + match.start,
      end: prefix.length + match.end,
    }));
  }
  const headingMatches = collectSimpleHeadingWorkMatches(body);
  if (headingMatches !== null) {
    return headingMatches.map((match) => ({
      ...match,
      start: prefix.length + match.start,
      end: prefix.length + match.end,
    }));
  }
  if (hasSimpleFastSegmentSeparator(body)) {
    const segmentedMatches = collectSimpleSegmentedWorkMatches(text);
    if (segmentedMatches !== null) return segmentedMatches;
  }
  const localMatches = collectPlainWorkMatches(body);
  if (!localMatches || localMatches.length === 0) return null;
  return localMatches.map((match) => ({
    ...match,
    start: prefix.length + match.start,
    end: prefix.length + match.end,
  }));
}

const SIMPLE_FAST_SLASH_THEN_WORK_NOTE_BODY = new RegExp(
  String.raw`^(?:${SIMPLE_FAST_WORK_TERM_SOURCE})[\t ]*\/[\t ]*(?:${SIMPLE_FAST_WORK_TERM_SOURCE})[\t ]*;[\t ]+work[\t ]+(?:${SIMPLE_FAST_WORK_TERM_SOURCE})[.!?][\t ]+see[\t ]+note\.txt[.!?]?[\t ]*$`,
  "iu",
);

function collectSimpleSlashThenWorkNoteMatches(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return null;
  const heading = text.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
  if (!heading) return null;
  const body = text.slice(heading.length);
  if (!SIMPLE_FAST_SLASH_THEN_WORK_NOTE_BODY.test(body)) return null;
  const terms = collectSimpleFastWorkTerms(body);
  if (terms.length !== 3) return null;
  return terms.map((match) => ({
    ...match,
    start: heading.length + match.start,
    end: heading.length + match.end,
  }));
}

function collectSimpleUnsafeLinkedSuffixThenWorkMatches(text) {
  if (text.length > 1_024 || /[\r\n]/u.test(text)) return null;
  const boundary = text.indexOf(". ");
  if (boundary <= 0 || text.indexOf(". ", boundary + 2) !== -1) return null;
  const denied = text.slice(0, boundary + 1);
  const valid = text.slice(boundary + 2);
  if (
    !SIMPLE_FAST_WORK_CANDIDATE.test(denied)
    || !(
      SIMPLE_FAST_UNSAFE_INLINE_LINK_SUFFIX.test(denied)
      || SIMPLE_FAST_UNSAFE_REFERENCE_LINK_SUFFIX.test(denied)
    )
    || !SIMPLE_FAST_WORK_TARGET_TAIL.test(denied)
    || !SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(denied)
    || !hasAtLeastTwoSimpleFastWorkTerms(denied)
  ) return null;
  const localMatches = collectPlainWorkMatches(valid);
  if (!localMatches || localMatches.length === 0) return null;
  return localMatches.map((match) => ({
    ...match,
    start: boundary + 2 + match.start,
    end: boundary + 2 + match.end,
  }));
}

function collectSimpleSegmentedWorkMatches(text, failClosedOnSegmentOverflow = false) {
  if (
    text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH
    || (!/[.!?;,]\s/u.test(text) && !hasSimpleFastSegmentSeparator(text))
  ) return null;
  const segments = [];
  const lines = splitTextLines(text);
  const segmentScanLines = /[\[\]]/u.test(text)
    ? splitTextLines(maskSharedStitchListLinkDestinations(text))
    : lines;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const segmentScanContent = segmentScanLines[lineIndex]?.content ?? line.content;
    if (SINGLE_CODE_INDENTED_LINE.test(line.content)) return null;
    const boundaries = [];
    let boundarySegmentStart = 0;
    SIMPLE_FAST_SEGMENT_SEPARATOR.lastIndex = 0;
    let boundary;
    while ((boundary = SIMPLE_FAST_SEGMENT_SEPARATOR.exec(segmentScanContent)) !== null) {
      const separator = boundary[0];
      const prefixThroughPeriod = line.content.slice(boundarySegmentStart, boundary.index + 1);
      const prefixThroughSeparator = line.content.slice(
        boundarySegmentStart,
        boundary.index + separator.length,
      );
      const leadingNumberedMarker = separator[0] === "."
        && (
          SIMPLE_FAST_LEADING_NUMBERED_PERIOD.test(prefixThroughPeriod)
          || SIMPLE_FAST_LEADING_OVERLONG_NUMBERED_PERIOD.test(prefixThroughPeriod)
        );
      const leadingHeadingAbbreviationMarker = separator[0] === "."
        && SIMPLE_FAST_LEADING_HEADING_ABBREVIATION_PERIOD.test(prefixThroughPeriod);
      const headingDelimiterMatch = separator[0] === "."
        ? prefixThroughSeparator.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0]
        : undefined;
      const leadingHeadingDelimiter = headingDelimiterMatch?.length === prefixThroughSeparator.length;
      const punctuatedListItemBoundary = /^[.!?]/u.test(separator)
        && /^[\t ]*[,;]/u.test(line.content.slice(boundary.index + 1));
      const listDelimiterAfterPunctuation = separator[0] === ";"
        && /[.!?]/u.test(line.content[boundary.index - 1] ?? "")
        && SIMPLE_FAST_FLAT_TERM_PREFIX.test(
          line.content.slice(boundary.index + separator.length),
        );
      const glossaryTermListContinuation = separator[0] === ";"
        && SIMPLE_FAST_GLOSSARY_TERM_LIST_PREFIX.test(
          line.content.slice(boundarySegmentStart, boundary.index),
        )
        && SIMPLE_FAST_FLAT_TERM_PREFIX.test(
          line.content.slice(boundary.index + separator.length),
        );
      if (
        leadingNumberedMarker
        || leadingHeadingAbbreviationMarker
        || leadingHeadingDelimiter
        || punctuatedListItemBoundary
        || listDelimiterAfterPunctuation
        || glossaryTermListContinuation
      ) {
        continue;
      }
      boundaries.push({
        index: boundary.index,
        text: separator,
        kind: separator[0] === "," ? "commaThen" : "isolated",
      });
      boundarySegmentStart = boundary.index + separator.length;
      if (boundaries.length >= MAX_SIMPLE_FAST_SEGMENTS) {
        return failClosedOnSegmentOverflow ? [] : null;
      }
    }

    let localStart = 0;
    let separatorBefore = null;
    for (const item of boundaries) {
      const contentBeforeSeparator = line.content.slice(localStart, item.index);
      const workHeadingBeforeSeparator = contentBeforeSeparator.match(
        SIMPLE_FAST_WORK_HEADING_PREFIX,
      )?.[0];
      const structuralPrefixBeforeSeparator = workHeadingBeforeSeparator
        ?? contentBeforeSeparator.match(SIMPLE_FAST_SEGMENT_PREFIX)?.[0]
        ?? "";
      const terminalWorkBeforeSemicolon = item.text[0] === ";"
        && /^ {0,3}work[\t ]/iu.test(
          contentBeforeSeparator.slice(structuralPrefixBeforeSeparator.length),
        );
      const terminalMalformedListSemicolon = item.text[0] === ";"
        && /[.!?]/u.test(line.content[item.index - 1] ?? "")
        && !terminalWorkBeforeSemicolon;
      const duplicateTerminalBoundary = /^[.!?]/u.test(item.text)
        && line.content[item.index - 1] === item.text[0];
      const localEnd = item.index + (
        (/^[.!?]/u.test(item.text) && !duplicateTerminalBoundary)
          || terminalMalformedListSemicolon ? 1 : 0
      );
      segments.push({
        start: line.start + localStart,
        content: line.content.slice(localStart, localEnd),
        separatorBefore,
        lineStart: line.start,
      });
      localStart = item.index + item.text.length;
      separatorBefore = item.kind;
    }
    segments.push({
      start: line.start + localStart,
      content: line.content.slice(localStart),
      separatorBefore,
      lineStart: line.start,
    });
  }

  if (segments.length < 2) return null;
  const matches = [];
  let activeLineStart = -1;
  let activeLineMatchStart = 0;
  let isolatedGroupMatchStart = 0;
  let commaThenGroupDenied = false;
  let commaThenGroupHasRecognizedDeny = false;
  let sawDeniedCommaThenGroup = false;
  let sawRecognizedDeniedSegment = false;
  let commaThenGroupHasExplicitHeading = false;
  for (const segment of segments) {
    if (segment.lineStart !== activeLineStart) {
      if (
        activeLineStart !== -1
        && matches.length - activeLineMatchStart > MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE
      ) return failClosedOnSegmentOverflow ? [] : null;
      activeLineStart = segment.lineStart;
      activeLineMatchStart = matches.length;
      isolatedGroupMatchStart = matches.length;
      commaThenGroupDenied = false;
      commaThenGroupHasRecognizedDeny = false;
      commaThenGroupHasExplicitHeading = false;
    }
    const headingPrefix = segment.content.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
    if (segment.separatorBefore !== "commaThen") {
      isolatedGroupMatchStart = matches.length;
      commaThenGroupDenied = false;
      commaThenGroupHasRecognizedDeny = false;
      commaThenGroupHasExplicitHeading = Boolean(headingPrefix);
    }
    const deniedWholeSegment = SIMPLE_FAST_DECLARATIVE_GLOSSARY_LINE.test(segment.content)
      || SIMPLE_FAST_GLOSSARY_TERM_LIST_LINE.test(segment.content)
      || SIMPLE_FAST_NUMBERED_SHARED_LIST_ALONE.test(segment.content)
      || SIMPLE_FAST_NUMBERED_BARE_SHARED_LIST.test(segment.content)
      || isSimpleFastOverlongNumberedItemDeny(segment.content)
      || isSimpleFastPunctuatedFlatTermListDeny(segment.content);
    if (deniedWholeSegment) {
      sawRecognizedDeniedSegment = true;
      commaThenGroupHasRecognizedDeny = true;
      continue;
    }
    const prefix = headingPrefix
      ?? segment.content.match(SIMPLE_FAST_SEGMENT_PREFIX)?.[0]
      ?? "";
    const candidate = segment.content.slice(prefix.length).trimEnd();
    if (!candidate) continue;
    if (SIMPLE_FAST_UNMAPPED_CONTINUATION_COMMAND.test(candidate)) continue;
    if (!/^ {0,3}work[\t ]/iu.test(candidate)) {
      const standaloneTensionSquare = segment.separatorBefore !== "commaThen"
        ? candidate.match(/^ {0,3}(?<term>tension)[\t ]+square[.!?]?[\t ]*$/iu)
        : null;
      if (standaloneTensionSquare) {
        const matchedText = standaloneTensionSquare.groups.term;
        const localStart = candidate.indexOf(matchedText);
        matches.push({
          start: segment.start + prefix.length + localStart,
          end: segment.start + prefix.length + localStart + matchedText.length,
          matchedText,
          entry: TENSION_TERM_ENTRY,
        });
        continue;
      }
      if (
        SIMPLE_FAST_DECLARATIVE_GLOSSARY_LINE.test(candidate)
        || SIMPLE_FAST_GLOSSARY_TERM_LIST_LINE.test(candidate)
      ) {
        sawRecognizedDeniedSegment = true;
        continue;
      }
      return null;
    }
    const quickUnsafeLinkedListDeny = isSimpleFastUnsafeLinkedListWorkDeny(candidate);
    const localMatches = quickUnsafeLinkedListDeny ? null : collectPlainWorkMatches(candidate);
    if (localMatches) {
      if (!commaThenGroupDenied) {
        matches.push(...localMatches.map((match) => ({
          ...match,
          start: segment.start + prefix.length + match.start,
          end: segment.start + prefix.length + match.end,
        })));
      }
      continue;
    }
    const atomicListDeny = isPlainAtomicMalformedIdentifierCommand(candidate);
    const malformedLinkedDeny = isSimpleFastMalformedLinkedWorkDeny(candidate);
    const unsafeMarkupDeny = isSimpleFastUnsafeMarkupWorkDeny(candidate);
    const unsafeLinkedListDeny = quickUnsafeLinkedListDeny;
    const malformedEmphasisDeny = isSimpleFastMalformedEmphasisWorkDeny(candidate);
    const contaminatedWorkDeny = isSimpleFastContaminatedWorkDeny(candidate);
    const rollbackSegmentDeny = malformedLinkedDeny
      || unsafeMarkupDeny
      || unsafeLinkedListDeny
      || malformedEmphasisDeny
      || (contaminatedWorkDeny && !commaThenGroupHasExplicitHeading);
    const recognizedSegmentDeny = malformedLinkedDeny
      || unsafeMarkupDeny
      || unsafeLinkedListDeny
      || malformedEmphasisDeny
      || contaminatedWorkDeny;
    const singleMalformedDeny = isSimpleFastMalformedWorkDeny(candidate);
    if (
      commaThenGroupHasRecognizedDeny
      && (atomicListDeny || recognizedSegmentDeny || singleMalformedDeny)
    ) {
      continue;
    }
    if (
      matches.length > isolatedGroupMatchStart
      && (singleMalformedDeny || rollbackSegmentDeny)
      && segment.separatorBefore === "commaThen"
    ) {
      matches.splice(isolatedGroupMatchStart);
      commaThenGroupDenied = true;
      sawDeniedCommaThenGroup = true;
      continue;
    }
    if (
      commaThenGroupDenied
      && (atomicListDeny || recognizedSegmentDeny || singleMalformedDeny)
    ) {
      continue;
    }
    if (
      !atomicListDeny
      && !recognizedSegmentDeny
      && (!singleMalformedDeny || segment.separatorBefore === "commaThen")
    ) return null;
  }

  if (
    matches.length - activeLineMatchStart > MAX_SUPPORTED_SOURCE_TERMS_PER_PHYSICAL_LINE
  ) return failClosedOnSegmentOverflow ? [] : null;
  if (matches.length > 0) return matches;
  return sawDeniedCommaThenGroup || sawRecognizedDeniedSegment ? [] : null;
}

function collectSimpleBoundedAuthoritativeMatches(text) {
  if (
    text.length > 512
    || SIMPLE_BOUNDED_LINE_GLOBAL_ANALYSIS_SYNTAX.test(text)
    || SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text)
    || /(?:https?:\/\/|www\.|[\p{L}\p{N}]@[\p{L}\p{N}])/iu.test(text)
  ) return null;

  const headingPrefix = text.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
  const structuralPrefix = headingPrefix
    ?? text.match(SIMPLE_FAST_SEGMENT_PREFIX)?.[0]
    ?? "";
  const body = text.slice(structuralPrefix.length);
  if (!body || /[:=：＝→⇒➜,;/／]/u.test(body)) return null;
  const commandProseTail = SIMPLE_BOUNDED_COMMAND_PROSE_TAIL.test(body);
  if (SIMPLE_BOUNDED_LINE_DEFINITION_CONTEXT.test(text) && !commandProseTail) return null;

  PLAIN_ATOMIC_IDENTIFIER_TOKEN.lastIndex = 0;
  let token;
  while ((token = PLAIN_ATOMIC_IDENTIFIER_TOKEN.exec(body)) !== null) {
    const normalized = token[0].toLocaleLowerCase("en-US");
    if (
      !SOURCE_STITCH_TERM_ENTRY_BY_TERM.has(normalized)
      && PLAIN_ATOMIC_MALFORMED_ABBREVIATION.test(token[0])
    ) return null;
  }

  const bareLine = SIMPLE_BOUNDED_BARE_STITCH_LINE.test(body);
  const commandLine = SIMPLE_BOUNDED_SINGLE_TERM_COMMAND_START.test(body);
  if (!bareLine && !commandLine) return null;

  const localTerms = collectSharedStitchListTerms(text, 0);
  if (localTerms.length < 1 || localTerms.length > 8) return null;
  if (bareLine && SIMPLE_FAST_CONSTRUCTION_HEADING_PREFIX.test(text)) return null;
  const numberedBareItem = bareLine
    && !headingPrefix
    && SIMPLE_FAST_NUMBERED_ITEM_PREFIX.test(structuralPrefix);
  if (numberedBareItem) {
    const sharedList = SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(body);
    if (sharedList) {
      if (SIMPLE_FAST_ALONE_TARGET.test(body)) return [];
      if (!SIMPLE_FAST_BARE_SHARED_LIST_WITH_TARGET.test(body)) return [];
      if (localTerms.some((term) => isUnsupportedCompoundContext(text, term.start, term.end))) {
        return [];
      }
      return localTerms;
    }
    const primary = localTerms[0];
    if (
      (SIMPLE_FAST_ALONE_TARGET.test(body) && /[\t ]/u.test(primary.matchedText))
      || isUnsupportedCompoundContext(text, primary.start, primary.end)
    ) return [];
    return [primary];
  }
  if (commandLine && commandProseTail) return [];
  if (
    SIMPLE_FAST_ALONE_TARGET.test(body)
    && localTerms.some(({ matchedText }) => /[\t ]/u.test(matchedText))
  ) return [];

  if (/[()]/u.test(body)) {
    const pairs = [];
    for (const entry of UK_TO_US_TERMS) {
      for (const matcher of SOURCE_TERM_MATCHERS_BY_ENTRY.get(entry).parenthesized) {
        matcher.lastIndex = 0;
        let match;
        while ((match = matcher.exec(text)) !== null) {
          const prefixLength = match[1].length;
          const matchedText = match[2];
          const start = match.index + prefixLength;
          const end = start + matchedText.length;
          if (
            isRecognizableAbbreviationInstruction(text, start, end, matchedText, entry)
            && !isUnsupportedCompoundContext(text, start, end)
          ) pairs.push({ start, end, matchedText, entry });
        }
      }
    }
    if (
      pairs.length !== 1
      || !localTerms.every((term) => pairs[0].start <= term.start && pairs[0].end >= term.end)
    ) return null;
    return pairs;
  }

  if (commandLine && localTerms.length !== 1) return null;
  const matches = localTerms.filter((term) => (
    isRecognizableAbbreviationInstruction(
      text,
      term.start,
      term.end,
      term.matchedText,
      term.entry,
    )
    && (term.entry.label !== "Tension" || isTensionGaugeContext(text, term.start, term.end))
    && !isUnsupportedCompoundContext(text, term.start, term.end)
  ));
  matches.sort((left, right) => left.start - right.start || (right.end - right.start) - (left.end - left.start));
  const chosen = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start >= cursor) {
      chosen.push(match);
      cursor = match.end;
    }
  }
  return chosen;
}

const SIMPLE_FAST_DEFINITION_DOCUMENT_HEADER = /^(?:[\t ]{0,3})(?:abbreviations?|abbrev\.?|definitions?|glossar(?:y|ies)|keys?|terms?|(?:uk|british)[\t ]+(?:abbreviations?|abbrev\.?|terms?))[\t ]*[:=]?[\t ]*$/iu;
const SIMPLE_FAST_DEFINITION_DOCUMENT_RELEASE_HEADING = /^(?:[\t ]{0,3})(?:body|instructions?|directions?|pattern)[\t ]*:[\t ]*$/iu;
const SIMPLE_FAST_DEFINITION_STRUCTURAL_PREFIX = new RegExp(
  String.raw`^${DEFINITION_STRUCTURAL_PREFIX_SOURCE}`,
  "u",
);

function isSimpleDefinitionPostReleaseDeniedLine(content) {
  const foundationHeading = content.match(/^ {0,3}foundation[\t ]*:[\t ]*/iu)?.[0];
  const heading = content.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0] ?? foundationHeading;
  if (!heading) return false;
  const body = content.slice(heading.length);
  if (/^ {0,3}tension[.!?]?[\t ]*$/iu.test(body)) return true;

  const terms = collectSimpleFastWorkTerms(body);
  if (terms.length !== 1) return false;
  const term = terms[0];
  const before = body.slice(0, term.start);
  const after = body.slice(term.end);
  const exactTerm = before.trim() === "" && /^[.!?]?[\t ]*$/u.test(after);
  if (
    exactTerm
    && (foundationHeading || SIMPLE_FAST_CONSTRUCTION_HEADING_PREFIX.test(content))
  ) return true;
  if (
    before.trim() === ""
    && /^[\t ]+(?:widget|metadata|notes?|journal|records?|theory|labels?|examples?)[.!?]?[\t ]*$/iu.test(after)
  ) return true;
  return /^[\p{L}\p{M}\p{N}\p{Pc}\p{Cf}\-‐‑‒–—]+[.!?]?[\t ]*$/u.test(body)
    && isUnsupportedCompoundContext(body, term.start, term.end);
}

function collectSimpleDefinitionDocumentMatches(text) {
  if (text.length > 2_048) return null;
  const lines = splitTextLines(text);
  const syntaxText = lines.map((line) => line.content.replace(
    SIMPLE_FAST_DEFINITION_STRUCTURAL_PREFIX,
    (prefix) => " ".repeat(prefix.length),
  )).join("");
  if (SIMPLE_BOUNDED_LINE_GLOBAL_ANALYSIS_SYNTAX.test(syntaxText)) return null;
  if (lines.length < 3) return null;

  let definitionStartIndex = 1;
  if (!SIMPLE_FAST_DEFINITION_DOCUMENT_HEADER.test(lines[0].content)) {
    const headerlessDefinition = lines[0].content.match(HEADER_DELIMITERLESS_DEFINITION_ENTRY);
    const rawKey = headerlessDefinition?.groups.key.trim() ?? "";
    const rawValue = headerlessDefinition?.groups.value.trim() ?? "";
    if (
      !headerlessDefinition
      || !QUOTE_WRAPPED_DEFINITION_KEY.test(rawKey)
      || !SOURCE_STITCH_TERM_ENTRY_BY_TERM.has(normalizeDefinitionKey(rawKey))
      || !rawValue
      || !lines.slice(1).some((line) => (
        SIMPLE_FAST_DEFINITION_DOCUMENT_RELEASE_HEADING.test(line.content)
      ))
    ) return null;
    definitionStartIndex = 0;
  }

  const customDefinitionLabels = new Set();
  const matches = [];
  let instructionStarted = false;
  for (let index = definitionStartIndex; index < lines.length; index += 1) {
    const line = lines[index];
    if (!instructionStarted) {
      const explicitDefinition = line.content.match(EXPLICIT_SUPPORTED_DEFINITION_PREFIX);
      const delimiterlessDefinition = explicitDefinition
        ? null
        : line.content.match(HEADER_DELIMITERLESS_DEFINITION_ENTRY);
      const definition = explicitDefinition ?? delimiterlessDefinition;
      if (definition) {
        const rawKey = definition.groups.key;
        const rawValue = explicitDefinition
          ? line.content.slice(
            explicitDefinition[0].length - explicitDefinition.groups.valueStart.length,
          ).trim()
          : delimiterlessDefinition.groups.value.trim();
        const normalizedKey = normalizeDefinitionKey(rawKey);
        const entry = SOURCE_STITCH_TERM_ENTRY_BY_TERM.get(normalizedKey);
        if (!entry || !rawValue) return null;
        const normalizedValue = normalizeDefinitionValue(rawValue);
        const describesStandardEntry = entry.terms.some((candidate) => {
          const normalizedCandidate = candidate.toLocaleLowerCase("en-US");
          if (normalizedCandidate === normalizedValue) return true;
          const candidateSource = escapeRegex(normalizedCandidate);
          return new RegExp(
            `^(?:(?:uk|british)[\\t\\p{Zs}]+)?${candidateSource}(?:[\\t\\p{Zs}]+(?:stitch|term)|[\\t\\p{Zs}]*\\((?:uk|british)(?:[\\t\\p{Zs}]+term)?\\))$`,
            "iu",
          ).test(normalizedValue);
        });
        if (
          !(entry.label === "Tension" && isNumericTensionDefinitionValue(rawValue))
          && !describesStandardEntry
        ) {
          if (
            /^(?:uk|british)\b|\b(?:uk|british)(?:[\t ]+term)?$|\((?:uk|british)(?:[\t ]+term)?\)$/iu.test(normalizedValue)
          ) {
            return null;
          }
          customDefinitionLabels.add(entry.label);
        }
        continue;
      }
      if (SIMPLE_FAST_DEFINITION_DOCUMENT_RELEASE_HEADING.test(line.content)) {
        instructionStarted = true;
        continue;
      }
      instructionStarted = true;
    }

    const simpleHeading = line.content.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
    const simpleBody = simpleHeading ? line.content.slice(simpleHeading.length) : "";
    const simpleTerms = simpleHeading ? collectSimpleFastWorkTerms(simpleBody) : [];
    const simpleBareInstruction = simpleHeading
      ? simpleBody.match(SIMPLE_FAST_NUMBERED_BARE_ITEM_BODY)
      : null;
    const exactSingleTerm = simpleTerms.length === 1
      && !SIMPLE_FAST_CONSTRUCTION_HEADING_PREFIX.test(line.content)
      && simpleTerms[0].entry.label !== "Tension"
      && simpleBody.slice(0, simpleTerms[0].start).trim() === ""
      && /^[.!?]?[\t ]*$/u.test(simpleBody.slice(simpleTerms[0].end))
      && !isUnsupportedCompoundContext(
        simpleBody,
        simpleTerms[0].start,
        simpleTerms[0].end,
      );
    const exactTargetedInstruction = Boolean(simpleBareInstruction?.groups.target)
      && simpleTerms.length >= 1
      && simpleTerms.length <= 8
      && simpleTerms.every((term) => !isUnsupportedCompoundContext(
        simpleBody,
        term.start,
        term.end,
      ));
    const exactBareConnectorList = Boolean(simpleBareInstruction)
      && !simpleBareInstruction.groups.target
      && !SIMPLE_FAST_CONSTRUCTION_HEADING_PREFIX.test(line.content)
      && simpleTerms.length >= 2
      && simpleTerms.length <= 4
      && simpleBody.slice(0, simpleTerms[0].start).trim() === ""
      && /^[.!?]?[\t ]*$/u.test(simpleBody.slice(simpleTerms.at(-1).end))
      && simpleTerms.slice(1).every((term, termIndex) => (
        /^[\t ]+(?:and|or)[\t ]+$/iu.test(
          simpleBody.slice(simpleTerms[termIndex].end, term.start),
        )
      ));
    const deniedLine = !exactSingleTerm
      && !exactTargetedInstruction
      && !exactBareConnectorList
      && isSimpleDefinitionPostReleaseDeniedLine(line.content);
    let localMatches;
    if (exactSingleTerm || exactTargetedInstruction) {
      localMatches = simpleTerms;
    } else if (exactBareConnectorList) {
      localMatches = [simpleTerms.at(-1)];
    } else if (deniedLine) {
      localMatches = [];
    } else {
      localMatches = collectSimpleBoundedAuthoritativeMatches(line.content);
    }
    let matchOffset = 0;
    if (exactSingleTerm || exactTargetedInstruction || exactBareConnectorList) {
      matchOffset = simpleHeading.length;
    }
    if (localMatches === null) {
      const heading = line.content.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
      if (!heading) return null;
      const body = line.content.slice(heading.length);
      localMatches = collectPlainWorkMatches(body);
      if (localMatches === null) return null;
      matchOffset = heading.length;
    }
    matches.push(...localMatches
      .filter((match) => !customDefinitionLabels.has(match.entry.label))
      .map((match) => ({
        ...match,
        start: line.start + matchOffset + match.start,
        end: line.start + matchOffset + match.end,
      })));
  }
  return instructionStarted ? matches : null;
}

function isSimpleWholeLinePath(content) {
  const contentEnd = content.trimEnd().length;
  return findWholeLinePathRanges(content).some((range) => (
    content.slice(0, range.start).trim() === "" && range.end === contentEnd
  ));
}

function collectSimpleDocumentMatches(text) {
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH) return null;
  const lines = splitTextLines(text);
  if (
    lines.length === 1
    && (
      SIMPLE_FAST_STRONG_SOURCE_LINE.test(lines[0].content)
      || isSimpleWholeLinePath(lines[0].content)
      || SIMPLE_FAST_WHOLE_RAW_TEXT_LINE.test(lines[0].content)
    )
  ) return [];
  if (lines.length < 2 || lines.length > MAX_SIMPLE_FAST_SEGMENTS) return null;

  let sawProtectedSourceLine = false;
  const matches = [];
  for (const line of lines) {
    if (line.content.trim() === "") continue;
    if (
      SIMPLE_FAST_STRONG_SOURCE_LINE.test(line.content)
      || isSimpleWholeLinePath(line.content)
      || SIMPLE_FAST_WHOLE_RAW_TEXT_LINE.test(line.content)
    ) {
      sawProtectedSourceLine = true;
      continue;
    }

    let localMatches = collectPlainWorkMatches(line.content);
    if (localMatches === null) {
      localMatches = collectSimpleHeadingWorkMatches(line.content);
    }
    if (localMatches === null) {
      const heading = line.content.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
      if (!heading) return null;
      const body = line.content.slice(heading.length);
      const simpleTerms = collectSimpleFastWorkTerms(body);
      const exactSingleTerm = simpleTerms.length === 1
        && !SIMPLE_FAST_CONSTRUCTION_HEADING_PREFIX.test(line.content)
        && body.slice(0, simpleTerms[0].start).trim() === ""
        && /^[.!?]?[\t ]*$/u.test(body.slice(simpleTerms[0].end))
        && !isUnsupportedCompoundContext(body, simpleTerms[0].start, simpleTerms[0].end);
      if (!exactSingleTerm) return null;
      localMatches = simpleTerms.map((match) => ({
        ...match,
        start: heading.length + match.start,
        end: heading.length + match.end,
      }));
    }
    matches.push(...localMatches.map((match) => ({
      ...match,
      start: line.start + match.start,
      end: line.start + match.end,
    })));
  }
  return sawProtectedSourceLine ? matches : null;
}

function hasSimpleUnknownCrochetInstructionCandidate(text) {
  if (
    text.length > 2_048
    || /[|`<>\[\]{}*_\\\p{Cf}]/u.test(text)
    || /(?:^|\n)[\t ]{0,3}(?:abbreviations?|abbrev\.?|definitions?|glossar(?:y|ies)|keys?|special[\t ]+stitches?)[\t ]*[:=]?/iu.test(text)
  ) return false;

  for (const line of splitTextLines(text)) {
    const heading = line.content.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
    if (!heading) continue;
    const body = line.content.slice(heading.length);
    const clauses = body.split(";");
    if (clauses.length > 8) continue;
    let found = false;
    let complete = true;
    for (const clause of clauses) {
      const candidate = clause.trim();
      if (!candidate || !SIMPLE_BOUNDED_BARE_STITCH_LINE.test(candidate)) {
        complete = false;
        break;
      }
      if (collectSharedStitchListTerms(candidate, 0).length > 0) found = true;
    }
    if (complete && found) return true;
  }
  return false;
}

function isPlainAtomicMalformedIdentifierCommand(text) {
  if (
    text.length > 512
    || !PLAIN_ATOMIC_WRAPPED_IDENTIFIER_CANDIDATE.test(text)
    || PLAIN_ATOMIC_FOLLOWING_COMMAND.test(text)
    || !SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(text)
  ) return false;
  SHARED_STITCH_LIST_WRAPPED_MALFORMED_IDENTIFIER_FINDER.lastIndex = 0;
  const match = SHARED_STITCH_LIST_WRAPPED_MALFORMED_IDENTIFIER_FINDER.exec(text);
  SHARED_STITCH_LIST_WRAPPED_MALFORMED_IDENTIFIER_FINDER.lastIndex = 0;
  if (match) return true;

  PLAIN_ATOMIC_IDENTIFIER_TOKEN.lastIndex = 0;
  let token;
  while ((token = PLAIN_ATOMIC_IDENTIFIER_TOKEN.exec(text)) !== null) {
    const normalized = token[0].toLocaleLowerCase("en-US");
    if (
      !/^_|_$/u.test(token[0])
      && !SOURCE_STITCH_TERM_ENTRY_BY_TERM.has(normalized)
      && PLAIN_ATOMIC_MALFORMED_ABBREVIATION.test(token[0])
    ) return true;
  }
  return false;
}

function isSimpleFastMalformedWorkDeny(text) {
  const match = text.match(SIMPLE_FAST_MALFORMED_WRAPPED_WORK_LINE)
    ?? text.match(SIMPLE_FAST_MALFORMED_PLAIN_WORK_LINE);
  if (!match) return false;
  const identifier = match.groups.identifier;
  const normalized = identifier.toLocaleLowerCase("en-US");
  return !SOURCE_STITCH_TERM_ENTRY_BY_TERM.has(normalized)
    && PLAIN_ATOMIC_MALFORMED_ABBREVIATION.test(identifier);
}

function isSimpleFastMalformedLinkedWorkDeny(text) {
  if (text.length > 512) return false;
  const match = text.match(SIMPLE_FAST_MALFORMED_LINKED_WORK_LINE);
  if (!match) return false;
  if (!isValidMarkdownLinkDestinationPayload(match.groups.destination)) return false;
  const identifier = match.groups.identifier;
  const normalized = identifier.toLocaleLowerCase("en-US");
  return !SOURCE_STITCH_TERM_ENTRY_BY_TERM.has(normalized)
    && PLAIN_ATOMIC_MALFORMED_ABBREVIATION.test(identifier);
}

function isSimpleFastUnsafeLinkedListWorkDeny(text) {
  if (
    text.length > 512
    || !SIMPLE_FAST_WORK_CANDIDATE.test(text)
    || SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text)
    || !SIMPLE_FAST_WORK_TARGET_TAIL.test(text)
    || !SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(text)
  ) return false;
  const hasUnsafeSuffix = SIMPLE_FAST_UNSAFE_INLINE_LINK_SUFFIX.test(text)
    || SIMPLE_FAST_UNSAFE_REFERENCE_LINK_SUFFIX.test(text);
  let hasUnbalancedStructure = false;
  if (!hasUnsafeSuffix) {
    const maskedLinks = maskSharedStitchListLinkDestinations(text);
    hasUnbalancedStructure = maskedLinks !== text
      && !hasBalancedStructuralDelimiters(maskedLinks, 0, maskedLinks.length, []);
  }
  if (!hasUnsafeSuffix && !hasUnbalancedStructure) return false;
  return hasAtLeastTwoSimpleFastWorkTerms(text);
}

function isSimpleFastUnsafeMarkupWorkDeny(text) {
  if (
    text.length > 512
    || !SIMPLE_FAST_WORK_CANDIDATE.test(text)
    || SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text)
    || !/[\[\]()*_{}]/u.test(text)
  ) return false;
  const inlineDestinationStart = text.indexOf("](");
  if (
    inlineDestinationStart !== -1
    && text.indexOf(")", inlineDestinationStart + 2) === -1
  ) return true;
  const referenceLabelStart = text.indexOf("][");
  if (
    referenceLabelStart !== -1
    && text.indexOf("]", referenceLabelStart + 2) === -1
  ) return true;
  if (
    !SIMPLE_FAST_WORK_TARGET_TAIL.test(
      text.replace(/([.!?])[.!?;]+([\t ]*)$/u, "$1$2"),
    )
    || !SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(text)
  ) return false;
  if (SIMPLE_FAST_WORK_BARE_LABEL_THEN_PLAIN_LIST_LINE.test(text)) return true;
  const terms = collectSimpleFastWorkTerms(text);
  if (terms.length < 1 || terms.length > 8) return false;
  const markdownSyntax = scanMarkdownLinkSyntax(text);
  if (markdownSyntax.malformedLineRanges.length > 0) return true;
  const referenceLabels = collectValidMarkdownReferenceLabels(text);
  return findUnsafeMarkupBoundaryRanges(
    text,
    markdownSyntax.inlineLinks,
    referenceLabels,
  ).length > 0;
}

function getSimpleFastLongestWorkPrefix(text) {
  const prefixes = [
    text.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0],
    text.match(SIMPLE_FAST_MARKED_ITEM_START)?.[0],
    text.match(SIMPLE_FAST_ATTACHED_NUMBERED_PERIOD_WORK_START)?.[0],
  ].filter(Boolean);
  return prefixes.sort((left, right) => right.length - left.length)[0] ?? null;
}

function getSimpleFastWorkBody(text) {
  let workText = text.replace(/\p{Zs}/gu, " ");
  for (let index = 0; index < MAX_SIMPLE_FAST_STRUCTURAL_PREFIXES; index += 1) {
    const prefix = getSimpleFastLongestWorkPrefix(workText);
    if (!prefix) break;
    workText = workText.slice(prefix.length);
  }
  return workText;
}

function hasSimpleFastWorkPrefixOverflow(text) {
  let workText = text.replace(/\p{Zs}/gu, " ");
  for (let index = 0; index < MAX_SIMPLE_FAST_STRUCTURAL_PREFIXES; index += 1) {
    const prefix = getSimpleFastLongestWorkPrefix(workText);
    if (!prefix) return false;
    workText = workText.slice(prefix.length);
  }
  return getSimpleFastLongestWorkPrefix(workText) !== null;
}

function getSimpleFastWorkPrefixChainLength(text) {
  let workText = text.replace(/\p{Zs}/gu, " ");
  let prefixLength = 0;
  while (workText.length > 0) {
    const prefix = getSimpleFastLongestWorkPrefix(workText);
    if (!prefix) break;
    prefixLength += prefix.length;
    workText = workText.slice(prefix.length);
  }
  return prefixLength;
}

function isSimpleFastLinkedWorkDeny(text) {
  if (text.length > 2_048 || /[\r\n]/u.test(text)) return false;
  const workText = getSimpleFastWorkBody(text);
  if (
    SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(workText)
    || (!workText.includes("](") && !workText.includes("]["))
  ) return false;
  if (scanMarkdownLinkSyntax(workText).malformedLineRanges.length > 0) return false;
  const visibleWorkText = maskSharedStitchListLinkDestinations(workText)
    .replace(/[\[\](){}*_]/gu, " ");
  return isSimpleFastMalformedSharedListWorkDeny(visibleWorkText);
}

function isSimpleFastMalformedSharedListWorkDeny(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return false;
  const workText = getSimpleFastWorkBody(text);
  if (
    !SIMPLE_FAST_WORK_CANDIDATE.test(workText)
    || SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(workText)
    || !SIMPLE_FAST_WORK_TARGET_TAIL.test(workText)
    || !SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(workText)
  ) return false;
  const scanText = (workText.includes("](") || workText.includes("]["))
    ? maskSharedStitchListLinkDestinations(workText)
    : workText;
  if (!SIMPLE_FAST_MALFORMED_WORK_ITEM_SIGNAL.test(scanText)) return false;
  if (
    !SHARED_STITCH_LIST_MALFORMED_TERM.test(scanText)
    && !SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_ITEM.test(scanText)
    && !SHARED_STITCH_LIST_DIRECT_PREFIXED_IDENTIFIER_ITEM.test(scanText)
  ) return false;

  SHARED_STITCH_LIST_MALFORMED_FINDER.lastIndex = 0;
  let malformed;
  while ((malformed = SHARED_STITCH_LIST_MALFORMED_FINDER.exec(scanText)) !== null) {
    const normalizedList = malformed.groups.list.replace(
      SIMPLE_FAST_ATTACHED_INSTRUCTION_DELIMITER,
      " ",
    );
    SIMPLE_FAST_ATTACHED_INSTRUCTION_DELIMITER.lastIndex = 0;
    if (
      !SHARED_STITCH_LIST_EXACT.test(normalizedList)
      && SHARED_STITCH_LIST_MALFORMED_TERM.test(normalizedList)
    ) {
      SHARED_STITCH_LIST_MALFORMED_FINDER.lastIndex = 0;
      return true;
    }
  }
  SHARED_STITCH_LIST_MALFORMED_FINDER.lastIndex = 0;

  SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_FINDER.lastIndex = 0;
  const prefixed = SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_FINDER.test(scanText);
  SHARED_STITCH_LIST_PREFIXED_IDENTIFIER_PAIR_FINDER.lastIndex = 0;
  return prefixed;
}

function isSimpleFastContaminatedWorkDeny(text) {
  if (text.length > 512) return false;
  const workText = getSimpleFastWorkBody(text);
  if (
    SIMPLE_FAST_WORK_CANDIDATE.test(workText)
    && !SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(workText)
  ) {
    let scanText = workText;
    if (scanText.includes("](") || scanText.includes("][")) {
      scanText = maskSharedStitchListLinkDestinations(scanText);
    }
    if (
      SIMPLE_FAST_EMBEDDED_CONTAMINATION_ITEM.test(scanText)
      && SIMPLE_FAST_WORK_TARGET_TAIL.test(scanText)
      && hasAtLeastTwoSimpleFastWorkTerms(scanText)
    ) return true;
  }
  const terminal = text.match(/[.!?][\t ]*$/u);
  const content = terminal
    ? text.slice(0, terminal.index).trimEnd()
    : text.trimEnd();
  const commaIndex = content.lastIndexOf(",");
  if (commaIndex === -1) return false;
  const tail = content.slice(commaIndex + 1).trim();
  if (!SIMPLE_FAST_CONTAMINATION_TAIL.test(tail)) return false;
  const command = `${content.slice(0, commaIndex).trimEnd()}.`;
  return SIMPLE_FAST_WORK_LINE.test(command);
}

function isSimpleFastUnsupportedCompoundWorkDeny(text) {
  if (text.length > 512 || /[\r\n]/u.test(text)) return false;
  const normalizedSpacing = text.replace(/\p{Zs}/gu, " ");
  const headingPrefix = normalizedSpacing.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0] ?? "";
  const workText = normalizedSpacing.slice(headingPrefix.length);
  const inlineDestinationRanges = workText.includes("](")
    ? collectBoundedInlineDestinationRanges(workText)
    : [];
  let scanText = inlineDestinationRanges.length > 0
    ? maskRanges(workText, inlineDestinationRanges)
    : workText;
  if (scanText.includes("][")) scanText = maskSimpleReferenceLabelContents(scanText);
  SIMPLE_FAST_UNSUPPORTED_COMPOUND_ITEM.lastIndex = 0;
  let candidate = "";
  let cursor = 0;
  let match;
  let replacementCount = 0;
  while ((match = SIMPLE_FAST_UNSUPPORTED_COMPOUND_ITEM.exec(scanText)) !== null) {
    const compoundStart = match.index + match[1].length;
    candidate += workText.slice(cursor, compoundStart);
    candidate += match.groups.term;
    cursor = match.index + match[0].length;
    replacementCount += 1;
  }
  SIMPLE_FAST_UNSUPPORTED_COMPOUND_ITEM.lastIndex = 0;
  if (replacementCount < 1) return false;
  candidate += workText.slice(cursor);
  return SIMPLE_FAST_WORK_LINE.test(candidate)
    || SIMPLE_FAST_WORK_LINKED_THEN_PLAIN_LIST_LINE.test(candidate);
}

function isSimpleFastMalformedEmphasisWorkDeny(text) {
  if (
    text.length > 512
    || !/^ {0,3}work[\t ]/iu.test(text)
    || !/[*_]/u.test(text)
    || SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text)
    || /\brepeat[\t ]+from[\t ]+\*[.!?]?[\t ]*$/iu.test(text)
  ) return false;
  const terms = collectSharedStitchListTerms(text, 0);
  return terms.length >= 2
    && SHARED_STITCH_LIST_CONNECTOR_PREFILTER.test(text)
    && analyzeMarkdownEmphasis(text, terms).malformed;
}

function collectSimpleLinkedWorkMatches(text) {
  if (text.includes("](")) return collectSimpleInlineLinkWorkMatches(text);
  if (text.includes("][")) return collectSimpleExplicitReferenceWorkMatches(text);
  return null;
}

function collectSimpleLinkedWorkTensionMatches(text) {
  if (
    text.length > 2_048
    || /[\r\n]/u.test(text)
    || !/\btension\b/iu.test(text)
    || (!text.includes("][") && !text.includes("]("))
  ) return null;

  let scanText = text.includes("][")
    ? maskSimpleReferenceLabelContents(text)
    : text;
  if (scanText.includes("](")) {
    const inlineDestinationRanges = collectBoundedInlineDestinationRanges(scanText);
    if (inlineDestinationRanges.length === 0) return null;
    scanText = maskRanges(scanText, inlineDestinationRanges);
  }
  const tensionTerms = [...scanText.matchAll(
    /(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?<term>tension)(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])/giu,
  )];
  if (tensionTerms.length !== 1) return null;
  const tensionMatch = tensionTerms[0];
  const tensionStart = tensionMatch.index + tensionMatch[1].length;
  const tensionEnd = tensionStart + tensionMatch.groups.term.length;
  const beforeTension = scanText.slice(0, tensionStart);
  const afterTension = scanText.slice(tensionEnd);
  const boundedSquareTail = /^[\t\p{Zs}]+square(?:(?:[.!?;]+)|(?:[\t\p{Zs}]+widget[.!?;]*)|(?:[\t\p{Zs}]+as[\t\p{Zs}]+(?:a[\t\p{Zs}]+|the[\t\p{Zs}]+)?(?:example|label|phrase|term|wording)[.!?;]*))[\t\p{Zs}]*$/iu;

  let commandText;
  let commandStart = 0;
  if (beforeTension.trim() === "") {
    const squarePrefix = afterTension.match(/^[\t\p{Zs}]+square[.!?;]+[\t\p{Zs}]+/iu);
    if (!squarePrefix) return null;
    commandStart = tensionEnd + squarePrefix[0].length;
    commandText = text.slice(commandStart);
  } else {
    if (!boundedSquareTail.test(afterTension)) return null;
    const commaThen = beforeTension.match(/,[\t\p{Zs}]+then[\t\p{Zs}]+$/iu);
    const sentenceBoundary = commaThen
      ? null
      : beforeTension.match(/[.!?;][\t\p{Zs}]+$/u);
    if (commaThen) {
      commandText = `${text.slice(0, commaThen.index).trimEnd()}.`;
    } else if (sentenceBoundary) {
      commandText = text.slice(0, sentenceBoundary.index + 1);
    } else {
      return null;
    }
  }

  const commandMatches = collectSimpleLinkedWorkMatches(commandText);
  if (commandMatches === null || commandMatches.length === 0) return null;
  const matches = commandMatches.map((match) => ({
    ...match,
    start: commandStart + match.start,
    end: commandStart + match.end,
  }));
  if (isTensionGaugeContext(text, tensionStart, tensionEnd)) {
    matches.push({
      start: tensionStart,
      end: tensionEnd,
      matchedText: text.slice(tensionStart, tensionEnd),
      entry: TENSION_TERM_ENTRY,
    });
  }
  return matches.sort((left, right) => left.start - right.start || left.end - right.end);
}

function collectSimpleExplicitReferenceDefinitionMatches(text) {
  if (
    !text.includes("[")
    || !/[\r\n]/u.test(text)
  ) return null;
  const lines = splitTextLines(text).filter((line) => /\S/u.test(line.content));
  if (lines.length !== 2) return null;

  const definitionCandidates = [];
  for (const line of lines) {
    const definitionPrefix = line.content.match(/^ {0,3}\[/u)?.[0];
    if (!definitionPrefix) continue;
    const label = scanMarkdownReferenceLabel(
      line.content,
      definitionPrefix.length - 1,
    );
    if (
      label?.valid
      && line.content[label.end] === ":"
      && /\S/u.test(line.content.slice(label.end + 1))
    ) {
      definitionCandidates.push({ label, line });
    }
  }
  if (definitionCandidates.length !== 1) return null;
  const [{ label: definitionLabel, line: definitionLine }] = definitionCandidates;
  const instructionLine = lines[0] === definitionLine ? lines[1] : lines[0];
  if (instructionLine.content.length > MAX_MARKDOWN_LINK_DESTINATION_LENGTH * 2) return null;
  if (isSimpleFastLinkedWorkDeny(instructionLine.content)) return [];
  const normalizedDefinitionLabel = normalizeMarkdownReferenceLabel(definitionLabel.value);
  if (!normalizedDefinitionLabel) return null;
  const fastInstructionContent = instructionLine.content.replace(/\p{Zs}/gu, " ");
  if (
    !SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(fastInstructionContent)
    && (
      isSimpleFastOverlongNumberedItemDeny(fastInstructionContent)
      || SIMPLE_FAST_MALFORMED_MARKED_WORK_START.test(fastInstructionContent)
      || SIMPLE_FAST_DENIED_MARKDOWN_HEADING_WORK_START.test(fastInstructionContent)
    )
  ) return [];

  const inlineDestinationRanges = instructionLine.content.includes("](")
    ? collectSimpleInlineDestinationRanges(instructionLine.content)
      ?? scanMarkdownLinkSyntax(instructionLine.content).destinations
    : [];
  let inlineDestinationIndex = 0;
  let hasResolvedShortcutOrCollapsedReference = false;
  for (let cursor = 0; cursor < instructionLine.content.length; cursor += 1) {
    while (
      inlineDestinationIndex < inlineDestinationRanges.length
      && inlineDestinationRanges[inlineDestinationIndex].end <= cursor
    ) inlineDestinationIndex += 1;
    const inlineDestination = inlineDestinationRanges[inlineDestinationIndex];
    if (
      inlineDestination
      && inlineDestination.start <= cursor
      && cursor < inlineDestination.end
    ) {
      cursor = inlineDestination.end - 1;
      continue;
    }
    if (
      instructionLine.content[cursor] !== "["
      || instructionLine.content[cursor - 1] === "]"
      || isSimpleEscapedCharacter(instructionLine.content, cursor)
    ) continue;
    const shortcutLabel = scanMarkdownReferenceLabel(instructionLine.content, cursor);
    if (!shortcutLabel?.valid) continue;
    const following = instructionLine.content.slice(shortcutLabel.end);
    if (/^\(/u.test(following)) {
      cursor = shortcutLabel.end - 1;
      continue;
    }
    const explicitNonemptyReference = /^\[(?=.)/u.test(following)
      && !/^\[\]/u.test(following);
    const collapsedReference = /^\[\]/u.test(following);
    if (
      !explicitNonemptyReference
      && shortcutLabel.value.length > 0
      && (
        !collapsedReference
        || normalizeMarkdownReferenceLabel(shortcutLabel.value) === normalizedDefinitionLabel
      )
    ) hasResolvedShortcutOrCollapsedReference = true;
    if (following[0] === "[") {
      const reference = scanMarkdownReferenceLabel(
        instructionLine.content,
        shortcutLabel.end,
      );
      cursor = (reference?.end ?? shortcutLabel.end) - 1;
    } else {
      cursor = shortcutLabel.end - 1;
    }
  }
  if (hasResolvedShortcutOrCollapsedReference) {
    return SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(instructionLine.content) ? null : [];
  }

  let hasExplicitReference = false;
  const referenceContentRanges = [];
  for (let cursor = 0; cursor < instructionLine.content.length - 1; cursor += 1) {
    if (
      instructionLine.content[cursor] !== "]"
      || instructionLine.content[cursor + 1] !== "["
    ) {
      continue;
    }
    const reference = scanMarkdownReferenceLabel(instructionLine.content, cursor + 1);
    if (!reference?.valid) continue;
    referenceContentRanges.push({
      start: reference.contentStart,
      end: reference.contentEnd,
    });
    hasExplicitReference = true;
    cursor = reference.end - 1;
  }
  if (!hasExplicitReference && inlineDestinationRanges.length === 0) return null;

  const linkedTensionMatches = collectSimpleLinkedWorkTensionMatches(
    instructionLine.content,
  );
  if (linkedTensionMatches !== null) {
    return linkedTensionMatches.map((match) => ({
      ...match,
      start: instructionLine.start + match.start,
      end: instructionLine.start + match.end,
    }));
  }

  let recognitionContent = "";
  let recognitionCursor = 0;
  const collapsedReferenceRanges = [];
  for (const range of referenceContentRanges) {
    if (range.end <= range.start || range.start < recognitionCursor) continue;
    recognitionContent += instructionLine.content.slice(recognitionCursor, range.start);
    recognitionContent += "x";
    collapsedReferenceRanges.push({
      recognitionEnd: recognitionContent.length,
      restoredLength: range.end - range.start,
    });
    recognitionCursor = range.end;
  }
  recognitionContent += instructionLine.content.slice(recognitionCursor);
  let fastRecognitionContent = recognitionContent.replace(/\p{Zs}/gu, " ");
  const attachedQuotedNumber = fastRecognitionContent.match(
    /^(?<indent> {0,3})(?<quotes>>+)(?=\p{N}{1,9}\.)/u,
  );
  if (attachedQuotedNumber) {
    const quoteStart = attachedQuotedNumber.groups.indent.length;
    const quoteEnd = quoteStart + attachedQuotedNumber.groups.quotes.length;
    fastRecognitionContent = `${fastRecognitionContent.slice(0, quoteEnd - 1)} ${fastRecognitionContent.slice(quoteEnd)}`;
  }
  if (isSimpleFastOverlongNumberedItemDeny(fastRecognitionContent)) return [];
  if (isSimpleFastContaminatedWorkDeny(fastRecognitionContent)) return [];
  const restoreInstructionOffset = (offset) => {
    let restored = offset;
    for (const range of collapsedReferenceRanges) {
      if (offset < range.recognitionEnd) break;
      restored += range.restoredLength - 1;
    }
    return restored;
  };

  let localMatches = collectSimpleWorkWithUnmappedContinuationMatches(
    fastRecognitionContent,
  );
  if (localMatches === null) {
    localMatches = collectSimpleNeighboringWorkMatches(fastRecognitionContent);
  }
  if (localMatches === null) {
    localMatches = collectSimpleMarkedWorkMatches(fastRecognitionContent);
  }
  if (localMatches === null) {
    localMatches = collectPlainWorkMatches(fastRecognitionContent);
  }
  if (localMatches === null) {
    localMatches = collectSimpleHeadingWorkMatches(fastRecognitionContent);
  }
  if (localMatches === null) {
    localMatches = collectSimpleSegmentedWorkMatches(fastRecognitionContent);
  }
  if (localMatches === null) {
    localMatches = collectMatches(fastRecognitionContent);
  }
  return localMatches.map((match) => {
    const localStart = restoreInstructionOffset(match.start);
    const localEnd = restoreInstructionOffset(match.end);
    return {
      ...match,
      start: instructionLine.start + localStart,
      end: instructionLine.start + localEnd,
      matchedText: instructionLine.content.slice(localStart, localEnd),
    };
  });
}

function collectSimpleVisibleCodeOverflowDocumentMatches(text) {
  if (!text.includes("`") || !/[\r\n]/u.test(text)) return null;
  const lines = splitTextLines(text);
  const lineScans = lines.map((line) => {
    const workBody = getSimpleFastWorkBody(line.content);
    return scanSimpleNeighboringWorkSeparators(workBody);
  });
  if (!lineScans.some((scan) => scan.overflow)) return null;
  const hasTerminalEmptyLine = lines.at(-1)?.start === text.length
    && lines.at(-1)?.content === "";
  const physicalLineCount = lines.length - (hasTerminalEmptyLine ? 1 : 0);
  if (physicalLineCount > MAX_SIMPLE_FAST_SEGMENTS) return [];

  const matches = [];
  let blockStart = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!lineScans[index].overflow) continue;
    const block = text.slice(blockStart, line.start);
    if (block.trim() !== "") {
      matches.push(...collectMatches(block).map((match) => ({
        ...match,
        start: blockStart + match.start,
        end: blockStart + match.end,
      })));
    }
    blockStart = line.next;
  }
  const finalBlock = text.slice(blockStart);
  if (finalBlock.trim() !== "") {
    matches.push(...collectMatches(finalBlock).map((match) => ({
      ...match,
      start: blockStart + match.start,
      end: blockStart + match.end,
    })));
  }
  return matches;
}

function collectSimpleInlineCodeInstructionDocumentMatches(text) {
  if (!text.includes("`") || !/[\r\n]/u.test(text)) return null;
  const lines = splitTextLines(text);
  const hasTerminalEmptyLine = lines.at(-1)?.start === text.length
    && lines.at(-1)?.content === "";
  const physicalLineCount = lines.length - (hasTerminalEmptyLine ? 1 : 0);
  if (physicalLineCount < 2 || physicalLineCount > MAX_SIMPLE_FAST_SEGMENTS) return null;

  const matches = [];
  let instructionLineCount = 0;
  let sawInlineCodeInstruction = false;
  for (const line of lines) {
    if (line.content.trim() === "") continue;
    const workBody = getSimpleFastWorkBody(line.content);
    if (!/^work[\t \p{Zs}]+/iu.test(workBody)) return null;
    instructionLineCount += 1;
    const separatorScan = scanSimpleNeighboringWorkSeparators(workBody);
    if (
      separatorScan.codeRanges.length > 0
      && separatorScan.separators.length > 0
      && !separatorScan.overflow
    ) {
      sawInlineCodeInstruction = true;
    }

    let localMatches = collectSimpleNeighboringWorkMatches(line.content);
    if (localMatches === null) {
      localMatches = collectSimpleMarkedWorkMatches(line.content);
    }
    if (localMatches === null) {
      localMatches = collectPlainWorkMatchesWithTerminalSemicolon(line.content);
    }
    if (localMatches === null) {
      localMatches = collectSimpleHeadingWorkMatches(line.content);
    }
    if (localMatches === null) return null;
    matches.push(...localMatches.map((match) => ({
      ...match,
      start: line.start + match.start,
      end: line.start + match.end,
    })));
  }
  return instructionLineCount >= 2 && sawInlineCodeInstruction ? matches : null;
}

function collectMatchesWithoutStructuralPrefixFilter(text) {
  if (SINGLE_CODE_INDENTED_LINE.test(text) || isWholeDocumentIndentedCode(text)) return [];
  if (isSimpleFastDefinitionHeadingWorkDeny(text)) return [];
  if (
    !/[\r\n]/u.test(text)
    && SIMPLE_FAST_QUOTE_SIGNAL.test(text)
    && /[\[\]]/u.test(text)
    && hasSimpleMalformedMarkdownLine(text)
  ) {
    const malformedMarkupSourceMatches = collectSimpleQuotedSourcePathNeighborMatches(text);
    if (malformedMarkupSourceMatches !== null) return malformedMarkupSourceMatches;
  }
  const simpleQuotedStructuralOverflowNeighborMatches =
    collectSimpleQuotedStructuralOverflowNeighborMatches(text);
  if (simpleQuotedStructuralOverflowNeighborMatches !== null) {
    return simpleQuotedStructuralOverflowNeighborMatches;
  }
  const simpleStructuralPrefixOverflowNeighborMatches =
    collectSimpleStructuralPrefixOverflowNeighborMatches(text);
  if (simpleStructuralPrefixOverflowNeighborMatches !== null) {
    return simpleStructuralPrefixOverflowNeighborMatches;
  }
  const simpleVisibleCodeOverflowDocumentMatches = collectSimpleVisibleCodeOverflowDocumentMatches(
    text,
  );
  if (simpleVisibleCodeOverflowDocumentMatches !== null) {
    return simpleVisibleCodeOverflowDocumentMatches;
  }
  if (SIMPLE_FAST_STRONG_SOURCE_DOCUMENT_SIGNAL.test(text)) {
    const simpleSourceDocumentMatches = collectSimpleDocumentMatches(text);
    if (simpleSourceDocumentMatches !== null) return simpleSourceDocumentMatches;
  }
  if (
    !/[\r\n]/u.test(text)
    && SIMPLE_FAST_QUOTE_SIGNAL.test(text)
    && (text.includes("][") || text.includes("]("))
  ) {
    const simpleQuotedMarkupInstructionMatches = collectSimpleQuotedInstructionContextMatches(
      text,
      true,
    );
    if (simpleQuotedMarkupInstructionMatches !== null) {
      return simpleQuotedMarkupInstructionMatches;
    }
  }
  const simpleInlineCodeInstructionDocumentMatches =
    collectSimpleInlineCodeInstructionDocumentMatches(text);
  if (simpleInlineCodeInstructionDocumentMatches !== null) {
    return simpleInlineCodeInstructionDocumentMatches;
  }
  const simpleWholeInlineCodeWorkMatches = collectSimpleWholeInlineCodeWorkMatches(text);
  if (simpleWholeInlineCodeWorkMatches !== null) return simpleWholeInlineCodeWorkMatches;
  if (isSimpleFastLinkedWorkDeny(text)) return [];
  if (isSimpleFastMalformedSharedListWorkDeny(text)) return [];
  const simpleMarkedWorkMatches = collectSimpleMarkedWorkMatches(text);
  if (simpleMarkedWorkMatches !== null) return simpleMarkedWorkMatches;
  const simpleNeighboringWorkMatches = collectSimpleNeighboringWorkMatches(text);
  if (simpleNeighboringWorkMatches !== null) return simpleNeighboringWorkMatches;
  if (isSimpleFastUnsupportedCompoundWorkDeny(text)) return [];
  if (isSimpleFastContaminatedWorkDeny(text)) return [];
  const simpleInlineLinkWorkMatches = collectSimpleInlineLinkWorkMatches(text);
  if (simpleInlineLinkWorkMatches !== null) return simpleInlineLinkWorkMatches;
  const simpleExplicitReferenceWorkMatches = collectSimpleExplicitReferenceWorkMatches(text);
  if (simpleExplicitReferenceWorkMatches !== null) {
    return simpleExplicitReferenceWorkMatches;
  }
  if (
    !/[\r\n]/u.test(text)
    && SIMPLE_FAST_HEADING_BARE_LABEL_THEN_PLAIN_LIST_LINE.test(text)
  ) return [];
  const simpleUnsafeLinkedSuffixThenWorkMatches = collectSimpleUnsafeLinkedSuffixThenWorkMatches(text);
  if (simpleUnsafeLinkedSuffixThenWorkMatches !== null) {
    return simpleUnsafeLinkedSuffixThenWorkMatches;
  }
  const simpleExplicitReferenceDefinitionMatches = collectSimpleExplicitReferenceDefinitionMatches(
    text,
  );
  if (simpleExplicitReferenceDefinitionMatches !== null) {
    return simpleExplicitReferenceDefinitionMatches;
  }
  if (SIMPLE_FAST_RAW_TEXT_DOCUMENT_SIGNAL.test(text)) {
    const simpleRawTextDocumentMatches = collectSimpleDocumentMatches(text);
    if (simpleRawTextDocumentMatches !== null) return simpleRawTextDocumentMatches;
  }
  if (SIMPLE_FAST_QUOTE_SIGNAL.test(text)) {
    if (
      SIMPLE_BOUNDED_LINE_INTERNAL_SEGMENT.test(text)
      && scanMarkdownLinkSyntax(text).malformedLineRanges.length > 0
    ) {
      const simpleQuotedSegmentedMatches = collectSimpleSegmentedWorkMatches(text);
      if (simpleQuotedSegmentedMatches !== null) return simpleQuotedSegmentedMatches;
    }
    const simpleQuotedMatches = collectSimpleQuotedInstructionContextMatches(text);
    if (simpleQuotedMatches !== null) return simpleQuotedMatches;
  }
  const simpleBareLabelHeading = text.match(SIMPLE_FAST_WORK_HEADING_PREFIX)?.[0];
  if (
    simpleBareLabelHeading
    && SIMPLE_FAST_WORK_BARE_LABEL_THEN_PLAIN_LIST_LINE.test(
      text.slice(simpleBareLabelHeading.length),
    )
  ) return [];
  if (
    SIMPLE_FAST_DECLARATIVE_GLOSSARY_LINE.test(text)
    || SIMPLE_FAST_GLOSSARY_TERM_LIST_LINE.test(text)
  ) return [];
  if (
    SIMPLE_FAST_NUMBERED_SHARED_LIST_ALONE.test(text)
    || SIMPLE_FAST_NUMBERED_BARE_SHARED_LIST.test(text)
    || isSimpleFastOverlongNumberedItemDeny(text)
  ) return [];
  const advertisedVerticalMatches = collectSimpleAdvertisedVerticalTermMatches(text);
  if (advertisedVerticalMatches) return advertisedVerticalMatches;
  if (isSimpleFastPunctuatedFlatTermListDeny(text)) return [];
  const simpleFlatTermListMatches = collectSimpleFlatTermListMatches(text);
  if (simpleFlatTermListMatches) return simpleFlatTermListMatches;
  const numberedRoundFlatMatches = collectSimpleNumberedRoundFlatMatches(text);
  if (numberedRoundFlatMatches) return numberedRoundFlatMatches;
  const numberedBareItemMatches = collectSimpleNumberedBareItemMatches(text);
  if (numberedBareItemMatches !== null) return numberedBareItemMatches;
  if (isSimpleFastUnsafeLinkedListWorkDeny(text)) return [];
  if (isSimpleFastUnsafeMarkupWorkDeny(text)) return [];
  if (isSimpleFastMalformedEmphasisWorkDeny(text)) return [];
  const plainMatches = collectPlainWorkMatchesWithTerminalSemicolon(text);
  if (plainMatches) return plainMatches;
  if (isPlainAtomicMalformedIdentifierCommand(text)) return [];
  const simpleHeadingWorkMatches = collectSimpleHeadingWorkMatches(text);
  if (simpleHeadingWorkMatches !== null) return simpleHeadingWorkMatches;
  const simpleSlashThenWorkNoteMatches = collectSimpleSlashThenWorkNoteMatches(text);
  if (simpleSlashThenWorkNoteMatches !== null) return simpleSlashThenWorkNoteMatches;
  const simpleSegmentedMatches = collectSimpleSegmentedWorkMatches(text);
  if (simpleSegmentedMatches) return simpleSegmentedMatches;
  const simpleBoundedMatches = collectSimpleBoundedAuthoritativeMatches(text);
  if (simpleBoundedMatches) return simpleBoundedMatches;
  const simpleDefinitionMatches = collectSimpleDefinitionDocumentMatches(text);
  if (simpleDefinitionMatches) return simpleDefinitionMatches;
  const simpleDocumentMatches = collectSimpleDocumentMatches(text);
  if (simpleDocumentMatches) return simpleDocumentMatches;
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
    ...findSimpleQuotedInstructionProtectionRanges(text),
    ...compoundCustomDefinitionKeyRanges,
  ];
  const sourceReferenceRanges = [
    ...baseSourceReferenceRanges,
    ...findProtectedPairContinuationRanges(text, [
      ...baseSourceReferenceRanges,
      ...unsupportedParentheticalRanges,
    ]),
  ];
  const sharedListPolicies = findSharedStitchListPolicies(text);

  for (const policy of sharedListPolicies) {
    if (policy.decision !== "allow") continue;
    const overlappingDeniedPolicy = sharedListPolicies.some((candidate) => {
      const fullyCoveredProvisionalIsolatedDeny = candidate.provisionalIsolatedDeny
        && candidate.terms.every((term) => policy.terms.some((allowedTerm) => (
          allowedTerm.start === term.start && allowedTerm.end === term.end
        )));
      return candidate !== policy
        && candidate.decision === "deny"
        && (candidate.hardDeny || policy.isolatedContext)
        && !fullyCoveredProvisionalIsolatedDeny
        && candidate.start < policy.end
        && candidate.end > policy.start;
    });
    if (overlappingDeniedPolicy) {
      policy.decision = "deny";
      continue;
    }
    const protectedTerm = policy.terms.some((term) => (
      customDefinitionEntryLabels.has(term.entry.label)
      || sourceReferenceRanges.some((range) => range.start < term.end && range.end > term.start)
      || unsupportedParentheticalRanges.some((range) => range.start < term.end && range.end > term.start)
    ));
    if (protectedTerm) {
      policy.decision = "deny";
      continue;
    }
    matches.push(...policy.terms);
  }

  for (const entry of UK_TO_US_TERMS) {
    if (customDefinitionEntryLabels.has(entry.label)) continue;
    const { variants } = SOURCE_TERM_MATCHERS_BY_ENTRY.get(entry);

    for (const matcher of variants) {
      const prefilter = SOURCE_TERM_MATCHER_PREFILTERS.get(matcher);
      if (prefilter && !prefilter.test(text)) continue;
      matcher.lastIndex = 0;
      let match;
      while ((match = matcher.exec(text)) !== null) {
        const prefixLength = match[1].length;
        const matchedText = match[2];
        const start = match.index + prefixLength;
        const end = start + matchedText.length;
        if (sharedListPolicies.some((policy) => policy.start <= start && policy.end >= end)) continue;
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

function collectSimpleClosedWorkChunkMatches(text) {
  let matches = collectSimpleMarkedWorkMatches(text);
  if (matches === null) matches = collectSimpleNeighboringWorkMatches(text);
  if (matches === null) matches = collectSimpleInlineLinkWorkMatches(text);
  if (matches === null) matches = collectSimpleExplicitReferenceWorkMatches(text);
  if (matches === null) matches = collectPlainWorkMatchesWithTerminalSemicolon(text);
  if (matches === null) matches = collectSimpleHeadingWorkMatches(text);
  return matches;
}

function collectSimpleClosedQuotedNeighborChunkMatches(text) {
  let matches = collectSimpleClosedWorkChunkMatches(text);
  if (matches !== null) return matches;
  const normalizedText = text.replace(/\p{Zs}/gu, " ");
  const separators = scanSimpleNeighboringWorkSeparators(normalizedText).clauseSeparators;
  if (separators.length < 1 || separators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS) {
    return null;
  }

  matches = [];
  let segmentStart = 0;
  for (let index = 0; index <= separators.length; index += 1) {
    const separator = separators[index];
    const segmentEnd = separator ? separator.index + 1 : text.length;
    const segment = getSimpleQuotedNeighborChunk(text, segmentStart, segmentEnd);
    if (segment.text && hasSimpleQuotedRelevantTerm(segment.text)) {
      const localMatches = collectSimpleClosedWorkChunkMatches(segment.text);
      if (localMatches === null) return null;
      matches.push(...localMatches.map((match) => ({
        ...match,
        start: segment.start + match.start,
        end: segment.start + match.end,
      })));
    }
    if (separator) segmentStart = separator.index + separator[0].length;
  }
  return matches;
}

function hasSimpleFastWorkPrefixOverflowAnywhere(text) {
  for (let index = 0; index < text.length; index += 1) {
    if (!/[\p{L}\p{N}>#(*+\-]/u.test(text[index])) continue;
    if (hasSimpleFastWorkPrefixOverflow(text.slice(index))) return true;
  }
  return false;
}

function collectSimpleQuotedStructuralOverflowNeighborMatches(text) {
  if (
    text.length > 4_096
    || /[\r\n]/u.test(text)
    || !SIMPLE_FAST_QUOTE_SIGNAL.test(text)
  ) return null;
  const rawQuotedRanges = findSimpleQuotedInstructionRanges(text);
  if (
    rawQuotedRanges.length === 0
    || isSimpleQuotedDefinitionContext(text, rawQuotedRanges)
    || !rawQuotedRanges.some((range) => (
      range.kind === "quoted-instruction"
      && hasSimpleFastWorkPrefixOverflowAnywhere(text.slice(range.start, range.end))
    ))
  ) return null;
  const quotedRanges = findSimpleQuotedInstructionProtectionRanges(text);
  if (quotedRanges.length === 0 || quotedRanges.length > MAX_SIMPLE_FAST_SEGMENTS) return null;

  const matches = [];
  let cursor = 0;
  for (const range of [...quotedRanges, { start: text.length, end: text.length }]) {
    const chunk = getSimpleQuotedNeighborChunk(text, cursor, range.start);
    if (chunk.text && hasSimpleQuotedRelevantTerm(chunk.text)) {
      const localMatches = collectSimpleClosedQuotedNeighborChunkMatches(chunk.text);
      if (localMatches === null) return null;
      matches.push(...localMatches.map((match) => ({
        ...match,
        start: chunk.start + match.start,
        end: chunk.start + match.end,
      })));
    }
    cursor = range.end;
  }
  return matches;
}

function collectSimpleStructuralPrefixOverflowNeighborMatches(text) {
  if (text.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH || /[\r\n]/u.test(text)) return null;
  const overflowRanges = findSimpleFastWorkPrefixOverflowRanges(text);
  if (overflowRanges.length === 0 || overflowRanges.length > MAX_SIMPLE_FAST_SEGMENTS) return null;

  const matches = [];
  let cursor = 0;
  for (let index = 0; index <= overflowRanges.length; index += 1) {
    const range = overflowRanges[index];
    const blockEnd = range?.start ?? text.length;
    const block = text.slice(cursor, blockEnd);
    if (block.trim() !== "") {
      const leadingSpacingLength = cursor > 0
        ? block.match(/^[\t \p{Zs}]*/u)?.[0].length ?? 0
        : 0;
      const candidateBlock = block.slice(leadingSpacingLength);
      const localMatches = collectSimpleClosedWorkChunkMatches(candidateBlock);
      if (localMatches === null) return null;
      matches.push(...localMatches.map((match) => ({
        ...match,
        start: cursor + leadingSpacingLength + match.start,
        end: cursor + leadingSpacingLength + match.end,
      })));
    }
    if (range) cursor = range.end;
  }
  return matches;
}

function findSimpleFastWorkPrefixOverflowRanges(text) {
  const ranges = [];
  for (const line of splitTextLines(text)) {
    if (line.content.trim() === "") continue;
    const quotedRanges = SIMPLE_FAST_QUOTE_SIGNAL.test(line.content)
      ? findSimpleQuotedInstructionProtectionRanges(line.content)
      : [];
    let normalizedLine = line.content.replace(/\p{Zs}/gu, " ");
    if (quotedRanges.length > 0) normalizedLine = maskRanges(normalizedLine, quotedRanges);
    const lineScan = scanSimpleNeighboringWorkSeparators(normalizedLine);
    const quotedBoundaryStarts = quotedRanges.map((range) => {
      const trailingSpacing = line.content.slice(range.end).match(/^[\t \p{Zs}]*/u)?.[0] ?? "";
      return range.end + trailingSpacing.length;
    });
    const candidateStarts = [
      0,
      ...lineScan.clauseSeparators.map((separator) => (
        separator.index + separator[0].length
      )),
      ...quotedBoundaryStarts,
    ].sort((left, right) => left - right);
    for (const candidateStart of candidateStarts) {
      const absoluteStart = line.start + candidateStart;
      if (ranges.some((range) => range.start <= absoluteStart && range.end > absoluteStart)) {
        continue;
      }
      const candidate = line.content.slice(candidateStart);
      if (!hasSimpleFastWorkPrefixOverflow(candidate)) continue;
      const prefixChainLength = getSimpleFastWorkPrefixChainLength(candidate);
      const body = candidate.slice(prefixChainLength);
      const bodyQuotedRanges = SIMPLE_FAST_QUOTE_SIGNAL.test(body)
        ? findSimpleQuotedInstructionProtectionRanges(body)
        : [];
      let normalizedBody = body.replace(/\p{Zs}/gu, " ");
      if (bodyQuotedRanges.length > 0) {
        normalizedBody = maskRanges(normalizedBody, bodyQuotedRanges);
      }
      const bodySeparator = scanSimpleNeighboringWorkSeparators(normalizedBody).separators[0];
      const localEnd = bodySeparator
        ? prefixChainLength
          + bodySeparator.index
          + (/^,/u.test(bodySeparator[0]) ? 0 : 1)
        : candidate.length;
      ranges.push({
        start: absoluteStart,
        end: absoluteStart + localEnd,
      });
    }
  }
  return ranges;
}

function collectMatches(text) {
  let matches = collectMatchesWithoutStructuralPrefixFilter(text);
  if (matches.length === 0) return matches;
  const codeRanges = [
    ...(/[\x60~]/u.test(text)
      ? findMarkdownCodeRanges(text).filter((range) => !range.unclosedInline)
      : []),
    ...(text.includes("<")
      ? findHtmlMarkupRanges(text).filter((range) => range.kind === "html-code")
      : []),
    ...findSimplePhysicalIndentedCodeRanges(text),
  ];
  if (codeRanges.length > 0) {
    matches = matches.filter((match) => !codeRanges.some((range) => (
      range.start < match.end && range.end > match.start
    )));
    if (matches.length === 0) return matches;
  }
  const structuralPrefixOverflowRanges = findSimpleFastWorkPrefixOverflowRanges(text);
  if (structuralPrefixOverflowRanges.length === 0) return matches;
  return matches.filter((match) => !structuralPrefixOverflowRanges.some((range) => (
    range.start < match.end && range.end > match.start
  )));
}

function hasUnicodeBoundedMatch(text, source) {
  return new RegExp(
    `(^|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])(?:${source})(?=$|[^\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Cf}])`,
    "iu",
  ).test(text);
}

const REVIEW_SIGNAL_CANDIDATE = /(?:\btension\b|\bmiss\b|\bcast\b|\bwork[\t ]+straight\b|\bwool\b|\bwl\b|\bwf\b|\bwb\b|\bneedles?\b|\bhooks?\b|\bno\b|\bsize\b|\boz\b)/iu;
const NON_TENSION_REVIEW_SIGNAL_CANDIDATE = /(?:\bmiss\b|\bcast\b|\bwork[\t ]+straight\b|\bwool\b|\bwl\b|\bwf\b|\bwb\b|\bneedles?\b|\bhooks?\b|\bno\b|\bsize\b|\boz\b)/iu;
const UNKNOWN_CROCHET_SIGNAL_CANDIDATE = new RegExp(
  String.raw`(^|[^\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])(?:${SOURCE_STITCH_TERM_SOURCE})(?![\p{L}\p{M}\p{N}\p{Pc}\p{Cf}])`,
  "iu",
);
const SIMPLE_INLINE_LINK_DESTINATION = /\]\([^()\r\n]{0,256}\)/gu;

function maskSimpleInlineLinkDestinations(text) {
  return text.replace(
    SIMPLE_INLINE_LINK_DESTINATION,
    (destination) => `](${" ".repeat(destination.length - 3)})`,
  );
}

function hasSimpleLinkedTensionReviewContext(text) {
  if (!/[\r\n]/u.test(text) || !/\btension\b/iu.test(text)) return false;
  const lines = splitTextLines(text);
  if (lines.at(-1)?.content === "" && lines.at(-1)?.start === text.length) lines.pop();
  if (lines.length !== 2) return false;
  const definitionLines = lines.filter((line) => {
    const prefix = line.content.match(/^ {0,3}\[/u)?.[0];
    if (!prefix) return false;
    const label = scanMarkdownReferenceLabel(line.content, prefix.length - 1);
    return Boolean(
      label?.valid
      && line.content[label.end] === ":"
      && /\S/u.test(line.content.slice(label.end + 1)),
    );
  });
  if (definitionLines.length !== 1) return false;
  const instructionLine = lines[0] === definitionLines[0] ? lines[1] : lines[0];
  return collectSimpleLinkedWorkTensionMatches(instructionLine.content) !== null;
}

function getSimpleExplicitReferenceDefinitionReviewDocument(text) {
  if (text.length > 8_192 || !/[\r\n]/u.test(text)) return null;
  const lines = splitTextLines(text).filter((line) => /\S/u.test(line.content));
  if (lines.length < 2 || lines.length > MAX_SIMPLE_FAST_SEGMENTS + 1) return null;
  const definitionLines = lines.filter((line) => {
    const prefix = line.content.match(/^ {0,3}\[/u)?.[0];
    if (!prefix) return false;
    const label = scanMarkdownReferenceLabel(line.content, prefix.length - 1);
    return Boolean(
      label?.valid
      && line.content[label.end] === ":"
      && /\S/u.test(line.content.slice(label.end + 1)),
    );
  });
  if (definitionLines.length < 1 || definitionLines.length >= lines.length) return null;
  const definitionLineSet = new Set(definitionLines);
  const instructionLines = lines.filter((line) => !definitionLineSet.has(line));
  if (instructionLines.length !== 1) return null;
  return {
    definitionLine: definitionLines[0],
    definitionLines,
    instructionLine: instructionLines[0],
  };
}

function getSimpleLinkedReviewText(text) {
  if (
    text.length > 2_048
    || /[\r\n]/u.test(text)
    || (!text.includes("][") && !text.includes("]("))
  ) return null;
  const normalizedText = text.replace(/\p{Zs}/gu, " ");
  const separatorScan = scanSimpleNeighboringWorkSeparators(normalizedText);
  if (
    separatorScan.overflow
    || separatorScan.separators.length < 1
    || separatorScan.separators.length > MAX_SIMPLE_NEIGHBORING_WORK_SEPARATORS
  ) return null;

  let sawLinkedWork = false;
  let hasNonTensionMatch = false;
  let sawReviewOnlySegment = false;
  let segmentStart = 0;
  for (let index = 0; index <= separatorScan.separators.length; index += 1) {
    const separator = separatorScan.separators[index];
    const segmentEnd = separator
      ? separator.index + (/^[;,]/u.test(separator[0]) ? 0 : 1)
      : text.length;
    const segment = text.slice(segmentStart, segmentEnd);
    if (
      isSimpleFastReviewOnlySegment(segment)
      || isSimpleFastTensionMetaReviewSegment(segment)
    ) {
      sawReviewOnlySegment = true;
    } else {
      if (!segment.includes("][") && !segment.includes("](")) return null;
      const localMatches = collectSimpleClosedWorkChunkMatches(segment);
      if (!localMatches?.length) return null;
      if (localMatches.some((match) => match.entry.label !== "Tension")) {
        hasNonTensionMatch = true;
      }
      sawLinkedWork = true;
    }
    if (separator) segmentStart = separator.index + separator[0].length;
  }
  if (!sawLinkedWork || !sawReviewOnlySegment) return null;

  let reviewText = text;
  if (reviewText.includes("][")) {
    reviewText = maskAllSimpleReferenceLabelContents(reviewText);
    if (reviewText === null) return null;
  }
  if (reviewText.includes("](")) {
    reviewText = maskAllBoundedInlineDestinations(reviewText);
    if (reviewText === null) return null;
  }
  return { hasNonTensionMatch, reviewText };
}

function buildSignals(text, convention, analysisSuppressed = false, knownMatches = null) {
  const signals = [];
  if (analysisSuppressed || hasExcessiveReviewComplexity(text)) return signals;
  const simpleReferenceDocument = getSimpleExplicitReferenceDefinitionReviewDocument(text);
  let quickReviewText = simpleReferenceDocument
    ? maskRanges(text, simpleReferenceDocument.definitionLines.map((line) => ({
      start: line.start,
      end: line.start + line.content.length,
    })))
    : text;
  if (quickReviewText.includes("][")) {
    quickReviewText = maskAllSimpleReferenceLabelContents(quickReviewText)
      ?? maskSimpleReferenceLabelContents(quickReviewText);
  }
  if (quickReviewText.includes("](")) {
    quickReviewText = maskAllBoundedInlineDestinations(quickReviewText)
      ?? maskSimpleInlineLinkDestinations(quickReviewText);
  }
  const hasReviewSignalCandidate = REVIEW_SIGNAL_CANDIDATE.test(quickReviewText);
  const hasUnknownCrochetCandidate = convention === "unknown"
    && UNKNOWN_CROCHET_SIGNAL_CANDIDATE.test(quickReviewText);
  if (!hasReviewSignalCandidate && !hasUnknownCrochetCandidate) return signals;
  const simpleLinkedReview = (text.includes("][") || text.includes("]("))
    ? getSimpleLinkedReviewText(text)
      ?? (simpleReferenceDocument
        ? getSimpleLinkedReviewText(simpleReferenceDocument.instructionLine.content)
        : null)
    : null;

  if (
    hasUnknownCrochetCandidate
    && (
      hasSimpleUnknownCrochetInstructionCandidate(text)
      || (
        simpleLinkedReview !== null
          ? simpleLinkedReview.hasNonTensionMatch
          : (knownMatches ?? collectMatches(text)).some(
            (match) => match.entry.label !== "Tension",
          )
      )
    )
  ) {
    signals.push({
      title: "Crochet convention not established",
      note: "These stitch names can mean different stitches in UK and US instructions. The text was preserved; confirm the pattern key or publisher before choosing a conversion.",
    });
  }
  if (!hasReviewSignalCandidate) return signals;

  const hasKnownTensionMatch = knownMatches?.some(
    (match) => match.entry.label === "Tension",
  ) ?? false;
  if (
    convention === "uk"
    && !NON_TENSION_REVIEW_SIGNAL_CANDIDATE.test(text)
    && (hasKnownTensionMatch || hasSimpleLinkedTensionReviewContext(text))
  ) {
    signals.push({
      title: "Wording that may follow UK conventions",
      note: "These terms can appear in UK sources, but wording alone does not establish a pattern's country or publication date.",
    });
    return signals;
  }

  const simpleLinkedReviewText = simpleLinkedReview?.reviewText ?? null;
  if (simpleLinkedReviewText !== null) {
    if (hasUnicodeBoundedMatch(simpleLinkedReviewText, "tension|miss|cast\\s+off|work\\s+straight")) {
      signals.push({
        title: "Wording that may follow UK conventions",
        note: "These terms can appear in UK sources, but wording alone does not establish a pattern's country or publication date.",
      });
    }

    if (hasUnicodeBoundedMatch(simpleLinkedReviewText, "wool\\s+(?:over|forward|back|round\\s+needle)|wl\\.?\\s*(?:fwd|bk)\\.?|wf\\.?|wb\\.?")) {
      signals.push({
        title: "Older yarn-position wording",
        note: "This language may describe yarn placement or a yarn over. Confirm the source abbreviation key and the next stitch before changing the technique.",
      });
    }

    if (
      hasUnicodeBoundedMatch(
        simpleLinkedReviewText,
        "(?:(?:needles?|hooks?)\\s+(?:(?:no\\.?|size)\\s*)\\d+|(?<!\\bpattern\\s)(?<!\\bcatalog\\s)(?<!\\bmotif\\s)(?<!\\bdesign\\s)(?<!\\bstyle\\s)(?<!\\bitem\\s)(?:no\\.?|size)\\s*\\d+(?:\\s+(?:alumin(?:um|ium)|bamboo|bone|circular|crochet|double[-‐‑‒–—]?pointed|knitting|metal|plastic|single[-‐‑‒–—]?pointed|steel|straight|tunisian|wood(?:en)?)){0,3}\\s+(?:needles?|hooks?))",
      )
    ) {
      signals.push({
        title: "Numbered needle or hook size",
        note: "A bare size number does not identify the sizing system or diameter. Verify the source system and millimeter size before selecting a tool.",
      });
    }

    if (hasUnicodeBoundedMatch(simpleLinkedReviewText, "\\d+(?:\\.\\d+)?\\s*oz(?:s|\\.)?")) {
      signals.push({
        title: "Yarn amount stated by weight",
        note: "Weight alone does not establish modern yardage. Match the original yarn construction and verify length per unit weight before substituting.",
      });
    }

    return signals;
  }

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

function unchangedResult(text, convention, analysisSuppressed = false, knownSignals = null) {
  return {
    status: "ready",
    convention,
    output: text,
    segments: [{ type: "text", content: text }],
    substitutions: [],
    substitutionCount: 0,
    signals: knownSignals ?? buildSignals(text, convention, analysisSuppressed),
  };
}

function convertedResult(text, convention, matches, signalText = text, signalMatches = matches) {
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
  if (segments.length === 0) segments.push({ type: "text", content: text });

  return {
    status: "ready",
    convention,
    output: segments.map((segment) => segment.content).join(""),
    segments,
    substitutions: [...substitutionMap.values()],
    substitutionCount: matches.length,
    signals: buildSignals(signalText, convention, false, signalMatches),
  };
}

function appendTrailingHorizontalWhitespace(result, trailingWhitespace) {
  const segments = [...result.segments];
  const lastSegment = segments.at(-1);
  if (lastSegment?.type === "text") {
    segments[segments.length - 1] = {
      ...lastSegment,
      content: `${lastSegment.content}${trailingWhitespace}`,
    };
  } else {
    segments.push({ type: "text", content: trailingWhitespace });
  }
  return {
    ...result,
    output: `${result.output}${trailingWhitespace}`,
    segments,
  };
}

function restoreSimpleLongQuotedAsciiColonProjection(result, projection) {
  const projectedKeyEnd = projection.keyStart + projection.projectedKey.length;
  let inputCursor = 0;
  let restored = false;
  const segments = result.segments.map((segment) => {
    const sourceLength = segment.type === "sub"
      ? segment.original.length
      : segment.content.length;
    const segmentStart = inputCursor;
    const segmentEnd = segmentStart + sourceLength;
    inputCursor = segmentEnd;
    if (
      restored
      || segment.type !== "text"
      || projection.keyStart < segmentStart
      || projectedKeyEnd > segmentEnd
    ) return segment;
    const localStart = projection.keyStart - segmentStart;
    const localEnd = projectedKeyEnd - segmentStart;
    if (segment.content.slice(localStart, localEnd) !== projection.projectedKey) {
      return segment;
    }
    restored = true;
    return {
      ...segment,
      content: `${segment.content.slice(0, localStart)}${projection.originalKey}${segment.content.slice(localEnd)}`,
    };
  });
  if (!restored) return null;
  return {
    ...result,
    output: segments.map((segment) => segment.content).join(""),
    segments,
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

  const trailingHorizontalWhitespace = text.match(/[\t\p{Zs}]{257,}$/u)?.[0];
  if (trailingHorizontalWhitespace) {
    const coreText = text.slice(0, -trailingHorizontalWhitespace.length);
    const coreResult = decodeVintagePattern(coreText, convention);
    if (coreResult.status === "ready") {
      return appendTrailingHorizontalWhitespace(coreResult, trailingHorizontalWhitespace);
    }
  }

  const analysisSuppressed = hasExcessiveReviewComplexity(text);
  if (analysisSuppressed) {
    return unchangedResult(text, convention, analysisSuppressed);
  }

  if (!/[\r\n]/u.test(text) && SIMPLE_FAST_STRONG_SOURCE_LINE.test(text)) {
    return unchangedResult(text, convention, false, []);
  }

  const longQuotedAsciiColonProjection = getSimpleLongQuotedAsciiColonProjection(text);
  if (longQuotedAsciiColonProjection !== null) {
    const projectedText = `${text.slice(0, longQuotedAsciiColonProjection.keyStart)}${longQuotedAsciiColonProjection.projectedKey}${text.slice(longQuotedAsciiColonProjection.keyEnd)}`;
    const projectedResult = decodeVintagePattern(projectedText, convention);
    if (projectedResult.status === "ready") {
      const restoredResult = restoreSimpleLongQuotedAsciiColonProjection(
        projectedResult,
        longQuotedAsciiColonProjection,
      );
      if (restoredResult !== null) return restoredResult;
    }
  }

  let quotedDefinitionRecords = collectSimpleQuotedDefinitionRecords(text);
  if (
    quotedDefinitionRecords === SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW
    || (
      Array.isArray(quotedDefinitionRecords)
      && !(
        quotedDefinitionRecords.length === 1
        && quotedDefinitionRecords[0].start === 0
        && /^[\p{L}\p{N}]/u.test(text)
      )
    )
  ) {
    const quotedDefinitionDetectionRanges =
      findSimpleQuotedDefinitionDetectionProtectionRanges(text);
    if (quotedDefinitionDetectionRanges.length > 0) {
      quotedDefinitionRecords = collectSimpleQuotedDefinitionRecords(
        maskRanges(text, quotedDefinitionDetectionRanges),
      );
    }
  }
  if (quotedDefinitionRecords === SIMPLE_QUOTED_DEFINITION_BOUNDARY_OVERFLOW) {
    return unchangedResult(text, convention, false, []);
  }
  if (quotedDefinitionRecords === null) {
    const physicalLineQuotedDefinitionRecords =
      findSimplePhysicalLineQuotedDefinitionRecordRanges(text);
    if (physicalLineQuotedDefinitionRecords.length > 0) {
      quotedDefinitionRecords = physicalLineQuotedDefinitionRecords;
    }
  }
  if (quotedDefinitionRecords !== null) {
    const customDefinitionLabels = findSimpleQuotedDefinitionCustomLabels(
      text,
      quotedDefinitionRecords,
    );
    const releasedRegionCodeRanges = [
      ...findMarkdownCodeRanges(text).filter((range) => !range.unclosedInline),
      ...findHtmlMarkupRanges(text).filter((range) => range.kind === "html-code"),
      ...findSimplePhysicalIndentedCodeRanges(text),
    ];
    const releasedRegionAnalysisMaskRanges = releasedRegionCodeRanges.filter((range) => {
      const protectedText = text.slice(range.start, range.end);
      return /[\r\n]/u.test(protectedText)
        || SIMPLE_FAST_QUOTE_SIGNAL.test(protectedText);
    });
    const releasedRegions = [];
    let releasedStart = 0;
    for (const record of quotedDefinitionRecords) {
      if (releasedStart < record.start) {
        releasedRegions.push({
          start: releasedStart,
          text: text.slice(releasedStart, record.start),
          followedByQuotedDefinition: true,
          followsExplicitDefinitionSeparator: releasedStart > 0
            && text[releasedStart - 1] === ";",
        });
      }
      releasedStart = record.end;
    }
    if (releasedStart < text.length) {
      releasedRegions.push({
        start: releasedStart,
        text: text.slice(releasedStart),
        followedByQuotedDefinition: false,
        followsExplicitDefinitionSeparator: releasedStart > 0
          && text[releasedStart - 1] === ";",
      });
    }
    const getRegionAnalysisText = (region) => {
      const localMaskRanges = releasedRegionAnalysisMaskRanges
        .filter((range) => (
          range.start < region.start + region.text.length
          && range.end > region.start
        ))
        .map((range) => ({
          start: Math.max(0, range.start - region.start),
          end: Math.min(region.text.length, range.end - region.start),
        }));
      const analysisText = localMaskRanges.length > 0
        ? maskRanges(region.text, localMaskRanges)
        : region.text;
      return region.followsExplicitDefinitionSeparator
        ? analysisText.replace(
          /^[\t\p{Zs}]+/u,
          (spacing) => spacing.replace(/[\t ]/gu, "\u00a0"),
        )
        : analysisText;
    };
    const filterRegionCodeMatches = (region, matches) => matches.filter((match) => {
      const start = region.start + match.start;
      const end = region.start + match.end;
      return !releasedRegionCodeRanges.some((range) => (
        range.start < end && range.end > start
      ));
    });
    const signals = [];
    const signalTitles = new Set();
    const appendSignals = (candidates) => {
      for (const signal of candidates) {
        if (signalTitles.has(signal.title)) continue;
        signalTitles.add(signal.title);
        signals.push(signal);
      }
    };
    const collectReleasedRegionPolicy = (region) => {
      const regionAnalysisText = getRegionAnalysisText(region);
      const customWorkDeniedRanges = findSimpleCustomDefinitionWorkClauseRanges(
        regionAnalysisText,
        customDefinitionLabels,
      );
      const matchingText = customWorkDeniedRanges.length > 0
        ? maskRanges(regionAnalysisText, customWorkDeniedRanges)
        : regionAnalysisText;
      let localMatches = collectSimpleReleasedMatchesOutsideRanges(
        regionAnalysisText,
        customWorkDeniedRanges,
      );
      if (localMatches === null) {
        localMatches = collectSimpleReleasedMultilineSourceMatches(
          matchingText,
          customDefinitionLabels,
        );
      }
      if (localMatches === null) {
        const referenceDocument = getSimpleExplicitReferenceDefinitionReviewDocument(
          matchingText,
        );
        if (referenceDocument) {
          const instructionMatches = collectSimpleQuotedSourcePathNeighborMatches(
            referenceDocument.instructionLine.content,
            false,
            customDefinitionLabels,
          );
          if (instructionMatches !== null) {
            localMatches = instructionMatches.map((match) => ({
              ...match,
              start: referenceDocument.instructionLine.start + match.start,
              end: referenceDocument.instructionLine.start + match.end,
            }));
          }
        }
      }
      if (localMatches === null) {
        localMatches = collectSimpleQuotedSourcePathNeighborMatches(
          matchingText,
          region.start === 0
            && region.followedByQuotedDefinition
            && hasSimpleValidQuotedProtectedMetadata(matchingText),
          customDefinitionLabels,
        );
      }
      if (localMatches === null) {
        localMatches = hasSourceTermCandidate(matchingText)
          ? collectSimpleReleasedQuotedDefinitionTailMatches(matchingText)
          : [];
      }
      if (localMatches === null) localMatches = collectMatches(matchingText);
      localMatches = filterRegionCodeMatches(region, localMatches);
      const customPolicy = applySimpleCustomDefinitionClausePolicy(
        regionAnalysisText,
        localMatches,
        customDefinitionLabels,
      );
      const deniedRanges = [
        ...customWorkDeniedRanges,
        ...customPolicy.deniedRanges,
      ];
      return {
        matches: customPolicy.matches,
        signalText: deniedRanges.length > 0
          ? maskRanges(regionAnalysisText, deniedRanges)
          : regionAnalysisText,
      };
    };
    if (convention !== "uk") {
      for (const region of releasedRegions) {
        const policy = collectReleasedRegionPolicy(region);
        appendSignals(buildSignals(
          policy.signalText,
          convention,
          false,
          policy.matches,
        ));
      }
      return unchangedResult(text, convention, false, signals);
    }
    const releasedMatches = [];
    for (const region of releasedRegions) {
      const policy = collectReleasedRegionPolicy(region);
      appendSignals(buildSignals(policy.signalText, convention, false, policy.matches));
      releasedMatches.push(...policy.matches.map((match) => ({
        ...match,
        start: region.start + match.start,
        end: region.start + match.end,
      })));
    }
    const result = convertedResult(
      text,
      convention,
      releasedMatches,
      "",
      [],
    );
    return { ...result, signals };
  }

  const signalText = getSimpleNamedQuotedDefinitionSignalText(text);
  if (convention !== "uk") {
    return signalText === text
      ? unchangedResult(text, convention)
      : unchangedResult(
        text,
        convention,
        false,
        buildSignals(signalText, convention),
      );
  }

  if (!hasSourceTermCandidate(text)) {
    return unchangedResult(text, convention);
  }
  const matches = collectMatches(text);
  return convertedResult(text, convention, matches, signalText, matches);
}
