const { extractClauses } = require('./clauseExtractor');
const { extractEntities } = require('./entityExtractor');
const { extractKeywords } = require('./keywordExtractor');

const processNLP = (text) => {
  const clauses = extractClauses(text);
  const namedEntities = extractEntities(text);
  const { flaggedKeywords, topTerms } = extractKeywords(text, clauses);

  return { clauses, namedEntities, flaggedKeywords, topTerms };
};

module.exports = { processNLP };