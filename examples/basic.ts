import { runEval, loadDataset } from "../src/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const dataset = await loadDataset(path.join(root, "../fixtures/golden.json"));

  // Stand-in agent — swap for your real runtime.
  const agent = async (input: string) => {
    if (input.includes("refund")) {
      return {
        output: "Refunds are available within 30 days of purchase.",
        toolsCalled: ["knowledge_base"],
      };
    }
    return { output: "Hi! How can I help?" };
  };

  const report = await runEval(agent, dataset);
  console.log(`passRate=${report.passRate} passed=${report.passed}/${report.total}`);
  for (const r of report.results) {
    console.log(r.caseId, r.pass ? "PASS" : "FAIL", r.scores);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
