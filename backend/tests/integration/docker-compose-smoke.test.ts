import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

export async function run() {
  if (process.env.RUN_DOCKER_SMOKE === "true") {
    const output = execFileSync("docker", ["compose", "ps"], {
      encoding: "utf8"
    });

    assert.match(output, /backend/i);
    assert.match(output, /postgres/i);
  }
}
