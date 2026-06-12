import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize, extractKeywords, analyzeResume } from "../src/services/analyzer.js";

test("tokenize drops stopwords and short tokens", () => {
  const toks = tokenize("We are looking for a Node.js and React developer");
  assert.ok(toks.includes("node.js"));
  assert.ok(toks.includes("react"));
  assert.ok(!toks.includes("are"));
  assert.ok(!toks.includes("a"));
});

test("extractKeywords returns frequency-ranked unique terms", () => {
  const kws = extractKeywords("react react node python", 10);
  assert.equal(kws[0], "react"); // most frequent first
  assert.ok(kws.includes("node"));
  assert.equal(new Set(kws).size, kws.length); // unique
});

test("analyzeResume scores 100 when all keywords present", () => {
  const jd = "React Node MongoDB";
  const resume = "Built apps with React, Node and MongoDB";
  const r = analyzeResume(resume, jd);
  assert.equal(r.score, 100);
  assert.deepEqual(r.missingKeywords, []);
});

test("analyzeResume detects missing keywords and scores partially", () => {
  const jd = "React Node MongoDB Kubernetes";
  const resume = "Built apps with React and Node";
  const r = analyzeResume(resume, jd);
  assert.ok(r.score < 100 && r.score > 0);
  assert.ok(r.missingKeywords.includes("kubernetes"));
  assert.ok(r.matchedKeywords.includes("react"));
});

test("analyzeResume suggests quantifying when no numbers present", () => {
  const r = analyzeResume("React Node developer", "React Node");
  assert.ok(r.suggestions.some((s) => /quantify/i.test(s)));
});

test("analyzeResume returns stable serializable shape", () => {
  const r = analyzeResume("React", "React");
  assert.deepEqual(Object.keys(r).sort(), [
    "engine", "matchedKeywords", "missingKeywords", "score", "suggestions",
  ]);
  assert.equal(r.engine, "heuristic");
});
