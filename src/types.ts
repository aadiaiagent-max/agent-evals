export interface EvalCase {
  id: string;
  input: string;
  /** Expected substrings / facts the answer should contain. */
  mustInclude?: string[];
  /** Forbidden substrings (e.g. leaked system prompt). */
  mustNotInclude?: string[];
  /** Optional expected tool names, in order. */
  expectedTools?: string[];
}

export interface AgentTrace {
  output: string;
  toolsCalled?: string[];
}

export interface Score {
  name: string;
  pass: boolean;
  detail?: string;
}

export interface CaseResult {
  caseId: string;
  scores: Score[];
  pass: boolean;
}

export interface EvalReport {
  passed: number;
  failed: number;
  total: number;
  passRate: number;
  results: CaseResult[];
}

export type AgentUnderTest = (input: string) => Promise<AgentTrace> | AgentTrace;
