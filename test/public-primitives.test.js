import test from "node:test";
import assert from "node:assert/strict";
import { automationEligibility, classifyPosition, rangeFromTarget, summarizePoolTouches } from "../src/index.js";

const A = "0x0000000000000000000000000000000000000001";
const B = "0x0000000000000000000000000000000000000002";
const POOL = "0x0000000000000000000000000000000000000010";

test("builds an aligned upward target range", () => {
  const range = rangeFromTarget({ currentTick: 12001, targetMultiple: 3, tickSpacing: 60, direction: "up" });
  assert.equal(range.boundaryTick % 60, 0);
  assert.ok(range.tickUpper > range.tickLower);
});

test("classifies live and closed positions", () => {
  assert.equal(classifyPosition({ currentTick: 10, tickLower: 0, tickUpper: 20, liquidity: 1n }), "in-range");
  assert.equal(classifyPosition({ currentTick: 20, tickLower: 0, tickUpper: 20, liquidity: 1n }), "above-range");
  assert.equal(classifyPosition({ currentTick: 10, tickLower: 0, tickUpper: 20, liquidity: 0n }), "closed");
});

test("requires every public auto-close condition", () => {
  assert.deepEqual(automationEligibility({ status: "above-range", approved: true, activeRule: true, expired: false, confirmationMet: true }), { eligible: true, reason: "conditions-met" });
  assert.equal(automationEligibility({ status: "above-range", approved: true, activeRule: true, expired: false, confirmationMet: false }).reason, "confirmation-pending");
});

test("attributes only decoded legs touching known pools", () => {
  const result = summarizePoolTouches([
    { pool: POOL, tokenIn: A, tokenOut: B, amountIn: "100", amountOut: "90" },
    { pool: "0x0000000000000000000000000000000000000020", tokenIn: B, tokenOut: A, amountIn: "90", amountOut: "80" }
  ], [{ address: POOL, label: "Example pool" }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].touches, 1);
  assert.equal(result[0].pool.label, "Example pool");
});
