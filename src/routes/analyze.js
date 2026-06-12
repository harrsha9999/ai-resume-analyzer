import { Router } from "express";
import { analyzeResume } from "../services/analyzer.js";

export function analyzeRouter() {
  const router = Router();

  // POST /api/analyze  body: { resume, jobDescription }
  router.post("/", (req, res) => {
    const { resume, jobDescription } = req.body || {};
    if (!resume || !jobDescription) {
      return res
        .status(400)
        .json({ error: "Both 'resume' and 'jobDescription' are required." });
    }
    if (resume.length > 50000 || jobDescription.length > 20000) {
      return res.status(413).json({ error: "Input too large." });
    }

    const result = analyzeResume(resume, jobDescription);
    res.json(result);
  });

  return router;
}
