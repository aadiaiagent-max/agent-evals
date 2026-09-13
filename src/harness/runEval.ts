import { defaultScorers } from "../scorers/scorers.js";
import type {
  AgentUnderTest,
  CaseResult,
  EvalCase,
  EvalReport,
  Score,
} from "../types.js";

export type Scorer = (c: EvalCase, trace: Awaited<ReturnType<AgentUnderTest>>) => Score;

export async function runEval(
  agent: AgentUnderTest,
  dataset: EvalCase[],
  scorers: Scorer[] = defaultScorers,
): Promise<EvalReport> {
  const results: CaseResult[] = [];
  for (const c of dataset) {
    const trace = await agent(c.input);
    const scores = scorers.map((s) => s(c, trace));
    results.push({
      caseId: c.id,
      scores,
      pass: scores.every((s) => s.pass),
    });
  }
  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  return {
    passed,
    failed: total - passed,
    total,
    passRate: total === 0 ? 0 : passed / total,
    results,
  };
}
