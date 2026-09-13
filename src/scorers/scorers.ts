import type { AgentTrace, EvalCase, Score } from "../types.js";

export function scoreIncludes(c: EvalCase, trace: AgentTrace): Score {
  const missing = (c.mustInclude ?? []).filter(
    (s) => !trace.output.toLowerCase().includes(s.toLowerCase()),
  );
  return {
    name: "must_include",
    pass: missing.length === 0,
    detail: missing.length ? `missing: ${missing.join(", ")}` : undefined,
  };
}

export function scoreExcludes(c: EvalCase, trace: AgentTrace): Score {
  const hit = (c.mustNotInclude ?? []).filter((s) =>
    trace.output.toLowerCase().includes(s.toLowerCase()),
  );
  return {
    name: "must_not_include",
    pass: hit.length === 0,
    detail: hit.length ? `found: ${hit.join(", ")}` : undefined,
  };
}

export function scoreToolOrder(c: EvalCase, trace: AgentTrace): Score {
  const expected = c.expectedTools ?? [];
  if (expected.length === 0) {
    return { name: "tool_order", pass: true, detail: "skipped" };
  }
  const actual = trace.toolsCalled ?? [];
  const pass =
    expected.length === actual.length &&
    expected.every((t, i) => t === actual[i]);
  return {
    name: "tool_order",
    pass,
    detail: pass ? undefined : `expected [${expected}] got [${actual}]`,
  };
}

export const defaultScorers = [scoreIncludes, scoreExcludes, scoreToolOrder];
