import assert from "node:assert/strict";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";

export async function run() {
  (prisma as any).$queryRaw = async () => [{ "?column?": 1 }];

  const response = await request(createApp()).get("/api/health").expect(200);

  assert.deepEqual(response.body, {
    success: true,
    message: "Service is ready",
    data: {}
  });
}
