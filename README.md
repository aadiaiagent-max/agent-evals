# agent-evals

A **golden-path evaluation harness** for agents: datasets, scorers, and a pass-rate report.

Portfolio project for **AI Engineers** who treat agent quality as a product surface — not a vibe check.

## Why this exists

Shipping agents without evals is guessing. This harness makes a minimal contract:

1. Load cases (`mustInclude` / `mustNotInclude` / `expectedTools`)
2. Run an agent under test
3. Score traces
4. Emit pass rate

No vendor lock-in; works with any function that returns `{ output, toolsCalled? }`.

## Quickstart

```bash
npm install
npm test
npm run example
```

```ts
import { runEval } from "@aadiaiagent/agent-evals";

const report = await runEval(
  async (input) => ({ output: `echo:${input}`, toolsCalled: [] }),
  [{ id: "1", input: "hi", mustInclude: ["echo"] }],
);
console.log(report.passRate);
```

## Scorers

- `must_include` — required phrases present
- `must_not_include` — leak / toxicity guards
- `tool_order` — exact tool sequence (optional)

## Layout

```
src/harness/   runEval
src/scorers/   include / exclude / tool order
src/datasets/  JSON loader
fixtures/      sample golden set
```

## Roadmap

- [ ] LLM-as-judge scorer adapter
- [ ] Latency + cost budgets
- [ ] CI gate helper (fail if passRate < threshold)
- [ ] Trace export (OpenTelemetry)

## License

MIT
