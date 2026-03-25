const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are a legal document analyst specialising in plain-English explanations for non-lawyers. 
Your job is to analyse legal clauses and return structured JSON only — no markdown, no preamble, no explanation outside the JSON.

For each clause you receive, you must return a JSON array where each element has exactly these fields:
- "plainEnglish": A 1-3 sentence explanation a non-lawyer can understand. Be specific to this clause, not generic.
- "riskLevel": Exactly one of "Low", "Medium", or "High"
- "riskReason": One sentence explaining why you assigned that risk level

Risk level guidelines:
- High: indemnification, non-compete, unilateral amendment rights, forced arbitration, unlimited liability, irrevocable rights, perpetual licence, personal data collection, penalty clauses
- Medium: auto-renewal, limitation of liability, notice periods, IP ownership, sublicensing restrictions, audit rights, termination for convenience
- Low: standard definitions, governing law (if reasonable), payment terms (if clear), general cooperation clauses

Return ONLY a valid JSON array. No other text.`;

const buildClauseBatch = (clauses) => {
  return clauses
    .map((c, i) => `Clause ${i + 1} [${c.section}]:\n${c.originalText}`)
    .join('\n\n---\n\n');
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const analyseClauseBatch = async (clauses, retries = 3) => {
  const userMessage = `Analyse these ${clauses.length} legal clause(s) and return a JSON array with ${clauses.length} element(s):\n\n${buildClauseBatch(clauses)}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      });

      const raw = completion.choices[0]?.message?.content?.trim();
      if (!raw) throw new Error('Empty response from Groq');

      const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(jsonStr);

      if (!Array.isArray(parsed)) throw new Error('Groq did not return an array');

      return parsed.map((item, i) => ({
        plainEnglish: item.plainEnglish || 'Could not generate explanation.',
        riskLevel: ['Low', 'Medium', 'High'].includes(item.riskLevel) ? item.riskLevel : 'Low',
        riskReason: item.riskReason || '',
        originalText: clauses[i].originalText,
        section: clauses[i].section,
      }));
    } catch (err) {
      const isRateLimit = err?.status === 429 || err?.message?.includes('rate');

      if (attempt < retries) {
        const delay = isRateLimit ? 62000 : 2000 * attempt;
        console.log(`Groq attempt ${attempt} failed (${err.message}). Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        console.error(`Groq batch failed after ${retries} attempts:`, err.message);
        return clauses.map((c) => ({
          originalText: c.originalText,
          section: c.section,
          plainEnglish: 'Analysis unavailable for this clause.',
          riskLevel: 'Low',
          riskReason: 'Could not analyse due to an API error.',
        }));
      }
    }
  }
};

const generateSummary = async (text, fileName) => {
  const truncated = text.length > 4000 ? text.substring(0, 4000) + '...' : text;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a legal document analyst. Write a concise 3-5 sentence executive summary of the legal document provided. 
Cover: who the parties are, the core purpose of the agreement, key obligations, duration if mentioned, and the top 1-2 risks. 
Write in plain English for a non-lawyer. Return only the summary text, no headings or bullet points.`,
        },
        {
          role: 'user',
          content: `Document name: ${fileName}\n\n${truncated}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (err) {
    console.error('Summary generation failed:', err.message);
    return '';
  }
};

const computeSafetyScore = (clauses) => {
  if (!clauses || clauses.length === 0) return 100;

  const weights = { High: 3, Medium: 1, Low: 0 };
  const total = clauses.reduce((sum, c) => sum + (weights[c.riskLevel] || 0), 0);
  const maxPossible = clauses.length * weights.High;

  if (maxPossible === 0) return 100;

  const rawScore = 100 - Math.round((total / maxPossible) * 100);
  return Math.max(0, Math.min(100, rawScore));
};

const BATCH_SIZE = 4;
const BATCH_DELAY_MS = 2500;

const analyseDocument = async (clauses, extractedText, fileName) => {
  const batches = [];
  for (let i = 0; i < clauses.length; i += BATCH_SIZE) {
    batches.push(clauses.slice(i, i + BATCH_SIZE));
  }

  console.log(`Analysing ${clauses.length} clauses in ${batches.length} batches...`);

  const analysedClauses = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1}/${batches.length}`);
    const results = await analyseClauseBatch(batches[i]);
    analysedClauses.push(...results);

    if (i < batches.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const summary = await generateSummary(extractedText, fileName);
  await sleep(1000);

  const safetyScore = computeSafetyScore(analysedClauses);

  return { analysedClauses, summary, safetyScore };
};

module.exports = { analyseDocument, computeSafetyScore };