// Deterministic, offline ATS analysis engine. Pure functions = fully testable.
// Compares a resume against a job description, scores keyword coverage, finds
// gaps, and produces suggestions. When an LLM is wired in, this stays as the
// reliable fallback and as a validation baseline.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "are", "our", "this", "that",
  "will", "have", "has", "from", "into", "out", "who", "all", "can", "but",
  "not", "use", "using", "used", "work", "working", "role", "team", "teams",
  "job", "experience", "experiences", "ability", "strong", "good", "plus",
  "etc", "such", "their", "they", "them", "a", "an", "to", "of", "in", "on",
  "or", "as", "is", "be", "we", "at", "by", "it", "we're", "looking",
]);

export function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

// Extract candidate "keywords" from a job description: unique meaningful tokens,
// ranked by frequency, capped so the score reflects the most relevant terms.
export function extractKeywords(jobDescription, limit = 25) {
  const counts = new Map();
  for (const tok of tokenize(jobDescription)) {
    counts.set(tok, (counts.get(tok) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

// Main analysis. Returns a stable, serializable result object.
export function analyzeResume(resumeText, jobDescription) {
  const keywords = extractKeywords(jobDescription);
  const resumeTokens = new Set(tokenize(resumeText));

  const matched = keywords.filter((k) => resumeTokens.has(k));
  const missing = keywords.filter((k) => !resumeTokens.has(k));

  const score = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : 0;

  const suggestions = buildSuggestions({ score, missing, resumeText });

  return {
    score,
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions,
    engine: "heuristic",
  };
}

function buildSuggestions({ score, missing, resumeText }) {
  const tips = [];
  if (missing.length) {
    tips.push(
      `Add or surface these missing keywords where truthful: ${missing
        .slice(0, 8)
        .join(", ")}.`
    );
  }
  if (score < 60) {
    tips.push("Tailor your summary and skills to mirror the job description's language.");
  }
  const words = tokenize(resumeText).length;
  if (words < 150) {
    tips.push("Resume looks short — add measurable, role-relevant bullet points.");
  }
  if (!/\d/.test(resumeText)) {
    tips.push("Quantify impact with numbers (%, latency, users, throughput).");
  }
  if (tips.length === 0) {
    tips.push("Strong keyword coverage. Focus on quantified, outcome-driven bullets.");
  }
  return tips;
}
