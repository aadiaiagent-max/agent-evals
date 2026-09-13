import { readFile } from "node:fs/promises";
import type { EvalCase } from "../types.js";

export async function loadDataset(path: string): Promise<EvalCase[]> {
  const raw = await readFile(path, "utf8");
  const data = JSON.parse(raw) as EvalCase[];
  if (!Array.isArray(data)) throw new Error("dataset must be an array");
  return data;
}
