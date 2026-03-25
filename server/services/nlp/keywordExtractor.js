const natural = require('natural');

const TfIdf = natural.TfIdf;

const LEGAL_TERMS = [
  'indemnify', 'indemnification', 'indemnity',
  'arbitration', 'arbitrate',
  'non-compete', 'noncompete',
  'terminate', 'termination',
  'liability', 'liable',
  'waiver', 'waive',
  'governing law',
  'jurisdiction',
  'confidential', 'confidentiality',
  'intellectual property',
  'force majeure',
  'liquidated damages',
  'warranty', 'warranties',
  'representations',
  'covenant',
  'default',
  'breach',
  'remedy', 'remedies',
  'injunctive relief',
  'severability',
  'entire agreement',
  'amendment',
  'assignment',
  'limitation of liability',
  'consequential damages',
  'punitive damages',
  'dispute resolution',
  'mediation',
  'non-disclosure',
  'perpetual',
  'irrevocable',
  'unilateral',
  'sole discretion',
  'penalty',
  'lien',
  'encumbrance',
  'sublicense',
];

const extractKeywords = (text, clauses) => {
  const lower = text.toLowerCase();
  const flaggedKeywords = [
    ...new Set(LEGAL_TERMS.filter((term) => lower.includes(term))),
  ];

  const tfidf = new TfIdf();
  const docs = clauses.length > 0 ? clauses.map((c) => c.originalText) : [text];
  docs.forEach((d) => tfidf.addDocument(d));

  const termScores = {};
  docs.forEach((_, i) => {
    tfidf.listTerms(i).forEach(({ term, tfidf: score }) => {
      if (term.length > 3 && !/^\d+$/.test(term)) {
        termScores[term] = (termScores[term] || 0) + score;
      }
    });
  });

  const topTerms = Object.entries(termScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term, score]) => ({ term, score: Math.round(score * 100) / 100 }));

  return { flaggedKeywords, topTerms };
};

module.exports = { extractKeywords };