import test from "node:test";
import assert from "node:assert/strict";

import { isSameOriginRequest } from "../lib/csrf.js";
import { createRateLimiter } from "../lib/rateLimit.js";

test("admin mutations only accept requests from the current site origin", () => {
  const sameOrigin = new Request("https://club.example/api/admin/content", {
    method: "PUT",
    headers: { origin: "https://club.example" },
  });
  const foreignOrigin = new Request("https://club.example/api/admin/content", {
    method: "PUT",
    headers: { origin: "https://attacker.example" },
  });
  assert.equal(isSameOriginRequest(sameOrigin), true);
  assert.equal(isSameOriginRequest(foreignOrigin), false);
  assert.equal(isSameOriginRequest(new Request("https://club.example/api/admin/content", { method: "PUT" })), false);
});

test("rate limiter blocks over-limit requests without retaining unlimited history", () => {
  const limited = createRateLimiter({ limit: 2, windowMs: 60_000, maxKeys: 2 });
  assert.equal(limited("first"), false);
  assert.equal(limited("first"), false);
  assert.equal(limited("first"), true);
  assert.equal(limited("second"), false);
  assert.equal(limited("third"), true);
});
