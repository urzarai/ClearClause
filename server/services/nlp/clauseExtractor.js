const HEADER_PATTERNS = [
  /^\s*(?:SECTION|ARTICLE|CLAUSE|SCHEDULE|EXHIBIT|APPENDIX)\s+[\dIVXivx.]+/i,
  /^\s*\d+\.\s{1,3}[A-Z][A-Za-z\s]{3,60}$/,
  /^\s*\d+\.\d+\s{1,3}[A-Z][A-Za-z\s]{3,60}$/,
  /^\s*[A-Z][A-Z\s\-]{4,50}:?\s*$/,
  /^\s*(?:WHEREAS|NOW,?\s+THEREFORE|IN\s+WITNESS\s+WHEREOF|RECITALS?|BACKGROUND)\b/i,
];

const isHeader = (line) => {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 100) return false;
  return HEADER_PATTERNS.some((p) => p.test(trimmed));
};

const splitIntoSentences = (text) => {
  return text
    .replace(/([.?!])\s+(?=[A-Z])/g, '$1\n')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
};

const groupSentencesIntoClauses = (sentences, sectionTitle) => {
  const clauses = [];
  let buffer = [];
  let bufferLen = 0;

  for (const s of sentences) {
    buffer.push(s);
    bufferLen += s.length;

    if (buffer.length >= 3 || bufferLen >= 500) {
      clauses.push({ originalText: buffer.join(' '), section: sectionTitle });
      buffer = [];
      bufferLen = 0;
    }
  }

  if (buffer.length > 0) {
    clauses.push({ originalText: buffer.join(' '), section: sectionTitle });
  }

  return clauses;
};

const splitIntoSections = (text) => {
  const lines = text.split('\n');
  const sections = [];
  let current = { title: 'Preamble', lines: [] };

  for (const line of lines) {
    if (isHeader(line)) {
      const body = current.lines.join(' ').trim();
      if (body.length > 60) sections.push(current);
      current = { title: line.trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }

  const body = current.lines.join(' ').trim();
  if (body.length > 60) sections.push(current);

  return sections;
};

const extractClauses = (text) => {
  let sections = splitIntoSections(text);

  if (sections.length < 2) {
    sections = [{ title: 'Document', lines: text.split('\n') }];
  }

  const allClauses = [];

  for (const section of sections) {
    if (allClauses.length >= 30) break;

    const sectionText = section.lines.join(' ').replace(/\s+/g, ' ').trim();
    if (sectionText.length < 40) continue;

    const sentences = splitIntoSentences(sectionText);
    const clauses = groupSentencesIntoClauses(sentences, section.title);
    allClauses.push(...clauses);
  }

  return allClauses.slice(0, 30);
};

module.exports = { extractClauses };