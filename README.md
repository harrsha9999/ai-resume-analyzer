# AI Resume Analyzer

Analyzes a resume against a target job description and returns an ATS-style
match score, the matched/missing keywords, and concrete improvement
suggestions. Runs fully offline with a deterministic scoring engine; an
OpenAI key can be added to enrich suggestions.

🔗 **Live demo:** https://ai-resume-analyzer-harsha.onrender.com
💻 **Stack:** Node.js · Express · Vanilla JS frontend (OpenAI optional)

![CI](https://github.com/harrsha9999/ai-resume-analyzer/actions/workflows/ci.yml/badge.svg)

---

## Why I built it
Most candidates get auto-rejected by ATS keyword filters and never find out
why. This gives instant, specific feedback before you apply.

## Features
- Paste resume text + a target job description
- ATS-style match score (0–100) based on job-description keyword coverage
- Matched and missing keyword lists
- Improvement suggestions (keyword gaps, quantification, length)
- Works with no API key (deterministic engine); OpenAI key optional

## How it works
1. The client POSTs `{ resume, jobDescription }` to `/api/analyze`.
2. The server extracts ranked keywords from the job description, checks the
   resume for coverage, and computes a score.
3. It returns matched/missing keywords + targeted suggestions.

The scoring logic is pure and unit-tested (keyword extraction, scoring,
suggestion rules).

## Tech Stack
| Layer    | Tech                                   |
|----------|----------------------------------------|
| Backend  | Node.js, Express.js                    |
| Frontend | Vanilla HTML/CSS/JS (served statically)|
| AI       | OpenAI API (optional upgrade path)     |
| Tests    | Node.js built-in test runner           |

## Getting Started
```bash
git clone https://github.com/harrsha9999/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
npm run dev      # open http://localhost:5000
npm test         # 6 unit tests
```

### Environment variables (all optional)
```
PORT=5000
OPENAI_API_KEY=     # if set, used to enrich suggestions; otherwise offline engine
OPENAI_MODEL=gpt-4o-mini
```

## API
| Method | Endpoint      | Description                       |
|--------|---------------|-----------------------------------|
| GET    | /api/health   | Status + whether an LLM key is set|
| POST   | /api/analyze  | Analyze resume vs. job description|

## Roadmap
- [ ] LLM-enriched, line-level rewrite suggestions
- [ ] Resume file upload (PDF parsing)
- [ ] Persisted analysis history

## Author
**Harsha Vardhan G** — [LinkedIn](https://linkedin.com/in/haarsha9999) · [GitHub](https://github.com/harrsha9999)
