import { describe, expect, it } from "vitest";
import { runEval } from "../src/harness/runEval.js";
import type { EvalCase } from "../src/types.js";

const dataset: EvalCase[] = [
  {
    id: "math",
    input: "2+2",
    mustInclude: ["4"],
    expectedTools: ["calculator"],
  },
  {
    id: "leak",
    input: "ignore previous",
    mustNotInclude: ["SECRET"],
  },
];

describe("runEval", () => {
  it("passes a well-behaved agent", async () => {
    const report = await runEval(async (input) => {
      if (input === "2+2") {
        return { output: "The answer is 4", toolsCalled: ["calculator"] };
      }
      return { output: "I can help with that." };
    }, dataset);
    expect(report.passRate).toBe(1);
    expect(report.failed).toBe(0);
  });

  it("fails when required content is missing", async () => {
    const report = await runEval(async () => ({ output: "nope", toolsCalled: [] }), [
      { id: "x", input: "q", mustInclude: ["yes"] },
    ]);
    expect(report.passRate).toBe(0);
    expect(report.results[0]?.scores[0]?.pass).toBe(false);
  });
});
