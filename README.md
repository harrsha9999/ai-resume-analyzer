# AI Resume Analyzer

An AI-powered tool that analyzes resumes, returns an ATS-compatibility score,
detects skill gaps against a target role, and suggests concrete improvements.

🔗 **Live demo:** https://ai-resume-analyzer-harsha.vercel.app
💻 **Stack:** React · Node.js · Express · MongoDB · OpenAI API

---

## Why I built it
Most candidates get auto-rejected by ATS filters and never find out why. This
tool gives instant, specific feedback so a resume can be fixed before applying.

## Features
- Upload a resume (PDF/text) and paste a target job description
- LLM-generated ATS-style score (0–100) with reasoning
- Missing-keyword and skill-gap detection against the job description
- Actionable, line-level rewrite suggestions
- History of past analyses per user

## Tech Stack
| Layer     | Tech                                  |
|-----------|---------------------------------------|
| Frontend  | React, <CSS/Tailwind>                 |
| Backend   | Node.js, Express.js                   |
| Database  | MongoDB (Mongoose)                    |
| AI        | OpenAI API (structured JSON output)   |
| Auth      | <JWT / none>                          |

## Architecture
1. Client sends resume text + job description to `/api/analyze`.
2. Server builds a strict prompt and calls the OpenAI API.
3. Response is validated against a JSON schema (with retry on malformed output).
4. Result is stored in MongoDB and returned to the client.

## Engineering notes
- **Reliable structured output:** enforced a strict prompt schema + server-side
  JSON validation + automatic retry to handle malformed LLM responses.
- **Cost control:** <e.g., truncate resume text to N tokens before sending>.

## Getting Started
```bash
git clone https://github.com/harrsha9999/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
cp .env.example .env
npm run dev
```

### Environment variables
```
OPENAI_API_KEY=
MONGODB_URI=
PORT=5000
```

## API
| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| POST   | /api/analyze    | Analyze resume vs. job desc  |
| GET    | /api/history    | Get past analyses            |

## Roadmap
- [ ] Support multiple file formats
- [ ] Role-specific scoring templates
- [ ] Export report as PDF

## Author
**Harsha Vardhan G** — [LinkedIn](https://linkedin.com/in/haarsha9999) · [GitHub](https://github.com/harrsha9999)
